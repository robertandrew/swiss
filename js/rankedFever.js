var rankedFever = {
	draw: function(specs){
		rankedFever.setScale(specs);
		allCharts.setAxis(specs,'rankedFever');
		allCharts.callAxis(specs,'rankedFever');
		rankedFever.viz(specs);
		allCharts.tooltip(specs,'rankedFever');
	},
	viz: function(specs){
		specs.rankedFever.dom.viz = specs.rankedFever.dom.canvas.select('g.viz').selectAll('path')
			.data(specs.nestedData);

		specs.rankedFever.dom.viz.enter()
			.append('path');

		specs.rankedFever.dom.viz.exit()
			.remove('path');

		specs.rankedFever.dom.viz.attr('d',function(d){return rankedFever.liner(d.values,specs)})
			.attr('class',function(d,i){return util.classFormat(d.key)})
			.attr('tooltext',function(d,i){return specs.id + " " + d.value})

	},
	liner: function(dataset,specs){
		//assuming we're at the start of a given period, not the end, generates steps
		var theseSteps = [];
		dataset.sort(function(a,b){return d3.ascending(a.dateObj,b.dateObj)}).forEach(function(d,i){

			var thisDate = d.dateObj;
			var nextDate;
			var thisValue = d.value;
			var thisRank = d.rank;
			var nextRank;

			if(i!=dataset.length-1){
				nextDate = dataset[i+1].dateObj;
				nextRank = dataset[i+1].rank;
			} else {
				nextDate = new Date();
				nextRank = thisRank;
			}

			var dateDiff = nextDate-thisDate;

			//push the flat bit first
			theseSteps.push({
				dateObj:thisDate,
				rank: d.rank,
			})
			//then the slopey bit
			theseSteps.push({
				dateObj:nextDate - (dateDiff/2),
				rank: d.rank,
			})
		})

		var lineGenerator = d3.svg.line()
			.x(function(d){
				var thisX = specs.scale.x(d.dateObj);
				if(isNaN(thisX) == true){
					console.log(d.date + " x isNaN with " + d.key)
				} else {
					return thisX;
				}
			})
			.y(function(d){
				var thisY = specs.scale.y(d.rank);
				if(isNaN(thisY)== true ){
					console.log(d.date + " y isNaN with " + d.key)
				} else {
					return thisY;
				}
			})
			.interpolate('linear')

		return lineGenerator(theseSteps);
	},
	setScale: function(specs){
		specs.scale = {
			x:d3.time.scale()
				.domain([d3.min(specs.flatData,function(d,i){
					return d.dateObj }), new Date()])
				.range([0,specs.width]),
			y:d3.scale.linear()
				.domain(d3.extent(specs.flatData,function(d,i){return d.rank}))
				//Scale gets set in the conventional order, since 1 is highest!
				.range([0,specs.height])
		}
	},
}
