/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the definition for an HTML5 Javascript menu system
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              Menu
 */
/**
 * @class
 * Class modeling a Javascript Menu
 *
 * @description
 * The Menu system for the Javascript application engine
 **/
 /**
 * @constructor
 */
var ApplicationMenu = function(Origin, Dimensions, MenuItems, Title, Font) {
	this.MenuOptions = MenuItems;//Optional element so add with a function
	this.OptionCoordinates = new Array(); //location of each Menu Item
	this.Background = null;//Optional element so add with a function
	this.CursorImage = null;//Optional element so add with a function
	this.BGMusic = null; //Optional element so add with a function
	this.TextFont = Font;//Optional element so add with a function
	this.TextSize = 10;//Optional element so add with a function
	this.Animation = null;//Optional element so add with a function
	this.BackgroundAnimation = null; //Optional element so add with a function
	this.CursorAnimation = null; //Optional element so add with a function
	this.MenuDimensions = Dimensions; //Menu Dimensions
	this.Orig = Origin; //Upper left x coordinate
	this.MainTitle = Title; //Menu Title
	this.SelectedItem = 0; //Currently selected Menu Item
	this.type = null; //Shape of the Menu
	this.HUD = null; //Variable to indicate if the menu is a persistant HUD
	this.Spacing = 80;
}

//--------------------------------------------------------------------------GET ACCESSORS---------------------------------------------
/**
* Returns the selected menu item
* @return {Integer} The currently selected menu item
*/
ApplicationMenu.prototype.GetCursorPosition = function(){
	return(this.SelectedItem);
}
//--------------------------------------------------------------------------SET ACCESSORS---------------------------------------------
/**
* Sets the Cursor Image for the Menu
* @param {String} CursorFile filepath of the cursor Image
*/
ApplicationMenu.prototype.SetCursorImage = function(CursorFile){
	if(CursorFile != null){
		this.CursorImage = new Image();
		this.CursorImage.src = CursorFile;
	}
}
/**
* Sets the font properties of the Menu
* @param {String} FontName The name of the system font to set
* @param {Integer} Size The text size 
*/
ApplicationMenu.prototype.SetTextFont = function(FontName, Size){
	if(FontName != null && Size != null){
		this.TextFont = FontName;
		this.TextSize = Size;
	}
}
/**
* Function to set the Menu background
* @param {String} BackgroundFile File path to the background file
*/
ApplicationMenu.prototype.SetBackground = function(BackgroundFile){
	if(BackgroundFile != null){
		if(BackgroundFile instanceof Image){
			this.Background = BackgroundFile;
		}else{
			this.Background = new Image();
			this.Background.src = BackgroundFile;
		}
	}
}
/**
* Set the menu shape eg Circle, Square (Currently only supporting square)
* @param {String} Shape Text string indicating the shape of the menu
*/
ApplicationMenu.prototype.SetShape = function(Shape){
	if(Shape != null && Shape == "Square"){
	this.type = Shape;
	}
}
/**
* Change Selected Menu Item
* @param {Integer} MenuOption Array element number of the menu selection
*/
ApplicationMenu.prototype.ChangeCursorPosition = function(MenuOption) {
	if(MenuOption != null){
	this.SelectedItem = MenuOption;
	}
}
//---------------------------------------------------------------------------------UTILITY FUNCTIONS----------------------------------
/**
* Function to make the "tick" sound effect when changing menu elements
*/
ApplicationMenu.prototype.Tick = function(elapsed){	
}
/**
* Function to display the menu on screen
* @param {CanvasContext} ctx Handle to the current canvas context
*/
ApplicationMenu.prototype.Display = function(ctx) {
//In order to display a menu in the current canvas element we need:
// A canvas, A position, menu dimensions, A border, A background, A font, menu entries, a cursor image, an input
	//Origin, Dimensions, MenuItems, Title, Font, Canvas
	if(ctx != null && this.Orig != null && this.MenuOptions != null && this.MainTitle != null){
		switch(this.type){
			case "Square":
			//Draw Background Layer
			ctx.drawImage(this.Background, this.Orig[0], this.Orig[1]);
			//Draw Text Layer
			ctx.font = this.TextFont;
			for(var i = 0; i < this.MenuOptions.length; i++){
				var x = this.Spacing * 2 + this.Orig[0];
				var y = this.Spacing + i*this.Spacing + this.Orig[1];
				ctx.fillText(this.MenuOptions[i], x, y);
				this.OptionCoordinates.push(new Array(x, y));
			}
			if(this.CursorImage != null){
				//Place the cursor next to the currently selected Item
				ctx.drawImage(this.CursorImage, this.OptionCoordinates[this.SelectedItem][0] - 50, this.OptionCoordinates[this.SelectedItem][1] - 10);
				//this.ctx.drawImage(this.TextFont, this.Orig[0], this.Orig[1]);
				//Draw Cursor Layer Depending on index
			}
			break;
			default:
			break;
		}
	}else{
	alert("Cannot Display the Menu missing required parameters");
	}
}