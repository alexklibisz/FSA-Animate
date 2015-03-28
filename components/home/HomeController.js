app.controller('HomeController',
    function($scope, $location, FSAModel) {

        $scope.NFA = new FSAModel("#NFA", [], []);
        $scope.DFA = new FSAModel("#DFA", [], []);


        $scope.keyPressed = null;

        // Initialization
        $scope.onClickResult = "";
        $scope.onKeyDownResult = "";
        $scope.onKeyUpResult = "";

        // Utility functions
        var getKeyboardEventResult = function(keyEvent, keyEventDesc) {
            return keyEventDesc + " (keyCode: " + (window.event ? keyEvent.keyCode : keyEvent.which) + ")";
        };

        $scope.onClick = function($event) {
            console.log("click", $event);
            if ($event.shiftKey) {
                alert("create new node");
            }
        }

        $scope.onKeyDown = function($event) {
            console.log("key down", $event);
            $scope.keyPressed = window.event ? $event.keyCode : $event.which;
        };

        $scope.onBlur = function() {
            $scope.keyPressed = null;
        }


        $scope.drawSimpleNFA = function() {
            var width = 610,
                height = 310;

            $scope.container = d3.select("#NFA").append("svg").attr("width", width).attr("height", height);
            container = $scope.container;

            var circleData = [{
                "id": 0,
                "cx": 200,
                "cy": 200,
                "radius": 20,
                "color": "#FFCC00"
            }, {
                "id": 1,
                "cx": 60,
                "cy": 60,
                "radius": 20,
                "color": "#FFCC00"
            }];

            var circles = container.selectAll("circle")
                .data(circleData)
                .enter()
                .append("circle");

            var drag = d3.behavior.drag()
                .on("drag", dragmove);

            var circleAttributes = circles
                // .attr("cx", function(d) {
                //     return d.cx;
                // })
                // .attr("cy", function(d) {
                //     return d.cy;
                // })
                .attr("r", function(d) {
                    return d.radius;
                })
                .style("fill", function(d) {
                    return d.color;
                })
                .attr("transform", function(d) {
                    return "translate(" + d.cx + "," + d.cy + ")"
                })
                .call(drag);

            //Add the SVG Text Element to the svgContainer
            var text = container.selectAll("text")
                .data(circleData)
                .enter()
                .append("text");

            //Add SVG Text Element Attributes
            var textLabels = text
                .attr("x", function(d) {
                    return d.cx - 2;
                })
                .attr("y", function(d) {
                    return d.cy;
                })
                .text(function(d) {
                    return d.id;
                })
                .call(drag);
        }

        function dragmove(d) {
            var x = d3.event.x;
            var y = d3.event.y;
            d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
        }

        function randomColor() {
            var colors = ['#003399', '#6699FF', '#FFFFFF', '#3366CC', '#FF9966', '#FF9900', '#FFCC00'];
            var index = Math.floor((Math.random() * colors.length));
            console.log(colors[index]);
            return colors[index];
        }

        $scope.createInteractiveNFA = function() {
            // set up SVG for D3
            var width = 960,
                height = 500,
                colors = d3.scale.category10();

            var svg = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // set up initial nodes and links
            //  - nodes are known by 'id', not by index in array.
            //  - reflexive edges are indicated on the node (as a bold black circle).
            //  - links are always source < target; edge directions are set by 'left' and 'right'.
            var nodes = [{
                    id: 0,
                    reflexive: false
                }, {
                    id: 1,
                    reflexive: true
                }, {
                    id: 2,
                    reflexive: false
                }],
                lastNodeId = 2,
                links = [{
                    source: nodes[0],
                    target: nodes[1],
                    left: false,
                    right: true
                }, {
                    source: nodes[1],
                    target: nodes[2],
                    left: false,
                    right: true
                }];

            // init D3 force layout
            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([width, height])
                .linkDistance(150)
                .charge(-500)
                .on('tick', tick)

            // define arrow markers for graph links
            svg.append('svg:defs').append('svg:marker')
                .attr('id', 'end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 6)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#000');

            svg.append('svg:defs').append('svg:marker')
                .attr('id', 'start-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 4)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M10,-5L0,0L10,5')
                .attr('fill', '#000');

            // line displayed when dragging new nodes
            var drag_line = svg.append('svg:path')
                .attr('class', 'link dragline hidden')
                .attr('d', 'M0,0L0,0');

            // handles to link and node element groups
            var path = svg.append('svg:g').selectAll('path'),
                circle = svg.append('svg:g').selectAll('g');

            // mouse event vars
            var selected_node = null,
                selected_link = null,
                mousedown_link = null,
                mousedown_node = null,
                mouseup_node = null;

            function resetMouseVars() {
                mousedown_node = null;
                mouseup_node = null;
                mousedown_link = null;
            }

            // update force layout (called automatically each iteration)
            function tick() {
                // draw directed edges with proper padding from node centers
                path.attr('d', function(d) {
                    var deltaX = d.target.x - d.source.x,
                        deltaY = d.target.y - d.source.y,
                        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                        normX = deltaX / dist,
                        normY = deltaY / dist,
                        sourcePadding = d.left ? 17 : 12,
                        targetPadding = d.right ? 17 : 12,
                        sourceX = d.source.x + (sourcePadding * normX),
                        sourceY = d.source.y + (sourcePadding * normY),
                        targetX = d.target.x - (targetPadding * normX),
                        targetY = d.target.y - (targetPadding * normY);
                    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
                });

                circle.attr('transform', function(d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });
            }
        }

        $scope.createNFA = function() {
            console.log("create NFA called");
            var width = 600,
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
