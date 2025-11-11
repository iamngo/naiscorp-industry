import { NextRequest, NextResponse } from 'next/server';
import { addAdminLog } from '@/lib/mockStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();

    await addAdminLog({
      id: `log-${Date.now()}`,
      adminId: 'system-analytics',
      action: 'marketplace_search',
      entityType: 'search',
      entityId: body.q ? String(body.q).slice(0, 32) : 'search',
      details: {
        ...body,
        source: 'marketplace',
      },
      createdAt: timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] marketplace search log failed', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

