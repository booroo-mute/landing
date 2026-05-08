# SEO-аудит лендинга Mute (mute.ac)

**Дата аудита:** 2026-05-08
**Стек:** Next.js 16.1.6 (App Router) · React 19 · Tailwind v4
**Рендеринг:** SSG/SSR через App Router (это **большой плюс** — Яндекс хорошо это индексирует, в отличие от чистого CSR)
**Целевой язык/регион:** ru-RU, аудитория РФ/СНГ
**Приоритетные запросы:** «голосовой чат для игр», «аналог дискорда / российский дискорд»

---

## 1. Executive Summary — топ-9 проблем по приоритету

| # | Проблема | Влияние | Приоритет |
|---|----------|---------|-----------|
| 1 | `alternates.canonical: "/"` в root layout наследуется всеми страницами → у `/releases/1-3-0` и `/install/macos` canonical указывает на главную, поисковики склеивают страницы и не индексируют их | КРИТИЧНО — теряем 4 релиза + инструкции из выдачи | **P0** |
| 2 | `/install` и `/install/[slug]` отсутствуют в `sitemap.xml` | Страницы инструкций не попадают в индекс | **P0** |
| 3 | Динамические маршруты (`/releases/[slug]`, `/install/[slug]`) не имеют `generateMetadata` → у всех версий одинаковый title/description из root layout | Дубли в выдаче, низкий CTR, плохая релевантность | **P0** |
| 4 | Нет `favicon.ico`, `apple-touch-icon`, `manifest.webmanifest` | Пустая иконка в выдаче и закладках, плохой UX (минусом для Яндекса) | **P0** |
| 5 | Нет JSON-LD разметки (`SoftwareApplication`, `Organization`, `WebSite`, `BreadcrumbList`) | Нет богатых сниппетов в Яндексе и Google | **P0** |
| 6 | `<img alt="">` на hero-картинке (HeroBlock.tsx:42) | Главная картинка лендинга не индексируется в Картинках, страдает доступность | **P0** |
| 7 | `lastModified: new Date()` в sitemap для всех URL | Поисковики видят, что весь сайт «обновился сегодня», теряется доверие к sitemap | **P1** |
| 8 | Нет тегов верификации `yandex-verification` / `google-site-verification` | Нельзя добавить сайт в Яндекс.Вебмастер и Google Search Console — а это база для SEO-наблюдения | **P1** |
| 9 | GET `/sw.js 404` на каждом заходе (попытка загрузить несуществующий service worker) | Не критично для индексации, но лишние 404 в логах и Search Console | **P1** |

---

## 2. Критические проблемы (❌ P0) — блокируют индексацию прямо сейчас

### ❌ P0-1. Canonical всех страниц указывает на главную

**Что не так.**
В `app/layout.tsx:33-35` объявлено `alternates: { canonical: "/" }`. В Next.js metadata из layout мерджится с метаданными страницы. Дочерние маршруты (`/download`, `/releases/[slug]`, `/install/[slug]`) **не имеют собственного `metadata`**, поэтому каждый из них наследует `canonical = "/"`. В итоге `/releases/1-3-0` отдаёт в HTML `<link rel="canonical" href="https://mute.ac/" />`.

**Почему это важно.**
Canonical — это сигнал «вот настоящий URL этой страницы». Когда все страницы заявляют каноничным один и тот же URL (главную), Google и Яндекс считают их дублями главной и **выкидывают из индекса**. Прямо сейчас вы рискуете потерять из выдачи 4 релиза и страницу установки macOS.

**Где в коде.**
- `/Users/egorbelitski/Documents/developing/landing/app/layout.tsx:33-35` — корень проблемы
- `/Users/egorbelitski/Documents/developing/landing/app/download/page.tsx` — нет своего `metadata`
- `/Users/egorbelitski/Documents/developing/landing/app/releases/[slug]/page.tsx` — нет `generateMetadata`
- `/Users/egorbelitski/Documents/developing/landing/app/install/[slug]/page.tsx` — нет `generateMetadata`

**Как починить.**
В layout оставить canonical только для главной (это ОК, потому что layout оборачивает только `/`, если бы не было дочерних). Безопаснее — задать canonical явно для каждой страницы:

```ts
// app/page.tsx
export const metadata = { alternates: { canonical: "/" } };

// app/download/page.tsx
export const metadata = { alternates: { canonical: "/download" } };

// app/releases/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { alternates: { canonical: `/releases/${slug}` } };
}

// app/install/[slug]/page.tsx — аналогично
```

И **убрать** `alternates.canonical` из `app/layout.tsx`, чтобы он не наследовался.

---

### ❌ P0-2. Страницы /install отсутствуют в sitemap

**Что не так.**
`app/sitemap.ts:14-26` возвращает только `/`, `/download` и `/releases/[slug]`. Маршрут `/install/[slug]` (есть `macos.md`, в будущем будут windows/linux) не включён.

**Почему это важно.**
Sitemap — это «списочек URL для робота, чтобы он точно знал что индексировать». То, чего нет в sitemap, индексируется медленнее или не индексируется вовсе. Запросы вроде «как установить аналог дискорда на mac» — это идеальный long-tail трафик, который вы упускаете.

**Где в коде.**
- `/Users/egorbelitski/Documents/developing/landing/app/sitemap.ts:14-26`
- `/Users/egorbelitski/Documents/developing/landing/lib/install.ts` — функция `getAllInstallSlugs()` уже есть

**Как починить.**

```ts
// app/sitemap.ts
import { getAllInstallSlugs } from "@/lib/install";

const installUrls = getAllInstallSlugs().map((slug) => ({
  url: `${baseUrl}/install/${slug}`,
  lastModified: new Date(), // см. P1 ниже про дату
}));

return [
  { url: baseUrl, lastModified: ..., priority: 1, changeFrequency: "weekly" },
  { url: `${baseUrl}/download`, ..., priority: 0.9, changeFrequency: "monthly" },
  ...installUrls,    // <-- ДОБАВИТЬ
  ...releaseUrls,
];
```

---

### ❌ P0-3. Нет уникальных title/description у динамических страниц

**Что не так.**
- `/releases/[slug]/page.tsx` — нет `generateMetadata`. Все 4 релиза в выдаче выглядят как «Mute — голосовой чат для игр» (title из layout).
- `/install/[slug]/page.tsx` — то же.
- `/download/page.tsx` — тоже без своего metadata.

**Почему это важно.**
Title — самый сильный SEO-сигнал. Уникальный title с релевантным ключом даёт +CTR в выдаче и помогает ранжироваться по конкретным запросам. Сейчас все ваши страницы конкурируют между собой за один и тот же запрос — это называется keyword cannibalization.

**Frontmatter уже содержит нужные поля** (`lib/releases.ts`, `content/releases/*.md`):
```yaml
title: "Обновление 1.3.0"
summary: "Новые реакции на сообщения, улучшенный поиск..."
date: "2026-02-10"
```

`content/install/macos.md` содержит только `title` — этого мало, нужно добавить `description`.

**Как починить.**

```ts
// app/releases/[slug]/page.tsx
import { getReleaseBySlug } from "@/lib/releases";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) return {};
  return {
    title: `${release.title} — Mute`,
    description: release.summary,
    alternates: { canonical: `/releases/${slug}` },
    openGraph: { title: release.title, description: release.summary, url: `/releases/${slug}` },
  };
}
```

```ts
// app/install/[slug]/page.tsx — аналогично
// предварительно расширить frontmatter в content/install/macos.md:
// description: "Пошаговая инструкция по установке Mute на macOS — обход Gatekeeper, разрешение запуска через Терминал."
```

```ts
// app/download/page.tsx — добавить статический metadata:
export const metadata = {
  title: "Скачать Mute — голосовой чат для игр (Windows, macOS)",
  description: "Установите Mute — российский аналог Discord без VPN. Быстрая установка для Windows и macOS, бесплатно.",
  alternates: { canonical: "/download" },
};
```

⚠️ Внимание: `download/page.tsx` помечен `"use client"`. **Client component не может экспортировать `metadata`** — нужно вынести редирект-логику в дочерний компонент, а сам `page.tsx` сделать серверным.

---

### ❌ P0-4. Нет иконок и манифеста

**Что не так.**
В `/public` отсутствуют:
- `favicon.ico` (есть только `app/favicon.ico` — это OK для бровзеров, но
- ✅ `apple-icon.png` — есть в `app/`, значит Next.js сгенерирует `<link rel="apple-touch-icon">`
- ❌ `manifest.webmanifest` (или `site.webmanifest`)
- ❌ `icon-192.png`, `icon-512.png` (для PWA-манифеста и Android)

Чтобы быстро убедиться: в logs `GET /sw.js 404` — браузер пытается зарегистрировать service worker, которого нет (либо это сторонний код в `OSProvider`/`SmoothScroll`, либо HMR-артефакт).

**Почему это важно.**
- Иконка показывается в выдаче Яндекса рядом со сниппетом. Без неё вы выглядите подозрительно (для бесплатного приложения это удар по доверию).
- Manifest нужен для «Установить на рабочий стол» в мобильных браузерах.
- 404 на `/sw.js` каждый запрос захламляет Search Console.

**Где в коде.**
- `/Users/egorbelitski/Documents/developing/landing/public/` — отсутствуют файлы
- `/Users/egorbelitski/Documents/developing/landing/app/layout.tsx` — нет `icons`, `manifest` в metadata

**Как починить.**

1. Положить в `app/`:
   - `app/icon.png` (32×32 или 256×256, Next.js автоматически отдаст для всех размеров)
   - `app/apple-icon.png` ✅ уже есть
   - `app/icon.svg` — опционально, отдаётся как векторный fav

2. Создать `app/manifest.ts`:
```ts
import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mute — голосовой чат для игр",
    short_name: "Mute",
    description: "Голосовой чат для геймеров. Аналог Discord без VPN.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    lang: "ru-RU",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```

3. Найти и убрать источник запроса к `/sw.js`. Подозрительные кандидаты — `components/SmoothScroll.tsx` или `components/OSProvider.tsx` (нужно проверить отдельно).

---

### ❌ P0-5. Нет структурированных данных (Schema.org / JSON-LD)

**Что не так.**
Поиск по проекту не нашёл ни одного `<script type="application/ld+json">`. Это значит, поисковики читают сайт «вслепую» — не знают, что Mute это software application, кто его делает, в какой стране, на каких платформах.

**Почему это важно.**
- В Яндексе JSON-LD напрямую влияет на формат сниппета и попадание в «Колдунщики» (специальные блоки).
- В Google `SoftwareApplication` Schema может дать сниппет с рейтингом, ценой («Бесплатно»), платформой и кнопкой Install.
- `BreadcrumbList` → красивые хлебные крошки в выдаче вместо длинного URL.

**Где в коде.** Нет — нужно добавить.

**Как починить.** Создать компонент `components/JsonLd.tsx` или вставить прямо в `app/layout.tsx` через `<script>`:

```tsx
// в app/layout.tsx, прямо в <body>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Mute",
        operatingSystem: "Windows, macOS",
        applicationCategory: "CommunicationApplication",
        description: "Голосовой чат для геймеров. Аналог Discord без VPN.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "RUB" },
        url: "https://mute.ac",
        inLanguage: "ru-RU",
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Mute",
        url: "https://mute.ac",
        logo: "https://mute.ac/logo.png",
        sameAs: ["https://t.me/mutecalls", "https://boosty.to/muteapp"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Mute",
        url: "https://mute.ac",
        inLanguage: "ru-RU",
      },
    ]),
  }}
/>
```

Для каждой `/releases/[slug]` добавить отдельный JSON-LD `SoftwareApplicationVersion` или `Article` с датой релиза.
Для `/install/[slug]` — `HowTo` (это идеально читается Яндексом и Google).

---

### ❌ P0-6. Hero-картинка без alt

**Что не так.**
В `components/HeroBlock.tsx:42` главное изображение страницы (`/hero-image-new.png`, 394 КБ) объявлено как `alt=""`. Это значит «декоративная картинка, читалкам игнорировать».

**Почему это важно.**
- Hero — главная картинка лендинга. Она же основной кандидат на Яндекс.Картинки и Google Images по запросу «голосовой чат для игр».
- Скринридеры пропустят её, что снижает a11y-рейтинг (косвенный SEO-сигнал).

**Где в коде.**
`/Users/egorbelitski/Documents/developing/landing/components/HeroBlock.tsx:42`

**Как починить.**
```tsx
alt="Mute — голосовой чат для игр: интерфейс приложения с активным звонком и списком друзей"
```
Описание должно быть осмысленным предложением с ключевыми словами, **не** «hero image» или «mute icon».

---

## 3. Важные улучшения (⚠️ P1)

### ⚠️ P1-1. lastModified в sitemap всегда «сейчас»

**Что не так.** `app/sitemap.ts:11,17,22` — везде `new Date()`. Каждый build sitemap «обновляется», даже если контент не менялся.

**Почему важно.** Поисковики проверяют lastModified, чтобы решить, переиндексировать страницу или нет. Если каждая страница «обновляется» каждый день — поисковик перестаёт доверять этому полю и начинает игнорировать. К тому же расходуется квота краулинга на не-изменившиеся страницы.

**Как починить.**
`lib/releases.ts` уже сортирует по `date` из frontmatter. Используйте это поле:
```ts
const releaseUrls = releases.map((r) => ({
  url: `${baseUrl}/releases/${r.slug}`,
  lastModified: new Date(r.date),
  changeFrequency: "yearly" as const,
}));
```
Для главной можно положить дату последнего релиза. Для `/install/[slug]` — добавить поле `date` в frontmatter (сейчас там только `title`).

---

### ⚠️ P1-2. Нет verification для Яндекс.Вебмастера и Google Search Console

**Что не так.** В `app/layout.tsx` нет ни `verification` блока, ни статичных файлов `yandex_*.html` / `google*.html` в `/public`.

**Почему важно.** Без верификации сайта в Вебмастере вы:
- не увидите, какие страницы проиндексированы
- не увидите ошибки краулинга
- не сможете отправить sitemap вручную при проблемах с автообнаружением
- не сможете использовать IndexNow для быстрой переиндексации

**Как починить.** В `app/layout.tsx` metadata добавить:
```ts
verification: {
  yandex: "PASTE_YANDEX_TOKEN_HERE",
  google: "PASTE_GOOGLE_TOKEN_HERE",
},
```
Токены берутся из Яндекс.Вебмастера и Google Search Console после добавления домена.

---

### ⚠️ P1-3. Лишний запрос на /sw.js (404)

**Что не так.** В dev-логах `GET /sw.js 404`. Это значит где-то в коде есть `navigator.serviceWorker.register('/sw.js')` или старый артефакт.

**Почему важно.** Каждый посетитель и каждый бот получает 404. В Search Console это начинает выглядеть как «битая ссылка».

**Где искать.** Скорее всего — `components/OSProvider.tsx`, `components/SmoothScroll.tsx`, или удалённый кусок кода. Нужно найти регистрацию sw и либо удалить, либо реально создать `public/sw.js`.

---

### ⚠️ P1-4. Тег `<main>` отсутствует на главной

**Что не так.** `app/page.tsx:11-25` — корневая обёртка `<>` без `<main>`. Семантический корень страницы не объявлен.

**Почему важно.** Скринридеры используют `<main>` для «перейти к содержимому». Поисковики (особенно Яндекс) по этому тегу определяют основной контент против шапки/футера.

**Как починить.**
```tsx
<>
  <Header />
  <main>
    <div className="container">...</div>
    ...
  </main>
  <Footer />
</>
```

---

### ⚠️ P1-5. Слабая внутренняя перелинковка

**Что не так.**
- `Header.tsx` ссылается только на `/` (логотип), Telegram и `/download`. На `/install/macos`, `/releases` ссылок нет.
- `Footer.tsx` ссылается на Telegram, Boosty, бот и mailto. Внутренних ссылок на разделы сайта нет.
- Главная не упоминает `/install` и `/releases`.

**Почему важно.** PageRank распределяется по внутренним ссылкам. Если на `/releases/1-3-0` нет ссылок ниоткуда — страница «висит в воздухе» и плохо ранжируется.

**Как починить.**
- В Footer добавить колонку «Продукт»: «Скачать», «Установка», «Обновления», «Релизы».
- В блоке `ReleaseNotes` (закомментирован сейчас на главной) — раскомментировать или вернуть с ссылками на каждый релиз.
- Внутри инструкций (`/install/macos`) ссылка на «Скачать» (`/download`) и «Что нового» (`/releases/1-3-0`).

---

### ⚠️ P1-6. Изображения в PNG, не в WebP/AVIF

**Что не так.**
- `hero-image-new.png` — 394 KB
- `calls.png` — 272 KB
- `chat.png` — 100 KB

В `next.config.ts` пусто, но компоненты используют `next/image` (как минимум в HeroBlock). При импорте Next автоматически отдаёт WebP/AVIF на лету в `.next/image`. Так что ситуация не катастрофическая, но:
- если где-то используется обычный `<img>` (агент видел в `CallCard.tsx:14`, `FeatureItem.tsx:14`, `Header.tsx:26`, `Footer.tsx:11`) — там оптимизации нет.
- Исходники по 400 KB всё равно избыточны.

**Почему важно.** LCP (Largest Contentful Paint) — фактор ранжирования Core Web Vitals в Google, и Яндекс начал учитывать скорость в 2025-м.

**Как починить.**
1. Перевести все `<img>` на `<Image>` из `next/image`.
2. Сжать исходники: `hero-image-new.png` → ~120 KB через WebP, не теряя качества (можно через `cwebp -q 85`).
3. Опционально: положить рядом WebP-версии и использовать `<picture>` с fallback (но `next/image` это и так делает).

---

### ⚠️ P1-7. У `/install/macos` в frontmatter нет description и date

**Что не так.** `content/install/macos.md` содержит только `title: "Установка Mute на macOS"`. Нет description (для meta description), нет date (для sitemap).

**Как починить.** Расширить frontmatter:
```yaml
---
title: "Установка Mute на macOS"
description: "Пошаговая инструкция: разрешение запуска через Терминал, обход Gatekeeper. Займёт 2 минуты."
date: "2026-03-15"
ogImage: "/install/macos/macos-install.png"
---
```
И обновить `lib/install.ts` чтобы парсить эти поля.

---

### ⚠️ P1-8. Yandex.Metrika подключена, но вы сказали «без аналитики»

**Что не так.** `app/layout.tsx:73-92` — счётчик 108242058 уже встроен. Но в моём опросе вы выбрали «Не подключать аналитику». Это противоречие.

**Возможные интерпретации:**
- Счётчик старый, можно удалить.
- «Не подключать новое», существующее оставить.

**Действие:** не трогаю до уточнения. См. секцию вопросов в конце.

---

## 4. Рекомендации (💡 P2) — точки роста на будущее

### 💡 P2-1. Кастомная 404-страница
`app/not-found.tsx` отсутствует. По прямому правилу для SEO это не критично, но:
- 404 с навигацией обратно снижает bounce rate
- Можно туда положить ссылки на `/download` и популярные релизы

### 💡 P2-2. Страница `/install` (без slug)
Сейчас есть только `/install/[slug]`. Прямой переход на `/install` — это 404. Стоит сделать индексную страницу со списком всех инструкций.

### 💡 P2-3. Блог для long-tail трафика
По запросам «как отключить ввод в дискорде», «как настроить микрофон в играх», «лучший голосовой чат для CS2» — конкуренция гораздо ниже, чем по «аналог Discord». Это идеальный рост на ближайший год.

Если решите делать — структура:
- `content/blog/*.md` с frontmatter `title`, `description`, `date`, `slug`
- `app/blog/page.tsx` (список) + `app/blog/[slug]/page.tsx` (статья)
- В sitemap, в footer, в Schema.org `Article` для каждой статьи.

### 💡 P2-4. FAQ-блок на главной
Часто задаваемые вопросы прямо на лендинге («Чем Mute отличается от Discord?», «Можно ли играть без VPN?», «Сколько человек в комнате?»). Плюсы:
- закрывают возражения посетителей
- индексируются как `FAQPage` Schema → Яндекс показывает прямо в выдаче
- ловят long-tail запросы вида «можно ли играть в Mute без VPN»

### 💡 P2-5. IndexNow для Яндекса
Яндекс активно использует протокол IndexNow для быстрой переиндексации. Можно добавить deploy-хук, который пингует:
```
https://yandex.com/indexnow?url=https://mute.ac/&key=YOUR_KEY
```
Особенно полезно после релизов новых версий.

### 💡 P2-6. OG-картинки для каждого релиза
Сейчас все релизы шарятся в Telegram/VK с одной и той же `/open-graph.png`. Уникальная OG-картинка на релиз = выше CTR при репостах.

Можно генерировать через `app/releases/[slug]/opengraph-image.tsx` (Next.js 16 это умеет из коробки через ImageResponse).

### 💡 P2-7. Перенести `robots.txt` в `app/robots.ts`
Сейчас статический файл в `/public`. Динамическая версия позволит:
- автоматически подставлять правильный SITE_URL (для preview-окружений)
- при необходимости — закрывать отдельные пути (например, `/install/draft-*`)

### 💡 P2-8. Hreflang под будущий en
Если планируется английская версия — заранее заложить структуру `/en/...`. Когда появится контент, добавить hreflang-теги. Сейчас не нужно.

### 💡 P2-9. Web Vitals
Подключить мониторинг Core Web Vitals (LCP, INP, CLS) — на dev можно через `web-vitals` npm-пакет, на prod через Яндекс.Метрику (она это умеет).

---

## 5. Что уже хорошо (✅) — чтобы не сломать

- ✅ **SSG/SSR через App Router** — Яндекс отлично индексирует, не CSR. Это самый дорогой плюс, не убивайте его переходом на client-side data fetching.
- ✅ **`<html lang="ru">`** — `app/layout.tsx:68`.
- ✅ **`metadataBase`** настроен корректно — `app/layout.tsx:16`.
- ✅ **Open Graph + Twitter card** — заполнены, OG-картинка 1200×630 в `/public/open-graph.png`.
- ✅ **Robots.txt** есть, разрешает всё, ссылается на sitemap.
- ✅ **Sitemap генерируется через `app/sitemap.ts`** (а не статический xml).
- ✅ **`generateStaticParams` + `notFound()`** в динамических маршрутах — индексируется только реально существующий контент.
- ✅ **`next/font` + `font-display: swap`** для Golos_Text. Локальные шрифты (Offbit) тоже с `swap`.
- ✅ **H1 один на странице, с ключевыми словами** — `HeroBlock.tsx:20-22` («Голосовое общение для игр»).
- ✅ **Иерархия H1→H2→H3 без пропусков**.
- ✅ **Семантические теги** `<header>`, `<footer>`, `<section>` используются.
- ✅ **`rel="noopener noreferrer"`** на всех внешних ссылках.
- ✅ **Якорные тексты осмысленные** — нет «нажмите здесь».
- ✅ **HTTPS** через домен mute.ac (предполагается).
- ✅ **`apple-icon.png`** в `app/` — Next.js автоматически генерирует apple-touch-icon.

---

## 6. Сводная таблица по чеклисту из промпта

| Категория | Проверка | Статус |
|-----------|----------|--------|
| **Файлы для поисковиков** | robots.txt | ✅ |
| | sitemap.xml | ⚠️ Не включает /install |
| | favicon.ico, apple-touch-icon, manifest | ⚠️ Только apple-icon |
| | yandex-verification / google verify | ❌ |
| **Мета-теги (главная)** | `<title>` уникальный | ✅ |
| | `<meta description>` | ✅ |
| | canonical | ⚠️ Указывает на "/" (наследуется детьми — баг) |
| | `<html lang="ru">` | ✅ |
| | viewport | ✅ Next.js добавляет автоматически |
| | Open Graph | ✅ |
| | Twitter Cards | ✅ |
| | yandex-verification | ❌ |
| **Мета-теги (динамика)** | уникальные title для /releases/[slug] | ❌ |
| | уникальные title для /install/[slug] | ❌ |
| | уникальный title для /download | ❌ |
| **Schema.org** | SoftwareApplication | ❌ |
| | Organization | ❌ |
| | WebSite | ❌ |
| | FAQPage | ❌ (нет FAQ-блока) |
| | BreadcrumbList | ❌ |
| | HowTo для /install | ❌ |
| **Семантика** | один H1 | ✅ |
| | иерархия Hx | ✅ |
| | `<header>`, `<main>`, `<nav>`, `<footer>` | ⚠️ Нет `<main>` и `<nav>` |
| | alt у всех img | ⚠️ Hero alt="" |
| | осмысленные anchor text | ✅ |
| **Производительность** | WebP/AVIF | ⚠️ Только PNG в исходниках |
| | lazy loading | ⚠️ Через next/image где используется |
| | preconnect/preload | ❌ |
| | font-display: swap | ✅ |
| | блокирующий JS в head | ✅ Нет |
| **URL** | читаемые URL | ✅ |
| | дубли / | ✅ Next.js нормализует |
| | 301 редиректы | n/a — пока не нужны |
| | кастомная 404 | ❌ Нет not-found.tsx |
| | HTTPS | ✅ (на проде) |
| **Яндекс-специфика** | IndexNow | ❌ |
| | yandex-verification | ❌ |
| | Schema.org микроразметка | ❌ |
| | Яндекс.Метрика | ✅ Подключена (но вы сказали «без аналитики») |
| | Clean-param в robots | n/a — нет URL с параметрами |
| | SSR/SSG (а не CSR) | ✅ |
| **Контент** | ключевые слова в видимом тексте | ⚠️ Главная не содержит «аналог Discord» / «без VPN» |
| | 300–500 слов на главной | ❌ Слишком мало текста |
| | FAQ-блок | ❌ |
| | блог | ❌ |
| | внутренняя перелинковка | ⚠️ Слабая |
| **a11y** | контрастность WCAG AA | n/a — не проверял дизайн |
| | aria-label на иконках | ❌ Не используется |
| | порядок фокуса | n/a |
| | label в формах | n/a — форм нет |

---

## 7. Что делать дальше — вопросы к вам

Промпт говорит: «после аудита спроси, какие из P0 чинить сразу». Перед тем как трогать код, нужно уточнить пару моментов:

1. **Yandex.Metrika 108242058** — оставить, удалить, или это вообще тестовый счётчик?
2. **Иконки и манифест** — у вас есть исходники иконки в высоком разрешении (для генерации `icon-192`, `icon-512`)? Или сделать из существующего `mute-icon.svg` / `logo.svg`?
3. **Verification-токены** — будете подключать сайт к Яндекс.Вебмастеру / GSC сейчас, или это отложенная задача?
4. **`/sw.js`** — нужно найти источник; стоит начать с него же?
5. **Контент главной (300+ слов, FAQ)** — это потребует копирайта. Хотите чтобы я предложил черновик, или это отдельная задача с маркетологом?

Также подтвердите, какие из **P0** взять в работу первым коммитом — рекомендую такой порядок:

- **P0-1** (canonical) + **P0-3** (generateMetadata) — это связанные правки, делаются вместе.
- **P0-2** (sitemap /install) — однострочное добавление, идёт следом.
- **P0-6** (alt у hero) — однострочка, можно в этом же коммите.
- **P0-4** (favicon/manifest) — отдельный коммит, нужны иконки.
- **P0-5** (JSON-LD) — отдельный коммит, чтобы можно было ревьюить.

Жду ваших решений — без подтверждения код менять не буду.
