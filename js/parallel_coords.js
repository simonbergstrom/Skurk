function ParallelCoords()
{

	//Some initial stuff needed for parallel Coordinates.

	var self = this; //Used for internal d3-functions.

	var parallelDiv = $("#parallelCoords");

	console.log(parallelDiv);

	var margin = [30, 10, 10, 10],
        width = parallelDiv.width() - margin[1] - margin[3],
        height = parallelDiv.height() - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};

    var line = d3.svg.line(),
    	axis = d3.svg.axis().orient("left"),
    	backGround,
    	foreGround;

}
