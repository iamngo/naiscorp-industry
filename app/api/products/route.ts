import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/mockStore';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('[API] get products failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

