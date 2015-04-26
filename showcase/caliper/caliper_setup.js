/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function rundemo()
{
    
    var margin = {top: 25, right: 40, bottom: 50, left: 20};
    var width = 100 ;
    var height = 100 ;
    
    var initConditions ={}
    
    initConditions.svg = d3.select("#caliper")
                .append("svg")
                .attr("height", height )
                .attr("width", width )
                 

    initConditions.attachmentGPoint =  initConditions.svg.append("g")
                .attr("transform", "translate(" + margin.left + ","
                        + margin.top + ")");
    
     
     var caliper = d3.caliperAPI.init(initConditions);
   
}