import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    success: true,
    message: 'Test API endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ 
    success: true,
    message: 'Test POST endpoint is working'
  });
}
