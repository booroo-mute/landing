#!/usr/bin/env node
// Local production-build check. No requests reach analytics or installer hosts.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.env.MUTE_PREVIEW_URL || 'http://127.0.0.1:3099';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Local preview only');
const browser=await chromium.launch({channel:'chrome',headless:true});
const blockExternal=async ctx=>ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.fulfill({status:200,body:''}));
try {
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await blockExternal(ctx);
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/?utm_source=qa&utm_medium=test&token=private');
 await p.waitForFunction(()=>window.ym?.a?.some(x=>x[1]==='hit'));
 const hits=()=>p.evaluate(()=>Array.from(window.ym.a).filter(x=>x[1]==='hit').map(x=>x[2]));
 assert.equal((await hits()).length,1);assert.ok(!(await hits())[0].includes('private'));
 await p.locator('header a[href="/voice-chat"]').click();await p.waitForURL('**/voice-chat');
 await p.waitForFunction(()=>Array.from(window.ym.a).filter(x=>x[1]==='hit').length===2);assert.equal((await hits()).length,2);
 // Platform download routing is covered by scripts/verify-download-flow.mjs.
 for(const [name,ua,width] of [
 ['windows','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',1440],
 ['mac','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',1440],
 ['android','Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36',390],
 ['iphone','Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',390],
 ['linux','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',1440]]){
  const c=await browser.newContext({userAgent:ua,viewport:{width,height:950},reducedMotion:'reduce'});await blockExternal(c);const page=await c.newPage();
  await page.goto(base);await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} overflow`);
  await page.screenshot({path:`/tmp/mute-${name}.png`});await c.close();
 }
 const xml=await(await p.request.get(base+'/sitemap.xml')).text();const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]),titles=new Set();
 for(const url of urls){
  const route=new URL(url).pathname,response=await p.request.get(base+route);assert.equal(response.status(),200,route);const html=await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,route);const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert.ok(title);assert.ok(!titles.has(title),route);titles.add(title);
  assert.ok(html.includes(`rel="canonical" href="${url}"`),`canonical ${route}`);assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html),route);
 }
 const redirect=await p.request.get(base+'/blog/golosovoy-chat-v-brauzере',{maxRedirects:0});assert.equal(redirect.status(),308);assert.ok(redirect.headers().location.endsWith('/blog/golosovoy-chat-v-brauzere'));
 assert.equal((await p.request.get(base+'/missing-seo-test')).status(),404);assert.deepEqual(errors,[]);
 console.log(`PASS: ${urls.length} sitemap pages, SPA hits, five simulated platforms, redirect and 404. Screenshots /tmp/mute-*.png`);
 await ctx.close();
}finally{await browser.close();}
