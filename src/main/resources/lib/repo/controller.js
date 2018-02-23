var portalLib = require('/lib/xp/portal');
var valueLib = require('/lib/xp/value');

var query = require('query');

exports.getAudio = function (req) {
    var key = req.params.key;

    var audioStream = query.queryAudio(key);

    return {
        body: audioStream,
        contentType: 'audio/webm'
    };


}

exports.get = function (req) {
    var key = req.params.key;

    var memoNode = query.querySingleHit(key);

    return {
        body: memoNode ? memoNode.value : null,
        contentType: 'application/json'
    };
};

exports.getAll = function (req) {
    var order = req.params.order == 'next' ? 'ASC' : 'DESC';

    var result = query.query({
        start: 0,
        sort: '_timestamp ' + order,
    });

    return {
        body: JSON.stringify(result.map(function (node) {
            return {key: node.key, value: node.value}
        })),
        contentType: 'application/json'
    };
}

exports.put = function () {

    var value = portalLib.getMultipartText('value');
    var key = portalLib.getMultipartText('key');
    var storeName = portalLib.getMultipartText('storeName');

    var stream = portalLib.getMultipartStream('audio');

    var params = {key: key, value: value, storeName: storeName, stream: stream};

    var result = query.put(params);

    return {
        body: result.key,
        contentType: 'application/json'
    };
};

exports.delete = function (req) {
    var key = req.params.key;

    var result = query.delete(key);

    return {
        body: result,
        contentType: 'application/json'
    };
};

exports.deleteAll = function (req) {

    var result = query.deleteAll();

    return {
        body: result,
        contentType: 'application/json'
    };
};