#!/usr/bin/env node
// Сводка по выгрузкам Яндекс.Метрики за день или неделю.
// Запуск: node scripts/metrika-clusters.mjs <папка с csv-выгрузками>
// Читает отчёты «Посещаемость», «Источники, сводка», «Поисковые запросы» или
// «Поисковые системы» (табличный вариант «(1)»), «Популярное», «Сайты»;
// печатает итоги, источники, кластеры запросов Яндекса, страницы лендинга
// и цели, если выгрузка снята по цели.

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error("Укажите папку с выгрузками Метрики: node scripts/metrika-clusters.mjs reports/");
  process.exit(1);
}

const CLUSTERS = [
  ["бренд", /\bmute\b|мьют|\bмут\b|муте|мути|mute\.ac|\{mute\}/iu],
  ["roblox", /роблокс|roblox|\bрб\b|робокс|облоксе|робосе/iu],
  ["steam", /стим|steam|\bстив\b/iu],
  ["discord", /дискорд|discord|запрет|\bдс\b|дискор|обход/iu],
  ["голосовой чат", /голосов|войс|voice|аудио|общени|созвон|разговар|звонок|звонк|позвонить|связь/iu],
  ["telegram/whatsapp", /телеграм|\bтг\b|ватсап|whatsapp/iu],
  ["экран/фильм", /фильм|кино|мультик|экран|демк/iu],
  ["cs/dota/fortnite/pubg", /\bкс\b|кс2|дот|фортнайт|пабг|pubg|варфейс|warface/iu],
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

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
const read = (f) => parseCsv(fs.readFileSync(path.join(dir, f), "utf8").replace(/^﻿/, ""));
const pick = (prefix) =>
  files
    .filter((f) => f.startsWith(prefix))
    .map((f) => ({ f, rows: read(f) }))
    .filter((x) => x.rows.length && x.rows.length !== 145 && x.rows.length !== 1009) // не временные ряды
    .sort((a, b) => b.rows.length - a.rows.length)[0];

const num = (v) => Number(String(v ?? "").replace(",", ".")) || 0;
const fmt = (n) => n.toLocaleString("ru-RU");

const total = pick("Посещаемость");
if (total) {
  const h = total.rows[0], t = total.rows[1];
  console.log("== Итого");
  h.forEach((k, i) => { if (i) console.log(`  ${k}: ${t[i]}`); });
}

const src = pick("Источники, сводка");
if (src) {
  console.log("\n== Источники");
  const h = src.rows[0];
  const vi = h.findIndex((x) => /^Визиты|Целевые визиты|Достижения/.test(x));
  for (const r of src.rows.slice(2)) console.log(`  ${(r[1] !== "Не определено" ? r[1] : r[0]).padEnd(32)} ${r[vi] ?? ""}`);
}

const q = pick("Поисковые запросы") ?? pick("Поисковые системы");
if (q) {
  const h = q.rows[0];
  const vi = h.findIndex((x) => /^Визиты|Целевые визиты|Достижения/.test(x));
  const tot = new Map(), cnt = new Map(), other = [];
  let undefinedByEngine = [];
  for (const r of q.rows.slice(1)) {
    const engines = ["Яндекс", "Google", "Bing", "Yahoo!", "Не определено"];
    const phrase = engines.includes(r[0]) && !engines.includes(r[1]) ? r[1] : r[0];
    const engine = phrase === r[1] ? r[0] : r[1];
    const v = num(r[vi]);
    if (phrase === "Итого и средние") continue;
    if (phrase === "Не определено") { undefinedByEngine.push(`${engine} ${v}`); continue; }
    const hit = CLUSTERS.find(([, re]) => re.test(phrase));
    if (hit) { tot.set(hit[0], (tot.get(hit[0]) ?? 0) + v); cnt.set(hit[0], (cnt.get(hit[0]) ?? 0) + 1); }
    else other.push([v, phrase]);
  }
  console.log(`\n== Кластеры запросов (${h[vi]}); без фразы: ${undefinedByEngine.join(", ")}`);
  for (const [name] of CLUSTERS) console.log(`  ${name.padEnd(24)} ${String(tot.get(name) ?? 0).padStart(5)}  фраз ${cnt.get(name) ?? 0}`);
  other.sort((a, b) => b[0] - a[0]);
  console.log(`  вне кластеров: ${other.reduce((s, x) => s + x[0], 0)}; примеры: ${other.slice(0, 8).map((x) => x[1]).join(" | ")}`);
}

const pop = pick("Популярное");
if (pop) {
  console.log("\n== Страницы лендинга (просмотры / посетители)");
  for (const r of pop.rows.slice(2)) {
    const url = r[4] ?? r[0];
    if (!url.startsWith("https://mute.ac")) continue;
    console.log(`  ${url.replace("https://mute.ac", "").padEnd(56)} ${r[5]} / ${r[6]}`);
  }
}

const sites = pick("Сайты");
if (sites) {
  console.log("\n== Внешние рефереры");
  for (const r of sites.rows.slice(2)) if (r[4] !== "Не определено") console.log(`  ${r[4].padEnd(40)} ${r[5]}`);
}
