var allCharts = {
	dom: function(specs,chartType){
		//Set a blank variable for each active chart type, so that selections always exist and are live
		specs[chartType] = {
			dom:
				{
					//These are just three random placeholders. They could really be anything.
					svg:null,
					canvas:null,
					div:null
				}
			}

		specs[chartType].dom.div = d3.select('#charts')
			.append('div')
			.attr('id',specs.id + chartType);

		specs[chartType].dom.div.append('h3')
			.text(specs.id);

		specs[chartType].dom.svg = specs[chartType].dom.div.append('svg');

		specs[chartType].dom.canvas = specs[chartType].dom.svg.append('g')
			.attr('class','canvas')

		specs[chartType].dom.canvas.append('g')
			.attr('class','x axis')

		specs[chartType].dom.canvas.append('g')
			.attr('class','y axis')

		specs[chartType].dom.canvas.append('g')
			.attr('class','viz')
		specs[chartType].dom.canvas.key = specs[chartType].dom.canvas.append('g')
			.attr('class','key')

		specs[chartType].dom.canvas.key.tooltip = specs[chartType].dom.canvas.key.append('text')
			.attr('class','tooltip');


	},
	size: function(specs,chartType){
		specs[chartType].dom.svg.attr('height',specs.height + specs.margin.top + specs.margin.bottom)
			.attr('width',specs.width + specs.margin.left + specs.margin.right);
		specs[chartType].dom.canvas.attr('transform','translate(' + specs.margin.left + ',' + specs.margin.top + ')');
	},
	setSize: function(specs){
		specs.margin = {
			top:10,
			right:10,
			left:40,
			bottom:20
		};
		specs.width = $('div#charts').width() - specs.margin.right - specs.margin.left;
		specs.height = 553 - specs.margin.top - specs.margin.bottom;
	},
	setAxis: function(specs){
		specs.axis = {
			x:d3.svg.axis()
				.scale(specs.scale.x)
				.orient('bottom'),
			y:d3.svg.axis()
				.scale(specs.scale.y)
				.orient('left')
		}

	},
	callAxis: function(specs,chartType){
		specs[chartType].dom.canvas.select('.axis.x')
			.call(specs.axis.x)
			.attr('transform','translate(0,' + specs.height + ')');

		specs[chartType].dom.canvas.select('.axis.y')
			.call(specs.axis.y);
	},
	tooltip: function(specs,chartType){
		specs[chartType].dom.viz.on('mouseover',function(d,i){

			var thisMouse = d3.mouse(this);

			specs[chartType].dom.canvas.key.tooltip
				.text(d.key)
				.attr('x',thisMouse[0] + 5)
				.attr('y',thisMouse[1] - 5)
				.classed(util.classFormat(d.key),true)
				.style('opacity',1)

			d3.select(this).classed('on',true)

		})
		.on('mouseout',function(d,i){
			specs[chartType].dom.canvas.key.tooltip
				.text('')
				d3.select(this).classed('on',false)
			})
	}
}
