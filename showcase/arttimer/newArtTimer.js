/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var totalImages = 6;
var currentImageIdx = 0;
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
var hourHandLength = 2 * clockRadius / 3;
var minuteHandLength = clockRadius;
var secondHandLength = clockRadius - 12;
var secondHandBalance = 30;
var secondTickStart = clockRadius;
var secondTickLength = -15;
var hourTickStart = clockRadius;
var hourTickLength = -18;
var secondLabelRadius = clockRadius + 16;
var secondLabelYOffset = 5;
var hourLabelRadius = clockRadius - 40;
var hourLabelYOffset = 7;

var svg;


var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(clockRadius*.75)
        .startAngle(0)
       //  .attr('transform', 'translate(' + (clockRadius/2) + ',' + (clockRadius/2) + ')');
               

function init()
{
    imageList = $('#imageCollection img');
    $(imageList[0]).fadeIn(10)
    $(imageList[0]).css("z-index", topZIndex);
    drawClock();
    drawArc();

}


function drawClock() {







    var hourScale = d3.scale.linear()
            .range([0, 330])
            .domain([0, 11]);

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


}


function drawArc()
{
    var background = svg.append("path")
            .datum({endAngle: tau/5})
            .style("fill", "#ddd")
            .attr("d", arc)
            .attr("transform","translate("+width/2+","+height/2+")")
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
        console.log("top " + currentIdx + " next " + nextIdx)
        var nextImage = $(imageList[nextIdx]);
        nextImage.css('z-index', midZIndex);
        topImage.fadeOut(fadeLength, function () {
            topImage.css('z-index', baseZIndex).hide();
            nextImage.css('z-index', topZIndex);
            console.log("top done");

        });
        nextImage.fadeIn(fadeLength, function ()
        {
            console.log("next done");
        });

    }

    currentIdx = (currentIdx + 1) % imageList.length;

}
;




  