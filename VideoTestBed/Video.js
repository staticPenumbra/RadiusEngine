/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains definitions for a video object
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              ResourceManager
 */
/**
 * @class
 * Class modeling a video with meta info for application development
 *
 * @description
 * All videos are interacted with through this class which establishes a standard contract for displaying video
 **/
 /**
 * @constructor
 */
var Video = function() {
	this.Name = "";
	this.Path = "";
	this.Repeat = false;
	//Allow a way to bookmark a time position in the video for restore
	this.SaveTimes = new Array();
	//Specify video order here for sequenced loading
	this.Order = 0;
}
//-----------------------------------------------------Get Accessors----------------------------------------------
/**
* Initialize the list of site pages
* @return {Array[]} Returns an array of Loaded Pages
*/
ResourceManager.prototype.Init = function(){
}
