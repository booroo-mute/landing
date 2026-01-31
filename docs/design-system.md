# Design System

## Архитектура

```
globals.css (:root)     ← CSS variables для лендинга
lib/tokens.ts           ← Значения для Storybook stories

⚠️  При изменении цветов — обнови оба файла
```

## Токены

### Цвета

**Где менять:** `globals.css` (:root) + `lib/tokens.ts`

| Токен | CSS Variable | Значение |
|-------|--------------|----------|
| Background Primary | `--background-primary` | #121212 |
| Background Secondary | `--background-secondary` | #1F1F1F |
| Background Tertiary | `--background-tertiary` | #171717 |
| Text Primary | `--text-primary` | #F3F3F3 |
| Text Secondary | `--text-secondary` | #848484 |
| Accent | `--accent` | #B5EF77 |

**Tailwind классы:**
- `bg-background-primary`, `bg-background-secondary`, `bg-background-tertiary`
- `bg-accent`

### Шрифты

| Шрифт | Variable | Начертания |
|-------|----------|------------|
| Golos Text | `--font-golos` | 400, 500, 600, 700 |
| Offbit | `--font-offbit` | 400, 700 |

### Типографика

**Где менять:** `globals.css`

| Класс | Размер | Line-height | Weight |
|-------|--------|-------------|--------|
| `.title-large` | 44px | 56px | 500 |
| `.title-medium` | 24px | 32px | 600 |
| `.body-text` | 17px | 24px | 400 |

**Цветовые классы Tailwind:**
- `text-text-primary` — цвет text-primary
- `text-text-secondary` — цвет text-secondary

## Как изменить токен

### Цвета

1. Открой `globals.css`, измени в `:root`:
```css
:root {
  --accent: #FF0000; /* было #B5EF77 */
}
```

2. Открой `lib/tokens.ts`, измени там же:
```ts
export const colors = {
  accent: '#FF0000',
}
```

### Типографика

Измени только в `globals.css`:
```css
.title-medium {
  font-size: 28px; /* было 24px */
}
```

И в `lib/tokens.ts` (для документации в Storybook):
```ts
titleMedium: {
  fontSize: '28px',
}
```

## Storybook

Запуск:
```bash
npm run storybook
```

Доступен по адресу: http://localhost:6006

### Структура

```
stories/
├── foundations/
│   ├── Colors.stories.tsx      # Палитра цветов
│   ├── Typography.stories.tsx  # Текстовые стили
│   └── Fonts.stories.tsx       # Шрифты
└── components/
    ├── ButtonPrimary.stories.tsx
    ├── ButtonSecondary.stories.tsx
    ├── CallCard.stories.tsx
    ├── FeatureItem.stories.tsx
    └── ReleaseCard.stories.tsx
```

## Компоненты

### UI-элементы

| Компонент | Файл | Описание |
|-----------|------|----------|
| ButtonPrimary | `components/ButtonPrimary.tsx` | Основная кнопка (акцентная) |
| ButtonSecondary | `components/ButtonSecondary.tsx` | Вторичная кнопка |
| CallCard | `components/CallCard.tsx` | Карточка звонка |
| FeatureItem | `components/FeatureItem.tsx` | Элемент списка фич |
| ReleaseCard | `components/ReleaseCard.tsx` | Карточка релиза |

### Секции

| Компонент | Файл | Описание |
|-----------|------|----------|
| Header | `components/Header.tsx` | Шапка сайта |
| HeroBlock | `components/HeroBlock.tsx` | Главный блок |
| InfoBlock | `components/InfoBlock.tsx` | Информационный блок |
| CallsCards | `components/CallsCards.tsx` | Секция с карточками звонков |
| FeatureList | `components/FeatureList.tsx` | Список фич |
| ReleaseNotes | `components/ReleaseNotes.tsx` | Секция релизов |

## Файловая структура

```
├── app/
│   ├── globals.css        # CSS variables + стили
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Главная страница
├── components/            # UI компоненты
├── lib/
│   └── tokens.ts          # Токены для Storybook
├── stories/
│   ├── foundations/       # Документация токенов
│   └── components/        # Документация компонентов
├── docs/
│   └── design-system.md   # Эта документация
└── .storybook/
    ├── main.ts            # Конфигурация Storybook
    └── preview.tsx        # Preview конфиг
```
