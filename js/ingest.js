var ingest = {
    init: function(specs, error, data) {
        ingest.execute(specs, error, data);
    },
    execute: function(specs, error, data) {
        specs.data = data;
        //Dates get restricted before anything else happens, because it's most efficient to just work on that one set
        ingest.restrictDates(specs);
		ingest.extractHeders(specs);
		ingest.restrictCountries(specs)
        transform.global.addOther;
        ingest.unpivot(specs);
        ingest.nest(specs);
    },
    restrictDates: function(specs) {
        //This is the only time that dates get trimmed
        var startDate = new Date(1992, 1, 1);
        specs.data = specs.data.filter(function(d, i) {
            var thisDate = new Date(d.date);
            return ((thisDate) >= startDate && thisDate <= new Date());
        })
    },
    extractHeders: function(specs) {
        //Get both dimensions of the data, top and left heders
        specs.keys = d3.keys(specs.data[0]).filter(function(f) {
            return f != specs.dateCol
        });
        specs.flatData = [];

        //At this point, we're always assuming the left heders are dates
        specs.dates = specs.data.map(function(d, i) {
            return d[specs.dateCol]
        })
    },
	restrictCountries: function(specs){
		var problems = [];

		//Exclude all known aggegates. The currrent set is mostly from the World Bank. Opposite approach would be to include only known countries
		var keys = transform.global.countryData.map(function(dC,iC){return dC.iso3})

		var aggregates = ["ARB","CEB","CSS","EAP","EAS","ECA","ECS","EUU","FCS","HIC","HPC","LAC","LCN","LDC","LIC","LMC","LMY","MEA","MIC","MNA","NAC","NOC","OEC","OED","OSS","PSS","SAS","SSA","SSF","SST","UMC","WLD","EMU","INX","UVK"];

		//Make sure the country code is either included or excluded
		specs.keys.forEach(function(dK,iK){
			var thisIndex = keys.indexOf(dK);
			var aggIndex = aggregates.indexOf(dK);

			//Alert if something is missing from aggregates AND key -- it needs to be in one universe or the other
			if(thisIndex == -1 && dK!="date" && aggIndex == -1){
				problems.push("Not in keys or aggregates: " + dK + " " + ", " + (specs.data[0][dK]))
			}

		})

		if(JSON.stringify(problems)!="[]"){
			console.log(specs.id + " " + JSON.stringify(problems));
		}

		//Remove all the aggregates from specs.keys
		aggregates.forEach(function(dAgg,iAgg){
			specs.keys = specs.keys.filter(function(f){return f!=dAgg})
		})

	},

    unpivot: function(specs) {

		// keys.forEach(function(dC, iC) {
		// 	var thisIndex = specs.keys.indexOf(dC);
		//
		// 	//Alert if something is in the WEO keyset and not in the dataset
		//
		// 	if(thisIndex == -1 && dC!="date"){
		// 		problems.push("Not in scale: " + dC + " " + ", " + (specs.data[0][dC]))
		// 	}
		// })



        specs.data.forEach(function(dD, iD) {
            if (dD[specs.dateCol] == undefined) {
                console.log(dD)
                console.log(specs)
            }

            //Splits the date object to account for weird FRED formatting
            var dateObj = new Date(dD[specs.dateCol].split('-'));
            if (dateObj == undefined) {
                console.log(dD.date);
            }



            //This is an efficient place to add ranks, for now. Year by year.
            var rankDomain = [];

            //...to do so, we create a scale that only caculates ranks and returns the right values.

            specs.keys.forEach(function(dC, iC) {
                rankDomain.push(+dD[dC])
            })

            rankDomain.sort(function(a, b) {
                return d3.descending(a, b)
            });

            var rankScale = d3.scale.ordinal()
                .domain(rankDomain)
                .range(d3.range(1, rankDomain.length + 1))

            specs.keys.forEach(function(dC, iC) {

                var thisValue = dD[dC];

                //Turn undefined values into blanks for now.
                if (typeof thisValue == "undefined") {
                    // console.log(specs.file + " " + dC + " " + dD[dC] + " " + dD.date + " was undefined and has been replaced with a blank for now");
                    thisValue = "";
                }

                if (dC == "WLD") {

                } else if (thisValue.search(/([A-Z]|[_,!@#$%^&*();\/"'])/g) == -1) {
                    specs.flatData.push({
                        date: dD[specs.dateCol],
                        dateObj: dateObj,
                        value: +thisValue,
                        key: dC,
                        rank: rankScale(thisValue)
                    })
                } else {
                    console.log(specs.id + " series " + dC + " on " + dD.date + " is " + dD[dC] + ", which contains characters we should probably worry about")
                }
            })
        })
    },
    validate: function(specs) {
        //Uses some popular regex or something to valuidate all the data and make sure there are no rogue elements

    },
    nest: function(specs) {
        specs.nestedData = d3.nest().key(function(d) {
                return d.key
            })
            .entries(specs.flatData);
    },
}
