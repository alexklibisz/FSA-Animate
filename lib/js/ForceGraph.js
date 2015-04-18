function ForceGraph(element, width, height) {

    /**
     * publicly accessible settings
     */
    this.nodeRadius = ((width + height) / 2) * .04,
        this.forceDistance = ((width + height) / 2) / 2,
        this.forceCharge = this.forceDistance * -3,
        this.forceRenderSpeed = 100,
        this.forceLinkStrength = 0.75,
        this.forceOptimize = false,
        this.arrows = true;

    var parent = this;

    var svg = this.vis = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "ForceGraph");

    var force = d3.layout.force()
        .linkDistance(linkDistance)
        .charge(this.forceCharge)
        .linkStrength(1)
        .size([width, height]);

    function linkDistance(d) {
//        console.log(JSON.stringify(d));
        return 180;
    }

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

    this.getNodes = function() {
        return nodes;
    }

    this.getLinks = function() {
        return links;
    }

    this.update = function() {
        /**
         * Select all links (groups with class 'link')
         */
        var link = svg.selectAll("g.link")
            .data(links, function(d) {
                return d.source.id + "-" + d.target.id;
            });

        /**
         * Add a group for all new links.
         */
        var linkEnter = link.enter().insert("g", ".node")
            .attr("class", "link");

        /**
         * Add a path to every link group.
         */
        var linkPath = linkEnter.append("path")
            .attr("id", function(d) {
                return d.elementId;
            })
            .attr("class", "link");
        if (this.arrows) linkPath.attr("marker-end", "url(#arrow)");

        /**
         * Add a text element to every link group.
         */
        var linkText = linkEnter.append("text")
            .attr("class", "link")
            .attr("x", 6)
            .attr("dy", -12);

        /**
         * Add a textPath element with the link id to the text element in
         * every link group.
         */
        var linkTextPath = linkText.append("textPath")
            .attr("startOffset", "50%")
            .attr("xlink:href", function(d) {
                return "#" + d.elementId;
            })
            .text(function(d) {
                return d.label;
            });

        link.exit().remove();

        /**
         * Select all nodes (groups with class 'node')
         */
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;
            });

        /**
         * Append a group for all new nodes.
         */
        var nodeEnter = node.enter().append("g")
            .attr("id", function(d) {
                return "N" + d.id;
            })
            .attr("class", "node")
            .on('dblclick', function(d) {
                select(d);
            })
            .call(force.drag);

        /**
         * Append a circle to every node group.
         */
        nodeEnter.append("circle")
            .attr("class", "node")
            .attr("r", function(d) {
                return d.radius;
            });

        /**
         * Append the node id as text to every node.
         */
        nodeEnter.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.label
            });

        /** 
         * Remove any deleted nodes.
         */
        node.exit().remove();

        /**
         * Optimize the graph
         */
        if (this.forceOptimize) {
            if (nodes.length > 3) force.distance(((width + height) / 2) / nodes.length);
        }

        force.on("tick", function tick() {
            d3.selectAll("text.link").attr("rotate", function textTransform(d) {
                if (d.source.x - d.target.x > 50) return 180;
                return 0;
            })
            d3.selectAll("g.node").attr("transform", function nodeTransform(d) {
                if (d.fixedPosition !== null) {
                    d.x = d.fixedPosition.x;
                    d.y = d.fixedPosition.y;
                }
                return "translate(" + d.x + "," + d.y + ")";
            });
            d3.selectAll("path.link").attr("d", linkArc);
        })

        force.on("start", function start() {
            requestAnimationFrame(function render() {
                for (var i = 0; i < parent.forceRenderSpeed; i++) {
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
    this.addNode = function(label, x, y) {
        if (label === undefined || label === null) return;

        var node = {
            "id": generateNodeId(label),
            "label": label,
            "elementId": "N" + generateNodeId(label),
            "selected": false,
            "radius": this.nodeRadius
        };

        if (x !== undefined && y !== undefined) {
            this.setNodeProperty(node.id, "fixedPosition", {
                "x": x,
                "y": y
            });
        } else {
            node["fixedPosition"] = null;
        }

        nodes.push(node);
        this.update();
    }

    this.removeNode = function(label) {
        if (label === undefined || label === null) return;
        var i = 0,
            n = findNode('label', label);

        // remove all links that have this node as their source OR target
        this.removeLink(n, null);
        this.removeLink(null, n);

        var index = findNodeIndex(n.id);
        if (index !== undefined) {
            nodes.splice(index, 1);
            this.update();
        }
    }

    this.addLink = function(label, sourceLabel, targetLabel) {
        var sourceNode = findNode('label', sourceLabel),
            targetNode = findNode('label', targetLabel);

        if ((sourceNode === undefined) || (targetNode === undefined)) return;

        var existingLink = findLink(sourceNode.id, targetNode.id);
        if (existingLink !== null && existingLink.label.indexOf(label) === -1) {
            this.removeLink(existingLink.source, existingLink.target);
            var newLabel = existingLink.label + ',' + label;
            this.addLink(newLabel, existingLink.source.label, existingLink.target.label);
        } else {
            links.push({
                "id": generateLinkId(sourceNode.id, targetNode.id),
                "label": label.split(',').sort().join(','),
                "elementId": 'L' + generateLinkId(sourceNode.id, targetNode.id),
                "source": sourceNode,
                "target": targetNode
            });
        }
        this.update();
    }

    /**
     * source and target can be the source and target objects, or the
     * source and target id's.
     *
     */
    this.removeLink = function(source, target) {
        var i = 0,
            truth;

        if (source === null || target === null) truth = 1;
        else truth = 2;

        // also accept the source and target id
        if (typeof(source) !== 'object') source = findNode('id', source);
        if (typeof(target) !== 'object') target = findNode('id', target);

        while (i < links.length) {
            if ((links[i]['source'] === source) + (links[i]['target'] === target) === truth) links.splice(i, 1);
            else i++;
        }
        this.update();
    }

    /**
     * removes all nodes
     */
    this.reset = function() {
        var i, ids = []
        for (i = 0; i < nodes.length; i++) {
            ids.push(nodes[i].id);
        }
        for (i = 0; i < ids.length; i++) {
            this.removeNode(ids[i]);
        }
    }

    this.toggleClass = function(selector, newClass, all) {
        var elements;
        if (all) {
            elements = d3.selectAll(selector);
        } else {
            elements = d3.select(selector);
        }

        elements.classed(newClass, !elements.classed(newClass));
    }

    this.setNodeProperty = function(id, property, value) {
        var n = findNode(id);
        n[property] = value;
    }

    this.setLinkProperty = function(sourceId, targetId, property, value) {
        var l = findLink(sourceId, targetId);
        l[property] = value;
    }

    var generateNodeId = function(label) {
        return label.replace(/\s/g, '').split(',').sort().join(',');
    }

    var generateLinkId = function(sourceId, targetId) {
        return [sourceId, targetId].join('-');
    }

    var select = function(d) {
        d.selected = !d.selected;
        d3.select("#" + d.elementId).classed("selected", d.selected);
    }

    var findNode = function(property, value) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i][property] === value) return nodes[i];
        }
        return null;
    }

    var findNodeIndex = function(id) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) return i;
        }
    }

    var findLink = function(sourceId, targetId) {
        for (var i = 0; i < links.length; i++) {
            if (links[i].source.id === sourceId &&
                links[i].target.id === targetId) return links[i];
        }
        return null;
    }

    var findLinkIndex = function(id) {
        for (var i = 0; i < links.length; i++) {
            if (links[i].id === id) return i;
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
