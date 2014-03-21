define([
        'angular',
        'angular-ui-router',
        'restangular',
        'mkr/site/posts'
    ],
    function(angular, uiRouter, restangular) {
        return angular.module('mkr.site', [
                'ui.router',
                'restangular',
                'mkr.site.posts'
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    // Defines the layout for all `mkr.site.X` states
                    .state('mkr.site', {
                        templateUrl: "templates/mkr.html"
                    })
                    .state('mkr.site.index', {
                        controller: "mkr.site.index"
                    })
                    .state('mkr.site.about', {
                        url: "/about",
                        templateUrl: "templates/mkr/about.html"
                    });
            })
            .controller('mkr.site.index', function($state) {
                // Change to the given state without altering the URL
                $state.transitionTo('mkr.site.posts.list', null, { location: false });
            });
    }
);
