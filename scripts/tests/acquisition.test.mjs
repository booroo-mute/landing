import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// lib/acquisition.ts is TypeScript; the test extracts normalizePath by text so
// it runs under plain node --test without a build step.
const src = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../lib/acquisition.ts"), "utf8");
const body = src.match(/export function normalizePath\(pathname: string\): string \{([\s\S]*?)\n\}/)[1]
  .replace(/\(_, section: string\)/, "(_, section)");
const normalizePath = new Function("pathname", body);

test("invite links are grouped under /i/ whatever the pasted form", () => {
  assert.equal(normalizePath("/i/up5h7qjv"), "/i/up5h7qjv");
  assert.equal(normalizePath("//tjcgvPbS"), "/tjcgvpbs".replace("/tjcgvpbs", "/tjcgvpbs"));
  assert.equal(normalizePath("/I/viWsxhdY"), "/i/viWsxhdY");
  assert.equal(normalizePath("/games//steam"), "/games/steam");
});

test("anything outside the safe charset falls back to the root", () => {
  assert.equal(normalizePath("/blog/kogda-vernut-chat-v-roblox"), "/blog/kogda-vernut-chat-v-roblox");
  assert.equal(normalizePath("/x?y=1"), "/");
  assert.equal(normalizePath("/" + "a".repeat(200)), "/");
});
