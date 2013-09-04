/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main Application engine object implementing Timer/Flow control/Event Manager
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Updater
 */
/**
 * @class
 * Class modeling the Application engine Timer, Event Manager and Flow Control
 *
 * @description
 * Events are registered with the Updater, as well as the list of current Application entities
 **/
 /**
 * @constructor
 */
var Updater = function() {
	this.Cycle = new Date(); //The current Application cycle
	this.Paused = false; //Whether the Application is paused or not
	this.ApplicationSpeedThrottle = 0; //Application speed throttle, 0 is uninhibited
}
//------------------------------------------------GET METHODS-----------------------------------------
//Returns returns true if the Application is paused false otherwise
/**
* @returns {Boolean} Returns whether the engine is paused or not
*/
Updater.prototype.IsPaused = function() {
    if(this.Paused != null){
		return(this.Paused);
	}
}
//-----------------------------------------------SET METHODS------------------------------------------
//Sets the Application engine pause flag for interrupt events
/**
* @param {Boolean} Flag Whether to set the engine to paused or unpaused
*/
Updater.prototype.SetPaused = function(Flag) {
    if(Flag != null && (Flag == true || Flag == false)){
		this.Paused = Flag;
	}
}
//----------------------------------------------API Methods------------------------------------------
//Checks to see whether it is time for a new cycle and then runs the next iteration of events
/**
* @param {EventManager} EventManager Handle to the event manager managing Application events
* @param {EntityManager} EntityManager Handle to the entity manager managing Application entities
* @param {ScreenMap} ScreenMap handle to the current display interface
* @param {ResourceManager} ResourceManager Handle to the Application resource manager
* @param {AudioController} AudioController Handle to the Audio Controller
*/
Updater.prototype.ProcessCycle = function(EventManager, EntityManager, ScreenMap, ResourceManager, AudioController) {
	if(EventManager != null && EntityManager != null && ScreenMap != null && ResourceManager != null){
		var time = new Date();
		//Proceed to the next cycle if any time has passed since the last run(Here we could throttle the pace of the Application)
		if(time.getTime() > this.getMilliseconds() + this.ApplicationSpeedThrottle){
			EventManager.RunEvents();
			EntityManager.UpdateEntities();
			//Clean up dead audio
			AudioController.Maintain();
			EventManager.RenderToScreen();
			//Update the Cycle clock
			this.Cycle = time;
	   }
	}
}
//-------------------------------------UTILITY FUNCTIONS-------------------------------
//Function to return the time in milliseconds
/**
*@return {float} Returns the system time in milliseconds
*/	
Updater.prototype.getMilliseconds = function() {
	return this.Cycle.getTime();
}
//Function to return the time in seconds
/**
*@return {float} Returns the system time in seconds
*/	
Updater.prototype.getSeconds = function() {
	return Math.round(this.Cycle.getTime() / 1000);
}
