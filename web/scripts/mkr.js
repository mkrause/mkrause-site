// Module definition: `mkr`
// Top-level module that integrates all the different features of the application.
define([
        'util/util',
        'angular',
        // Angular modules
        'angular-animate',
        'angular-ui-router',
        'restangular',
        'util/auth',
        'mkr/site',
        'mkr/admin'
    ],
    function(util, angular) {
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
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true);
            })
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    // Layout
                    .state('mkr', {
                        abstract: true,
                        template: "<ui-view></ui-view>"
                    })
                    .state('mkr:index', {
                        url: '/',
                        onEnter: util.forwardToState('mkr:site:index')
                    })
                    .state('mkr:login', {
                        parent: 'mkr:site',
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'mkr.login'
                    })
                    .state('mkr:logout', {
                        parent: 'mkr:site',
                        url: '/logout',
                        controller: 'mkr.logout'
                    })
                    .state('mkr:errors:pageNotFound', {
                        parent: 'mkr:site',
                        templateUrl: 'templates/404.html'
                    });
                
                $urlRouterProvider.otherwise(function($injector, $location) {
                    var $state = $injector.get('$state');
                    
                    // Fallback: if no state matches, show "page not found" page
                    $state.transitionTo('mkr:errors:pageNotFound', null, { location: false });
                });
            })
            .controller('mkr.login', function($scope, $state, auth) {
                $scope.message = "";
                
                $scope.credentials = {
                    email: null,
                    password: null
                };
                
                $scope.submit = function($event) {
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
                            $state.transitionTo('mkr:admin:index');
                        })
                        .catch(function(reason) {
                            $scope.message = "Login failed";
                        });
                    
                    // Prevent form submission
                    $event.preventDefault();
                    return false;
                };
            })
            .controller('mkr.logout', function($state, auth) {
                auth.deauthorize();
                $state.go('mkr:site:posts:list');
            })
            .run(function($rootScope, $state, $window) {
                // Globally accessible layout state
                $rootScope.layout = {
                    // Set a value
                    update: function(key, value) { this[key] = value; },
                    makeTitle: function(prefix) {
                        return this.title ? this.title + ' - ' + prefix : prefix;
                    }
                };
                
                $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
                    // console.log(arguments);
                    
                    if (!$window.__ready) {
                        // https://github.com/steeve/angular-seo
                        $rootScope.$evalAsync(function() { // Fire after $digest
                            setTimeout(function() { // Fire after DOM rendering
                                if (typeof $window.callPhantom == 'function') {
                                    $window.callPhantom();
                                }
                                
                                $window.__ready = true;
                            }, 0);
                        });
                    }
                });
                
                $rootScope.$on('$stateChangeError', function() {
                    console.log('stateChangeError', arguments);
                });
            });
    }
);
