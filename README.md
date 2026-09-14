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
| `app/` | маршруты: главная, `/discord-alternative`, `/voice-chat`, `/voice-chat/*` (посадочные под сценарии), `/download`, `/install/*`, `/games/*`, `/blog/*`, `/releases/*`, `/privacy`, `/terms`; `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `blog/feed.xml` (RSS) генерируются кодом |
| `content/` | markdown: `blog/`, `games/` (гайды по войсу в играх), `landings/` (посадочные `/voice-chat/<slug>`), `install/`, `releases/`. Frontmatter: `title`, `seoTitle` (короткий заголовок для `<title>` и og:title, ≤ 58 символов; H1 остаётся `title`), `description`, `date`, `updated`, `image`, `ogImage`, `topic` (у гайдов: `broken` или `setup`, группа на `/games`), `related` (ссылки вида `blog/<slug>`, `games/<slug>`, `releases/<slug>`, `install/<slug>`, `landings/<slug>`) |
| `components/` | UI; `markdownComponents.tsx` — общий рендер статей, `RelatedLinks.tsx` — перелинковка блога и гайдов, `MetrikaGoals.tsx` — цели аналитики |
| `lib/` | данные и SEO: `site.ts` (URL и даты обновления страниц), `schema.ts` (JSON-LD), `markdown.ts` (FAQ из текста → FAQPage), `imageSize.ts`, `ogImage.tsx` (генерация OG-картинок), `metrika.ts` |
| `docs/` | `seo-audit-2026-09.md` (аудит SEO и LLM-видимости, план на осень 2026), `seo-deploy-checklist.md` (деплой, проверки, цели Метрики), `seo-offsite-playbook.md` (внешние площадки и LLM-видимость), `seo-ugc-platforms.md` (тихие dofollow-площадки), `listing-copy.md` (тексты для каталогов), `design-system.md`, `release-notes-guide.md` |
| `scripts/` | `check-content.mjs` (даты, длина сниппетов, запрещённые формулировки; запускается перед `npm run build`), `indexnow-ping.mjs` (после деплоя), `subset-fonts.sh` |
| `deploy/` | nginx-конфиг и порядок деплоя |

## Как добавить статью или гайд

1. Создать `content/blog/<slug>.md` или `content/games/<slug>.md` с frontmatter
   (см. соседние файлы). Для гайда положить иллюстрацию в `public/games/` и
   указать `image` + `ogImage` (1200×630). У постов блога OG-картинка
   генерируется автоматически.
2. Блок «## Коротко о частых вопросах» с парами `**Вопрос?** Ответ` попадёт в
   FAQPage-разметку сам.
3. Заполнить `related`, чтобы перелинковка была осмысленной. У гайда задать
   `topic` (`broken`, если статья про сломанный войс, иначе `setup`).
4. Если `title` длиннее 58 символов, задать `seoTitle`: он уходит в `<title>`
   и og:title, а длинный заголовок остаётся в H1 и карточках.
5. `npm run build`, задеплоить, `npm run indexnow`.

Еженедельные статус-посты («Discord не работает сегодня», «Когда вернут чат
в Роблоксе») при обновлении меняют дату в `title`, первой строке и `updated`;
`date` остаётся датой первой публикации, а `seoTitle` без даты не трогают,
иначе у Метрики и поисковиков каждую неделю получается новая страница.

Посадочные под сценарии лежат в `content/landings/<slug>.md` и открываются
как `/voice-chat/<slug>`: один сценарий на страницу, свой набор разделов и
свои вопросы в блоке «## Коротко о частых вопросах» (он рендерится
аккордеоном без FAQPage-разметки). Поле `breadcrumb` задаёт короткую подпись
в хлебных крошках.

Правила текста: честно про ограничения продукта (нет мобильных приложений,
гостевого входа и push-to-talk), без названий конкурентов, без советов, как
вернуть доступ к заблокированным сервисам. «Без VPN» — единственная допустимая
связка с этим словом, и только про Mute; регулятор упоминается только на
юридических страницах. Проверка `npm run check:content` запускается перед
сборкой и останавливает её при нарушении, а заодно ловит даты из будущего и
description длиннее 160 символов. См. `docs/seo-offsite-playbook.md` →
«Правила безопасности».

Перед публикацией прогоняйте текст через skill `humanizer`
(`~/.claude/skills/humanizer`, https://github.com/blader/humanizer). Что он
ловит в нашем русском тексте чаще всего: сценические заходы («Ниже разбираем»,
«Коротко:», «Скажем сразу»), повторяющиеся «честные» концовки после каждого
раздела, конструкцию «не X, а Y» без реального противопоставления, тире как
универсальную связку (норма для наших текстов — не больше 0,5–0,7 на 100 слов,
только грамматические), жирные ярлыки в списках. Формат вопросов в FAQ
(`**Вопрос?** Ответ`) не трогать: из него собирается FAQPage-разметка.
