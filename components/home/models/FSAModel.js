app.service('FSAModel', function(Map, StateModel, TransitionModel) {

    function FSAModel(container, height, width, states, transitions, alphabet, startState, acceptStates) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.height = height;
        this.width = width;
        this.states = new Map();
        this.transitions = new Map();
        this.startState = startState;
        this.acceptStates = acceptStates;

        //Create the initial state objects
        for (var i = 0; i < states.length; i++) {
            var x = (this.width / 4) * (i * 1.0 % 4) + 50;
            var y = (this.height / 4) * Math.floor(i / 4) + 50;
            this.addState(states[i], x, y);
        }

        //Create the initial transition objects
        for (var i = 0; i < transitions.length; i++) {
            this.addTransition(transitions[i].symbol, transitions[i].source, transitions[i].target);
        }

        //Append the initial transitions
        for (var t in this.transitions.contents) {
            this.appendTransition(this.transitions.contents[t]);
        }

        //Append the initial states
        for (var s in this.states.contents) {
            this.appendState(this.states.contents[s]);
        }

        console.log("States ", this.states.contents);
        console.log("Transitions ", this.transitions.contents);


    }

    FSAModel.prototype = {
        /**
         * Validate the passed state by its id,
         * Create a new state object from the label, x, and y
         * Add the state object to the states map
         * Return the new state object
         */
        addState: function(label, x, y) {
            var state = new StateModel(label, x, y);
            if (label.length === 0 || label.length > 3 || this.states.find(state.id)) return false;
            this.states.put(state.id, state);
            return state;
        },

        /**
         * Add the object to the states map;
         * Create, append svgState as a container for the circle and the label;
         * Create, append the circle;
         * Create, append the label
         */
        appendState: function(state) {
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + state.x + "," + state.y + ")")
                .attr("class", "state")
                .attr("id", state.id)
                .call(d3.behavior.drag().on("drag", dragState));
            //create and append the state to the container element
            var svgCircle = svgNode.append("circle")
                .attr("r", "20");
            //create and append the id to the container element
            var svgLabel = svgNode.append("text")
                .text(state.label)
                .attr("class", "state-label")
                .attr("dx", -5 * state.label.length)
                .attr("dy", 5);
        },
        /**
         * create a new transition object from the symbol, source, and target
         */
        addTransition: function(symbol, sourceId, targetId) {
            var transition = new TransitionModel(symbol, sourceId, targetId),
                sourceState = this.states.find(sourceId),
                targetState = this.states.find(targetId);
            this.transitions.put(transition.id, transition);
            sourceState.transitionsFrom.put(transition.id, transition);
            targetState.transitionsTo.put(transition.id, transition);
        },
        /**
         * transition: a transition object
         * looks up the transition's source and target
         * nodes and creates a new object that contains
         * their coordinates.
         */
        appendTransition: function(transition) {
            var source = this.states.find(transition.source),
                target = this.states.find(transition.target);
            d = transitionPath(source.x, source.y, target.x, target.y);
            svgPath = this.container.append("path")
                .attr("d", d)
                .attr("source", transition.source)
                .attr("target", transition.target)
                .classed("transition", true);
        },
        selectState: function(state) {
            this.toggleStateProperty(state, "circle", "selected");
        },
        //need to fix
        deleteSelected: function() {
            var states = this.states.contents;
            for (var n in states) {
                if (states[n].selected) {
                    d3.select("#" + states[n].id).remove();
                    this.states.remove(states[n].id);
                }
            }
        },
        //need to fix
        setAcceptStates: function() {
            var states = this.states.contents,
                state;
            for (var n in states) {
                if (states[n].selected) {
                    state = d3.select("#" + states[n].id);
                    this.toggleStateProperty(state[0][0], "circle", "accept");
                }
            }
        },
        setStartState: function() {},
        /**
         * Generic function for toggling a true/false property
         * for a state, its css class, and in its object.
         */
        toggleStateProperty: function(stateElement, innerElement, property) {
            var svgState = d3.select(stateElement),
                svgElement = d3.select(stateElement).select(innerElement),
                id = svgState.attr("id"),
                stateObj = this.states.find(id);
            if (stateObj[property]) {
                svgState.classed(property, false);
                stateObj[property] = false;
            } else {
                svgState.classed(property, true);
                stateObj[property] = true;
            }
            this.states.put(stateObj.id, stateObj);
        }
    }

    /**
     * Node dragging behavior.
     * Node is not dragged if the shift key is pressed.
     */
    function dragState() {
        // Prevent drag if shift key is pressed
        if (d3.event.sourceEvent.shiftKey) return;
        var x = d3.event.x,
            y = d3.event.y,
            svgState = d3.select(this),
            id = svgState.attr("id"),
            //Select all of the paths where source is this state's id
            sourceTransitions = d3.selectAll(`[source=${id}]`),
            //and all of the paths where target is this state's id
            targetTransitions = d3.selectAll(`[target=${id}]`);

        /**
         * Updating coordinates to "move" the transitions:
         * For every source and target transition:
         * - select the svg path element used for this transtion;
         * - select its "d" attribute and turn it into an array
         * by splitting at the spaces;
         * - modify the 0th (source or 2nd (target) element with 
         * the new x and y coordinates;
         * - join the array into a new string and set this as the 
         * new "d" attribute.
         */
        for (var i = 0; i < sourceTransitions[0].length; i++) {
            var svgPath = d3.select(sourceTransitions[0][i]),
                dArray = svgPath.attr("d").split(' ');
            dArray[0] = `M${x},${y}`;
            var d = dArray.join(' ');
            svgPath.attr('d', d);
        }

        for (var i = 0; i < targetTransitions[0].length; i++) {
            var svgPath = d3.select(targetTransitions[0][i]),
                dArray = svgPath.attr("d").split(' ');
            dArray[2] = `${x},${y}`;
            var d = dArray.join(' ');
            svgPath.attr('d', d);
        }

        svgState.attr("transform", "translate(" + x + "," + y + ")");
    }



    /**
     * Creates and returns the "M" property
     * for a clockwise arc from
     * source to target.
     * https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
     */
    function transitionPath(sx, sy, tx, ty) {
        var dx = tx - sx,
            dy = ty - sy,
            dr = Math.sqrt(dx * dx + dy * dy);
        return `M${sx},${sy} A${dr},${dr},0,0,1, ${tx},${ty}`;
    }

    return FSAModel;

});
