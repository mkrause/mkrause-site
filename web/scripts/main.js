define([
        'angular',
        'mkr/main'
    ],
    function(angular, mainModule) {
        angular.element(document).ready(function() {
            // Manually bootstrap angular
            angular.bootstrap(document, [mainModule.name]);
        });
    }
);
