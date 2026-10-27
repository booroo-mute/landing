// Windows: нативное приложение (Velopack): MuteSetup.exe лежит на сервере
// обновлений и всегда отдаёт последнюю стабильную сборку, так что ссылка
// не меняется от версии к версии; меняется только номер ниже. Дальше
// приложение обновляется само.
// macOS: нативное приложение (Sparkle) с 8 октября 2026. Mute.dmg на том же
// сервере обновлений всегда указывает на последнюю стабильную сборку, так
// что ссылка тоже постоянная; меняется только номер ниже. Только Apple
// Silicon и macOS 14+, это сказано на /download и в /install/macos.
const MACOS_VERSION = '1.1.7'

export const DOWNLOAD_CONFIG = {
  // Дата последнего релиза на странице: dateModified /download берёт её,
  // если она новее ручной DOWNLOAD_UPDATED, чтобы страница «свежела» с
  // каждым релизом без правки lib/site.ts.
  released: '2026-10-27',
  versions: {
    windows: '1.1.6',
    macos: MACOS_VERSION,
  },
  files: {
    windows: 'https://beta.mute.ac/updates/win/x64/stable/MuteSetup.exe',
    macos: 'https://beta.mute.ac/updates/mac/arm64/stable/Mute.dmg',
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return DOWNLOAD_CONFIG.files[os]
}
