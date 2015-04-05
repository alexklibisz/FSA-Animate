/**
 * ForceFSM.js -- a visual, interactive finite state machine 
 * implemented using the d3.js force layout.
 *
 * Alex Klibisz -- 4/4/15
 */

function ForceFSM(containerElement, height, width, alphabet, startState, acceptStates) {
    this.containerElement = containerElement;
    this.height = height;
    this.width = width;
    this.states = new Map();
    this.transitions = new Map();
    this.alphabet = alphabet;
    this.startState = startState;
    this.acceptStates = acceptStates;
}

ForceFSM.prototype = {
    start: function() {

        var parentThis = this;

        var graph = {
            states: this.states.toArray(),
            transitions: this.transitions.toArray()
        };

        // Set up the force layout
        var force = d3.layout.force()
            .charge(-300)
            .linkDistance(200)
            .size([this.width, this.height]);

        // Append an svg container to the specifed element.
        var svg = d3.select(this.containerElement).append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        // Creates the force layout from the graph object.
        force.nodes(graph.states)
            .links(graph.transitions)
            .start();

        // Append defs for arrows
        var defs = svg.append("defs").selectAll("marker")
            .data(["arrow"])
            .enter().append("marker")
            .attr("id", function(d) {
                return d;
            })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-3L6,0L0,3");

        // Append a group for all of the transition path elements.
        var transitionPaths = svg.append("g")
            .attr("class", "transition-paths")
            .selectAll(".transitions")
            .data(graph.transitions)
            .enter().append("path")
            .attr("class", "transition-path")
            .attr("marker-end", "url(#arrow)")
            .attr("id", function(d) {
                return d.elementId;
            })
            .on("dblclick", function(d) {
                parentThis.select(d);
            });

        // Append a group for all of the transition text elements
        var transitionTexts = svg.append("g")
            .attr("class", "transition-texts")
            .selectAll(".transition-text")
            .data(graph.transitions)
            .enter().append("text")
            .attr("class", "transition-text")
            .attr("x", 6)
            .attr("dy", -12);

        // Append textPath elements to their corresponding text elements
        var transitionTextPaths = transitionTexts.append("textPath")
            .attr("startOffset", "50%")
            .attr("class", "transition-text-path")
            .attr("xlink:href", function(d) {
                return '#' + d.elementId;
            })
            .text(function(d) {
                return d.name;
            });

        // Append a group element for each state
        var states = svg.selectAll(".state")
            .data(graph.states)
            .enter().append("g")
            .attr("id", function(d) {
                return d.elementId;
            })
            .attr("class", "state")
            .call(force.drag);

        // Append a circle element to each state
        var stateCircles = states.append("circle")
            .attr("class", "state-circle")
            .attr("r", function(d) {
                return d.radius;
            })
            .on('dblclick', function(d) {
                parentThis.select(d)
            });

        // Append a text element to each state
        var stateText = states.append("text")
            .attr("dx", function(d) {
                return -3 * d.name.length;
            })
            .attr("dy", ".35em")
            .attr("class", "state-text")
            .text(function(d) {
                return d.name
            })
            .on('dblclick', function(d) {
                parentThis.select(d)
            });

        //Define the tick movement.
        force.on("tick", function() {
            transitionPaths.attr("d", parentThis.linkArc);
            d3.selectAll("circle").attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
            d3.selectAll("text.state-text").attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y;
                });
            //d3.selectAll("textPath").attr("transform", "rotate(-45 100 100)");
        });

        //Define a custom start behavior
        force.on("start", function() {
            var ticksPerRender = 100000;
            requestAnimationFrame(function render() {
                for (var i = 0; i < ticksPerRender; i++) {
                    force.tick();
                }
                links
                    .attr('x1', function(d) {
                        return d.source.x;
                    })
                    .attr('y1', function(d) {
                        return d.source.y;
                    })
                    .attr('x2', function(d) {
                        return d.target.x;
                    })
                    .attr('y2', function(d) {
                        return d.target.y;
                    });
                nodes
                    .attr('cx', function(d) {
                        return d.x;
                    })
                    .attr('cy', function(d) {
                        return d.y;
                    });

                if (force.alpha() > 0) {
                    requestAnimationFrame(render);
                }
            })
        })

        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }

    },
    /**
     * rebuilds the force layout with the current
     * states and transitions.
     */
    restart: function() {},
    /**
     * user input prompt with the passed message
     * and returns the user input.
     */
    promptUser: function() {},
    /**
     * add the passed state tot he states map
     *
     * if nothing is passed, prompt the user for 
     * input and add a circle svg to the graph.
     */
    addState: function(name) {
        if (arguments.length === 1) {
            var state = new FSMState(name);
            this.states.put(state.id, state);
        } else {

        }
        this.restart();
    },
    /**
     * prompt the user for updated state input and
     * update it in the graph.
     */
    editState: function() {},
    /**
     * mark any selected states as accept states
     */
    acceptSelectedStates: function() {},
    /**
     * add the passed transition to the transition
     * map.
     * 
     * if nothing is passed, prompt the user for label 
     * input and add a transition.
     *
     * eventually change this to a single state
     * function initiated by some key+click combo.
     */
    addTransition: function(name, source, target) {
        if (arguments.length === 3) {
            var sourceObj = this.states.find(source),
                targetObj = this.states.find(target),
                transition = new FSMTransition(name, sourceObj, targetObj);
            this.transitions.put(transition.id, transition);
        } else {

        }
        this.restart();
    },
    /**
     * toggle the "selected" class for the element
     */
    select: function(element) {
        element.selected = !element.selected;
        d3.select("#" + element.elementId).classed("selected", element.selected);
    },
    /**
     * properly delete the element and any linked
     * elements.
     */
    delete: function(element) {},
    /**
     * delete all elements in the container
     * that have the "selected" class.
     *
     * for states, track down any transitions
     * that have the state as a source or
     * target and remove them as well.
     */
    deleteSelected: function() {
        var states = this.states,
            transitions = this.transitions;
        d3.selectAll(".selected").each(function(d) {
            if (d.elementId[0] === 'S') {
                states.remove(d.id);
                var tr = d3.values(transitions.contents);
                for (var t in tr) {
                    if(tr[t].source.id === d.id ||
                    	tr[t].target.id === d.id) transitions.remove(tr[t].id);
                }
            } else {
                transitions.remove(d.id);
            }
        });
        console.log(states.toArray().length);
        console.log(transitions.toArray().length);
    },
    linkArc: function(d) {
        //http://stackoverflow.com/questions/16660193/get-arrowheads-to-point-at-outer-edge-of-node-in-d3
        ////http://jsfiddle.net/LUrKR/
        var x1 = d.source.x,
            y1 = d.source.y,
            x2 = d.target.x,
            y2 = d.target.y,
            dx = x2 - x1,
            dy = y2 - y1,
            dr = Math.sqrt((dx * dx) + (dy * dy)),
            // Defaults for normal edge.
            drx = dr,
            dry = dr,
            xRotation = 0, // degrees
            largeArc = 0, // 1 or 0
            sweep = 1; // 1 or 0

        // Self edge.
        if (x1 === x2 && y1 === y2) {
            dr = 1;
            // Fiddle with this angle to get loop oriented.
            xRotation = 65;
            // Needs to be 1.
            largeArc = 1;
            // Make drx and dry different to get an ellipse instead of a circle
            drx = 40;
            dry = 30;
            // Beginning and end points must be differnet.
            x1 -= 5;
        }

        // x and y distances from center to outside edge of target node
        var offsetX = (dx * d.target.radius) / dr,
            offsetY = (dy * d.target.radius) / dr;

        // Put it all together to define the path
        return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + (x2 - offsetX) + "," + (y2 - offsetY);
    }
}


function FSMState(name) {
    this.id = name.replace(/\s/g, '');
    this.name = name;
    this.elementId = 'S' + this.id;
    this.selected = false;
    this.radius = 25;
}

function FSMTransition(name, source, target) {
    name = name.replace(/\s/g, '');
    this.id = [source.name, name, target.name].join("_");
    this.elementId = 'T' + this.id;
    this.name = name;
    this.source = source;
    this.target = target;
    this.selected = false;
}
