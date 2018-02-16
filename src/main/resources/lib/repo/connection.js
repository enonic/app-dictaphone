var nodeLib = require('/lib/xp/node');
var repoLib = require('/lib/xp/repo');
var authLib = require('/lib/xp/auth');

var REPO_NAME = 'memo-repo';

var ROOT_PERMISSIONS = [
    {
        "principal": "role:system.authenticated",
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
    },
    {
        "principal": "role:system.everyone",
        "allow": ["READ"],
        "deny": []
    }
];

exports.newConnection = function newConnection() {
    if (!repoLib.get(REPO_NAME)) {
        createRepo();
    }

    checkUserFolder();

    return nodeLib.connect({
        repoId: REPO_NAME,
        branch: 'master'
    });
};


var newAdminConnection = function () {
    if (!repoLib.get(REPO_NAME)) {
        createRepo();
    }

    checkUserFolder();

    return nodeLib.connect({
        repoId: REPO_NAME,
        branch: 'master',
        principals: ["role:system.admin"]
    });
};

var createRepo = function () {
    log.info('Creating repository...');
    var newRepo = repoLib.create({
        id: REPO_NAME,
        rootPermissions: ROOT_PERMISSIONS
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
    var user = authLib.getUser();
    return user ? user.key : null;
};