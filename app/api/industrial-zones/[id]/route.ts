import { NextRequest, NextResponse } from 'next/server';
import {
  getIndustrialZone,
  updateIndustrialZone,
  deleteIndustrialZone,
  addAdminLog,
} from '@/lib/mockStore';

type IndustrialZoneRouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/industrial-zones/[id] - Get IZ by ID
export async function GET(
  request: NextRequest,
  context: IndustrialZoneRouteContext,
) {
  try {
    const { id } = await context.params;
    const iz = await getIndustrialZone(id);

    if (!iz) {
      return NextResponse.json(
        { error: 'Industrial zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: iz });
  } catch (error) {
    console.error('[API] get industrial zone failed', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/industrial-zones/[id] - Update IZ
export async function PUT(
  request: NextRequest,
  context: IndustrialZoneRouteContext,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const iz = await getIndustrialZone(id);

    if (!iz) {
      return NextResponse.json(
        { error: 'Industrial zone not found' },
        { status: 404 }
      );
    }

    const updated = await updateIndustrialZone(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      console.error('[API] update industrial zone returned undefined', { id });
      return NextResponse.json(
        { error: 'Unable to update industrial zone' },
        { status: 500 },
      );
    }

    await addAdminLog({
      id: `log-${Date.now()}`,
      adminId: 'user-1',
      action: 'update_industrial_zone',
      entityType: 'industrial_zone',
      entityId: id,
      details: {
        updatedFields: Object.keys(body),
        previousVerification: iz.verificationStatus,
        newVerification: updated.verificationStatus,
        esgStatus: updated.esgStatus,
        digitalTransformation: updated.digitalTransformation,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[API] update industrial zone failed', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/industrial-zones/[id] - Delete IZ
export async function DELETE(
  request: NextRequest,
  context: IndustrialZoneRouteContext,
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteIndustrialZone(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Industrial zone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] delete industrial zone failed', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

