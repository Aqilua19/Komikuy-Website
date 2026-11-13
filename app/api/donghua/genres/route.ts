import { listGenres } from "@/lib/donghua";
import { fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await listGenres(), 86400);
  } catch (err) {
    return fail(err);
  }
}
