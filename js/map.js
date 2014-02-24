function Map(){

	// Initalization

	var crimeData;
    var boundaries = {
        "Totalt antal brott" : [100000,0],
        "Våldsbrott" : [100000,0],
        "Hot- kränknings- och frihetsbrott" : [100000,0],
        "Vårdslöshet- och vållandebrott" : [100000,0],
        "Stöldbrott" : [100000,0],
        "Bilbrott" : [100000,0],
        "Skadegörelsebrott" : [100000,0],
        "Vissa trafikbrott" : [100000,0],
        "Alkohol- och narkotikabrott" : [100000,0],
        "Vapenbrott" : [100000,0],
    };
    var colors = ["#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"];

	var mapDiv = $("#map");
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var width = mapDiv.width() - margin.right - margin.left + 39;
    var height = mapDiv.height() - margin.top - margin.bottom + 40;
    var infoText;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 12])
        .on("zoom", move);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var projection = d3.geo.mercator()
        .center([31, 64.5 ])
        .scale(1200);

    var path = d3.geo.path()
        .projection(projection);

	g = svg.append("g");
	
	// Load crime data
    d3.json("data/crime_monthly_municipatalities_2013.json", function(data) {
        crimeData = data;

        // Load geographic data
        d3.json("data/swe_mun.json", function(error, sweden) {

            // Set boundary levels on each data set
            Object.keys(crimeData).forEach(function(a) {
                
                Object.keys(crimeData[a]).forEach(function(b) {

                    var value = parseInt(crimeData[a][b]['helår /100000']);

                    if (boundaries[b][1] < value)
                        boundaries[b][1] = value;

                    if (boundaries[b][0] > value)
                        boundaries[b][0] = value;

                });
                
            });

            var geoData = topojson.feature(sweden, sweden.objects.swe_mun).features;
            draw(geoData); 

        });

	});



    // Draw map
    function draw(geoData) {

    	var kommuner = g.selectAll(".name").data(geoData);

    	kommuner.enter().insert("path")
            .attr("class", "kommuner")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d) {
                return colors[quantize(d)]; 
            })
            .style({ 'stroke-opacity':0.0,'stroke':'#000000' })
            .on("mousemove", function(d) {
                
                 d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':0.4,'stroke-opacity':1.0 });

                infoText.html(d.properties.name);
                    
            })
            .on("mouseout",  function(d) {
                
            	d3.select(this).transition().duration(100)
    				.style({ 'fill-opacity':1.0,'stroke-opacity':0.0 });

    			infoText.html("Kommun");

        });

        drawLegend();
		
    }

    function drawLegend() {

        var ext_color_domain = [0, 50, 150, 350, 750, 1500, 2500, 4000];
        var legend_labels = ["< 50", "50+", "150+", "350+", "750+", "> 1500", "2500", "3000"]; 
        var ls_w = 15, ls_h = 15;
        
        var legend = svg.selectAll("g.legend")
          .data(ext_color_domain)
          .enter().append("g")
          .attr("class", "legend");

        infoText = legend.append("text")
            .attr("x", 270)
            .attr("y", height - 160)
            .attr("class", "infoText")
            .text("Kommun");

        legend.append("text")
            .attr("x", 270)
            .attr("y", height - 145)
            .text("Totalt antal brott");

        legend.append("rect")
            .attr("x", 270)
            .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function(d, i) { return colors[i]; })
            .style("opacity", 1.0);

        legend.append("text")
            .attr("x", 300)
            .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
            .text(function(d, i){ return legend_labels[i]; });


    }

    // Zoom and panning
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    function quantize(d) {
        
        var lowLevel = boundaries['Totalt antal brott'][0];
        var highLevel = boundaries['Totalt antal brott'][1];

        levelWidth = (highLevel - lowLevel)/colors.length;

        var counter = 0;
        var value = crimeData[d.properties.name]['Totalt antal brott']['helår /100000'];

        while(lowLevel + (counter * levelWidth) < value && counter < colors.length - 1)
            ++counter;
        
        return counter;

	}





}