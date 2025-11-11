import { NextRequest, NextResponse } from 'next/server';
import {
  addService,
  getAllServices,
} from '@/lib/mockStore';
import type { Service } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const services = await getAllServices();

    let filtered = [...services];

    if (type && type !== 'all') {
      filtered = filtered.filter(s => s.serviceType === type);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
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

    const newService: Service = {
      id: `svc-${Date.now()}`,
      supplierId: body.supplierId || 'supp-1',
      serviceType: body.serviceType,
      title: body.title,
      description: body.description || '',
      izIds: Array.isArray(body.izIds) ? body.izIds : undefined,
      clusterIds: Array.isArray(body.clusterIds) ? body.clusterIds : undefined,
      priceRange:
        body.priceMin && body.priceMax
          ? {
              min: typeof body.priceMin === 'number' ? body.priceMin : parseInt(body.priceMin, 10),
              max: typeof body.priceMax === 'number' ? body.priceMax : parseInt(body.priceMax, 10),
              unit: body.priceUnit || 'dự án',
            }
          : undefined,
      verificationStatus: 'pending',
      verifiedBy: undefined,
      isStrategicPartner: Boolean(body.isStrategicPartner),
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const created = await addService(newService);

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Service registered successfully',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

