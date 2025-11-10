import { NextRequest, NextResponse } from 'next/server';

// Mock connection requests storage (in real app, use database)
let mockConnectionRequests: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let requests = [...mockConnectionRequests];

    // Filter by userId
    if (userId) {
      requests = requests.filter(
        r => r.fromUserId === userId || r.toUserId === userId
      );
    }

    // Filter by status
    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new connection request (mock)
    const newRequest = {
      id: `conn-${Date.now()}`,
      fromUserId: 'user-current', // Mock current user
      fromRole: 'investor' as const, // Mock role
      toUserId: body.toUserId,
      toRole: body.toRole,
      message: body.message || '',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In real app, save to database
    mockConnectionRequests.push(newRequest);

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: 'Connection request sent successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
