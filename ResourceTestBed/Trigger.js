/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the definition for a trigger object
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Trigger
 */
/**
 * @class
 * Class modeling a event Trigger
 *
 * @description
 * Event Triggers are walkover and scripted things that happen
 **/
 /**
 * @constructor
 */
var Trigger = function(Type, FireOnce, Position, Dimensions) {
    //Default Constructor
	this.Dimensions = Dimensions; //Dimension dimension array for the trigger (width, height)
	this.Position = Position; //Position array for the trigger (x, y)
	this.FireOnce = FireOnce; //Fireonce boolean flag true=once false=infinite
	this.Type = Type; //Text string for the trigger type
	this.TrippedBy = null;
	this.UL = Position;
	this.UR = new Array(this.UL[0] + this.Dimensions[0], this.UL[1]);
	this.LL = new Array(this.UL[0], this.UL[1] + this.Dimensions[1]);
	this.LR = new Array(this.UL[0] + this.Dimensions[0], this.UL[1] + this.Dimensions[1]);
}
//------------------------------------------------------GET ACCESSORS-----------------------------------------------
//Returns the last entity to trip the trigger
/**
* @returns {Entity} The entity that last tripped the trigger
*/
Trigger.prototype.GetTrippedBy = function(){
	if(this.TrippedBy != null){
		return(this.TrippedBy);
	}
}
//Returns an array of the triggers 4 corner points
/**
* @returns {Array[]} An array of 4 points, one for each corner of the Trigger
*/
Trigger.prototype.GetCorners = function(){
	return(new Array(this.UL, this.UR, this.LL, this.LR));
}
//Returns the current type of the trigger
/**
* @returns {String} The current type of the trigger
*/
Trigger.prototype.GetType = function(){
	if(this.Type != null){
		return(this.Type);
	}
}
//Returns the whether the current trigger is fire once or not
/**
* @returns {Boolean} The current trigger state (true) fire once or (false) trigger resets
*/
Trigger.prototype.GetFireOnce = function(){
	if(this.FireOnce != null){
		return(this.FireOnce);
	}
}
//Returns the upper left hand position of the trigger
/**
* @returns {Array[]} The point Array X/Y for the upper left hand position
*/
Trigger.prototype.GetPosition = function(){
	if(this.Position != null){
		return(this.Position);
	}
}
//Gets the current trigger dimensions
/**
* @returns {Array[]} The point Array width/height indicating the current trigger dimensions
*/
Trigger.prototype.GetDimensions = function(){
  if(this.Dimensions != null){
	return(this.Dimensions);
  }
}
//---------------------------------------------------------------SET ACCESSORS------------------------------------------
//Sets the current trigger to fire once(true) or resets(false)
/**
* @param {Boolean} Boolean true or false , fire once or reset to fire again
*/
Trigger.prototype.SetFireOnce = function(Boolean){
	if(Boolean != null){
		this.FireOnce = Boolean;
	}
}
//Sets the upper left hand point position for the current trigger
/**
* @param {Array[]} Position Array with position information X/Y
*/
Trigger.prototype.SetPosition = function(Position){
	if(Position != null){
		this.Position = Position;
	}
}
//Sets trigger dimensions
/**
* @param {Array[]} Dimensions Array with width/height information
*/
Trigger.prototype.SetDimensions = function(Dimensions){
	if(Dimensions != null){
		this.Dimension = Dimensions;
	}
}

//-------------------------------------------------------------UTILITY FUNCTIONS-------------------------------------------
//Sets the triggering entity and returns a reference to the current trigger
/**
* @param {Entity} Entity reference to the tripping Entity
* @returns {Trigger} The current Trigger
*/
Trigger.prototype.Fire = function(Entity){
	if(Entity != null){
		this.TrippedBy = Entity;
		return(this);
	}
}

/**
* @param {AudioTagHandle} Controller Handle to the current HTML5 audio element 
*/
Trigger.prototype.Spawn = function(){
  
}
Trigger.prototype.Goal = function(){
  
}
Trigger.prototype.GetItem = function(){
  
}
Trigger.prototype.LoseItem = function(){
  
}
Trigger.prototype.TakeDamage = function(){
  
}
Trigger.prototype.DamageEntity = function(){
  
}
Trigger.prototype.OpenDoor = function(){
  
}
Trigger.prototype.CloseDoor = function(){
  
}
Trigger.prototype.StartScript = function(){
  
}
Trigger.prototype.StartAnimation= function(){
  
}
Trigger.prototype.StopAnimation = function(){
  
}
Trigger.prototype.RevealArea = function(){
  
}
Trigger.prototype.HideArea = function(){
  
}