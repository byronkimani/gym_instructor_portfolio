/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id: bookingId } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        session: {
          include: { service: true }
        }
      }
    });

    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    return successResponse({ booking });
  } catch (error: any) {
    if (error instanceof Response) return error;
    console.error(`GET /api/bookings/[id] error:`, error);
    return errorResponse('Internal server error', 500);
  }
}
