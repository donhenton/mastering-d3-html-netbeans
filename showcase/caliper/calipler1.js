/* global d3 */

/**
 * 
 * @type typeThe code repsonsible for handling the calipers, creating the
 * handles and positioning them. It uses percentages of its length as the
 * measure and could be used to be a scaled representation of a length.  Most
 * likely, the length of the line will be identical to something that is using.
 * 
 * The typical use case is a indicator used to drive a brush on a graph, 
 * with the handles here being used to size that rectangle.
 * 
 * The API is an event 'slideend' which occurs at the end of the drag
 * event of the handles.
 * 
 * the event sends the data associated with each handle to any listener.
 */
d3.caliperAPI = {};

d3.caliperAPI.init = function (initConditions)
{

    var initialPercents = initConditions.initialPercents;
    var handleSize = initConditions.handleSize;
   // var handleDisp = handleSize/2;
    var handleDisp = 0;
    var attachmentGPoint = initConditions.attachmentGPoint;
    var dim = 0;
    //this is the line for percentages
    var virtualLineWidth = 0;
    var dispatch = d3.dispatch("slideend");
    var formatPercent = d3.format(".2%");
    var caliperLineDraw = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return 0;
            });

    //draw the slider line





    /**
     * resize the the line position sliders according to 
     * @param {type} newSize
     * @returns {undefined}resiz
     */
    var resize = function (newSize)
    {
        dim = newSize;
        var existingLine = d3.selectAll(".caliperLine");
        if (existingLine.empty())
        {
            existingLine = attachmentGPoint
                    .append("path").attr("class", "caliperLine")
        }
        virtualLineWidth = newSize - handleSize;
        existingLine.attr("d", caliperLineDraw([{"x": handleDisp}, {"x": newSize  }]));
        if (handleLeft === undefined)
        {
            return;
        }
        else
        {
            //left
                        
            handleLeft.data()[0].x =  getPosForPercent(handleLeft.data()[0].percent);
            handleLeft.attr("transform", "translate(" +  (handleLeft.data()[0].x )+ ",0)")
            
            handleRight.data()[0].x =  getPosForPercent(handleRight.data()[0].percent);
            handleRight.attr("transform", "translate(" +  (handleRight.data()[0].x ) + ",0)")
            
 



        }

    }
    resize(initConditions.dim);

    /** 
     * given a percent return the x position for the handle it centers
     * on the box
     * @param {type} percent
     * @returns {undefined}
     */
    var getPosForPercent = function (percent)
    {
        var x = 0;
        if (percent < .1)
        {

        }
        else
        {
            x = virtualLineWidth * percent / 100;
            x = x - handleDisp;
        }



          console.log("getPosForPercent " + percent + " " + x)
        return x;
    };

    /**
     * return a percent give an x position
     * 
     * @param {type} pos
     * @returns {undefined}
     */
    var getPercentForPos = function (pos)
    {
        var t = parseFloat(
                formatPercent((pos+(handleDisp)) / (virtualLineWidth - (handleDisp))));
        if (t > 100)
            t = 100;

        if (t < 0)
            t = 0;
        // console.log("getpercentforpos "+pos+" "+t)
          t = Math.floor(t)
        return t;

    }

    /**
     * Handle mapping for drag. deal with:
     * 
     * cant go below zero
     * cant go over max
     * left cant exceed right
     * right cant go below left
     * 
     * @param {data} d
     * @param unselected handle as svg left or right
     * @returns {String}
     */
    var positionBoxForX = function (d, currentItem)
    {

        if (d.x < 0)
        {
            d.x = 0
        }
        var xLimit = virtualLineWidth - handleDisp;
        if (d.x > xLimit)
        {
            d.x = xLimit;
        }
        var handleId = null;

        try
        {
            handleId = d3.select(currentItem).attr("id");
        }
        catch (e)
        {
            //when first called during handle formation ignore error
        }
        if (handleId === "handleRight")
        {
            var hL = handleLeft.data()[0];

            if (d.x < hL.x + handleDisp)
            {
                d.x = hL.x + handleDisp;
            }


        }
        if (handleId === "handleLeft")
        {
            var hR = handleRight.data()[0];
            if (d.x > hR.x - handleDisp)
            {
                d.x = hR.x - handleDisp;
            }

        }



        return "translate(" + d.x + ",0)";
    }


    var stopPropagation = function () {
        d3.event.stopPropagation();
    };
    var drag = d3.behavior.drag()
            .on("drag", function (d, i) {
                d.x += d3.event.dx
                d.y = -handleSize/2;
                // console.log(d3.select(this).attr("id"))
                d.percent = getPercentForPos(d.x);
                d3.select(this).attr("transform", positionBoxForX(d, this))
            });



    drag.on('dragend', function () {

        //console.log(d3.event + " " + 'dragend')
        dispatch.slideend.apply(this, [handleLeft.data()[0], handleRight.data()[0]]);
    });


    var handleLeft =
            attachmentGPoint.append("rect")
            .attr("width", handleSize)
            .data([{"x": getPosForPercent(initialPercents[0]),
                    "y": -handleSize/2,
                    "handleSize": handleSize,
                    "percent": initialPercents[0], "id": "handleLeft"}])
            .attr("height", handleSize)
            .attr("x", 0)
            .attr("y", -handleSize/2)
            .attr("transform", "translate(" + getPosForPercent(initialPercents[0]) + ",0)")
            .attr("id", "handleLeft")
            .on("click", stopPropagation)
            .call(drag);

    var handleRight =
            attachmentGPoint.append("rect")
            .attr("width", handleSize)

            .data([{"x": getPosForPercent(initialPercents[1]),
                    "y": -handleSize/2,
                    "handleSize": handleSize,
                    "percent": initialPercents[1],
                    "id": "handleRight"}])
            .attr("height", handleSize)
            .attr("id", "handleRight")
            .attr("transform", "translate(" + getPosForPercent(initialPercents[1]) + ",0)")
            .attr("x", 0)
            .attr("y", -handleSize/2)
            .on("click", stopPropagation)
            .call(drag);


    // console.log("init dispatch")
    dispatch.slideend.apply(this, [handleLeft.data()[0], handleRight.data()[0]]);

    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }


    exports.resize = function (newSize)
    {
        resize(newSize);
    }


    /**
     * 
     *  expose the apis
     */
    exports.getPercentForPos = function (pixelValue)
    {
        return getPercentForPos(pixelValue);
    }
    exports.getPosForPercent = function (percent)
    {
        return getPosForPercent(percent);
    }

    /**
     * 
     * @returns {undefined}
     * return the data 
     */
    exports.queryData = function ()
    {
        var ret = null;
        if (typeof handleLeft.data()[0] !== 'undefined')
            ret =
                    {"left": handleLeft.data()[0], "right": handleRight.data()[0]};

        return ret;
    }

    /**
     * 
     * @param {type} data {"left": 35,"right":75}; mark one as null
     * left or right percentages to reposition to as floats
     * if you only want one repositioned.
     * @returns {undefined}reposition the markers based on percentage
     * 
     */
    exports.reposition = function (data)
    {

        if (data.left !== null)
        {
            var newPosLeft = getPosForPercent(data.left);
            var dataLeft = handleLeft.data()[0];
            dataLeft.x = newPosLeft;
            var transformString =
                    positionBoxForX(dataLeft, handleLeft[0][0]);
            dataLeft.percent = getPercentForPos(dataLeft.x);
            ;
            handleLeft.attr("transform", transformString);
        }
        if (data.right !== null)
        {
            var newPosRight = getPosForPercent(data.right);
            var dataRight = handleRight.data()[0];
            dataRight.x = newPosRight;
            var transformString =
                    positionBoxForX(dataRight, handleRight[0][0]);
            dataRight.percent = getPercentForPos(dataRight.x);
            handleRight.attr("transform", transformString);
        }
    }

    d3.rebind(exports, dispatch, "on");
    return exports;
}
