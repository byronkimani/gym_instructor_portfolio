/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validateBody } from '@/lib/api';
import { ContactFormSchema } from '@/lib/validations';
import { sendContactFormEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/clientIp';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfter } = rateLimit(`contact_${ip}`);
    
    if (!allowed) {
      return errorResponse(`Too many requests. Try again in ${retryAfter} seconds.`, 429);
    }

    // Validation
    const parsed = await validateBody(request, ContactFormSchema);
    if ('error' in parsed) return parsed.error;

    // Trigger Email to Instructor
    try {
      // Find instrument to notify
      const instructor = await prisma.instructor.findFirst();
      if (instructor) {
        await sendContactFormEmail(instructor.email, parsed.data);
      }
    } catch (emailErr) {
      console.error("Non-fatal: Failed to send contact form email", emailErr);
    }

    return successResponse({
      message: "Thanks for reaching out! We'll get back to you soon."
    }, 201);
  } catch (error: any) {
    console.error('POST /api/contact error:', error);
    return errorResponse('Failed to submit contact form', 500);
  }
}
