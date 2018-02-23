importScripts('https://unpkg.com/workbox-sw@2.1.2/build/importScripts/workbox-sw.prod.v2.1.2.js');

const swVersion = '{{appVersion}}';
const workboxSW = new self.WorkboxSW({
    skipWaiting: true,
    clientsClaim: true
});

workboxSW.precache([]);

// Here we precache urls that are generated dynamically in the main.js controller
workboxSW.precache([
    '{{{preCacheRoot}}}',
    '{{baseUrl}}/manifest.json',
    '{{baseUrl}}/browserconfig.xml',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
]);
workboxSW.router.setDefaultHandler({
    handler: workboxSW.strategies.networkOnly()
});

workboxSW.router.registerRoute('/app/com.enonic.app.dictaphone/getAll', workboxSW.strategies.networkFirst({
    "cacheName": "all-memo-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

workboxSW.router.registerRoute('/app/com.enonic.app.dictaphone/get', workboxSW.strategies.networkFirst({
    "cacheName": "memo-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

workboxSW.router.registerRoute('/app/com.enonic.app.dictaphone/getAudio', workboxSW.strategies.networkFirst({
    "cacheName": "audio-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

workboxSW.router.registerRoute('/app/com.enonic.app.dictaphone/put', workboxSW.strategies.networkOnly());
