import { getVideoSource } from "@/lib/donghua";
import { assertSlug, fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    return ok(await getVideoSource(assertSlug(slug)), 60);
  } catch (err) {
    return fail(err);
  }
}
