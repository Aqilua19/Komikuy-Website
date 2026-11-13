import type { NextRequest } from "next/server";
import { getGenre } from "@/lib/donghua";
import { assertSlug, fail, ok, parsePage } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const page = parsePage(request.nextUrl.searchParams.get("page"));
    return ok(await getGenre(assertSlug(slug), page), 600);
  } catch (err) {
    return fail(err);
  }
}
