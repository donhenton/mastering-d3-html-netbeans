/**
 * Artimer
 * 
 * This application will display a series of images with a delay
 * between transitions. The transition is an opacity fade. The images
 * may be of variable sizes, and the delay is set using a form field
 * on the page.
 * 
 * The array of images is defined as a javascript snippet on the html
 * page. (art_timer.html)
 * 
 */

/** globals **/
var imgArray = new Array(); // array to store preloaded images
var marker = 0; // the position in the image names array
var fFrac = 0.0; // fraction for opacity fading
var active = false; //is actively counting down
var imageSelectVar =null; // the image select dropdown
var timerCounter = 0; 
var maxTime = 10;
var countDownText = null;
var fileAnnouncementArea = null;

var ButtonStateEnum = {"stopped":1, "running":2};
//ButtonStateEnum.stopped
 
/*

JQuery initialization routine

*/
$(window).bind("load", function() {
	
	imageSelectVar = $('#imageSelect');
	countDownText = $("#countDownText");
	fileAnnouncementArea = $("#fileAnnouncementDiv"); 
	// preload the images	
	for (i = 0; i < imageNames.length; i++) {
		fileAnnouncementArea.html("loading image  " + (i+1) + " of " + imageNames.length);
		imgArray[i] = $('<img />').attr('src', imageNames[i]);
		imageSelectVar.append($('<option>', { value : i }).text(i+1));

	};	

	//set up the initial images
	
	setButtonState(ButtonStateEnum.stopped);
	nextImage = (marker + 1) % imageNames.length;
	$('#topImage').attr('src', imageNames[marker]);
	$('#bottomImage').attr('src', imageNames[nextImage]);
	$('#bottomImage').css('opacity',0.0); 
	$('#topImage').css('opacity',1.0); 
	setFileAnnouncementArea(marker);
	timerCounter = 0;
	countDownText.html(timerCounter);

	
	
});// end jquery init

/* set the text of the div that displays the image name */
function setFileAnnouncementArea(i)
{
   fileAnnouncementArea.html("Image: "+getImageName(i));
}


/* get an image name of the array safely */
function getImageName(i)
{
   j  = i;
   if (j < 0)
   {
      j = 0;
   }
   if (j >= imageNames.length)
   {
       j = imageNames.length - 1;
   }
   return imageNames[j];
}
/* the actual fading function called by the timer */
function fadeAction(i)
{
	fFrac = fFrac + 0.1;
	if (fFrac >= 1.0)
	{
		$("#imageContainer").stopTime('fadeActionJob');
		moveBottomToTop();
		loadTheBottomWithNext();
		fFrac = 0.0;
	}
	else
	{
	  $('#topImage').css('opacity',1.0-fFrac); 
	  $('#bottomImage').css('opacity',fFrac); 
	
	}
}



function doTheFade()
{
	
	$("#imageContainer").everyTime(100,'fadeActionJob', fadeAction);



}

function moveBottomToTop()
{
	// move the contents of bottom to top
	
	$('#topImage').attr('src', imageNames[marker]);
	$('#topImage').css('opacity',1.0);
	
}

function loadTheBottomWithNext()
{
	//load the bottom image with the next image
	nextImage = (marker + 1) % imageNames.length;
	$('#bottomImage').attr('src', imageNames[nextImage]);	
	$('#bottomImage').css('opacity',0.0);
 
}

/** reset the timer to zero */
function resetTimer()
{
	
	if (!active) {
		timerCounter = 0;
		countDownText.html(timerCounter);
	}
}
/** function used by the image select box */
function imageChange(selectBox)
{
  	 stopTimer();
  	 marker = selectBox.value;
  	 switchPicture(marker);
  	 timerCounter = 0;
	 countDownText.html(timerCounter);
  	 
}


function countDownJob(i) {
	$(this).html(timerCounter);
	timerCounter = timerCounter +1;
	if (timerCounter > maxTime) {
		countDownText.stopTime('countDownAction');
		t = 0;
		t =  parseInt(marker,10) + 1 ;
		t = t %  imageNames.length;
		marker = t;
		//marker is global
		switchPicture(marker);
		countDownText.everyTime(1000, 'countDownAction', countDownJob);
		timerCounter = 0;
		$(this).html(timerCounter);
		imageSelectVar.val(marker);  
		
		
	}
};

/** switch the images by fading */
function switchPicture(nextNumber)
{
	// modulo the submitted number
	nextNumber = nextNumber % imageNames.length;
	// set bottom image src to next number
	$('#bottomImage').attr('src', imageNames[nextNumber]);
	//fade the top zzz
	doTheFade();
	setFileAnnouncementArea(marker);
	
	

}
/** button code set the timer on the countDownText 
 * div this timer uses countDownJob as its call back
 *  */
function startTimer() {
	if (!active) {
		active = !active;
		maxTime = $('#maxTimeSelect').val();
		setButtonState(ButtonStateEnum.running);
		countDownText.everyTime(1000, 'countDownAction', countDownJob);
		
	}

}
/** button code */
function stopTimer() {
	if (active) {
		active = !active;
		setButtonState(ButtonStateEnum.stopped);
		countDownText.stopTime('countDownAction');
	}
}


function setButtonState(stateVar)
{
	
	switch (stateVar)
	{
	case 1:
		// the initial state
		/*
		$('#resetButton').removeAttr('disabled');
		$('#startButton').removeAttr('disabled');
		$('#stopButton').attr('disabled', 'disabled');
		 */
	break;
	case 2:
		// while running
		/*
		$('#resetButton').attr('disabled', 'disabled');
		$('#startButton').attr('disabled', 'disabled');
		$('#stopButton').removeAttr('disabled');
		*/
	 break;
	
	}


}



