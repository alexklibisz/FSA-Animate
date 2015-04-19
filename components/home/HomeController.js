app.controller('HomeController',
    function($scope, $location) {

        /**
         * declare variables shared within the HomeController.
         */
        var NFA = null,
            NFAVisual = null,
            DFAVisual = null,
            converter = new Converter(),
            converting = false;

        /**
         * called once the div with id "NFA" has been initialized. 
         * 
         * Creates a new instance of ForceGraph called NFAVisual,
         * appending it to the div with id "NFA"
         *
         * Then applies some sample states and transitions.
         */
        $scope.initializeNFA = function() {
            var width = $("#NFA").innerWidth(),
                height = $("#NFA").parent().innerHeight();
            NFAVisual = new ForceGraph("#NFA", width, height);

            NFA = new FSA();
            converter.nfa = NFA;

            $scope.sampleNFA1();
            syncNFA();
        }

        /**
         * analagous to initialize NFA, but with no sample states and transitions.
         */
        $scope.initializeDFA = function() {
            //extract the width and height of the div.
            var width = $("#DFA").innerWidth(),
                height = $("#DFA").parent().innerHeight();

            DFAVisual = new ForceGraph("#DFA", width, height);
            DFAVisual.forceRenderSpeed = 100;
            DFAVisual.nodeRadius = 20;
            syncDFA();
        }

        /**
         * Clear the NFA states array and transitions map.
         * Recreate them from the current NFAVisual nodes and links.
         * Parse the transitions in NFAVisual to deduce what the alphabet is.
         * Find the start and accept states in NFAVisual and set them in NFA.
         * 
         * This is admittedly a wasteful implementation, as it completely
         * re-creates the array and map on every call. 
         */
        function syncNFA() {
            var i, j, key, reachableStates, visualStates = NFAVisual.getNodes(),
                visualTransitions = NFAVisual.getLinks(),
                tmp, alphabet;

            // Clear and recreate the states
            NFA.states = [];
            for (i = 0; i < visualStates.length; i++) {
                NFA.states.push(visualStates[i].id);
            }
            // Clear and recreate the transitions.
            NFA.transitions.clear();
            for (i = 0; i < visualTransitions.length; i++) {
                var sourceState = (visualTransitions[i].id.split('-'))[0],
                    targetState = (visualTransitions[i].id.split('-'))[1],
                    symbols = (visualTransitions[i].label.split(','));

                for (j = 0; j < symbols.length; j++) {
                    key = [sourceState, symbols[j]].join('-');
                    reachableStates = NFA.transitions.find(key);
                    if (!reachableStates) {
                        NFA.transitions.put(key, [targetState]);
                    } else {
                        NFA.transitions.put(key, reachableStates.concat(targetState).sort())
                    }
                }
            }
            // Iterate over the transitions to deduce the NFA alphabet
            alphabet = new Map();
            for (i = 0; i < visualTransitions.length; i++) {
                tmp = visualTransitions[i].label;
                if (tmp === 'E') continue;
                tmp = tmp.replace(',E', '').replace('E,', '');
                tmp = tmp.split(',').sort();
                alphabet.putArray(tmp);
            }
            NFA.alphabet = alphabet.toArray().sort();
            // Clear and specify the start states.
            d3.selectAll('.start').each(function(d, i) {
                NFA.startState = d.id;
            });
            // Clear and specifcy the accept states.
            NFA.finalStates = [];
            d3.selectAll('.accept').each(function(d, i) {
                NFA.finalStates.push(d.id);
            });
        }

        /** 
         * Adds any states that exist in the DFA but not in the DFAVisual to
         * the DFAVisual.
         * Sets the start and accept states to be equal.
         */
        function syncDFA() {
            console.log('syncDFA called');

            if (converter.dfa === null || converter.dfa === undefined) return;

            var i, tmp, label, visualStates = new Map(),
                visualTransitions = new Map(),
                magicNumber = 180,
                nodesPerRow = Math.floor(DFAVisual.width / magicNumber),
                nodesPerColumn = Math.floor(DFAVisual.height / magicNumber),
                horizontalDistance = Math.floor(DFAVisual.width / nodesPerRow),
                verticalDistance = Math.floor(DFAVisual.height / nodesPerColumn);

            console.log('nodesPerRow', nodesPerRow);
            console.log('horizontalDistance', horizontalDistance);
            console.log('verticalDistance', verticalDistance);

            //Add any states that exist in DFA and not in DFAVisual to DFAVisual
            visualStates.putArray(DFAVisual.getNodes(), 'id');
            for (i = 0; i < converter.dfa.states.length; i++) {
                var label = converter.dfa.states[i],
                    state = visualStates.find(label);
                if (!state) {
                    visualStates.put(label, label);
                    var x = horizontalDistance * (i % nodesPerRow) + 100,
                        y = verticalDistance * Math.floor(i / nodesPerRow) + 100;
                    DFAVisual.addNode(label, x, y);
                }
            }

            //Add any transitions that exist in DFA and not in DFAVisual to DFAVisual
            visualTransitions.putArray(DFAVisual.getLinks(), 'id');
            tmp = converter.dfa.transitions.contents;
            for (var k in tmp) {
                var source = k.split('-')[0],
                    label = k.split('-')[1],
                    target = tmp[k],
                    id = [source, target].join('-'),
                    transition = visualTransitions.find(id);

                //Add the transition -- ForceGraph.js handles redundancy
                DFAVisual.addLink(label, source, target);
            }

            //Make sure that DFAVisual's start state is the same as DFA's

            //Make sure that DFAVisual's accept states are the same as DFA's
        }

        /**
         * prompts the user for a name for this state and calls
         * addNode for the NFAVisual object.
         */
        $scope.addState = function() {
            var id = '';
            while (id.trim().length === 0 || id.trim().length > 3) {
                id = prompt('State Id? (1 to 3 characters)', '');
            }
            if (id === null) return;
            NFAVisual.addNode(id);
            syncNFA();
        }

        /**
         * prompts the user for a name, source, and target transition.
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
         * deletes any nodes elements that have the selected
         * class and deletes any corresponding links.
         */
        $scope.deleteSelected = function() {
            d3.selectAll(".selected").each(function(d) {
                NFAVisual.removeNode(d.id);
            });
            syncNFA();
        }

        /**
         * Adds the 'start' class to any nodes of the 'selected' class.
         * Deselects the node.
         * Sets the fixedPosition property for the node to lock it in place.
         */
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
         * steps forward in the conversion from NFA to DFA.
         */
        $scope.stepForward = function() {
            console.log("stepForward called");
            converter.stepForward();
            syncDFA();
        }

        /**
         * steps backward in the conversion from NFA to DFA.
         */
        $scope.stepBackward = function() {
            console.log("stepBackward called");

            syncDFA();
        }

        /**
         * runs the conversion from NFA to DFA until 
         * at 1 second intervals until pauseConversion is called.
         */
        $scope.runConversion = function() {
            console.log("runConversion called");
            converting = true;
            console.log('initial nfa:', JSON.stringify(converter.nfa));
            converter.convert();
            console.log('resulting dfa:', JSON.stringify(converter.dfa));

            syncDFA();
        }

        /**
         * pauses the conversion from NFA to DFA.
         */
        $scope.pauseConversion = function() {
            console.log("pauseConversion called");
            converting = false;
            syncDFA();
        }

        $scope.sampleNFA1 = function() {
            NFAVisual.reset();
            if (DFAVisual !== null) DFAVisual.reset();
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

            d3.select('#NFA-N1').classed('selected', true);
            $scope.setStartState();
            d3.select('#NFA-N1').classed('selected', true);
            $scope.setAcceptStates();
        }

        $scope.sampleNFA2 = function() {
            NFAVisual.reset();
            if (DFAVisual !== null) DFAVisual.reset();
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
            NFAVisual.reset();
            if (DFAVisual !== null) DFAVisual.reset();
            for (i = 0; i < 7; i++) {
                NFAVisual.addNode(i.toString());
            }
            for (i = 0; i < 6; i++) {
                NFAVisual.addLink(i.toString(), i.toString(), (i + 1).toString());
            }
            d3.select('#N0').classed('selected', true);
            $scope.setStartState();
            d3.select("#N6").classed('selected', true);
            $scope.setAcceptStates();
        }

    });
