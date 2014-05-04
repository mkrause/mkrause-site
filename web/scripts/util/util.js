define([
        'angular'
    ],
    function(angular) {
        return {
            forwardToState: function(stateName) {
                return ['$state', function($state) {
                    $state.transitionTo(stateName, null, { location: false });
                }];
            }
        }
    }
);
