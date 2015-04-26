

function make_gini(x, y, cwidth, cheight)
{
/*    console.log("GINI");
    console.log(data.length);
    console.log(gini);
*/	
	
var chart = d3.select("#graph-6")
    .append("svg:svg")
    .attr("id", "graph-6-svg")
    .attr("class", "chart")
    .attr("width", cwidth)
    .attr("height", cheight);

	var data = gini; 

	
	var barwidth = 10;
	var barmargin = 3;
	var rightmargin = 20;
	var leftmargin = 50;
	var topmargin = 60;
	var botmargin = 25;
	var ticks = 6;
	var width = cwidth - (leftmargin + rightmargin);
	var height = cheight - (topmargin + botmargin);

	
	
    var chart = d3.select("#graph-6-svg")
        .append("svg:g")
            .attr("class", "gini")
            .attr("transform", "translate(" + [x,y] + ")");
/*
        chart.append("svg:rect")
            .attr("class", "background_rect")
            .attr("width", cwidth)
            .attr("height", cheight);
*/	
    //var data_max = d3.max(gini, function(d) { return d.value; });
    //lets set data max explicitly
    var data_max = 50;

	 var barheight = d3.scale.linear()
	     .domain([0, data_max ])
	     .range([0, height-40]);
	
	 var barwidthscale = d3.scale.linear()
	     .domain([0, data.length])
		
		
    y = d3.scale.ordinal()
		.domain(d3.range(data.length))
		.rangeBands([leftmargin, cwidth-rightmargin], 0.3);	    
	
		// Create axis lines
		chart.selectAll("line.axisline")
			.data(barheight.ticks(ticks))
		.enter().append("svg:line")
			.attr("class", "axisline")
			.attr("y1", function(d, i) { return  (height - barheight(d)); })
			.attr("y2", function(d, i) { return  (height - barheight(d)); })
			.attr("x1", leftmargin)
			.attr("x2", cwidth)
			.attr("stroke", "#999");
			
		// Create axis labels
		 chart.selectAll("text.rule")
		     .data(barheight.ticks(ticks))
		   .enter().append("svg:text")
		     .attr("class", "rule")
		     .attr("x", 5)
	//	     .attr("y", barheight)
			 .attr("y", function(d, i) { return height - barheight(d)+4; })
		     .attr("dx", 12)
			 .attr("dy", -5)
			 .attr("fill", "white")
		     .attr("text-anchor", "left")
				//.on("mousedown", function(d,i){ color_bars_over(d)})
				.attr("cursor", "pointer")
		     .text(String);
		

        function bar_color(d)
        {
            if(d.key == "United States")
            {
//                return "#fff";    
				  return "#4ECDC4";
            }
            return '#515151';
        }

		
		// Create bars
        chart.selectAll("g.gini_bar")
            .data(data)
        .enter().append("svg:g")
            .attr("class", "gini_bar")
            //transform instead of using x and y so everything in each bars group starts at the right place
            .attr("transform", function(d,i) { return "translate(" + [ y(i), height - barheight(d.value)] + ")";})
        .append("svg:rect")
	        //.attr("x", function(d, i) { return y(i);})
            //.attr("y", function(d, i) { return ((cheight - topmargin) - barheight(d.value)); })
			.attr("rx", 4)
			.attr("ry", 4)
            .attr("width", y.rangeBand())
			.attr("height", function(d,i) { return barheight(d.value);})
			.attr("stroke", "none")
			.attr("fill", function(d, i){ 
			    return bar_color(d,i);
			})
			.attr("id", function(d,i){ return "bar"+i; })
			.append("svg:title")
				.text(function(d,i){
//					console.log(d)
                    //console.log(d.key + " " + d.value);
					return d.key;
				});

        var bar_labels = chart.selectAll("g.gini_bar")
            .append("svg:text")
                .attr("class", "label")
                .attr("fill", function(d,i) {
                    if(d.key == "United States")
                        return "#000";
                    return "#fff"
                })
				.attr("font-family", "'Changa One', sans-serif")
				.attr("letter-spacing", "2")
                .attr("stroke", "none")
                //rotate this bitch
                .text(function(d) { 
                    //console.log(d); 
                    return d.key.toUpperCase(); 
                })
                .attr("transform", function(d,i) {
                    var bbox = this.getBBox();
                    var trans = "translate(" + [ 0, barheight(d.value) ] + ")";
                    trans += "rotate(-90)";
                    //x and y get flipped after the rotation
                    trans += "translate(" + [ 10, y.rangeBand()/2 + bbox.height/4 ] + ")";
                    return trans;
                })

        var rank_labels = chart.selectAll("g.gini_bar")
            .append("svg:text")
                .attr("class", "label")
                .attr("fill", "white")
                .attr("stroke", "none")
                //rotate this bitch
                .text(function(d) { 
                    //console.log(d); 
                    return "#" + d.rank;
                    //return "#137"
                })
                .attr("transform", function(d,i) {
                    var bbox = this.getBBox();
                    var trans = "translate(" + [ 0, barheight(d.value) ] + ")";
                    trans += "rotate(-90)";
                    //x and y get flipped after the rotation
                    trans += "translate(" + [ -bbox.width - 10, y.rangeBand()/2 + bbox.height/4 ] + ")";
                    return trans;
                })



	
	
    /*
	function color_bars_over(number) {
		 var bars = d3.selectAll("rect.gini_bar").transition()
	        .duration(700)
			.attr("fill", function(d,i){
                i -= 1;
				//if(ceo_pay[i].Ratio < number) {
				if(d.Ratio < number) {
					return bar_color(d,i);
				}
                //else if(ceo_pay[i].Ratio >= number) {
                else if(d.Ratio >= number) {
					return "#FF0000";
				}
			});

	    }

    }
    */
}
