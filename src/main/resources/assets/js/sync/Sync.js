import LogModel from "../model/LogModel";
import MemoModel from "../model/MemoModel";
import PubSubInstance from "../libs/PubSub";
import ToasterInstance from "../libs/Toaster";

export default class Sync {

    static syncOfflineMemos() {
        LogModel.getAll('time', LogModel.DESCENDING).then((logs) => {
            let syncMemos = [];
            let asyncUpdates = [];

            logs.forEach((log) => {

                if (syncMemos.indexOf(log.memoKey) >= 0) {
                    return;
                }

                if (log.type == LogModel.OPERATION_TYPES.CREATED || log.type == LogModel.OPERATION_TYPES.UPDATED) {
                    syncMemos.push(log.memoKey);

                    asyncUpdates.push(
                        MemoModel.get(log.memoKey).then((localMemo) => {
                            if (localMemo) {
                                return MemoModel.put(localMemo).then(() => {
                                    return MemoModel.delete(log.memoKey, MemoModel.getIndexedDBInstance());
                                })
                            }
                        })
                    );
                } else if (log.type == LogModel.OPERATION_TYPES.DELETED) {
                    syncMemos.push(log.memoKey);

                    asyncUpdates.push(
                        MemoModel.delete(log.memoKey)
                    );
                }
            });

            LogModel.deleteAll();
            asyncUpdates.push(MemoModel.deleteAll(MemoModel.getIndexedDBInstance()));

            Promise.all(asyncUpdates).then(() => {
                PubSubInstance().then(ps => {
                    ps.pub(MemoModel.UPDATED);
                });

                ToasterInstance().then(toaster => {
                    toaster.toast(asyncUpdates.length > 1 ? //beacause of local db cleaning
                        'Connection is on. Datadase synchronized.' : 'Connection is on.');
                });
            });
        });
    }
}