const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** Dibaca saat dipanggil (bukan saat module load) supaya aman di dev & serverless. */
export function getConfig() {
  return {
    baseUrl: (process.env.DONGHUA_BASE_URL || "https://anichin.co").replace(/\/+$/, ""),
    userAgent: process.env.DONGHUA_USER_AGENT || DEFAULT_UA,
    cfCookie: process.env.DONGHUA_CF_COOKIE || "",
    videoApi:
      process.env.DONGHUA_VIDEO_API || "https://fastsavenow.com/wp-json/aio-dl/video-data/",
    videoToken: process.env.DONGHUA_VIDEO_TOKEN || "",
    timeoutMs: Number(process.env.DONGHUA_TIMEOUT_MS || 15000),
  };
}
