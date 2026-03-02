import { NextResponse } from 'next/server';
import { getXThreads } from '@/lib/xthreads';

export async function GET() {
  try {
    const threads = getXThreads();
    return NextResponse.json({ threads });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ threads: [] }, { status: 500 });
  }
}
