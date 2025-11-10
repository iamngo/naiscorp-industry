import { NextRequest, NextResponse } from 'next/server';
import { mockFactories } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const izId = searchParams.get('izId');
    const clusterId = searchParams.get('clusterId');
    const verificationStatus = searchParams.get('verificationStatus');

    let factories = [...mockFactories];

    // Filter by izId
    if (izId) {
      factories = factories.filter(f => f.izId === izId);
    }

    // Filter by clusterId
    if (clusterId) {
      factories = factories.filter(f => f.clusterId === clusterId);
    }

    // Filter by verificationStatus
    if (verificationStatus) {
      factories = factories.filter(f => f.verificationStatus === verificationStatus);
    }

    return NextResponse.json({
      success: true,
      data: factories,
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
    
    // Create new factory (mock)
    const newFactory = {
      id: `factory-${Date.now()}`,
      userId: 'user-2', // Mock user ID
      izId: body.izId,
      clusterId: body.clusterId || undefined,
      name: body.name,
      lotNumber: body.lotNumber || undefined,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      industries: body.industries || [],
      description: body.description,
      verificationStatus: 'pending' as const,
      videoUrl: body.videoUrl || undefined,
      esgStatus: body.esgStatus || 'none',
      digitalTransformation: body.digitalTransformation || false,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      website: body.website || undefined,
      productionCapacity: body.productionCapacity || undefined,
      products: body.products || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In real app, save to database
    // mockFactories.push(newFactory);

    return NextResponse.json({
      success: true,
      data: newFactory,
      message: 'Factory registered successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
