


function pam(data, k) {

	// Step 1
	setTimeout(function(){

		initialize(k); 
	
	}, 500);

}

function initialize(k) {

	var mediods = [];

	for (var i = 0; i < k; ++i) {

		var medoid = {};

		for (var key in boundaries) {
			medoid[key] = Math.floor(Math.random() * (boundaries[key][1] - boundaries[key][0] + 1) + boundaries[key][0]);
		}

		mediods.push(medoid);

	}

	//console.log(mediods);
	
}