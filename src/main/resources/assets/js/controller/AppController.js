/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Controller from './Controller';
import MemoModel from '../model/MemoModel';
import RouterInstance from '../libs/Router';
import PubSubInstance from '../libs/PubSub';
import ToasterInstance from '../libs/Toaster';
import DialogInstance from '../libs/Dialog';

export default class AppController extends Controller {

    constructor() {

        super();

        this.sideNavToggleButton = document.querySelector('.js-toggle-menu');
        this.sideNav = document.querySelector('.js-side-nav');

        this.sideNavContent = this.sideNav.querySelector('.js-side-nav-content');
        this.newRecordingButton = document.querySelector('.js-new-recording-btn');

        this.deleteMemos = this.sideNav.querySelector('.js-delete-memos');
        this.deleteMemos.addEventListener('click', this.deleteAllMemos);

        RouterInstance().then(router => {
            router.add('_root',
            (data) => this.show(data),
            () => this.hide());
        });

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


        // Wait for the first frame because sometimes
        // window.onload fires too quickly.
        requestAnimationFrame(() => {

            function showWaitAnimation(e) {
                e.target.classList.add('pending');
            }

            this.sideNavToggleButton.addEventListener('click', () => {
                this.toggleSideNav();
            });
        });

        if (!this.supportsGUMandWebAudio()) {
            //  document.body.classList.add('superfail');
            this.newRecordingButton.classList.add('hidden');

            ToasterInstance().then(toaster => {
                toaster.toast('This browser doesn\'t support audio recording.');
            });

            return;
        }


        require('../../precache/third_party/Recorderjs/recorder.js');

        require('../voicememo-record.js');
        require('../voicememo-list.js');
        require('../voicememo-details.js');
    }

    supportsGUMandWebAudio() {
        return !!(navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia) &&

            !!(window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.msAudioContext);
    }

    show() {
        this.sideNavToggleButton.tabIndex = 1;
        this.newRecordingButton.tabIndex = 2;
    }

    hide() {
        this.sideNavToggleButton.tabIndex = -1;
        this.newRecordingButton.tabIndex = -1;

        PubSubInstance().then(ps => {
            ps.pub('list-covered');
        });
    }

    toggleSideNav() {

        if (this.sideNav.classList.contains('side-nav--visible'))
            this.closeSideNav();
        else
            this.openSideNav();
    }

    openSideNav() {

        this.sideNav.classList.add('side-nav--visible');
        this.sideNavToggleButton.focus();

        var onSideNavTransitionEnd = (e) => {

            // Force the focus, otherwise touch doesn't always work.
            this.sideNavContent.tabIndex = 0;
            this.sideNavContent.focus();
            this.sideNavContent.removeAttribute('tabIndex');

            this.sideNavContent.classList.remove('side-nav__content--animatable');
            this.sideNavContent.removeEventListener('transitionend',
                onSideNavTransitionEnd);
        }

        this.sideNavContent.classList.add('side-nav__content--animatable');
        this.sideNavContent.addEventListener('transitionend',
            onSideNavTransitionEnd);

        requestAnimationFrame(() => {
            this.sideNavContent.style.transform = 'translateX(0px)';
        });
    }

    closeSideNav() {
        this.sideNav.classList.remove('side-nav--visible');
        this.sideNavContent.classList.add('side-nav__content--animatable');
        this.sideNavContent.style.transform = 'translateX(-102%)';

        let onSideNavClose = () => {
            this.sideNav.removeEventListener('transitionend', onSideNavClose);
        }
        this.sideNav.addEventListener('transitionend', onSideNavClose);
    }

    resetAllData() {
        DialogInstance()
            .then(dialog => {

                return dialog.show(
                    'Delete all the things?',
                    'Are you sure you want to remove all data?');

            })
            .then(() => {
                //       AppModel.nuke();
                window.location = '/';
            })
            .catch(() => {
            });
    }

    deleteAllMemos() {
        DialogInstance()
            .then(dialog => {

                return dialog.show(
                    'Delete all memos?',
                    'Are you sure you want to remove all memos?');

            })
            .then(() => {

                MemoModel.deleteAll().then(() => {
                    PubSubInstance().then(ps => {
                        ps.pub(MemoModel.UPDATED);
                    });

                    ToasterInstance().then(toaster => {
                        toaster.toast('All memos deleted.');
                    });

                    RouterInstance().then(router => {
                        router.go('/');
                    });
                });

            }).catch(() => {
        });
    }

}
