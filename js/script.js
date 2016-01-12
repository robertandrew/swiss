d3.tsv("data/" + 'specs.tsv',function(error,data){
	data.forEach(function(specs){
		//Get file info by splittle the filetype...
		var fileType = specs.file.substr(specs.file.indexOf('.'));
		specs.id = specs.file.substr(0,specs.file.indexOf('.'));
		console.log(fileType)

		//Function that will be called for every dataset -- chart types listed here will be repeated for every dataset
		function execute(specs,error,data){
			ingest.init(specs,error,data)
			transform.init(specs)
			draw.init(specs,"simpleFever")
			draw.init(specs,"rankedFever")
			draw.init(specs,"segmentedRankedFever")
		}

		//Call execute for every possile chart type
		if(fileType==".csv"){
			d3.csv("data/" + specs.file,function(error,data){
				execute(specs,error,data)

			})
		}
		else if(fileType==".tsv"){
			d3.tsv("data/" + specs.file,function(error,data){
				execute(specs,error,data)
			})
		}
		else if(fileType==".json"){
			d3.json("data/" + specs.file,function(error,data){
				execute(specs,error,data)
			})
		}
	})
})
