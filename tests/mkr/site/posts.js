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
            
            it('should return an empty array when there are no posts',
                inject(function($controller, $rootScope, $state, $location) {
                var scope = $rootScope.$new();
                $controller('mkr.site.posts.list', {
                    '$scope': scope,
                    'posts': []
                });
                
                expect(scope.posts).toEqual([]);
            }));
        });
    }
);
