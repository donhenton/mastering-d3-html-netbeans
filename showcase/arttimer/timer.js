/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global d3 */

d3.artTimer = {};
d3.artTimer.clock = {};


d3.artTimer.clock.init = function (initConditions)
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
    var timeLengthIdx = 0;
    var timeMultiplier = [1, 2, 5];
    var timeValue = [60 * 1, 60 * 2, 60 * 5];
    var interrupt = false;

    var svg;
    var attachmentId = initConditions.attachmentId;

    var radianScale = d3.scale.linear()
            .range([0, 2 * Math.PI])
            .domain([0, 60]);


    var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(clockRadius * .75)
            .startAngle(0)

    var drawClock = function () {

        var secondScale = d3.scale.linear()
                .range([0, 354])
                .domain([0, 59]);



        svg = d3.select(attachmentId).append("svg")
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
                    return -secondLabelRadius * Math.cos(secondScale(d) * radians);
                })
                .text(function (d) {
                    return d * timeMultiplier[timeLengthIdx];
                });

        timerArc = svg.append("path")
                .datum({endAngle: (tau / 360)})
                .style("fill", "#ddd")
                .attr("d", arc)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    };
    var doTimer = function ()
    {
        if (isTimerStopped())
        {
            d3.timer(doSecTick(), 0, 1000);
        }


    };



    var isTimerStopped = function ()
    {
        return (secCounter === 0)
    }

    var doSecTick = function ()
    {
        return function (  ) {

            if (secCounter > timeValue[timeLengthIdx])
            {
                secCounter = 0;
                 
                console.log("broadcasting and sending interrupt of "+interrupt);
                    
                
                interrupt = false;
                //broadcast the end of the timer run
                timerArc.transition().call(arcTween,
                        radianScale(secCounter / timeMultiplier[timeLengthIdx]));
                return true;
            }

            timerArc.transition().call(arcTween,
                    radianScale(secCounter / timeMultiplier[timeLengthIdx]));
            secCounter = secCounter + 1;
            d3.timer(doSecTick(), 1000);


            return true;
        };
    };

    var arcTween = function (transition, newAngle) {


        transition.attrTween("d", function (d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        }).each("end", function ()
        {    //* timeMultiplier[timeLengthIdx]
            var idx = Math.floor((secCounter * (warnArray.length - 1)) / timeValue[timeLengthIdx]);

            console.log("floor " + idx + " sec " + secCounter);
            timerArc.transition().style("fill", warnArray[idx]);

        });
    };

    var redrawClock = function ()
    {
        svg.selectAll('.second-label')
                .data(d3.range(5, 61, 5))
                .transition()
                .text(function (d) {
                    return d * timeMultiplier[timeLengthIdx];
                });
        timerArc.transition().call(arcTween, radianScale(secCounter));

    }

    drawClock();
    /////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;

    exports.stopTimer = function ()
    {
        secCounter = secCounter + timeValue[timeLengthIdx];
        interrupt = true;
    }
    exports.startTimer = function ()
    {
        doTimer();
    };


    /**
     * 0 -- 60  sec
     * 1 -- 120 sec
     * 2 -- 300 sec 5 min
     */
    exports.setTimerLength = function (v)
    {
        timeLengthIdx = v;
        redrawClock();
    }


    return exports;
};