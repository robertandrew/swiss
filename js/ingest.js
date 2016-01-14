var ingest = {
	init: function(specs,error,data){
		ingest.execute(specs,error,data);
	},
	execute: function(specs,error,data){
		specs.data = data;
		//Dates get restricted before anything else happens, because it's most efficient to just work on that one set
		ingest.restrictDates(specs);
		ingest.extractHeders(specs);
		ingest.unpivot(specs);
		ingest.nest(specs);
	},
	restrictDates: function(specs){
		//This is the only time that dates get trimmed
		var startDate = new Date(1992,1,1);
		specs.data = specs.data.filter(function(d,i){
			var thisDate = new Date(d.date);
			return ((thisDate)>=startDate && thisDate <= new Date());
		})
	},
	extractHeders: function(specs){
		//Get both dimensions of the data, top and left heders
		specs.keys = d3.keys(specs.data[0]).filter(function(f){return f != specs.dateCol});
		specs.flatData = [];

		//At this point, we're always assuming the left heders are dates
		specs.dates = specs.data.map(function(d,i){return d[specs.dateCol]})
	},
	unpivot: function(specs){

		console.log(specs.id)
		console.log(specs.data.WLD)

		specs.data.forEach(function(dD,iD){

			//Splits the date object to account for weird FRED formatting
			var dateObj = new Date(dD[specs.dateCol].split('-'));

			//Exclude all known aggegates. The currrent set is mostly from the World Bank. Opposite approach would be to include only known countries
			var aggregates = [{"iso3":"ARB"},
				{"iso3":"CEB"},
				{"iso3":"CSS"},
				{"iso3":"EAP"},
				{"iso3":"EAS"},
				{"iso3":"ECA"},
				{"iso3":"ECS"},
				{"iso3":"EUU"},
				{"iso3":"FCS"},
				{"iso3":"HIC"},
				{"iso3":"HPC"},
				{"iso3":"LAC"},
				{"iso3":"LCN"},
				{"iso3":"LDC"},
				{"iso3":"LIC"},
				{"iso3":"LMC"},
				{"iso3":"LMY"},
				{"iso3":"MEA"},
				{"iso3":"MIC"},
				{"iso3":"MNA"},
				{"iso3":"NAC"},
				{"iso3":"NOC"},
				{"iso3":"OEC"},
				{"iso3":"OED"},
				{"iso3":"OSS"},
				{"iso3":"PSS"},
				{"iso3":"SAS"},
				{"iso3":"SSA"},
				{"iso3":"SSF"},
				{"iso3":"SST"},
				{"iso3":"UMC"},
		 		{"iso3":"WLD"}
			]
				//For charts related to foreign country reserves, we need to include the EMU
				if(specs.id == "reserves" || specs.id == "reservesWB"){
					aggregates = aggregates.filter(function(f){return f.iso3!="EMU"})
				}

				//This is an efficient place to add ranks, for now. Year by year.
				var rankDomain = [];

				//...to do so, we create a scale that only caculates ranks and returns the right values.
				aggregates.forEach(function(dAgg,iAgg){
					specs.keys = specs.keys.filter(function(f){return f!=dAgg.iso3})
				})
				specs.keys.forEach(function(dC,iC){
					rankDomain.push(+dD[dC])
				})

			rankDomain.sort(function(a,b){return d3.descending(a,b)});

			var rankScale = d3.scale.ordinal()
				.domain(rankDomain)
				.range(d3.range(1,rankDomain.length+1))

				 

			specs.keys.forEach(function(dC,iC){
				var thisValue = dD[dC];

				//Turn undefined values into blanks for now.
				if(typeof thisValue == "undefined"){
					// console.log(specs.file + " " + dC + " " + dD[dC] + " " + dD.date + " was undefined and has been replaced with a blank for now");
					thisValue = "";
				}

				if(dC == "WLD") {
					console.log(thisValue + " " + specs.id)
				} else if(thisValue.search(/([A-Z]|[_,!@#$%^&*();\/"'])/g)==-1){
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
