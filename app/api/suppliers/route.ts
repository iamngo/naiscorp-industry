import { NextResponse, NextRequest } from 'next/server';
import { getAllSuppliers } from '@/lib/mockStore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get('q') || '').toLowerCase();

    const suppliers = await getAllSuppliers();

    const filtered = query
      ? suppliers.filter(
          (supplier) =>
            supplier.companyName.toLowerCase().includes(query) ||
            supplier.industries.some((industry) => industry.toLowerCase().includes(query)),
        )
      : suppliers;

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error('[API] suppliers listing failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

