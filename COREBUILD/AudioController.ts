/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the implementation for the Audio controller
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
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
import { RadiusAudio } from "./RadiusAudio";

 /**
 * @constructor
 */
export class AudioController{
	private PlayingAudio: RadiusAudio[];
	private Channels: HTMLAudioElement[];
	private FreeChannels: HTMLAudioElement[];
	private UsedChannels: HTMLAudioElement[];
	private ClipTimeout: number;
	private ClipCache: RadiusAudio[];

    constructor(){
	    this.PlayingAudio = new Array();
	    this.Channels = null;
		this.FreeChannels = new Array();
		this.UsedChannels = new Array();
	    this.ClipTimeout = null;
        this.ClipCache = new Array();
    }
    //----------------------------------------------SET METHODS--------------------------------------------------
    /**
    * Sets the list of available page audio clips
    * @param {RadiusAudio[]} Clips An array of current page audio clips
    */
    set UpdateAudioClips(Clips: RadiusAudio[]){
	    	this.ClipCache = Clips;
    }
    /**
    * Sets the list of available page audio channels that the controller should manage and binds event handlers
    * @param {Array[]} Channels An array of Audio tag channels from the current page
    */
    set SetAvailableChannels(Channels: HTMLAudioElement[]){
		    let Audio = this.PlayingAudio;
		    let Free = this.FreeChannels;
		    this.Channels = Channels;
		    let instance = this;
		    //We need to set free channels to a clone of Channels so that changes do not affect Channels(Value not reference)
		    this.FreeChannels = new Array();
		    for(let i of Channels){
			    this.FreeChannels.push(i);
			    //Bind channel event listeners (Capture mode disabled for possible future support of Jquery)
			    i.onended = function Test(e){instance.AudioEnded(instance, e)};
		    }
    }
    //----------------------------------------------GET METHODS-------------------------------------------------
    /**
    * Get the Array of playing audio channels
    * @returns {Array[]} Returns the Array of playing Audio Channels
    */
    get GetPlayingAudio(){
            return(this.PlayingAudio);
    }
    /**
    * Retrieve a free channel from the pool and then set it to in use
    * @returns {AudioChannel} Free channel
    */
    get GetFreeChannel(){
	    if(this.FreeChannels.length > 0){
			let temp = this.FreeChannels[0];
			this.UsedChannels.push(temp);
		    this.FreeChannels.shift();
		    return(temp);
	    }
    }
    //-------------------------------------------------------------CHANNEL MANAGEMENT(PRIVATE FUNCTIONS)---------------------------------------
	 /**
    * Scan and find out if the Audio element is playing on a channel
    * @param {RadiusAudio} Audio A reference to an audio element
    * @returns {Boolean} true or false playing or not playing
    */
   private GetPlaying(Audio: RadiusAudio){
	for(let i of this.PlayingAudio){
		if(Audio == i){
			return(true);
		}
		return(false);
		}
	}	
	/**
    * Event listener for an audio clip ending
    * @param {AudioController} instance A pointer to the running AudioController instance
    * @param {DOMElement[]} Channels A reference to the array of Audio channels from DOM
    */
    private AudioEnded(instance: AudioController, Channels: HTMLAudioElement[]){
	    if(instance != null){
		    let Audio = instance.PlayingAudio;
		    let Free = instance.FreeChannels;
		    for(let i of this.PlayingAudio){
			    let item = i.GetFilePath; //Yes no parens are correct syntax
			    if(item == Channels.getAttribute().currentTarget.currentSrc){
				    //We've found the audio item so release the controller
				    let controller = Audio[i].GetController();
				    Free.push(controller);
				    Audio.splice(i, 1);
			    }
		    }
	    }
	}
	/**
	* Stop all playing audio and reset the Audio Controller to a neutral state
	*/
	private Clean(){
		//Stop all playing Audio
		for(let i of this.PlayingAudio){
			i.Pause();
		}
		this.PlayingAudio = new Array();
		//Free all channels
		this.FreeChannels = this.Channels;
		//Clear the clip cache
		this.ClipCache = new Array();
	}
	/**
	* Add the RadiusAudio element to the array of playing Audio
	* @param {RadiusAudio} Audio Audio element to add to the list of playing audio tracks
	*/
	private AddToPlaying(Audio: RadiusAudio){
			this.PlayingAudio.push(Audio);
	}
	//--------------------PUBLIC INTERFACE FUNCTIONS-----------------
	/**
	* Play a clip from a RadiusAudio object
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
	*/
	//LOGIC FLOW
	//*Get a free channel
	//*Assign variables to the free channel
	//*Set the channel to play
	//*Add Channel to the list of playing Channels
	public PlayAudio(ClipName: String, ClipIndex: Number){
		//Get a free channel remember to release when done
		let Channel = this.GetFreeChannel;
		//0 indicates no channels free
		if(Channel){
			for(let i of this.ClipCache){
				if(i.GetFilePath == ClipName){
				//We found it so assign it 
					i.SetClipIdentifier(Number);
					this.AddToPlaying(i);
					Channel.src = i.GetFilePath;
					Channel.play;
				}else{
				//There was no clip matching ClipName
				}
			}
		}else{
			alert("No free channels")
			//No free channels
		}
	}
	/**
	* Skips to the current time value in seconds given by "Value"
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	* @param {Float} Value The track starting position in seconds
	*/
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*If we find it then stop the track and set the start time to Value
	//*Set the channel to play
	public SkipTo(ClipName: String, ClipIndex: Number, Value: number) {
		document.getElementById(this.Controller).currentTime = Value;
	}
	/**
	* Stops audio associated with the object on the associated controller
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	* @param {AudioTagHandle} Controller Handle to the current HTML5 audio element 
	*/
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*Stop the specified controller
	//*Remove the channel from the list of playing channels
	public Stop(Controller: AudioController) {
		document.getElementById(Controller).pause();
	}
	/**
	* Sets the specified audio clip to repeat
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	* @param {Boolean} RepeatFlag Boolean flag to set the clip to repeating
	*/
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*If we find it then set the repeating flag
	public Repeat(Controller: AudioController){
    	document.getElementById(Controller).currentTime = 0;
	}
}