function ParallelCoords()
{

	//Some initial stuff needed for parallel Coordinates.

	var self = this; //Used for internal d3-functions.

	var parallelDiv = $("#parallelCoords");

	parallelDiv.css("background-color", "black");


	var margin = [30, 10, 10, 10],
        width = parallelDiv.width() - margin[1] - margin[3],
        height = parallelDiv.height() - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};

    var line = d3.svg.line(),
    	axis = d3.svg.axis().orient("left"),
    	backGround,
    	foreGround;

    var svg = d3.select("#parallelCoords").append("svg:svg")
    	.attr("width", width + margin[1] + margin[3])
    	.attr("height", height + margin[0] + margin[2])
    	.append("svg:g")
    	.attr("transform", "translate(" + margin[3] + "," + margin[0] + ")"); 

    //Load the data

    d3.csv("theFile", function(data){

    });
}
