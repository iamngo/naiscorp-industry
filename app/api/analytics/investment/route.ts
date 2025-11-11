import { NextRequest, NextResponse } from 'next/server';
import { addAdminLog } from '@/lib/mockStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();

    await addAdminLog({
      id: `log-${Date.now()}`,
      adminId: 'system-analytics',
      action: 'investment_portal_event',
      entityType: 'investment_portal',
      entityId: body?.planId ?? 'session',
      details: {
        ...body,
        source: 'investment_portal',
      },
      createdAt: timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] investment analytics log failed', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

