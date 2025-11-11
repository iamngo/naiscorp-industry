import { NextRequest, NextResponse } from 'next/server';
import { getSupplier } from '@/lib/mockStore';

type SupplierRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: SupplierRouteContext,
) {
  try {
    const { id } = await context.params;
    const supplier = await getSupplier(id);

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error('[API] supplier detail failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

