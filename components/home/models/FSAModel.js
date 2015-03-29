app.service('FSAModel', function(Map) {

    function FSAModel(container, height, width, nodes, links) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.nodes = new Map();
        this.links = links;
        this.selectedNodes = [];
        this.keyCode = -1;

        var behavior = {
            node: d3.behavior.drag().on("drag", dragMove).on("dragstart", this.dragStart)
        }

        this.initialize = function() {}

        this.addNode = function(label, x, y) {

            //validate based on the label
            if (label.length === 0 || label.length > 3 || this.nodes.find(label) !== false) return false;

            var node = {
                id: label,
                x: x,
                y: y,
                selected: false
            };

            this.nodes.put(node.id, node);

            //create the container element
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + node.x + "," + node.y + ")")
                .attr("class", "node")
                .attr("id", label)
                .call(behavior.node);
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
        }

        /**
         * Generic function for toggling a true/false property
         * for a node, its css class, and in its object.
         */
        this.toggleNodeProperty = function(node, element, property) {
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
        }

        this.selectNode = function(node) {
            this.toggleNodeProperty(node, "circle", "selected");
        }

        this.deleteSelected = function() {
            var nodes = this.nodes.contents;
            for (var n in nodes) {
                if (nodes[n].selected) {
                    d3.select("#" + nodes[n].id).remove();
                    this.nodes.remove(nodes[n].id);
                }
            }
        }

        this.acceptSelected = function() {
            var nodes = this.nodes.contents,
                node;
            for (var n in nodes) {
                if (nodes[n].selected) {
                    node = d3.select("#" + nodes[n].id);
                    this.toggleNodeProperty(node[0][0], "circle", "accept");
                }
            }
        }

        this.setStartNode = function(element) {}

        this.dragStart = function(d) {}

        function dragMove(d) {
            // Prevent drag if shift key pressed
            if (!d3.event.sourceEvent.shiftKey) {
                var x = d3.event.x;
                var y = d3.event.y;
                d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
            }
        }

    }

    return FSAModel;

});
