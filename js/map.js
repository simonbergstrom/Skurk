function Map(){

	// Initalization

	


    d3.json("data/swe_kommuner.json", function(error, sweden) {

        var municipalities = topojson.feature(sweden, sweden.objects.municipalities).features;

        

        console.log(municipalities);
        
    });








}