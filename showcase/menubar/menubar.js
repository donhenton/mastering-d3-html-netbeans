/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.menubar = {};

d3.menubar.init = function (initConditions)
{
    var dispatch = d3.dispatch("onclickMenuItem");
    var graphContainer = initConditions.graphContainer;
    var menuWidth = initConditions.menuWidth;
    var menuHeight = initConditions.menuHeight;
    var menuItems = initConditions.menuItems;
    var d3svg = d3.select(graphContainer[0][0].parentElement);


// https://groups.google.com/forum/#!topic/d3-js/NIamAI9Yy60


    var createGraphHolder = function ()
    {
        var graphWidth = parseInt(d3svg.attr("width")) - menuWidth;
        console.log("graph width " + graphWidth + " " + d3svg.attr("width"));
        var graphSection = graphContainer.append("g").attr("class", "graphSection");
        var graphSectionRect =
                graphSection.append("rect").attr("class", "graphGroupRect")
                .attr("width", graphWidth - 2)
                .attr("height", d3svg.attr("height") - 2)
        // .attr("transform","translate("+(menuWidth)+",1)");

    }


    var createMenu = function ()
    {
        var menuContainerPt = graphContainer.append("g").attr("class", "menuContainer");
        
        var graphWidth = parseInt(d3svg.attr("width")) - menuWidth;
        menuContainerPt.attr("transform","translate("+(graphWidth)+",2)");
        
        console.log(d3svg.attr("width"));

        menuContainerPt.append("rect").attr("class", "menuGroupRect")
                .attr("width", menuWidth)
                .attr("height", menuHeight-4 );

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

    function type(d) {
        d.value = +d.value;
        return d;
    }



    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }

    d3.rebind(exports, dispatch, "on");
    return exports;
}