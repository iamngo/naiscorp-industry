import { NextResponse } from 'next/server';
import { getBuyerLeads } from '@/lib/mockStore';

export async function GET() {
  try {
    const leads = await getBuyerLeads();
    return NextResponse.json({ data: leads });
  } catch (error) {
    console.error('[API] get buyer leads failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

