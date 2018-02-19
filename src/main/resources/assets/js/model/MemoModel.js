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

import Model from './Model';
import LogModel from "./LogModel";
import RepoDBInstance from "../libs/db/RepoDB";
import IndexedDBInstance from "../libs/db/IndexedDB";

export default class MemoModel extends Model {

    constructor(data, key) {

        super(key);

        this.title = data.title || 'Untitled Memo';
        this.description = data.description || null;
        this.url = data.url || MemoModel.makeURL();
        this.audio = data.audio || null;
        this.volumeData = data.volumeData || null;
        this.time = data.time || Date.now();
        this.modifiedTime = data.time || null;
        this.transcript = data.transcript || null;
    }

    static makeURL() {
        var url = '';
        for (var i = 0; i < 16; i++) {
            url += Number(
                Math.floor(Math.random() * 16)
            ).toString(16);
        }

        return url;
    }

    static get UPDATED() {
        return 'MemoModel-updated';
    }

    static get storeName() {
        return 'MemoModel';
    }

    static getDBInstance() {
        return !this.isOnline() ?
            IndexedDBInstance() : RepoDBInstance();
    }

    static put(value) {
        return super.put(value).then((memo) => {
            if (!this.isOnline())
                new LogModel({memoKey: memo.url, type: memo.modifiedTime ? "U" : "C"}, this.makeURL()).put();
            return memo;
        })
    }

    static delete(value) {
        return super.delete(value).then((event) => {
            if (!this.isOnline())
                new LogModel({memoKey: value, type: "D"}, this.makeURL()).put();
            return event;
        })
    }

    toJson() {
        return JSON.stringify({
            title: this.title,
            description: this.description,
            url: this.url,
            audio: this.audio,
            volumeData: this.volumeData,
            time: this.time,
            modifiedTime: this.modifiedTime,
            transcript: this.transcript
        });
    }

}
