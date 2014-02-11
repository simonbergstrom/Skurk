function SteamGraph(){

	var self = this; // for internal d3 functions

	var padding = -15; // pad the plot on the Y-Axis... 

    var steamGraphDiv = $("#steamGraph");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = steamGraphDiv.width() - margin.right - margin.left,
        height = steamGraphDiv.height() - margin.top - margin.bottom;
   

	var n = 20, // number of layers
    m = 200, // number of samples per layer
    stack = d3.layout.stack().offset("wiggle"),
    layers0 = stack(d3.range(n).map(function() { return bumpLayer(m); })),
    layers1 = stack(d3.range(n).map(function() { return bumpLayer(m); }));

	var x = d3.scale.linear()
	    .domain([0, m - 1])
	    .range([0, width]);

	var y = d3.scale.linear()
	    .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y + Math.abs(padding) ; }); })])
	    .range([height, 0]);

	//var color = d3.scale.linear()
	//    .range(["#aad", "#556"]);

	var color = d3.scale.category20b();

	 // Create the axis..
	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");



    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    yAxis.tickFormat("");

	var area = d3.svg.area()
	    .x(function(d) { return x(d.x); })
	    .y0(function(d) { return y(d.y0); })
	    .y1(function(d) { return y(d.y0 + d.y); });

	var svg = d3.select("#steamGraph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height+ margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + (-10) + ")");

    // Add x axis and title.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6).text("Years").attr("transform","translate(-20,25)");
        
    // Add y axis and title.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em").text("Number of lines?").attr("transform","translate(10,10)");    
 
	svg.selectAll("path")
	    .data(layers0)
	  .enter().append("path")
	    .attr("d", area)
	    .attr("transform", "translate(0," + padding + ")")
	    .style("fill", function() { return color(Math.random()); });

	//function transition() {
	  //d3.selectAll("path")
	    //  .data(function() {
	      //  var d = layers1;
	        //layers1 = layers0;
	       // return layers0 = d;
	     // })
	   // .transition()
	    //  .duration(2500)
	    //  .attr("d", area); 
	//}

	// Inspired by Lee Byron's test data generator.
	function bumpLayer(n) {

	  function bump(a) {
	    var x = 1 / (.1 + Math.random()),
	        y = 2 * Math.random() - .5,
	        z = 10 / (.1 + Math.random());
	    for (var i = 0; i < n; i++) {
	      var w = (i / n - y) * z;
	      a[i] += x * Math.exp(-w * w);
	    }
	  }
	  var a = [], i;
	  for (i = 0; i < n; ++i) a[i] = 0;
	  for (i = 0; i < 5; ++i) bump(a);
	  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
	}
}
