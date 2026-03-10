import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { auth } from './auth';
import type { Session } from 'next-auth';

// Standardised API response helpers
export function successResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

// Validate request body against a Zod schema
// Returns { data } on success or { error: NextResponse } on failure
export async function validateBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return { 
        error: NextResponse.json(
          { error: 'Invalid payload', details: result.error.format() },
          { status: 400 }
        ) 
      };
    }
    
    return { data: result.data };
  } catch {
    return { error: errorResponse('Invalid JSON format', 400) };
  }
}

// Assert the request has a valid instructor session
// Returns { session } or throws a 401 NextResponse
export async function requireAuth(): Promise<{ session: Session }> {
  const session = await auth();
  
  if (!session?.user) {
    // We throw the response so it can be caught or we can just return it.
    // The prompt says "throws a 401 NextResponse"
    throw errorResponse('Unauthorized', 401);
  }
  
  return { session };
}
