import { NextRequest, NextResponse } from 'next/server';
import { getInvestmentPlans, updateInvestmentPlan } from '@/lib/mockStore';

type InvestmentPlanContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: InvestmentPlanContext) {
  try {
    const { id } = await context.params;
    const plans = await getInvestmentPlans();
    const plan = plans.find((item) => item.id === id);
    if (!plan) {
      return NextResponse.json({ error: 'Investment plan not found' }, { status: 404 });
    }
    return NextResponse.json({ data: plan });
  } catch (error) {
    console.error('[API] get investment plan failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: InvestmentPlanContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateInvestmentPlan(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return NextResponse.json({ error: 'Investment plan not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[API] update investment plan failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

