/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


d3.rectHandler = {};


d3.rectHandler.init = function (brushRectVal,xAxis)
{
    var brushRect =  brushRectVal;
    //console.log("brushRect "+brushRect.attr("class"))
    
/////////// PUBLIC API//////////////////////////////////////////////
    function exports()
    {

    }
    ;    
    
    exports.positionRect= function(left,right)
    {
         console.log(left.percent+" "+right.percent);
    }
     
    return exports;
};//end init