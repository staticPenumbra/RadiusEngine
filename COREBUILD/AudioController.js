/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the implementation for the Audio controller
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Audio Controller
 */
/**
 * @class
 * Class modeling an Audio controller
 *
 * @description
 * This is the interface for interacting with the page audio controls.  Contains all playing audio
 **/
 /**
 * @constructor
 */
var AudioController = function() {
    //Default Constructor
	this.PlayingAudio = new Array();
	this.Channels = null;
	this.FreeChannels = new Array();
	this.ClipTimeout = null;	
}
//----------------------------------------------SET METHODS--------------------------------------------------
/**
* Sets the list of available page audio channels that the controller should manage
* @param {Array[]} Channels An array of Audio tag channels from the current page
*/
AudioController.prototype.SetAvailableChannels = function(Channels){
	if(Channels != null){
		this.Channels = Channels;
		//We need to set free channels to a clone of Channels so that changes do not affect Channels(Value not reference)
		this.FreeChannels = new Array();
		for(var i = 0; i < Channels.length; i++){
			this.FreeChannels.push(Channels[i]);
		}
	}
}
//----------------------------------------------GET METHODS-------------------------------------------------
/**
* Get the Array of playing audio channels
* @returns {Array[]} Returns the Array of playing Audio Channels
*/
AudioController.prototype.GetPlayingAudio = function(){
        if(this.PlayingAudio != null){
			return(this.PlayingAudio);
		}
}
/**
* Retrieve a free channel from the pool and then set it to in use
* @returns {AudioChannel} Free channel
*/
AudioController.prototype.GetFreeChannel = function(){
	if(this.FreeChannels.length > 0){
		var temp = this.FreeChannels[0];
		this.FreeChannels.splice(0, 1);
		return(temp);
	}
}
/**
* Scan and find out if the Audio element is playing on a channel
* @param {Audio} Audio A reference to an audio element
* @returns {Boolean} true or false playing or not playing
*/
AudioController.prototype.GetPlaying = function(Audio){
	if(Audio != null){
		/*return(!Audio.GetController().paused);*/
		return(true);
	}
}
//-------------------------------------------------------------UTILITY METHODS---------------------------------------
/**
* Free Channels that have finished playing
* @returns {Integer} Returns the number of channels freed
*/
AudioController.prototype.Maintain = function(){
	//Look for clips that have finished playing and free the channels
	var Playing = null;
	var Timeout = null;
	//If it's not playing or timed out then free it
	for(var i = 1; i < this.PlayingAudio.length; i++){
		//Get audio runtime and compare it to set length
		Timeout = this.GetTimeout(this.PlayingAudio[i]);
		Playing = this.GetPlaying(this.PlayingAudio[i]);
		if(Timeout == true || Playing == false){
			//We are done so free the channel
			var Controller = this.PlayingAudio[i].GetController();
			//pause
			Controller.pause();
			//remove from Audio element
			this.PlayingAudio[i].SetController(null);
			//Add to free
			this.PlayingAudio.splice(i, 1);
			//Decrement i because an element is removed
			i = i - 1;
			this.FreeChannels.push(Controller);
		}
	}
}
/**
* Pause and reset the list of playing Audio 
*/
AudioController.prototype.Clean = function(){
	for(var i = 0;i < this.PlayingAudio.length; i++){
		this.PlayingAudio[i].Pause();
	}
	this.PlayingAudio = new Array();
}
//-------------------------------------------------------OBSOLETE-------------------------
/**
* Play a clip on an Audio object
* @param {String} Type The Audio clip type either Music or Sound
* @param {Integer} Track The track number in the order it was loaded
* @param {Array[]} AudioElements The array of audio elements to use
* @param {Boolean} Repeat Flag indicating repeat clip or not
*/
AudioController.prototype.PlayAudio = function(Type, Track, AudioElements, Repeat){
		if(Type != null && Track != null && AudioElements != null){
			if(Type == "Music"){
			//Audio Array element 0
			var AudioClip = AudioElements[Track];
				if(this.FreeChannels.length > 0){
					if(Repeat == true){
						AudioClip.SetRepeating(true);
					}else{
						AudioClip.SetRepeating(false);
					}
					AudioClip.SetController(this.GetFreeChannel());
					this.AddToPlaying(AudioClip);
					AudioClip.Play(AudioClip.GetController());
				}
			}
			if(Type == "Sound"){
			//Audio array element 1
			var AudioClip = AudioElements[1][Track];
				if(this.FreeChannels.length > 0){
					if(Repeat == true){
						AudioClip.SetRepeating(true);
					}else{
						AudioClip.SetRepeating(false);
					}
					AudioClip.SetController(this.GetFreeChannel());
					this.AddToPlaying(AudioClip);
					AudioClip.Play(AudioClip.GetController());
				}
			}
		}
}
//-----------------------------------------------------------------------------------------------------------
/**
* Add the Audio element to the array of playing Audio
* @param {Audio} Audio Audio element to add to the list of playing audio tracks
*/
AudioController.prototype.AddToPlaying = function(Audio){
        if(Audio != null){
			this.PlayingAudio.push(Audio);
		}
}