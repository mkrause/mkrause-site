
// Configure require.js
require.config({
    baseUrl: 'scripts',
    
    // Some short-cuts for third-party libraries
    paths: {
        'underscore': '../vendor/underscore/underscore',
        'jquery': '../vendor/jquery/jquery',
        'angular': '../vendor/angular/angular',
        'angular-route': '../vendor/angular-route/angular-route',
        'angular-animate': '../vendor/angular-animate/angular-animate',
        'restangular': '../vendor/restangular/dist/restangular.min',
        'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router.min',
        'markdown': '../vendor/markdown/src/markdown'
    },
    
    // Shims for libraries that don't define require.js modules of themselves
    // Important: don't forget to specify dependencies so we don't load modules in the wrong order
    shim: {
        'angular': { exports: 'angular' },
        'angular-route': { deps: ['angular'] },
        'angular-animate': { deps: ['angular'] },
        'restangular': { deps: ['angular', 'underscore'] },
        'angular-ui-router': { deps: ['angular'] }
    }
});
