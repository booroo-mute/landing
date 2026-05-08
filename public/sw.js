// Kill-switch service worker: unregisters itself and refreshes clients,
// so any stale SW from earlier deployments is removed and stops serving
// cached assets. Safe to keep — does nothing if no SW was ever registered.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});
