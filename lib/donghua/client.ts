export type Result<T> = { data: T; error: null } | { data: null; error: string };

export async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { data: await fn(), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
    return { data: null, error: message };
  }
}

export function isEpisodeSlug(slug: string): boolean {
  return /-episode-\d+/i.test(slug);
}

export function donghuaHref(slug: string): string {
  return isEpisodeSlug(slug)
    ? `/donghua/watch/${encodeURIComponent(slug)}`
    : `/donghua/series/${encodeURIComponent(slug)}`;
}

export async function fetchDonghua<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`/api/donghua${path}`, { signal });
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) throw new Error(body?.message || `Request gagal (${res.status}).`);
  return body as T;
}
