/* global d3 */

/**
 * Demonstration D3 graph with an encapsulated API. Also demonstrates
 * the use of dispatching events for loose coupling
 * 
 * PUBLIC API
 * doHide(boolean) hide or display the graph
 * reDraw(newData) redraw the graph
 * 
 * PUBLIC Constructor
 * init(data) create the public API
 * 
 */

d3.fadeAPI = {};


/**
 * The initiation method or constructor if you will.
 * The parameter passed in conditions initialization parameters
 * 
 * 
 * var margin = {top: 5, right: 40, bottom: 50, left: 60};
 * 
 * var initConditions =
    {
        "margin": margin,
        "width": width,
        "height": height,
        "delay": 500,
        "data": getSampleData(MAX_POINTS),
        "attachmentID": "graph"
    };
 * 
 *  This returns a function object that contains the public API
 * @param {type} initConditions
 * @returns {d3.fadeAPI.init.exports}
 */
d3.fadeAPI.init = function (initConditions)
{

    var keyFunction = function (d) {
        return d.index;
    };


    var getXScale = function ()
    {
        return d3.time.scale().range([0, width]);
    };

    var getYScale = function ()
    {
        return d3.scale.linear().range([height, 0]);
    };


    var formatTimeFunction = d3.time.format("%_m/%_d");
    var dateFormatter = d3.time.format("%Y-%m-%d");
    var parseDate = dateFormatter.parse;
    /**
     * 
     * will give the left side of the date array of the axis
     */
    var bisectDate = d3.bisector(function (d) {
        return d.date;
    }).left;

    var margin = initConditions.margin;
    var width = initConditions.width;
    var height = initConditions.height;
    var delay = initConditions.delay;
    var svg = null;
    var xScale = getXScale();
    var yScale = getYScale();
    var xAxis = null;
    var yAxis = null;
    var attachmentID = initConditions.attachmentID;
    var isLoading = false;
    //define an onLoad event, multiple events are comma delimited list
    var dispatch = d3.dispatch("onLoad", "newSelection");
    var loaderIndicator = null;
    var selectedPoint = null;
    var verticalBar = null;
    var data = initConditions.data;

    /**
     * 
     * @returns {undefined}set up the svg element and initialize things
     */
    var initializeSVG = function ()
    {

        svg = d3.select("#" + attachmentID)
                .append("svg")
                .attr("height", height + margin.top + margin.bottom).attr("width", width + margin.left + margin.right)

                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        loaderIndicator = d3.select("#" + attachmentID).append("img")
                .attr("src", "../../assets/img/ajax-loader.gif")
                .attr("class", "indicatorClass")
                .attr("style", "display: none");

        //  .style("opacity", 0);


    };


    initializeSVG();

    /**
     * 
     * @type @exp;d3@pro;svg@call;line@call;x@call;yinline function used to draw the lines
     */
    var valueline = d3.svg.line()
            .x(function (d) {
                return  xScale(d.date);
            })
            .y(function (d) {
                return  yScale(d.data);
            });
    /**
     * 
     * @returns {undefined}mouse move routine
     */
    var mouseMove = function ()
    {

        if (isLoading === true)
        {
            //ignore mouse while loading
            return;
        }
         
        //given x pos of mouse use xScale to turn that into a bisector
        var x0 = xScale.invert(d3.mouse(this)[0]);
        var i = bisectDate(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];

        var newTarget = x0 - d0.date > d1.date - x0 ? d1 : d0;
        if (selectedPoint === null || (selectedPoint.date !== newTarget.date))
        {
            //only raise event if you actually change
            selectedPoint = newTarget;
            //raise a newSelection event, with the payload
            dispatch.newSelection.apply(this, [newTarget, newTarget.index + 1]);


        }
        //start drawing the grey line
        var yStart = yScale(newTarget.data);
        var yLength = (yScale(height) - yStart) + margin.bottom / 4;

        var xBar = xScale(newTarget.date);

        //focus is the encircling circle highlighting the points
        focus.select("circle.focusCircle")
                .attr("transform",
                        "translate(" + xScale(newTarget.date) + "," +
                        yScale(newTarget.data) + ")");


        verticalBar.select("rect.verticalBar")
                .attr('width', 2)
                .style('fill', '#c0c0c0')
                .attr('height', yLength)
                .attr('x', xBar)
                .attr('y', yStart)
                .style("display", "block")
                .style('pointer-events', 'none');

    };

   /**
    * 
    * @returns {undefined}build the axes of the graph
    */
    var assembleAxes = function ()
    {
        xScale.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        yScale.domain([0, d3.max(data, function (d) {
                return d.data;
            })]);

        xAxis =
                d3.svg.axis()
                .scale(xScale).tickPadding(15)
                .ticks(8)
                .tickFormat(function (d) {
                    //return d3.time.format("%Y-%m-%d")
                    return  formatTimeFunction(d);
                })
                .innerTickSize([4])
                .outerTickSize([20])
                .orient("bottom");

        yAxis = d3.svg.axis().scale(yScale)
                .orient("left").ticks(5);

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        // Add the Y Axis
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
    };




    /**
     * 
     * @returns {undefined}
     * draw the points on the graph
     */

    var doDots = function ()
    {

        var dots = svg.selectAll(".dot").data(data, keyFunction);

        dots.enter().append("circle")
                .attr("fill", "blue")
                .attr("r", 5)
                .attr("class", "dot")
                .attr("cx", function (d) {
                    return xScale(d.date);
                })
                .attr("cy", function (d) {
                    return yScale(d.data);
                });

        dots.attr("r", 5)
                .attr("cx", function (d) {
                    return xScale(d.date);
                })
                .attr("cy", function (d) {
                    return yScale(d.data);
                });

        // delete
        dots.exit().remove();
        //update


    };

/**
 * 
 * @returns {undefined}
 * redraw after thing AFTER initialization
 */
    var reBuild = function () {
        xScale.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        yScale.domain([0, d3.max(data, function (d) {
                return d.data;
            })]);


        //lines
        svg.select(".line")   // change the line
                .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
                .call(xAxis);
        svg.select(".y.axis") // change the y axis
                .call(yAxis);

        //dots        
        doDots();




    };

    /**
     * 
     * @returns {undefined}
     * draw things for the first time
     */
    var initialDraw = function ()
    {


        svg.append("path")
                .attr("class", "line")
                .attr("d", valueline(data));

        doDots();
 
    };

    /**
     * define the highlighting circle
     */
    var focus = svg.append("g").style("display", "none");

    focus.append("circle")
            .attr("class", "focusCircle")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 14);
    verticalBar = svg.append("g").style("display", "none");
    verticalBar.append("rect").attr('class', 'verticalBar');

 


    // do the inital display
    assembleAxes();
    initialDraw();
   // the mouse detection rectangle  positioned here to be on top of the points

    svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                focus.style("display", null);
                verticalBar.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
                verticalBar.style("display", "none");
            })
            .on("mousemove", mouseMove);

/////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;

    /**
     * Routine for redrawing the graph takes new data
     * 
     * @param {type} newData
     * @returns {undefined}
     */
    exports.reDraw = function (newData)
    {

        data = newData;
        reBuild();

    };

    /**
     * if doHide is true then this will fade the graph out after a delay
     * it also sends a onLoad event with payload of Load Start  
     * 
     * if false, then it brings the graph back up and the onLoad event 
     * is Load End
     * 
     * @param {boolean} doHide true or false
     * @returns {void}
     */
    exports.hide = function (doHide)
    {


        var img = $(".indicatorClass");
        isLoading = doHide;
        var opacityStr = "1";
        if (isLoading)
        {
            opacityStr = "0";
            //raise onLoadEvent --Start
            dispatch.onLoad.apply(svg, [{"type": "Load Start"}]);
        }
        svg.transition().delay(200).each("end", function (d, i)
        {


            if (isLoading)
            {
                $(".indicatorClass").css("display", "");
                $(".indicatorClass").css("display", "block");
                var hWide = (img.width()) / 2; //half the image's width
                var hTall = (img.height()) / 2; //half the image's height, etc.

                // attach negative and pixel for CSS rule
                hWide = '-' + hWide + 'px';
                hTall = '-' + hTall + 'px';
                $(".indicatorClass").css(
                        {"top": "50%",
                            "left": "50%",
                            "margin-left": hWide,
                            "margin-top": hTall,
                            "position": 'absolute'});

            }
            else
            {
                $(".indicatorClass").css("display", "");
                $(".indicatorClass").css("display", "none")
                //raise onLoad Event End
                dispatch.onLoad.apply(this, [{"type": "Load End"}]);

            }
        }).style("opacity", opacityStr);

    };
    //set up routing of 'exports.on' to 'dispatch.on'
    d3.rebind(exports, dispatch, "on");
    //expose the public api
    return exports;

};





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
                "attachmentID": "graph"


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

 