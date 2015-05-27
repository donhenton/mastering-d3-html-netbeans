

d3.indicator = {};

/**
 * Wait indicator component. The initConditions object contains the
 * following:
 * attachmentGroup: a svg g element for attaching
 * this g element can be translated to a position of interest, say
 * the center of a block
 * 
 * @param {type} initConditions
 * @returns {d3.indicator.init.exports}
 */

d3.indicator.init = function (initConditions)
{

    var interval = 150;  // the animation interval
    var ct = 0;
    var circleArray = []; // array for storing the circles
    var rMin = 6; // min max of radius
    var rMax = 8;
    var isVisible = false;
    var sizeAttributes = {"width":150,"height":80}


    var dotContainer = initConditions.attachmentGroup
            .append('g').attr("class", "dotContainer");
    
   //  dotContainer.append("rect").attr("fill","transparent")
   //          .attr("stroke","darkblue").attr("width",150).attr("height",80).attr("x",-10)

    dotContainer.append("svg:text")
            .attr("class", "indicator_text")
            .attr("font-size",20)
            .attr("font-family","Verdana")
            .text(function (d, i) {
                return  "Processing ...";
            })
            .attr("dy", "27.00")

    for (var i = 0; i <= 5; ++i) {
        var cc = dotContainer.append('circle')

                .attr("class", "indicator_indicatorCircle")
                .attr('cx', 10+(i * 20))
                .attr('r', rMin)
                .attr('fill',"darkred")
                .attr('cy', 50);
        circleArray.push(cc);

    }



    var makeCallback = function () {

        // note that we're returning a new callback function each time
        return function (  ) {

            if (!isVisible)
            {
                // console.log("bail");
                return true;
            }
            var currentCircle = circleArray[ct];
            // console.log("processing "+ct)
            var prevIdx = ct - 1;
            if (prevIdx < 0)
            {
                prevIdx = circleArray.length - 1;
            }
            var prevCircle = circleArray[prevIdx];

            prevCircle.transition().attr('r', rMin);
            currentCircle.transition().attr('r', rMax);
            d3.timer(makeCallback(), interval);
            ct = ((ct + 1) % circleArray.length);

            return true;
        }
    };





    /////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;

    /**
     * return the height and width for centering purposes
     * @returns {undefined} 
     */
    exports.getSizeAttributes = function()
    {
      var ret = {};
      
      
      ret.width  = sizeAttributes.width;
      ret.height = sizeAttributes.height;
      
      return ret;
    }

    exports.show = function (isVisibleState)
    {
        isVisible = isVisibleState;
        if (isVisible)
        {
            //dotContainer.transition().delay(200).style("display", "block");
            dotContainer.transition().attr("opacity", "1");
            d3.timer(makeCallback(), 0, interval);
        }
        else
        {

            dotContainer.transition().delay(200).attr("opacity", "0");
        }
    }


    //expose the public api
    dotContainer.transition().attr("opacity", "0");
    return exports;
}