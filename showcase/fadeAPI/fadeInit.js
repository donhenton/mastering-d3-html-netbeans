/* global d3 */

////////////// Fade API Example usage //////////////////////
var margin = {top: 5, right: 40, bottom: 50, left: 60};
var width = 750 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var graphWidth = width-200;

var caliper = null;
var rectHandler = null;
var brushRect = null;
var groupNode = null;
var svg = null;


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
            .append("svg").attr("class","svgContainer")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
    
             

    groupNode = svg.append("g")
            .attr("transform", "translate(" + margin.left + ","
                    + margin.top+")"  );
    brushRect = groupNode.append("rect").attr("class", "brushRect");
    brushRect.attr("height", height);


    var initConditions =
            {
                "margin": margin,
                "width": graphWidth,
                "height": height,
                "delay": 500,
                "groupNode": groupNode,
                "data": getSampleData(MAX_POINTS),
                "attachmentID": attachmentID


            };
    //create a object that contains the public API        
    fadeAPI = d3.fadeAPI.init(initConditions);

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

    addSliders();
}
////////////////   add the sliders ////////////////////////////////////////////
function addSliders()
{
    var sliderInit = {};
    sliderInit.handleSize = 12;
    var aPoint = d3.select(".x.axis").append("g")
            .attr("class", "sliderLine")
            .attr("transform", "translate(-" + sliderInit.handleSize / 2 + ",40)");
    sliderInit.attachmentGPoint = aPoint;
    sliderInit.initialPercents = [40, 60];
    sliderInit.dim = graphWidth + sliderInit.handleSize;


    caliper = d3.caliperAPI.init(sliderInit);

    rectHandler = d3.rectHandler.init(brushRect,
            fadeAPI.getData(), fadeAPI.getXScale(), caliper);

    /**
     * handle the slideend event
     */
    caliper.on("slideend", function (left, right) {

        var ret = rectHandler.positionRect(left, right);
        $("#info").html("Dates " + ret.leftDate + " " + ret.rightDate);
    });

    var data = caliper.queryData();
    if (data !== null)
    {

        var ret = rectHandler.positionRect(data.left, data.right);
        $("#info").html("Dates " + ret.leftDate + " " + ret.rightDate);
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
 