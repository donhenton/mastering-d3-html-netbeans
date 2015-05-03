/* global d3 */
d3.caliperAPI = {};

d3.caliperAPI.init = function (initConditions)
{
    var svg = initConditions.svg;
    var initialPercents = [0, 100];
    var rectDim = 20.0; //size of knob slider
    var attachmentGPoint = initConditions.attachmentGPoint;
    var dim = initConditions.dim;
    //this is the line for percentages
    var virtualLineWidth = initConditions.dim - rectDim;
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
            .attr("d", caliperLineDraw([{"x": rectDim / 2}, {"x": virtualLineWidth}]));


    /** 
     * given a percent return the x position for the handle it centers
     * on the box
     * @param {type} percent
     * @returns {undefined}
     */
    var getPosForPercent = function (percent)
    {
        var x = virtualLineWidth * percent / 100;
        x = x - rectDim / 2;

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
        var t =  parseFloat(
                formatPercent(pos / virtualLineWidth));
        if (t > 100)
            t = 100;
        
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
    var positionBoxForX = function (d)
    {

        if (d.x < 0)
        {
            d.x = 0
        }
        var xLimit = virtualLineWidth- rectDim/2;
        if (d.x >  xLimit)
        {
            d.x =  xLimit;
        }
        console.log("limit "+ xLimit +" xpos " + d.x + " % " + d.percent)
        return "translate(" + d.x + ",0)";
    }


    var stopPropagation = function () {
        d3.event.stopPropagation();
    };


    var drag = d3.behavior.drag();

    var drag = d3.behavior.drag()
            .on("drag", function (d, i) {
                d.x += d3.event.dx
                d.y = -rectDim / 2
                d.percent = getPercentForPos(d.x+ (rectDim/2));
                d3.select(this).attr("transform", positionBoxForX(d))
            });



    drag.on('dragend', function () {
        //dispatch.slideend(d3.event, value);
        console.log(d3.event + " " + 'dragend')
    });


    var initLeftData = {"x": getPosForPercent(initialPercents[0]),
        "percent": initialPercents[0]
    };
    //d3.event.sourceEvent.target.id
    var handleLeft =
            attachmentGPoint.append("rect")
            .attr("width", rectDim)
            .attr("fill", "red")
            .attr("opacity", ".25")
//            .attr("stroke","red")
//            .attr("stroke-width","2")
            .data([{"x": getPosForPercent(initialPercents[0]),
                    "y": -rectDim / 2,
                    "percent": initialPercents[0], "id": "handleLeft"}])
            .attr("height", rectDim)
            .attr("x", 0)
            .attr("y", -rectDim / 2)
            .attr("transform", positionBoxForX(initLeftData))
            .attr("id", "handleLeft")
            .on("click", stopPropagation)
            .call(drag);
    var initRightData = {"x": getPosForPercent(initialPercents[1]),
        "percent": initialPercents[1]
    };
    var handleRight =
            attachmentGPoint.append("rect")
            .attr("width", rectDim)
            .attr("opacity", ".25")
            .attr("fill", "#4444cc")
            .data([{"x": getPosForPercent(initialPercents[1]),
                    "y": -rectDim / 2,
                    "percent": initialPercents[1],
                    "id": "handleRight"}])
            .attr("height", rectDim)
            .attr("id", "handleRight")
            .attr("transform", positionBoxForX(initRightData))
            .attr("x", 0)
            .attr("y", -rectDim / 2)
            .on("click", stopPropagation)
            .call(drag);




    ///// PUBLIC API //////////////////////////////////////////////////////
    var exports = function ()
    {

    }

    return exports;
}
