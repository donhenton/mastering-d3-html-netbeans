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
var imageCollection ;

function init()
{
    timer = d3.artTimer.clock.init(initTimer);
    imageCollection = d3.imageCollection.init({"attachmentId":"#imageCollection"});

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





  