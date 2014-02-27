
var totalCost;

function pam(data, k) {

	totalCost = 0;
	var mediods = initialize(k);
	var dist_mediods = calcDistance(data, mediods);
	var clusters = calcCluster(data, dist_mediods);



	var newClusters;	

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

}














