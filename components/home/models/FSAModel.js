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
            this.addTransition(transitions[i].source, transitions[i].target, transitions[i].symbols);
        }

        //Append the svg defs
        this.appendDefs();

        //Append the initial transitions
        for (var t in this.transitions.contents) {
            this.appendTransition(this.transitions.contents[t]);
        }
        //Append the initial states
        for (var s in this.states.contents) {
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
        addTransition: function(sourceId, targetId, symbols) {
            var key = [sourceId, targetId].join(','),
                transition = this.transitions.find(key);
            if (transition === false) {
                transition = new TransitionModel(sourceId, targetId, symbols);
            } else {
                transition.symbols = transition.symbols.concat(symbols);
            }
            this.transitions.put(key, transition);
        },
        /**
         * transition: a transition object
         * looks up the transition's source and target
         * nodes and creates a new object that contains
         * their coordinates.
         */
        appendTransition: function(transition) {
            var source = this.states.find(transition.source),
                target = this.states.find(transition.target),
                d = transitionPath(source.x, source.y, target.x, target.y),
                transitionGroup = this.container.append("g")
                .attr("source", transition.source)
                .attr("target", transition.target)
                .classed("transition", true),
                path = transitionGroup.append("path")
                .attr("d", d)
                .attr("marker-end", "url(#arrow-end)");
            // bBox = path.node().getBBox(),
            // labelX = bBox.x + (bBox.width / 2.0),
            // labelY = bBox.y,
            // label = transitionGroup.append("text")
            // .text(transition.symbol)
            // .attr("transform", "translate(" + labelX + "," + labelY + ")");
        },
        appendDefs: function() {
            var defs = this.container.append('defs'),
                marker = defs.append('marker')
                .attr('id', 'arrow-end')
                .attr('viewBox', '0 0 10 10')
                .attr('refX', '30')
                .attr('refY', '3')
                .attr('markerWidth', '5')
                .attr('markerHeight', '5')
                .attr('orient', 'auto'),
                path = marker.append('path')
                .attr('d', 'M 0 0 L 10 5 L 0 10 z');
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
        // deleteState: function(state) {

        // },
        // deleteTransition: function(transition) {

        // },
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
     * State dragging behavior.
     * Also redraws the arcs connected.
     * State is not dragged if the shift key is pressed.
     */
    function dragState() {
        if (d3.event.sourceEvent.shiftKey) return; //prevent drag if shift key is pressed
        var x = d3.event.x,
            y = d3.event.y,
            svgState = d3.select(this),
            id = svgState.attr("id"),
            sourceTransitions = d3.selectAll(`[source=${id}]`), //paths with this state as source
            targetTransitions = d3.selectAll(`[target=${id}]`); //paths with this state as target

        svgState.attr("transform", "translate(" + x + "," + y + ")");

        for (var i = 0; i < sourceTransitions[0].length; i++) {
            var pathElement = d3.select(sourceTransitions[0][i]).select("path"),
                pathObj = d3.select(pathElement[0][0]),
                labelElement = d3.select(sourceTransitions[0][i]).select("text"),
                labelObj = d3.select(labelElement[0][0]),
                dArray = pathObj.attr('d').split(' '),
                target = dArray[2].split(','),
                d = transitionPath(x, y, target[0], target[1]);
            //     bBox = pathElement[0][0].getBBox(),
            //     labelX = bBox.x + (bBox.width / 2.0),
            //     labelY = bBox.y;
            // if (Math.abs(bBox.y - Math.max(y, target[1])) <
            //     Math.abs((bBox.y + bBox.height) - Math.max(y, target[1]))) { //downward curve
            //     labelY += bBox.height;
            // }
            pathObj.attr('d', d);
            // labelObj.attr("transform", "translate(" + labelX + "," + labelY + ")");
        }

        for (var i = 0; i < targetTransitions[0].length; i++) {
            var pathElement = d3.select(targetTransitions[0][i]).select("path"),
                pathObj = d3.select(pathElement[0][0]),
                labelElement = d3.select(targetTransitions[0][i]).select("text"),
                labelObj = d3.select(labelElement[0][0]),
                dArray = pathObj.attr('d').split(' '),
                source = dArray[0].split(','),
                d = transitionPath(source[0].replace('M', ''), source[1], x, y);
            // bBox = pathElement[0][0].getBBox(),
            //     labelX = bBox.x + (bBox.width / 2.0),
            //     labelY = bBox.y;
            // if (Math.abs(bBox.y - Math.max(y, target[1])) <
            //     Math.abs((bBox.y + bBox.height) - Math.max(y, target[1]))) { //downward curve
            //     labelY += bBox.height;
            // }
            pathObj.attr('d', d);
            // labelObj.attr("transform", "translate(" + labelX + "," + labelY + ")");
        }


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
            rx = Math.sqrt(dx * dx + dy * dy),
            ry = rx;
        if (dx === 0 && dy === 0) {
            sx -= 2;
            tx -= 2;
            rx = 150;
            ry = 150;
        }
        return `M${sx},${sy} A${rx},${ry},0,0,1, ${tx},${ty}`;
    }

    return FSAModel;

});
