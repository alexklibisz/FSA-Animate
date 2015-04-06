app.controller('HomeController',
    function($scope, $location) {

        //Initialize NFA and DFA -- called via ng-init
        $scope.initializeNFA = function() {
            $scope.NFA = new ForceGraph("#NFA", 600, 310)

            $scope.NFA.addNode("start");
            $scope.NFA.addNode("1");
            $scope.NFA.addNode("2");
            $scope.NFA.addNode("3");

            $scope.NFA.addLink("", "start", "1");
            $scope.NFA.addLink("E", "1", "3");
            $scope.NFA.addLink("a,b", "2", "3");
            $scope.NFA.addLink("a", "3", "1");
            $scope.NFA.addLink("a,b", "2", "3");
            $scope.NFA.addLink("a", "2", "2");
            $scope.NFA.addLink("b", "1", "2");


        }

        $scope.addState = function() {
            var name = '';
            while (name.trim().length === 0 || name.trim().length > 3) {
                name = prompt('State Name? (1 to 3 characters)', '');
            }
            $scope.NFA.addNode(name);
        }

        $scope.addTransition = function() {
            var name = '',
                source = '',
                target = '';
            while (name.trim().length === 0) {
                name = prompt('(1/3) Symbols? (Separated by commas)', '');
            }
            while (source.trim().length === 0) {
                source = prompt('(2/3) Source state?', '');
            }
            while (target.trim().length === 0) {
                target = prompt('(3/3) Target state?', '');
            }
            $scope.NFA.addLink(name, source, target);
        }

        $scope.deleteSelected = function() {
            alert("coming soon");
        }

        $scope.initializeDFA = function() {}

        $scope.onDblClick = function($event) {
            //var parent = $event.target.parentNode;
            // $scope.NFA.selectState(parent);
        }

    });
