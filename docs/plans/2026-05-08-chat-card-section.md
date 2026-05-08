# Chat Card in CallsCards Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the two existing call cards in `CallsCards` with a single merged calls card and a new chat card.

**Architecture:** Single file edit (`components/CallsCards.tsx`) plus one new placeholder asset. Existing `CallCard` component contract (`title`, `description`, `imageSrc`) is reused as-is.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4. Asset is an SVG placeholder rendered via `next/image`.

**Design source:** `docs/plans/2026-05-08-chat-card-section-design.md`

---

## Task 1: Create chat card placeholder SVG

**Files:**
- Create: `public/chat-card-placeholder.svg`

**Step 1: Write the SVG**

The placeholder should match `CallCard` image dimensions (700×400) and the dark palette of the surrounding `background-secondary` (`#1F1F1F`). Add subtle "message bubble" hints so the card looks intentional rather than empty.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" width="700" height="400">
  <rect width="700" height="400" fill="#1F1F1F"/>
  <rect x="80"  y="120" rx="14" ry="14" width="260" height="44" fill="#2A2A2A"/>
  <rect x="80"  y="180" rx="14" ry="14" width="180" height="44" fill="#2A2A2A"/>
  <rect x="360" y="240" rx="14" ry="14" width="260" height="44" fill="#3A3A3A"/>
</svg>
```

**Step 2: Verify file exists and renders**

Run: `ls -la public/chat-card-placeholder.svg`
Expected: file present, non-empty.

Open `http://localhost:3000/chat-card-placeholder.svg` in the running dev server.
Expected: dark rectangle with three rounded "bubbles" visible.

**Step 3: Commit**

```bash
git add public/chat-card-placeholder.svg
git commit -m "feat(landing): add chat card placeholder SVG"
```

---

## Task 2: Update CallsCards to merge calls and add chat

**Files:**
- Modify: `components/CallsCards.tsx`

**Current contents (for reference):**

```tsx
<CallCard
  title="Личные звонки"
  description="Не нужно искать канал или ждать остальных. Просто разговор один на один."
  imageSrc="/solo-calls-card-1.png"
/>
<CallCard
  title="Комнаты до 8 человек"
  description={"Один клик — и комната готова.\nЗаходи когда удобно."}
  imageSrc="/group-calls-card-2.png"
/>
```

**Step 1: Replace both `CallCard` blocks**

New content:

```tsx
<CallCard
  title="Звони как удобно"
  description="От разговора 1:1 до комнаты на 8. Один клик — и ты на связи."
  imageSrc="/group-calls-card-2.png"
/>
<CallCard
  title="Общайся текстом"
  description="Личные сообщения и групповые чаты. Пиши друзьям и в комнатах."
  imageSrc="/chat-card-placeholder.svg"
/>
```

Section heading (`<h2>Связь на любой случай</h2>`) and surrounding markup stay unchanged.

**Step 2: Verify dev server compiles cleanly**

Run: `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`.

Tail the dev server log for the most recent compile.
Expected: no errors, no missing-image warnings.

**Step 3: Visual verification in browser**

Open `http://localhost:3000/` and scroll to the "Связь на любой случай" section.

Verify:
- Section title still reads «Связь на любой случай».
- Left card: title «Звони как удобно», description «От разговора 1:1 до комнаты на 8. Один клик — и ты на связи.», existing group-calls image.
- Right card: title «Общайся текстом», description «Личные сообщения и групповые чаты. Пиши друзьям и в комнатах.», dark SVG placeholder with 3 message bubbles.
- Mobile breakpoint (<768px): cards stack vertically, no overflow.
- Desktop breakpoint (≥768px): cards sit side-by-side, equal widths.

If anything looks off, do not commit — iterate.

**Step 4: Commit**

```bash
git add components/CallsCards.tsx
git commit -m "feat(landing): merge call cards and add chat card

Replaces 'Личные звонки' + 'Комнаты до 8 человек' with a single
'Звони как удобно' card, and adds a new 'Общайся текстом' card
covering the new chat feature in the app."
```

---

## Out of scope

- `app/page.tsx`, `HeroBlock`, `InfoBlock`, `FeatureList`, `FinalCallSection` — untouched.
- `CallCard.tsx` component itself — contract is sufficient, no changes.
- Removing `public/solo-calls-card-1.png` — leave in place; the user may reuse it later or restore the old layout.
- Storybook stories for `CallCard` — component unchanged, so stories stay as is.
- Replacing the placeholder with a real chat screenshot — user will do this separately by dropping a file at the same path or updating `imageSrc`.

## Verification checklist (final)

- [ ] `public/chat-card-placeholder.svg` exists and renders standalone
- [ ] Landing page loads with HTTP 200, no compile errors
- [ ] Section «Связь на любой случай» shows two new cards with the exact titles/descriptions from this plan
- [ ] Mobile and desktop layouts both look right
- [ ] Two commits made: placeholder asset, then `CallsCards` change
