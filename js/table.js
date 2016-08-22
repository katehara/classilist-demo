function Table(model , settings){

	columns = getTableColumns(model.headers);
	this.data = model.data;
	this.tableData;
	this.groupedData;

	pane = settings.tablePane;
	pager = settings.pagerPane;
	page = pager.select(".page");
	prev = pager.select(".prev");
	next = pager.select(".next");
	first = pager.select(".first");
	last = pager.select(".last");

	var x =  d3.scale.linear()
	    	.domain([0 , 100])
	    	.range([0 , 100]);

	xAxis = d3.svg.axis()
	        .scale(x)

	var y = d3.scale.linear()
			.domain([0 , 100])
			.range([100 , 0]);

	yAxis = d3.svg.axis()
	        .scale(y)

	this.setPager = function(){
		curr = settings.tableCurrentPage;
		len = (this.groupedData).length;
		curlen = (this.groupedData)[curr-1].length;
		
		page.text(" "+ curr +" ("+curlen+")");
		first.text(1 + "..");
		last.text(".." + len );
		if(curr == 1) prev.classed("disabled" , true)
		else prev.classed("disabled" , false);

		if(curr == len) next.classed("disabled" , true);
		else next.classed("disabled" , false);
	}

	this.makeTable = function(nowData){
		pane = settings.tablePane;

		this.tableData = nowData;
		
		this.groupedData = sliceData(this.tableData, settings.tableSize) ;
		settings.tableCurrentPage = 1;

		pane.select("*").remove();
		var table = pane.append("table")
						.attr("class" , "striped highlight");

		var thead = table.append("thead");
		var tbody = table.append("tbody");

		var heads = thead.append("tr")
						.selectAll("th")
						.data(columns)
						.enter()
						.append("th")
						.text(function(c){
							if(c == "Predicted") return c+"-"+(model.target).substr(2);
							else return c.substr(2);
						});		

		var rows = tbody.selectAll("tr")
						.data(this.groupedData[settings.tableCurrentPage-1])
						.enter()
						.append("tr")
						.attr("class" , "make-pattern");

		var cells = rows.selectAll("td")
						.data(function(row){
							return (columns).map(function(column){
								return {column : column, value: row[column]};
							});
						})
						.enter()
						.append("td")
						.text(function(d){ return d.value; });
		
		this.setPager();
		this.bindEvents();
	}

	makepattern = function(rowData){
		patPane = settings.patternPane;
		patPane.selectAll("*").remove();
		// console.log(rowData["F-At1"]);		

		svg = patPane.append("svg");
		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At1"]))
		    .attr('y1', y(rowData["F-At2"]))
		    .attr('x2', x(rowData["F-At3"]))
		    .attr('y2', y(rowData["F-At4"]));

		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At3"]))
		    .attr('y1', y(rowData["F-At4"]))
		    .attr('x2', x(rowData["F-At5"]))
		    .attr('y2', y(rowData["F-At6"]));

		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At5"]))
		    .attr('y1', y(rowData["F-At6"]))
		    .attr('x2', x(rowData["F-At7"]))
		    .attr('y2', y(rowData["F-At8"]));

		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At7"]))
		    .attr('y1', y(rowData["F-At8"]))
		    .attr('x2', x(rowData["F-At9"]))
		    .attr('y2', y(rowData["F-At10"]));

		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At9"]))
		    .attr('y1', y(rowData["F-At10"]))
		    .attr('x2', x(rowData["F-At11"]))
		    .attr('y2', y(rowData["F-At12"]));

		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At11"]))
		    .attr('y1', y(rowData["F-At12"]))
		    .attr('x2', x(rowData["F-At13"]))
		    .attr('y2', y(rowData["F-At14"]));

		svg.append('line')
			.attr("class" , "pattern-stroke")
		    .attr('x1', x(rowData["F-At13"]))
		    .attr('y1', y(rowData["F-At14"]))
		    .attr('x2', x(rowData["F-At15"]))
		    .attr('y2', y(rowData["F-At16"]));

	}

	this.bindEvents = function(){
		d3.selectAll(".make-pattern").on("click" , function(){
			makepattern(d3.select(this).data()[0]);
		});
	}

	
	this.makeTable(this.data);

	this.slideData = function(t){
		pane = settings.tablePane;

		len = (this.groupedData).length;

		if(t==-1){ 
			if(settings.tableCurrentPage == 1) return;
			else curr = settings.tableCurrentPage = 1;
		}
		if(t==2){ 
			if(settings.tableCurrentPage == len) return;
			else curr = settings.tableCurrentPage = len;
		}

		if(t==0) curr = --settings.tableCurrentPage; //previous page
		else if(t==1) curr = ++settings.tableCurrentPage; //next page

		var tbody = pane.select("table").select("tbody");

		tbody.selectAll("*").remove();

		var rows = tbody.selectAll("tr")
					.data(this.groupedData[curr-1])
					.enter()
					.append("tr")
					.attr("class" , "make-pattern");

		var cells = rows.selectAll("td")
					.data(function(row){
						return (columns).map(function(column){
							return {column : column, value: row[column]};
						});
					})
					.enter()
					.append("td")
					.text(function(d){ return d.value; });

		this.setPager();
		this.bindEvents();
	}
		
}

function getTableColumns(headers){
	var a , p;
	cols = headers.filter(function(d , i){
					if(d.substr(0,2) == "F-") return true;
					else {
						if(d == "Predicted") p = i;
						else if(d.substr(0,2) == "A-") a = i;
						return false;
					}
				});

	cols.unshift(headers[p]);
	cols.unshift(headers[a]);
	return cols;
}


function sliceData(data , size){
	groups = [];
	for(i = 0, m = data.length; i<m ; i+=size ){
		groups.push(data.slice(i , i+size));
	}
	return groups;
}