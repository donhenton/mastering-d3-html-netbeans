/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global d3 */

var inAnimation = true;
var imageList = null;
var currentIdx = 0;
var baseZIndex = 100;
var midZIndex = 500;
var topZIndex = 1000;
var fadeLength = 1000;
var timerType = 0;
var timerRunning = false;
var svg;
var initTimer = {"attachmentId": "#clockTimer", "margin": 50, "clockRadius": 100,"svg":svg};
var timer;

function init()
{
    imageList = $('#imageCollection img');
    $(imageList[0]).fadeIn(10)
    $(imageList[0]).css("z-index", topZIndex);
    timer = d3.artTimer.clock.init(initTimer);


}

function changeTimer()
{
    timerType = (timerType + 1) % 3;
    timer.setTimerLength(timerType);
}

function toggleTimer(button)
{
    if (timerRunning)
    {
       timer.stopTimer();
       $(button).text("Start Timer");
    }
    else
    {
        timer.startTimer();
        
        $(button).text("Stop Timer");
    }
    timerRunning = !timerRunning;
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
    }

    currentIdx = (currentIdx + 1) % imageList.length;
}
;




  