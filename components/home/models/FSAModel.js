app.service('FSAModel', function() {

    function FSAModel(container, height, width, nodes, links) {

        this.container = d3.select(container).append("svg").attr("width", width).attr("height", height);
        this.nodes = nodes;
        this.links = links;


        this.colors = {
            default: '#FFCC00',
            selected: 'FFB300'
        }


        this.initialize = function() {

        }

        this.addNode = function(label, $event) {
            
            console.log(this.colors.default);

            this.container.append("circle")
            	.attr("id", label)
            	.attr("fill", this.colors.default)
                .attr("transform", "translate(" + $event.layerX + "," + $event.layerY + ")")
                .attr("r", "30")
                .style("cursor", "pointer");

        }

        this.printNodes = function() {
            console.log(this.nodes);
        }

        this.printLinks = function() {
            console.log(this.links);
        }

    }



    function dragmove(d) {
        var x = d3.event.x;
        var y = d3.event.y;
        d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
    }

    return FSAModel;

});
