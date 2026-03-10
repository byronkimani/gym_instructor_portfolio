/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { bookingStatusPatchSchema } from '@/lib/validations/booking';
import { SessionStatus, BookingStatus, Prisma } from '@prisma/client';
import { 
  sendBookingConfirmedEmail, 
  sendBookingDeclinedEmail, 
  sendBookingCancelledEmail 
} from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const body = await request.json();
    
    // Validate request body
    const result = bookingStatusPatchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 }
      );
    }

    const { status: newStatus, statusNote } = result.data;

    // Fetch existing booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        session: {
          include: { service: true }
        }
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const currentStatus = booking.status;

    // Prevent meaningless updates
    if (currentStatus === newStatus) {
      return NextResponse.json(booking);
    }

    // Define valid transitions (PENDING -> CONFIRMED/DECLINED/CANCELLED, CONFIRMED -> CANCELLED)
    const isValidTransition = 
      (currentStatus === BookingStatus.PENDING && newStatus === BookingStatus.CONFIRMED) ||
      (currentStatus === BookingStatus.PENDING && newStatus === BookingStatus.DECLINED) ||
      (currentStatus === BookingStatus.CONFIRMED && newStatus === BookingStatus.CANCELLED) ||
      (currentStatus === BookingStatus.PENDING && newStatus === BookingStatus.CANCELLED);

    if (!isValidTransition) {
      return NextResponse.json(
        { error: `Invalid transition from ${currentStatus} to ${newStatus}` },
        { status: 400 }
      );
    }

    const sessionData = booking.session;

    // Additional checks for CONFIRMED validation
    if (newStatus === BookingStatus.CONFIRMED) {
      if (sessionData.status === SessionStatus.CANCELLED) {
        return NextResponse.json({ error: 'Cannot confirm booking for a cancelled session' }, { status: 400 });
      }
      if (sessionData.status === SessionStatus.FULL || sessionData.bookedCount >= sessionData.capacity) {
        return NextResponse.json({ error: 'Session is full' }, { status: 400 });
      }
    }

    // Execute state transition atomically
    const updatedBooking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      // Handle Session Count Side-Effects
      if (newStatus === BookingStatus.CONFIRMED) {
        const newCount = sessionData.bookedCount + 1;
        const newSessionStatus = newCount >= sessionData.capacity ? SessionStatus.FULL : sessionData.status;
        
        await tx.session.update({
          where: { id: sessionData.id },
          data: { 
            bookedCount: newCount,
            status: newSessionStatus 
          }
        });
      } else if (currentStatus === BookingStatus.CONFIRMED && newStatus === BookingStatus.CANCELLED) {
        // We only decrement booked count if the booking was previously CONFIRMED
        const newCount = Math.max(0, sessionData.bookedCount - 1); // Prevent negative count
        const newSessionStatus = sessionData.status === SessionStatus.FULL ? SessionStatus.OPEN : sessionData.status;

        await tx.session.update({
          where: { id: sessionData.id },
          data: {
            bookedCount: newCount,
            status: newSessionStatus
          }
        });
      }

      // Update the booking itself
      return await tx.booking.update({
        where: { id: bookingId },
        data: { 
          status: newStatus,
          statusNote: statusNote !== undefined ? statusNote : null
        },
        include: { 
           session: {
             include: { service: true }
           }
        }
      });
    });

    // Trigger Email Side-Effects (Non-blocking)
    try {
      if (newStatus === BookingStatus.CONFIRMED) {
        const instructor = await prisma.instructor.findFirst();
        if (instructor) {
          await sendBookingConfirmedEmail(instructor, updatedBooking, updatedBooking.session.service.priceNote);
        }
      } else if (newStatus === BookingStatus.DECLINED) {
        await sendBookingDeclinedEmail(updatedBooking);
      } else if (newStatus === BookingStatus.CANCELLED) {
        await sendBookingCancelledEmail(updatedBooking);
      }
    } catch (emailErr) {
       console.error("Non-fatal: Failed to send booking status email", emailErr);
    }

    return NextResponse.json(updatedBooking);

  } catch (error: any) {
    console.error('Booking state transition error:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating booking' },
      { status: 500 }
    );
  }
}
