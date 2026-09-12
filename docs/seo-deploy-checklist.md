# Деплой SEO-изменений: чеклист

## Лендинг (mute.ac)

1. На сервере: `git pull && npm install && npm run build`
2. `pm2 restart mute-landing`
3. Обновить nginx из `deploy/nginx-mute.ac.conf`:
   `nginx -t && systemctl reload nginx`
4. Проверки:
   - `curl -s https://mute.ac/robots.txt` — есть блок `User-agent: Yandex` с
     `Clean-param: ysclid&utm_…` (отдаётся из `app/robots.txt/route.ts`)
   - `curl -s https://mute.ac/sitemap.xml | grep -c "<loc>"` → 35 + число
     новых статей/гайдов с прошлого деплоя
   - `curl -sI https://mute.ac/releases/1-3-0` → 308/301 на /releases
   - `curl -sI "https://mute.ac/games/roblox~~~x"` → 308 на /games/roblox
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
6. Прописать в `.env` токены `NEXT_PUBLIC_YANDEX_VERIFICATION` /
   `NEXT_PUBLIC_GOOGLE_VERIFICATION` (после регистрации в вебмастерах)
   и повторить шаги 1–2.

### www.mute.ac (отложено до DNS)

1. Добавить DNS A/AAAA запись для www.mute.ac
2. `certbot --nginx -d mute.ac -d www.mute.ac`
3. Раскомментировать www-блок в `deploy/nginx-mute.ac.conf`, залить, `nginx -t && reload`

## Веб-клиент (beta.mute.ac)

**Статус на 2026-08-31:** шаги 1–4 выполнены. `beta.mute.ac` отдаёт
`X-Robots-Tag: noindex, nofollow` на `/`, `/welcome` и всей статике;
`beta.mute.ac.conf` в репозитории синхронизирован с боевым конфигом
(`/etc/nginx/sites-available/beta.mute.ac`), деплоить можно из него.
Шаг 5 (GSC Removals) ждёт регистрации в Search Console.

**Не закрывать robots.txt на beta** (`Disallow: /`): noindex работает, только
пока робот может скачать страницу. График проверки `site:beta.mute.ac`
в Яндексе: 2026-09-14, 2026-09-28, далее раз в 2 недели до полного
выпадения (обычно 4–8 недель).

1. `git pull && npm install && npm run build`
2. `scripts/update-static.sh` (копирует build в /var/www/mute-app)
3. Обновить nginx из `beta.mute.ac.conf`: `nginx -t && systemctl reload nginx`
4. Проверки:
   - `curl -sI https://beta.mute.ac/ | grep -i x-robots` → `noindex, nofollow`
   - `curl -sI https://beta.mute.ac/welcome | grep -i x-robots` → то же
   - `curl -s https://beta.mute.ac/ | grep noindex` → мета-тег на месте
   - `curl -s -o /dev/null -w "%{http_code}" https://beta.mute.ac/sitemap.xml` → 404
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
| `guide_cta` | клик внутри CTA-блока статьи или гайда (`data-goal="guide_cta"`) | /blog/*, /games/* |

Top.Mail.Ru: `open_web`, `open_app`, `download` (без разделения по ОС).

Отдельно: в Метрике стоит создать сегмент «Лендинг» (`Домен = mute.ac`) —
счётчик общий с `beta.mute.ac`, и без сегмента ~80% просмотров в отчётах
приходятся на веб-приложение, а не на сайт.

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
