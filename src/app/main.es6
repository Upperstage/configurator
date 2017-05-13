requirejs.config( {
    baseUrl: 'app',
    paths: {
        assert: '../vendor/assert',
        acr: 'AcrSoftwareConfigurator',
        backbone: '../vendor/backbone',
        bootstrap: '/node_modules/bootstrap/dist/js/bootstrap',
        json: '../vendor/json',
        jquery: '../vendor/jquery-3.2.0.min',
        moment: '../vendor/moment',
        mustache: '../vendor/mustache',
        text: '../vendor/text',
        underscore: '../vendor/underscore'
    }
} );

// Kickoff
requirejs( [ 'text', 'json', 'assert', 'SystemAdminDesktop' ],
    ( text, json, assert, SystemAdminDesktop ) => {
        new SystemAdminDesktop();
    } );