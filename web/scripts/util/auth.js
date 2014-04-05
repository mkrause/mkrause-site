define([
        'angular',
        // Angular modules
        'restangular'
    ],
    function(angular) {
        return angular.module('auth', [
                'restangular'
            ])
            .service('auth', function(Restangular, $window) {
                // Make the given user the currently authorized user
                this.authorize = function(user) {
                    $window.sessionStorage.setItem('user', JSON.stringify(user));
                };
                
                // Deauthorize any currently authorized user
                this.deauthorize = function() {
                    $window.sessionStorage.removeItem('user');
                };
                
                // Make an authentication request with the given credentials
                // Returns a promise
                this.authenticate = function(credentials) {
                    var auth = this;
                    return Restangular.one('authenticate').customPOST(credentials)
                        .then(function(response) {
                            var user = response.user;
                            auth.authorize(user);
                            return user;
                        });
                };
                
                this.getAuthUser = function() {
                    var userJson = $window.sessionStorage.getItem('user');
                    
                    var user = null;
                    if (userJson !== null) {
                        user = JSON.parse(userJson);
                    }
                    
                    return user;
                };
                
                this.hasAuthUser = function() {
                    return this.getAuthUser() !== null;
                };
            });
    }
);
