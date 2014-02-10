define([
        'angular',
        'angular-animate',
        'angular-ui-router',
        'mkr/mkr',
        'mkr/blog'
    ],
    function(angular, ngAnimate, uiRouter, mkrModule, blogModule) {
        // Main module: integrates all the individual feature modules
        return angular.module('mkr.main', [
                'ui.router',
                'restangular',
                mkrModule.name,
                blogModule.name
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('index', {
                        url: "/",
                        controller: function($state) {
                            $state.transitionTo('mkr.index', null, { location: false });
                        }
                    })
                    .state('errors', {
                        templateUrl: "templates/mkr.html?" + (+new Date())
                    })
                    .state('errors.pageNotFound', {
                        templateUrl: "templates/404.html"
                    });
                
                $urlRouterProvider.otherwise(function($injector, $location) {
                    var $state = $injector.get('$state');
                    $state.transitionTo('errors.pageNotFound', null, { location: false });
                });
            })
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true);
            })
            .controller('mkr.pageNotFound', function() {
                console.log('404');
            })
            .run(function($rootScope, $state) {
                $rootScope.layout = {
                    update: function(key, value) { this[key] = value; }
                };
            });
    }
);
