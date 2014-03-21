define([
        'angular',
        'angular-ui-router',
        'restangular'
    ],
    function(angular, uiRouter, restangular) {
        return angular.module('mkr.site.posts', [
                'ui.router',
                'restangular'
            ])
            .config(function($stateProvider) {
                $stateProvider
                    .state('mkr.site.posts', {
                        template: "<div ui-view></div>"
                    })
                    .state('mkr.site.posts.list', {
                        url: "/posts",
                        controller: "mkr.site.posts.list",
                        templateUrl: "templates/mkr/posts.html"
                    })
                    .state('mkr.site.posts.view', {
                        url: "/posts/{id}",
                        controller: "blog.list",
                        templateUrl: "templates/"
                    })
                    .state('mkr.site.posts.post_with_slug', {
                        url: "/posts/{id}/{slug}",
                        // controller: 'blog.post',
                        templateUrl: "templates/posts/view.html"
                    });
            })
            .controller('mkr.site.posts.list', function($scope, $sce, Restangular) {
                Restangular.all('posts').getList()
                    .then(function(posts) {
                        $scope.posts = posts.map(function(post, index) {
                            var id = index + 1;
                            return {
                                id: id,
                                title: post.title,
                                body: $sce.trustAsHtml(post.body),
                                slug: 'post' + id
                            };
                        });
                    });
            })
            .controller('mkr.site.posts.view', function($scope, $sce, $stateParams, Restangular) {
                Restangular.one('post', $stateParams.id).get()
                    .then(function(postHtml) { $scope.post = $sce.trustAsHtml(postHtml); });
            });
    }
);
