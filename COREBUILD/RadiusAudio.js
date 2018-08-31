"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
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
var RadiusAudio = /** @class */ (function () {
    function RadiusAudio(TVZ_AudioFile, TVZ_Repeating, TVZ_Volume, TVZ_Duration, TVZ_Format) {
        this.TVZ_AudioFile = TVZ_AudioFile;
        this.TVZ_Repeating = TVZ_Repeating;
        this.TVZ_Volume = TVZ_Volume;
        this.TVZ_Duration = TVZ_Duration;
        this.TVZ_Format = TVZ_Format;
        //Default Constructor
        this.AudioFile = new String(TVZ_AudioFile);
        this.RepeatingFlag = TVZ_Repeating;
        this.Volume = TVZ_Volume;
        this.Duration = TVZ_Duration;
        this.Format = TVZ_Format;
        this.Playing = false;
        this.SavedTrack = 0.0;
    }
    Object.defineProperty(RadiusAudio.prototype, "SetRepeating", {
        //-------------------------------------------------------------SET METHODS---------------------------
        /**
        * Set Repeat flag
        * @param {Boolean} Repeat Sets the Audio clip to either repeat or not repeat
        */
        set: function (Repeat) {
            this.RepeatingFlag = Repeat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadiusAudio.prototype, "SetClipTimeout", {
        /**
        * Set Timeout
        * @param {Array[]} MinutesAndSeconds Sets the Audio clip timeout
        */
        set: function (MinutesAndSeconds) {
            this.Duration = MinutesAndSeconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadiusAudio.prototype, "SetTrackPos", {
        /**
        * Sets the current playtime value in seconds given by "Value"
        * @param {Float} Value The track starting position in seconds
        */
        set: function (Seconds) {
            this.SavedTrack = Seconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadiusAudio.prototype, "GetTrackPos", {
        //----------------------------------------------------------GET METHODS-------------------------------
        /**
        * Gets the current playtime value in seconds given by "Value"
        * @returns {Float} The current track position in seconds
        */
        get: function () {
            return (this.SavedTrack);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadiusAudio.prototype, "GetClipTimeout", {
        /**
        * Get Timeout
        * @returns {Array[]} Gets the Audio clip timeout
        */
        get: function () {
            return (this.Duration);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadiusAudio.prototype, "GetFilePath", {
        /**
        * Get the Audio file string
        * @returns {String} Returns the AudioFile path contained in the audio object
        */
        get: function () {
            return (this.AudioFile.toString());
        },
        enumerable: true,
        configurable: true
    });
    return RadiusAudio;
}());
exports.RadiusAudio = RadiusAudio;
/**
* Stops audio associated with the object on the associated controller
* @param {AudioTagHandle} Controller Handle to the current HTML5 audio element
*/
/*Audio.prototype.Stop = function(Controller) {
    if(this.Controller != null){
    document.getElementById(this.Controller).pause();
    }
}*/
/**
* Restarts the playing audio associated with the object on the current controller
*/
/*Audio.prototype.Repeat = function() {
    if(this.Controller != null){
    document.getElementById(this.Controller).currentTime = 0;
    }
}*/
