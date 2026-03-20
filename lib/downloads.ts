export const DOWNLOAD_CONFIG = {
  baseUrl: 'https://download.mute.ac', // TODO: поменять когда будет известен URL
  files: {
    windows: 'https://github.com/ylwsubmarine/mute-releases/releases/download/v0.2.2/mute-win-0.2.2.exe',
    macos: 'https://github.com/ylwsubmarine/mute-releases/releases/download/v0.2.2/mute-macos-0.2.2.dmg',
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return DOWNLOAD_CONFIG.files[os]
}
