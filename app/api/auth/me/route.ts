import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/roleMiddleware';
import { apiResponse, apiError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    return apiResponse(user);
  } catch (error: any) {
    return apiError(error.message || 'Unauthorized', 401);
  }
}
