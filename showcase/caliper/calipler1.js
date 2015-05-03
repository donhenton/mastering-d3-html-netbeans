/* global d3 */
d3.caliperAPI = {};

d3.caliperAPI.init = function (initConditions)
{
    var svg = initConditions.svg;
    var initialPercents = initConditions.initialPercents;
    var handleSize = initConditions.handleSize;

    var currentData = {"left": {}, "right": {}};


    var attachmentGPoint = initConditions.attachmentGPoint;
    var dim = initConditions.dim;
    //this is the line for percentages
    var virtualLineWidth = initConditions.dim - handleSize;
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
    attachmentGPoint.append("path").attr("class", "caliperLine")
            .attr("d", caliperLineDraw([{"x": handleSize / 2}, {"x": dim - handleSize}]));



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
            x = x - handleSize / 2;
        }



        // console.log("getPosForPercent " + percent + " " + x)
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
                formatPercent(pos / (virtualLineWidth - (handleSize / 2))));
        if (t > 100)
            t = 100;

        if (t < 0)
            t = 0;
        // console.log("getpercentforpos "+pos+" "+t)
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
     * @param {type} xpos
     * @returns {String}
     */
    var positionBoxForX = function (d, currentItem)
    {

        if (d.x < 0)
        {
            d.x = 0
        }
        var xLimit = virtualLineWidth - handleSize / 2;
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

            if (d.x < hL.x + handleSize / 2)
            {
                d.x = hL.x + handleSize / 2;
            }


        }
        if (handleId === "handleLeft")
        {
            var hR = handleRight.data()[0];
            if (d.x > hR.x - handleSize / 2)
            {
                d.x = hR.x - handleSize / 2;
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
                d.y = -handleSize / 2
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
                    "y": -handleSize / 2,
                    "percent": initialPercents[0], "id": "handleLeft"}])
            .attr("height", handleSize)
            .attr("x", 0)
            .attr("y", -handleSize / 2)
            .attr("transform", "translate(" + getPosForPercent(initialPercents[0]) + ",0)")
            .attr("id", "handleLeft")
            .on("click", stopPropagation)
            .call(drag);

    var handleRight =
            attachmentGPoint.append("rect")
            .attr("width", handleSize)

            .data([{"x": getPosForPercent(initialPercents[1]),
                    "y": -handleSize / 2,
                    "percent": initialPercents[1],
                    "id": "handleRight"}])
            .attr("height", handleSize)
            .attr("id", "handleRight")
            .attr("transform", "translate(" + getPosForPercent(initialPercents[1]) + ",0)")
            .attr("x", 0)
            .attr("y", -handleSize / 2)
            .on("click", stopPropagation)
            .call(drag);


    console.log("init dispatch")
    dispatch.slideend.apply(this, [handleLeft.data()[0], handleRight.data()[0]]);

    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }
    /**
     * 
     * @returns {undefined}return the data 
     */
    exports.queryData = function ()
    {
        return {"left": handleLeft.data()[0], "right": handleRight.data()[0]};
    }

    d3.rebind(exports, dispatch, "on");
    return exports;
}
