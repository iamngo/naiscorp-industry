import { NextResponse } from 'next/server';
import { getInvestorDeals } from '@/lib/mockStore';

export async function GET() {
  try {
    const deals = await getInvestorDeals();
    return NextResponse.json({ data: deals });
  } catch (error) {
    console.error('[API] get investor deals failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

