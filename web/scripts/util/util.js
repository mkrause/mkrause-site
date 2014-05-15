define([
        'angular'
    ],
    function(angular) {
        return {
            forwardToState: function(stateName) {
                return ['$state', function($state) {
                    // Transition to the new state without changing the URL
                    // Note: also use reload = true because otherwise ui-router sometimes
                    // fails to reinstantiate the controller
                    $state.transitionTo(stateName, null, { reload: true, location: false });
                }];
            }
        }
    }
);
