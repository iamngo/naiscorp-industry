import { NextRequest, NextResponse } from 'next/server';
import { updateBuyerLead } from '@/lib/mockStore';

type BuyerLeadContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: BuyerLeadContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateBuyerLead(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Buyer lead not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[API] update buyer lead failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

