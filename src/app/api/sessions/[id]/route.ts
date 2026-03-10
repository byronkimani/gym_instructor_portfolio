import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api';
import { SessionStatus, BookingStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { service: true }
    });

    if (!session) {
      return errorResponse('Session not found', 404);
    }

    return successResponse({ 
      session: {
        ...session,
        spotsLeft: session.capacity - session.bookedCount
      } 
    });
  } catch (error) {
    console.error(`GET /api/sessions/[id] error:`, error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const sessionId = params.id;
    const body = await request.json();

    // Partial Update (omitting extensive Zod schema here since only specific fields are mutable safely)
    const allowedFields = ['title', 'startTime', 'endTime', 'location', 'notes', 'capacity'];
    const updateData: any = {};
    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        if (key === 'startTime' || key === 'endTime') {
          updateData[key] = new Date(body[key]);
        } else {
          updateData[key] = body[key];
        }
      }
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    });

    // Automatically toggle OPEN/FULL if capacity was changed
    if (body.capacity !== undefined) {
       const finalStatus = updatedSession.bookedCount >= updatedSession.capacity 
            ? SessionStatus.FULL 
            : SessionStatus.OPEN;
       
       if (finalStatus !== updatedSession.status) {
         await prisma.session.update({
           where: { id: sessionId },
           data: { status: finalStatus }
         });
       }
    }

    return successResponse({ session: updatedSession });
  } catch (error: any) {
    if (error instanceof Response) return error;
    console.error(`PATCH /api/sessions/[id] error:`, error);
    return errorResponse('Internal server error', 500);
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const sessionId = params.id;

    const session = await prisma.session.findUnique({ where: { id: sessionId }});
    if (!session) return errorResponse('Session not found', 404);

    await prisma.$transaction([
      // Cancel the session
      prisma.session.update({
        where: { id: sessionId },
        data: { status: SessionStatus.CANCELLED }
      }),
      // Decline any unconfirmed bookings automatically across the board to prevent orphaned state
      prisma.booking.updateMany({
        where: { 
          sessionId, 
          status: BookingStatus.PENDING 
        },
        data: { 
          status: BookingStatus.DECLINED, 
          statusNote: 'Session has been cancelled by the instructor.' 
        }
      })
    ]);

    // Side effect: Instructor should use individual booking status callbacks if they wish to email clients a cancellation,
    // or we'd ideally fan out emails here.

    return successResponse({ message: 'Session cancelled successfully' });
  } catch (error: any) {
    if (error instanceof Response) return error;
    console.error(`DELETE /api/sessions/[id] error:`, error);
    return errorResponse('Internal server error', 500);
  }
}
