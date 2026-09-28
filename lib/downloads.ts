// Windows: нативное приложение (Velopack): MuteSetup.exe лежит на сервере
// обновлений и всегда отдаёт последнюю стабильную сборку, так что ссылка
// не меняется от версии к версии; меняется только номер ниже. Дальше
// приложение обновляется само.
// macOS: пока прежняя сборка с GitHub: у нативного клиента для macOS
// публичной загрузки ещё нет.
const MACOS_VERSION = '0.2.2'
const RELEASES_BASE = 'https://github.com/ylwsubmarine/mute-releases/releases/download'

export const DOWNLOAD_CONFIG = {
  versions: {
    windows: '1.0.0',
    macos: MACOS_VERSION,
  },
  files: {
    windows: 'https://beta.mute.ac/updates/win/x64/stable/MuteSetup.exe',
    macos: `${RELEASES_BASE}/v${MACOS_VERSION}/mute-macos-${MACOS_VERSION}.dmg`,
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return DOWNLOAD_CONFIG.files[os]
}
