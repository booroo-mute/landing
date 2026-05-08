# Дизайн: полный SEO-проход лендинга

## Контекст

Лендинг Mute (mute.ac) — RU-сайт для геймерской аудитории в РФ/СНГ. Сейчас в `app/layout.tsx` задействованы базовые метаданные (title, description, openGraph, twitter), но отсутствуют ключевые фразы, JSON-LD, явный canonical, alt-тексты у части картинок неточные. На фоне нестабильности Discord в РФ актуальны запросы вокруг «аналог Discord без VPN».

Цель прохода — поднять видимость по геймерским голосовым запросам (Яндекс приоритетен, Google — вторичен), без переписывания UI и без агрессивного keyword stuffing в hero/H1.

## Позиционирование (на чём фокусируемся)

1. Голосовой чат для игр / геймеров — основной кластер.
2. Аналог Discord — критический запрос в РФ.
3. Без VPN, работает в России — горячий триггер сейчас.
4. Бесплатно — уже в копии.

## Что меняется

### 1. `app/layout.tsx` — метаданные

**title** (короткий, бренд-первый):
```
Mute — голосовой чат для игр
```

**description** (~140 символов):
```
Mute — лёгкий голосовой чат для геймеров. Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек, личные и групповые чаты. Бесплатно.
```

**keywords** (массив):
```ts
keywords: [
  "голосовой чат для игр",
  "аналог дискорда",
  "альтернатива discord",
  "голосовой чат без VPN",
  "дискорд без VPN",
  "голосовая связь для геймеров",
  "бесплатный голосовой чат",
  "общение в играх",
  "приватный голосовой чат",
  "русский аналог Discord",
  "mute",
]
```

**openGraph / twitter** (синхронизируем с новыми title/description, но короче для соц-превью):
- title: `Mute — голосовой чат для игр`
- description: `Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек и чаты с друзьями. Бесплатно.`

**canonical** — добавить явно:
```ts
alternates: { canonical: "/" }
```

### 2. JSON-LD (`SoftwareApplication`)

Инжектим в `app/layout.tsx` через `<script type="application/ld+json">` с `dangerouslySetInnerHTML`. Размещение — внутри `<body>` (Next.js рекомендует), до основного содержимого.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Mute",
  "description": "Голосовой чат для игр. Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек, личные и групповые чаты.",
  "url": "https://mute.ac",
  "applicationCategory": "CommunicationApplication",
  "operatingSystem": "Windows, macOS",
  "inLanguage": "ru",
  "offers": {
    "@type": "Offer",
    "price": 0,
    "priceCurrency": "RUB"
  }
}
```

Не добавляем `Organization` (одной схемы достаточно), `aggregateRating` (без реальных оценок Google штрафует), `screenshot` (опционально, на потом).

### 3. Alt-тексты

| Файл | Текущий alt | Новый alt | Зачем |
|------|-------------|-----------|-------|
| `components/CallCard.tsx` | `"Calls card"` (захардкожен) | принимаем `alt: string` пропом (обязательный) | сейчас неверен для chat-карточки |
| `components/CallsCards.tsx` | — | `"Звонки в Mute — личные и в комнатах до 8"` / `"Чат в Mute — личные сообщения и групповые чаты"` | контекстные ключи |
| `components/Header.tsx:26` | `"Logo"` | `"Mute"` | бренд вместо родового слова |
| `components/HeroBlock.tsx:42` | `""` | `"Голосовой чат Mute"` | descriptive alt, без keyword stuffing |

Не трогаем: Footer (`alt="Mute"` уже ок), FeatureItem (`alt={title}` ок), ButtonPrimary иконки (`alt=""` корректно — декоративные), FinalCallSection (CSS background, alt не нужен).

### 4. Прочее

- `app/sitemap.ts` — уже корректен, не трогаем.
- `public/robots.txt` — уже корректен, не трогаем.
- `metadataBase` уже задан → автоматически разрешает относительные og-урлы.

## Что вне скоупа

- Изменение H1/H2 в hero/секциях (текущие копи в брендовом стиле, ручной keyword-pump испортит тон).
- Перезаливка og-картинки — текущая `/open-graph.png` валидная.
- Аналитика, GTM, дополнительные пиксели — отдельная задача.
- Локализация на английский — сейчас целимся только в RU/СНГ.
- `Organization` schema, `aggregateRating`, `screenshot` в JSON-LD — потенциальное расширение позже.

## Метрики успеха

- Title и description в HEAD соответствуют новым строкам.
- Ключевые фразы присутствуют в `<meta name="keywords">`.
- В `<body>` есть валидный JSON-LD `SoftwareApplication` (проверяемый через https://validator.schema.org/).
- Lighthouse SEO score не падает (текущий уровень — TBD до замера).
- Все картинки секций имеют корректный alt; декоративные — `alt=""`, контентные — описательный.
