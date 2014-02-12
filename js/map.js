function Map(){

	// Initalization

	var mapDiv = $("#map");
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var width = mapDiv.width() - margin.right - margin.left + 35;
    var height = mapDiv.height() - margin.top - margin.bottom + 35;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var infoBox = d3.select("#map").insert("div")
 		.style("position", "absolute") 
		.style("z-index", "10")
        .style("border", 3 + "px solid #000000")
        .style("width", 147 + "px")
        .style("height", 35 + "px")
        .style("left", 70 + "%")
        .style("top", 95 + "%")
        .style("font-size", 20 + 'px')
        .style("color", '#FFFFFF')
        .style("background-color", '#555555')
        .style("padding-left", 3 + 'px')
	    .text("");

    var projection = d3.geo.mercator()
        .center([31, 64.5 ])
        .scale(1200);

    var path = d3.geo.path()
        .projection(projection);

	g = svg.append("g");
	


	// Load map data
    d3.json("data/swe_mun.json", function(error, sweden) {

    	var data = topojson.feature(sweden, sweden.objects.swe_mun).features;
		draw(data);   

    });



    // Draw map
    function draw(data) {

    	var kommuner = g.selectAll(".name").data(data);

    	kommuner.enter().insert("path")
            .attr("class", "kommuner")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            /*.style("fill", function(d) {
            	var R = parseInt(Math.random()*255);
            	var G = parseInt(Math.random()*255);
            	var B = parseInt(Math.random()*255);
                return 'RGB(' + R + ',' + G + ',' + B + ')'; 
            })*/
            .style({ 'stroke-opacity':0.0,'stroke':'#000000' })
            .on("mousemove", function(d) {
                
                 d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':0.4,'stroke-opacity':1.0 });

                infoBox.transition()        
                    .duration(200)      
                    .style("opacity", 1.0);  

                infoBox.html(d.properties.name);
                    
            })
            .on("mouseout",  function(d) {
                
            	d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':1.0,'stroke-opacity':0.0 });

    			infoBox.html("");

            });
           /*
        d3.json("unemployment.json", function(json) {
			data = json;

			// for each county, set the css class using the quantize function
			// (an external CSS file contains the css classes for each color in the scheme)
			counties.selectAll("path")
			  .attr("class", quantize);
		});*/

    }

    // Zoom and panning
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    function quantize(d) {
		return "q" + Math.min(8, ~~(data[d.id] * 9 / 12)) + "-9";
	}





}