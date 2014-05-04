define([
        'util/util',
        'angular',
        'angular-ui-router',
        'restangular',
        'mkr/site/posts'
    ],
    function(util, angular, uiRouter, restangular) {
        return angular.module('mkr.site', [
                'ui.router',
                'restangular',
                'mkr.site.posts'
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    // Layout
                    .state('mkr:site', {
                        abstract: true,
                        parent: 'mkr',
                        templateUrl: "templates/mkr.html"
                    })
                    .state('mkr:site:index', {
                        onEnter: util.forwardToState('mkr:site:posts:list')
                    })
                    .state('mkr:site:about', {
                        parent: 'mkr:site',
                        url: "/about",
                        templateUrl: "templates/mkr/about.html"
                    });
            });
    }
);
