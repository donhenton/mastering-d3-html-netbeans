/* global d3 */
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

function reDrawGraph()
{
    Graph.data = getSampleData(MAX_POINTS);
    Graph.reDraw();

}

function rundemo()
{
    var margin = {top: 5, right: 40, bottom: 50, left: 60};

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
Graph.selectedPoint = null;
Graph.performUpdate = function (d)
{

    $("#info").html(this.dateFormatter(d.date) + " data: " + d.data);
}

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
    this.focus = this.svg.append("g").style("display", "none");
    this.focus.append("circle")
            .attr("class", "focusCircle")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 14);
    this.verticalBar = this.svg.append("g").style("display", "none");
    this.verticalBar.append("rect").attr('class', 'verticalBar');

    // the mouse detection rectangle  
    this.svg.append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                Graph.focus.style("display", null);
                Graph.verticalBar.style("display", null);
            })
            .on("mouseout", function () {
                Graph.focus.style("display", "none");
                Graph.verticalBar.style("display", "none");
            })
            .on("mousemove", this.mouseMove);




};

Graph.mouseMove = function ()
{

    var x0 = Graph.xScale.invert(d3.mouse(this)[0]);
    var i = Graph.bisectDate(Graph.data, x0, 1);
    var d0 = Graph.data[i - 1];
    var d1 = Graph.data[i];

    var newTarget = x0 - d0.date > d1.date - x0 ? d1 : d0;
    if (Graph.selectedPoint === null || (Graph.selectedPoint.date !== newTarget.date))
    {
        Graph.selectedPoint = newTarget;
        Graph.performUpdate(newTarget);

    }
    var yStart = Graph.yScale(newTarget.data);
    var yLength = (Graph.yScale(Graph.height) - yStart) + Graph.margin.bottom / 4;

    var xBar = Graph.xScale(newTarget.date);

    Graph.focus.select("circle.focusCircle")
            .attr("transform",
                    "translate(" + Graph.xScale(newTarget.date) + "," +
                    Graph.yScale(newTarget.data) + ")");


    Graph.verticalBar.select("rect.verticalBar")
            .attr('width', 2)
            .style('fill', '#c0c0c0')
            .attr('height', yLength)
            .attr('x', xBar)
            .attr('y', yStart)
            .style("display", "block")
            .style('pointer-events', 'none');

}

/**
 * determines what part of the data structure is the key for add, edits, deletes
 * @param {type} d
 * @returns {unresolved}
 */
Graph.keyFunction = function (d) {
    return d.index;
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

Graph.bisectDate = d3.bisector(function (d) {
    return d.date;
}).left;
Graph.lineSvg = null;



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

//.style( {"opacity": (bool == true ? 1 :0),"visibility":"visible"} );
/**
 * main  redraw routine
 * @returns {undefined}
 */
Graph.reDraw = function () {


//http://stackoverflow.com/questions/15319501/chained-animations-transitions-over-each-graph-node-d3-js
    this.svg.transition().delay(200).each("end", function (d, i)
    {
        //opacity is zero at this point
        //axes
        Graph.xScale.domain(d3.extent(Graph.data, function (d) {
            return d.date;
        }));
        Graph.yScale.domain([0, d3.max(Graph.data, function (d) {
                return d.data;
            })]);


        //lines
        Graph.svg.select(".line")   // change the line
                .attr("d", Graph.valueline(Graph.data));
        Graph.svg.select(".x.axis") // change the x axis
                .call(Graph.xAxis);
        Graph.svg.select(".y.axis") // change the y axis
                .call(Graph.yAxis);

        //dots        
        Graph.doDots();
        Graph.svg.transition().delay(200).style("opacity", "1");

    }).style("opacity", "0");


};

Graph.doDots = function ()
{

    var dots = this.svg.selectAll(".dot").data(this.data, this.keyFunction);

    dots.enter().append("circle")
            .attr("fill", "blue")
            .attr("r", 5)
            .attr("class", "dot")
            .attr("cx", function (d) {
                return Graph.xScale(d.date);
            })
            .attr("cy", function (d) {
                return Graph.yScale(d.data);
            });

    dots.attr("r", 5)
            .attr("cx", function (d) {
                return Graph.xScale(d.date);
            })
            .attr("cy", function (d) {
                return Graph.yScale(d.data);
            });

    // delete
    dots.exit().remove();
    //update


};


