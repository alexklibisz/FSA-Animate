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
        //graph content
        var graph1 = {
            "nodes": [{
                "name": "1"
            }, {
                "name": "2"
            }, {
                "name": "3"
            }],
            "links": [{
                "source": 2,
                "target": 0,
                "symbol": "a"
            }, {
                "source": 0,
                "target": 2,
                "symbol": "E"
            }, {
                "source": 0,
                "target": 1,
                "symbol": "b"
            }, {
                "source": 1,
                "target": 1,
                "symbol": "a"
            }, {
                "source": 1,
                "target": 2,
                "symbol": "a,b"
            }]
        };

        var graph = {
            nodes: this.states.toArray(),
            links: this.transitions.toArray()
        };

        //Set up the force layout
        var force = d3.layout.force()
            .charge(-300)
            .linkDistance(200)
            .size([this.width, this.height]);

        //Append a SVG to the body of the html page. Assign this SVG as an object to svg
        var svg = d3.select(this.containerElement).append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        console.log(JSON.stringify(graph.nodes));
        console.log("links", (graph.links));

        //Creates the graph data structure out of the json data
        force.nodes(graph.nodes)
            .links(graph.links)
            .start();

        var defs = svg.append("defs").selectAll("marker")
            .data(["arrow"])
            .enter().append("marker")
            .attr("id", function(d) {
                return d;
            })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("marker-end", "url(#arrow)")
            .attr("id", function(d) {
                return d.id;
            });

        var linkText = svg.append("g").selectAll(".link")
        	.data(graph.links)
        	.enter().append("text")
            .attr("x", 6)
            .attr("dy", -12)
            .attr("style", "text-anchor:middle");

        var linkTextPath = linkText.append("textPath")
            .attr("stroke", "black")
            .attr("xlink:href", function(d) {
            	return '#' + d.id;
            })
            .attr("startOffset", "50%")
            .text(function(d) {
            	return d.name;
            });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);
        
        var circles = node.append("circle")
            .attr("r", function(d) {
                return d.radius;
            })
            .on('dblclick', function(d) {
                alert(JSON.stringify(d));
            });
        
        var nodeText = node.append("text")
            .attr("dx", 0)
            .attr("dy", ".35em")
            .attr("class", "node-label")
            .text(function(d) {
                return d.name
            });

        //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
        force.on("tick", function() {
            link.attr("d", linkArc);
            d3.selectAll("circle").attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
            d3.selectAll("text.node-label").attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y;
                });
        });

        function linkArc(d) {
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
                x2 = x2 - dr;
                y2 = y2 - dr;
            }

            // x and y distances from center to outside edge of target node
            var offsetX = (dx * d.target.radius) / dr,
                offsetY = (dy * d.target.radius) / dr;

            // Put it all together to define the path
            return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + (x2 - offsetX) + "," + (y2 - offsetY);
        }

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
    select: function(element) {},
    /**
     * properly delete the element and any linked
     * elements.
     */
    delete: function(element) {},
    /**
     * delete all elements in the container
     * that have the "selected" class.
     */
    deleteSelected: function() {}

}


function FSMState(name) {
    this.id = name.replace(/\s/g, '');
    this.name = name;
    this.selected = false;
    this.radius = 25;
}

function FSMTransition(name, source, target) {
    name = name.replace(/\s/g, '');
    this.id = [source.name, name, target.name].join("_");
    this.name = name;
    this.source = source;
    this.target = target;
}
