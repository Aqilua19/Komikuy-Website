export async function fetchAnimeApi({ data }: { data: { path: string } }) {
  const res = await fetch(`/api/anime?path=${encodeURIComponent(data.path)}`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Terjadi kesalahan saat mengambil data.");
  }
  return json;
}
