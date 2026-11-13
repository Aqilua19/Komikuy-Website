import { NextResponse } from "next/server";
import { DonghuaError } from "./errors";

export function ok(data: unknown, ttlSeconds = 300) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`,
    },
  });
}

export function fail(err: unknown) {
  if (err instanceof DonghuaError) {
    return NextResponse.json(
      { message: err.message, code: err.code, error: err.message },
      { status: err.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  return NextResponse.json(
    { message, code: "INTERNAL_ERROR", error: message },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

export function parsePage(raw: string | null): number {
  if (!raw) return 1;
  if (!/^\d{1,4}$/.test(raw)) throw new DonghuaError("BAD_REQUEST", "Parameter page harus angka.", 400);
  return Math.max(1, parseInt(raw, 10));
}

export function assertSlug(slug: string): string {
  const s = decodeURIComponent(slug).trim();
  if (!/^[a-z0-9][a-z0-9._-]{0,199}$/i.test(s)) {
    throw new DonghuaError("BAD_REQUEST", "Slug tidak valid.", 400);
  }
  return s;
}
