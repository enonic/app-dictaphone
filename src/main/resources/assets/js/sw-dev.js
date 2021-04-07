import {setCacheNameDetails, clientsClaim, skipWaiting} from 'workbox-core';
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute, setDefaultHandler} from 'workbox-routing';
import {NetworkOnly, NetworkFirst} from 'workbox-strategies';

setCacheNameDetails({
    prefix: 'enonic-dictaphone',
    suffix: '{{appVersion}}',
    precache: 'precache',
    runtime: 'runtime'
});

clientsClaim();
skipWaiting();

// This is a placeholder for manifest dynamically injected from webpack.config.js
precacheAndRoute(self.__WB_MANIFEST);

// Here we precache urls that are generated dynamically in the main.js controller
precacheAndRoute([
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

setDefaultHandler(new NetworkOnly());

registerRoute('/webapp/com.enonic.app.dictaphone/getAll', new NetworkFirst({
    "cacheName": "all-memo-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

registerRoute('/webapp/com.enonic.app.dictaphone/get', new NetworkFirst({
    "cacheName": "memo-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

registerRoute('/webapp/com.enonic.app.dictaphone/getAudio', new NetworkFirst({
    "cacheName": "audio-cache",
    "cacheExpiration": {
        "maxEnteries": 100,
        "maxAgeSeconds": 1000
    }
}));

registerRoute('/webapp/com.enonic.app.dictaphone/put', new NetworkFirst());
