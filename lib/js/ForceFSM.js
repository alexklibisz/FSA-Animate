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
        //Constants for the SVG
        var width = 500,
            height = 500;

        //graph content
        //graph content
        var graph = {
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

        //Set up the force layout
        var force = d3.layout.force()
            .charge(-300)
            .linkDistance(160)
            .size([width, height]);

        //Append a SVG to the body of the html page. Assign this SVG as an object to svg
        var svg = d3.select(this.containerElement).append("svg")
            .attr("width", width)
            .attr("height", height);


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
            .attr("refX", 25)
            .attr("refY", -2)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        var link = svg.append("g").selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr("class", function(d) {
                return "link";
            })
            .attr("marker-end", function(d) {
                return "url(#arrow)";
            });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);
        node.append("circle")
            .attr("r", 25)
            .on('dblclick', function(d) {
                alert(JSON.stringify(d));
            });

        node.append("text")
            .attr("dx", 0)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.name
            });

        //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
        force.on("tick", function() {
            link
            // .attr("x1", function(d) {
            //        return d.source.x;
            //    })
            //    .attr("y1", function(d) {
            //        return d.source.y;
            //    })
            //    .attr("x2", function(d) {
            //        return d.target.x;
            //    })
            //    .attr("y2", function(d) {
            //        return d.target.y;
            //    })
                .attr("d", linkArc);
            d3.selectAll("circle").attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
            d3.selectAll("text").attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y;
                });
        });

        //       path.attr("d", linkArc);
        // circle.attr("transform", transform);
        // text.attr("transform", transform);

        function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
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
    addState: function(state) {
        if (arguments.length === 1) {
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
    addTransition: function(transition) {
        if (arguments.length === 1) {
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

// function linkArc(d) {
//     var dx = d.target.x - d.source.x,
//         dy = d.target.y - d.source.y,
//         dr = Math.sqrt(dx * dx + dy * dy);
//     return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
// }

// function transform(d) {
//     return "translate(" + d.x + "," + d.y + ")";
// }


// function FSMState(label) {
//     this.id = "N" + label;
//     this.label = label;
//     this.name = label;
//     this.type = "suit";
// }

// function FSMTransition(label, source, target) {
//     this.id = ["T", label, source, target].join("-");
//     this.label = label;
//     this.source = (source[0] === "N") ? source : "N" + source;
//     this.target = (target[0] === "N") ? target : "N" + target;
//     this.type = "suit";
// }
