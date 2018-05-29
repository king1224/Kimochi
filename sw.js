console.log('sw.js Script loaded!')
var dataCacheName = 'KIMOCHI'

var cacheList = [
	'/',
	"/newmail.html",
	"/inbox.html",
	"/takephoto.html",
	"/style/newmail.css",
	"/style/inbox.css",
	"/style/takephoto.css",
	"/js/newmail.js",
	"/js/inbox.js",
	"/js/takephoto.js",
	"/images/kekeke-01.png",
	"/images/kekeke-02.png",
	"/images/kekeke-03.png",
	"/images/kekeke-04.png",
	"/images/kekeke-05.png",
	"/images/kekeke-06.png",
	"/images/kekeke-07.png",
	"/images/kekeke-08.png",
	"/images/kekeke-09.png",
	"/images/kekeke-10.png",
	"/images/kekeke-11.png",
	"/images/kekeke-12.png",
	"/images/kekeke-13.png",
	"/images/kekeke-14.png",
	"/images/kekeke-15.png",
	"/images/kekeke-16.png",
	"/images/kekeke-17.png",
	"/images/kekeke-18.png",
	"/images/kekeke-19.png",
	"/images/kekeke-20.png",
	"/images/kekeke-21.png",
	"/images/kekeke-22.png",
	"/images/kekeke-23.png",
	"/images/kekeke-24.png",
	"/images/kekeke-25.png",
	"/images/kekeke-26.png",
	"/images/kekeke-27.png",
	"/images/signin-20.png",
	"/images/signin-21.png",
	"https://code.jquery.com/jquery-3.3.1.js",
	"https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js",
	"http://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js"
]

// install
self.addEventListener('install', event => {
    console.log('installing…');
	event.waitUntil(
		caches.open(dataCacheName).then(cache => {
			return cache.addAll(cacheList);
		})
	);
});

// activate
self.addEventListener('activate', event => {
    console.log('now ready to handle fetches!');
	event.waitUntil(
		caches.keys().then(function(dataCacheNames) {
			var promiseArr = dataCacheNames.map(function(item) {
				if (item !== dataCacheName) {
					// Delete that cached file
					return caches.delete(item);
				}
			})
			return Promise.all(promiseArr);
		})
	); // end e.waitUntil
	return self.clients.claim();
});

// fetch
self.addEventListener('fetch', event => {
	console.log('now fetch!');
	//console.log('event.request:', event.request);
	//console.log('[ServiceWorker] Fetch', event.request.url);
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request).then(res =>
				// 存 caches 之前，要先打開 caches.open(dataCacheName)
				caches.open(dataCacheName)
				.then(function(cache) {
					// cache.put(key, value)
					// 下一次 caches.match 會對應到 event.request
					//cache.put(event.request, res.clone());
					return res;
				})
			);
		})
	);
});