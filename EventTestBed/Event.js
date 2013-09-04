/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main Event object definition encapsulating any application event
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Event
 */
/**
 * @class
 * Class modeling an Event
 *
 * @description
 * All in-application events are modeled as a generic event type and then passed to the event manager
 **/
 /**
 * @constructor
 */
//Specifies an in application event
var EngineEvent = function(Type, Args) {
    //Default Constructor
	this.ApplyFrom = null;
	this.ApplyTo = null;
	this.EventType = Type; //This is the type of event to switch handler based upon
	this.InstanceAtX = null;
	this.InstanceAtY = null;
	this.ApplicationStop = null; //For errors, symbolizes a critical system error(To be avoided)
	this.args = Args; //Arguments to the event handler

}
//---------------------------------------------------------------------------GET ACCESSORS---------------------------------------------------
//Retrieves the event arguments
/**
* @return {Array[]} Stored string arguments for the event
*/
EngineEvent.prototype.GetArg = function() {
    return(this.args);
}
//Accessor method to get the type of event
/**
* @return {String} Returns Type String of the object
*/
EngineEvent.prototype.GetType = function() {
    return(this.EventType);
}
//keyUp Event
/**
* @return {KeyCode} Returns keycode passed into it for clojure
*/
EngineEvent.prototype.keyUp = function() {
     return(this.args);
}
//keyDown Event
/**
* @return {KeyCode} Returns keycode passed into it for clojure
*/
EngineEvent.prototype.keyDown = function() {
     return(this.args);
}
//--------------------------------------------------------------------------SET ACCESSORS----------------------------------------------------
//--------------------------------------------------------------------------UTILITY FUNCTIONS------------------------------------------------
//Specifies how different events should behave when they have their execute methods called
EngineEvent.prototype.Execute = function() {
    switch(this.EventType){
        //switch handler based upon the type of event
        //Specifies a render event
        case "render":
			return("render");
        break;
		case "trigger":
			
		break;
        case "pauseAudio":
			alert("Pause Audio");
        break;
        case "playAudio":
			alert("Play Audio");
        break;
        case "displaymenu":
			alert("Display Menu");
        break;
        case "unpauseinterrupt":
			alert("unpauseinterrupt");
        break;
        case "pauseinterrupt":
			alert("pauseinterrupt");
        break;
        case "error":
			alert("Application error " + this.args);
        break;
        case "create":
			return(this.CreateEntity());
        break;
		case "destroy":
			return("killme");
        break;
        case "shoot":
			alert(this.ApplyFrom + " Shooting");
        break;
        case "collision":
			alert("Collision" + this.ApplyFrom + " " + this.ApplyTo);
        break;
        case "keyUp":
			return(this.keyUp());
        break;
        case "keyDown":
			return(this.keyDown());
        break;
        default:
			alert("Not a valid event type in Event object");
        break;
    }	
}
/**
* @param {String} TYPE The current entity type to create
* @param {Integer} xPos The x position to create the object at
* @param {Integer} yPos The y position to create the object at
* @param {Image} SpriteSheet The currently loaded sprite sheet for the entity
* @param {AIController | Input} Controller The current entities controller Player or AI
* @return {Entity} Returns the Entity created
*/
EngineEvent.prototype.CreateEntity = function(TYPE, xPos, yPos, SpriteSheet, Controller) {
    //Create and return an Entity object
    var temp = new Entity(TYPE, xPos, yPos, SpriteSheet, Controller);
    return(temp);
}
//Function to display the event output
EngineEvent.prototype.Display = function() {
    //Simply output a text representation of everything in the object
	alert(this.ApplyFrom + " \n" + this.ApplyTo + " \n" + this.EventType + " \n" + this.InstanceAtX + " \n" + this.InstanceAtY + " \n" + this.ApplicationStop + " \n" + this.args);
}
