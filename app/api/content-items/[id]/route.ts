import { NextRequest, NextResponse } from 'next/server';
import { updateContentItem } from '@/lib/mockStore';

type ContentItemContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: ContentItemContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await updateContentItem(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[API] update content item failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

