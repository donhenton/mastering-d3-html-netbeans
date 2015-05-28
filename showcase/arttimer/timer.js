/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.timer = {};


d3.indicator.init = function (initConditions)
{
    var tau = 2 * Math.PI;
    var radians = 0.0174532925;
    var clockRadius = initConditions.clockRadius;
    var margin = initConditions.margin;
    var width = (clockRadius + margin) * 2;
    var height = (clockRadius + margin) * 2;
    var secondTickStart = clockRadius;
    var secondTickLength = -15;
    var secondLabelRadius = clockRadius + 16;
    var timerArc;
    var warnArray = ['green', 'greenyellow', 'gold', 'yellow', 'orangered', 'red'];
    var secCounter = 0;
    var timeValue = 60;

    var radianScale = d3.scale.linear()
            .range([0, 2 * Math.PI])
            .domain([0, 60]);


    var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(clockRadius * .75)
            .startAngle(0)

    function drawClock() {

        var minuteScale = d3.scale.linear()
                .range([0, 354])
                .domain([0, 59]);

        var secondScale = minuteScale;

        svg = d3.select("#clockTimer").append("svg")
                .attr("width", width)
                .attr("height", height);

        var face = svg.append('g')
                .attr('id', 'clock-face')
                .attr('transform', 'translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');

        //add marks for seconds
        face.selectAll('.second-tick')
                .data(d3.range(0, 30)).enter()
                .append('line')
                .attr('class', 'second-tick')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', secondTickStart)
                .attr('y2', secondTickStart + secondTickLength)
                .attr('transform', function (d) {
                    return 'rotate(' + secondScale(d) * 2 + ')';
                });

        face.selectAll('.second-label')
                .data(d3.range(5, 61, 5))
                .enter()
                .append('text')
                .attr('class', 'second-label')
                .attr('text-anchor', 'middle')
                .attr('x', function (d) {
                    return secondLabelRadius * Math.sin(secondScale(d) * radians);
                })
                .attr('y', function (d) {
                    return -secondLabelRadius * Math.cos(secondScale(d) * radians)
                })
                .text(function (d) {
                    return d;
                });

        timerArc = svg.append("path")
                .datum({endAngle: (tau / 360)})
                .style("fill", "#ddd")
                .attr("d", arc)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    }
   
   
    drawClock();
    /////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;

    return exports;
}