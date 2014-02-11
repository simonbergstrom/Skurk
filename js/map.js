function Map(){

	// Initalization

	var mapDiv = $("#map");
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var width = mapDiv.width() - margin.right - margin.left + 0;
    var height = mapDiv.height() - margin.top - margin.bottom + 30;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);
        //.style("border", "solid");

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var projection = d3.geo.mercator()
        .center([32, 64.5 ])
        .scale(1200);

    var path = d3.geo.path()
        .projection(projection);

	g = svg.append("g");
	


	// Load data from topojson file
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
            .style("fill", function(d) {
                return '#FF0000'; 
            });

    }

    // Zoom and panning
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }





}