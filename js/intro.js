$(document).ready(function() {
  
	// Application initalization
	$("#main, #footer").hide();

	$( "#startButton" ).click(function() {
	  
		$( "#intro" ).fadeOut( "slow", function() {
			$("#main, #footer").fadeIn( "slow", function() {
				// Fade in ready!
			});
		});
	});
	
});

