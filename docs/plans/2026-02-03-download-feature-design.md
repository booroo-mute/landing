# Download Feature Design

## Overview

Реализация автоскачивания приложения с лендинга с fallback на ручное скачивание.

## Решения

- **Хранение файлов:** собственный сервер
- **Платформы:** Windows + macOS
- **URL:** фиксированные (всегда последняя версия)
- **Базовый URL:** конфигурируемый (placeholder до готовности сервера)

## Файлы

### 1. `lib/downloads.ts` (новый)

Централизованная конфигурация URL для скачивания:

```typescript
export const DOWNLOAD_CONFIG = {
  baseUrl: 'https://download.mute.ac', // поменять когда будет известен
  files: {
    windows: 'mute-installer.exe',
    macos: 'mute-installer.dmg',
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return `${DOWNLOAD_CONFIG.baseUrl}/${DOWNLOAD_CONFIG.files[os]}`
}
```

### 2. `app/download/page.tsx` (изменение)

Переписать на клиентский компонент с логикой:

1. Определение ОС пользователя (переиспользуем существующий OSProvider)
2. Автоскачивание через 500мс после загрузки страницы
3. Fallback-ссылка для текущей платформы

## Поведение по устройствам

| Устройство | Действие |
|------------|----------|
| Windows | Автоскачивание .exe + fallback-ссылка на .exe |
| macOS | Автоскачивание .dmg + fallback-ссылка на .dmg |
| Мобильное | Редирект на beta.mute.ac/welcome |
| Неизвестное | Показать обе ссылки, без автоскачивания |

## UI страницы /download

Текущий дизайн сохраняется:

```
[Логотип Mute]

Скачивание начнётся автоматически

Если загрузка не началась, нажмите сюда → [ссылка на файл для текущей ОС]

[Картинка приложения]
```

Для неизвестной ОС показываем обе ссылки:
- Скачать для Windows
- Скачать для macOS
