// Факты о продукте живут в lib/facts.ts. Тест ловит две вещи, которые
// расходились по сайту до 17.11.2026: утверждения «push-to-talk нет» без
// уточнения про веб-версию и номера версий, вписанные руками вне lib/downloads.ts
// и постов о релизах.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCAN = ["app", "components", "lib", "content"];
const SKIP = new Set([path.join("lib", "downloads.ts"), path.join("lib", "facts.ts")]);

function* files(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(tsx?|mdx?|mjs)$/.test(e.name)) yield p;
  }
}
const sources = SCAN.flatMap((d) => [...files(path.join(root, d))])
  .map((p) => path.relative(root, p))
  .filter((p) => !SKIP.has(p));
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

test("никто не пишет, что режима рации / push-to-talk нет (он есть в приложениях)", () => {
  const bad = /(push-to-talk|нажми и говори|режима? рации)[^.\n]{0,40}\b(нет|не предусмотрен|отсутствует)\b(?![^.\n]*веб)/iu;
  const hits = sources.filter((p) => bad.test(read(p)));
  assert.deepEqual(hits, [], `формулировки про отсутствие PTT: ${hits.join(", ")}`);
});

test("номера версий приложений не вписаны руками вне lib/downloads.ts и релизов", () => {
  const version = /\b(?:версия|version|v)\s*1\.\d+\.\d+\b/iu;
  const hits = sources
    .filter((p) => !p.startsWith(path.join("content", "releases")) && !p.startsWith(path.join("content", "blog")))
    .filter((p) => version.test(read(p)));
  assert.deepEqual(hits, [], `захардкоженные версии: ${hits.join(", ")}`);
});

test("lib/facts.ts согласован с lib/downloads.ts и имеет дату сверки", async () => {
  const facts = read(path.join("lib", "facts.ts"));
  assert.match(facts, /lastReviewed: "\d{4}-\d{2}-\d{2}"/);
  assert.match(facts, /versions: DOWNLOAD_CONFIG\.versions/);
});
