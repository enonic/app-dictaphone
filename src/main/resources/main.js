var mustacheLib = require('/lib/xp/mustache');
var router = require('/lib/router')();
var helper = require('/lib/helper');
var swController = require('/lib/pwa/sw-controller');
var siteTitle = 'Enonic Dictaphone';

var renderPage = function(pageName) {
    return function() {
        return {
            body: mustacheLib.render(resolve('pages/' + pageName), {
                title: siteTitle,
                version: app.version,
                appUrl: helper.getAppUrl(),
                baseUrl: helper.getBaseUrl(),
                precacheUrl: helper.getBaseUrl() + '/precache',
                themeColor: '#4527A0',
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

router.get('/sw.js', swController.get);

exports.get = function (req) {
    return router.dispatch(req);
};
