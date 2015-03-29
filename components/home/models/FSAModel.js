app.service('FSAModel', function(Map) {

    function FSAModel(container, height, width, nodes, links) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.height = height;
        this.width = width;
        this.nodes = new Map();
        this.links = links;

        this.addInitialNodes(nodes);
    }

    FSAModel.prototype = {
        /**
         * Validate the passed label;
         * Create a node object with the label and coordinates;
         * Add the object to the nodes map;
         * Create, append svgNode as a container for the circle and the label;
         * Create, append the circle;
         * Create, append the label
         */
        addNode: function(label, x, y) {
            //validate based on the label
            if (label.length === 0 || label.length > 3 || this.nodes.find(label) !== false) return false;
            var node = {
                id: label,
                x: x,
                y: y
            };
            this.nodes.put(node.id, node);
            //create the container element and define drag behavior
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + node.x + "," + node.y + ")")
                .attr("class", "node")
                .attr("id", label)
                .call(d3.behavior.drag().on("drag", dragMove));
            //create and append the node to the container element
            var circle = svgNode.append("circle")
                .attr("r", "20");
            //create and append the label to the container element
            var label = svgNode.append("text")
                .text(label)
                .attr("class", "node-label")
                .attr("dx", -5 * label.length)
                .attr("dy", 5)
                .style("cursor", "pointer");
        },
        /**
         * nodes: list of character labels;
         * iterate over the list;
         * calculate x and y coordinates for a 4 * n/4 grid;
         * call addNode() to add the nodes
         */
        addInitialNodes: function(nodes) {
            var i, x, y;
            for (i = 0; i < nodes.length; i++) {
                x = (this.width / 4) * (i * 1.0 % 4) + 50;
                y = (this.height / 4) * Math.floor(i / 4) + 50;
                this.addNode(nodes[i], x, y);
            }
        },
        selectNode: function(node) {
            this.toggleNodeProperty(node, "circle", "selected");
        },
        deleteSelected: function() {
            var nodes = this.nodes.contents;
            for (var n in nodes) {
                if (nodes[n].selected) {
                    d3.select("#" + nodes[n].id).remove();
                    this.nodes.remove(nodes[n].id);
                }
            }
        },
        setAcceptNodes: function() {
            var nodes = this.nodes.contents,
                node;
            for (var n in nodes) {
                if (nodes[n].selected) {
                    node = d3.select("#" + nodes[n].id);
                    this.toggleNodeProperty(node[0][0], "circle", "accept");
                }
            }
        },
        setStartNode: function() {},
        /**
         * Generic function for toggling a true/false property
         * for a node, its css class, and in its object.
         */
        toggleNodeProperty: function(node, element, property) {
            var svgNode = d3.select(node),
                svgElement = d3.select(node).select(element),
                id = svgNode.attr("id"),
                nodeObj = this.nodes.find(id);
            if (nodeObj[property]) {
                svgNode.classed(property, false);
                nodeObj[property] = false;
            } else {
                svgNode.classed(property, true);
                nodeObj[property] = true;
            }
            this.nodes.put(nodeObj.id, nodeObj);
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
