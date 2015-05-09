/* global d3 */

////////////// Fade API Example usage //////////////////////
var margin = {top: 25, right: 40, bottom: 50, left: 60};
var width = 750 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var menuSize = 200;
var graphWidth = 700 -menuSize;
var caliper = null;
var rectHandler = null;
var brushRect = null;
var svg = null;
var handleSize = 12;
var menuWidth = 150;
var menubar = null;
var MAX_POINTS = 20;
function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}
//http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

function getSampleData(num) {
    var arr = [];
    var myDate = new Date("06/15/2011");
    myDate.setDate(myDate.getDate() + rand(20));
    for (var x = 0; x < num; x++) {
        myDate.setDate(myDate.getDate() + 1);
        var d = d3.time.format("%Y-%m-%d")(myDate);
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var t = rand(20000);
        var item = {"date": parseDate(d), "data": t, "index": x};
        arr.push(item);
    }
    return arr;
}


var fadeAPI = null;
rundemo();
function rundemo()
{


    var attachmentID = "graph";
    svg = d3.select("#" + attachmentID)
            .append("svg").attr("class", "svgContainer")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right);

    var menuSystemContainer = svg.append("g").attr("class", "menuSystemContainer");

    var menuItem1 = {"text": "Alpha 1  why dont you get \n\
     a job you bozo of no worth", "message": "alpha1"};
    var menuItem2 = {"text": "Alpha 2", "message": "alpha2"};
    var menuItem3 = {"text": "Alpha 3", "message": "alpha3"};

    var menuInitConditions = {
        "menuItems": [menuItem1, menuItem2, menuItem3],
        "menuWidth": menuWidth,
        "menuHeight": height + margin.top + margin.bottom,
        "slideDelay": 200,
        "graphContainer": menuSystemContainer

    };

    menubar = d3.menubar.init(menuInitConditions);


    var initConditions =
            {
                "margin": margin,
                "width": graphWidth,
                "height": height,
                "delay": 500,
                "groupNode": menubar.getGraphSection(),
                "data": getSampleData(MAX_POINTS),
                "attachmentID": attachmentID


            };
    //create a object that contains the public API        
    fadeAPI = d3.fadeAPI.init(initConditions);
    menubar.getGraphSection()
            .attr("transform", "translate(" + margin.left + ","
                    + margin.top + ")");
    brushRect = menubar.getGraphSection().append("rect").attr("class", "brushRect");
    brushRect.attr("height", height);


    // bind code to handle a 'newSelection' event which is whenever
    // the mouse moves near a new point, the binding sends the data of the
    //point and the index
    //it also sets the meaning of 'this'
    fadeAPI.on("newSelection", function (d, i) {
        var dateFormatter = d3.time.format("%Y-%m-%d");
        var me = this;
        $("#info").html(i + ": " + dateFormatter(d.date) + " data: " + d.data + " this (" + me.toString() + ")");
    });

    //bind code to handle the onLoad event
    fadeAPI.on("onLoad", function (d) {
        var message = d.type;
        var me = this;
        $("#info").html("Load Action: " + message + " this (" + me.toString() + ")");
    });

    menubar.on("onSlideEnd", function (str, finalState)
    {
        console.log("hit " + finalState)
        $("#info").html(str + " --> " + finalState);
        reSize(finalState);

    });






    addSliders();

}
////////////////   add the sliders ////////////////////////////////////////////
function addSliders()
{
    var sliderInit = {};
    sliderInit.handleSize = handleSize;
    var aPoint = d3.select(".x.axis").append("g")
            .attr("class", "sliderLine")
            //.attr("transform", "translate(-" + sliderInit.handleSize / 2 + ",40)");
            .attr("transform", "translate(0,40)");
    sliderInit.attachmentGPoint = aPoint;
    sliderInit.initialPercents = [40, 60];
    sliderInit.dim = graphWidth + 1 * sliderInit.handleSize;


    caliper = d3.caliperAPI.init(sliderInit);

    rectHandler = d3.rectHandler.init(brushRect,
            fadeAPI.getData(), fadeAPI.getXScale(), caliper, graphWidth);

    /**
     * handle the slideend event
     */
    caliper.on("slideend", function (left, right) {

        var ret = rectHandler.positionRect(left, right);
        var data = caliper.queryData();
        var stuff = " [" + data.left.percent + "," + data.right.percent + "]"
        $("#info").html("Dates " + ret.leftDate + " " + ret.rightDate + stuff);
    });

    var data = caliper.queryData();
    if (data !== null)
    {

        var ret = rectHandler.positionRect(data.left, data.right);
        var stuff = " [" + data.left.percent + "," + data.right.percent + "]"
        $("#info").html("Dates " + ret.leftDate + " " + ret.rightDate + stuff);
    }

}
/**
 * 
 * @returns {undefined}
 * code for the redraw button
 */
function reLoad()
{
    //hide the graph
    fadeAPI.hide(true);
    //get new data
    var newData = getSampleData(MAX_POINTS);
    //timer for fake delay
    window.setTimeout(function ()
    {
        //redraw the graph
        fadeAPI.reDraw(newData);
        rectHandler = d3.rectHandler.init(brushRect,
                fadeAPI.getData(), fadeAPI.getXScale(), caliper);
        //unhide it
        fadeAPI.hide(false);

    }, 1500);



}

function reSize(finalState)
{
    console.log("finalState")
    var isLarge = true;
    if (finalState === 'closed')
    {
        isLarge = false;
    }

    var mydata = caliper.queryData();

    if (!isLarge)
    {
        fadeAPI.reSizeGraph(graphWidth+menuSize -3*menubar.getButtonSpace());
        caliper.resize(graphWidth+menuSize  -3*menubar.getButtonSpace() + handleSize);

    }
    else
    {
        fadeAPI.reSizeGraph(graphWidth );
        caliper.resize(graphWidth + handleSize);
    }

    rectHandler = d3.rectHandler.init(brushRect,
            fadeAPI.getData(), fadeAPI.getXScale(), caliper);

    var mydata = caliper.queryData();

    rectHandler.positionRect(mydata.left, mydata.right);

    var stuff = " resize[" + mydata.left.percent + "," + mydata.right.percent + "]"
    $("#info").html(stuff);


}
;


 