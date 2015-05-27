/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global d3 */

var toggleStateOn = false;
var indicator = null;

function toggleIndicator()
{
    toggleStateOn = !toggleStateOn;
    indicator.show(toggleStateOn);

}
;


function rundemo()
{
    var height = 100;
    var width = 250;


    var d3container = d3.select("#indicator").append('svg')
            .attr("height", height)
            .attr("width", width);
    
    d3container.append("rect").attr("width",width).attr("height",height)
    .attr("fill","transparent").attr("stroke","darkblue");

    var attachPoint = d3container.append('g').attr("class", "attachPoint");

    var initVar = {"attachmentGroup": attachPoint};
    indicator = d3.indicator.init(initVar);
    indicator.getSizeAttributes()

    attachPoint.attr("transform", "translate(" + 
            (width - indicator.getSizeAttributes().width)/2 + ","
            + (height - indicator.getSizeAttributes().height)/2 + ")");

}



$(document).ready(function () {
    rundemo();

});
 