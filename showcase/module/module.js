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

}