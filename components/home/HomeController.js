app.controller('HomeController',
    function($scope, $location) {

        //Initialize NFA and DFA -- called via ng-init
        $scope.initializeNFA = function() {
            $scope.NFA = new ForceFSM("#NFA", 310, 600, ['a', 'b'], [], []);

            $scope.NFA.addState("1");
            $scope.NFA.addState("2");
            $scope.NFA.addState("3");
            $scope.NFA.addTransition("E", "1", "3");
            $scope.NFA.addTransition("a", "3", "1");
            $scope.NFA.addTransition("a,b", "2", "3");
            $scope.NFA.addTransition("a", "2", "2");
            $scope.NFA.addTransition("b", "1", "2");

            console.log("states", $scope.NFA.states.contents);
            console.log("transitions", $scope.NFA.transitions.contents);

            $scope.NFA.start();
        }

        $scope.initializeDFA = function() {}

        $scope.onDblClick = function($event) {
            //var parent = $event.target.parentNode;
            // $scope.NFA.selectState(parent);
        }

        $scope.addState = function($event) {}

    });
