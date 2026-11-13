import { requestUpstream } from "@/lib/anime/anime.server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  try {
    const result = await requestUpstream(path, request.headers);
    return Response.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Terjadi kesalahan.";
    const status = message.startsWith("Terlalu banyak")
      ? 429
      : message.startsWith("Permintaan tidak dikenali")
      ? 400
      : 502;
    return Response.json({ ok: false, message }, { status });
  }
}
