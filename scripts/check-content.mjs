#!/usr/bin/env node
// Проверка контента перед сборкой (npm run check:content, вызывается из prebuild).
//
// 1. Frontmatter статей: обязательные поля, даты не из будущего (по Москве),
//    updated не раньше date, description не длиннее 160 символов (Bing и
//    Яндекс обрезают или подменяют сниппет), title длиннее 70 без seoTitle
//    и seoTitle длиннее 58 (в <title> добавляется « — Mute») — предупреждение.
// 2. Запрещённые формулировки в публичных текстах и внутренних документах:
//    названия утилит и тема возврата доступа к заблокированным сервисам,
//    имя регулятора вне юридических страниц, VPN вне допустимых форм.
//    С 3 ноября 2026 (решение Alex) правило «описывать можно, инструктировать
//    нельзя»: допустимы «без VPN» (позиционирование Mute), «VPN не нужен» и
//    описания вида «если играете через VPN, голос в игре может не работать».
//    По-прежнему нельзя: названия утилит, инструкции по туннелю (исключить
//    подсеть или домен, маршрут, DNS, hosts) и совет «Discord через VPN».
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
// В <title> к seoTitle добавляется « — Mute» (7 символов): 58 + 7 = 65, дальше выдача режет.
const MAX_SEO_TITLE_WARN = 58;

// ---------- 1. Frontmatter ----------

// Тот же список, что GAME_TOPICS в lib/games.ts: неизвестное значение там молча превращалось в «Настройку».
const GAME_TOPICS = ["broken", "novoice", "setup"];

// Черновики, которые ждут проверки фактов: сайт папку не читает, а правила те же.
const CONTENT_BASES = ["content", path.join("content", "drafts")];

const CONTENT_RULES = {
  blog: { description: true, date: true },
  games: { description: true, date: true },
  install: { description: true, date: true },
  releases: { description: false, date: true },
  landings: { description: true, date: true },
  help: { description: true, date: true },
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
    for (const rel of CONTENT_BASES.flatMap((base) => listFiles(path.join(base, section), /\.md$/))) {
      const { data, content } = matter(fs.readFileSync(path.join(ROOT, rel), "utf8"));
      const where = `${rel}:1`;

      // Пометка для проверки фактов допустима только в черновике.
      if (!rel.startsWith(path.join("content", "drafts")) && /ПРОВЕРИТЬ/u.test(content)) {
        errors.push(`${where}: в тексте осталась пометка ПРОВЕРИТЬ, страница не готова к публикации`);
      }

      if (section === "games") {
        if (data.topic === undefined) {
          warnings.push(`${where}: нет topic (${GAME_TOPICS.join(", ")}), гайд попадёт в «Настройку»`);
        } else if (!GAME_TOPICS.includes(String(data.topic))) {
          errors.push(`${where}: topic «${data.topic}» не из списка ${GAME_TOPICS.join(", ")}`);
        }
      }

      // ctaBefore должен указывать на существующий H2, иначе баннер молча уедет на место по умолчанию.
      if (data.ctaBefore) {
        const needle = String(data.ctaBefore).trim().toLowerCase();
        const found = content.split("\n").some((l) => /^##\s/.test(l) && l.replace(/^##\s+/, "").trim().toLowerCase().startsWith(needle));
        if (!found) errors.push(`${where}: ctaBefore «${data.ctaBefore}» не совпадает ни с одним H2`);
      }

      if (!data.title) errors.push(`${where}: нет title`);
      else if (!data.seoTitle && String(data.title).length > MAX_TITLE_WARN) {
        warnings.push(`${where}: title длиннее ${MAX_TITLE_WARN} символов (${String(data.title).length}), задайте seoTitle`);
      }
      if (data.seoTitle && String(data.seoTitle).length > MAX_SEO_TITLE_WARN) {
        warnings.push(`${where}: seoTitle длиннее ${MAX_SEO_TITLE_WARN} символов (${String(data.seoTitle).length}), в выдаче будет обрезан`);
      }
      if (data.seoTitle && data.seoTitle === data.title) {
        warnings.push(`${where}: seoTitle совпадает с title, поле лишнее`);
      }

      if (rules.description && !data.description) errors.push(`${where}: нет description`);
      if (data.description && String(data.description).length > MAX_DESCRIPTION) {
        errors.push(`${where}: description длиннее ${MAX_DESCRIPTION} символов (${String(data.description).length})`);
      }

      const date = data.date ? String(data.date).slice(0, 10) : undefined;
      const updated = data.updated ? String(data.updated).slice(0, 10) : undefined;
      const statusDate = data.statusDate ? String(data.statusDate).slice(0, 10) : undefined;

      if ((statusDate && !data.statusLine) || (!statusDate && data.statusLine)) {
        errors.push(`${where}: statusDate и statusLine задаются вместе`);
      }
      if (data.statusLine && String(data.statusLine).length > 220) {
        warnings.push(`${where}: statusLine длиннее 220 символов, это одна строка под заголовком`);
      }

      if (rules.date && !date) errors.push(`${where}: нет date`);
      for (const [name, value] of [["date", date], ["updated", updated], ["statusDate", statusDate]]) {
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
// Допустимые формы вырезаются перед проверкой: позиционирование Mute («без VPN»,
// «VPN не нужен», «нужен ли VPN»), слаги bez-vpn/no-vpn, и с 3 ноября 2026
// описательные формы: «через VPN», «под VPN», «с включённым VPN», «VPN-туннель»,
// «VPN включён/выключен/мешает». Любое другое упоминание остаётся ошибкой.
const VPN_ALLOWED =
  /без vpn|без впн|without (?:a )?vpn|vpn не (?:нужен|нужно|нужны|требуется)|нужен ли (?:vpn|впн)|bez-vpn|no-vpn|vpn-free|(?:через|под|при|из-за|(?:в|вы|от|под)?ключ[а-яё]*|активн[а-яё]*|работа[а-яё]*|стоит|установлен[а-яё]*|выключ[а-яё]*) (?:vpn|впн)|(?:vpn|впн)[- ]?(?:туннел|соединен|подключен|сервис|приложен|программ|клиент)[а-яё]*|(?:vpn|впн) (?:включ|выключ|отключ|работа|меша|лома)[а-яё]*/giu;
const VPN = /(?<![a-z])vpn(?![a-z])|впн/iu;
// Инструкции по туннелю (исключить подсеть или домен, маршрут, DNS, hosts) запрещены всегда.
const VPN_INSTRUCT =
  /(?:исключ|добав|пропис|пропиш|настро|созда)[а-яё]*[^.\n]{0,40}(?:подсет|домен|маршрут)[а-яё]*[^.\n]{0,40}(?:vpn|впн|туннел|обход)|(?:vpn|впн|туннел)[^.\n]{0,60}(?:исключ|добав|пропис|пропиш)[а-яё]*[^.\n]{0,30}(?:подсет|домен|адрес|маршрут)|(?:split[- ]?tunnel|раздельн[а-яё]* туннел|hosts|(?<![a-z])dns(?![a-z]))[^.\n]{0,50}(?:vpn|впн|туннел|обход)/iu;
// «Discord через VPN» как совет запрещён: Discord описывается только как «не открывается».
const DISCORD_VIA_VPN =
  /(?:discord|дискорд)[^.\n]{0,40}(?:через|с|под) (?:vpn|впн)|(?:через|с|под) (?:vpn|впн)[^.\n]{0,40}(?:discord|дискорд)/iu;

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
      if (VPN_INSTRUCT.test(line)) {
        errors.push(`${where}: инструкция по VPN или туннелю: «${line.trim().slice(0, 90)}»`);
      }
      if (DISCORD_VIA_VPN.test(line)) {
        errors.push(`${where}: «Discord через VPN»: «${line.trim().slice(0, 90)}»`);
      }
      const stripped = line.replace(VPN_ALLOWED, "");
      if (VPN.test(stripped)) {
        errors.push(`${where}: VPN вне допустимых форм (без VPN / через VPN …): «${line.trim().slice(0, 90)}»`);
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
