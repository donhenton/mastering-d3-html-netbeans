/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var menubar = null;
function rundemo()
{

    var menuItem1 = {"text": "Alpha 1  why dont you get \n\
     a job you bozo of no worth", "message": "alpha1"};
    var menuItem2 = {"text": "Alpha 2", "message": "alpha2"};
    var menuItem3 = {"text": "Alpha 3", "message": "alpha3"};
    var menuWidth = 150;
    var menuHeight = 400;
    var svgWidth = 800;

    var svg = d3.select("#menubar")
            .append("svg")
            .attr("height", menuHeight)
            .attr("width", svgWidth);
    var graphContainer = svg.append("g").attr("class", "graphContainer")
    //.attr("transform", "translate( 25,  25)")






    var initConditions = {
        "menuItems": [menuItem1, menuItem2, menuItem3],
        "menuWidth": menuWidth,
        "menuHeight": menuHeight,
        "slideDelay": 200,
        "attachmentGroup": graphContainer

    };

    var menubar = d3.menubar.init(initConditions);

    var graphWidth = svgWidth - menuWidth;
    var graphSectionRect =
            menubar.getGraphSection()
            .append("rect").attr("class", "graphSectionRect")
            //leave room for the slider switch
            .attr("width", graphWidth - menubar.getButtonSpace())
            .attr("height", menuHeight - 2)


    //d3.dispatch("onSlideEnd", "onSlideStart", "menuAction");

    menubar.on("onSlideEnd", function (str, finalState)
    {
        display(str + " --> " + finalState);
        //'closed' or 'open'
        if (finalState == 'open')
        {
            graphSectionRect 
               .attr("width", graphWidth - menubar.getButtonSpace());
        }
        else
        {
            graphSectionRect 
               .attr("width", graphWidth - menubar.getButtonSpace()+menuWidth);
        }

    });
    menubar.on("onSlideStart", function (str)
    {
        display(str);
    });
    menubar.on("menuAction", function (str)
    {
        display(str);
    });

    function display(str)
    {
        $("#info").html(str);
    }
}