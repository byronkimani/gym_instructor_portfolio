import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validateBody, requireAuth } from '@/lib/api';
import { CreateBookingSchema } from '@/lib/validations';
import { SessionStatus, BookingStatus } from '@prisma/client';
import { sendBookingRequestClientEmail, sendBookingRequestInstructorEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status') as BookingStatus | null;
    const sessionIdParam = searchParams.get('sessionId');
    const clientEmailParam = searchParams.get('clientEmail');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: any = {};

    if (statusParam) where.status = statusParam;
    if (sessionIdParam) where.sessionId = sessionIdParam;
    if (clientEmailParam) where.clientEmail = clientEmailParam;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          session: {
            include: { service: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where })
    ]);

    return successResponse({
      bookings,
      total,
      page,
      limit,
    });
  } catch (error: any) {
    if (error instanceof Response) return error;
    console.error('GET /api/bookings error:', error);
    return errorResponse('Failed to fetch bookings', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { allowed, retryAfter } = rateLimit(ip);
    
    if (!allowed) {
      return errorResponse(`Too many booking requests. Try again in ${retryAfter} seconds.`, 429);
    }

    // Validation
    const parsed = await validateBody(request, CreateBookingSchema);
    if ('error' in parsed) return parsed.error;
    
    // Check session availability
    const session = await prisma.session.findUnique({
      where: { id: parsed.data.sessionId },
      include: { service: true }
    });
    
    if (!session) return errorResponse('Session not found', 404);
    if (session.status !== SessionStatus.OPEN) return errorResponse('This session is no longer available.', 400);
    if (session.bookedCount >= session.capacity) return errorResponse('This session is full.', 400);

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        sessionId: parsed.data.sessionId,
        clientName: parsed.data.clientName,
        clientEmail: parsed.data.clientEmail,
        clientPhone: parsed.data.clientPhone,
        notes: parsed.data.notes,
        status: BookingStatus.PENDING
      },
      include: {
        session: { include: { service: true } }
      }
    });

    // Email Triggers
    try {
      // Find the instructor to notify (since this is single-tenant MVP, grab the first instructor)
      const instructor = await prisma.instructor.findFirst();
      if (instructor) {
        await Promise.all([
          sendBookingRequestClientEmail(booking),
          sendBookingRequestInstructorEmail(instructor.email, booking)
        ]);
      }
    } catch (emailErr) {
      console.error("Non-fatal: Failed to send booking request emails", emailErr);
    }

    return successResponse({
      booking,
      message: "Booking request submitted. You will receive a confirmation email once approved."
    }, 201);
  } catch (error: any) {
    console.error('POST /api/bookings error:', error);
    return errorResponse('Failed to submit booking', 500);
  }
}
