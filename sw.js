// Red primero para la app y la capa; copia en caché para abrir sin cobertura
const CACHE = "piezometros-leon-v5";
const PROPIOS = ["./", "index.html", "ACTUACIONES_25830.fgb", "manifest.json", "icon.svg", "provincia_leon.geojson"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PROPIOS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  const propio = u.origin === location.origin;
  const libreria = /cdnjs\.cloudflare\.com|unpkg\.com/.test(u.host);
  if (e.request.method !== "GET" || !(propio || libreria)) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
