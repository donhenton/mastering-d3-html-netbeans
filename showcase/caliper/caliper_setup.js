/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function rundemo()
{

    var margin = {top: 25, right: 40, bottom: 50, left: 5};
    var width = 430;
    var height = 100;
    var lineWidth = width;

    var initConditions = {}

    initConditions.svg = d3.select("#caliper")
            .append("svg")
            .attr("height", height)
            .attr("width", width);

    initConditions.handleSize = 15; 
    initConditions.initialPercents=[40,60];
    initConditions.dim = lineWidth;
    initConditions.attachmentGPoint = initConditions.svg.append("g")
            .attr("transform", "translate(" + margin.left + ","
                    + margin.top + ")")



    var caliper = d3.caliperAPI.init(initConditions);
    caliper.on("slideend", function (left,right) {
         console.log(left.percent+" "+right.percent)
    });
    
    var data = caliper.queryData();
    console.log(data.left.percent+" , "+data.right.percent);
}