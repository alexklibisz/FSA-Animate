app.service('FSAModel', function(Map) {

    function FSAModel(container, height, width, states, transitions, alphabet) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.height = height;
        this.width = width;
        this.states = new Map();
        this.transitions = transitions;

        this.addInitialStates(states);
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
            if (label.length === 0 || label.length > 3 || this.states.find(label) !== false) return false;
            var state = {
                id: label,
                x: x,
                y: y
            };
            this.states.put(state.id, state);
            //create the container element and define drag behavior
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + state.x + "," + state.y + ")")
                .attr("class", "state")
                .attr("id", label)
                .call(d3.behavior.drag().on("drag", dragMove));
            //create and append the state to the container element
            var circle = svgNode.append("circle")
                .attr("r", "20");
            //create and append the label to the container element
            var label = svgNode.append("text")
                .text(label)
                .attr("class", "state-label")
                .attr("dx", -5 * label.length)
                .attr("dy", 5)
                .style("cursor", "pointer");
        },
        /**
         * statess: list of character labels;
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

    return FSAModel;

});
