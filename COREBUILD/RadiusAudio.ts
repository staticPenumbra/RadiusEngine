/*----------------------------------------------------------------------------------------------------------
::“Copyright 2018 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main object implementing audio controls for the HTML5 Audio player
 *
 * @author Clayton Burnett <the82professional@hotmail.com>
 */
 
/**
 * ###############################################################################################################
 *                                              RadiusAudio
 */
/**
 * @class
 * Class modeling an Audio clip
 *
 * @description
 * The current audio output tag is operated through this Audio class
 **/
 /**
 * @constructor
 */
export class RadiusAudio{
    private AudioFile: String;
    private RepeatingFlag: boolean;
    private Volume: number;
    private Duration: number;
    private Format: string;
    private Playing: boolean;
    private SavedTrack: number;
    private ID: number;

    constructor(readonly TVZ_AudioFile: string, readonly TVZ_Repeating: boolean, readonly TVZ_Volume: number, readonly TVZ_Duration: number,  readonly TVZ_Format: string){
        //Default Constructor
	    this.AudioFile = new String(TVZ_AudioFile);
	    this.RepeatingFlag = TVZ_Repeating;
	    this.Volume = TVZ_Volume;
	    this.Duration = TVZ_Duration;
	    this.Format = TVZ_Format;
        this.Playing = false;
        this.SavedTrack = 0.0;
        this.ID = 0.0;
    }
    //-------------------------------------------------------------SET METHODS---------------------------
    /**
    * Set Repeat flag 
    * @param {Boolean} Repeat Sets the Audio clip to either repeat or not repeat
    */
    set SetRepeating(Repeat){
           this.RepeatingFlag = Repeat;
    }
    /**
    * Set Timeout
    * @param {Array[]} MinutesAndSeconds Sets the Audio clip timeout
    */
    set SetClipTimeout(MinutesAndSeconds){
            this.Duration = MinutesAndSeconds;
    }
    /**
    * Sets the current playtime value in seconds given by "Value"
    * @param {Float} Value The track starting position in seconds
    */
    set SetTrackPos(Seconds){
        this.SavedTrack = Seconds;
    }
    /**
    * Sets the unique instance ID of the Audio object for playing the same clip simultaneously
    * @param {number} ID A unique number ID
    */
    set SetClipIdentifier(ID){
        this.ID = ID;
    }
    //----------------------------------------------------------GET METHODS-------------------------------
    /**
    * Gets the current playtime value in seconds given by "Value"
    * @returns {Float} The current track position in seconds
    */
    get GetTrackPos(){
        return(this.SavedTrack);
    }
    /**
    * Get Timeout
    * @returns {Array[]} Gets the Audio clip timeout
    */
    get GetClipTimeout(){
            return(this.Duration);
    }
    /**
    * Get the Audio file string
    * @returns {String} Returns the AudioFile path contained in the audio object
    */
    get GetFilePath(){
        return(this.AudioFile.toString());
    }
      //-----------------------------------------------------------UTILITY METHODS----------------------------------   
    /**
    * Pauses the current audio associated with the audio object
    */
    /*public Pause = function() {
        if(this.Controller != null){   
            this.Playing = false;
            //************STUB STORE THE CURRENT PLAYTIME SO WE CAN CONTINUE PLAYING LATER
	    }
    }*/
    /**
    * Plays the current audio associated with the audio object
    */
    /*public Play = function() {
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
    }*/
}