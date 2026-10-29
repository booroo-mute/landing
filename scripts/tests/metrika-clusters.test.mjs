import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadReports, loadGoalFolder, loadGsc, parseCsv, isoWeekStart, weeklySummary } from '../metrika-clusters.mjs';
const csv = rows => rows.map(row => row.map(x => `"${String(x).replaceAll('"', '""')}"`).join(',')).join('\n');
function fixture(t) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mute-reports-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true })); return dir; }
function put(dir, file, rows) { fs.writeFileSync(path.join(dir, file), csv(rows)); }
const goalHeader = ['Интервал дат визита', 'Достижения цели (Download)', 'Целевые визиты (Download)', 'Конверсия (Download)'];

test('BOM, quoted commas, escaped quotes, multiline cells', () => {
 assert.deepEqual(parseCsv('\uFEFF"a,b","x""y"\r\n"two\nlines",2'), [['a,b','x"y'],['two\nlines','2']]);
});
test('missing traffic uses source total; duplicate rows and URL variants do not double count visitors', t => {
 const dir=fixture(t);
 const sources=[['Источник трафика','Поисковая система','Визиты','Посетители'],['Итого и средние','',100,80],['Поиск','Яндекс',60,50],['Прямые заходы','Не определено',40,30]];
 put(dir,'Источники, сводка-2026-09-21-2026-09-21.csv', sources);
 put(dir,'Источники, сводка-2026-09-21-2026-09-21 (1).csv', sources);
 put(dir,'Посещаемость-2026-09-21-2026-09-21.csv',[goalHeader,['Итого и средние',41,30,.3],['2026-09-21',41,30,.3]]);
 put(dir,'Популярное-2026-09-21-2026-09-21.csv',[['Адрес страницы','Просмотры','Посетители'],['Итого и средние',20,8],['https://mute.ac/?utm_source=x',5,4],['https://mute.ac/',5,4],['https://beta.mute.ac/native/windows/register',3,3],['https://beta.mute.ac/dashboard',7,5]]);
 const {days,goals}=loadReports(dir);
 assert.equal(days[0].visits,100); assert.equal(days[0].visitors,80); assert.equal(days[0].yandex,60);
 assert.equal(days[0].pages[0].visitors,null); assert.equal(days[0].landingViews,10);
 assert.equal(days[0].betaViews,7); assert.equal(days[0].syntheticViews,3);
 assert.equal(goals[0].byDate.get('2026-09-21').total,41);
});
test('period totals never become a daily value; daily discrepancies are disclosed',t=>{
 const dir=fixture(t);
 put(dir,'Посещаемость-2026-09-06-2026-10-05.csv',[goalHeader,['Итого и средние',551,400,.1],['2026-09-17',25,20,.03],['2026-10-05',10,8,.02]]);
 put(dir,'Посещаемость-2026-09-17-2026-09-17.csv',[goalHeader,['Итого и средние',23,19,.031],['2026-09-17',23,19,.031]]);
 const [goal]=loadGoalFolder(dir); assert.equal(goal.byDate.size,2); assert.equal(goal.byDate.get('2026-09-17').total,23); assert.equal(goal.byDate.get('2026-10-05').total,10); assert.equal(goal.conflicts.length,1);
});
test('GSC completed-day cutoff is explicit, not inferred from small numbers',t=>{
 const dir=fixture(t); put(dir,'Chart.csv',[['Date','Clicks','Impressions','Position'],['2026-10-04',117,2989,6],['2026-10-05',7,246,7]]);
 assert.deepEqual(loadGsc(dir,'2026-10-04')[0].items.map(x=>x.key),['2026-10-04']);
});

test('ISO weeks start on Monday and the weekly summary flags Steam wave days', () => {
 assert.equal(isoWeekStart('2026-10-11'), '2026-10-05');
 assert.equal(isoWeekStart('2026-10-12'), '2026-10-12');
 assert.equal(isoWeekStart('2026-10-18'), '2026-10-12');
 const day = (date, visits, steam) => ({ date, visits, yandex: 1, google: 2, direct: 3, steam: 4, landingViews: 5, betaViews: 6, clusters: new Map([['steam', steam]]) });
 const goals = [{ name: 'Зарегистрировался', byDate: new Map([['2026-10-11', { total: 7 }], ['2026-10-12', { total: 9 }]]) }];
 const weeks = weeklySummary([day('2026-10-11', 100, 233), day('2026-10-12', 50, 125), day('2026-10-13', undefined, 10)], goals);
 assert.deepEqual(weeks.map(w => [w.week, w.days, w.daysWithVisits, w.visits, w.waveDays, w.steamCluster, w.goals.get('Зарегистрировался')]),
  [['2026-10-05', 1, 1, 100, 1, 233, 7], ['2026-10-12', 2, 1, 50, 1, 135, 9]]);
});
