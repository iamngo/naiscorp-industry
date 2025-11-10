import { NextRequest, NextResponse } from 'next/server';
import { getIZById } from '@/lib/mockData';

// GET /api/industrial-zones/[id] - Get IZ by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const iz = getIZById(params.id);

    if (!iz) {
      return NextResponse.json(
        { error: 'Industrial zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: iz });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/industrial-zones/[id] - Update IZ
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const iz = getIZById(params.id);

    if (!iz) {
      return NextResponse.json(
        { error: 'Industrial zone not found' },
        { status: 404 }
      );
    }

    // Mock update
    const updatedIZ = {
      ...iz,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updatedIZ });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/industrial-zones/[id] - Delete IZ
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const iz = getIZById(params.id);

    if (!iz) {
      return NextResponse.json(
        { error: 'Industrial zone not found' },
        { status: 404 }
      );
    }

    // Mock delete
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

