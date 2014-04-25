define([
        'jasmine',
        'angular',
        // Angular modules
        'angular-mocks',
        'mkr'
    ],
    function(jasmine, angular) {
        describe('posts module', function() {
            beforeEach(module('mkr.site.posts'));
            
            describe('list controller', function() {
                it('should pass posts to scope',
                    inject(function($controller, $rootScope, $state, $location) {
                        var scope = $rootScope.$new();
                        $controller('mkr.site.posts.list', {
                            '$scope': scope,
                            'posts': []
                        });
                        
                        expect(scope.posts).toBeDefined();
                    })
                );
                
                it('should pass an empty array when there are no posts',
                    inject(function($controller, $rootScope, $state, $location) {
                        var scope = $rootScope.$new();
                        $controller('mkr.site.posts.list', {
                            '$scope': scope,
                            'posts': []
                        });
                        
                        expect(scope.posts).toEqual([]);
                    })
                );
                
                it('should pass posts in the right format',
                    inject(function($controller, $rootScope, $state, $location) {
                        var post1 = {
                            id: 42,
                            title: 'Some Post',
                            date: '2014-01-01',
                            body: '<p>Post body with HTML</p>',
                            slug: 'some-post'
                        };
                        
                        var scope = $rootScope.$new();
                        $controller('mkr.site.posts.list', {
                            '$scope': scope,
                            'posts': [post1]
                        });
                        
                        expect(scope.posts[0].id).toEqual(post1.id);
                    })
                );
            });
        });
    }
);
