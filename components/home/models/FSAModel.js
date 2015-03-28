app.service('FSAModel', function() {

    function FSAModel(container, height, width, nodes, links) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.nodes = nodes;
        this.links = links;
        this.selectedNode = -1;

        var behavior = {
            node: d3.behavior.drag().on("drag", dragmove)
        }

        this.initialize = function() {

        }

        this.addNode = function(label, $event) {

            var node = {
                id: label,
                x: $event.layerX,
                y: $event.layerY
            };

            this.nodes.push(node);

            //create the container element
            var svgNode = this.container.append("g")
                .attr("transform", "translate(" + node.x + "," + node.y + ")")
                .attr("class", "node")
                .call(behavior.node)
                .on("dblclick", selectNode);
            //create and append the node to the container element
            var circle = svgNode.append("circle")
                .attr("id", node.id)
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

        selectNode = function(d) {
        	var node = d3.select(this).select("circle");
        	var id = node.attr("id");
        	console.log("selectedNode", this.selectedNode);
        	console.log("id", id);
        	if(this.selectedNode !== id) {
        		node.attr("class", "selected");
        		this.selectedNode = id;	
        	} else {
        		node.attr("class", "node");
        		this.selectedNode = -1;
        	}
        	
        	console.log(node.attr("id"));
        }

        function dragmove(d) {
            var x = d3.event.x;
            var y = d3.event.y;
            d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
        }

    }

    return FSAModel;

});
