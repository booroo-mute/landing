#!/usr/bin/env node
// Local browser regression: installers, app navigation and analytics are intercepted.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.MUTE_PREVIEW_URL || 'http://127.0.0.1:3099';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Local preview only');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const cases = [
  ['Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'download_win', '.exe'],
  ['Mac', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'download_mac', '.dmg'],
  ['Android', 'Mozilla/5.0 (Linux; Android 14) Mobile', 'open_web', '/welcome'],
  ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', 'open_web', '/welcome'],
  ['iPad desktop UA', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'open_web', '/welcome', true],
  ['Linux', 'Mozilla/5.0 (X11; Linux x86_64)', null, null],
  ['Unknown', 'Unknown platform', null, null],
];
try {
  for (const [name, userAgent, goal, target, touch] of cases) {
    const goals = [], destinations = [], errors = [];
    const context = await browser.newContext({ userAgent, hasTouch: Boolean(touch) });
    if (touch) await context.addInitScript(() => {
      Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });
    });
    await context.exposeBinding('recordDownloadTestGoal', (_, ...args) => {
      if (args[1] === 'reachGoal') goals.push({ name: args[2], params: args[3] });
    });
    await context.addInitScript(() => { window.ym = (...args) => window.recordDownloadTestGoal(...args); });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === base) return route.continue();
      if (url.hostname === 'beta.mute.ac') {
        destinations.push(url);
        // HTTP 204 simulates a download navigation without fetching an installer.
        return route.fulfill({ status: url.pathname === '/welcome' ? 200 : 204, contentType: 'text/html', body: '' });
      }
      return route.fulfill({ status: 200, body: '' });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/download');
    await page.waitForTimeout(1500);
    assert.equal(destinations.length, target ? 1 : 0, name);
    assert.equal(goals.length, goal ? 1 : 0, name);
    if (target) {
      assert.ok(destinations[0].pathname.endsWith(target), name);
      assert.equal(goals[0].name, goal, name);
      assert.equal(goals[0].params.auto, true, name);
      assert.equal(goals[0].params.page, 'download', name);
    }
    if (goal === 'open_web') {
      assert.equal(destinations[0].searchParams.get('mute_placement'), 'auto-redirect', name);
    } else {
      assert.equal(new URL(page.url()).pathname, '/download', name);
      assert.equal(await page.locator('h1').count(), 1, name);
      if (goal === 'download_mac') assert.ok(await page.getByText(/Apple Silicon \(M1/).count());
      const suffix = target || '.exe';
      await page.locator(`a[href$="${suffix}"]`).click();
      await page.waitForTimeout(200);
      assert.equal(destinations.length, target ? 2 : 1, name + ' manual fallback');
      assert.equal(goals.length, goal ? 2 : 1, name + ' manual goal');
      assert.equal(goals.at(-1).params.auto, undefined, name);
    }
    assert.deepEqual(errors, [], name);
    await context.close();
    console.log('PASS:', name);
  }
} finally { await browser.close(); }
