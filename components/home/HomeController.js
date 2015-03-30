app.controller('HomeController',
    function($scope, $location, FSAModel, TransitionModel) {

        //Initialize NFA and DFA -- called via ng-init
        $scope.initializeNFA = function() {
            var alphabet = ['a', 'b'],
                sampleNodes = ['1', '2', '3'],
                transitions = [
                    new TransitionModel('b', '1', '2'),
                    new TransitionModel('E', '1', '3'),
                    new TransitionModel('a', '2', '3'),
                    new TransitionModel('b', '2', '3'),
                    new TransitionModel('a', '2', '2'),
                    new TransitionModel('a', '3', '1')
                ],
                startState = '1',
                acceptStates = ['1'];
            $scope.NFA = new FSAModel("#NFA", 310, 610, sampleNodes, transitions, alphabet);
        }

        $scope.initializeDFA = function() {}

        //Event Handlers
        $scope.onClick = function($event) {
            // Shift+Click, parent is #NFA div: add a state to the NFA
            var parent = $event.target.parentNode.id;
            if ($event.shiftKey && parent === 'NFA') {
                $scope.addState($event);
            }
        }

        $scope.onKeyDown = function($event) {
            // Delete: delete any selected states
            NFA.keyCode = $event.keyCode;
            if ($event.keyCode === 46) {
                $scope.NFA.deleteSelected();
            }

        };

        $scope.onBlur = function() {}

        $scope.onDblClick = function($event) {
            var parent = $event.target.parentNode;
            $scope.NFA.selectState(parent);
        }

        $scope.addState = function($event) {
            var label = '',
                valid = false,
                x = $event.layerX,
                y = $event.layerY;
            if (!$event.shiftKey) {
                x = 50;
                y = 50;
            }
            while (valid === false) {
                label = prompt("New state, please enter a unique label (max 3 characters):", "");
                if (label === null) break;
                valid = $scope.NFA.addState(label, x, y);
            }
        }

    });
