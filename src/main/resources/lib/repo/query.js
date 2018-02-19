var authLib = require('/lib/xp/auth');
var valueLib = require('/lib/xp/value');

var connection = require('connection');

exports.queryAudio = function queryAudio(key) {
    var repoConn = connection.newConnection();
    var queryResult = repoConn.query({
        start: 0,
        count: 1,
        query: getKeyQuery(key)
    });

    if (queryResult.count > 0) {
        var id = queryResult.hits[0].id;

        var audioStream = repoConn.getBinary({
            key: id, binaryReference: 'audio'
        });

        return audioStream;
    }

    return null;
}

exports.querySingleHit = function querySingleHit(key) {
    var repoConn = connection.newConnection();
    var queryResult = repoConn.query({
        start: 0,
        count: 1,
        query: getKeyQuery(key)
    });

    if (queryResult.count > 0) {
        var id = queryResult.hits[0].id;
        var node = repoConn.get(id);

        return node;
    }


    return null;
}

exports.query = function (params) {
    var repoConn = connection.newConnection();
    var queryResult = repoConn.query({
        start: params.start,
        count: params.count,
        query: params.query || "_parentPath = '" + getCurrentFolderPath() + "'",
        sort: params.sort
    });


    var hits = [];
    if (queryResult.count > 0) {
        var ids = queryResult.hits.map(function (hit) {
            return hit.id;
        });
        hits = [].concat(repoConn.get(ids)).map(function (hit) {
            return /*setImageUrl(*/hit//);
        })
    }

    return hits;
}

exports.put = function (params) {
    var repo = connection.newConnection();

    var memoNode = params.key ? exports.querySingleHit(params.key) : null;

    var result;

    if (memoNode) {
        result = repo.modify({
            key: memoNode._id,
            editor: function (node) {
                node.key = params.key;
                node.value = params.value;
                node.storeName = params.storeName;
                //     node.audio = valueLib.binary('audio', params.stream);
                return node;
            }
        });
    } else {
        result = repo.create({
            _parentPath: getCurrentFolderPath(),
            key: params.key,
            value: params.value,
            storeName: params.storeName,
            audio: valueLib.binary('audio', params.stream)
        });
    }

    return result;
}

exports.delete = function (key) {
    var repoConn = connection.newConnection();
    var queryResult = repoConn.query({
        start: 0,
        count: 1,
        query: getKeyQuery(key)
    });

    if (queryResult.count > 0) {
        var id = queryResult.hits[0].id;
        var result = repoConn.delete(id);

        return result;
    }

    return null;
}

exports.deleteAll = function () {
    var repoConn = connection.newConnection();
    var queryResult = repoConn.query({
        start: 0,
        query: "_parentPath='" + getCurrentFolderPath() + "'"
    });

    var count = 0;

    if (queryResult.count > 0) {
        queryResult.hits.forEach(function (node) {
            repoConn.delete(node.id);
            count++;
        });
    }

    return {count: count};
}

var getKeyQuery = function (key) {
    return "key = '" + key + "' and _parentPath = '" + getCurrentFolderPath() + "'";
}

var getCurrentFolderPath = function () {
    return '/' + getCurrentUserKey();
}

var getCurrentUserKey = function () {
    var user = authLib.getUser();
    return user ? user.key : null;
};


