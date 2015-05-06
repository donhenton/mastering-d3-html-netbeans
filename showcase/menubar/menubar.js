/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.menubar = {};

d3.menubar.init = function (initConditions)
{
    var dispatch = d3.dispatch("onclickMenuItem");
    var groupPoint = initConditions.groupPoint;
    var width = initConditions.width;
    var height = initConditions.height;
    var menuItems = initConditions.menuItems;

    groupPoint.append("rect").attr("class", "menuGroupRect")
            .attr("width", width)
            .attr("height", height);

// https://groups.google.com/forum/#!topic/d3-js/NIamAI9Yy60

    var createMenu = function ()
    {
        var menuAttach = groupPoint.append("g").attr("class", "menuContainer");
        var g = menuAttach.selectAll(".menuNode")
                .data(menuItems)
                .enter().append("svg:g")
                .attr("class", "menuNode");
        g.append("svg:circle")
                .attr("transform", function (d, i)
                {

                    return "translate(0," + i * 50 + ")";
                }).attr("r", 5)
        g.append("svg:text")
                .attr("y", function (d, i) {
                    return i * 50
                })
                .attr("x", "10")
                .attr("dy", ".31em")
                .text(function (d) {
                    return d.text;
                });


        ;
//        var groupG = g.append("g")         
//        g.append("svg:circle")
//                .attr("r", 5);
//
//        g.append("svg:text")
        //    .attr("x", 10)
        //     .attr("dy", ".31em")
//                .text(function (d) {
//                    return d.text;
//                });
        menuAttach.attr("transform", "translate(20,25)")

    }


    createMenu();


    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }

    d3.rebind(exports, dispatch, "on");
    return exports;
}