function make_ceo(graphnumber, x, y, w, h)
{
	
	var chart = d3.select("#graph-"+graphnumber)
	    .append("svg:svg")
	    .attr("id", "graph-1-svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", h+14);	
	
	$('#graph-1-svg').tipsy;
	var data = [];
	
	for (var i=0; i < ceo_pay.length; i++) {
		//data[i] = parseFloat(ceo_pay[i].Ratio);
		data[i] = ceo_pay[i].Ratio;
	};

//	console.log(data);
	
	var cwidth = w;
	var width = cwidth - (leftmargin + rightmargin);
	var cheight = h;
	var barwidth = 10;
	var barmargin = 3;
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
	    
	
    var data_max = d3.max(ceo_pay, function(d) { return d.Ratio; });
//    console.log(data_max);

	 var barheight = d3.scale.linear()
	     .domain([0, data_max ])
	     .range([0, cheight-50]);
	
	 var barwidthscale = d3.scale.linear()
	     .domain([0, ceo_pay.length])		
		
    y = d3.scale.ordinal()
		.domain(d3.range(ceo_pay.length))
		.rangeBands([leftmargin, cwidth-rightmargin], 0.3);	    
	
		// Create axis lines
		chart.selectAll("line.axisline")
			.data(barheight.ticks(ticks))
		.enter().append("svg:line")
			.attr("class", "axisline")
			.attr("y1", function(d, i) { return ((cheight - topmargin) - barheight(d)); })
			.attr("y2", function(d, i) { return ((cheight - topmargin) - barheight(d)); })
			.attr("x1", leftmargin)
			.attr("stroke-dasharray","1,3")
			.attr("x2", cwidth)
			.attr("stroke", "#999");			
			
		// Create axis labels
		 chart.selectAll("text.axislabel")
		     .data(barheight.ticks(ticks))
		   .enter().append("svg:text")
		     .attr("class", "axislabel")
		     .attr("x", 5)
	//	     .attr("y", barheight)
			 .attr("y", function(d, i) { return ((cheight - topmargin) - barheight(d))+4; })
			 .attr("fill", "white")
		     .attr("text-anchor", "left")
				.on("mousedown", function(d,i){ color_bars_over(d)})
				.attr("cursor", "pointer")
		     .text(String);
		
		
		// Create year labels
		 chart.selectAll("text.year")
		     .data(ceo_pay)
		   .enter().append("svg:text")
		     .attr("class", "year")
		     .attr("x", function(d,i){ return y(i); })
			 .attr("text-anchor", "center")
			 .attr("id", function(d,i){ return "yearlabel"+i; })
	//	     .attr("y", barheight)
			 .attr("y", function(d, i) { return 460; })
			 .attr("font-size", "12")
			 .attr("fill", function(d,i){
//				console.log(d.Date);
				if((d.Date % 10) < 1) {
					return 'white';
				}
				else if(d.Date == 1990) {
					return 'white';
				}
				else {
					return 'none';
				}
			})
		     .text(function(d,i){ return d.Date; });
		
         function bar_color(d)
         {
            	//if(ceo_pay[i].Date < 1990) {
            	if(d.Date < 1990) {
					return '#999';
				}
                //else if(ceo_pay[i].Date < 2000) {
                else if(d.Date < 2000) {
					return '#CCC';
				}
                else
                {
                    return '#FFF';
                }
         }
		
		
		// Create bars
		 chart.selectAll(".ceo_bar")
	        .data(ceo_pay)
	      .enter().append("svg:rect")
			.on("mouseover", function(d,i){ change_ratio(d,i); })	
            .attr("class", "ceo_bar")
			.attr("rx", 2)
			.attr("ry", 2)
	        .attr("x", function(d, i) { return y(i);})
			.attr("y", function(d, i) { return ((cheight - topmargin) - barheight(d.Ratio)); })
	        .attr("width", y.rangeBand())
			.attr("stroke", "none")
			.attr("fill", function(d, i){ 
			    return bar_color(d,i);	
			})
			.attr("id", function(d,i){ return "ceobar"+i; })            
			.attr("height", function(d,i) { return barheight(d.Ratio);})
			.attr("tooltip", function(d,i)
            {

                var make_tt = function(ele)
                {
                    //console.log(ele);
                    ele.append("svg:text")
                        .text(d.Date)
                        .attr("font-size", 20)
						.attr("class", "tooltipheader")
                        .attr("x", 20)
                        .attr("y", function(d)
                        {
                            return 5+this.getBBox().height;
                        });

/*						
					ele.append("svg:line")
						.attr('x1', 85)
						.attr('x2', 85)
						.attr('y1', 70)
						.attr('y2', 85)
						.attr('stroke-width', '5')
						.attr('stroke', 'white');
*/

					// Triangle!!
/*					ele.append("svg:polygon")
						.attr("points", "8.156,0 16.04,0 12.098,7.09 8.156,14.043 4.214,7.021 0.272,0")
						.attr("stroke-width", 5)
						.attr("fill", "white")
						.attr('transform', 'translate(85,68)');
*/						
						
                    ele.append("svg:text")
                        .text("Ratio: "+d.Ratio)
                        .attr("font-size", 16)
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
				tt.w = 170;
                tt.h = 70;

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
//                tt.setCleat({"x": y(i) + (x.rangeBand()/2)-10, "y": (cheight - topmargin) - barheight(d.Ratio)});
				  tt.setCleat({"x": 200, "y": 200});
	                
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
					//return "Date: "+ceo_pay[i].Date+" Ratio: "+ceo_pay[i].Ratio;
					return "Date: "+d.Date+" Ratio: "+d.Ratio;
				})*/
				
	function color_bars_over(number) {
		 var bars = d3.selectAll("rect.ceo_bar").transition()
	        .duration(750)
		/*	.attr("fill", function(d, i){ 
				
				if(ceo_pay[i].Ratio < number) {
					return '#484848';
				}
				if(ceo_pay[i].Ratio >= number) {
					return 'blue';
				}
				
			});	*/
			
			.attr("fill", function(d,i){
                i -= 1;
				//if(ceo_pay[i].Ratio < number) {
				if(d.Ratio < number) {
					return bar_color(d,i);
				}
                //else if(ceo_pay[i].Ratio >= number) {
                else if(d.Ratio >= number) {
					return "#C44D58";
				}
			});

	}

}
