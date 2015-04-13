app.controller('HomeController',
    function($scope, $location) {

        /**
         * What is $scope? 
         * 
         * $scope is what angular uses to bind data between the view and controller.
         * So anything variable, array, or object that is prefixed by $scope is accessible in both the 
         * view and the controller. If it is specifed with ng-bind in the view, then a change of value
         * will persist between the view and controller and vice-versa. I.e. two-way binding. For our
         * purposes it is most useful for binding button clicks to controller functions.
         * 
         */

        /**
         * declare variables shared within the HomeController.
         */
        var NFA = null; // haven't added the DFA class yet
        var DFA = null; // haven't added the DFA class yet
        var NFAVisual = null; // initialized in initializeNFA()
        var DFAVisual = null; // initialized in initializeDFA()
        var converter = new Converter();
        var converting = false; // used in runConversion() and pauseConversion()

        /**
         * called once the div with id "NFA" has been initialized. 
         * 
         * Creates a new instance of ForceGraph called NFAVisual,
         * appending it to the div with id "NFA"
         *
         * Then applies some sample states and transitions.
         */
        $scope.initializeNFA = function() {

            // Visual
            var width = $("#NFA").innerWidth(),
                height = $("#NFA").parent().innerHeight();

            NFAVisual = new ForceGraph("#NFA", width, height);

            // Actual
            NFA = new FSA();

            console.log(NFA);


            $scope.sampleNFA1();
            syncNFA();
        }

        $scope.sampleNFA1 = function() {
            NFAVisual.removeAll();
            //add the sample NFA states
            NFAVisual.addNode("1");
            NFAVisual.addNode("2");
            NFAVisual.addNode("3");

            //add the sample NFA transitions
            NFAVisual.addLink("E", "1", "3");
            NFAVisual.addLink("a,b", "2", "3");
            NFAVisual.addLink("a", "3", "1");
            NFAVisual.addLink("a", "2", "2");
            NFAVisual.addLink("b", "1", "2");

            d3.select('#N1').classed('selected', true);
            $scope.setStartState();
            d3.select('#N1').classed('selected', true);
            $scope.setAcceptStates();
            console.log(NFAVisual.getNodes());
            console.log(NFAVisual.getLinks());
        }

        $scope.sampleNFA2 = function() {
            NFAVisual.removeAll();
            NFAVisual.addNode("1");
            NFAVisual.addNode("2");
            NFAVisual.addNode("3");
            NFAVisual.addNode("4");

            NFAVisual.addLink("0,1", "1", "1");
            NFAVisual.addLink("1", "1", "2");
            NFAVisual.addLink("0,1", "2", "3");
            NFAVisual.addLink("0,1", "3", "4");

            d3.select('#N1').classed('selected', true);
            $scope.setStartState();
            d3.select('#N1').classed('selected', false);
            d3.select('#N4').classed('selected', true);
            $scope.setAcceptStates();
        }

        $scope.sampleNFA3 = function() {
            var i;
            NFAVisual.removeAll();
            for (i = 0; i < 15; i++) {
                NFAVisual.addNode(i.toString());
            }
            for (i = 0; i < 14; i++) {
                NFAVisual.addLink(i.toString(), i.toString(), (i + 1).toString());
            }
            d3.select('#N0').classed('selected', true);
            $scope.setStartState();

        }

        /**
         * analagous to initialize NFA, but with no sample states and transitions.
         */
        $scope.initializeDFA = function() {
            //extract the width and height of the div.
            var width = $("#NFA").innerWidth(),
                height = $("#NFA").parent().innerHeight();

            DFAVisual = new ForceGraph("#DFA", width, height);

        }

        /**
         * called from: $scope.addState(), $scope.addTransition(), $scope.deleteSelected()
         * 
         * syncs the actual NFA states and transitions to the corresponding states and transitions
         * in visual NFA         
         */
        function syncNFA() {

            var i, tmp, visual = {
                    states: new Map(),
                    transitions: new Map()
                },
                actual = {
                    states: new Map(),
                    transitions: new Map()
                };


            //Convert the visual states and transitions to maps
            visual.states.putArray(NFAVisual.getNodes(), 'id');
            visual.transitions.putArray(NFAVisual.getLinks(), 'elementId');

            //Remove any states and transitions that are not in the visual
            for (i = 0; i < NFA.states.length; i++) {
                console.log(NFA.states[i]);
            }

            //Convert the actual states and transitions to maps
            actual.states.putArray(NFA.states);
            actual.transitions.putArray(NFA.transitions);

            //Add any states and transitions that are not in the actual
            tmp = visual.states.toArray();
            for(i = 0; i < tmp.length; i++) {
                if(actual.states.find(tmp[i].id) === false) {
                    NFA.states.push(tmp[i].id);
                }
            }

            tmp = visual.transitions.toArray();
            for(i = 0; i < tmp.length; i++) {
                
            }
            console.log("syncNFA called");

            // console.log("NFA states", NFA.states);
            console.log("NFA transitions", NFA.transitions.toArray());

            // console.log("NFAVisual states", visual.states.toArray());
            // console.log("NFAVisual transitions", visual.transitions.toArray());
            //Determine the states and transitions which exist in NFAVisual, but not NFA

            //Call addNode and addLink to syncronize for the new states and transitions.
        }

        /** 
         * called from: $scope.stepForward(), $scope.stepBackward(), $scope.runConversion(), $scope.pauseConversion()
         *
         * analagous in functionality to syncNFA, but this time DFAVisual is "playing catch-up"
         */
        function syncDFA() {
            console.log("syncDFA called");
        }

        /**
         * called when a user clicks the "Add State" button.
         *
         * prompts the user for a name for this state and calls
         * addNode for the NFAVisual object.
         * 
         */
        $scope.addState = function() {
            var id = '';
            while (id.trim().length === 0 || id.trim().length > 3) {
                id = prompt('State Id? (1 to 3 characters)', '');
            }
            NFAVisual.addNode(id);
            syncNFA();
        }

        /**
         * called when a user clicks the "Add Transition" button.
         *
         * prompts the user for a name, source, and target transition.
         *
         * right now it doesn't error check if the user gives bogus
         * input. I'll have to implement that to make sure the conversion
         * isn't corrupted.
         */
        $scope.addTransition = function() {
            var symbols = '',
                source = '',
                target = '';
            while (symbols.trim().length === 0) {
                symbols = prompt('(1/3): Symbols? (Separated by commas)', '');
            }
            while (source.trim().length === 0) {
                source = prompt('(2/3): Source state?', '');
            }
            while (target.trim().length === 0) {
                target = prompt('(3/3): Target state?', '');
            }

            NFAVisual.addLink(symbols, source, target);
            syncNFA();
        }

        /**
         * called when a user clicks the "Delete Selected" button.
         * 
         * deletes any nodes elements that have the selected
         * class and deletes any corresponding links.
         */
        $scope.deleteSelected = function() {
            d3.selectAll(".selected").each(function(d) {
                NFAVisual.removeNode(d.id);
            });
            syncNFA();
        }

        $scope.setStartState = function() {
            NFAVisual.toggleClass('.selected', 'start', false);
            var id = d3.select('.selected.start').attr('id');
            NFAVisual.toggleClass('.selected.start', 'selected', false);
            NFAVisual.setNodeProperty(id, 'fixedPosition', {
                "x": NFAVisual.nodeRadius * 4,
                "y": NFAVisual.nodeRadius * 4
            });
            syncNFA();
        }

        $scope.setAcceptStates = function() {
            NFAVisual.toggleClass('.selected', 'accept', true);
            NFAVisual.toggleClass('.selected.accept', 'selected', true);
            syncNFA();
        }



        /**
         * called when a user clicks the "Step Forward" button.
         *
         * steps forward in the conversion from NFA to DFA.
         */
        $scope.stepForward = function() {
            console.log("stepForward called");
            syncDFA();
        }

        /**
         * called when a user clicks the "Step Backward" button.
         *
         * steps backward in the conversion from NFA to DFA.
         */
        $scope.stepBackward = function() {
            console.log("stepBackward called");

            syncDFA();
        }

        /**
         * called when a user clicks the "Run Conversion" button.
         *
         * runs the conversion from NFA to DFA until 
         * at 1 second intervals until pauseConversion is called.
         */
        $scope.runConversion = function() {
            console.log("runConversion called");
            converting = true;
            while (converting === true) { //add something to determine whether the conversion is complete

                //find a clean, non-blocking way to pause here.

                $scope.stepForward();
            }
        }

        /**
         * called when a user clicks the "Pause Conversion" button.
         *
         * pauses the conversion from NFA to DFA.
         */
        $scope.pauseConversion = function() {
            console.log("pauseConversion called");
            converting = false;
            syncDFA();
        }

    });
