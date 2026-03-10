import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api';
import { BookingStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    // To prevent full N+1 scanning, we first GroupBy the client emails.
    // LLD Step 2.2 defines the derived Clients model behavior.
    
    // 1. Group bookings by email to get aggregate stats
    const groupedBookings = await prisma.booking.groupBy({
      by: ['clientEmail'],
      _count: {
        _all: true,
      },
      _min: {
        createdAt: true,
      }
    });

    // 2. We need the actual names and phones, which groupBy doesn't provide directly if we group strictly by email.
    // So we fetch the latest booking for each email to extract the canonical profile data.
    const clientProfilesArr = await Promise.all(
      groupedBookings.map(async (group: any) => {
        // Fetch the most recent booking to grab the latest name/phone
        const latestBooking = await prisma.booking.findFirst({
          where: { clientEmail: group.clientEmail },
          orderBy: { createdAt: 'desc' },
          select: { clientName: true, clientPhone: true }
        });
        
        // Count confirmed specifically
        const confirmedCount = await prisma.booking.count({
          where: { 
            clientEmail: group.clientEmail,
            status: BookingStatus.CONFIRMED 
          }
        });

        return {
          name: latestBooking?.clientName || 'Unknown',
          email: group.clientEmail,
          phone: latestBooking?.clientPhone || null,
          totalBookings: group._count._all,
          confirmedBookings: confirmedCount,
          firstBookingDate: group._min.createdAt
        };
      })
    );

    // Sort by most bookings descending
    clientProfilesArr.sort((a: any, b: any) => b.totalBookings - a.totalBookings);

    return successResponse({ clients: clientProfilesArr });

  } catch (error: any) {
    if (error instanceof Response) return error;
    console.error('GET /api/clients error:', error);
    return errorResponse('Failed to fetch clients', 500);
  }
}
