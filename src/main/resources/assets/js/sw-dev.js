const swVersion = '{{appVersion}}';

workbox.core.setCacheNameDetails({
    prefix: 'enonic-dictaphone',
    suffix: '{{appVersion}}',
    precache: 'precache',
    runtime: 'runtime'
});

workbox.core.clientsClaim();
workbox.core.skipWaiting();

// This is a placeholder for manifest dynamically injected from webpack.config.js
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// Here we precache urls that are generated dynamically in the main.js controller
workbox.precaching.precacheAndRoute([
    '{{{preCacheRoot}}}',
{
    "revision": "{{appVersion}}",
    "url": "{{baseUrl}}/manifest.json"
}, {
    "revision": "{{appVersion}}",
    "url": "{{baseUrl}}/browserconfig.xml"
}, {
    "revision": "{{appVersion}}",
    "url": "https://fonts.googleapis.com/icon?family=Material+Icons"
}]);

workbox.routing.setDefaultHandler(new workbox.strategies.NetworkOnly());

workbox.routing.registerRoute('/webapp/com.enonic.app.dictaphone/getAll', new workbox.strategies.NetworkFirst({
    "cacheName": "all-memo-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

workbox.routing.registerRoute('/webapp/com.enonic.app.dictaphone/get', new workbox.strategies.NetworkFirst({
    "cacheName": "memo-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

workbox.routing.registerRoute('/webapp/com.enonic.app.dictaphone/getAudio', new workbox.strategies.NetworkFirst({
    "cacheName": "audio-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

workbox.routing.registerRoute('/webapp/com.enonic.app.dictaphone/put', new workbox.strategies.NetworkFirst());
