var transform = {
	init: function(specs){

	},
	global: {
		sort: function(specs){
			//Set the scale based on the country file I'd built earlier
			transform.global.scale.domain(transform.global.countryData.map(function(d,i){return d.iso3}))
				.range(transform.global.countryData.map(function(d,i){return d}))

			//Add longitude values to everything
			specs.flatData.forEach(function(dFlat,iFlat){
				dFlat.longitude = +transform.global.scale(dFlat.key).Longitude;
			})

			specs.keys = specs.keys.sort(function(aKey,bKey){
				return d3.descending(+transform.global.scale(aKey).Longitude,+transform.global.scale(bKey).Longitude);
			})

			//And finally, stack it all up, because that's why we sorted it!
			if(specs.flatData[0].previousPercent == undefined){
				transform.percentStack(specs);
			}

		},
		scale: d3.scale.ordinal(),
		countryData: null,
	},
	percentStack: function(specs){
		console.log(specs);
		specs.itemsPerDate = [];
		specs.dates.forEach(function(dDate,iDate){
			thisSet = specs.flatData.filter(function(f){return f.date == dDate}).sort(function(a,b){
				return d3.ascending(a.longitude,b.longitude)});
			//Set an empty counter for each new date
			var cumulativeValue = 0;
			//And total up each date
			var totalValue = d3.sum(thisSet,function(dSum,iSum){return dSum.value});

			//Set a counter, which will be incremented
			var totalItems = 0

			thisSet.forEach(function(dSet,iSet){
				if(dSet.value!=""){
					totalItems++
				}

				dSet.totalValue = totalValue;
				dSet.previousValue = cumulativeValue;
				dSet.percent = dSet.value/totalValue;
				dSet.previousPercent = dSet.previousValue/totalValue;
				dSet.continent = transform.global.scale(dSet.key).continent;
				cumulativeValue = cumulativeValue + dSet.value;

			})
			if(specs.itemsPerDate.length < specs.dates.length){
				specs.itemsPerDate.push({
					date:dDate,
					dateObj:new Date(dDate),
					items:totalItems
				})
			}
		})
	}
}
