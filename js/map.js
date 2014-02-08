function Map(){

	// Initalization






    d3.json("data/kommuner_swe.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        

        console.log(countries);
        
    });








}