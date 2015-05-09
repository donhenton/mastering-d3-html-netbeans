/**
 * 
 * This creates a container with a menu on the right side and a svg group for
 * stuff on the right.
 * The menu will slide to the right (opened and closed) and will signal an
 * event representing that this has occurred.
 * 
 * It also provides for menu items which are submitted in the initial conditions
 * these items are in the form of 
 * 
 * var menuItem2 = {"text": "Alpha 2", "message": "alpha2"};
 * [menuItem1, menuItem2, menuItem3,...]
 * 
 * when clicked they will send a menuAction event with the message as the
 * payload
 * 
 * 
 * the left hand area (
 * 
 */
d3.menubar = {};

d3.menubar.init = function (initConditions)
{
    var dispatch = d3.dispatch("onSlideEnd", "onSlideStart", "menuAction");
    //where this container will be attached
    var attachmentGroup = initConditions.attachmentGroup;
    var menuWidth = initConditions.menuWidth;
    var menuHeight = initConditions.menuHeight;
    var menuItems = initConditions.menuItems;
    var d3svg = d3.select("svg");
    var menuContainerPt = null;
    var menuHidden = false;
    var buttonSpace = 15;
    var svgWidth = null;
    var graphSection;
    var slideDelay = initConditions.slideDelay;
    try {
        var svgWidth = parseInt(d3svg.attr("width"));
    }
    catch (e) {
    }
    // console.log(svgWidth);
// https://groups.google.com/forum/#!topic/d3-js/NIamAI9Yy60

    var d3svg = d3.select("svg");
    var createGraphHolder = function ()
    {

        graphSection = attachmentGroup.append("g").attr("class", "graphSection");

    }

    var slide = function ()
    {
        dispatch.onSlideStart.apply(this, ["start"]);
        menuHidden = !menuHidden;
        var stateMessage = "closed";
        if (!menuHidden)
            stateMessage = "open"
        menuContainerPt.transition().duration(slideDelay)
                .attr("transform", positionMenu()).each("end", function (d, i)
        {

            dispatch.onSlideEnd.apply(this, ["end", stateMessage]);

        });
        var posNew = positionGraph();


    }

    var positionGraph = function ()
    {
        var graphWidth = parseInt(d3svg.attr("width"));
        var t = 0;
        if (menuHidden)
        {
            t = graphWidth - buttonSpace;
        }
        else
        {
            t = graphWidth - buttonSpace - menuWidth;
        }
        return t;
    }

    var positionMenu = function ( )
    {
        if (d3svg === null)
        {
            d3svg = d3.select("svg");
        }
        var graphWidth = svgWidth - menuWidth;
        var disp = svgWidth - 4;
        if (menuHidden)
            return "translate(" + (disp) + ",2)";

        else
            return "translate(" + (graphWidth) + ",2)";

    }

    var createMenu = function ()
    {


        menuContainerPt = attachmentGroup.append("g").attr("class", "menuContainer");
        menuContainerPt.attr("transform", positionMenu());


        d3.selectAll(".menuContainer")
                .append("circle")
                .attr("r", 15)
                .attr("class", "menuSliderButton")
                .attr("cy", (menuHeight / 2) - 8)
                .on("mouseover", function (d, i) {
                    d3.select(this).classed("handCursor", true);
                    // d3.event.stopPropagation();
                })
                .on("mouseout", function (d, i) {
                    d3.select(this).classed("handCursor", false);
                    // d3.event.stopPropagation();
                })
                .on("click", slide);


//        console.log(d3svg.attr("width"));

        menuContainerPt.append("rect").attr("class", "menuGroupRect")
                .attr("width", menuWidth)
                .attr("height", menuHeight - 4);

        var menuItemsContainerAttachPt =
                menuContainerPt.append("g").attr("class", "menuItemsContainer");

        menuItemsContainerAttachPt.attr("transform", "translate(20,50)");

        var disp = menuHeight / menuItems.length;

        var g = menuItemsContainerAttachPt.selectAll(".menuNode")
                .data(menuItems)
                .enter().append("svg:g")
                .attr("class", "menuNode");


        g.append("svg:circle")
                .attr("class", "menuCircle")
                .attr("transform", function (d, i)
                {
                    d["circle"] = d3.select(this);
                    return "translate(0," + i * disp + ")";
                }).attr("r", 5);

        g.append("svg:text")
                .attr("class", "menuText")
                .attr("y", function (d, i) {
                    return i * disp;
                })

                .attr("dy", ".31em")
                .text(function (d, i) {
                    return  (d.text);
                }).call(wrap, 0.85 * menuWidth)
                .attr("transform", function (d, i)
                {
                    d["text"] = d3.select(this);
                    return "translate(10,0)";
                });

        g.append("rect").attr("class", "menuActionRect")
                .attr("width", 0.9 * menuWidth)

                .attr("height", function (d, i) {
                    // console.log(d.blockHeight);
                    return 20 * d.blockHeight;
                }
                )
                .attr("x", function (d, i) {
                    return   -10;
                })
                .attr("y", function (d, i) {
                    return i * disp - 10;
                })
                .on("mouseover", function (d, i) {
                    d3.select(this).classed("handCursor", true);
                    d.circle.classed("menuHighlight", true);
                    d.circle.classed("menuCircle", false);
                    d.text.classed("menuHighlight", true);

                })
                .on("mouseout", function (d, i) {
                    d3.select(this).classed("handCursor", false);
                    d.circle.classed("menuHighlight", false);
                    d.circle.classed("menuCircle", true);
                    d.text.classed("menuHighlight", false);

                })
                .on("click", function (d, i) {
                    dispatch.menuAction.apply(this, [d.message]);
                });

    }

    createGraphHolder();
    createMenu();



    function wrap(text, width) {
        text.each(function () {
            var blockHeight = 0;
            var parentData = d3.select(this).data()[0];
            var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    blockHeight = ++lineNumber * lineHeight + dy;
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", blockHeight + "em").text(word);
                }
            }

            parentData["blockHeight"] = lineNumber + 1;
        });
    }



    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }

    /**
     * after init, this will be where things are attached
     */
    exports.getGraphSection = function ()
    {
        return graphSection;
    }

    /**
     * 
     * @returns  the gutter space for the slide button
     */
    exports.getButtonSpace = function ()
    {
        return buttonSpace;
    }

    d3.rebind(exports, dispatch, "on");
    return exports;
}