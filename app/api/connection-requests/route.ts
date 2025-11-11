import { NextRequest, NextResponse } from 'next/server';
import {
  addConnectionRequest,
  getAllConnectionRequests,
  updateConnectionRequest,
} from '@/lib/mockStore';
import type { ConnectionRequest } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const requests = await getAllConnectionRequests();
    let filtered = [...requests];

    // Filter by userId
    if (userId) {
      filtered = filtered.filter(
        r => r.fromUserId === userId || r.toUserId === userId
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const nowISO = new Date().toISOString();

    const newRequest: ConnectionRequest = {
      id: `conn-${Date.now()}`,
      fromUserId: body.fromUserId || 'user-current',
      fromRole: body.fromRole || 'investor',
      toUserId: body.toUserId,
      toRole: body.toRole,
      message: body.message || '',
      status: 'pending',
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const created = await addConnectionRequest(newRequest);

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Connection request sent successfully',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body ?? {};

    if (!id || !status || !['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 },
      );
    }

    const updated = await updateConnectionRequest(id, {
      status,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Connection request not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Connection request updated',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
