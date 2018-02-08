require('../css/voicememo-core.less');

import AppModel from './model/AppModel';

(function () {
    window.onload = function () {
        this.appModel = null;

        this.sideNavToggleButton = document.querySelector('.js-toggle-menu');

        this.sideNav = document.querySelector('.js-side-nav');

        this.sideNavContent = this.sideNav.querySelector('.js-side-nav-content');

        this.deleteMemos = this.sideNav.querySelector('.js-delete-memos');
        this.deleteMemos.addEventListener('click', this.deleteAllMemos);


        AppModel.get(1).then(appModel => {

            RouterInstance().then(router => {
                router.add('_root',
                    (data) => this.show(data),
                    () => this.hide());
            });

            this.appModel = appModel;

            if (appModel === undefined) {
                this.appModel = new AppModel();
                this.appModel.put();
            }

            if (this.appModel.firstRun) {
                // Show welcome screen
            }

            var touchStartX;
            var sideNavTransform;
            var onSideNavTouchStart = (e) => {
                touchStartX = e.touches[0].pageX;
            }

            var onSideNavTouchMove = (e) => {

                var newTouchX = e.touches[0].pageX;
                sideNavTransform = Math.min(0, newTouchX - touchStartX);

                if (sideNavTransform < 0)
                    e.preventDefault();

                this.sideNavContent.style.transform =
                    'translateX(' + sideNavTransform + 'px)';
            }

            var onSideNavTouchEnd = (e) => {

                if (sideNavTransform < -1)
                    this.closeSideNav();

            }

            this.sideNav.addEventListener('click', () => {
                this.closeSideNav();
            });
            this.sideNavContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            this.sideNavContent.addEventListener('touchstart', onSideNavTouchStart);
            this.sideNavContent.addEventListener('touchmove', onSideNavTouchMove);
            this.sideNavContent.addEventListener('touchend', onSideNavTouchEnd);

            if (!this.supportsGUMandWebAudio()) {
                document.body.classList.add('superfail');
                this.newRecordingButton.classList.add('hidden');
                return;
            }

            // Wait for the first frame because sometimes
            // window.onload fires too quickly.
            requestAnimationFrame(() => {

                function showWaitAnimation(e) {
                    e.target.classList.add('pending');
                }

                this.newRecordingButton.addEventListener('click', showWaitAnimation);

                this.loadScript('/scripts/voicememo-list.js')
                this.loadScript('/scripts/voicememo-details.js');
                this.loadScript('/scripts/voicememo-record.js').then(() => {
                    this.newRecordingButton.removeEventListener('click', showWaitAnimation);
                });

                this.sideNavToggleButton.addEventListener('click', () => {
                    this.toggleSideNav();
                });
            });

            if ('serviceWorker' in navigator) {

                navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                }).then(function (registration) {

                    var isUpdate = false;

                    // If this fires we should check if there's a new Service Worker
                    // waiting to be activated. If so, ask the user to force refresh.
                    if (registration.active)
                        isUpdate = true;

                    registration.onupdatefound = function (event) {

                        console.log("A new Service Worker version has been found...");

                        // If an update is found the spec says that there is a new Service
                        // Worker installing, so we should wait for that to complete then
                        // show a notification to the user.
                        registration.installing.onstatechange = function (event) {

                            if (this.state === 'installed') {

                                console.log("Service Worker Installed.");

                                if (isUpdate) {
                                    ToasterInstance().then(toaster => {
                                        toaster.toast(
                                            'App updated. Restart for the new version.');
                                    });
                                } else {
                                    ToasterInstance().then(toaster => {
                                        toaster.toast('App ready for offline use.');
                                    });
                                }

                            } else {
                                console.log("New Service Worker state: ", this.state);
                            }
                        };
                    };
                }, function (err) {
                    console.log(err);
                });
            }
        });










    };
})();