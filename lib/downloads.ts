// Windows: нативное приложение (Velopack): MuteSetup.exe лежит на сервере
// обновлений и всегда отдаёт последнюю стабильную сборку, так что ссылка
// не меняется от версии к версии; меняется только номер ниже. Дальше
// приложение обновляется само.
// macOS: нативное приложение (Sparkle) с 8 октября 2026. Mute.dmg на том же
// сервере обновлений всегда указывает на последнюю стабильную сборку, так
// что ссылка тоже постоянная; меняется только номер ниже. Только Apple
// Silicon и macOS 14+, это сказано на /download и в /install/macos.
const MACOS_VERSION = '1.0.4'

export const DOWNLOAD_CONFIG = {
  versions: {
    windows: '1.0.4',
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
