/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function rundemo()
{

    var menuItem1 = {"text": "Alpha 1  why dont you get a job", "message": "alpha1"};
    var menuItem2 = {"text": "Alpha 2", "message": "alpha2"};
    var menuItem3 = {"text": "Alpha 3", "message": "alpha3"};
    var menuWidth = 150;
    var menuHeight = 400;

    var svg = d3.select("#menubar")
            .append("svg")
            .attr("height", 600)
            .attr("width", 500);
    var groupPoint = svg.append("g").attr("class", "menuGroup")
            .attr("transform", "translate( 25,  25)")
    
    
    

    

    var initConditions = {
        "menuItems": [menuItem1, menuItem2, menuItem3],
        "menuWidth": menuWidth,
        "menuHeight": menuHeight,
        "groupPoint": groupPoint

    };

    var menubar = d3.menubar.init(initConditions);
}