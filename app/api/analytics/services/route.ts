import { NextRequest, NextResponse } from 'next/server';
import { addAdminLog } from '@/lib/mockStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();

    await addAdminLog({
      id: `log-${Date.now()}`,
      adminId: 'system-analytics',
      action: 'services_hub_event',
      entityType: 'services_hub',
      entityId: body?.serviceId ?? 'filter',
      details: {
        ...body,
        source: 'services_hub',
      },
      createdAt: timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] services analytics log failed', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

