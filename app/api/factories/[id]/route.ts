import { NextRequest, NextResponse } from 'next/server';
import {
  deleteFactory,
  getFactory,
  updateFactory,
  addAdminLog,
} from '@/lib/mockStore';

type FactoryRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: FactoryRouteContext,
) {
  try {
    const { id } = await context.params;
    console.log('[API] get factory request', { id });
    const factory = await getFactory(id);
    
    if (!factory) {
      return NextResponse.json(
        { success: false, error: 'Factory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: factory,
    });
  } catch (error) {
    console.error('[API] update factory failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: FactoryRouteContext,
) {
  try {
    const { id } = await context.params;
    console.log('[API] update factory request', { id });
    const body = await request.json();
    const factory = await getFactory(id);
    
    if (!factory) {
      console.warn('[API] update factory not found', { id });
      return NextResponse.json(
        { success: false, error: 'Factory not found' },
        { status: 404 }
      );
    }

    const updatedFactory = await updateFactory(id, {
      ...body,
      latitude: body.latitude !== undefined
        ? (typeof body.latitude === 'number' ? body.latitude : parseFloat(body.latitude) || factory.latitude)
        : factory.latitude,
      longitude: body.longitude !== undefined
        ? (typeof body.longitude === 'number' ? body.longitude : parseFloat(body.longitude) || factory.longitude)
        : factory.longitude,
      updatedAt: new Date().toISOString(),
    });

    if (!updatedFactory) {
      console.error('[API] update factory returned undefined', { id });
      return NextResponse.json(
        { success: false, error: 'Unable to update factory' },
        { status: 500 },
      );
    }

    await addAdminLog({
      id: `log-${Date.now()}`,
      adminId: 'user-1',
      action: 'update_factory',
      entityType: 'factory',
      entityId: id,
      details: {
        updatedFields: Object.keys(body),
        previousVerification: factory.verificationStatus,
        newVerification: updatedFactory.verificationStatus,
        esgStatus: updatedFactory.esgStatus,
        digitalTransformation: updatedFactory.digitalTransformation,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updatedFactory,
    });
  } catch (error) {
    console.error('[API] delete factory failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: FactoryRouteContext,
) {
  try {
    const { id } = await context.params;
    console.log('[API] delete factory request', { id });
    const deleted = await deleteFactory(id);

    if (!deleted) {
      console.warn('[API] delete factory not found', { id });
      return NextResponse.json(
        { success: false, error: 'Factory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Factory deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
