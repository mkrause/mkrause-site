define([
        'angular',
        'angular-ui-router',
        'restangular'
    ],
    function(angular, uiRouter, restangular) {
        return angular.module('mkr.site.crud', [
                'ui.router',
                'restangular'
            ])
            .config(function(RestangularProvider) {
                RestangularProvider.setBaseUrl('app.php/api');
            })
            .config(function($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('mkr.crud', {
                        url: "/crud",
                        controller: "mkr.crud",
                        templateUrl: "templates/mkr/crud.html"
                    });
            })
            .controller('mkr.crud',
                function($scope, Restangular) {
                    $scope.users = null;
                    Restangular.all('users').getList()
                        .then(function(users) { console.log(users); $scope.users = users; });
                    
                    $scope.newUser = {};
                    $scope.create = function() {
                        var user = $scope.newUser;
                        Restangular.all('users').post(user);
                        
                        // Refresh
                        Restangular.all('users').getList()
                            .then(function(users) { $scope.users = users; });
                    };
                    
                    $scope.user = null;
                    $scope.read = function() {
                        var user = $scope.user;
                        Restangular.one('users', user.id).get()
                            .then(function(user) { $scope.user = user; });
                    };
                    
                    $scope.update = function() {
                        var user = $scope.user;
                        Restangular.one('users', user.id).put();
                        
                        // Refresh
                        Restangular.all('users').getList()
                            .then(function(users) { $scope.users = users; });
                    };
                    
                    $scope.delete = function() {
                        var user = $scope.user;
                        Restangular.one('users', user.id).remove();
                        
                        // Refresh
                        Restangular.all('users').getList()
                            .then(function(users) {
                                $scope.users = users;
                                $scope.user = null;
                            });
                    };
                }
            );
    }
);
