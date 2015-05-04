/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.rectHandler = {};

/**
 * 
 * @param {type} brushRectVal a pointer to the rectangle that will
 * be modified
 * @param {type} dataPoints data points
 * 
 * @param {type} xScaleFunction the xscale function of the graph
 * 
 * @param {type} caliper the object that controls the brush control handles
 * 
 * @returns {d3.rectHandler.init.exports}
 */
d3.rectHandler.init = function (brushRectVal, dataPoints, xScaleFunction,caliper)
{
    //brushRect contains the height this code only transforms the position
    //and the width
    var brushRect = brushRectVal;
    var caliperRef = caliper;

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
       // console.log("init left,right "+valueForLeft+","+valueForRight);

        // console.log(transformFunction(250).newTarget.date);

        var ret = {"leftDate": null, "rightDate": null};
        var newLeftDate = transformFunction(valueForLeft).newTarget.date;
        var newRightDate = transformFunction(valueForRight).newTarget.date;
        ret.leftDate = formatTimeFunction(newLeftDate);
        ret.rightDate = formatTimeFunction(newRightDate);

        //now snap the rectangle to the found dates
        valueForLeft = xScale(newLeftDate);
        valueForRight = xScale(newRightDate);
        var newWidth = valueForRight - valueForLeft;
        
       // console.log("new left,right "+valueForLeft+","+valueForRight);

        brushRect
                .attr("width", newWidth)
                .attr("transform", "translate(" + valueForLeft + ",0)");

        var boxLeft = caliper.getPercentForPos(valueForLeft +caliper.getMarkerDim()/2) ;
        var boxRight = caliper.getPercentForPos(valueForRight ) ;
        //set the markers to match as well;
        var  data  ={"left":boxLeft ,"right":boxRight};

        caliperRef.reposition(data);
        return ret;
    }

    return exports;
};//end init