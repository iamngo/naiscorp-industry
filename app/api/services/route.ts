import { NextRequest, NextResponse } from 'next/server';
import { mockServices } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let services = [...mockServices];

    // Filter by type
    if (type && type !== 'all') {
      services = services.filter(s => s.serviceType === type);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      services = services.filter(s =>
        s.title.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: services,
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
    
    // Create new service (mock)
    const newService = {
      id: `svc-${Date.now()}`,
      supplierId: 'supp-1', // Mock supplier ID
      serviceType: body.serviceType,
      title: body.title,
      description: body.description,
      priceRange: body.priceMin && body.priceMax ? {
        min: parseInt(body.priceMin),
        max: parseInt(body.priceMax),
        unit: body.priceUnit || 'dự án',
      } : undefined,
      verificationStatus: 'pending' as const,
      isStrategicPartner: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In real app, save to database
    // mockServices.push(newService);

    return NextResponse.json({
      success: true,
      data: newService,
      message: 'Service registered successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

