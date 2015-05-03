/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.rectHandler = {};


d3.rectHandler.init = function (brushRectVal, transformFunctionParm)
{
    //brushRect contains the height this code only transforms the position
    //and the width
    var brushRect = brushRectVal;
    //given a pixel value, return a data item
    var transformFunction = transformFunctionParm;
    var formatTimeFunction = d3.time.format("%Y-%m-%d");



/////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;

    //return the dates that are found for the right and left handles
    exports.positionRect = function (left, right)
    {
        //console.log(left.percent + " " + left.x);
        var valueForLeft = left.x  ;
        var valueForRight = valueForLeft +(right.x - left.x)+left.handleSize/2;
        brushRect
                .attr("width", (right.x - left.x)+left.handleSize/2)
                .attr("transform", "translate(" + valueForLeft + ",0)");

        // console.log(transformFunction(250).newTarget.date);
        
        var ret = {"leftDate":null,"rightDate":null};
        
        ret.leftDate = formatTimeFunction(transformFunction(valueForLeft).newTarget.date);
        ret.rightDate = formatTimeFunction(transformFunction(valueForRight).newTarget.date);
        
        return ret;
    }

    return exports;
};//end init