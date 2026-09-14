#!/usr/bin/env node
// Проверка контента перед сборкой (npm run check:content, вызывается из prebuild).
//
// 1. Frontmatter статей: обязательные поля, даты не из будущего (по Москве),
//    updated не раньше date, description не длиннее 160 символов (Bing и
//    Яндекс обрезают или подменяют сниппет), title длиннее 70 — предупреждение.
// 2. Запрещённые формулировки в публичных текстах и внутренних документах:
//    названия утилит и тема возврата доступа к заблокированным сервисам,
//    имя регулятора вне юридических страниц, VPN вне связки «без VPN»
//    (позиционирование Mute) и «VPN не нужен/не требуется».
//
// Выход с кодом 1 при любой ошибке; предупреждения сборку не останавливают.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const errors = [];
const warnings = [];

const todayMoscow = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Moscow",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DESCRIPTION = 160;
const MAX_TITLE_WARN = 70;

// ---------- 1. Frontmatter ----------

const CONTENT_RULES = {
  blog: { description: true, date: true },
  games: { description: true, date: true },
  install: { description: true, date: true },
  releases: { description: false, date: true },
};

function listFiles(dir, pattern) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(rel, pattern));
    else if (pattern.test(entry.name)) out.push(rel);
  }
  return out;
}

function checkFrontmatter() {
  for (const [section, rules] of Object.entries(CONTENT_RULES)) {
    for (const rel of listFiles(path.join("content", section), /\.md$/)) {
      const { data } = matter(fs.readFileSync(path.join(ROOT, rel), "utf8"));
      const where = `${rel}:1`;

      if (!data.title) errors.push(`${where}: нет title`);
      else if (String(data.title).length > MAX_TITLE_WARN) {
        warnings.push(`${where}: title длиннее ${MAX_TITLE_WARN} символов (${String(data.title).length})`);
      }

      if (rules.description && !data.description) errors.push(`${where}: нет description`);
      if (data.description && String(data.description).length > MAX_DESCRIPTION) {
        errors.push(`${where}: description длиннее ${MAX_DESCRIPTION} символов (${String(data.description).length})`);
      }

      const date = data.date ? String(data.date).slice(0, 10) : undefined;
      const updated = data.updated ? String(data.updated).slice(0, 10) : undefined;

      if (rules.date && !date) errors.push(`${where}: нет date`);
      for (const [name, value] of [["date", date], ["updated", updated]]) {
        if (value === undefined) continue;
        if (!ISO_DATE.test(value)) {
          errors.push(`${where}: ${name} не в формате YYYY-MM-DD (${value})`);
        } else if (value > todayMoscow) {
          errors.push(`${where}: ${name} из будущего (${value}, сегодня по Москве ${todayMoscow})`);
        }
      }
      if (date && updated && updated < date) {
        errors.push(`${where}: updated (${updated}) раньше date (${date})`);
      }
    }
  }
}

// ---------- 2. Запрещённые формулировки ----------

const SCAN_DIRS = ["content", "app", "components", "lib", "docs"];
const SCAN_FILES = ["README.md"];
const SCAN_EXT = /\.(md|mdx|ts|tsx|js|mjs|txt)$/;
// Юридические страницы обязаны ссылаться на регулятора (приказ № 179, право обжалования).
const LEGAL_PAGES = [/^app\/privacy\//, /^app\/terms\//, /^app\/delete-account\//];

// Всегда запрещено: утилиты и сама тема возврата доступа к заблокированным сервисам.
const ALWAYS_FORBIDDEN =
  /zapret|goodbye ?dpi|(?<![a-z])dpi(?![a-z])|обходчик|обход блокиров|в обход|обходн(?:ые|ых|ыми|ая|ой) настро/iu;
// Имя регулятора — только на юридических страницах.
const REGULATOR = /роскомнадзор|(?<![а-яё])ркн(?![а-яё])|roskomnadzor/iu;
// Допустимые формы: позиционирование Mute. Вырезаются перед проверкой.
// «Нужен ли VPN для Mute? Нет» — вопрос из поиска с ответом про Mute; bez-vpn/no-vpn — слаги и англоязычные тексты.
const VPN_ALLOWED =
  /без vpn|без впн|without (?:a )?vpn|vpn не (?:нужен|нужно|нужны|требуется)|нужен ли (?:vpn|впн)|bez-vpn|no-vpn|vpn-free/giu;
const VPN = /(?<![a-z])vpn(?![a-z])|впн/iu;

function checkForbidden() {
  const files = [
    ...SCAN_DIRS.flatMap((dir) => listFiles(dir, SCAN_EXT)),
    ...SCAN_FILES.filter((f) => fs.existsSync(path.join(ROOT, f))),
  ];

  for (const rel of files) {
    const isLegal = LEGAL_PAGES.some((re) => re.test(rel));
    const lines = fs.readFileSync(path.join(ROOT, rel), "utf8").split("\n");
    lines.forEach((line, i) => {
      const where = `${rel}:${i + 1}`;
      if (ALWAYS_FORBIDDEN.test(line)) {
        errors.push(`${where}: упоминание утилит или темы возврата доступа: «${line.trim().slice(0, 90)}»`);
      }
      if (!isLegal && REGULATOR.test(line)) {
        errors.push(`${where}: имя регулятора вне юридических страниц: «${line.trim().slice(0, 90)}»`);
      }
      const stripped = line.replace(VPN_ALLOWED, "");
      if (VPN.test(stripped)) {
        errors.push(`${where}: VPN вне связки «без VPN»: «${line.trim().slice(0, 90)}»`);
      }
    });
  }
}

checkFrontmatter();
checkForbidden();

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);

if (errors.length) {
  console.error(`\ncheck-content: ${errors.length} ошибок, ${warnings.length} предупреждений`);
  process.exit(1);
}
console.log(`check-content: ок (${warnings.length} предупреждений, сегодня по Москве ${todayMoscow})`);
