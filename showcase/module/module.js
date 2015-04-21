/**
 * 
 *  
 */
Plugin = {};

Plugin.init = function (v)
{
    //private variables
    var height = v;
    var width = 0;

    //private function
    function rand( ) {
        return Math.floor(Math.random() * (50 + 1));
    }
    ;

    //private function;
    function computeRatio()
    {
        var v = -99;
        width = rand();
        if (width === 0)
        {
            v = 0;
        }
        else
        {
            v = height / width;
        }

        return v;
    }
    ;
    // the function that is the basis for exporting public 'stuff'
    function exports()
    {
        return "hello";
    }
    ;



    //public
    exports.getWidth = function ( )
    {
        return width;
    };

    //public
    exports.getHeight = function ( )
    {
        return height;
    };

    exports.getRatio = function ()
    {
        var v = computeRatio();
        var info = "ratio " + v + " [h,w] [" + exports.getHeight() + "," + exports.getWidth() + "]";
        return info;
    };

    return exports;
};


var D3Obj = {};
D3Obj.init = function (d)
{
    var dataset = d;
    var svg = null;
    var margin = {top: 5, right: 40, bottom: 50, left: 60};
    var width = 200;
    var height = 200;
    var done = false;
    var Graph = function () {
    };

    Graph.initializeSVG = function ()
    {
        //only run once
        done = true; 
        svg = d3.select("#textArea3")
                .append("svg")
                .attr("height", height + margin.top + margin.bottom).attr("width", width + margin.left + margin.right)
                
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("stroke","blue").attr("fill","goldenrod")
                .attr("width", width)
                .attr("height", height);


        var dots = svg.selectAll("circle").data(dataset);

        dots.enter().append("circle")
                .attr("fill", "blue")
                .attr("r", 5)
                .attr("class", "dot")
                .attr("cx", function (d, i) {
                //  variable this is the svg circle object at this point
                   console.log(i + " [" + this.cx.baseVal.value + "," + this.cy.baseVal.value + "] "+this);
                    return d * 7;
                })
                .attr("cy", function (d) {
                    return d * 7;
                });

    };

    Graph.isDone = function(){ return done;};
    return Graph;
};

var dataset = [5, 10, 15, 20, 25];
var d3Thing = D3Obj.init(dataset);


function demo()
{
    var functions = Plugin.init(100);
    //functions.setHeight(100);
    var t = "Area 1 current ratio: " + functions.getRatio();
    t = t + " --- from external getters [" + functions.getHeight() + ","
            + functions.getWidth() + "]";
    $("#textArea1").html(t);

    //export is a function so you can call it
    console.log("all by itself " + functions());
    //rand() is private so an error
    try
    {
        functions.rand();
    }
    catch (e)
    {
        console.log(e);
    }
    var functions2 = Plugin.init(50);

    var j = "Area 2 current ratio: " + functions2.getRatio();
    j = j + " --- from external getters [" + functions2.getHeight() + ","
            + functions2.getWidth() + "]";
    $("#textArea2").html(j);

    if (d3Thing.isDone()=== false)
        d3Thing.initializeSVG();

}