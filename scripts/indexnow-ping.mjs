#!/usr/bin/env node
// Пингует IndexNow (Яндекс + общий endpoint) URL из sitemap, у которых
// изменился <lastmod> с прошлого запуска. Запускать после каждого деплоя:
//   npm run indexnow          — только изменившиеся URL
//   npm run indexnow -- --all — весь sitemap (первый запуск, смена домена)
// Состояние хранится в .indexnow-last.json (в .gitignore). Яндекс подхватывает
// изменения за часы вместо дней/недель; шлём только дельту, чтобы не выглядеть
// как спам-пинг одних и тех же адресов.

import fs from "node:fs";
import path from "node:path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mute.ac";
const KEY = "f1deb90cbb327c579a03d498fab61575"; // public/<key>.txt
const ENDPOINTS = [
  "https://yandex.com/indexnow",
  "https://api.indexnow.org/indexnow",
];
const STATE_FILE = path.join(process.cwd(), ".indexnow-last.json");
const sendAll = process.argv.includes("--all");

async function getSitemapEntries() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]*)<\/lastmod>)?/g)].map(
    (m) => [m[1], m[2] ?? ""],
  );
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
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
    return false;
  }
  return true;
}

const entries = await getSitemapEntries();
const previous = readState();
const changed = entries.filter(([url, lastmod]) => sendAll || previous[url] !== lastmod);

if (changed.length === 0) {
  console.log(`Изменений нет: все ${entries.length} URL уже отправлялись с текущим lastmod.`);
  process.exit(0);
}

const urls = changed.map(([url]) => url);
console.log(`Отправляем ${urls.length} из ${entries.length} URL:`);
urls.forEach((u) => console.log(`  ${u}`));

let ok = false;
for (const endpoint of ENDPOINTS) {
  try {
    ok = (await ping(endpoint, urls)) || ok;
  } catch (err) {
    console.error(`${endpoint} — ошибка:`, err.message);
  }
}

if (ok) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(Object.fromEntries(entries), null, 2));
  console.log(`Состояние сохранено в ${path.basename(STATE_FILE)}.`);
}
