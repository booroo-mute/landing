# Деплой SEO-изменений: чеклист

## Лендинг (mute.ac)

Сервер `mute-prod` (алиас в `~/.ssh/config`), лендинг в `/root/mute/landing`,
процесс pm2 `mute-landing` на порту 3002. Рядом живут `backend` и `sfu-server`:
их и nginx при деплое лендинга не трогать, идут живые звонки. Правки
`deploy/nginx-mute.ac.conf` применяются только в окно обслуживания.

Короткий путь: `scripts/deploy.sh` с рабочей машины делает шаги 1, 2, 5 и
контрольные curl сам (nginx не трогает). Ниже тот же порядок вручную.

1. На сервере: `git pull && npm install && npm run build` (перед сборкой
   автоматически идёт `npm run check:content`: даты не из будущего,
   description ≤ 160, запрещённые формулировки; при ошибке сборка не начнётся)
2. `pm2 restart mute-landing`
3. Обновить nginx из `deploy/nginx-mute.ac.conf`:
   `nginx -t && systemctl reload nginx`
4. Проверки:
   - `curl -s https://mute.ac/robots.txt` — есть блок `User-agent: Yandex` с
     `Clean-param: ysclid&utm_…` (отдаётся из `app/robots.txt/route.ts`)
   - `curl -s https://mute.ac/robots.txt | grep -c "^User-agent:"` → 15
     (13 AI-краулеров, `*` и `Yandex`); `Clean-param` по-прежнему в группе `Yandex`
   - `curl -s https://mute.ac/sitemap.xml | grep -c "<loc>"` → 44 (на 14.09.2026:
     41 + три посадочные `/voice-chat/*`) + число новых статей/гайдов с прошлого
     деплоя; `grep -c "<image:loc>"` → число иллюстраций гайдов (8);
     `grep lastmod` не должен показывать дат из будущего
   - `curl -sI https://mute.ac/blog/feed.xml | grep -i content-type` →
     `application/rss+xml`; `curl -s https://mute.ac/blog/feed.xml | grep -c "<item>"`
     → число постов + гайдов (18 на 14.09.2026)
   - `curl -s https://mute.ac/download | grep -c "<h2"` → 5;
     `curl -s https://mute.ac/games | grep -c "<h2"` → 3
   - `curl -s https://mute.ac/voice-chat | grep -o 'og:site_name" content="[^"]*"'`
     → `Mute` (страницы со своим openGraph раньше теряли site_name и locale)
   - `curl -s https://mute.ac/voice-chat/rooms | grep -o '"@type":"[A-Za-z]*"' | sort -u`
     → BreadcrumbList, Organization, SoftwareApplication, WebPage, WebSite; FAQPage нет
   - `curl -s https://mute.ac/robots.txt | grep llms` → строка с llms.txt на месте
   - `curl -s https://mute.ac/games/cs2 | grep -c FAQPage` → 1 (то же для /games/dota-2)
   - `curl -sI https://mute.ac/releases/1-3-0` → 308/301 на /releases
   - `curl -sI "https://mute.ac/games/roblox~~~x"` → 308 на /games/roblox
   - `curl -sI https://mute.ac/games/golosovoy-chat-v-roblox.webp` → 200 image/webp
     (редиректы срабатывают раньше статики — правило для «хвостов» однажды
     съело картинки)
   - `curl -s https://mute.ac/llms.txt | grep -c /games/` → число гайдов
   - `curl -sI https://mute.ac/ | grep -i strict-transport` → HSTS на месте,
     `x-powered-by` отсутствует
   - `curl -s -o /dev/null -w "%{content_type} %{size_download}\n" https://mute.ac/blog/<slug>/opengraph-image`
     → `image/png`, 30–60 КБ (генерируется в `lib/ogImage.tsx`)
   - `curl -sI "https://mute.ac/_next/static/..."` (любой asset со страницы) →
     `Cache-Control: public, immutable`
   - Разметка: https://validator.schema.org/ и Яндекс.Вебмастер → «Валидатор
     микроразметки» для `/`, `/download`, `/games/roblox` (Article + FAQPage)
5. `npm run indexnow` — пингует только URL с изменившимся `lastmod`
   (состояние в `.indexnow-last.json`; `npm run indexnow -- --all` — весь sitemap)
6. Прописать в `.env` токен `NEXT_PUBLIC_GOOGLE_VERIFICATION` (после
   регистрации в Google Search Console; Яндекс подтверждён HTML-файлом,
   Bing Webmaster импортирует сайт из GSC) и повторить шаги 1–2.

### www.mute.ac

Готово: `https://www.mute.ac/` и `http://mute.ac/` отдают 301 на
`https://mute.ac/` (проверено 14.09.2026). Ничего делать не нужно.

## Веб-клиент (beta.mute.ac)

**Статус на 2026-08-31:** шаги 1–4 выполнены. `beta.mute.ac` отдаёт
`X-Robots-Tag: noindex, nofollow` на `/`, `/welcome` и всей статике;
`beta.mute.ac.conf` в репозитории синхронизирован с боевым конфигом
(`/etc/nginx/sites-available/beta.mute.ac`), деплоить можно из него.
Шаг 5 (GSC Removals) ждёт регистрации в Search Console.

**Проверка 2026-09-14:** noindex отдаётся, но `beta.mute.ac/` всё ещё
встречается в выдаче Google и Bing. Следующая проверка 2026-09-28; после
регистрации в GSC и Bing Webmaster запросить удаление там и там.

**Не закрывать robots.txt на beta** (`Disallow: /`): noindex работает, только
пока робот может скачать страницу. График проверки `site:beta.mute.ac`
в Яндексе: 2026-09-14, 2026-09-28, далее раз в 2 недели до полного
выпадения (обычно 4–8 недель).

0. Репозиторий веб-клиента приватный, и у сервера нет учётных данных GitHub:
   `git pull` в `/root/mute/webclient` не проходит. Статику (robots.txt и
   подобное) кладите через `scp` в `/var/www/mute-app/` и в `build/`
   чекаута, полный деплой делайте с машины, у которой есть доступ.
1. `git pull && npm install && npm run build`
2. `scripts/update-static.sh` (копирует build в /var/www/mute-app)
3. Обновить nginx из `beta.mute.ac.conf`: `nginx -t && systemctl reload nginx`
4. Проверки:
   - `curl -sI https://beta.mute.ac/ | grep -i x-robots` → `noindex, nofollow`
   - `curl -sI https://beta.mute.ac/welcome | grep -i x-robots` → то же
   - `curl -s https://beta.mute.ac/ | grep noindex` → мета-тег на месте
   - `curl -sI https://beta.mute.ac/sitemap.xml` → `text/html` с `x-robots-tag:
     noindex` (файла нет с 14.09.2026, SPA отдаёт свою оболочку), не XML
   - Приложение работает: логин, звонок, инвайт-ссылка
5. В GSC → Removals: запросить удаление beta.mute.ac/* (ускоряет выпадение
   из выдачи с недель до дней)
6. ⚠️ robots.txt на beta НЕ закрывать (`Disallow: /`) до полного выпадения
   из индекса (проверять `site:beta.mute.ac` раз в 2 недели, ждать 4–8 недель)

## Цели Метрики (счётчик 108242058) и Top.Mail.Ru (3772222)

JS-цели, которые шлёт сайт (`components/MetrikaGoals.tsx`, `lib/metrika.ts`,
`app/download/DownloadClient.tsx`). Их нужно завести в интерфейсе Метрики
как «JavaScript-событие» с тем же идентификатором, иначе события не попадут
в отчёты:

| Идентификатор | Когда срабатывает | Где |
|---|---|---|
| `open_web` | клик по любой ссылке на веб-версию (`beta.mute.ac/welcome`); авторедирект с /download на телефоне | все страницы |
| `download_click` | клик по ссылке на `/download` | все страницы |
| `download_win` / `download_mac` | клик по прямой ссылке на `.exe`/`.dmg` и авторедирект на /download (`auto: true`) | все страницы, /download |
| `telegram_click` | клик по ссылке на `t.me/…` (канал или бот поддержки) | все страницы |
| `guide_cta` | клик внутри CTA-блока статьи, гайда, релиза, инструкции или посадочной (`data-goal="guide_cta"`), у посадочных также первая пара кнопок после вводных абзацев (`data-variant="intro"`) | /blog/*, /games/*, /releases/*, /install/*, /voice-chat/* |

Параметры целей: `href`; `placement` (место на странице, это `utm_term`
ссылки в веб-версию: `hero-secondary`, `hero-primary-web`, `cta-full`,
`cta-compact`, `intro`, `body`, `header`, `auto-redirect`); `variant`
(`full`/`compact` у баннера).

Top.Mail.Ru: `open_web`, `open_app`, `download` (без разделения по ОС).

### Атрибуция регистраций по страницам лендинга (с 17.09.2026)

Все ссылки в веб-версию уходят с UTM (`lib/webApp.ts`, ссылки в markdown
переписываются автоматически): `utm_source=mute.ac`, `utm_medium=landing`,
`utm_campaign=<раздел>`, `utm_content=<страница>` (например
`games/steam`), `utm_term=<место>`. Счётчик общий с приложением, поэтому
визит в beta.mute.ac начинается с источника «mute.ac / landing», и цель
«Зарегистрировался» (она считается в приложении) раскладывается по
страницам. Что сделать в интерфейсе Метрики один раз:

1. Проверить, что метка доходит: открыть
   `https://beta.mute.ac/welcome?utm_source=mute.ac&utm_medium=landing&utm_campaign=test&utm_content=test&utm_term=test&_ym_debug=1`
   и убедиться, что в консоли хит уходит с полным адресом (приложение
   само шлёт первый хит с `location.search`).
2. Отчёты → Источники → Метки UTM: `mute.ac / landing` появляется
   примерно через 30 минут.
3. Сохранить отчёт «Регистрации по страницам лендинга»: Конверсии → цель
   «Зарегистрировался», группировка «Метки UTM: utm_content», затем
   `utm_term`; атрибуция «Последний значимый источник».

Побочный эффект, чтобы не искать регрессию: визит лендинга заканчивается
на клике по ссылке в веб-версию, поэтому глубина и время на лендинге после
17.09 чуть ниже, а «Внутренние переходы» могут вырасти.

### Статус-посты и сводка Метрики

`npm run status -- content/blog/<файл>.md "<строка>"` обновляет
`statusDate`/`updated`/`statusLine` и запускает check-content; дальше
commit, push, `scripts/deploy.sh`. `npm run metrika -- <папка с днями>`
печатает таблицу день к дню по выгрузкам (визиты по источникам, лендинг и
приложение, цели, кластеры, почасовые регистрации).

Отдельно: в Метрике стоит создать сегмент «Лендинг». Счётчик общий с
`beta.mute.ac`, и без сегмента ~80% просмотров в отчётах приходятся на
веб-приложение, а не на сайт. Сайт передаёт параметр визита `site = landing`
(`lib/metrika.ts`, уходит в `ym('init')`), поэтому сегмент строится так:
«Визиты, в которых → Параметры визитов → site → landing», сохранить как
«Лендинг». Отчёт «Содержание → Параметры визитов» покажет, что метка дошла,
примерно через 15 минут после деплоя. Если отчёты по страницам показывают
только страницы входа, добавить `ym('hit')` на смену маршрута.

## Шрифты

`public/fonts/OffBit-*.woff2` — сабсет без хинтинга (~12 КБ вместо ~70 КБ на
начертание), рецепт в `scripts/subset-fonts.sh`. Если понадобится добавить
символы — пересобрать из полного файла (в git-истории до 2026-09-13),
расширив список `UNICODES`. `assets/fonts/GolosText-*.ttf` — только для
генерации OG-картинок (satori не читает woff2), в браузер не отдаются.

## Контент, требующий решения команды

- `content/releases/0-2-1.md`, `0-2-2.md` — проверить даты и дополнить
  реальными изменениями (сейчас — консервативные честные заглушки,
  помечены TODO в файлах)
- `lib/faq.ts` — проверить факты: регистрация (ник/почта/пароль?),
  формулировка про приватность
- Статьи блога `content/blog/*.md` — вычитать тон и факты
