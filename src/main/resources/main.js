var mustacheLib = require('/lib/xp/mustache');
var router = require('/lib/router')();
var helper = require('/lib/helper');
var swController = require('/lib/pwa/sw-controller');
var controller = require('/lib/repo/controller.js');
var connection = require('/lib/repo/connection.js');
var siteTitle = 'Enonic Dictaphone';

var renderPage = function(pageName) {
    return function() {
        return {
            body: mustacheLib.render(resolve('pages/' + pageName), {
                title: siteTitle,
                version: app.version,
                appUrl: helper.getAppUrl(),
                appName: helper.getAppName(),
                baseUrl: helper.getBaseUrl(),
                precacheUrl: helper.getBaseUrl() + '/precache',
                themeColor: '#3F51B5',
                main: helper.getBaseUrl() + '/js/main.js',
                serviceWorker: mustacheLib.render(resolve('/pages/sw.html'), {
                    title: siteTitle,
                    baseUrl: helper.getBaseUrl(),
                    precacheUrl: helper.getBaseUrl() + '/precache',
                    appUrl: helper.getAppUrl()
                })
            })
        };
    }
};

router.get('/', renderPage('main.html'));
router.get('/create', renderPage('main.html'));
router.get('/edit/{id}', renderPage('main.html'));
router.get('/details/{id}', renderPage('main.html'));

router.get('/sw.js', swController.get);

router.post('/put', controller.put);

router.get('/get', controller.get);
router.get('/getAll', controller.getAll);
router.get('/getAudio', controller.getAudio);

router.get('/delete', controller.delete);
router.get('/deleteAll', controller.deleteAll);

exports.all = function (req) {
    return router.dispatch(req);
};

connection.initialize();