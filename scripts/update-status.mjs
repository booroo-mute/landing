#!/usr/bin/env node
// Обновление строки статуса у страниц, которые живут по событиям
// (статусы Discord и Roblox, гайд по Steam, звонки в Telegram и WhatsApp).
//
//   node scripts/update-status.mjs <content/…md> "<строка статуса>" [--date YYYY-MM-DD] [--dry-run]
//   npm run status -- content/blog/discord-ne-rabotaet-segodnya.md "Проверено …"
//
// Ставит statusDate и updated на сегодня по Москве (или --date), заменяет
// statusLine, правит дату вида «16 сентября 2026» в первом абзаце и в шапке
// таблицы «Статус на …», затем запускает check-content. Если проверка не
// прошла, файл возвращается как был. Строки длиннее 220 символов и с
// переносами не принимаются: это одна строка под заголовком. Дальше
// `git commit`, `git push` и `scripts/deploy.sh`.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const dateIdx = args.indexOf("--date");
const forcedDate = dateIdx !== -1 ? args[dateIdx + 1] : undefined;
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--date");
const [file, line] = positional;

if (!file || !line) {
  console.error('Использование: node scripts/update-status.mjs <content/…md> "<строка статуса>" [--date YYYY-MM-DD] [--dry-run]');
  process.exit(1);
}
if (/\r|\n/.test(line)) fail("строка статуса не может содержать переносы");
if (line.trim().length === 0) fail("строка статуса пустая");
if (line.length > 220) fail(`строка статуса длиннее 220 символов (${line.length})`);
if (/(понедельник|вторник|сред[ау]|четверг|пятниц|суббот|воскресень)/iu.test(line)) {
  fail("без обещаний по дням недели в статусе: свежесть показывает дата «Статус на …»");
}

const abs = path.resolve(file);
if (!fs.existsSync(abs)) fail(`нет файла ${file}`);

const today =
  forcedDate ??
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) fail(`дата не в формате YYYY-MM-DD: ${today}`);

const original = fs.readFileSync(abs, "utf8");
const fm = original.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) fail("не нашёл frontmatter");

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const human = (iso) => {
  const [y, m, d] = iso.split("-");
  return { short: `${Number(d)} ${MONTHS[Number(m) - 1]}`, full: `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}` };
};

let front = fm[1];
const get = (key) => front.match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim().replace(/^"|"$/g, "");
const oldStatusDate = get("statusDate");
const yaml = (v) => JSON.stringify(v);
const setKey = (key, value) => {
  if (new RegExp(`^${key}:`, "m").test(front)) {
    front = front.replace(new RegExp(`^${key}:.*$`, "m"), `${key}: ${yaml(value)}`);
  } else {
    // новые поля ставим после date:, чтобы порядок был как у соседей
    front = front.replace(/^(date:.*)$/m, `$1\n${key}: ${yaml(value)}`);
  }
};
setKey("updated", today);
setKey("statusDate", today);
setKey("statusLine", line);

let body = original.slice(fm[0].length);
const changed = [];
if (oldStatusDate && oldStatusDate !== today) {
  const from = human(oldStatusDate), to = human(today);
  const lines = body.split("\n");
  let firstParagraphDone = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const isTableHeader = /^\|.*Статус на /.test(l);
    const isFirstParagraph = !firstParagraphDone && l.trim() && !l.startsWith("#") && !l.startsWith("![") && !l.startsWith("|");
    if (!isTableHeader && !isFirstParagraph) continue;
    if (isFirstParagraph) firstParagraphDone = true;
    const updated = l.replaceAll(from.full, to.full).replaceAll(from.short, to.short);
    if (updated !== l) { lines[i] = updated; changed.push(`${i + 1}: ${updated.trim().slice(0, 90)}`); }
  }
  body = lines.join("\n");
  // остальные упоминания старой даты автор решает сам: они могут быть историей
  lines.forEach((l, i) => {
    if ((l.includes(from.full) || l.includes(from.short)) && !changed.some((c) => c.startsWith(`${i + 1}:`))) {
      console.warn(`осталась старая дата, строка ${i + 1}: ${l.trim().slice(0, 90)}`);
    }
  });
}

const next = `---\n${front}\n---\n${body}`;
console.log(`${file}: statusDate/updated → ${today}, statusLine (${line.length} симв.)`);
for (const c of changed) console.log(`  дата в тексте, строка ${c}`);
if (dryRun) {
  console.log("--dry-run: файл не тронут");
  process.exit(0);
}

fs.writeFileSync(abs, next);
const check = spawnSync("node", ["scripts/check-content.mjs"], { stdio: "inherit" });
if (check.status !== 0) {
  fs.writeFileSync(abs, original);
  fail("check-content не прошёл, файл возвращён как был");
}
console.log("готово: git commit, git push, scripts/deploy.sh");

function fail(msg) {
  console.error(`update-status: ${msg}`);
  process.exit(1);
}
