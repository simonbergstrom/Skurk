function StreamGraph(){

	var self = this; // for internal d3 functions

	var x,y;

	var kommun = "Hela landet";
	var kategori = ["Våldsbrott","Hot- kränknings- och frihetsbrott","Vårdslöshet- och vållandebrott","Stöldbrott","Bilbrott","Skadegörelsebrott","Vissa trafikbrott","Alkohol- och narkotikabrott","Vapenbrott"];
	var month = ["januari /100000","februari /100000","mars /100000","april /100000","maj /100000","juni /100000","juli /100000","augusti /100000","september /100000","oktober /100000","november /100000", "december /100000"];

	var layers1,stack;

	var padding = 20; // pad the plot on the Y-Axis... 

    var streamGraphDiv = $("#streamGraph");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = streamGraphDiv.width() - margin.right - margin.left,
        height = streamGraphDiv.height() - margin.top - margin.bottom;
   

   //TESTDATA
	/*var n = 9, // number of layers
    m = 12; // number of samples per layer
    stack = d3.layout.stack().offset("wiggle"),
    layers0 = stack(d3.range(n).map(function(d) { return bumpLayer(m); }));
    //layers1 = stack(d3.range(n).map(function() { return bumpLayer(m); }));*/

  
    /********* Ladda in data **********/
	d3.json("data/crime_monthly_municipatalities_2013.json", function(json) {

		self.data = json;

	    var crimeDataJson = [];

	    var crimeDataJsonStream = layering(json);

	    stack = d3.layout.stack().offset("wiggle");
    	layers1 = stack(crimeDataJsonStream);

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
		    .domain([0, d3.max(layers1, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y + Math.abs(padding) ; }); })])
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
		    .data(layers1)
		  	
		  	.enter().append("path")
		    .attr("d", area)
		    .attr("transform", "translate(0," + padding + ")")
		    .style("fill", function() { return color(Math.random()); })
		/****** Tool tip *********/

	        .on("mousemove", function(d, i) {
	        //... 
	        d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':1,'stroke-opacity':1.0,'stroke': '#00000', 'stroke-width': 3});	


	    	tooltip.transition()
	       .duration(200)
	       .style("opacity", .9);
	    	tooltip.html(kategori[i])
	       .style("left", (d3.event.pageX + 5) + "px")
	       .style("top", (d3.event.pageY - 28) + "px");    
		    })
		    .on("mouseout", function(d) {
		        //... 

		        d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':1.0,'stroke-opacity':0.0});

		        tooltip.transition()
			       .duration(500)
			       .style("opacity", 0);  
		    })
		    .on("click",  function(d) {
	            //...
	            var dt = this;
	            d3.select("#streamGraph").selectAll("path").style("opacity",function(z){ return this == dt ? null: 0.6;} );
	            //selFeature(d);   
	        });
	}
	// OM VI VILL LADDA OM DATA KAN DETTA VARA BRA?!?!?!?
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

	// Formatera datan så varje objekt innehåller ett x,y värde....
	function layering(z)
	{
		var result  = new Array(); 
		
		//x = position i x-led, y0= basposition i y-led.(baslinje), y = tjockhet på linjen
		var dataPoint = {};

		//var crimeAmount = " /100000";
		
		// Loopa antal kategorier = 9
		for(var i = 0; i < kategori.length; i++)
		{
			var tmp = [];
			// Antal månader = 12
			for(var j=0; j< month.length; j++ )
			{
				tmp.push({"x" : j, "y" : +z[kommun][kategori[i]][month[j]]});
			}	
			result.push(tmp);
		}
		return result; 
	}

}
