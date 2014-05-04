define([
        'util/util',
        'angular',
        'angular-ui-router',
        'restangular'
    ],
    function(util, angular, uiRouter, restangular) {
        return angular.module('mkr.site.posts', [
                'ui.router',
                'restangular'
            ])
            .config(function($stateProvider) {
                $stateProvider
                    .state('mkr:site:posts:list', {
                        parent: 'mkr:site',
                        url: "/posts",
                        templateUrl: "templates/mkr/posts.html",
                        controller: "mkr.site.posts.list",
                        resolve: {
                            posts: ['Restangular',
                                function(Restangular) {
                                    return Restangular.all('posts').getList();
                                }
                            ]
                        }
                    })
                    .state('mkr:site:posts:archive', {
                        parent: 'mkr:site',
                        url: "/archive",
                        templateUrl: "templates/mkr/archive.html",
                        controller: "mkr.site.posts.archive",
                        resolve: {
                            posts: ['Restangular',
                                function(Restangular) {
                                    return Restangular.all('posts').getList();
                                }
                            ]
                        }
                    })
                    .state('mkr:site:posts:view', {
                        parent: 'mkr:site',
                        url: "/posts/{id}",
                        templateUrl: "templates/mkr/post_view.html",
                        controller: "mkr.site.posts.view",
                        resolve: {
                            post: ['Restangular', '$stateParams',
                                function(Restangular, $stateParams) {
                                    return Restangular.one('posts', $stateParams.id).get();
                                }
                            ]
                        }
                    })
                    .state('mkr:site:posts:post_with_slug', {
                        parent: 'mkr:site',
                        url: "/posts/{id}/{slug}",
                        templateUrl: "templates/mkr/post_view.html",
                        controller: "mkr.site.posts.view",
                        resolve: {
                            post: ['Restangular', '$stateParams',
                                function(Restangular, $stateParams) {
                                    return Restangular.one('posts', $stateParams.id).get();
                                }
                            ]
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
            .controller('mkr.site.posts.archive', function($scope, posts) {
                $scope.posts = posts.map(function(post, index) {
                    var id = index + 1;
                    return {
                        id: post.id,
                        title: post.title,
                        date: post.date,
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
