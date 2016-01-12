var draw = {
	//This should be called just once for each dataset, and once for each chart type within each dataset
	init: function(specs,chartType){
		allCharts.dom(specs,chartType);
		draw.draw(specs,chartType);
	},
	//If something needs to be redrawn on resize or whatever, this is where it happens.
	draw: function(specs,chartType){
		allCharts.setSize(specs,chartType);
		allCharts.size(specs,chartType);
		draw[chartType](specs);
	},
	//Give each chart an object so that it can be called in draw.draw via the passed chartType variable
	simpleFever: function(specs){
		simpleFever.draw(specs);
	},
	rankedFever: function(specs){
		rankedFever.draw(specs);
	},
	segmentedRankedFever: function(specs){
		segmentedRankedFever.draw(specs);
	}
}
