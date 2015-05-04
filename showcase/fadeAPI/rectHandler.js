/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.rectHandler = {};


d3.rectHandler.init = function (brushRectVal, dataPoints, xScaleFunction)
{
    //brushRect contains the height this code only transforms the position
    //and the width
    var brushRect = brushRectVal;
    //given a pixel value, return a data item
    var transformFunction = xScaleFunction;
    var formatTimeFunction = d3.time.format("%Y-%m-%d");
    var xScale = xScaleFunction;
    var data = dataPoints;
var bisectDate = d3.bisector(function (d) {
        return d.date;
    }).left;

    var transformFunction = function (pixelValue)
    {
        //given x pos of mouse use xScale to turn that into a bisector

        var x0 = xScale.invert(pixelValue);
        var i = bisectDate(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        var ret = {"newTarget": null, "circleIdx": -1};

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





/////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;

    //return the dates that are found for the right and left handles
    exports.positionRect = function (left, right)
    {
        //console.log(left.percent + " " + left.x);
        var valueForLeft = left.x;
        var valueForRight = valueForLeft + (right.x - left.x) + left.handleSize / 2;
        brushRect
                .attr("width", (right.x - left.x) + left.handleSize / 2)
                .attr("transform", "translate(" + valueForLeft + ",0)");

        // console.log(transformFunction(250).newTarget.date);

        var ret = {"leftDate": null, "rightDate": null};

        ret.leftDate = formatTimeFunction(transformFunction(valueForLeft).newTarget.date);
        ret.rightDate = formatTimeFunction(transformFunction(valueForRight).newTarget.date);

        return ret;
    }

    return exports;
};//end init