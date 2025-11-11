import { NextRequest, NextResponse } from 'next/server';
import {
  addFactory,
  getAllFactories,
} from '@/lib/mockStore';
import type { Factory } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const izId = searchParams.get('izId');
    const clusterId = searchParams.get('clusterId');
    const verificationStatus = searchParams.get('verificationStatus');

    const factories = await getAllFactories();

    let filtered = [...factories];
    // Filter by izId
    if (izId) {
      filtered = filtered.filter(f => f.izId === izId);
    }

    // Filter by clusterId
    if (clusterId) {
      filtered = filtered.filter(f => f.clusterId === clusterId);
    }

    // Filter by verificationStatus
    if (verificationStatus) {
      filtered = filtered.filter(f => f.verificationStatus === verificationStatus);
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

    const newFactory: Factory = {
      id: `factory-${Date.now()}`,
      userId: 'user-2',
      izId: body.izId,
      clusterId: body.clusterId || undefined,
      name: body.name,
      lotNumber: body.lotNumber || undefined,
      address: body.address,
      latitude: typeof body.latitude === 'number' ? body.latitude : parseFloat(body.latitude) || 0,
      longitude: typeof body.longitude === 'number' ? body.longitude : parseFloat(body.longitude) || 0,
      industries: Array.isArray(body.industries) ? body.industries : [],
      description: body.description || '',
      verificationStatus: 'pending',
      verifiedAt: undefined,
      verifiedBy: undefined,
      videoUrl: body.videoUrl || undefined,
      documentUrls: Array.isArray(body.documentUrls) ? body.documentUrls : undefined,
      esgStatus: body.esgStatus || 'none',
      digitalTransformation: Boolean(body.digitalTransformation),
      contactEmail: body.contactEmail || '',
      contactPhone: body.contactPhone || '',
      website: body.website || undefined,
      productionCapacity: body.productionCapacity || undefined,
      products: Array.isArray(body.products) ? body.products : [],
      linkedBuyerIds: Array.isArray(body.linkedBuyerIds) ? body.linkedBuyerIds : undefined,
      linkedSupplierIds: Array.isArray(body.linkedSupplierIds) ? body.linkedSupplierIds : undefined,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const created = await addFactory(newFactory);

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Factory registered successfully',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
