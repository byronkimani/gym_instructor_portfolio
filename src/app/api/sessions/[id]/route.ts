import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, requireAuth } from '@/lib/api';
import { SessionStatus, BookingStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    
    const { id: sessionId } = await params;
    const body = await request.json();

    const allowedFields = ['title', 'startTime', 'endTime', 'location', 'notes', 'capacity'];
    const updateData: Record<string, unknown> = {};
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
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(`PATCH /api/sessions/[id] error:`, error);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    
    const { id: sessionId } = await params;

    const session = await prisma.session.findUnique({ where: { id: sessionId }});
    if (!session) return errorResponse('Session not found', 404);

    await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: { status: SessionStatus.CANCELLED }
      }),
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

    return successResponse({ message: 'Session cancelled successfully' });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(`DELETE /api/sessions/[id] error:`, error);
    return errorResponse('Internal server error', 500);
  }
}
