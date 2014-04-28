define([
        'jasmine',
        'angular'
    ],
    function(jasmine, angular) {
        return {
            getController: function(controllerName) {
                return function() {
                    //$controller(controllerName, {});
                };
            }
        };
    }
);
