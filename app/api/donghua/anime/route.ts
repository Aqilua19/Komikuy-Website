import type { NextRequest } from "next/server";
import { getAnimeList } from "@/lib/donghua";
import { fail, ok } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params: Record<string, string[]> = {};
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      if (!/^[a-z_]+(\[\])?$/i.test(key) || value.length > 100) continue;
      (params[key] ||= []).push(value);
    }
    return ok(await getAnimeList(params), 600);
  } catch (err) {
    return fail(err);
  }
}
