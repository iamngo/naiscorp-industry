import { NextResponse } from 'next/server';
import { getAdminLogs } from '@/lib/mockStore';

export async function GET() {
  try {
    const logs = await getAdminLogs();
    return NextResponse.json({
      success: true,
      data: logs.slice(-50).reverse(),
    });
  } catch (error) {
    console.error('[API] admin logs fetch failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

