import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    });
    return successResponse({ services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return errorResponse('Internal server error', 500);
  }
}
