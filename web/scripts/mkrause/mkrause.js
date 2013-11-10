define([
        'angular',
        'angular-route'
    ],
    function(angular, ngRoute) {
        return angular.module('mfs', [
                'ngRoute'
            ])
            .run(function($rootScope) {
                console.log('run');
            });
    }
);
