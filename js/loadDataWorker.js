self.addEventListener('message', function(e) {

	var newData = [];

	for (var i = 0; i < e.data.length; i+=10) 
	{    
	    var crimeType = {};
	    for (var j = 0; j < 10; j++) 
	    {        
	        crimeType['kommun'] = e.data[i+j]['kommun'];        
	        crimeType[e.data[i+j]['typ']] = e.data[i+j]["helår totalt"];
	    }
	    newData[(i/10)] = crimeType;
	}

	postMessage(newData);
});
