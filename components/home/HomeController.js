app.controller('HomeController',
    function($scope, $location, FSAModel) {

        //Initialize NFA and DFA -- called via ng-init
        $scope.initializeNFA = function() {
            $scope.NFA = new FSAModel("#NFA", 310, 610, [], []);
        }

        $scope.initializeDFA = function() {
            // $scope.DFA = new FSAModel("#DFA", 360, 610, [], []);
        }

        //Event Handlers
        $scope.onClick = function($event) {
            //console.log("click", $event);
            // Shift+Click: add a node to the NFA
            if ($event.shiftKey) {
                var label = '';
                while (label.length === 0 || label.length > 3) {
                    var label = prompt("New node, please enter label (max 3 characters):", "");
                }
                $scope.NFA.addNode(label, $event);
            }
        }

        $scope.onKeyDown = function($event) {
            // console.log("key down", $event);
            var key = window.event ? $event.keyCode : $event.which;
        };

        $scope.onBlur = function() {}

        

        function randomColor() {
            var colors = ['#003399', '#6699FF', '#FFFFFF', '#3366CC', '#FF9966', '#FF9900', '#FFCC00'];
            var index = Math.floor((Math.random() * colors.length));
            console.log(colors[index]);
            return colors[index];
        }


    });
