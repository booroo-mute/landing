export const DOWNLOAD_CONFIG = {
  baseUrl: 'https://download.mute.ac', // TODO: поменять когда будет известен URL
  files: {
    windows: 'https://release-assets.githubusercontent.com/github-production-release-asset/1155788758/10297371-342e-422f-8e1f-08d5a4cc9384?sp=r&sv=2018-11-09&sr=b&spr=https&se=2026-02-12T13%3A05%3A28Z&rscd=attachment%3B+filename%3Dmute-win-0.2.1.exe&rsct=application%2Foctet-stream&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2026-02-12T12%3A04%3A42Z&ske=2026-02-12T13%3A05%3A28Z&sks=b&skv=2018-11-09&sig=NpNrx0b01NxkPURD9MYJF0pzZtWz3ZT5LKZ7P%2BTNzvk%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc3MDkwMjEyNiwibmJmIjoxNzcwODk4NTI2LCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.zleKSLXCQgjcRZZGg0K2EptIoiXTTb5qC93KLZHw6II&response-content-disposition=attachment%3B%20filename%3Dmute-win-0.2.1.exe',
    macos: 'https://release-assets.githubusercontent.com/github-production-release-asset/1155788758/7de95e09-6742-4a45-896a-75449d550810?sp=r&sv=2018-11-09&sr=b&spr=https&se=2026-02-12T13%3A07%3A48Z&rscd=attachment%3B+filename%3Dmute-macos-0.2.1.dmg&rsct=application%2Foctet-stream&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2026-02-12T12%3A07%3A46Z&ske=2026-02-12T13%3A07%3A48Z&sks=b&skv=2018-11-09&sig=jnXvGNy3%2BajWlQuQvUXK0%2FJmw6TfQAYygxG%2BcuvT5Zk%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc3MDkwMDMwMiwibmJmIjoxNzcwODk4NTAyLCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.7welEwxi4epMWdIHk0ITNOM67h_guzwqXE8TYwtX00w&response-content-disposition=attachment%3B%20filename%3Dmute-macos-0.2.1.dmg',
  },
  webVersion: 'https://beta.mute.ac/welcome',
}

export function getDownloadUrl(os: 'windows' | 'macos'): string {
  return DOWNLOAD_CONFIG.files[os]
}
