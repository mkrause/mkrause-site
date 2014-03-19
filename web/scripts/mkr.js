// Module definition: `mkr`
// Top-level module that integrates all the different features of the application.
define([
        'angular',
        'angular-animate',
        'angular-ui-router',
        'mkr/site',
        // 'mkr/blog'
    ],
    function(angular, ngAnimate, uiRouter) {
        return angular.module('mkr', [
                //'ngAnimate',
                'ui.router',
                'restangular',
                'mkr.site'
                //'mkr.blog'
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('mkr', {
                        template: "<div ui-view></div>"
                    })
                    .state('mkr.index', {
                        url: "/",
                        controller: function($state) {
                            // Change to the given state without altering the URL
                            $state.transitionTo('mkr.site.index', null, { location: false });
                        }
                    })
                    .state('mkr.errors', {
                        templateUrl: "templates/mkr.html"
                    })
                    .state('mkr.errors.pageNotFound', {
                        templateUrl: "templates/404.html",
                        controller: 'mkr.pageNotFound'
                    });
                
                // Fallback: if no state matches, show page not found page (without altering
                // the URL in the browser)
                $urlRouterProvider.otherwise(function($injector, $location) {
                    var $state = $injector.get('$state');
                    $state.transitionTo('mkr.errors.pageNotFound', null, { location: false });
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