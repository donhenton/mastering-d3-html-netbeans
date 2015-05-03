////////////// Fade API Example usage //////////////////////
var margin = {top: 5, right: 40, bottom: 50, left: 60};
var width = 550 - margin.left - margin.right;
var height = 470 - margin.top - margin.bottom;
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

    var initConditions =
            {
                "margin": margin,
                "width": width,
                "height": height,
                "delay": 500,
                "data": getSampleData(MAX_POINTS),
                "attachmentID": "graph",
                "createBrushRect": true


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

////////////////   add the sliders ////////////////////////////////////////////
    var sliderInit = {};
    sliderInit.handleSize = 12;
    var aPoint = d3.select(".x.axis").append("g")
            .attr("class", "sliderLine")
            .attr("transform", "translate(-"+sliderInit.handleSize/2+",40)");
    sliderInit.attachmentGPoint = aPoint;
    sliderInit.initialPercents = [40, 60];
    sliderInit.dim = width + sliderInit.handleSize;

    var caliper = d3.caliperAPI.init(sliderInit);

    var rectHandler = d3.rectHandler.init(fadeAPI.getBrushRect(), fadeAPI.findDateForPixel);

    caliper.on("slideend", function (left, right) {

       var ret =  rectHandler.positionRect(left, right);
        $("#info").html("Dates "+ret.leftDate+" "+ret.rightDate);
    });

    var data = caliper.queryData();
    if (data !== null)
    {

       var ret =  rectHandler.positionRect(data.left, data.right);
       $("#info").html("Dates "+ret.leftDate+" "+ret.rightDate);
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
        //unhide it
        fadeAPI.hide(false);

    }, 1500);


}