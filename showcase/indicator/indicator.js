/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.indicator = {};

/**
 * Wait indicator component. The initConditions object contains the
 * following:
 * attachmentGroup: a svg g element for attaching
 * 
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

    var dotContainer = initConditions.attachmentGroup
            .append('g').attr("class", "dotContainer");

    for (var i = 1; i <= 5; ++i) {
        var cc = dotContainer.append('circle')

                .attr("class", "indicatorCircle")
                .attr('cx', i * 20)
                .attr('r', rMin)
                .attr('cy', 50);
        circleArray.push(cc);

    }



    var makeCallback = function () {

        // note that we're returning a new callback function each time
        return function (  ) {

            if (!isVisible)
            {
                return true;
            }
            var currentCircle = circleArray[ct];

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

    };

    exports.show = function (isVisibleState)
    {
        isVisible = isVisibleState;
        if (isVisible)
        {
            dotContainer.style("display", "block");
            d3.timer(makeCallback(), 0, interval);
        }
        else
        {

            dotContainer.style("display", null);
        }
    }


    //expose the public api
    return exports;
}