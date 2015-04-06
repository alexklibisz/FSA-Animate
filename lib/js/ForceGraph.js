function ForceGraph(element, width, height) {

    this.nodeRadius = ((width + height) / 2) * .05,
        this.nodeDistance = ((width + height) / 2) / 3,
        this.forceCharge = this.nodeDistance * -5,
        this.renderSpeed = 100;

    var parent = this;

    var svg = this.vis = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "ForceGraph");

    var force = d3.layout.force()
        .distance(this.nodeDistance)
        .charge(this.forceCharge)
        .size([width, height]);

    var nodes = force.nodes(),
        links = force.links();

    //Append the svg defs - used for arrows
    var defs = svg.append("defs").selectAll("marker")
        .data(["arrow"])
        .enter().append("marker")
        .attr("id", function(d) {
            return d;
        })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-3L6,0L0,3");

    this.update = function() {

        var link = svg.selectAll("g.link")
            .data(links, function(d) {
                return d.source.id + "-" + d.target.id;
            });

        //http://goo.gl/6MzVvv
        var linkEnter = link.enter().insert("g", ".node")
            .attr("id", function(d) {
                return d.elementId;
            })
            .attr("class", "link");

        var linkPath = linkEnter.append("path")
            .attr("id", function(d) {
                return ["link", d.source.id, d.target.id].join("-");
            })
            .attr("class", "link")
            .attr("marker-end", "url(#arrow)");

        var linkText = linkEnter.append("text")
            .attr("x", 6)
            .attr("dy", -12);

        var linkTextPath = linkText.append("textPath")
            .attr("startOffset", "50%")
            .attr("xlink:href", function(d) {
                return ["#link", d.source.id, d.target.id].join("-");
            })
            .text(function(d) {
                return d.id;
            });

        link.exit().remove();

        var node = svg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;
            });

        var nodeEnter = node.enter().append("g")
            .attr("id", function(d) {
                return "N" + d.id;
            })
            .attr("class", "node")
            .on('dblclick', function(d) {
                select(d);
            })
            .call(force.drag);

        nodeEnter.append("circle")
            .attr("class", "node")
            .attr("r", function(d) {
                return d.radius;
            });

        nodeEnter.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.id
            });

        node.exit().remove();

        force.on("tick", function() {
            d3.selectAll("path.link").attr("d", linkArc);
            d3.selectAll("g.node").attr("transform", function(d) {
                if (d.id === "start") {
                    d.x = d.radius + 10;
                    d.y = height / 4;
                }
                return "translate(" + d.x + "," + d.y + ")";
            });
        })

        force.on("start", function() {
            requestAnimationFrame(function render() {
                for (var i = 0; i < parent.renderSpeed; i++) {
                    force.tick();
                }
                if (force.alpha() > 0) {
                    requestAnimationFrame(render);
                }
            })
        });

        //Restart the force layout.
        force.start();
    }

    //Add and remove elements on the graph object
    this.addNode = function(id) {
        if (id === undefined || id === null) return;
        id = id.replace(/\s/g, '').split(',').sort().join(',');
        nodes.push({
            "id": id,
            "elementId": "N" + id,
            "selected": false,
            "radius": this.nodeRadius
        });
        this.update();
    }

    this.removeNode = function(id) {
        if (id === undefined || id === null) return;
        var i = 0,
            n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] === n) || (links[i]['target'] == n)) links.splice(i, 1);
            else i++;
        }
        var index = findNodeIndex(id);
        if (index !== undefined) {
            nodes.splice(index, 1);
            this.update();
        }
    }

    this.addLink = function(id, sourceId, targetId) {
        id = id.replace(/\s/g, '').split(',').sort().join(',');
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);

        if ((sourceNode !== undefined) && (targetNode !== undefined)) {
            links.push({
                "id": id,
                "elementId": "L" + id,
                "source": sourceNode,
                "target": targetNode
            });
            this.update();
        }
    }

    var select = function(d) {
        d.selected = !d.selected;
        d3.select("#" + d.elementId).classed("selected", d.selected);
    }

    var findNode = function(id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return nodes[i];
        }
    }

    var findNodeIndex = function(id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return i;
        }
    }

    var linkArc = function(d) {
        //http://stackoverflow.com/questions/16660193/get-arrowheads-to-point-at-outer-edge-of-node-in-d3
        //http://jsfiddle.net/LUrKR/
        var x1 = d.source.x,
            y1 = d.source.y,
            x2 = d.target.x,
            y2 = d.target.y,
            dx = x2 - x1,
            dy = y2 - y1,
            dr = Math.sqrt((dx * dx) + (dy * dy)),
            drx = dr,
            dry = dr,
            xRotation = 0, // degrees
            largeArc = 0, // 1 or 0
            sweep = 1, // 1 or 0
            nodeRadius = d.target.radius;
        // Self edge.
        if (x1 === x2 && y1 === y2) {
            dr = 1;
            xRotation = 65; // Fiddle with this angle to get loop oriented.
            largeArc = 1; // Needs to be 1.
            drx = nodeRadius + 10; // Make drx and dry different to get an ellipse instead of a circle
            dry = nodeRadius; // Beginning and end points must be differnet.
            x1 -= 5;
        }
        // x and y distances from center to outside edge of target node
        var offsetX = (dx * nodeRadius) / dr,
            offsetY = (dy * nodeRadius) / dr;
        // Put it all together to define the path
        return "M" + (x1) + "," + (y1) + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + (x2 - offsetX) + "," + (y2 - offsetY);
    }
}
