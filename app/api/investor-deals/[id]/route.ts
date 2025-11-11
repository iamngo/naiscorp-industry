import { NextRequest, NextResponse } from 'next/server';
import { updateInvestorDeal } from '@/lib/mockStore';

type InvestorDealContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: InvestorDealContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateInvestorDeal(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Investor deal not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[API] update investor deal failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

