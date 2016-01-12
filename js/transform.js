var transform = {
	init: function(specs){
		if(specs.chart=="vertStream"){
			transform.global.sort(specs)
		}
	},
	global: {
		sort: function(specs){
			d3.csv('data/countries.csv',function(error,data){
				transform.global.scale.domain(data.map(function(d,i){return d.iso3}))
					.range(data.map(function(d,i){return d}))

				console.log(specs);


			})
		},
		scale: d3.scale.ordinal(),
	}
}
