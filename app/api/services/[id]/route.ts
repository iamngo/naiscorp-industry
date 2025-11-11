import { NextRequest, NextResponse } from 'next/server';
import {
  deleteService,
  getService,
  updateService,
} from '@/lib/mockStore';

type ServiceRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: ServiceRouteContext,
) {
  try {
    const { id } = await context.params;
    const service = await getService(id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: ServiceRouteContext,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const service = await getService(id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    const updatedService = await updateService(id, {
      ...body,
      priceRange: body.priceRange || service.priceRange,
      izIds: Array.isArray(body.izIds) ? body.izIds : service.izIds,
      clusterIds: Array.isArray(body.clusterIds) ? body.clusterIds : service.clusterIds,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: updatedService,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: ServiceRouteContext,
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteService(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

