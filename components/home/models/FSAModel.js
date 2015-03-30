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
        for(var t in this.transitions.contents) {
            this.appendTransition(this.transitions.contents[t]);
        }

        //Append the initial states
        for(var s in this.states.contents) {
            this.appendState(this.states.contents[s]);
        }

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
                .call(d3.behavior.drag().on("drag", dragMove));
            //create and append the state to the container element
            var svgCircle = svgNode.append("circle")
                .attr("r", "20");
            //create and append the id to the container element
            var svgid = svgNode.append("text")
                .text(state.label)
                .attr("class", "state-label")
                .attr("dx", -5 * state.label.length)
                .attr("dy", 5)
                .style("cursor", "pointer");
        },
        /**
         * create a new transition object from the symbol, source, and target
         */
        addTransition: function(symbol, source, target) {
            var transition = new TransitionModel(symbol, source, target);
            this.transitions.put(transition.id, transition);
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
                d = arcPath(source, target);
                svgPath = this.container.append("path")
                .attr("d", d)
                .classed("transition", true);
            this.transitions.put(transition.id, transition);
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
        toggleStateProperty: function(state, element, property) {
            var svgState = d3.select(state),
                svgElement = d3.select(state).select(element),
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
        },
    }

    /**
     * Node dragging behavior.
     * Node is not dragged if the shift key is pressed.
     */
    function dragMove() {
        // Prevent drag if shift key pressed
        if (!d3.event.sourceEvent.shiftKey) {
            var x = d3.event.x;
            var y = d3.event.y;
            d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
        }
    }

    function arcPath(source, target) {
        var dx = target.x - source.x,
            dy = target.y - source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
    }

    return FSAModel;

});
