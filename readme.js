Specify chart type in URL, load only the script files necessary for a given type
New JS file for every type
Main file just calls the proper js files, it does no drawing or data manipulation on its own
I think most of the dom building will happen in the js files themsleves

Consistent things:
All objects have "tooltext" attribute that contains what their tooltip would say
All objects have an id based on their chart and datapoint
All selections are stored in the specs file
