app.service('FSAModel', function() {

	function FSAModel(container, nodes, links) {
        var singletonTest = container;

        this.container = container;
        this.nodes = nodes;
        this.links = links;
        
        this.printNodes = function() {
            console.log(this.nodes);
        }

        this.printLinks = function() {
            console.log(this.links);
        }

        this.test = function() {
        	console.log(singletonTest);
        }
    }

    return FSAModel;

});