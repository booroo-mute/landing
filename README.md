# mute.ac — лендинг Mute

Маркетинговый сайт Mute — бесплатного голосового чата для игр, который
работает в России без VPN. Next.js 16 (App Router), React 19, Tailwind 4,
контент в markdown.

## Запуск

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Переменные окружения — `.env.example` (`NEXT_PUBLIC_SITE_URL`, токены
подтверждения вебмастеров).

## Структура

| Путь | Что там |
|---|---|
| `app/` | маршруты: главная, `/discord-alternative`, `/voice-chat`, `/download`, `/install/*`, `/games/*`, `/blog/*`, `/releases/*`, `/privacy`, `/terms`; `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` генерируются кодом |
| `content/` | markdown: `blog/`, `games/` (гайды по войсу в играх), `install/`, `releases/`. Frontmatter: `title`, `description`, `date`, `updated`, `image`, `ogImage`, `related` (ссылки вида `blog/<slug>` / `games/<slug>`) |
| `components/` | UI; `markdownComponents.tsx` — общий рендер статей, `RelatedLinks.tsx` — перелинковка блога и гайдов, `MetrikaGoals.tsx` — цели аналитики |
| `lib/` | данные и SEO: `site.ts` (URL и даты обновления страниц), `schema.ts` (JSON-LD), `markdown.ts` (FAQ из текста → FAQPage), `imageSize.ts`, `ogImage.tsx` (генерация OG-картинок), `metrika.ts` |
| `docs/` | `seo-deploy-checklist.md` (деплой, проверки, цели Метрики), `seo-offsite-playbook.md` (внешние площадки и LLM-видимость), `listing-copy.md` (тексты для каталогов), `design-system.md`, `release-notes-guide.md` |
| `scripts/` | `indexnow-ping.mjs` (после деплоя), `subset-fonts.sh` |
| `deploy/` | nginx-конфиг и порядок деплоя |

## Как добавить статью или гайд

1. Создать `content/blog/<slug>.md` или `content/games/<slug>.md` с frontmatter
   (см. соседние файлы). Для гайда положить иллюстрацию в `public/games/` и
   указать `image` + `ogImage` (1200×630). У постов блога OG-картинка
   генерируется автоматически.
2. Блок «## Коротко о частых вопросах» с парами `**Вопрос?** Ответ` попадёт в
   FAQPage-разметку сам.
3. Заполнить `related`, чтобы перелинковка была осмысленной.
4. `npm run build`, задеплоить, `npm run indexnow`.

Правила текста: честно про ограничения продукта (нет мобильных приложений,
гостевого входа и push-to-talk), без названий конкурентов, без инструкций
по обходу блокировок. См. `docs/seo-offsite-playbook.md` → «Правила безопасности».
