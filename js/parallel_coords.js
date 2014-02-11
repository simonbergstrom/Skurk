function ParallelCoords()
{

	//Some initial stuff needed for parallel Coordinates.

	var self = this; // for internal d3 functions

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var pcDiv = $("#parallelCoords");

    var margin = [20, -90, 100, -50],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#parallelCoords").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //Load the data

    d3.csv("data/testdata.csv", function(data) {
        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
            return (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function(p) { return +p[d]; }))
        
                //assign the the axis scale  between [0 1]
                //...
        
                .range([height, 0])
                ); 
        }));
        
        self.data = data;
        
        draw();
    });

    function draw(){
        
        var color = d3.scale.category10();

        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            .data(self.data)
            .enter().append("svg:path")
            .attr("d", path);
                
        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(self.data)
            .enter().append("svg:path")
            .attr("d", path)
            .style("stroke", function(d) { return "hsl(" + Math.random() * 360 + ",100%,50%)"; })
            .on("mousemove", function(d) {
                //...
               tooltip.transition()
               .duration(200)
               .style("opacity", .9);
                tooltip.html("Test")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");


            })
            .on("mouseout", function(d) {
                //...
                tooltip.transition()
               .duration(500)
               .style("opacity", 0);
                 
            }); 
            //.style("stroke", function(d,i){ return color(kmeansRes[i])});
            //Assign the cluster colors
            //..
    

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            

        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }
}

