define([
        'angular',
        'angular-animate',
        'angular-ui-router',
        'mkr/mkr',
        'mkr/blog'
    ],
    function(angular, ngAnimate, uiRouter, mkrModule, blogModule) {
        return angular.module('mkr.main', [
                'ui.router',
                'restangular',
                mkrModule.name,
                blogModule.name
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
            })
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true);
            })
            .run(function($rootScope) {
            });
    }
);
