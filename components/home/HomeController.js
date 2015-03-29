app.controller('HomeController',
    function($scope, $location, FSAModel) {

        //Initialize NFA and DFA -- called via ng-init
        $scope.initializeNFA = function() {
            $scope.NFA = new FSAModel("#NFA", 310, 610, [], []);
        }

        $scope.initializeDFA = function() {}

        //Event Handlers
        $scope.onClick = function($event) {
            // Shift+Click: add a node to the NFA
            if ($event.shiftKey) {
                $scope.addNode($event);
            }
        }

        $scope.onKeyDown = function($event) {
            // Delete: delete any selected nodes
            if ($event.keyCode === 46) {
                $scope.NFA.deleteSelected();
            }

        };

        $scope.onBlur = function() {}

        $scope.onDblClick = function($event) {
            var parent = $event.target.parentNode;
            $scope.NFA.selectNode(parent);
        }

        $scope.addNode = function($event) {
            var label = '',
                valid = false,
                x = $event.layerX,
                y = $event.layerY;
            if (!$event.shiftKey) {
                x = 50;
                y = 50;
            }
            while (valid === false) {
                label = prompt("New node, please enter a unique label (max 3 characters):", "");
                valid = $scope.NFA.addNode(label, x, y);
            }
        }
    });
