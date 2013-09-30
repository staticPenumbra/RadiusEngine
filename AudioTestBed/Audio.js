/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main object implementing audio controls for the HTML5 Audio player
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Audio
 */
/**
 * @class
 * Class modeling an Audio element
 *
 * @description
 * The current audio output tag is operated through this Audio class
 **/
 /**
 * @constructor
 */
var Audio = function(TVZ_AudioFile, TVZ_Repeating, TVZ_Volume, TVZ_Duration, TVZ_Format) {
    //Default Constructor
	this.AudioFile = TVZ_AudioFile;
	this.RepeatingFlag = TVZ_Repeating;
	this.Volume = TVZ_Volume;
	this.Duration = TVZ_Duration;
	this.Format = TVZ_Format;
	this.Controller = null;	
}
//-------------------------------------------------------------SET METHODS---------------------------
/**
* Set Repeat flag 
* @param {Boolean} Repeat Sets the Audio clip to either repeat or not repeat
*/
Audio.prototype.SetRepeating = function(Repeat){
	if(Repeat != null){
       this.RepeatingFlag = Repeat;
	}
}
/**
* Sets the current controller of the Audio object takes in an <audio> tag id string
* @param {AudioTagHandle} Controller Handle to the current HTML5 audio element 
*/
Audio.prototype.SetController = function(Controller){
        this.Controller = Controller;
}
/**
* Set Timeout
* @param {Array[]} MinutesAndSeconds Sets the Audio clip timeout
*/
Audio.prototype.SetClipTimeout = function(MinutesAndSeconds){
	if(MinutesAndSeconds != null && MinutesAndSeconds[0] != null && MinutesAndSeconds[1] != null){
       this.Duration = MinutesAndSeconds;
	}
}
//----------------------------------------------------------GET METHODS-------------------------------
/**
* Get Timeout
* @returns {Array[]} Gets the Audio clip timeout
*/
Audio.prototype.GetClipTimeout = function(){
	if(this.Duration[0] != null && this.Duration[1] != null){
       return(this.Duration);
	}
}
/**
* Get the Audio file string
* @returns {String} Returns the AudioFile path contained in the audio object
*/
Audio.prototype.GetFilePath = function(){
        return(this.AudioFile);
}
/**
* Gets the current controller of the Audio object 
* @returns {AudioController} The controller registered with the current Audio object
*/
Audio.prototype.GetController = function(){
    if(this.Controller != null){
        return(this.Controller);
    }
}
//-----------------------------------------------------------UTILITY METHODS----------------------------------
/**
* Pauses the current audio associated with the audio object
*/
Audio.prototype.Pause = function() {
    if(this.Controller != null){   
		this.Controller.pause();
	}
}
/**
* Plays the current audio associated with the audio object
*/
Audio.prototype.Play = function() {
    if(this.Controller != null){   
        if(this.RepeatingFlag == true){
            this.Controller.setAttribute("loop", "loop" );
        }
		if(this.RepeatingFlag == false){
			this.Controller.loop = false;
		}
	this.Controller.setAttribute("src", this.AudioFile);
	this.Controller.play();
	}
}
/**
* Stops audio associated with the object on the associated controller
* @param {AudioTagHandle} Controller Handle to the current HTML5 audio element 
*/
Audio.prototype.Stop = function(Controller) {
    if(this.Controller != null){
	document.getElementById(this.Controller).pause();
	}
}
/**
* Restarts the playing audio associated with the object on the current controller
*/
Audio.prototype.Repeat = function() {
    if(this.Controller != null){
    document.getElementById(this.Controller).currentTime = 0;
    }
}
/**
* Skips to the current time value in seconds given by "Value"
* @param {Float} Value The track starting position in seconds
*/
Audio.prototype.SkipTo = function(Value) {
    if(this.Controller != null){
        try{
            document.getElementById(this.Controller).currentTime = Value;
        }
        catch(err){
        var txt="Audio.js code: 0x101Z|-|4x: Invalid time value. Please enter the number of seconds in decimal\n\n";
            txt+="Click OK to continue.\n\n";
            alert(txt);
        }
    }	
}