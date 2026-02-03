export const DOWNLOAD_CONFIG = {
  baseUrl: 'https://download.mute.ac', // TODO: поменять когда будет известен URL
  files: {
    windows: 'mute-installer.exe',
    macos: 'mute-installer.dmg',
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return `${DOWNLOAD_CONFIG.baseUrl}/${DOWNLOAD_CONFIG.files[os]}`
}
