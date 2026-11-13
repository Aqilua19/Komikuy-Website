import { NextRequest, NextResponse } from 'next/server';
import { comicAdapter } from '@/lib/komikcast/adapter';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; chapter: string }> }
) {
  try {
    const { slug, chapter } = await params;
    if (!slug || !chapter) {
      return NextResponse.json({ status: false, error: 'Parameter tidak valid.' }, { status: 400 });
    }

    const chapterDetail = await comicAdapter.getChapterDetail(slug, chapter);
    if (!chapterDetail) {
      return NextResponse.json({ status: false, error: 'Chapter tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ status: true, data: chapterDetail });
  } catch (error: any) {
    return NextResponse.json({ status: false, error: 'Chapter tidak dapat dimuat.' }, { status: 500 });
  }
}
