// Main entry point
define([
        'angular',
        'mkr'
    ],
    function(angular) {
        angular.element(document).ready(function() {
            // Manually bootstrap angular
            angular.bootstrap(document, ['mkr']);
        });
    }
);
