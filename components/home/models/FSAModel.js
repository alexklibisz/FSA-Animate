app.service('FSAModel', function(Map, StateModel, TransitionModel) {

    function FSAModel(container, height, width, states, transitions, alphabet, startState, acceptStates) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.height = height;
        this.width = width;
        this.states = new Map();
        this.transitions = new Map();
        this.startState = startState;
        this.acceptStates = acceptStates;

        //this.createInitialStates(states); //something that creates but doesn't append the initial states.
        for(var i = 0; i < states.length; i++) {
            //here
            //this.states.put(states[i], new StateModel(states[i], 0, 0));
        }

        this.addInitialStates(states);
        this.addInitialTransitions(transitions);

    }

    FSAModel.prototype = {
        /**
         * Validate the passed label;
         * Create a state object with the label and coordinates;
         * Add the object to the states map;
         * Create, append svgState as a container for the circle and the label;
         * Create, append the circle;
         * Create, append the label
         */
        addState: function(label, x, y) {
            //validate based on the label
            if (label.length === 0 || label.length > 3 || this.states.find(label).visible === true) return false;
            var state = this.states.find(label);
            if(state === false) {
                state = new StateModel(label, x, y);    
            } else {
                state.x = x;
                state.y = y;
            }
            this.states.put(state.id, state);
            //create the container element and define drag behavior
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + state.x + "," + state.y + ")")
                .attr("class", "state")
                .attr("id", state.id)
                .call(d3.behavior.drag().on("drag", dragMove));
            //create and append the state to the container element
            var svgCircle = svgNode.append("circle")
                .attr("r", "20");
            //create and append the label to the container element
            var svgLabel = svgNode.append("text")
                .text(label)
                .attr("class", "state-label")
                .attr("dx", -5 * label.length)
                .attr("dy", 5)
                .style("cursor", "pointer");
        },
        /**
         * states: list of character labels;
         * iterate over the list;
         * calculate x and y coordinates for a 4 * n/4 grid;
         * call addState() to add the states
         */
        addInitialStates: function(states) {
            var i, x, y;
            for (i = 0; i < states.length; i++) {
                x = (this.width / 4) * (i * 1.0 % 4) + 50;
                y = (this.height / 4) * Math.floor(i / 4) + 50;
                this.addState(states[i], x, y);
            }
        },
        /**
         * transition: a transition object
         * looks up the transition's source and target
         * nodes and creates a new object that contains
         * their coordinates.
         */
        addTransition: function(transition) {
            var source = this.states.find(transition.source),
                target = this.states.find(transition.target),
                d = arcPath(source, target),
                svgPath = this.container.append("path")
                .attr("d", d)
                .classed("transition", true);
            this.transitions.put(transition.id, transition);
            console.log(this.transitions.contents);

        },
        addInitialTransitions: function(transitions) {
            var i, transition, source, target;
            for (i = 0; i < transitions.length; i++) {
                this.addTransition(transitions[i]);
            }
        },
        selectState: function(state) {
            this.toggleStateProperty(state, "circle", "selected");
        },
        deleteSelected: function() {
            var states = this.states.contents;
            for (var n in states) {
                if (states[n].selected) {
                    d3.select("#" + states[n].id).remove();
                    this.states.remove(states[n].id);
                }
            }
        },
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
