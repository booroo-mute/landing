#!/usr/bin/env node
// Сводка по выгрузкам Яндекс.Метрики.
//
//   node scripts/metrika-clusters.mjs <папка за день>     один день: итоги, источники,
//                                                          кластеры запросов, страницы
//   node scripts/metrika-clusters.mjs <папка с днями>     папка, где лежат подпапки
//                                                          по дням: таблица день к дню
//                                                          и цели по датам
//
// Папка дня: отчёты «Посещаемость», «Источники, сводка», «Поисковые запросы»
// (или «Поисковые системы»), «Популярное», «Сайты». Тип таблицы определяется
// по заголовкам колонок, а не суффиксу имени. Папки целей («регистрации», «открыл скачать»)
// с «Посещаемость-<дата>…csv» по каждому дню кладутся рядом с папками дней и
// подхватываются сами. Без зависимостей.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Первое совпадение выигрывает, поэтому игры стоят раньше общего «голосового чата»:
// иначе «не работает голосовой чат в варфейс» уходил в общий кластер. \b в JS
// кириллицы не знает (между пробелом и «к» границы слова нет), короткие слова
// обрамляем просмотром: (?<![а-яё])кс(?![а-яё]).
const CLUSTERS = [
  ["бренд", /(?<![a-z])mute(?![a-z])|мьют|(?<![а-яё])мут(?![а-яё])|муте|мути|mute\.ac|\{mute\}/iu],
  ["roblox", /роблокс|roblox|(?<![а-яё])рб(?![а-яё])|робокс|облоксе|робосе/iu],
  ["steam", /стим|steam|(?<![а-яё])стив(?![а-яё])/iu],
  ["консоли", /пс ?5|ps ?5|xbox|икс ?бокс|плейстейшн|playstation|консол|switch|свитч/iu],
  ["discord", /дискорд|discord|запрет|(?<![а-яё])дс(?![а-яё])|дискор|обход/iu],
  ["cs/dota/fortnite/pubg", /(?<![а-яё])кс(?![а-яё])|кс2|дот|фортнайт|пабг|pubg/iu],
  ["warface/valorant/arc", /варфейс|warface|валорант|valorant|arc raiders|арк р[ае]йд/iu],
  ["кооп/проксимити", /(?<![а-яё])репо(?![а-яё])|(?<![a-z])r\.?e\.?p\.?o(?![a-z])|(?<![а-яё])пик(?![а-яё])|(?<![a-z])peak(?![a-z])|content warning|контент ворнинг|фазмо|phasmo|проксимити|proximity|lethal|летал|sea of thieves|(?<![a-z])squad(?![a-z])|сквад|devour|демонолог|demonologist/iu],
  ["нет войса", /геншин|genshin|амонг|among|(?<![а-яё])лол(?![а-яё])|league of legends|лига легенд|террари|terraria|(?<![а-яё])дбд(?![а-яё])|dead by daylight|валхейм|valheim|satisfactory|сатисфактор|балдур|baldur|(?<![a-z])bg3(?![a-z])|палворлд|palworld|диабло|diablo|форз|forza|(?<![a-z])raft(?![a-z])|(?<![а-яё])рафт(?![а-яё])|сталкрафт|stalcraft|(?<![a-z])tf2(?![a-z])|тф2|team fortress|(?<![a-z])ets ?2(?![a-z])|етс ?2|нет голосового чата|без голосового чата/iu],
  ["созвон", /созв[оа]н/iu],
  ["стрим/показать", /стрим|показать игру|транслир|(?<![a-z])obs(?![a-z])|(?<![а-яё])обс(?![а-яё])/iu],
  ["звонок в россию", /в росси[юи] из|из-за границы|родител|за границ|звон[а-яё]* в росси[юи]/iu],
  ["голосовой чат", /голосов|войс|voice|(?<![а-яё])гс(?![а-яё])|аудио|общени|созвон|разговар|звонок|звонк|позвонить|связь/iu],
  ["telegram/whatsapp", /телеграм|(?<![а-яё])тг(?![а-яё])|ватсап|whatsapp/iu],
  ["экран/фильм", /фильм|кино|мультик|экран|демк|аниме|сериал|ютуб|youtube/iu],
];

export function parseCsv(text) {
  text = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (cell !== "" || row.length) { row.push(cell); rows.push(row); } row = []; cell = ""; }
    else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const num = (v) => Number(String(v ?? "").replace(",", ".")) || 0;
const isSeries = (rows) => rows[0]?.[0] === "Период";
const dateOf = (f) => {
  const m = f.match(/-(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})/);
  return m && m[1] === m[2] ? m[1] : undefined;
};
const readCsv = (dir, f) => parseCsv(fs.readFileSync(path.join(dir, f), "utf8").replace(/^﻿/, ""));

/** Суммирует временной ряд (10-минутные интервалы) по часам для колонки col. */
function hourly(rows, col) {
  const h = Array(24).fill(0);
  for (const r of rows.slice(1)) {
    const hour = Number(r[0]?.slice(11, 13));
    if (!Number.isNaN(hour)) h[hour] += num(r[col]);
  }
  return h;
}

/** Читает папку одного дня. */
export function loadDay(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
  const unique = new Map();
  for (const f of files) {
    const rows = readCsv(dir, f);
    unique.set(JSON.stringify(rows), { f, rows });
  }
  const byPrefix = (prefix) => [...unique.values()].filter(x => x.f.startsWith(prefix) && dateOf(x.f));
  const table = (prefix) => byPrefix(prefix).find(x => {
    const h = x.rows[0] || [];
    if (isSeries(x.rows)) return false;
    if (prefix === "Посещаемость") return h.includes("Визиты") && h.includes("Посетители");
    if (prefix === "Популярное") return h.includes("Адрес страницы") && h.includes("Просмотры");
    return h.includes("Визиты");
  });
  const series = (prefix) => byPrefix(prefix).find(x => isSeries(x.rows));

  const day = { dir, date: files.map(dateOf).find(Boolean) ?? path.basename(dir), clusters: new Map(), clusterPhrases: new Map(), other: [], hidden: [] };

  const total = table("Посещаемость");
  if (total) {
    const h = total.rows[0], t = total.rows.find(r => r[0] === day.date);
    if (!t) throw new Error(`Missing daily row in ${total.f}`);
    day.totals = Object.fromEntries(h.map((k, i) => [k, t[i]]).filter((_, i) => i));
    day.visits = num(t[h.indexOf("Визиты")]);
    day.visitors = num(t[h.indexOf("Посетители")]);
    day.views = num(t[h.indexOf("Просмотры")]);
  }
  const visitsSeries = series("Посещаемость");
  if (visitsSeries && /\(Визиты\)$/.test(visitsSeries.rows[0][1])) day.hourlyVisits = hourly(visitsSeries.rows, 1);

  const src = table("Источники, сводка");
  if (src) {
    const h = src.rows[0];
    const vi = h.findIndex((x) => /^Визиты|Целевые визиты|Достижения/.test(x));
    day.sources = src.rows.slice(2).map((r) => ({ name: r[1] !== "Не определено" ? r[1] : r[0], visits: num(r[vi]) }));
    const by = (name) => day.sources.find((s) => s.name === name)?.visits ?? 0;
    day.yandex = by("Яндекс"); day.google = by("Google"); day.direct = by("Прямые заходы");
    day.internal = by("Внутренние переходы"); day.steam = by("steamcommunity.com");
    if (day.visits === undefined) {
      day.visits = num(src.rows[1][h.indexOf("Визиты")]);
      const visitorsColumn = h.indexOf("Посетители");
      if (visitorsColumn >= 0) day.visitors = num(src.rows[1][visitorsColumn]);
      day.totalsSource = "sources-fallback";
    }
  }
  const srcSeries = series("Источники, сводка");
  if (srcSeries) {
    const col = srcSeries.rows[0].findIndex((x) => x.startsWith("Переходы из поисковых систем"));
    if (col > 0) day.hourlySearch = hourly(srcSeries.rows, col);
  }

  const q = table("Поисковые запросы") ?? table("Поисковые системы");
  if (q) {
    const h = q.rows[0];
    const vi = h.findIndex((x) => /^Визиты|Целевые визиты|Достижения/.test(x));
    const engines = ["Яндекс", "Google", "Bing", "Yahoo!", "Не определено"];
    for (const r of q.rows.slice(1)) {
      const phrase = engines.includes(r[0]) && !engines.includes(r[1]) ? r[1] : r[0];
      const engine = phrase === r[1] ? r[0] : r[1];
      const v = num(r[vi]);
      if (phrase === "Итого и средние") continue;
      if (phrase === "Не определено") { day.hidden.push(`${engine} ${v}`); continue; }
      const hit = CLUSTERS.find(([, re]) => re.test(phrase));
      if (hit) {
        day.clusters.set(hit[0], (day.clusters.get(hit[0]) ?? 0) + v);
        day.clusterPhrases.set(hit[0], (day.clusterPhrases.get(hit[0]) ?? 0) + 1);
      } else day.other.push([v, phrase]);
    }
    day.queryMetric = h[vi];
  }

  const pop = table("Популярное");
  if (pop) {
    const h = pop.rows[0];
    day.pages = pop.rows.slice(2).map(r => ({
      url: r[h.indexOf("Адрес страницы")], views: num(r[h.indexOf("Просмотры")]),
      visitors: num(r[h.indexOf("Посетители")]),
    }));
    const groups = new Map();
    for (const page of day.pages) {
      const url = normalizedPage(page.url);
      const prior = groups.get(url);
      // Visitors across query variants overlap. Only pageviews are additive.
      groups.set(url, { url, views: (prior?.views || 0) + page.views,
        visitors: prior ? null : page.visitors });
    }
    day.pages = [...groups.values()];
    const views = predicate => day.pages.filter(p => predicate(p.url)).reduce((n, p) => n + p.views, 0);
    day.landingViews = views(url => url.startsWith("https://mute.ac/"));
    day.syntheticViews = views(url => url.startsWith("https://beta.mute.ac/native/"));
    day.betaViews = views(url => url.startsWith("https://beta.mute.ac/") && !url.startsWith("https://beta.mute.ac/native/"));
  }

  const sites = table("Сайты");
  if (sites) day.referrers = sites.rows.slice(2).filter((r) => r[4] !== "Не определено").map((r) => ({ site: r[4], visits: r[5] }));
  return day;
}

/**
 * Папка цели: «Посещаемость-<дата>…csv» по дням. Имя цели берём из
 * заголовка каждого табличного файла, поэтому папка, куда попали выгрузки
 * по двум целям (так было 18–20.09: «Открыл приложение в браузере» лежала
 * в «открыл скачать»), даёт две отдельные цели. Временные ряды имени цели
 * не несут, их привязываем только когда цель в папке одна.
 */
function mergeGoalObservation(goal, date, value) {
  const previous = goal.byDate.get(date);
  if (previous && (previous.total !== value.total || previous.visits !== value.visits || previous.conversion !== value.conversion)) {
    goal.conflicts.push({ date, files: [previous.file, value.file], policy: "prefer narrower report period; never sum" });
    if (previous.span === value.span) throw new Error(`Conflicting same-period goal exports: ${goal.name} ${date}`);
  }
  if (!previous || value.span < previous.span) goal.byDate.set(date, value);
}

export function loadGoalFolder(dir) {
  const goals = new Map();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".csv"))) {
    const rows = readCsv(dir, f), h = rows[0] || [];
    const ai = h.findIndex(x => x.startsWith("Достижения цели"));
    const name = h[ai]?.match(/\((.+)\)/)?.[1];
    if (!name) continue;
    const ci = h.findIndex(x => x.startsWith("Конверсия"));
    const vi = h.findIndex(x => x.startsWith("Целевые визиты"));
    const goal = goals.get(name) ?? { name, byDate: new Map(), conflicts: [] };
    const range = f.match(/-(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})/);
    const span = range ? (Date.parse(range[2]) - Date.parse(range[1])) / 86400000 + 1 : Infinity;
    // Never put a period summary under a filename date. Daily rows carry truth.
    for (const row of rows.slice(1)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row[0])) continue;
      const value = { total: num(row[ai]), conversion: ci >= 0 ? num(row[ci]) : null,
        visits: vi >= 0 ? num(row[vi]) : null, span, file: path.join(dir, f) };
      mergeGoalObservation(goal, row[0], value);
    }
    goals.set(name, goal);
  }
  return [...goals.values()];
}

export function normalizedPage(value) {
  try { const url = new URL(value); return url.origin + url.pathname; }
  catch { return value; }
}

export function loadReports(target) {
  const dirs = fs.readdirSync(target, { withFileTypes: true }).some(x => x.name.endsWith(".csv"))
    ? [target] : fs.readdirSync(target, { withFileTypes: true }).filter(x => x.isDirectory() && x.name !== "gsc").map(x => path.join(target, x.name));
  const days = [], goals = new Map();
  for (const dir of dirs) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".csv"));
    if (files.some(f => /^(Источники|Популярное|Поисковые)/.test(f) || (dateOf(f) && readCsv(dir, f)[0]?.includes("Визиты") && readCsv(dir, f)[0]?.includes("Посетители")))) days.push(loadDay(dir));
    for (const goal of loadGoalFolder(dir)) {
      const merged = goals.get(goal.name) ?? { name: goal.name, byDate: new Map(), conflicts: [] };
      merged.conflicts.push(...goal.conflicts);
      for (const [date, value] of goal.byDate) {
        mergeGoalObservation(merged, date, value);
      }
      goals.set(goal.name, merged);
    }
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { days, goals: [...goals.values()] };
}

/**
 * Папка gsc/: выгрузки Search Console (Performance → Export → CSV). Файлы
 * «Запросы» и «Страницы» с колонками клики/показы/CTR/позиция, язык
 * интерфейса любой. Печатаем топ по кликам с позицией: это единственный
 * источник запросов Google, Метрика их не показывает.
 */
export function loadGsc(dir, completeThrough) {
  const out = [];
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".csv"))) {
    const rows = readCsv(dir, f);
    const h = rows[0] ?? [];
    const ci = h.findIndex((x) => /^(Клики|Clicks)$/i.test(x));
    const ii = h.findIndex((x) => /^(Показы|Impressions)$/i.test(x));
    const pi = h.findIndex((x) => /^(Позиция|Position)$/i.test(x));
    if (ci === -1 || ii === -1) continue;
    const items = rows.slice(1).filter(r => !/^(Date|Дата)$/i.test(h[0]) || (completeThrough && r[0] <= completeThrough)).map((r) => ({ key: r[0], clicks: num(r[ci]), impressions: num(r[ii]), position: pi === -1 ? null : num(r[pi]) }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
    out.push({ file: f, items });
  }
  return out;
}

function printGsc(tables) {
  for (const t of tables) {
    console.log(`\n== Search Console: ${t.file} (топ-20 по кликам: клики / показы / позиция)`);
    for (const i of t.items.slice(0, 20)) {
      console.log(`  ${i.key.slice(0, 70).padEnd(70)} ${String(i.clicks).padStart(5)} / ${String(i.impressions).padStart(6)}${i.position === null ? "" : " / " + i.position.toFixed(1)}`);
    }
  }
}

function printDay(day) {
  console.log(`== Итого (${day.date})`);
  for (const [k, v] of Object.entries(day.totals ?? {})) console.log(`  ${k}: ${v}`);
  if (day.sources) {
    console.log("\n== Источники");
    for (const s of day.sources) console.log(`  ${s.name.padEnd(32)} ${s.visits}`);
  }
  if (day.queryMetric) {
    console.log(`\n== Кластеры запросов (${day.queryMetric}); без фразы: ${day.hidden.join(", ")}`);
    for (const [name] of CLUSTERS) console.log(`  ${name.padEnd(24)} ${String(day.clusters.get(name) ?? 0).padStart(5)}  фраз ${day.clusterPhrases.get(name) ?? 0}`);
    const other = [...day.other].sort((a, b) => b[0] - a[0]);
    console.log(`  вне кластеров: ${other.reduce((s, x) => s + x[0], 0)}; примеры: ${other.slice(0, 8).map((x) => x[1]).join(" | ")}`);
  }
  if (day.pages) {
    console.log(`\n== Просмотры: лендинг mute.ac ${day.landingViews}, приложение beta.mute.ac ${day.betaViews}`);
    console.log("== Страницы лендинга (просмотры / посетители)");
    for (const p of day.pages) if (p.url.startsWith("https://mute.ac")) console.log(`  ${p.url.replace("https://mute.ac", "").padEnd(56)} ${p.views} / ${p.visitors ?? "— (пересечение вариантов URL)"}`);
  }
  if (day.referrers) {
    console.log("\n== Внешние рефереры");
    for (const r of day.referrers) console.log(`  ${r.site.padEnd(40)} ${r.visits}`);
  }
}


/** ISO-неделя (понедельник) для даты YYYY-MM-DD: возвращает дату понедельника. */
export function isoWeekStart(date) {
  const d = new Date(date + "T00:00:00Z");
  const shift = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - shift);
  return d.toISOString().slice(0, 10);
}

/**
 * Сводка по ISO-неделям: что смотреть, когда «трафик упал». Волна Steam
 * помечается по кластеру «steam» (> 40 визитов с фразой за день), потому что
 * после каждой волны визиты и регистрации возвращаются к спокойному уровню,
 * и это не падение. Дни без таблицы посещаемости считаются в days, но визиты
 * у них пустые, поэтому неполные недели помечены числом дней.
 */
export function weeklySummary(days, goals) {
  const weeks = new Map();
  for (const d of days) {
    const key = isoWeekStart(d.date);
    const w = weeks.get(key) ?? { week: key, days: 0, daysWithVisits: 0, visits: 0, yandex: 0, google: 0, direct: 0, steamcomm: 0, landingViews: 0, betaViews: 0, steamCluster: 0, waveDays: 0, goals: new Map() };
    w.days++;
    if (d.visits !== undefined) { w.daysWithVisits++; w.visits += d.visits; }
    w.yandex += d.yandex ?? 0; w.google += d.google ?? 0; w.direct += d.direct ?? 0; w.steamcomm += d.steam ?? 0;
    w.landingViews += d.landingViews ?? 0; w.betaViews += d.betaViews ?? 0;
    const steam = d.clusters.get("steam") ?? 0;
    w.steamCluster += steam;
    if (steam > 40) w.waveDays++;
    for (const g of goals) {
      const v = g.byDate.get(d.date)?.total;
      if (v !== undefined) w.goals.set(g.name, (w.goals.get(g.name) ?? 0) + v);
    }
    weeks.set(key, w);
  }
  return [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));
}

function printWeekly(days, goals) {
  const weeks = weeklySummary(days, goals);
  if (weeks.length < 2) return;
  const w = 9, cell = (v) => String(v ?? "").padStart(w);
  const row = (label, get) => console.log(label.padEnd(30) + weeks.map((x) => cell(get(x))).join(""));
  console.log("\n== Неделя к неделе (ISO, с понедельника); дни = сколько дней с таблицей посещаемости");
  row("", (x) => x.week.slice(5));
  row("дней", (x) => `${x.daysWithVisits}/${x.days}`);
  row("Визиты", (x) => x.visits);
  row("Яндекс (поиск)", (x) => x.yandex);
  row("Google (поиск)", (x) => x.google);
  row("Прямые заходы", (x) => x.direct);
  row("steamcommunity.com", (x) => x.steamcomm);
  row("Просмотры mute.ac", (x) => x.landingViews);
  row("Просмотры приложения", (x) => x.betaViews);
  row("Фразы Steam (Яндекс)", (x) => x.steamCluster);
  row("Дней волны Steam (>40)", (x) => x.waveDays || "");
  for (const g of goals) row(`Цель: ${g.name}`.slice(0, 30), (x) => x.goals.get(g.name));
  console.log("Спокойная неделя = без дней волны; сравнивать падение нужно с прошлой спокойной неделей, а не с неделей волны.");
}

function printComparison(days, goals) {
  const w = 8;
  const cell = (v) => String(v ?? "").padStart(w);
  const row = (label, get) => console.log(label.padEnd(30) + days.map((d) => cell(get(d))).join(""));
  console.log("== День к дню");
  row("", (d) => d.date.slice(5));
  row("Визиты", (d) => d.visits);
  row("Посетители", (d) => d.visitors);
  row("Яндекс (поиск)", (d) => d.yandex);
  row("Google (поиск)", (d) => d.google);
  row("Прямые заходы", (d) => d.direct);
  row("Внутренние переходы", (d) => d.internal);
  row("steamcommunity.com", (d) => d.steam);
  row("Просмотры mute.ac", (d) => d.landingViews);
  row("Просмотры приложения", (d) => d.betaViews);
  row("Синтетические native-хиты", (d) => d.syntheticViews);
  for (const g of goals) {
    row(`Цель: ${g.name}`.slice(0, 30), (d) => g.byDate.get(d.date)?.total);
    row(`  конверсия, %`, (d) => { const c = g.byDate.get(d.date)?.conversion; return c == null ? "" : (c * 100).toFixed(1); });
  }
  console.log("Кластеры запросов Яндекса (визиты с видимой фразой):");
  for (const [name] of CLUSTERS) row(`  ${name}`, (d) => d.queryMetric ? d.clusters.get(name) ?? 0 : undefined);
  row("  вне кластеров", (d) => d.queryMetric ? d.other.reduce((s, x) => s + x[0], 0) : undefined);
}


if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const target = process.argv[2];
  if (!target || !fs.existsSync(target)) throw new Error("Provide a Metrika export directory");
  const { days, goals } = loadReports(target);
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ days, goals }, (_, value) => value instanceof Map ? Object.fromEntries(value) : value, 2));
  } else {
    console.log("Daily visitors are not period-unique users. Goals are events, not backend registrations. Blank cells mean missing data.");
    for (const goal of goals) if (goal.conflicts.length) console.warn(`${goal.name}: ${goal.conflicts.length} overlapping daily/period discrepancies; prefer daily exports. Details in --json.`);
    if (days.length === 1) printDay(days[0]); else { printComparison(days, goals); printWeekly(days, goals); }
    const gscIndex = process.argv.indexOf("--gsc");
    if (gscIndex >= 0) {
      const cutoffIndex = process.argv.indexOf("--complete-through");
      if (cutoffIndex < 0 || !/^\d{4}-\d{2}-\d{2}$/.test(process.argv[cutoffIndex + 1] || "")) throw new Error("GSC requires --complete-through YYYY-MM-DD; do not infer completeness from low traffic");
      printGsc(loadGsc(process.argv[gscIndex + 1], process.argv[cutoffIndex + 1]));
    }
  }
}
