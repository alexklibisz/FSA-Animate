app.service('FSAModel', function() {

    function FSAModel(container, height, width, nodes, links) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.nodes = nodes;
        this.links = links;


        var colors = {
            default: '#FFCC00',
            selected: 'FFB300'
        }

        var behavior = {
            drag: d3.behavior.drag().on("drag", dragmove)
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
                .call(behavior.drag);
            //create and append the node to the container element
            var circle = svgNode.append("circle")
                .attr("id", node.id)
                .attr("fill", colors.default)
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("r", "20")
                .style("cursor", "pointer");
            //create and append the label to the container element
            var label = svgNode.append("text")
                .text(label)
                .attr("class", "node-label")
                .attr("dx", -5 * label.length)
                .attr("dy", 4)
                .style("cursor", "pointer");

        }

        this.printNodes = function() {
            console.log(this.nodes);
        }

        this.printLinks = function() {
            console.log(this.links);
        }

        function dragmove(d) {
             var x = d3.event.x;
             var y = d3.event.y;
             d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
        }

    }



    function dragmove(d) {
        var x = d3.event.x;
        var y = d3.event.y;
        d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
    }

    return FSAModel;

});
