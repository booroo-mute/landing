#!/usr/bin/env node
// Пингует IndexNow (Яндекс + общий endpoint) списком URL из sitemap.
// Запускать после деплоя: npm run indexnow
// Яндекс подхватывает изменения за часы вместо дней/недель.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mute.ac";
const KEY = "f1deb90cbb327c579a03d498fab61575"; // public/<key>.txt
const ENDPOINTS = [
  "https://yandex.com/indexnow",
  "https://api.indexnow.org/indexnow",
];

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function ping(endpoint, urlList) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  });
  console.log(`${endpoint} → HTTP ${res.status}`);
  if (res.status >= 400) {
    console.error(await res.text());
  }
}

const urls = await getSitemapUrls();
console.log(`Отправляем ${urls.length} URL из sitemap:`);
urls.forEach((u) => console.log(`  ${u}`));

for (const endpoint of ENDPOINTS) {
  try {
    await ping(endpoint, urls);
  } catch (err) {
    console.error(`${endpoint} — ошибка:`, err.message);
  }
}
