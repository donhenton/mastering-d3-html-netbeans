/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var interval = 150; // one second
var ct = 0;
var circleArray = [];
var rMin = 6;
var rMax = 8;
var height = 200;
var width = 500;


var makeCallback = function () {

    // note that we're returning a new callback function each time
    return function (  ) {
// console.log('OH HAI!! ' + ct);
// ct = ct + 1;
// if (ct > 5)
// {
// console.log("bail")
// return true;
// }

        var currentCircle = circleArray[ct];

        var prevIdx = ct - 1;
        if (prevIdx < 0)
        {
            prevIdx = circleArray.length - 1;
        }
        var prevCircle = circleArray[prevIdx];

        prevCircle.transition().attr('r', rMin);
        currentCircle.transition().attr('r', rMax);
        d3.timer(makeCallback(), interval);
        ct = ((ct + 1) % circleArray.length);
        return true;
    }
};





function rundemo()
{

    var d3container = d3.select("#indicator").append('svg')
            .attr("height", height)
            .attr("width", width);

    var dots = d3container.append('g').attr("class", "dotContainer");

    for (var i = 1; i <= 5; ++i) {
        var cc = dots.append('circle')

                .attr("class", "indicatorCircle")
                .attr('cx', i * 20)
                .attr('r', rMin)
                .attr('cy', 50);
        circleArray.push(cc);

    }
    dots.attr("transform", "translate(" + width / 2 + ","
            + height / 2 + ")");

    d3.timer(makeCallback(), 0, interval);

}



$(document).ready(function () {
    rundemo();

});
 