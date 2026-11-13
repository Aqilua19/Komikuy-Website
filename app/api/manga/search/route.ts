import { NextRequest, NextResponse } from 'next/server';
import { comicAdapter } from '@/lib/komikcast/adapter';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!q.trim()) {
      return NextResponse.json({ status: true, data: [], pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0 } });
    }

    const result = await comicAdapter.searchComics(q, page);
    return NextResponse.json({ status: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: 'Pencarian tidak dapat dimuat.' }, { status: 500 });
  }
}
