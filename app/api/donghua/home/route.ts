import type { NextRequest } from "next/server";
import { getHome } from "@/lib/donghua";
import { fail, ok, parsePage } from "@/lib/donghua/route-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const page = parsePage(request.nextUrl.searchParams.get("page"));
    return ok(await getHome(page), 300);
  } catch (err) {
    return fail(err);
  }
}
