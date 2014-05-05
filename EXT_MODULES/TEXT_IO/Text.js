/*----------------------------------------------------------------------------------------------------------
::“Copyright 2014 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the definition for a text object
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              Text
 */
/**
 * @class
 * Class modeling a Text object
 *
 * @description
 * Text is a module for creating interactive text objects
 **/
 /**
 * Defines an interactive Text object
 * @constructor
 */
var Text = function(TextString, Font) {
	this.ContentString = TextString;
	this.height = null;
	this.Position = new Array(Pos[0], Pos[1]);
	this.Text = new Array(); //Containing a reference to an array of text objects
	this.WriteModeFlag = 0;
	
	
	
}
//---------------------------------------------------------------------------GET ACCESSORS---------------------------------------------------
/**
* Retrieves the event arguments
* @return {Array[]} Stored dimensions for the text box
*/
TextIO.prototype.GetDimensions = function() {
	return(new Array(this.width, this.height));
}

