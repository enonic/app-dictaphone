var nodeLib = require('/lib/xp/node');
var repoLib = require('/lib/xp/repo');
var contextLib = require('/lib/xp/context');

var REPO_NAME = 'memo-repo';

var ROOT_PERMISSIONS = [
    {
        "principal": "role:system.everyone",
        "allow": [
            "READ",
            "CREATE",
            "MODIFY",
            "DELETE",
            "PUBLISH",
            "READ_PERMISSIONS",
            "WRITE_PERMISSIONS"
        ],
        "deny": []
    }
];

exports.ROOT_PERMISSIONS = ROOT_PERMISSIONS;

exports.newConnection = function newConnection() {

    return nodeLib.connect({
        repoId: REPO_NAME,
        branch: 'master'
    });
};

exports.initialize = function () {
    log.info('Initializing Dictaphone repository...');

    contextLib.run({
        user: {
            login: 'su',
            userStore: 'system'
        },
        principals: ["role:system.admin"]
    }, doInitialize);


    log.info('Dictaphone repository initialized.');
}

var doInitialize = function () {
    var result = repoLib.get(REPO_NAME);

    if (!result) {
        createRepo();
    }

    checkUserFolder();
};

var createRepo = function () {
    log.info('Creating repository...');
    var newRepo = repoLib.create({
        id: REPO_NAME,
        rootPermissions: ROOT_PERMISSIONS,
        principals: ["role:system.admin"]
    });
    log.info('Repository created.');

};

var checkUserFolder = function () {

    var repo = nodeLib.connect({
        repoId: REPO_NAME,
        branch: 'master'
    });

    var queryResult = repo.query({
        start: 0,
        count: 1,
        query: "_path = '" + getCurrentFolderPath() + "'"
    });

    if (queryResult.count == 0) {
        repo.create({
            _name: getCurrentUserKey(),
            _parentPath: '/',
            _permissions: ROOT_PERMISSIONS
        });
        log.info('Memo folder for user created:' + getCurrentFolderPath());
    }
}

var getCurrentFolderPath = function () {
    return '/' + getCurrentUserKey();
}

var getCurrentUserKey = function () {
    return 'memos';
    // var user = authLib.getUser();
    // return user ? user.key : null;
};