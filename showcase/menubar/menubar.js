/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.menubar = {};

d3.menubar.init = function (initConditions)
{
    var dispatch = d3.dispatch("onSlideEnd","onSlideStart");
    var graphContainer = initConditions.graphContainer;
    var menuWidth = initConditions.menuWidth;
    var menuHeight = initConditions.menuHeight;
    var menuItems = initConditions.menuItems;
    var d3svg = d3.select(graphContainer[0][0].parentElement);
    var menuContainerPt = null;
    var menuHidden = false;
    var buttonSpace = 15;
    var graphSection;
    var graphSectionRect;
    var slideDelay = 250;

// https://groups.google.com/forum/#!topic/d3-js/NIamAI9Yy60


    var createGraphHolder = function ()
    {
        var graphWidth = parseInt(d3svg.attr("width")) - menuWidth;
//        console.log("graph width " + graphWidth + " " + d3svg.attr("width"));
        graphSection = graphContainer.append("g").attr("class", "graphSection");
        graphSectionRect =
                graphSection.append("rect").attr("class", "graphSectionRect")
                //leave room for the slider switch
                .attr("width", graphWidth - buttonSpace)
                .attr("height", d3svg.attr("height") - 2)
        // .attr("transform","translate("+(menuWidth)+",1)");

    }

    var slide = function ()
    {

        menuHidden = !menuHidden;
        menuContainerPt.transition().duration(slideDelay)
                .attr("transform", positionMenu());
        var posNew = positionGraph();
        graphSectionRect.transition().duration(slideDelay).
                attr("width", posNew);

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
        var graphWidth = parseInt(d3svg.attr("width")) - menuWidth;
        var disp = parseInt(d3svg.attr("width")) - 4;
        if (menuHidden)
            return "translate(" + (disp) + ",2)";

        else
            return "translate(" + (graphWidth) + ",2)";

    }

    var createMenu = function ()
    {


        menuContainerPt = graphContainer.append("g").attr("class", "menuContainer");
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
                .attr("transform", function (d, i)
                {

                    return "translate(0," + i * disp + ")";
                }).attr("r", 5);

        g.append("svg:text")
                .attr("y", function (d, i) {
                    return i * disp;
                })

                .attr("dy", ".31em")
                .text(function (d, i) {
                    return  (d.text);
                }).call(wrap, 0.85 * menuWidth)
                .attr("transform", function (d, i)
                {

                    return "translate(10,0)";
                })



    }

    createGraphHolder();
    createMenu();



    function wrap(text, width) {
        text.each(function () {
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
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }



    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }


    d3.rebind(exports, dispatch, "on");
    return exports;
}