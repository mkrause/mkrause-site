define([
        'angular',
        'angular-ui-router'
    ],
    function(angular, uiRouter) {
        return angular.module('mkr.blog', [
                'ui.router'
            ])
            .config(function($stateProvider) {
                $stateProvider
                    .state('blog', {
                        templateUrl: "templates/blog.html"
                    })
                    .state('blog.index', {
                        url: "/blog",
                        template: "blog"
                    });
            });
    }
);
