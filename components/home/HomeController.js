app.controller('HomeController',
    function($scope, $location) {

        $scope.createNFA = function() {
            console.log("create NFA called");
            var width = 450,
                height = 310;

            var svg = d3.select('#NFA').append('svg')
                .attr('width', width)
                .attr('height', height);

            var graph = {
                "nodes": [{
                    "x": 100,
                    "y": 300
                }, {
                    "x": 300,
                    "y": 300
                }, {
                    "x": 200,
                    "y": 100
                }],
                "links": [{
                    "target": 1,
                    "source": 0
                }, {
                    "target": 2,
                    "source": 1
                }, {
                    "target": 0,
                    "source": 2
                }]
            };


            // Extract the nodes and links from the data.
            var nodes = graph.nodes,
                links = graph.links;

            //Initialize the force layout.
            var force = d3.layout.force()
                .size([width, height])
                .nodes(nodes)
                .links(links);

            //Define linkDistance
            force.linkDistance(width / 3.05);

            //Next we'll add the nodes and links to the visualization.
            //Links first so that nodes are on top of them. 
            var link = svg.selectAll('.link')
                .data(links)
                .enter().append('line')
                .attr('class', 'link');

            // Now it's the nodes turn. Each node is drawn as a circle.
            var node = svg.selectAll('.node')
                .data(nodes)
                .enter().append('circle')
                .attr('class', 'node');

            // We're about to tell the force layout to start its
            // calculations. We do, however, want to know when those
            // calculations are complete, so before we kick things off
            // we'll define a function that we want the layout to call
            // once the calculations are done.
            force.on('end', function() {

                //Reposition the nodes.
                node.attr('r', width / 45)
                    .attr('cx', function(d) {
                        return d.x;
                    })
                    .attr('cy', function(d) {
                        return d.y;
                    });

                //Reposition the links
                link.attr('x1', function(d) {
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

            });

            force.start();
            console.log("create NFA complete");
        }

    });
