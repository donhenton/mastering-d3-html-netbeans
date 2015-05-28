/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
 
var inAnimation = true;
var timerVar = null;
var imageList = null;
var currentIdx = 0;
var baseZIndex = 100;
var midZIndex = 500;
var topZIndex = 1000;
var fadeLength = 1000;

var tau = 2 * Math.PI;
var radians = 0.0174532925;
var clockRadius = 100;
var margin = 50;
var width = (clockRadius + margin) * 2;
var height = (clockRadius + margin) * 2;
var secondTickStart = clockRadius;
var secondTickLength = -15;
var secondLabelRadius = clockRadius + 16;
var timerArc;
var warnArray = ['green', 'greenyellow', 'gold', 'yellow', 'orangered', 'red'];
var svg;



var radianScale = d3.scale.linear()
        .range([0, 2 * Math.PI])
        .domain([0, 60]);


var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(clockRadius * .75)
        .startAngle(0)
//  .attr('transform', 'translate(' + (clockRadius/2) + ',' + (clockRadius/2) + ')');


function init()
{
    imageList = $('#imageCollection img');
    $(imageList[0]).fadeIn(10)
    $(imageList[0]).css("z-index", topZIndex);
    drawClock();


}


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
var secCounter = 0;
var timeValue = 60;

function doTimer()
{
    if (secCounter === 0)
    {
        d3.timer(doSecTick(), 0, 1000);
    }



}

function doSecTick()
{
    return function (  ) {

        if (secCounter > timeValue)
        {
            secCounter = 0;
            //broadcast the end of the timer run
            return true;
        }

        timerArc.transition().call(arcTween, radianScale(secCounter));
        secCounter = secCounter + 1;
        d3.timer(doSecTick(), 1000);


        return true;
    }
}

function arcTween(transition, newAngle) {


    transition.attrTween("d", function (d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    }).each("end", function ()
    {
        var idx = Math.floor((secCounter * (warnArray.length-1))/ timeValue);
        console.log(idx)
        timerArc.transition().style("fill", warnArray[idx]);

    });
}


function doFade()
{
    inAnimation = true;
    // fElement.find('img:gt(0)').hide();

    if (inAnimation)
    {


        var topImage = $(imageList[currentIdx]);
        var nextIdx = currentIdx + 1;
        if (nextIdx === imageList.length)
        {
            nextIdx = 0;
        }
         
        var nextImage = $(imageList[nextIdx]);
        nextImage.css('z-index', midZIndex);
        topImage.fadeOut(fadeLength, function () {
            topImage.css('z-index', baseZIndex).hide();
            nextImage.css('z-index', topZIndex);
             
        });
        nextImage.fadeIn(fadeLength, function ()
        {
           // console.log("next done");
        });
    }

    currentIdx = (currentIdx + 1) % imageList.length;
}
;




  