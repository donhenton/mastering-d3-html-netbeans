function make_unemployment(graphnumber, x, y, w, h)
{

	var chart = d3.select("#graph-"+graphnumber)
	    .append("svg:svg")
	    .attr("id", "graph-"+graphnumber+"-svg")
	    .attr("class", "chart")
	    .attr("width", 800)
	    .attr("height", 500);	
	
	var data = [];
	var unemployment = unemploymentrate;
	

	for (var i=0; i < unemploymentrate.length; i++) {
		//data[i] = parseFloat(unemployment[i].Ratio);
		data[i] = unemploymentrate[i].rate;
	};


	
	var cwidth = w;
	var width = cwidth - (leftmargin + rightmargin);
	var cheight = h;
	var barwidth = 1;
	var barmargin = 0;
	var rightmargin = 20;
	var leftmargin = 50;
	var topmargin = 10;
	var ticks = 11;
	
    
	
	x = d3.scale.ordinal()
        .domain(d3.range(data.length ))
        .rangeBands([ 0, w ], .2)
	
	
    var chart = d3.select("#graph-"+graphnumber+"-svg")
        .append("svg:g")
            .attr("class", "ceo")
            .attr("transform", "translate(" + [x,y] + ")");

/*        chart.append("svg:rect")
        .attr("class", "background_rect")
		.attr("stroke-width", 2)
//		.attr("stroke", "white")
		.attr("width", cwidth)
		.attr("height", cheight);
*/
		
	var tooltips = new dipsy.Pops(chart)
	    
	
    var data_max = d3.max(data);

	 var barheight = d3.scale.linear()
	     .domain([0, data_max ])
	     .range([0, cheight-50]);
	
	 var barwidthscale = d3.scale.linear()
	     .domain([0, unemployment.length])		
		
    y = d3.scale.ordinal()
		.domain(d3.range(unemployment.length))
		.rangeRoundBands([leftmargin, cwidth], 0.2);	    
	
		// Create axis lines
		chart.selectAll("line.axisline")
			.data(barheight.ticks(ticks))
		.enter().append("svg:line")
			.attr("class", "axisline")
			.attr("y1", function(d, i) { return ((cheight - topmargin) - barheight(d)); })
			.attr("y2", function(d, i) { return ((cheight - topmargin) - barheight(d)); })
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
			 .attr("y", function(d, i) { return ((cheight - topmargin) - barheight(d))+4; })
		     .attr("dx", 12)
			 .attr("dy", -5)
			 .attr("fill", "white")
		     .attr("text-anchor", "left")
		     .text(function(String){ return String+"%"; });
		
         function bar_color(d)
         {
            	//if(unemployment[i].Date < 1990) {
				if(d.Year < 1970) {
					return '#999'
				}
				else if(d.Year < 1980) {
					return '#777';
				}
            	else if(d.Year < 1990) {
					return '#999';
				}
                //else if(unemployment[i].Date < 2000) {
                else if(d.Year < 2000) {
					return '#777';
				}
				else if (d.Year <2007) {
					return '#999';
				}
                else
                {
					return '#C44D58';

                }
         }
		
		var ncolor = d3.scale.ordinal().range([
		      "rgb(50%, 0%, 0%)",
		      "rgb(0%, 50%, 0%)",
		      "rgb(0%, 0%, 50%)"
		    ]);
		 
		
		// Create year labels
		 chart.selectAll("text.year")
		     .data(unemployment)
		   .enter().append("svg:text")
		     .attr("class", "year")
		     .attr("x", function(d,i){ return y(i); })
			 .attr("text-anchor", "center")
	//	     .attr("y", barheight)
			 .attr("y", function(d, i) { return 460; })
			 .attr("font-size", "12")
			 .attr("fill", function(d,i){
//				console.log(d.Year);
				if((d.Year % 10) < 1 && d.Month == "Jan") {
					return 'white';
				}
				else if (d.Year == "1965" && d.Month == "Jan") {
					return 'white';
				}
				else {
					return 'none';
				}
			})
		     .text(function(d,i){ return d.Year; });
		
		// Create bars
		 chart.selectAll(".unemployment_bar")
	        .data(unemployment)
	      .enter().append("svg:line")
            .attr("class", "unemployment_bar")
	        .attr("x1", function(d, i) {  return y(i);})
	        .attr("x2", function(d, i) {  return y(i);})
	
			.attr("y1", function(d, i) { return ((cheight - topmargin) - barheight(d.rate)); })
			.attr("y2", function(d, i) { return (cheight - topmargin); })
			
	        .attr("width", y.rangeBand())
			.attr("fill", "none")
			.attr("stroke", function(d, i){ 
			    return bar_color(d);
			})
			.attr('shape-rendering', 'crispEdges')
			.attr('stroke-opacity', '1')
			.attr("stroke-width", '1')
			.attr("posting", 'false')
			.attr("id", function(d,i){ return "bar"+i; })
			.attr("height", function(d,i) { return barheight(d.rate);})
			.attr("tooltip", function(d,i)
            {

                var make_tt = function(ele)
                {
                    //console.log(ele);
                    ele.append("svg:text")
                        .text(d.Year+" "+d.Month)
                        .attr("font-size", 22)
						.attr("class", "tooltipheader")
                        .attr("x", 20)
                        .attr("y", function(d)
                        {
                            return 5+this.getBBox().height;
                        });
                    ele.append("svg:text")
                        .text("Unemployment Rate: "+d.rate+"%")
                        .attr("font-size", 18)
                        .attr("x", 20)
                        .attr("y", function(d)
                        {
                            return 2.5*this.getBBox().height;
                        });
				
/*				ele.selectAll(".tooltipchart")
                    	.data([5,10,15])
						.enter()
						.append("svg:rect")						
                        .attr("width", 20)
						.attr("class", "tooltipchart")
                        .attr("height", 20)
                        .attr("x", function(i,d){ return d*5; })
//                        .attr("x", 20)
                        .attr("y", 50)
                        .attr("fill", "pink") */
                }
                //add the tooltip
                var tt = tooltips.add(this, make_tt);
                //change the width and height of the tooltip
//                tt.w = x.rangeBand();
				tt.w = 245;
                tt.h = 72;

                //Theme the box itself
                var lt = tt.getTheme();
				lt.bg_fill = "white";
                lt.bg_fill_opacity = 1;
/*                lt.stroke = "#555";
                lt.stroke_opacity = .9;
                lt.stroke_width = 2;
*/

                //TODO: These three need to be done in order right now (will fix)
                tt.render();
//                tt.setCleat({"x": x(i) + x.rangeBand()/2, "y": h - y(d.Ratio)});
                tt.setCleat({"x": 370, "y": 430});
                //tt.setCleat({"x": x(i) + x.rangeBand()/2, "y": h});
                tt.setOffset("S");
                tt.update();

                tt.setStuck(false);
                tt.hide();
                //tt.show();
                //tt.setFollowMouse(true);


                return i 
            });
/*			.append("svg:title")
				.text(function(d,i){
					//return "Date: "+unemployment[i].Date+" Ratio: "+unemployment[i].Ratio;
					return "Date: "+d.Date+" Ratio: "+d.Ratio;
				})*/
				
	


}
