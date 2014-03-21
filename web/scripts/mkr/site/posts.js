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
                        templateUrl: "templates/mkr/posts.html",
                        resolve: {
                            posts: function(Restangular) {
                                return Restangular.all('posts').getList();
                            }
                        }
                    })
                    .state('mkr.site.posts.view', {
                        url: "/posts/{id}",
                        controller: "mkr.site.posts.view",
                        templateUrl: "templates/mkr/post_view.html",
                        resolve: {
                            post: function(Restangular, $stateParams) {
                                return Restangular.one('posts', $stateParams.id).get();
                            }
                        }
                    })
                    .state('mkr.site.posts.post_with_slug', {
                        url: "/posts/{id}/{slug}",
                        controller: "mkr.site.posts.view",
                        templateUrl: "templates/mkr/post_view.html",
                        resolve: {
                            post: function(Restangular, $stateParams) {
                                return Restangular.one('posts', $stateParams.id).get();
                            }
                        }
                    });
            })
            .controller('mkr.site.posts.list', function($scope, $sce, posts) {
                $scope.posts = posts.map(function(post, index) {
                    var id = index + 1;
                    return {
                        id: post.id,
                        title: post.title,
                        date: post.date,
                        body: $sce.trustAsHtml(post.body),
                        slug: post.slug
                    };
                });
            })
            .controller('mkr.site.posts.view', function($scope, $sce, post) {
                $scope.post = {
                    id: post.id,
                    title: post.title,
                    date: post.date,
                    body: $sce.trustAsHtml(post.body),
                    slug: post.slug
                };
            });
    }
);
