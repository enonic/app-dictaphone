require('../css/voicememo-core.less');
require('../css/voicememo-record.less');
require('../css/voicememo-list.less');
require('../css/voicememo-details.less');
require('../css/voicememo-edit.less');


import AppController from './controller/AppController';

new AppController();

window.onload = function () {

    const toggleOnlineStatus = function () {
        if (navigator.onLine) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.sync.register('dbSync');
                });
            }
        }
    };

    toggleOnlineStatus();

    window.addEventListener("offline", toggleOnlineStatus);
    window.addEventListener("online", toggleOnlineStatus);
};

