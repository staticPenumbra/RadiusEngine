/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
 * @fileOverview
 *
 * This file contains an Input object representing a player controller
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Input
 */
/**
 * @class
 * Class modeling a player controller
 *
 * @description
 * A player is modeled as a controller for all intensive purposes.
 **/
/**
* @constructor
*/
var Input = function(TVZ_ControlType) {
    //Default Constructor
	this.ControlType = TVZ_ControlType;
	this.UP = null;
	this.DOWN = null;
	this.LEFT = null;
	this.RIGHT = null;
	this.SHOOT = null;
	this.MENU = null;
	this.MousePositionX = null;
	this.MousePositionY = null;
	this.CHWEAPON = null; //Change Weapon

	//this.CheckKeyEvent();
	//this.CheckMagnitude();
    this.SetMappings();	
}
//---------------------------------------------------------------------MOUSE---------------------------------------------------
//Returns the Mouse position 
/**
* @return {Array[]} Returns the current 2D mouse position 
*/
Input.prototype.GetMousePosition = function(canvas, e){
	if(this.ControlType == "Mouse"){
		return(new Array(this.MousePositionX, this.MousePositionY));
	}
}

//Sets the current Mouse position
Input.prototype.SetMousePosition = function(PosX, PosY){
	if(PosX != null && PosY != null){
		this.MousePositionX = PosX;
		this.MousePositionY = PosY;
	}
}
//---------------------------------------------------------------------GET ACCESSORS-------------------------------------------
//Returns the current control type
/**
* @return {String} Returns the current control type string
*/
Input.prototype.GetControlType = function(){
    return(this.ControlType);
}
//Event handler for key presses
/**
* @return {Array[]} Returns the current Input object
*/
Input.prototype.GetMappings = function() {
    var Map = [this.ControlType, this.UP, this.DOWN, this.LEFT, this.RIGHT, this.SHOOT, this.CHWEAPON];
    return(Map);
}
//---------------------------------------------------------------------SET ACCESSORS---------------------------------------------

//---------------------------------------------------------------------UTILITY FUNCTIONS-----------------------------------------
//Sets the key mappings based upon provided type schema
Input.prototype.SetMappings = function(){
    switch(this.ControlType){
		case "Mouse":
			this.Mouse();
		break;
        case "WASD":
			this.WASD();
        break;
		case "Arrow":
			this.Arrow();
        break;
		case "IJKL":
			this.IJKL();
		break;
        default:
			this.WASD();
        break;
    }
}
//--------------------------------------------------------------------MOUSE CONTROL DEFINITIONS----------------------------------------
Input.prototype.Mouse = function(){
	this.LEFT = 65;
	this.RIGHT = 68;
	this.UP = 87;
	this.DOWN = 83;
	this.CHWEAPON = 67; //C
	this.SHOOT = 69; //Left Mouse Button
	this.MENU = 27 //Escape
	this.SELECT = 13 //Enter
}
//--------------------------------------------------------------------KEYMAP CONTROL DEFINITIONS---------------------------------------
//Definition for Arrow Input type
Input.prototype.Arrow = function(){
    this.LEFT = 37;
    this.RIGHT = 39;
    this.UP = 38;
    this.DOWN = 40;
    this.SHOOT = 17;
    //this.MENU = 27; //Escape Key
}
//Definition for WASD Input type
Input.prototype.WASD = function(){
    this.UP = 87;
    this.DOWN = 83;
    this.LEFT = 65;
    this.RIGHT = 68;
	this.CHWEAPON = 67; //C
    this.SHOOT = 69;
    this.MENU = 27; //Escape Key
	this.SELECT = 13; //Enter Key
}
Input.prototype.IJKL = function(){
	this.UP = 73;
    this.DOWN = 75;
    this.LEFT = 74;
	this.CHWEAPON = 78; //C
    this.RIGHT = 76;
    this.SHOOT = 85;
    //this.MENU = 27; //Escape Key
}