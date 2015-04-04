app.controller('HomeController',
    function($scope, $location) {

        //Initialize NFA and DFA -- called via ng-init
        $scope.initializeNFA = function() {
            $scope.NFA = new ForceFSM("#NFA", 310, 630, ['a', 'b'], [], []);

            $scope.NFA.addState(new FSMState("1"));
            $scope.NFA.addState(new FSMState("2"));
            $scope.NFA.addState(new FSMState("3"));
            $scope.NFA.addTransition(new FSMTransition("E", "1", "3"));
            $scope.NFA.addTransition(new FSMTransition("a", "3", "1"));
            $scope.NFA.addTransition(new FSMTransition("a,b", "2", "3"));
            $scope.NFA.addTransition(new FSMTransition("a", "2", "2"));
            $scope.NFA.addTransition(new FSMTransition("b", "1", "2"));

            $scope.NFA.start();
        }

        $scope.initializeDFA = function() {}

        $scope.onDblClick = function($event) {
            //var parent = $event.target.parentNode;
            // $scope.NFA.selectState(parent);
        }

        $scope.addState = function($event) {}

    });
