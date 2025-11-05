self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('jardin-cache').then(function(cache) {
      return cache.addAll([
        '/',
        './index.html',
        './ajout_plantation.html',
        './fiche_plantation.html',
        './stock_materiel.html',
        './stock_plant.html',
        './styles.css',
        './constants.js',
        './app.js',
        './favicon.png'
      ]);
    }).catch(err => console.error("Erreur de mise en cache", err))
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    }).catch(err => {
      console.error("Erreur de fetch", err);
      return fetch(e.request);
    })
  );
});
