

function make_quintile(x, y, w, h)
{
	
var chart = d3.select("#graph-3")
    .append("svg:svg")
    .attr("id", "graph-3-svg")
    .attr("class", "chart")
    .attr("width", w)
    .attr("height", h+20);

	var cwidth = w;
	var cheight = h;
	var barwidth = 10;
	var barmargin = 3;
	var rightmargin = 20;
	var leftmargin = 65;
	var topmargin = 10;
	var ticks = 10;
	var width = cwidth - (leftmargin + rightmargin);
    var height = cheight - (topmargin);
	
    var chart = d3.select("#graph-3-svg")
    .append("svg:g")
        .attr("class", "quintile")
        .attr("transform", "translate(" + [x,y] + ")");
/*
    chart.append("svg:rect")
    .attr("class", "background_rect")
    .attr("width", cwidth)
    .attr("height", cheight);
*/
    //TODO: put all the rules etc here


    quintile.reverse();


    var data_max = d3.max(quintile, function(d)
    {
        return d3.max(d3.values(d));
    });
//    console.log(data_max);

    //make an array for each quantile, store all of them in an array:
    //[
    //  [0, 1, 2...]
    //  [8, 12, 4..]
    //  ...
    // ]
    var keys = d3.keys(quintile[0]);

    var qs = []
    keys.forEach(function(d) { qs.push([]) });
    qs.pop(); //we don't want an array for years;
    //console.log(qs);

    quintile.forEach(function(d,i)
    {
        //console.log(d);
        qs[0].push(d['Top 5 percent']);
        qs[1].push(d['Highest fifth']);
        qs[2].push(d['Second fifth']);
        qs[3].push(d['Third fifth']);
        qs[4].push(d['Fourth fifth']);
        qs[5].push(d['Lowest fifth']);
    });


	function ghettoLineColor(i){
//		console.log("i is: "+i);
		
		if (i == 0) {
			return "#4ECDC4";			
		}
		else if (i == 1){
			return "#999";			
		}
		else if(i == 2){
			return "#999";			
		}
		else if (i == 3){
			return "#999";			
		}
		else if (i == 4) {
			return "#999";			
		}
		else if (i == 5) {
			return "#C7F464";			
		}
	}



    var x = d3.scale.linear()
        .domain([0, qs[0].length])
        .range([0, w]);

   	var y = d3.scale.linear()
        .domain([0, data_max])
        .range([height, 0]);

   	var yinv = d3.scale.linear()
        .domain([0, data_max])
        .range([0, height]);


// Create axis lines
		chart.selectAll("line.axisline")
			.data(y.ticks(ticks))
		.enter().append("svg:line")
			.attr("class", "axisline")
			.attr("y1", function(d, i) { return y(d); })
			.attr("y2", function(d, i) { return y(d); })
			.attr("x1", leftmargin)
			.attr("x2", cwidth)
			.attr("stroke", "#999");
			
		 chart.selectAll("text.rule")
		     .data(y.ticks(ticks))
		   .enter().append("svg:text")
		     .attr("class", "rule")
		     .attr("x", 5)
	//	     .attr("y", barheight)
			 .attr("y", function(d, i) { return y(d); })
		     .attr("dx", 0)
			 .attr("dy", -5)
			 .attr("fill", "white")
		     .attr("text-anchor", "left")
			 .attr("font-size", "14px")
		     .text(function(String){return "$"+String});

// Create actual quintile lines
    var line = d3.svg.line()
        .x(function(d, i) { return x(i)+leftmargin })
        .y(function(d, i) { return y(d)})
        //.interpolate("linear")
        //.interpolate("monotone")
        .interpolate("basis")

	// Create year labels
	chart.selectAll("text.year")
	    .data(quintile)
	  .enter().append("svg:text")
	    .attr("class", "year")
	    .attr("x", function(d,i){ return x(i); })
	 .attr("text-anchor", "center")
	//     .attr("y", barheight)
	 .attr("y", function(d, i) { return 460; })
	 .attr("font-size", "12")
	 .attr("fill", function(d,i){
//		console.log(d.Year);
		if((d.Year % 10) < 1) {
			return 'white';
		}
		else {
			return 'none';
		} 
	})
	    .text(function(d,i){ return d.Year; });
		


    var line_color = d3.scale.linear()
        .domain([0, qs.length])
        .interpolate(d3.interpolateRgb)
        .range(["#FFF", "#999"]);

    var lines = chart.selectAll("g.qline")
        .data(qs)
        .enter().append("svg:g")
            .append("svg:path")
            .attr("class", "qline")
//            .attr("stroke", function(d,i) { console.log("i ="+i); return line_color(i);  })
            .attr("stroke", function(d,i) { return ghettoLineColor(i);  })
            .attr("stroke-width", 6)
			.attr("stroke-linecap", "round")
            .attr("fill", "none")
            .attr("d", line);


}
