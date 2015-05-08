/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global d3 */

var caliper = null;
var isLong = true;
var svgWidth = 600;

function rundemo()
{

    var margin = {top: 25, right: 40, bottom: 50, left: 5};

    var height = 100;
    var lineWidth = svgWidth;


    var initConditions = {};

    var svg = d3.select("#caliper")
            .append("svg")
            .attr("height", height)
            .attr("width", svgWidth);

    initConditions.handleSize = 15;
    initConditions.initialPercents = [40, 60];
    initConditions.dim = lineWidth;
    initConditions.attachmentGPoint = svg.append("g")
            .attr("transform", "translate(" + margin.left + ","
                    + margin.top + ")");

    caliper =
            d3.caliperAPI.init(initConditions);
    caliper.on("slideend", function (left, right) {

        var data = {};
        data.left = left;
        data.right = right;

        updateText(data);
    });

    var data = caliper.queryData();
    updateText(data);
}


function updateText(data)
{
    var text = "Percentages Left: " + data.left.percent +
            " , Right: " + data.right.percent;
    $('#info').html(text);

}

/**
 * used for the programmatic update demo.
 * @returns {undefined}
 */
function doUpdate()
{
    // var valueLeft = $('#handleLeft').val();
    // var valueRight = $('#handleRight').val();
    var valuePercent = $('#percentReset').val();
    var type_option = $('input[name="handleType"]:checked').val();
    var left = null;
    var right = null;
    if (type_option === 'left')
    {
        left = parseFloat(valuePercent);
    }
    else
    {
        right = parseFloat(valuePercent);
    }
    var sub = {"left": left, "right": right};
    caliper.reposition(sub);
    var data = caliper.queryData();

    updateText(data);
}

function doResize()
{

    if (isLong)
    {
        caliper.resize(svgWidth - 200);
        isLong = false;
    }
    else
    {
        caliper.resize(svgWidth);
        isLong = true;
    }
    var data = caliper.queryData();

    updateText(data);
}