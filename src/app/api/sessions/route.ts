/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validateBody, requireAuth } from '@/lib/api';
import { CreateSessionSchema } from '@/lib/validations';
import { SessionStatus, ServiceType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status') as SessionStatus | null;
    const typeParam = searchParams.get('type') as ServiceType | null;
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const where: any = {};

    // Defaults to OPEN if not specified.
    if (statusParam) {
      where.status = statusParam;
    } else {
      where.status = SessionStatus.OPEN;
    }

    if (typeParam) {
      where.service = { type: typeParam };
    }

    if (fromParam || toParam) {
      where.startTime = {};
      if (fromParam) where.startTime.gte = new Date(fromParam);
      if (toParam) where.startTime.lte = new Date(toParam);
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        service: true,
      },
      orderBy: { startTime: 'asc' },
    });

    // Compute spotsLeft
    const formattedSessions = sessions.map(session => ({
      ...session,
      spotsLeft: session.capacity - session.bookedCount,
    }));

    return successResponse({ sessions: formattedSessions });
  } catch (error: any) {
    console.error('GET /api/sessions error:', error);
    return errorResponse('Failed to fetch sessions', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Instructor-only
    await requireAuth();

    // 2. Validate Body
    const parsed = await validateBody(request, CreateSessionSchema);
    if ('error' in parsed) return parsed.error;
    
    // 3. Check service exists
    const service = await prisma.service.findUnique({
      where: { id: parsed.data.serviceId }
    });
    
    if (!service) {
      return errorResponse('Service not found', 404);
    }

    // Capacity must be 1 for ONE_ON_ONE
    let resolvedCapacity = parsed.data.capacity;
    if (service.type === ServiceType.ONE_ON_ONE && resolvedCapacity !== 1) {
      resolvedCapacity = 1; // Enforce capacity limit natively
    }

    // 4. Create Session
    const session = await prisma.session.create({
      data: {
        serviceId: parsed.data.serviceId,
        title: parsed.data.title || service.title,
        startTime: new Date(parsed.data.startTime),
        endTime: new Date(parsed.data.endTime),
        capacity: resolvedCapacity,
        location: parsed.data.location,
        notes: parsed.data.notes,
        status: SessionStatus.OPEN
      },
      include: { service: true }
    });

    return successResponse({ session }, 201);
  } catch (error: any) {
    // Passed thrown 401s bubble up
    if (error instanceof Response) return error;
    
    console.error('POST /api/sessions error:', error);
    return errorResponse('Failed to create session', 500);
  }
}
