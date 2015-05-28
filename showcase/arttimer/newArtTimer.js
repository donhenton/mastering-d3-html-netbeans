/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var totalImages = 6;
var currentImageIdx = 0;
var inAnimation = true;
var timerVar = null;
var imageList = null;
var currentIdx = 0;
var baseZIndex = 100;
var midZIndex = 500;
var topZIndex = 1000;
var fadeLength = 1000;


function init()
{
    imageList = $('#imageCollection img');
    $(imageList[0]).fadeIn(10)
    $(imageList[0]).css("z-index", topZIndex);
    
}





function doFade()
{
    inAnimation = true;
    // fElement.find('img:gt(0)').hide();

    if (inAnimation)
    {


        var topImage = $(imageList[currentIdx]);
        var nextIdx = currentIdx + 1;
        if (nextIdx === imageList.length)
        {
            nextIdx = 0;
        }
        console.log("top "+currentIdx+" next "+nextIdx)
        var nextImage = $(imageList[nextIdx]);
        nextImage.css('z-index', midZIndex);
        topImage.fadeOut(fadeLength, function () {
            topImage.css('z-index', baseZIndex).hide();
            nextImage.css('z-index', topZIndex);
            console.log("top done");

        });
        nextImage.fadeIn(fadeLength,function()
        {
            console.log("next done");
        });
       
    }

    currentIdx = (currentIdx + 1) % imageList.length;
 
};

  