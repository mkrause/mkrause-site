define([
        'angular',
        'angular-ui-router',
        'restangular'
    ],
    function(angular, uiRouter, restangular) {
        return angular.module('mkr.site', [
                'ui.router',
                'restangular'
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    // Defines the layout for all `mkr.site.X` states
                    .state('mkr.site', {
                        templateUrl: "templates/mkr.html"
                    })
                    .state('mkr.site.index', {
                        url: "/home",
                        templateUrl: "templates/mkr/home.html"
                    })
                    .state('mkr.site.posts', {
                        url: "/posts",
                        controller: "mkr.posts",
                        templateUrl: "templates/mkr/blog.html"
                    })
                    .state('mkr.site.about', {
                        url: "/about",
                        templateUrl: "templates/mkr/about.html"
                    });
            });
    }
);
