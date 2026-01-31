# Release Notes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Реализовать механику релиз ноутов с markdown файлами и отдельными страницами для каждого релиза.

**Architecture:** Markdown файлы в `/content/releases/` с frontmatter парсятся через gray-matter. Контент рендерится через react-markdown с кастомными компонентами для видео. SSG для всех страниц.

**Tech Stack:** gray-matter, react-markdown, Next.js App Router (SSG)

---

### Task 1: Установить зависимости

**Step 1: Установить gray-matter и react-markdown**

Run: `npm install gray-matter react-markdown`

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add gray-matter and react-markdown dependencies"
```

---

### Task 2: Создать структуру контента и пример релиза

**Files:**
- Create: `content/releases/1-2-0.md`

**Step 1: Создать директорию и файл релиза**

Create `content/releases/1-2-0.md`:

```md
---
version: "1.2.0"
date: "2026-01-31"
title: "Обновление 1.2.0"
summary: "Добавлены голосовые сообщения, исправлены ошибки авторизации, улучшена производительность звонков"
---

## Голосовые сообщения

Теперь можно отправлять голосовые сообщения прямо из чата. Просто зажмите кнопку микрофона и говорите.

## Исправления

- Исправлены ошибки авторизации при первом входе
- Улучшена производительность звонков на слабых устройствах
- Исправлен баг с отображением уведомлений
```

**Step 2: Commit**

```bash
git add content/releases/1-2-0.md
git commit -m "Add sample release note"
```

---

### Task 3: Создать утилиту для чтения релизов

**Files:**
- Create: `lib/releases.ts`

**Step 1: Создать lib/releases.ts**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const releasesDirectory = path.join(process.cwd(), "content/releases");

export interface Release {
  slug: string;
  version: string;
  date: string;
  title: string;
  summary: string;
  content: string;
}

export function getAllReleases(): Release[] {
  if (!fs.existsSync(releasesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(releasesDirectory);

  const releases = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(releasesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        version: data.version,
        date: data.date,
        title: data.title,
        summary: data.summary,
        content,
      };
    });

  return releases.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getReleaseBySlug(slug: string): Release | null {
  const fullPath = path.join(releasesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    version: data.version,
    date: data.date,
    title: data.title,
    summary: data.summary,
    content,
  };
}

export function getAllReleaseSlugs(): string[] {
  if (!fs.existsSync(releasesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(releasesDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}
```

**Step 2: Commit**

```bash
git add lib/releases.ts
git commit -m "Add releases utility functions"
```

---

### Task 4: Обновить ReleaseCard для приёма пропсов

**Files:**
- Modify: `components/ReleaseCard.tsx`

**Step 1: Обновить ReleaseCard**

```tsx
import Link from "next/link";

interface ReleaseCardProps {
  slug: string;
  date: string;
  title: string;
  summary: string;
}

export default function ReleaseCard({ slug, date, title, summary }: ReleaseCardProps) {
  return (
    <Link
      href={`/releases/${slug}`}
      className="w-1/3 border border-[#1F1F1F] p-6 transition-colors hover:bg-white/5"
    >
      <p className="body-text text-text-secondary">{date}</p>
      <div className="mt-4">
        <h3 className="title-medium-semibold">{title}</h3>
        <p className="body-text text-text-secondary mt-2">{summary}</p>
      </div>
    </Link>
  );
}
```

**Step 2: Commit**

```bash
git add components/ReleaseCard.tsx
git commit -m "Update ReleaseCard to accept props and link to detail page"
```

---

### Task 5: Обновить ReleaseNotes для чтения данных

**Files:**
- Modify: `components/ReleaseNotes.tsx`

**Step 1: Обновить ReleaseNotes**

```tsx
import ReleaseCard from "./ReleaseCard";
import { getAllReleases } from "@/lib/releases";

export default function ReleaseNotes() {
  const releases = getAllReleases();

  return (
    <section className="w-full py-[120px] bg-background-primary">
      <div className="container">
        <h2 className="title-large">Что нового, Mute?</h2>
        <div className="mt-8 flex gap-5">
          {releases.slice(0, 3).map((release) => (
            <ReleaseCard
              key={release.slug}
              slug={release.slug}
              date={release.date}
              title={release.title}
              summary={release.summary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Проверить что страница работает**

Открыть http://localhost:3000 и убедиться что секция ReleaseNotes отображает карточку.

**Step 3: Commit**

```bash
git add components/ReleaseNotes.tsx
git commit -m "Update ReleaseNotes to read data from markdown files"
```

---

### Task 6: Создать страницу релиза

**Files:**
- Create: `app/releases/[slug]/page.tsx`

**Step 1: Создать страницу**

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getReleaseBySlug, getAllReleaseSlugs } from "@/lib/releases";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllReleaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);

  if (!release) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container py-[80px]">
        <article className="max-w-[700px] mx-auto">
          <Link
            href="/"
            className="body-text text-text-secondary hover:text-accent transition-colors"
          >
            ← Назад
          </Link>

          <div className="mt-8">
            <p className="body-text text-text-secondary">{release.date}</p>
            <h1 className="title-large mt-2">{release.title}</h1>
          </div>

          <div className="mt-8 prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="title-medium-semibold mt-8 mb-4">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="body-text text-text-secondary mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="body-text text-text-secondary">{children}</li>
                ),
                img: ({ src, alt }) => (
                  <img src={src} alt={alt || ""} className="w-full rounded-lg my-6" />
                ),
                video: ({ src }) => (
                  <video src={src} controls className="w-full rounded-lg my-6" />
                ),
              }}
            >
              {release.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
```

**Step 2: Проверить страницу**

Открыть http://localhost:3000/releases/1-2-0 и убедиться что страница отображается.

**Step 3: Commit**

```bash
git add app/releases/[slug]/page.tsx
git commit -m "Add release detail page"
```

---

### Task 7: Добавить ещё примеры релизов

**Files:**
- Create: `content/releases/1-1-0.md`
- Create: `content/releases/1-0-0.md`

**Step 1: Создать 1-1-0.md**

```md
---
version: "1.1.0"
date: "2026-01-15"
title: "Обновление 1.1.0"
summary: "Новый дизайн чатов, тёмная тема, улучшенные уведомления"
---

## Новый дизайн чатов

Полностью переработали интерфейс чатов. Теперь он стал удобнее и современнее.

## Тёмная тема

Добавили долгожданную тёмную тему. Включается в настройках приложения.

## Улучшения

- Переработаны уведомления
- Ускорена загрузка истории сообщений
```

**Step 2: Создать 1-0-0.md**

```md
---
version: "1.0.0"
date: "2026-01-01"
title: "Релиз 1.0.0"
summary: "Первый публичный релиз Mute"
---

## Первый релиз

Рады представить первую версию Mute — мессенджера нового поколения.

## Возможности

- Текстовые сообщения
- Голосовые и видеозвонки
- Групповые чаты
- Шифрование end-to-end
```

**Step 3: Проверить что все карточки отображаются**

Открыть http://localhost:3000 и убедиться что отображаются 3 карточки.

**Step 4: Commit**

```bash
git add content/releases/
git commit -m "Add more sample release notes"
```

---

### Task 8: Финальная проверка

**Step 1: Проверить главную страницу**

- Открыть http://localhost:3000
- Убедиться что секция "Что нового, Mute?" показывает 3 карточки
- Карточки отсортированы по дате (новые первые)

**Step 2: Проверить переходы**

- Кликнуть на карточку
- Убедиться что открывается страница `/releases/[slug]`
- Убедиться что кнопка "Назад" работает

**Step 3: Проверить контент**

- На странице релиза отображается дата, заголовок, контент
- Стили соответствуют дизайну сайта
