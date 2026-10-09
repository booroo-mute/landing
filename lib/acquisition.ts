// Anonymous first-touch context, shared only between mute.ac and beta.mute.ac.
// No account identifiers, search terms, full referrers, or arbitrary query data.
const COOKIE = "mute_acquisition";
const MAX_AGE = 30 * 24 * 60 * 60;
const safe = (value: string | null) => value && /^[a-z0-9._/-]{1,64}$/i.test(value) ? value : null;

function readCookie(name: string) {
  try {
    return JSON.parse(decodeURIComponent(document.cookie.split("; ").find(x => x.startsWith(`${name}=`))?.slice(name.length + 1) ?? "null"));
  } catch { return null; }
}

function writeCookie(name: string, value: unknown, seconds: number) {
  const domain = /(^|\.)mute\.ac$/.test(location.hostname) ? "; Domain=mute.ac" : "";
  try { document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${seconds}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}${domain}`; } catch { /* Storage may be unavailable; navigation still works. */ }
}

export function captureAcquisition() {
  if (typeof document === "undefined") return;
  const existing = readCookie(COOKIE);
  if (existing?.captured_at && Date.now() - existing.captured_at < MAX_AGE * 1000 && existing.captured_at <= Date.now()) return;
  const query = new URLSearchParams(location.search);
  let host = "";
  try { host = new URL(document.referrer).hostname; } catch { /* direct */ }
  const internal = /(^|\.)mute\.ac$/.test(host);
  const search = /(^|\.)(yandex\.(ru|com)|ya\.ru)$/.test(host) ? "yandex"
    : /(^|\.)google\.[a-z.]+$/.test(host) ? "google"
    : /(^|\.)bing\.com$/.test(host) ? "bing" : null;
  const campaignSource = safe(query.get("utm_source"));
  // Legacy internal UTM links must not become first-touch campaigns.
  const campaign = campaignSource && campaignSource !== "mute.ac";
  writeCookie(COOKIE, {
    captured_at: Date.now(),
    source: campaign ? campaignSource : search || (internal ? "unknown" : safe(host) || "direct"),
    medium: campaign ? safe(query.get("utm_medium")) || "unknown" : search ? "organic" : host && !internal ? "referral" : internal ? "unknown" : "none",
    landing_path: /^\/[a-z0-9/-]{0,127}$/i.test(location.pathname) ? location.pathname : "/",
  }, MAX_AGE);
}

export function captureCta(page: string, placement: string) {
  captureAcquisition();
  writeCookie("mute_cta", { page, placement, captured_at: Date.now() }, 3600);
}
