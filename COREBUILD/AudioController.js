"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @constructor
*/
var AudioController = /** @class */ (function () {
    function AudioController(ADChannels) {
        this.PlayingAudio = new Array();
        //Have to Convert the NodeList to an Array here
        var Elem = document.querySelectorAll(".audio");
        //this.Channels = Array.prototype.slice.call(Elem);
        this.FreeChannels = new Array();
        this.UsedChannels = new Array();
        this.ClipTimeout = null;
        this.ClipCache = new Array();
        this.Matches = new Array();
        this.Channels = ADChannels;
    }
    Object.defineProperty(AudioController.prototype, "UpdateAudioClips", {
        //----------------------------------------------SET METHODS--------------------------------------------------
        /**
        * Sets the list of available page audio clips
        * @param {RadiusAudio[]} Clips An array of current page audio clips
        */
        set: function (Clips) {
            this.ClipCache = Clips;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioController.prototype, "SetAvailableChannels", {
        /**
        * Sets the list of available page audio channels that the controller should manage and binds event handlers
        * @param {NodeListOf<HTMLAudioElement>} Channels The Nodelist of Audio Channels to Manage
        */
        set: function (Channels) {
            if (Channels) {
                this.Channels = Channels;
                var CurrentController_1 = this;
                //----------BEGIN DELETE--------------------
                //Bind channel event listeners(THIS CAN BE DELETED IF NOT USED)
                for (var i = 0; i < Channels.length; i++) {
                    //Bind channel event listeners(THIS CAN BE DELETED IF NOT USED)
                    Channels[i].onended = function Test(e) { CurrentController_1.AudioEnded(this, e); };
                }
                //----------END DELETE---------------------
            }
        },
        enumerable: true,
        configurable: true
    });
    //----------------------------------------------PLACE EVENT HANDLERS HERE(OR DELETE THIS SECTION)------------------------------------------------
    //---------------BEGIN DELETE------------------------
    /**
    * AudioEnded Event Handler for the Channels(CAN BE DELETED)
    */
    AudioController.prototype.AudioEnded = function (Ele, Ev) {
        //Dont do anything?
    };
    Object.defineProperty(AudioController.prototype, "GetPlayingAudio", {
        //--------------END DELETE-----------------------------
        //----------------------------------------------GET METHODS-------------------------------------------------
        /**
        * Get the Array of playing audio channels
        * @returns {Array[]} Returns the Array of playing Audio Channels
        */
        get: function () {
            return (this.PlayingAudio);
        },
        enumerable: true,
        configurable: true
    });
    /**
    * Retrieve a free channel from the pool and then set it to in use
    * @returns {AudioChannel} Free channel
    * Scan and find out if the Audio element is playing on a channel
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index for playing the same clip simultaneously
    */
    AudioController.prototype.RemovePlaying = function (ClipName, ClipIndex) {
        var Playing = this.PlayingAudio;
        for (var i in Playing) {
            if (Playing[i].GetFilePath == ClipName && Playing[i].GetClipIdentifier == ClipIndex) {
                //We have a match; remove it
                this.PlayingAudio.splice(Number(i), 1);
            }
        }
    };
    /**
    * Scan and find out if the Audio element is playing on a channel
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    * @typedef RadiusAudio[]
    * @type {Set}
    * @property {RadiusAudio}
    * @returns {RadiusAudio[]} A list of playing items matching the filters
    */
    AudioController.prototype.GetPlayingItems = function (ClipName, ClipIndex) {
        var Playing = this.GetPlayingAudio;
        this.Matches = new Array();
        for (var _i = 0, Playing_1 = Playing; _i < Playing_1.length; _i++) {
            var i = Playing_1[_i];
            if (i.GetFilePath == ClipName && i.GetClipIdentifier == ClipIndex) {
                //We have a match; add to matches
                this.Matches.push(i);
            }
        }
        //After creating match db tally up matches
        if (this.Matches.length == 0) {
            //No Matches Found
            console.log("No matches found in GetPlayingItems");
        }
        return (this.Matches);
    };
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
    AudioController.prototype.Clean = function () {
        //Stop all playing Audio
        for (var _i = 0, _a = this.UsedChannels; _i < _a.length; _i++) {
            var i = _a[_i];
            i.pause();
        }
        this.PlayingAudio = new Array();
        this.Channels = null;
        this.FreeChannels = new Array();
        this.UsedChannels = new Array();
        this.ClipTimeout = null;
        this.ClipCache = new Array();
    };
    /**
    * checks to make sure there is a free channel and reserves it
    * @returns {HTMLAudioElement} Returns a reference to a free Audio Element
    */
    AudioController.prototype.GetFreeChannel = function () {
        if (this.FreeChannels.length > 0) {
            //There Are channels available, allocate
            var channel = this.FreeChannels.pop();
            this.UsedChannels.push(channel);
            return (channel);
        }
        else {
            console.log("Allocation Error: No more free channels");
        }
    };
    /**
    * Add the RadiusAudio element to the array of playing Audio
    * @param {RadiusAudio} Audio Audio element to add to the list of playing audio tracks
    */
    AudioController.prototype.AddToPlaying = function (Audio) {
        this.PlayingAudio.push(Audio);
    };
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
    AudioController.prototype.PlayAudio = function (ClipName, ClipIndex) {
        //Get a free channel remember to release when done
        var Channel = this.GetFreeChannel();
        //0 indicates no channels free
        if (Channel) {
            for (var _i = 0, _a = this.ClipCache; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.GetFilePath == ClipName) {
                    //We found it so assign it 
                    i.SetClipIdentifier(Number);
                    this.AddToPlaying(i);
                    Channel.src = i.GetFilePath.toString();
                    Channel.play();
                }
                else {
                    //There was no clip matching ClipName
                }
            }
        }
        else {
            alert("Out of free channels");
            //No free channels
        }
    };
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
    AudioController.prototype.SkipTo = function (ClipName, ClipIndex, Value) {
        var Playing = this.GetPlayingAudio;
        var Matches = Array();
        for (var _i = 0, Playing_2 = Playing; _i < Playing_2.length; _i++) {
            var i = Playing_2[_i];
            if (i.GetFilePath == ClipName && i.GetClipIdentifier == ClipIndex) {
                //We have a match; add to matches
                Matches.push(i);
                //set seek
                i.SetTrackPos(Value);
            }
        }
        //After creating match db tally up matches
        if (Matches.length == 0) {
            //No Matches Found
            console.log("No matches found in SkipTo");
        }
    };
    /**
    * Stops audio associated with the object on the associated controller
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    */
    //LOGIC FLOW
    //*Search the list of playing channels for the name and index
    //*Stop the specified controller
    //*Remove the channel from the list of playing channels
    AudioController.prototype.Stop = function (ClipName, ClipIndex) {
        var PlayingChannels = this.UsedChannels;
        var PlayingAudio = this.GetPlayingItems(ClipName, ClipIndex);
        //Only stop if there are matches
        if (PlayingAudio.length > 0) {
            for (var _i = 0, PlayingChannels_1 = PlayingChannels; _i < PlayingChannels_1.length; _i++) {
                var i = PlayingChannels_1[_i];
                //Make sure the audio is registered to a channel and playing
                if (i.src == ClipName && i.paused != true) {
                    i.pause;
                    this.RemovePlaying(ClipName, ClipIndex);
                    console.log("stopped one audio track");
                }
            }
        }
        else {
            console.log("Could Not Stop audio clip because there were no matches");
        }
    };
    /**
    * Sets the specified audio clip to repeat
    * @param {String} ClipName The name of the clip
    * @param {Number} ClipIndex A unique clip index
    * @param {Boolean} RepeatFlag Boolean flag to set the clip to repeating
    */
    //LOGIC FLOW
    //*Search the list of playing channels for the name and index
    //*If we find it then set the repeating flag
    AudioController.prototype.SetRepeating = function (ClipName, ClipIndex, Flag) {
        var Channels = this.UsedChannels;
        var AudioOBJ = this.GetPlayingItems;
        if (this.Matches.length > 0) {
            //we have a match so 
            for (var _i = 0, _a = this.Matches; _i < _a.length; _i++) {
                var i = _a[_i];
                i.SetRepeating(Flag);
                //Search the running Channels for the first instance
                var instance = Channels.filter(function (Running) { return Running.src === ClipName; })[0];
                //Set the flag
                instance.loop = Flag;
            }
        }
        else {
            //No matches
            console.log("Cant Set Repeating flag: unknown clipname or index");
        }
    };
    return AudioController;
}());
exports.AudioController = AudioController;
