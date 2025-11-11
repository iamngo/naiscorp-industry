import { NextRequest, NextResponse } from 'next/server';
import { addInvestmentPlan, getInvestmentPlans } from '@/lib/mockStore';
import type { InvestmentPlan } from '@/types/database';

export async function GET() {
  try {
    const plans = await getInvestmentPlans();
    return NextResponse.json({ data: plans });
  } catch (error) {
    console.error('[API] get investment plans failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nowISO = new Date().toISOString();

    const newPlan: InvestmentPlan = {
      id: `plan-${Date.now()}`,
      investorId: body.investorId ?? 'investor-anonymous',
      budget: Number(body.budget) || 0,
      investmentType: body.investmentType ?? 'new',
      preferredIndustries: Array.isArray(body.preferredIndustries) ? body.preferredIndustries : [],
      preferredLocations: Array.isArray(body.preferredLocations) ? body.preferredLocations : [],
      chatbotResponses: Array.isArray(body.chatbotResponses) ? body.chatbotResponses : undefined,
      recommendations: {
        izIds: Array.isArray(body.recommendations?.izIds) ? body.recommendations.izIds : [],
        supplierIds: Array.isArray(body.recommendations?.supplierIds) ? body.recommendations.supplierIds : [],
        rationale: body.recommendations?.rationale ?? '',
      },
      planDocument: body.planDocument,
      status: body.status ?? 'submitted',
      advisorId: body.advisorId,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const saved = await addInvestmentPlan(newPlan);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('[API] create investment plan failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

