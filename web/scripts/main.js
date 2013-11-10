define([
        'angular',
        'mkrause/mkrause'
    ],
    function(angular, mkrauseModule) {
        angular.element(document).ready(function() {
            // Manually bootstrap angular
            angular.bootstrap(document, [mkrauseModule.name]);
        });
    }
);
