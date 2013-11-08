// Define window.require with our require.js config (will be picked up by require.js)
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
    },
    
    // Shims for libraries that don't define require.js modules of themselves
    shim: {
        'angular': { exports: 'angular' },
        // Important: specify dependencies so we don't load dependencies in the wrong order
        'angular-route': { deps: ['angular'] },
        'angular-animate': { deps: ['angular'] },
        'restangular': { deps: ['angular', 'underscore'] }
    }
});
