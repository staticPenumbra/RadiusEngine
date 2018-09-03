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
	private Channels: NodeListOf<HTMLAudioElement>;
	private FreeChannels: HTMLAudioElement[];
	private UsedChannels: HTMLAudioElement[];
	private ClipTimeout: number;
	private ClipCache: RadiusAudio[];
	private Matches: RadiusAudio[];

    constructor(ADChannels: NodeListOf<HTMLAudioElement>){
		this.PlayingAudio = new Array();
		//Have to Convert the NodeList to an Array here
		const Elem = document.querySelectorAll(`.audio`);
	    //this.Channels = Array.prototype.slice.call(Elem);
		this.FreeChannels = new Array();
		this.UsedChannels = new Array();
	    this.ClipTimeout = null;
		this.ClipCache = new Array();
		this.Matches = new Array();
		this.Channels = ADChannels;
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
    * @param {NodeListOf<HTMLAudioElement>} Channels The Nodelist of Audio Channels to Manage
    */
    set SetAvailableChannels(Channels: NodeListOf<HTMLAudioElement>){
		   if(Channels){
				this.Channels = Channels;
				let CurrentController = this;
				for(let i = 0; i < Channels.length; i++){
					//Bind channel event listeners (Capture mode disabled for possible future support of Jquery)
					Channels[i].onended = function Test(e){CurrentController.AudioEnded(this, e)};
	}
		   }
	}
	//----------------------------------------------EVENT HANDLERS HERE------------------------------------------------
	 /**
    * Get the Array of playing audio channels
    * @returns {Array[]} Returns the Array of playing Audio Channels
    */
  	private AudioEnded(Ele: HTMLElement, Ev: Event){
		//Dont do anything?
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
    * Scan and find out if the Audio element is playing on a channel
   	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
    */
   	private RemovePlaying(ClipName: String, ClipIndex: Number){
		let Playing = this.PlayingAudio;
		for(let i in Playing){
			if(Playing[i].GetFilePath == ClipName && Playing[i].GetClipIdentifier == ClipIndex){
				//We have a match; remove it
				this.PlayingAudio.splice(Number(i), 1);	
			}
		}
	}	
	/**
    * Scan and find out if the Audio element is playing on a channel
   	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	* @typedef RadiusAudio[]
	* @type {Set}
	* @property {RadiusAudio}
    * @returns {RadiusAudio[]} A list of playing items matching the filters
    */
   	private GetPlayingItems(ClipName: String, ClipIndex: Number){
		let Playing = this.GetPlayingAudio;
		this.Matches = new Array();
		for(let i of Playing){
			if(i.GetFilePath == ClipName && i.GetClipIdentifier == ClipIndex){
				//We have a match; add to matches
				this.Matches.push(i);	
			}
		}
		//After creating match db tally up matches
		if(this.Matches.length == 0){
			//No Matches Found
			console.log("No matches found in GetPlayingItems");
		}
		return(this.Matches);
	}	
	/**
    * Event listener for an audio clip ending
    * @param {AudioController} instance A pointer to the running AudioController instance
    * @param {DOMElement[]} Channels A reference to the array of Audio channels from DOM
    */
    /*private AudioEnded(instance: AudioController, Channels: HTMLAudioElement[]){
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
	}*/
	/**
	* Stop all playing audio and reset the Audio Controller to a neutral state
	*/
	private Clean(){
		//Stop all playing Audio
		for(let i of this.UsedChannels){
			i.pause();
		}
		this.PlayingAudio = new Array();
	    this.Channels = null;
		this.FreeChannels = new Array();
		this.UsedChannels = new Array();
	    this.ClipTimeout = null;
        this.ClipCache = new Array();
	}
	/**
	* checks to make sure there is a free channel and reserves it
	* @returns {HTMLAudioElement} Returns a reference to a free Audio Element
	*/
	private GetFreeChannel(){
		if(this.FreeChannels.length > 0){
			//There Are channels available, allocate
			let channel = this.FreeChannels.pop();
			this.UsedChannels.push(channel);
			return(channel);
		}else{
			console.log("Allocation Error: No more free channels")
		}
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
		let Channel: HTMLAudioElement = this.GetFreeChannel();
		//0 indicates no channels free
		if(Channel){
			for(let i of this.ClipCache){
				if(i.GetFilePath == ClipName){
				//We found it so assign it 
					i.SetClipIdentifier(Number);
					this.AddToPlaying(i);
					Channel.src = i.GetFilePath.toString();
					Channel.play();
				}else{
				//There was no clip matching ClipName
				}
			}
		}else{
			alert("Out of free channels")
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
		let Playing = this.GetPlayingAudio;
		let Matches = Array();
		for(let i of Playing){
			if(i.GetFilePath == ClipName && i.GetClipIdentifier == ClipIndex){
				//We have a match; add to matches
				Matches.push(i);
				//set seek
				i.SetTrackPos(Value);
			}
		}
		//After creating match db tally up matches
		if(Matches.length == 0){
			//No Matches Found
			console.log("No matches found in SkipTo");
		}
	}
	/**
	* Stops audio associated with the object on the associated controller
	* @param {String} ClipName The name of the clip
	* @param {Number} ClipIndex A unique clip index
	*/
	//LOGIC FLOW
	//*Search the list of playing channels for the name and index
	//*Stop the specified controller
	//*Remove the channel from the list of playing channels
	public Stop(ClipName: String, ClipIndex: Number) {
		let PlayingChannels = this.UsedChannels;
		let PlayingAudio = this.GetPlayingItems(ClipName, ClipIndex);
		//Only stop if there are matches
		if(PlayingAudio.length > 0){
			for(let i of PlayingChannels){
				//Make sure the audio is registered to a channel and playing
				if(i.src == ClipName && i.paused != true){
					i.pause;
					this.RemovePlaying(ClipName, ClipIndex);
					console.log("stopped one audio track");
				}
			}
		}else{
			console.log("Could Not Stop audio clip because there were no matches");
		}
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
	public SetRepeating(ClipName: String, ClipIndex: Number, Flag: boolean){
		let Channels = this.UsedChannels;
		let AudioOBJ = this.GetPlayingItems;

		if(this.Matches.length > 0){
				//we have a match so 
			for(let i of this.Matches){
				i.SetRepeating(Flag);
				//Search the running Channels for the first instance
				let instance = Channels.filter(Running => Running.src === ClipName)[0];
				//Set the flag
				instance.loop = Flag;	
			}

		}else{
			//No matches
			console.log("Cant Set Repeating flag: unknown clipname or index");
		}
	}
}