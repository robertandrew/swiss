var ingest = {
	init: function(specs,error,data){
		ingest.execute(specs,error,data);
	},
	execute: function(specs,error,data){
		specs.data = data;
		ingest.unpivot(specs);
		ingest.nest(specs);
	},
	unpivot: function(specs){
		specs.keys = d3.keys(specs.data[0]).filter(function(f){return f != specs.dateCol});
		specs.flatData = [];

		specs.data.forEach(function(dD,iD){
			console.log(specs.dateCol)
			//Splits the date object to account for weird FRED formatting
			var dateObj = new Date(dD[specs.dateCol].split('-'));

			var rankDomain = [];

			specs.keys.forEach(function(dC,iC){
				rankDomain.push(+dD[dC])
			})

			rankDomain.sort(function(a,b){return d3.descending(a,b)});

			var rankScale = d3.scale.ordinal()
				.domain(rankDomain)
				.range(d3.range(1,rankDomain.length+1))

			specs.keys.forEach(function(dC,iC){
				var thisValue = dD[dC];
				if(thisValue.search(/([A-Z]|[_,!@#$%^&*();\/"'])/g)==-1){
					specs.flatData.push({
						date: dD[specs.dateCol],
						dateObj:dateObj,
						value:+thisValue,
						key:dC,
						rank:rankScale(thisValue)
					})
				} else {console.log(specs.id + " series " + dC + " on " + dD.date + " is " + dD[dC] + ", which contains characters we should probably worry about")}
			})
		})
	},
	validate: function(specs){
		//Uses some popular regex or something to valuidate all the data and make sure there are no rogue elements

	},
	nest: function(specs){
		specs.nestedData = d3.nest().key(function(d){return d.key})
			.entries(specs.flatData);
	},
}
