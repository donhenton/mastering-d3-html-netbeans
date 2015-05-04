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
    // if true reserve a brushrect
    var createBrushRect = initConditions.createBrushRect;
    var brushRect = null;
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
    var selectedPoint = {"dataItem": null, "svgItem": null};
    var verticalBar = null;
    var data = initConditions.data;
    var dotColor = "blue";
    

    /**
     * 
     * @returns {undefined}set up the svg element and initialize things
     */
    var initializeSVG = function ()
    {

        svg = d3.select("#" + attachmentID)
                .append("svg")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width", width + margin.left + margin.right)

                .append("g")
                .attr("transform", "translate(" + margin.left + ","
                        + margin.top + ")");
                
        if (createBrushRect)
        {
           brushRect =  svg.append("g").append("rect").attr("class","brushRect");
           brushRect.attr("height",height);
        }
                

        loaderIndicator = d3.select("#" + attachmentID).append("div")
                .attr("class", "indicatorClass")
                .attr("style", "display: none")

        loaderIndicator.append("img")
                .attr("src", "../../assets/img/ajax-loader.gif")
                .attr("class", "imageIndicator");


        $(".indicatorClass").css(
                {
                    "top": 0 + margin.top + (height / 2) - 35,
                    "left": 0 + margin.left + (width / 2) - 35,
                    "position": 'absolute'});



//        this centers  rectangle when attached to the body
//        console.log("ctm "+ctm);
//        var ctm = svg[0][0].getScreenCTM();
//        var hh = $('<span>').appendTo('body');
//        hh.css(
//                {"border":"thin solid green",
//                 "position":"absolute",
//                 "width":width+margin.right,
//                 "height":height,
//                 "class": "bonzo",
//                 "top": ctm.f,
//                 "left": ctm.e  
//        
//                }
//                );
    };


    initializeSVG();

    /**
     * 
     * 
     * inline function used to draw the lines
     */
    var valueline = d3.svg.line()
            .x(function (d) {
                return  xScale(d.date);
            })
            .y(function (d) {
                return  yScale(d.data);
            });


    var setDot = function (pt, on)
    {
        if (on)
        {
            pt.attr("fill", "red");
        }
        else
        {
            pt.attr("fill", dotColor);
        }

    };

    /**
     * this function will take a pixel value and translate into a date on
     * the axis
     * @param {type} pixelValue
     * @returns  {newTarget: the data item , circleIdx: the index in the
     * data set for that item}
     */
    var findDateForPixel = function(pixelValue)
    {
        //given x pos of mouse use xScale to turn that into a bisector
        
        var x0 = xScale.invert(pixelValue);
        var i = bisectDate(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        var ret = {"newTarget":null,"circleIdx": -1};
         
        if (x0 - d0.date > d1.date - x0)
        {
            ret.newTarget = d1;
            ret.circleIdx = i;
        }
        else
        {
            ret.newTarget = d0;
            ret.circleIdx = i - 1;
        }
        
        return ret;
    }


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
        var ret = findDateForPixel(d3.mouse(this)[0]);
         
        

        var pointDataArray = d3.selectAll(".dot");

        if (selectedPoint.dataItem === null || 
                (selectedPoint.dataItem.date !== ret.newTarget.date))
        {
            //only raise event if you actually change
            selectedPoint.dataItem = ret.newTarget;

            //clean up the old if it exists
            if (selectedPoint.svgItem !== null)
            {

                setDot(selectedPoint.svgItem, false);
            }
            // find the circle
            //d3.select(svgItem) is the same as $(htmlElement) in jQuery
            selectedPoint.svgItem = d3.select(pointDataArray[0][ret.circleIdx]);
            setDot(selectedPoint.svgItem, true);
            //raise a newSelection event, with the payload
            dispatch.newSelection.apply(this, [ret.newTarget, ret.newTarget.index + 1]);


        }
        //start drawing the grey line
        var yStart = yScale(ret.newTarget.data);
        var yLength = (yScale(height) - yStart) + margin.bottom / 4;

        var xBar = xScale(ret.newTarget.date);

        //focus is the encircling circle highlighting the points
        focus.select("circle.focusCircle")
                .attr("transform",
                        "translate(" + xScale(ret.newTarget.date) + "," +
                        yScale(ret.newTarget.data) + ")");


        verticalBar.select("rect.verticalBar")
                .attr('width', 2)     
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
                .attr("fill", dotColor)
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

        if (selectedPoint.svgItem != null)
        {

            setDot(selectedPoint.svgItem, false);
        }
        selectedPoint = {"dataItem": null, "svgItem": null};
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
            .style("stroke", "darkRed")
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
            .attr("class", "mouseRect")
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
    
    exports.getData = function()
    {
        return data;
    }
    
    exports.getXScale = function ()
    {
        return xScale;
    };
    
    /**
     * the brushrect, which indicates a selection of points is placed here in
     * reserve if the user sets createBrushRect true on the initConditions
     * object otherwise the reference is null;
     */
    exports.getBrushRect = function()
    {
        return brushRect;
    }
    
    
   

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

        var messageDiv = $(".indicatorClass");
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
                messageDiv.css("display", "");
                messageDiv.css("display", "block");


            }
            else
            {
                messageDiv.css("display", "");
                messageDiv.css("display", "none")
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







 