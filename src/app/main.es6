requirejs.config( {
    baseUrl: 'app',
    paths: {
        assert: '../vendor/assert',
        acr: 'AcrSoftwareConfigurator',
        backbone: '../vendor/backbone',
        bootstrap: '/node_modules/bootstrap/dist/js/bootstrap',
        json: '../vendor/json',
        jquery: '../vendor/jquery-3.2.0.min',
        messenger: '../vendor/messenger/build/js/messenger',
        moment: '../vendor/moment',
        mustache: '../vendor/mustache',
        text: '../vendor/text',
        underscore: '../vendor/underscore'
    },

    shim: {
        messenger: {
            deps: [ 'jquery' ],
            exports: 'Messenger'
        }
    }
} );

// Kickoff
requirejs( [ 'SystemAdminDesktop', 'text', 'json', 'assert', 'messenger' ],
    ( SystemAdminDesktop, text, json, assert, Messenger ) => {

        Messenger.options = {
            extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
            theme: 'future'
        };

        new SystemAdminDesktop();
    } );