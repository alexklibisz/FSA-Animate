app.service('FSAModel', function(Map) {

	function FSAModel(container, height, width, nodes, links) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.nodes = new Map();
        this.links = links;
        this.selectedNodes = [];

        var behavior = {
            node: d3.behavior.drag().on("drag", dragmove)
        }

        this.initialize = function() {
    
        }

        this.addNode = function(label, $event) {

            var node = {
                id: label,
                x: $event.layerX,
                y: $event.layerY,
                selected: false
            };

            this.nodes.put(node.id, node);

            console.log(this.nodes.contents);

            //create the container element
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + node.x + "," + node.y + ")")
                .attr("class", "node")
                .attr("id", label)
                .call(behavior.node);
            // .on("dblclick", this.selectNode);
            //create and append the node to the container element
            var circle = svgNode.append("circle")
                //.attr("id", node.id)
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("r", "20")
                .style("cursor", "pointer");
            //create and append the label to the container element
            var label = svgNode.append("text")
                .text(label)
                .attr("class", "node-label")
                .attr("dx", -5 * label.length)
                .attr("dy", 5)
                .style("cursor", "pointer");

        }

        this.printNodes = function() {
            console.log(this.nodes);
        }

        this.printLinks = function() {
            console.log(this.links);
        }

        this.selectNode = function(element) {
            var svgNode = d3.select(element),
                circle = d3.select(element).select("circle"),
                id = svgNode.attr("id"),
                node = this.nodes.find(id);

            if(node.selected) {
            	circle.attr("class", "");
            	node.selected = false;
            } else {
            	circle.attr("class", "selected");
            	node.selected = true;
            }

            this.nodes.put(node.id, node);

        }

        function dragmove(d) {
            var x = d3.event.x;
            var y = d3.event.y;
            d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
        }

    }

    return FSAModel;

});
