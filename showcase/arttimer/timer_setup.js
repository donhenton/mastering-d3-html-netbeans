/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global d3 */




var timerType = 0;
var timerRunning = false;
var svg;
var initTimer = {"attachmentId": "#clockTimer", "margin": 50, "clockRadius": 100, "svg": svg};
var timer;
var imageCollection;

/**
 * set up the environment
 * @returns {undefined}
 */
function init()
{
    timer = d3.artTimer.clock.init(initTimer);
    imageCollection = d3.imageCollection.init({"attachmentId": "#imageCollection"});
    imageCollection.loadSelector("#imageSelector");


    timer.on("onStopTimer", function (interrupt) {

        // console.log("in setup timerRunning is " + timerRunning);

        if (interrupt)
        {
            $("#timerButton").text("Start Timer");
            timerRunning = false;
        }
        else
        {
            timerRunning = true;
            imageCollection.advanceToNextImage();
            timer.startTimer();
        }



    });
}
/**
 * called by button Change Timer, which select 1 of 3 time lengths
 * 60,120, and 300 seconds 
 * 
 * 
 * @returns {undefined}
 */
function changeTimer()
{
    timerType = (timerType + 1) % 3;
    timer.setTimerLength(timerType);
}

/**
 * toggle the timer on and off
 * @param {type} button
 * @returns {undefined}
 */
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

/**
 * use the selector to position the image collection
 * 
 * @param {type} selector
 * @returns {undefined}
 */
function goToImage(selector)
{
    imageCollection.goToImage(parseInt($(selector).val()));
}
/**
 * called by advance image button
 * 
 * @returns {undefined}
 */
function advanceToNextImage()
{
   
    imageCollection.advanceToNextImage();
    var currentIdx = imageCollection.getCurrentIndex();
     $('#imageSelector').val(currentIdx);
}

  