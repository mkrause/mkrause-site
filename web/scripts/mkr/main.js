// Main module: integrates all the individual feature modules
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
                $stateProvider
                    .state('index', {
                        url: "/",
                        controller: function($state) {
                            // Change to the given state without altering the URL
                            $state.transitionTo('mkr.index', null, { location: false });
                        }
                    })
                    .state('errors', {
                        templateUrl: "templates/mkr.html"
                    })
                    .state('errors.pageNotFound', {
                        templateUrl: "templates/404.html",
                        controller: 'mkr.pageNotFound'
                    });
                
                // Fallback: if no state matches, show page not found page (without altering
                // the URL in the browser)
                $urlRouterProvider.otherwise(function($injector, $location) {
                    var $state = $injector.get('$state');
                    $state.transitionTo('errors.pageNotFound', null, { location: false });
                });
            })
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true);
            })
            .controller('mkr.pageNotFound', function() {})
            .run(function($rootScope, $state) {
                $rootScope.layout = {
                    update: function(key, value) { this[key] = value; }
                };
            });
    }
);
