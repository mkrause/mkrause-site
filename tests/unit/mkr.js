define([
        'jasmine',
        'angular',
        // Angular modules
        'angular-mocks',
        'mkr'
    ],
    function(jasmine, angular) {
        describe('mkr module', function() {
            beforeEach(module('mkr'));
            
            describe('index controller', function() {
                it('should redirect to posts',
                    inject(function($controller, $rootScope, $state, $location, $httpBackend) {
                        var scope = $rootScope.$new();
                        $controller('mkr.index', {
                            $scope: scope,
                            $state: $state
                        });
                        
                        $httpBackend.expectGET("templates/mkr.html").respond("");
                        $httpBackend.expectGET("templates/login.html").respond("");
                        
                        $rootScope.$on('$stateChangeSuccess', console.log);
                        $rootScope.$on('$stateChangeError', console.log);
                        
                        $rootScope.$apply();
                        
                        var transition = $state.go('mkr.site.login');
                        transition.then(console.log, console.log);
                        $rootScope.$apply();
                        
                        expect($state.current.name).toBe('mkr.site.posts.list');
                    })
                );
            });
            
            describe('login controller', function() {
                it('should succeed given valid credentials',
                    inject(function($controller, $rootScope, $state, $location, $httpBackend) {
                        var scope = $rootScope.$new();
                        $controller('mkr.index', {
                            $scope: scope,
                        });
                        
                        scope.credentials = {
                            email: 'user1@example.com',
                            password: 'passwd1'
                        };
                        
                        var event = {};
                        scope.submit(event);
                        
                        expect($state.current.name).toBe('mkr.admin.index');
                    })
                );
                
                it('should fail given invalid credentials',
                    inject(function($controller, $rootScope, $state, $location, $httpBackend) {
                        var scope = $rootScope.$new();
                        $controller('mkr.index', {
                            $scope: scope,
                        });
                        
                        scope.credentials = {
                            email: 'nonexistant-user1@example.com',
                            password: 'passwd1'
                        };
                        
                        var event = {};
                        scope.submit(event);
                        
                        expect($state.current.name).toBe('mkr.site.login');
                        expect(scope.message).toBe("Login failed");
                    })
                );
            });
        });
    }
);
