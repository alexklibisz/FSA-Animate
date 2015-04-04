/**
 * ForceFSM.js -- a visual, interactive finite state machine 
 * implemented using the d3.js force layout.
 *
 * Alex Klibisz -- 4/4/15
 */

function ForceFSM(container, height, width, alphabet, startState, acceptStates) {
    this.svgContainer = container;
    this.height = height;
    this.width = width;
    this.states = new Map();
    this.transitions = new Map();
    this.alphabet = alphabet;
    this.startState = startState;
    this.acceptStates = acceptStates;

    function customTick() {
        console.log("tick");
        this.svgPaths.attr("d", linkArc);
        this.svgCircles.attr("transform", transform);
        this.svgTexts.attr("transform", transform);
    }

    function customStart() {
        var ticksPerRender = 300;
        requestAnimationFrame(function render() {
            for (var i = 0; i < ticksPerRender; i++) {
                this.force.tick();
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
    }

}

ForceFSM.prototype = {
    /**
     * setup the container and append all defs.
     * called from the constructor.
     */
    start: function() {

        var links = [{
            source: "1",
            target: "3"
        }, {
            source: "3",
            target: "1",
            type: "suit"
        }, {
            source: "2",
            target: "3",
            type: "suit"
        }, {
            source: "2",
            target: "2",
            type: "suit"
        }, {
            source: "1",
            target: "2",
            type: "suit"
        }];

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {
                name: link.source
            });
            link.target = nodes[link.target] || (nodes[link.target] = {
                name: link.target
            });
        });

        this.states = null;
        this.states = nodes;
        this.transitions = null;
        this.transitions = links;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([this.width, this.height])
            .linkDistance(180)
            .charge(-500)
            .on("tick", this.customTick)
            .on("start", this.customStart)
            .start();

        var svg = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        // Per-type markers, as they don't inherit styles.
        svg.append("defs").selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter().append("marker")
            .attr("id", function(d) {
                return d;
            })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 30)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) {
                return "link " + d.type;
            })
            .attr("marker-end", function(d) {
                return "url(#" + d.type + ")";
            });

        var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", 20)
            .call(force.drag);

        var text = svg.append("g").selectAll("text")
            .data(force.nodes())
            .enter().append("text")
            .attr("x", 0)
            .attr("y", ".31em")
            .text(function(d) {
                return d.name;
            });

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

function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}


function FSMState(label) {
    this.id = "N" + label;
    this.label = label;
    this.name = label;
    this.type = "suit";
}

function FSMTransition(label, source, target) {
    this.id = ["T", label, source, target].join("-");
    this.label = label;
    this.source = (source[0] === "N") ? source : "N" + source;
    this.target = (target[0] === "N") ? target : "N" + target;
    this.type = "suit";
}
