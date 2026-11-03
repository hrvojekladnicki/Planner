// Planner service worker — omogućuje instalaciju na mobitel i sistemske obavijesti (Android).
// Namjerno NE kešira aplikaciju, da uvijek dobiješ najnoviju verziju s GitHub Pagesa.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {}); // potrebno za "Install app" u nekim preglednicima

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = all.find((c) => c.url.includes('planner'));
    if (client) {
      await client.focus();
      client.postMessage({ type: 'open-notifications' });
    } else {
      await self.clients.openWindow('./planner.html');
    }
  })());
});
