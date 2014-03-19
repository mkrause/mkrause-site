define([
        'angular',
        'angular-ui-router',
        'restangular'
    ],
    function(angular, uiRouter, restangular) {
        return angular.module('mkr.blog', [
                'ui.router',
                'restangular'
            ])
            .config(function(RestangularProvider) {
                RestangularProvider.setBaseUrl('app.php/api');
            })
            .controller('blog.list', function($scope, $sce, Restangular) {
                Restangular.all('blog').getList()
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
            .controller('blog.post', function($scope, $sce, $stateParams, Restangular) {
                Restangular.one('blog', $stateParams.id).get()
                    .then(function(postHtml) { $scope.post = $sce.trustAsHtml(postHtml); });
            })
            .config(function($stateProvider) {
                $stateProvider
                    .state('blog', {
                        templateUrl: "templates/blog.html"
                    })
                    .state('blog.index', {
                        url: "/blog",
                        controller: "blog.list",
                        templateUrl: "templates/blog/index.html"
                    })
                    .state('blog.post', {
                        url: "/blog/{id}",
                        controller: 'blog.post',
                        templateUrl: "templates/blog/post.html"
                    })
                    .state('blog.post_with_slug', {
                        url: "/blog/{id}/{slug}",
                        controller: 'blog.post',
                        templateUrl: "templates/blog/post.html"
                    });
            });
    }
);
