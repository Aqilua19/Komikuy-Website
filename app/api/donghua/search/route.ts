import type { NextRequest } from "next/server";
import { DonghuaError, searchDonghua } from "@/lib/donghua";
import { fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get("q") || "").trim();
    if (!q) throw new DonghuaError("BAD_REQUEST", "Parameter q (kata kunci) wajib diisi.", 400);
    if (q.length > 100) throw new DonghuaError("BAD_REQUEST", "Kata kunci terlalu panjang.", 400);
    return ok(await searchDonghua(q), 120);
  } catch (err) {
    return fail(err);
  }
}
