define([
        'angular',
        'angular-route',
        'restangular'
    ],
    function(angular, ngRoute, restangular) {
        return angular.module('mfs', [
                'ngRoute',
                'restangular'
            ])
            .config(function(RestangularProvider) {
                RestangularProvider.setBaseUrl('app.php/api');
            })
            .config(function($routeProvider) {
                $routeProvider
                    .when('/', {
                        controller: 'crud',
                        templateUrl: 'templates/crud.html'
                    });
            })
            .controller('crud',
                function($scope, Restangular) {
                    $scope.users = null;
                    Restangular.all('users').getList()
                        .then(function(users) { $scope.users = users; });
                    
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
            )
            .run(function($rootScope) {
            });
    }
);
