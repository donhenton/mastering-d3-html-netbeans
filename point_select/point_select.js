/* global d3 */

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}


function getSampleData(num) {
    var arr = [];
    var myDate = new Date("06/15/2011");
    myDate.setDate(myDate.getDate() + rand(20));
    for (var x = 0; x < num; x++) {
        myDate.setDate(myDate.getDate() + 1);
        var d = d3.time.format("%Y-%m-%d")(myDate);
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        var t = rand(20000);
        var item = {"date": parseDate(d), "data": t};
        arr.push(item);
    }
    return arr;
}


function rundemo()
{
    var margin = {top: 25, right: 40, bottom: 50, left: 60};
    var MAX_POINTS = 20;
//    var _data =
//            $.ajax("data.json", {
//                "async": false,
//                "type": "GET"
//            }).responseText;
//          JSON.parse(_data)

    var initConditions =
            {
                "margin": margin,
                "width": 550 - margin.left - margin.right,
                "height": 470 - margin.top - margin.bottom,
                "MAX_POINTS": MAX_POINTS,
                "delay": 500,
                "attachmentID": "graph",
                "data": getSampleData(MAX_POINTS)

            };
    Graph.init(initConditions);


}

/**
 * 
 * The graph object, handles drawing d3 graph for data of the form
 * 
 * [
 {
 "date": "2015-01-18",
 "data": 2000
 },
 {
 "date": "2015-01-19",
 "data": 4400
 }, .....
 ]
 */
var Graph = {};
/**
 * 
 * the graph data
 */
Graph.data = null;
Graph.svg = null;

Graph.init = function (initConditions)
{
    this.margin = initConditions.margin;
    this.width = initConditions.width;
    this.height = initConditions.height;
    this.MAX_POINTS = initConditions.MAX_POINTS;
    this.delay = initConditions.delay;
    this.svg = null;
    this.xScale = this.getXScale();
    this.yScale = this.getYScale();
    this.xAxis = null;
    this.yAxis = null;
    this.data = initConditions.data;
    this.attachmentID = initConditions.attachmentID;
    this.initializeSVG();
    this.assembleAxes();
    this.initialDraw();


};

/**
 * determines what part of the data structure is the key for add, edits, deletes
 * @param {type} d
 * @returns {unresolved}
 */
Graph.keyFunction = function (d) {
    return d.data;
};

Graph.getXScale = function ()
{
    return d3.time.scale().range([0, this.width]);
};

Graph.getYScale = function ()
{
    return d3.scale.linear().range([this.height, 0]);
};


Graph.formatTimeFunction = d3.time.format("%_m/%_d");
Graph.dateFormatter = d3.time.format("%Y-%m-%d");
Graph.parseDate = Graph.dateFormatter.parse;

/**
 * used to draw the line graph from the data
 * @type @exp;d3@pro;svg@call;line@call;x@call;y
 */
Graph.valueline = d3.svg.line()
        .x(function (d) {
            return Graph.xScale(d.date);
        })
        .y(function (d) {
            return Graph.yScale(d.data);
        });

Graph.initializeSVG = function ()
{
    this.svg = d3.select("#" + this.attachmentID)
            .append("svg")
            .attr("height", this.height + this.margin.top + this.margin.bottom).attr("width", this.width + this.margin.left + this.margin.right)

            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    
    this.svg.on("mousemove", function(d, i) {
                            Graph.doMouseMoveForSVG(d, i, this);
                        });
    
};

Graph.doMouseMoveForSVG= function(d, i, svgNode)
{
    var mouseInfo = d3.mouse(svgNode);
    console.log(mouseInfo[0]+" "+mouseInfo[1]);
};

Graph.assembleAxes = function ()
{
    this.xScale.domain(d3.extent(this.data, function (d) {
        return d.date;
    }));
    this.yScale.domain([0, d3.max(this.data, function (d) {
            return d.data;
        })]);

    this.xAxis =
            d3.svg.axis()
            .scale(this.xScale).tickPadding(15)
            .ticks(8)
            .tickFormat(function (d) {
                //return d3.time.format("%Y-%m-%d")
                return Graph.formatTimeFunction(d);
            })
            .innerTickSize([4])
            .outerTickSize([20])
            .orient("bottom");

    this.yAxis = d3.svg.axis().scale(this.yScale)
            .orient("left").ticks(5);

    this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

    // Add the Y Axis
    this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);
};


Graph.initialDraw = function ()
{


    this.svg.append("path")
            .attr("class", "line")
            .attr("d", this.valueline(this.data));

    this.doDots();

};


/**
 * main  redraw routine
 * @returns {undefined}
 */
Graph.reDraw = function () {

    //axes
    this.xScale.domain(d3.extent(this.data, function (d) {
        return d.date;
    }));
    this.yScale.domain([0, d3.max(this.data, function (d) {
            return d.data;
        })]);

    //lines
    var svg2 = this.svg.transition();
    //console.log( svg2.select(".line").duration(750))

    svg2.select(".line")   // change the line
            .duration(this.delay)
            .attr("d", this.valueline(this.data));
    svg2.select(".x.axis") // change the x axis
            .duration(this.delay)
            .call(this.xAxis);
    svg2.select(".y.axis") // change the y axis
            .duration(this.delay)
            .call(this.yAxis);

    //dots        
    this.doDots();
};

Graph.doDots = function ()
{

    var dots = this.svg.selectAll(".dot").data(this.data, this.keyFunction);
    dots.attr("fill", "blue");
    dots.enter().append("circle")
            .attr("fill", "green")
            .attr("r", 5)
            .attr("class", "dot")
            .attr("cx", function (d) {
                return Graph.xScale(d.date);
            })
            .attr("cy", function (d) {
                return Graph.yScale(d.data);
            });	
             
            
    // delete
    dots.exit().transition().duration(Graph.delay).attr("fill", "red").remove();
    //update
    dots.transition().duration(Graph.delay)
            .attr("r", 5)
            .attr("cx", function (d) {
                return Graph.xScale(d.date);
            })
            .attr("cy", function (d) {
                return Graph.yScale(d.data);
            });

};


