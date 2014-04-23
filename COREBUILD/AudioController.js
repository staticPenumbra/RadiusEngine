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
	this.PlayingAudio = new Array();
	this.Channels = null;
	this.FreeChannels = new Array();
	this.ClipTimeout = null;
	this.ClipCache = new Array();
}
//----------------------------------------------SET METHODS--------------------------------------------------
/**
* Sets the list of available page audio clips
* @param {Audio[]} Clips An array of current page audio clips
*/
AudioController.prototype.UpdateAudioClips = function(Clips){
	if(Clips != null){
		this.ClipCache = Clips;
	}
}
/**
* Sets the list of available page audio channels that the controller should manage and binds event handlers
* @param {Array[]} Channels An array of Audio tag channels from the current page
*/
AudioController.prototype.SetAvailableChannels = function(Channels){
	if(Channels != null){
		var Audio = this.PlayingAudio;
		var Free = this.FreeChannels;
		this.Channels = Channels;
		var instance = this;
		//We need to set free channels to a clone of Channels so that changes do not affect Channels(Value not reference)
		this.FreeChannels = new Array();
		for(var i = 0; i < this.Channels.length; i++){
			this.FreeChannels.push(Channels[i]);
			//Bind channel event listeners (Capture mode disabled for possible future support of Jquery)
			Channels[i].onended = function Test(e){instance.AudioEnded(instance, e)};
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
		for(var i = 0; i < this.PlayingAudio.length; i++){
			if(Audio == this.PlayingAudio[i]){
				return(true);
			}
		}
	return(false);
	}
}
//-------------------------------------------------------------UTILITY METHODS---------------------------------------
/**
* Event listener for an audio clip ending
* @param {AudioController} instance A pointer to the running AudioController instance
* @param {DOMElement[]} Channels A reference to the array of Audio channels from DOM
*/
AudioController.prototype.AudioEnded = function(instance, Channels){
	if(instance != null){
		var Audio = instance.PlayingAudio;
		var Free = instance.FreeChannels;
		for(var i = 0; i < Audio.length; i++){
			var item = Audio[i].GetFilePath();
			if(item == Channels.currentTarget.currentSrc){
				//We've found the audio item so release the controller
				var controller = Audio[i].GetController();
				Free.push(controller);
				Audio.splice(i, 1);
			}
		}
	}
}
/**
* Stop all playing audio and reset the Audio Controller to a neutral state
*/
AudioController.prototype.Clean = function(){
	//Stop all playing Audio
	for(var i = 0;i < this.PlayingAudio.length; i++){
		this.PlayingAudio[i].Pause();
	}
	this.PlayingAudio = new Array();
	//Free all channels
	this.FreeChannels = this.Channels;
	//Clear the clip cache
	this.ClipCache = new Array();
}
/**
* Play a clip from an audio object
* @param {Integer} Track The track number in the order it was loaded
* @param {Boolean} Repeat Flag indicating repeat clip or not
*/
AudioController.prototype.PlayAudio = function(Track, Repeat){
		if(Track != null && this.ClipCache != null){
			var AudioClip = this.ClipCache[Track];
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
/**
* Add the Audio element to the array of playing Audio
* @param {Audio} Audio Audio element to add to the list of playing audio tracks
*/
AudioController.prototype.AddToPlaying = function(Audio){
        if(Audio != null){
			this.PlayingAudio.push(Audio);
		}
}