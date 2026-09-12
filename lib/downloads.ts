const VERSION = '0.2.2'
const RELEASES_BASE = 'https://github.com/ylwsubmarine/mute-releases/releases/download'

export const DOWNLOAD_CONFIG = {
  version: VERSION,
  baseUrl: 'https://download.mute.ac', // TODO: поменять когда будет известен URL
  files: {
    windows: `${RELEASES_BASE}/v${VERSION}/mute-win-${VERSION}.exe`,
    macos: `${RELEASES_BASE}/v${VERSION}/mute-macos-${VERSION}.dmg`,
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return DOWNLOAD_CONFIG.files[os]
}
