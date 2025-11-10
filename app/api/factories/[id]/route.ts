import { NextRequest, NextResponse } from 'next/server';
import { getFactoryById } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const factory = getFactoryById(params.id);
    
    if (!factory) {
      return NextResponse.json(
        { success: false, error: 'Factory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: factory,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const factory = getFactoryById(params.id);
    
    if (!factory) {
      return NextResponse.json(
        { success: false, error: 'Factory not found' },
        { status: 404 }
      );
    }

    // Update factory (mock)
    const updatedFactory = {
      ...factory,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedFactory,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const factory = getFactoryById(params.id);
    
    if (!factory) {
      return NextResponse.json(
        { success: false, error: 'Factory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Factory deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
