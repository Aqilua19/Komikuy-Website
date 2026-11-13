import { NextRequest, NextResponse } from 'next/server';
import { comicAdapter } from '@/lib/komikcast/adapter';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ status: false, error: 'Slug tidak valid.' }, { status: 400 });
    }

    const detail = await comicAdapter.getMangaDetail(slug);
    if (!detail) {
      return NextResponse.json({ status: false, error: 'Komik tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ status: true, data: detail });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: 'Detail komik tidak dapat dimuat.' }, { status: 500 });
  }
}
