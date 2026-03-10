
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { title: 'asc' }
    });
    console.log('[API SERVICES] Returning:', services.length, 'records.');
    return successResponse({ services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return errorResponse('Internal server error', 500);
  }
}
