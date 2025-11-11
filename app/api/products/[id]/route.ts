import { NextRequest, NextResponse } from 'next/server';
import { getProduct, updateProduct } from '@/lib/mockStore';

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const product = await getProduct(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('[API] get product failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateProduct(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[API] update product failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

