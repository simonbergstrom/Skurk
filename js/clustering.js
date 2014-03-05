
/*var totalCost;

function pam(data, k) {

	totalCost = 0;
	var mediods = initialize(k);
	var dist_mediods = calcDistance(data, mediods);
	var clusters = calcCluster(data, dist_mediods);



	var newClusters = clusters;	
	
	for (var i = 0; i < k; ++i) {
		newMediods = mediods;

		for (var j = 0; j < data.length; ++j) {
			if (i == clusters[j]) {
				var oldCost = totalCost;

				totalCost = 0;
				newMediods[i] = data[i];
				dist_mediods = calcDistance(data, newMediods);
				newClusters = calcCluster(data, dist_mediods);

				if (oldCost > totalCost) {
					//console.log(totalCost);
					mediods = newMediods;
				}
			}
		}
	}
	
	return newClusters;

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

	return mediods;
	
}

function calcDistance(data, mediods) {

	var dist_mediods = [];

	for (var i = 0; i < mediods.length; ++i) {

		var dist_mediod = [];

		for (var j = 0; j < data.length; ++j) {

			var dist = 0;

			for (var key in data[j]) {

				if (key != 'kommun') {
					dist += Math.abs(data[j][key] - mediods[i][key]);
				}

			}

			dist_mediod.push(dist);

		}

		dist_mediods.push(dist_mediod);

	}

	return dist_mediods;

}

function calcCluster(data, dist_mediods) {

	var clusters = [];

	for (var i = 0; i < data.length; ++i) {

		var smallest_dist = dist_mediods[0][i];
		var cluster = 0;

		for (var j = 1; j < dist_mediods.length; ++j) {

			if (dist_mediods[j][i] < smallest_dist) {
				smallest_dist = dist_mediods[j][i];
				cluster = j;
			}
				
		}

		totalCost += smallest_dist;
		clusters.push(cluster);

	}

	return clusters;

}*/



function pam(data, k) {

	var mediods = [];
	var clusters = [];
	var cost = [];
	var oldCost = null;
	var gogogo = true;

	// Step 1: Randomly select medoids centers of existing ugly data points
	for (var a = 0; a < k; ++a) {
		var randomPoint = Math.floor(Math.random() * (data.length - 1 - 0 + 1) + 0);
		
		var dataPoint = data[randomPoint];
		var mediodPoint = {};
		for (var key in dataPoint) {
			mediodPoint[key] = dataPoint[key];
		}

		mediods.push(mediodPoint);
	}


	do {

		gogogo = false;

		// Initialize cost, bring the ca$h
		cost = [];
		for (var e = 0; e < mediods.length; ++e)
			cost.push(0);

		// Step 2: Divide the god damn data points into awesome clusters depending on their eucledian distance
		for (var c = 0; c < data.length; ++c) {
			
			var closestPointPosition = 0;
			var closestPointValue = calculateDistance(data[c], mediods[0]);

			for (var d = 1; d < mediods.length; ++d) {
				var secondClosestPointValue = calculateDistance(data[c], mediods[d])
				if (closestPointValue > secondClosestPointValue) {
					closestPointValue = secondClosestPointValue;
					closestPointPosition = d;
				}
			}

			cost[closestPointPosition] += closestPointValue;
			clusters.push(closestPointPosition);
		}


		// Step 3: Find a new and better medoid for each cluster, if you find it, run motherfucking while-loop again.
		for (var f = 0; f < mediods.length; ++f) {
			var currentCost = cost[f];

			for (var g = 0; g < data.length; ++g) {
				if (f == clusters[g]) {
					var newCost = 0;
					var newMediodPoint = data[g];

					for (var h = 0; h < data.length; ++h) {
						var newDataPoint = data[h];
						if (newMediodPoint["kommun"] != newDataPoint["kommun"] && f == clusters[h]) {
							newCost += calculateDistance(newDataPoint, newMediodPoint)
						}
					}

					if (newCost < currentCost) {			
						mediods[f] = newMediodPoint;
						currentCost = newCost;
					}
				}
			}
		}

		var totalCost = 0;

		if (oldCost == null) {
			oldCost = cost;
			gogogo = true;
			for (var j = 0; j < cost.length; ++j)
				totalCost += cost[j];
		}
		else {
			for (var i = 0; i < cost.length; ++i) {
				totalCost += cost[i];
				if (oldCost[i] != cost[i]) {
					oldCost = cost;
					gogogo = true;
				}
			}
		}

		console.log("OBS: DEN HÄR LOGGEN SKA VARA HÄR, INGEN FIKA FÖR GRABBARNA!");
		console.log("Total cost of clustering algorithm: " + totalCost);
		console.log(" ");
		
	} while(gogogo)

	return clusters;
}


function calculateDistance(dataPoint, mediodPoint) {

	var distance = 0;
	for (var key in dataPoint) {
		if (key != "kommun") {
			//distance += Math.pow(calculateRelativeValue(key, mediodPoint[key]) - calculateRelativeValue(key, dataPoint[key]), 2);
			distance += Math.pow(mediodPoint[key] - dataPoint[key], 2);
		}
	}

	distance = parseInt(Math.sqrt(distance));
	
	return distance;
}

function calculateRelativeValue(key, value) {
	var difference = boundaries[key][1] - boundaries[key][0];
	var relativeValue = Math.round((value/difference) * 100);

	return relativeValue;
}






