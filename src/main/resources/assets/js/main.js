require('../css/voicememo-core.less');
require('../css/voicememo-record.less');
require('../css/voicememo-list.less');
require('../css/voicememo-details.less');
require('../css/voicememo-edit.less');


import AppController from './controller/AppController';
import Sync from './sync/Sync';
import ToasterInstance from "./libs/Toaster";

new AppController();

window.onload = function () {

    const toggleOnlineStatus = function () {
        if (navigator.onLine) {

            if ('serviceWorker' in navigator) {
                Sync.syncOfflineMemos();
            }
        } else {
            ToasterInstance().then(toaster => {
                toaster.toast('Connection is off.');
            });
        }
    };

    toggleOnlineStatus();

    window.addEventListener("offline", toggleOnlineStatus);
    window.addEventListener("online", toggleOnlineStatus);
};

