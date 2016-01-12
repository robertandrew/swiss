var simpleFever = {
	draw: function(specs){
		simpleFever.setScale(specs);
		allCharts.setAxis(specs,'simpleFever');
		allCharts.callAxis(specs,'simpleFever');
		simpleFever.viz(specs);
		allCharts.tooltip(specs,'simpleFever');
	},
	viz: function(specs){
		specs.simpleFever.dom.viz = specs.simpleFever.dom.canvas.select('g.viz').selectAll('path')
			.data(specs.nestedData);

		specs.simpleFever.dom.viz.enter()
			.append('path');

		specs.simpleFever.dom.viz.exit()
			.remove('path');

		specs.simpleFever.dom.viz.attr('d',function(d){return simpleFever.liner(d.values,specs)})
			.attr('class',function(d,i){return util.classFormat(d.key)})
			.attr('tooltext',function(d,i){return specs.id + " " + d.value})

	},
	liner: function(dataset,specs){
		dataset.sort(function(a,b){return d3.ascending(a.dateObj,b.dateObj)})
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
				var thisY = specs.scale.y(d.value);
				if(isNaN(thisY)== true ){
					console.log(d.date + " y isNaN with " + d.key)
				} else {
					return thisY;
				}
			})
			.interpolate('cardinal')

		return lineGenerator(dataset);
	},
	setScale: function(specs){
		specs.scale = {
			x:d3.time.scale()
				.domain([d3.min(specs.flatData,function(d,i){
					return d.dateObj }), new Date()])
				.range([0,specs.width]),
			y:d3.scale.linear()
				.domain(d3.extent(specs.flatData,function(d,i){return d.value}))
				.range([specs.height,0])
		}
	},
}
