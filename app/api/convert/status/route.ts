import { NextRequest, NextResponse } from 'next/server';
import { checkStatus } from '@/lib/bsc';

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId') || request.nextUrl.searchParams.get('uuid');

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 });
  }

  try {
    const status = await checkStatus(jobId);
    return NextResponse.json(status);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Status check failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
