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
            .controller('blog.post', function($scope, $sce, $stateParams, Restangular) {
                Restangular.one('blog', $stateParams.id).get()
                    .then(function(postHtml) { $scope.post = $sce.trustAsHtml(postHtml) });
            })
            .config(function($stateProvider) {
                $stateProvider
                    .state('blog', {
                        templateUrl: "templates/blog.html"
                    })
                    .state('blog.index', {
                        url: "/blog",
                        templateUrl: "templates/blog/index.html"
                    })
                    .state('blog.post', {
                        url: "/blog/{id}{slash:/?}{slug}",
                        controller: 'blog.post',
                        templateUrl: "templates/blog/post.html"
                    });
            });
    }
);
