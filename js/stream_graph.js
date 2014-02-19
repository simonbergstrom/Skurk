function StreamGraph(){

	var self = this; // for internal d3 functions

	var x,y;

	var padding = -30; // pad the plot on the Y-Axis... 

    var streamGraphDiv = $("#streamGraph");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = streamGraphDiv.width() - margin.right - margin.left,
        height = streamGraphDiv.height() - margin.top - margin.bottom;
   
	var n = 9, // number of layers
    m = 12; // number of samples per layer
    stack = d3.layout.stack().offset("wiggle"),
    layers0 = stack(d3.range(n).map(function() { return bumpLayer(m); }));
    //layers1 = stack(d3.range(n).map(function() { return bumpLayer(m); }));
  


    /********* Ladda in data **********/
	d3.json("data/crime_monthly_municipatalities_2013.json", function(json) {

		self.data = json;

	    var crimeDataJson = [];

	    n = 9; // Antal brottskategorier 
	    m = 12; // Antal månader....

	    //console.log(json["Borås"]["Våldsbrott"]);
	    //console.log(json["Hela landet"]);

	    var crimeDataJsonStream = layering(json);
	    /*
	    n = crimeDataJson[0];
	    n = Object.keys(n).length -1; // Antal brottskategorier.. tar bort kolumn för kommun 
	    m = crimeDataJson.length;     // Antal sampel....

	    stack = d3.layout.stack().offset("wiggle"),
    	layers0 = stack(d3.range(n).map(function() { return layering(crimeDataJson); })); */

	    //X-axel
		/*x = d3.scale.linear()
		    .domain([0, m - 1])
		    .range([0, width]);    

		//Y-axel
		y = d3.scale.linear()
		    .domain([0, d3.max(layers0/*.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y + Math.abs(padding) ; }); })])
		    .range([height, 0]);*/

	   	/* x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
	            return d != "kommun" && (y[d] = d3.scale.linear()
	            .domain(d3.extent(self.data, function(p) { return +p[d]; }))
	            .range([height, 0])); 
	    }));*/

	    draw();
	});
	

	function draw()
	{
    /********* Tooltip ***********/
	    var tooltip = d3.select("body").append("div").attr("class","tooltip").style("opacity",0);

	    //X-axel
	    //Månader samt spridning 
	    var months = ["Jan","Feb","Mars","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
	    var diverse = [0,width/11, 2*width/11,3*width/11,4*width/11,5*width/11,6*width/11,7*width/11,8*width/11,9*width/11,10*width/11,width];

		var x = d3.scale.ordinal()
		    .domain(months)
		    .range(diverse);    

		//Y-axel
		var y = d3.scale.linear()
		    .domain([0, d3.max(layers0, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y + Math.abs(padding) ; }); })])
		    .range([height, 0]);

		// Färg på plotten
		var color = d3.scale.category20b();

		// Create the axis..
		var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	    //Ta bort skala på Y-axel...
	    yAxis.tickFormat("");

	    // Definera arean på datan som ska representeras
		var area = d3.svg.area()
		    .x(function(d) { return x(d.x); })
		    .y0(function(d) { return y(d.y0); })
		    .y1(function(d) { return y(d.y0 + d.y); });

   
		var svg = d3.select("#streamGraph").append("svg")
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
	        .attr("y", -6).text("Month").attr("transform","translate(-15,0)");
	        
	    // Add y axis and title.
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis)
	        .append("text")
	        .attr("class", "label")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 6)
	        .attr("dy", ".71em").text("Categories of crime").attr("transform","translate(-25,190)rotate(-90)");    
	 
		svg.selectAll("path")
		    .data(layers0)
		  	
		  	.enter().append("path")
		    .attr("d", area)
		    .attr("transform", "translate(0," + padding + ")")
		    .style("fill", function() { return color(Math.random()); })
		/****** Tool tip *********/

	        .on("mousemove", function(d, i) {
	        //... 
	        d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':0.4,'stroke-opacity':1.0 });	


	    	tooltip.transition()
	       .duration(200)
	       .style("opacity", .9);
	    	tooltip.html("Layer " + i)
	       .style("left", (d3.event.pageX + 5) + "px")
	       .style("top", (d3.event.pageY - 28) + "px");    
		    })
		    .on("mouseout", function(d) {
		        //... 

		        d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':1.0,'stroke-opacity':0.0 });

		        tooltip.transition()
		       .duration(500)
		       .style("opacity", 0);  
		    })
		    .on("click",  function(d) {
	            //... 
	            //selFeature(d);   
	        });
	}

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

	// Formatera datan så varje objekt innehåller ett y,y0,x värde....
	function layering(z)
	{
		var result  = new Array(); 
		
		//x = position i x-led, y0= basposition i y-led.(baslinje), y = tjockhet på linjen
		var dataPoint = {};

		var crimeAmount = " /100000";
		var kommun = "Hela landet";

		// Loopa antal kategorier = 9
		/*for(var i = 0; i < z.length; i++)
		{
			var categories = new Array();
			// Antal månader = 12
			for(var j )
			{


			}	

		}	*/

		return result; 
	}

}
