define([
        'underscore',
        'angular',
        // Angular modules
        'angular-ui-router',
        'restangular',
        'util/auth'
    ],
    function(_, angular) {
        return angular.module('mkr.admin', [
                'ui.router',
                'restangular',
                'auth'
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    // Defines the layout for all `mkr.admin.X` states
                    .state('mkr.admin', {
                        templateUrl: "templates/mkr.html",
                        controller: "mkr.admin"
                    })
                    .state('mkr.admin.index', {
                        url: "/admin",
                        controller: "mkr.admin.index",
                        templateUrl: "templates/mkr/admin/index.html"
                    });
            })
            .controller('mkr.admin', function($scope, $state, auth) {
                if (!auth.hasAuthUser()) {
                    $state.transitionTo('mkr.site.login', null, { location: false });
                    return;
                }
                
                var authUser = auth.getAuthUser();
                $scope.authUser = authUser;
            })
            .controller('mkr.admin.index', function($scope) {})
            .directive('datatable', function() {
                return {};
            });
    }
);