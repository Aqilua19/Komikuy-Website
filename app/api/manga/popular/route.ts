import { NextRequest, NextResponse } from 'next/server';
import { comicAdapter } from '@/lib/komikcast/adapter';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const result = await comicAdapter.getPopularComics(page);
    return NextResponse.json({ status: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: 'Komik terpopuler tidak dapat dimuat.' }, { status: 500 });
  }
}
