import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api';
import { BookingStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    await requireAuth();
    
    // Decode email from URL param
    const clientEmail = decodeURIComponent(params.email);

    // Get all bookings for this email
    const bookings = await prisma.booking.findMany({
      where: { clientEmail },
      include: {
        session: {
          include: { service: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (bookings.length === 0) {
      return errorResponse('Client not found', 404);
    }

    // Derive the profile from the most recent booking
    const latestBooking = bookings[0];
    
    const clientProfile = {
      name: latestBooking.clientName,
      email: clientEmail,
      phone: latestBooking.clientPhone,
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter((b: any) => b.status === BookingStatus.CONFIRMED).length,
      firstBookingDate: bookings[bookings.length - 1].createdAt,
    };

    return successResponse({ 
      client: clientProfile,
      bookings
    });

  } catch (error: any) {
    if (error instanceof Response) return error;
    console.error('GET /api/clients/[email] error:', error);
    return errorResponse('Failed to fetch client profile', 500);
  }
}
