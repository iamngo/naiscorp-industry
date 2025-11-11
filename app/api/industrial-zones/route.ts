import { NextRequest, NextResponse } from 'next/server';
import { addIndustrialZone, getAllIndustrialZones } from '@/lib/mockStore';

// GET /api/industrial-zones - List all IZs with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verified = searchParams.get('verified');
    const province = searchParams.get('province');
    const industry = searchParams.get('industry');
    const esg = searchParams.get('esg');
    const digitalTransformation = searchParams.get('digitalTransformation');

    const allIZs = await getAllIndustrialZones();
    let filtered = verified === 'true'
      ? allIZs.filter(iz => iz.verificationStatus === 'verified')
      : allIZs;

    if (province) {
      filtered = filtered.filter(iz => iz.province === province);
    }

    if (industry) {
      filtered = filtered.filter(iz => iz.industries.includes(industry));
    }

    if (esg && esg !== 'none') {
      filtered = filtered.filter(iz => iz.esgStatus === esg || iz.esgStatus === 'all');
    }

    if (digitalTransformation === 'true') {
      filtered = filtered.filter(iz => iz.digitalTransformation);
    }

    return NextResponse.json({
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('[API] list industrial zones failed', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/industrial-zones - Create new IZ (for IZ users)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock create - trong production sẽ lưu vào database
    const now = new Date().toISOString();
    const newIZ = {
      id: `iz-${Date.now()}`,
      userId: body.userId || 'user-2', // Mock user ID if not provided
      regionId: body.regionId || undefined,
      name: body.name,
      address: body.address,
      province: body.province,
      district: body.district,
      latitude: body.latitude || 0,
      longitude: body.longitude || 0,
      area: body.area || 0,
      establishedYear: body.establishedYear || 0,
      owner: body.owner,
      industries: body.industries || [],
      description: body.description,
      verificationStatus: (body.verificationStatus || 'pending') as const,
      videoUrl: body.videoUrl || undefined,
      documentUrls: body.documentUrls || undefined,
      esgStatus: body.esgStatus || 'none',
      digitalTransformation: body.digitalTransformation || false,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      website: body.website || undefined,
      totalCompanies: body.totalCompanies || 0,
      totalEmployees: body.totalEmployees || 0,
      facilities: body.facilities || [],
      clusterIds: body.clusterIds || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const persisted = await addIndustrialZone(newIZ);

    return NextResponse.json({ 
      success: true,
      data: persisted,
      message: 'IZ registered successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('[API] create industrial zone failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

