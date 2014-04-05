// Module definition: `mkr`
// Top-level module that integrates all the different features of the application.
define([
        'angular',
        // Angular modules
        'angular-animate',
        'angular-ui-router',
        'restangular',
        'util/auth',
        'mkr/site',
        'mkr/admin'
    ],
    function(angular) {
        return angular.module('mkr', [
                //'ngAnimate',
                'ui.router',
                'restangular',
                'auth',
                'mkr.site',
                'mkr.admin'
            ])
            .config(function(RestangularProvider) {
                RestangularProvider.setBaseUrl('/api');
            })
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    // Empty state, needs to be defined in order to use `mkr.X`
                    .state('mkr', {
                        template: "<div ui-view></div>"
                    })
                    .state('mkr.index', {
                        url: "/",
                        controller: "mkr.index"
                    })
                    .state('mkr.site.login', {
                        url: "/login",
                        controller: "mkr.login",
                        templateUrl: "templates/login.html"
                    })
                    .state('mkr.logout', {
                        url: "/logout",
                        controller: "mkr.logout"
                    })
                    .state('mkr.errors', {
                        templateUrl: "templates/mkr.html"
                    })
                    .state('mkr.errors.pageNotFound', {
                        templateUrl: "templates/404.html",
                        controller: 'mkr.errors.pageNotFound'
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
            .controller('mkr.index', function($state) {
                // Change to the given state without altering the URL
                $state.transitionTo('mkr.site.index', null, { location: false });
            })
            .controller('mkr.login', function($scope, $state, auth) {
                $scope.message = "";
                
                $scope.credentials = {
                    email: null,
                    password: null
                };
                
                $scope.submit = function() {
                    // XXX due to a bug where some browsers don't fire an event upon autofilling
                    // an input (e.g. the "remember this password" feature), two-way data binding
                    // may fail. Quick hack to get around this, for now.
                    // See: https://github.com/angular/angular.js/issues/1460
                    var emailInput = document.getElementById('credentials-email');
                    var passwordInput = document.getElementById('credentials-password');
                    $scope.credentials.email = emailInput.value;
                    $scope.credentials.password = passwordInput.value;
                    
                    auth.authenticate($scope.credentials)
                        .then(function(user) {
                            $state.transitionTo('mkr.admin.index');
                        })
                        .catch(function(reason) {
                            $scope.message = "Login failed";
                        });
                };
            })
            .controller('mkr.logout', function($state, auth) {
                auth.deauthorize();
                $state.transitionTo('mkr.site.posts.list');
            })
            .controller('mkr.errors.pageNotFound', function() {})
            .run(function($rootScope, $state) {
                $rootScope.layout = {
                    update: function(key, value) { this[key] = value; }
                };
            });
    }
);
