import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiResponse } from '@/lib/auth';

export async function POST() {
  (await cookies()).delete('token');
  return apiResponse({ message: 'Logged out' });
}
