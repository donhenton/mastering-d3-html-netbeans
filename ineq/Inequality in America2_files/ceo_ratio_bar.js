function make_ceo_ratiobar(x, y, w, h, comparenumber)
{
	
//	console.log("Width: "+w+" Height: "+h);
	
/*        chart.append("svg:rect")
        .attr("class", "background_rect")
		.attr("stroke-width", 2)
//		.attr("stroke", "white")
		.attr("width", cwidth)
		.attr("height", cheight);
*/		
		var data = [1, comparenumber];
//		console.log(data);
		
		
		var chart = d3.select("#ceo-ratio-bar");
		
		// Create bars
		 chart.selectAll(".ratio_bars")
	        .data(data)
	      .enter().append("div")
			.attr("class", "ratiobar")
			.attr("id", function(d,i){ return "ratiobar"+i; })
			.attr("style", function(d,i){ return "width: "+d+"px"; })
            .attr("class", "ratio_bars");

		
}
