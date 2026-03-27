import { NextRequest, NextResponse } from 'next/server';
import { checkStatus } from '@/lib/bsc';

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get('uuid');

  if (!uuid) {
    return NextResponse.json({ error: 'Missing uuid parameter' }, { status: 400 });
  }

  try {
    const state = await checkStatus(uuid);
    return NextResponse.json({ uuid, state });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Status check failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
