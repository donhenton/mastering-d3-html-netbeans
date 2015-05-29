/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.imageCollection = {};

d3.imageCollection.init = function (initConditions)
{
    // var inAnimation = true;
    var imageList = null;
    var currentIdx = 0;
    var baseZIndex = 100;
    var midZIndex = 500;
    var topZIndex = 1000;
    var fadeLength = 1000;


    function init()
    {
        imageList = $(initConditions.attachmentId + ' img');
        $(imageList[0]).fadeIn(10);
        $(imageList[0]).css("z-index", topZIndex);

    }
    init();

    var advanceToNextImage = function ()
    {
        var nextIdx = (currentIdx + 1) % imageList.length;
        goToImage(nextIdx);
    };

    var goToImage = function (imageIndex)
    {
        console.log("goto " + imageIndex);
        if (imageIndex === currentIdx)
        {
            return;
        }

        var topImage = $(imageList[currentIdx]);
        var nextIdx = imageIndex;
        if (nextIdx === imageList.length)
        {
            throw "Image not found " + imageIndex;
        }

        var nextImage = $(imageList[nextIdx]);
        nextImage.css('z-index', midZIndex);
        topImage.fadeOut(fadeLength, function () {
            topImage.css('z-index', baseZIndex).hide();
            nextImage.css('z-index', topZIndex);

        });
        nextImage.fadeIn(fadeLength, function ()
        {
            // console.log("next done");
        });

        currentIdx = imageIndex;




    }

    /////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;


    exports.getCurrentIndex = function ()
    {
        return currentIdx;
    }
    exports.advanceToNextImage = function () {
        advanceToNextImage();
    }
    /**
     * this will load a selector list with the url of the img src
     * so if its a full url,it will look ungainly
     * 
     * @param {type} dropDowncssSelector the css selector to the 
     * select box
     * @returns {undefined}
     */
    exports.loadSelector = function (dropDowncssSelector)
    {

        imageList.each(function (i, d)
        {
            var imgName = $(d).attr("src");
            var t = "<option value=\"" + i + "\">" + imgName + "</option>"
            $(dropDowncssSelector).append(t);

        });
    }
    /**
     * go to a given image number and set the state be positioned on that
     * image
     * @param {type} selectorHtmlRef
     * @returns {undefined}
     * 
     */
    exports.goToImage = function (imageIndex)
    {

        goToImage(imageIndex);



    }

    return exports;
}
