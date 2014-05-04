define([
        'util/util',
        'underscore',
        'angular',
        // Angular modules
        'angular-ui-router',
        'restangular',
        'util/auth'
    ],
    function(util, _, angular) {
        return angular.module('mkr.admin', [
                'ui.router',
                'restangular',
                'auth'
            ])
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('mkr:admin', {
                        abstract: true,
                        parent: 'mkr:site',
                        templateUrl: "templates/mkr/admin.html",
                        controller: 'mkr.admin'
                    })
                    .state('mkr:admin:index', {
                        parent: 'mkr:admin',
                        url: '/admin',
                        controller: 'mkr.admin.index',
                        templateUrl: "templates/mkr/admin/index.html"
                    });
            })
            .controller('mkr.admin', function($scope, $state, auth) {
                if (!auth.hasAuthUser()) {
                    $state.transitionTo('mkr:login', null, { location: false });
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
