import { NextResponse } from 'next/server';
import { getContentQueue } from '@/lib/mockStore';

export async function GET() {
  try {
    const items = await getContentQueue();
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('[API] get content queue failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

