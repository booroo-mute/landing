#!/usr/bin/env node
// Сводка по выгрузкам Яндекс.Метрики.
//
//   node scripts/metrika-clusters.mjs <папка за день>     один день: итоги, источники,
//                                                          кластеры запросов, страницы
//   node scripts/metrika-clusters.mjs <папка с днями>     папка, где лежат подпапки
//                                                          по дням: таблица день к дню
//                                                          и почасовые регистрации
//
// Папка дня: отчёты «Посещаемость», «Источники, сводка», «Поисковые запросы»
// (или «Поисковые системы»), «Популярное», «Сайты» — табличный вариант «(1)»
// и временной ряд без суффикса. Папки целей («регистрации», «открыл скачать»)
// с «Посещаемость-<дата>…csv» по каждому дню кладутся рядом с папками дней и
// подхватываются сами. Без зависимостей.

import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];
if (!target || !fs.existsSync(target)) {
  console.error("Укажите папку с выгрузками Метрики: node scripts/metrika-clusters.mjs reports/");
  process.exit(1);
}

// Первое совпадение выигрывает, поэтому игры стоят раньше общего «голосового чата»:
// иначе «не работает голосовой чат в варфейс» уходил в общий кластер. \b в JS
// кириллицы не знает (между пробелом и «к» границы слова нет), короткие слова
// обрамляем просмотром: (?<![а-яё])кс(?![а-яё]).
const CLUSTERS = [
  ["бренд", /(?<![a-z])mute(?![a-z])|мьют|(?<![а-яё])мут(?![а-яё])|муте|мути|mute\.ac|\{mute\}/iu],
  ["roblox", /роблокс|roblox|(?<![а-яё])рб(?![а-яё])|робокс|облоксе|робосе/iu],
  ["steam", /стим|steam|(?<![а-яё])стив(?![а-яё])/iu],
  ["discord", /дискорд|discord|запрет|(?<![а-яё])дс(?![а-яё])|дискор|обход/iu],
  ["cs/dota/fortnite/pubg", /(?<![а-яё])кс(?![а-яё])|кс2|дот|фортнайт|пабг|pubg/iu],
  ["warface/valorant/arc", /варфейс|warface|валорант|valorant|arc raiders|арк р[ае]йд/iu],
  ["кооп/проксимити", /(?<![а-яё])репо(?![а-яё])|(?<![a-z])r\.?e\.?p\.?o(?![a-z])|(?<![а-яё])пик(?![а-яё])|(?<![a-z])peak(?![a-z])|content warning|контент ворнинг|фазмо|phasmo|проксимити|proximity|lethal|летал|sea of thieves|(?<![a-z])squad(?![a-z])|сквад/iu],
  ["нет войса", /геншин|genshin|амонг|among|(?<![а-яё])лол(?![а-яё])|league of legends|лига легенд|террари|terraria|(?<![а-яё])дбд(?![а-яё])|dead by daylight|валхейм|valheim|satisfactory|сатисфактор|балдур|baldur|(?<![a-z])bg3(?![a-z])|палворлд|palworld|диабло|diablo|форз|forza|(?<![a-z])raft(?![a-z])|(?<![а-яё])рафт(?![а-яё])|сталкрафт|stalcraft|(?<![a-z])tf2(?![a-z])|тф2|team fortress|(?<![a-z])ets ?2(?![a-z])|етс ?2|нет голосового чата|без голосового чата/iu],
  ["стрим/показать", /стрим|показать игру|транслир|(?<![a-z])obs(?![a-z])|(?<![а-яё])обс(?![а-яё])/iu],
  ["звонок в россию", /в росси[юи] из|из-за границы|родител|за границ|звон[а-яё]* в росси[юи]/iu],
  ["голосовой чат", /голосов|войс|voice|аудио|общени|созвон|разговар|звонок|звонк|позвонить|связь/iu],
  ["telegram/whatsapp", /телеграм|(?<![а-яё])тг(?![а-яё])|ватсап|whatsapp/iu],
  ["экран/фильм", /фильм|кино|мультик|экран|демк|аниме|сериал|ютуб|youtube/iu],
];

function parseCsv(text) {
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
const dateOf = (f) => f.match(/-(\d{4}-\d{2}-\d{2})-/)?.[1];
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
function loadDay(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
  const byPrefix = (prefix) => files.filter((f) => f.startsWith(prefix)).map((f) => ({ f, rows: readCsv(dir, f) }));
  const table = (prefix) => byPrefix(prefix).filter((x) => x.rows.length && !isSeries(x.rows)).sort((a, b) => b.rows.length - a.rows.length)[0];
  const series = (prefix) => byPrefix(prefix).find((x) => isSeries(x.rows));

  const day = { dir, date: files.map(dateOf).find(Boolean) ?? path.basename(dir), clusters: new Map(), clusterPhrases: new Map(), other: [], hidden: [] };

  const total = table("Посещаемость");
  if (total) {
    const h = total.rows[0], t = total.rows[1];
    day.totals = Object.fromEntries(h.map((k, i) => [k, t[i]]).filter(([, v], i) => i));
    day.visits = num(t[h.indexOf("Визиты")]);
    day.visitors = num(t[h.indexOf("Посетители")]);
    day.views = num(t[h.indexOf("Просмотры")]);
  }
  const visitsSeries = series("Посещаемость");
  if (visitsSeries) day.hourlyVisits = hourly(visitsSeries.rows, 1);

  const src = table("Источники, сводка");
  if (src) {
    const h = src.rows[0];
    const vi = h.findIndex((x) => /^Визиты|Целевые визиты|Достижения/.test(x));
    day.sources = src.rows.slice(2).map((r) => ({ name: r[1] !== "Не определено" ? r[1] : r[0], visits: num(r[vi]) }));
    const by = (name) => day.sources.find((s) => s.name === name)?.visits ?? 0;
    day.yandex = by("Яндекс"); day.google = by("Google"); day.direct = by("Прямые заходы");
    day.internal = by("Внутренние переходы"); day.steam = by("steamcommunity.com");
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
    day.pages = pop.rows.slice(2).map((r) => ({ url: r[4] ?? r[0], views: num(r[5]), visitors: num(r[6]) }));
    day.landingViews = day.pages.filter((p) => p.url.startsWith("https://mute.ac")).reduce((s, p) => s + p.views, 0);
    day.betaViews = day.pages.filter((p) => p.url.startsWith("https://beta.mute.ac")).reduce((s, p) => s + p.views, 0);
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
function loadGoalFolder(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
  const goals = new Map();
  const seriesByDate = new Map();
  for (const f of files) {
    const date = dateOf(f);
    if (!date) continue;
    const rows = readCsv(dir, f);
    if (isSeries(rows)) { seriesByDate.set(date, hourly(rows, 1)); continue; }
    const h = rows[0];
    const ai = h.findIndex((x) => x.startsWith("Достижения цели"));
    const name = h[ai]?.match(/\((.+)\)/)?.[1];
    if (!name) continue;
    const goal = goals.get(name) ?? { name, byDate: new Map() };
    const ci = h.findIndex((x) => x.startsWith("Конверсия"));
    goal.byDate.set(date, { total: num(rows[1]?.[ai]), conversion: num(rows[1]?.[ci]) });
    goals.set(name, goal);
  }
  if (goals.size === 1) {
    const [goal] = goals.values();
    for (const [date, h] of seriesByDate) goal.byDate.set(date, { ...(goal.byDate.get(date) ?? {}), hourly: h });
  }
  return [...goals.values()];
}

/**
 * Папка gsc/: выгрузки Search Console (Performance → Export → CSV). Файлы
 * «Запросы» и «Страницы» с колонками клики/показы/CTR/позиция, язык
 * интерфейса любой. Печатаем топ по кликам с позицией: это единственный
 * источник запросов Google, Метрика их не показывает.
 */
function loadGsc(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".csv"))) {
    const rows = readCsv(dir, f);
    const h = rows[0] ?? [];
    const ci = h.findIndex((x) => /^(Клики|Clicks)$/i.test(x));
    const ii = h.findIndex((x) => /^(Показы|Impressions)$/i.test(x));
    const pi = h.findIndex((x) => /^(Позиция|Position)$/i.test(x));
    if (ci === -1 || ii === -1) continue;
    const items = rows.slice(1).map((r) => ({ key: r[0], clicks: num(r[ci]), impressions: num(r[ii]), position: pi === -1 ? null : num(r[pi]) }))
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
    for (const p of day.pages) if (p.url.startsWith("https://mute.ac")) console.log(`  ${p.url.replace("https://mute.ac", "").padEnd(56)} ${p.views} / ${p.visitors}`);
  }
  if (day.referrers) {
    console.log("\n== Внешние рефереры");
    for (const r of day.referrers) console.log(`  ${r.site.padEnd(40)} ${r.visits}`);
  }
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
  row("Просмотры beta.mute.ac", (d) => d.betaViews);
  for (const g of goals) {
    row(`Цель: ${g.name}`.slice(0, 30), (d) => g.byDate.get(d.date)?.total);
    row(`  конверсия, %`, (d) => { const c = g.byDate.get(d.date)?.conversion; return c === undefined ? "" : (c * 100).toFixed(1); });
  }
  console.log("Кластеры запросов Яндекса (визиты с видимой фразой):");
  for (const [name] of CLUSTERS) row(`  ${name}`, (d) => d.clusters.get(name) ?? 0);
  row("  вне кластеров", (d) => d.other.reduce((s, x) => s + x[0], 0));
}

function printHourly(days, goals) {
  for (const g of goals) {
    const rows = days.map((d) => ({ d, h: g.byDate.get(d.date)?.hourly }));
    if (!rows.some((r) => r.h)) continue;
    console.log(`\n== По часам: ${g.name} / визиты из поиска`);
    console.log("час  " + days.map((d) => d.date.slice(5).padStart(9)).join(""));
    for (let hour = 0; hour < 24; hour++) {
      const cells = rows.map(({ d, h }) => `${h ? h[hour] : "-"}/${d.hourlySearch ? d.hourlySearch[hour] : "-"}`.padStart(9));
      console.log(`${String(hour).padStart(2, "0")}:00${cells.join("")}`);
    }
  }
}

const hasCsv = fs.readdirSync(target).some((f) => f.endsWith(".csv"));
if (hasCsv) {
  printDay(loadDay(target));
} else {
  const subdirs = fs.readdirSync(target, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => path.join(target, e.name));
  const days = [], goals = [], gsc = [];
  for (const dir of subdirs) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
    if (!files.length) continue;
    if (/^gsc$/i.test(path.basename(dir))) { gsc.push(...loadGsc(dir)); continue; }
    const onlyVisits = files.every((f) => f.startsWith("Посещаемость"));
    if (onlyVisits) goals.push(...loadGoalFolder(dir));
    else days.push(loadDay(dir));
  }
  days.sort((a, b) => (a.date < b.date ? -1 : 1));
  if (!days.length) { console.error("В папке нет подпапок с выгрузками за день"); process.exit(1); }
  printComparison(days, goals);
  printHourly(days, goals);
  printGsc(gsc);
}
