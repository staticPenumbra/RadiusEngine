/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the ScreenMap object a data representation of a screen with WebGL support
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              ScreenMapGL
 */
/**
 * @class
 * Class modeling a current display frame and interface to WebGL
 *
 * @description
 * An object describing all of the information about a display frame
 **/
/**
* @constructor
*/
var ScreenMap = function(ResolutionX, ResolutionY, FrontCanvasContext, RearCanvasContext) {
	this.bctx = RearCanvasContext; //The canvas context for the background screen buffer
	this.ctx = FrontCanvasContext; //The canvas context for the foreground screen buffer
	this.XResolution = ResolutionX; //Screen resolution X value in integer format
	this.YResolution = ResolutionY; //Screen resolution Y value in integer format
	this.Entities = new Array();	//The Array of current Application entities
	this.BackgroundImages = new Array(); //The Current array of background Images
	this.ZoomLevel = null;		//Current screen magnification level 
	this.MenuSystem = null; //Array of Menu layouts for the stage
	this.DOM = new Array();
	//Window Data Stubs for bug fix DE6
	this.WindowHeight = window.innerHeight;
	this.WindowWidth = window.innerWidth;
	//Entity Scaling Data
	this.Scale = 2;
	//Intitializing the front canvas as a WebGL canvas
	this.glctx = this.bctx;
	// Only continue if WebGL is available and working
	if (this.glctx) {
		this.glctx.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
		this.glctx.enable(this.glctx.DEPTH_TEST);                               // Enable depth testing
		this.glctx.depthFunc(this.glctx.LEQUAL);                                // Near things obscure far things
		this.glctx.clear(this.glctx.COLOR_BUFFER_BIT|this.glctx.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
	}
	else{
		alert("Error with webGL initialization");
	}
}
/**
* Sets the current screen background image
* @param {Image[]} BG the array (in bottom of stack to top of stack order) of background images to display
*/
ScreenMap.prototype.SetBackgrounds = function(BG){
	if(BG != null){
		this.BackgroundImages = BG;
	}
}
/**
* Function to set the screenmap resolution
* @param {Integer} ResolutionX The value for the x component of the display resolution
* @param {Integer} ResolutionY The value for the y component of the display resolution
*/
ScreenMap.prototype.SetResolution = function(ResolutionX, ResolutionY){
    if(ResolutionX != null && ResolutionY != null){
    this.XResolution = ResolutionX;
    this.YResolution = ResolutionY;
    }
}
//----------------------------------------------------Render Functions----------------------------------
/**
* Function to resize the canvas to fit the window
*/
ScreenMap.prototype.Resize = function() {
	this.glctx.viewport(0, 0, this.glctx.canvas.width, this.glctx.canvas.height);
}
/**
* Function to write text to an area of the screen
* @param {String} Text The text string to write
* @param {Array[]} Dimensions Integer Array specifying the Width[0] and Height[1] Integer values of the text box 
* @param {Array[]} Position The current X[0], Y[1] values for the upper left corner of the text box
* @param {String} Style The style to apply to the text (eg: italic bold Verdana)
* @param {Integer} Size The size of the text
* @param {String} Color The color of the text as a string (eg: black)
* @param {DOMEntity} DOMEntity Optional Argument specifying a current DOM entity to write
*/
/*
ScreenMap.prototype.WriteText = function(Text, Dimensions, Position, Style, Size, Color, DOMEntity) {
	//Format the text as a DOM element
	//width, height, , , font, style
	if(Text != null && Dimensions != null && Position != null && Style != null && Size != null && Color != null){
		if(DOMEntity != null){
	
		}
		//new Array(50, 450, 100, 100, "Help:", "italic bold 20px Verdana", "black")
		var font = Style + " " + Size*this.Scale + "px";
		this.DOM.push(new Array(Dimensions[0], Dimensions[1], Position[0], Position[1], Text, font, Color));
		return(0);
	}
}*/
/**
* Clears the current screen not needed with blitting
*/
/*ScreenMap.prototype.Clear = function(){
	this.bctx.clearRect(0, 0, this.XResolution, this.YResolution);
}*/
/**
* Function to flip the displayed screens by swapping video buffer
*/
/*
ScreenMap.prototype.Blit = function(){
	if(this.bctx != null && this.ctx != null){
		this.bctx.canvas.height = this.WindowHeight;
		this.bctx.canvas.width = this.WindowWidth;
		this.ctx.canvas.height = this.WindowHeight;
		this.ctx.canvas.width = this.WindowWidth;
		var offscreen_data = this.bctx.getImageData(0, 0, this.WindowHeight, this.WindowWidth);
		this.ctx.putImageData(offscreen_data, 0, 0);
	}
}*/
/**
* Function to wrap the loaded text
* @param {CanvasContext} context the current Canvas context to display to
* @param {String} text The text to display within the DOM element
* @param {Integer} x The starting x position in pixels
* @param {Integer} y The starting y position in pixels
* @param {Integer} maxWidth The maximum width to use before wrap
* @param {Integer} lineHeight The height of the display text
*/
/*ScreenMap.prototype.WrapText = function(context, text, x, y, maxWidth, lineHeight){
	var words = text.split(' ');
	var line = '';
	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	context.fillText(line, x, y);
}*/
/**
* Function to render the map to the background canvas and blit
*/
ScreenMap.prototype.RenderToCanvas = function(){
	   //*****The Render is handled by WebGL dummy stub for compatibility*******
}
/**
* Render Event; Updates Entities and renders to canvas
* @param {Entity[]} EntityList Updated Entity List to process
* @param {Array[]} DOMList Updated DOM List to process
*/
ScreenMap.prototype.RenderCycle = function(EntityList, DOMList) {
    this.Resize();
	//update window dimensions
	this.WindowHeight = window.innerHeight;
	this.WindowWidth = window.innerWidth;
	if(this.DOM == null || this.DOM.length == 0){
		//Pulls the DOM list from the database if there is no loaded DOM otherwise no DB load
		this.UpdateDOM(DOMList);
	}
	this.UpdateEntities(EntityList);
    this.RenderToCanvas();
}
/**
* Function to draw a specified Entity on the background canvas for blitting
* @param {CanvasContext} bctx Canvas context reference to the background canvas
* @param {Entity} Entity A reference to the entity to render
*/
/*ScreenMap.prototype.DrawSprite = function(bctx, Entity){
     if(bctx != null && Entity != null){
		//img,x,y,width,height
		var position = Entity.GetPosition();
		var xcord = position[0];
		var ycord = position[1];
		var Dimensions = Entity.GetImageDimensions();
		var width = Dimensions[0];
		var height = Dimensions[1];
		var Vec = Entity.GetVelocity();
		var Sprite = Entity.GetSpriteSheet();
		var CurrentFrame = Entity.GetFrame();
		var EntType = Entity.GetType();
		//-----------------------------------------Rendering Rules--------------------------------
		switch(EntType){
			case "TVZ_pistolBullet":
				bctx.drawImage(Sprite, xcord, ycord, width, height);
			break;
			case "TVZ_rifleBullet":
				bctx.drawImage(Sprite, xcord, ycord, width, height);
			break;
			case "TVZ_shotgunBullet":
				bctx.drawImage(Sprite, xcord, ycord, width, height);
			break;
			case "Wall":
				bctx.drawImage(Sprite, xcord, ycord, width, height);
			break;
			case "Door":
				bctx.drawImage(Sprite, xcord, ycord, width, height);
			break;
			case "Default":
				bctx.drawImage(Sprite, xcord, ycord, width, height);
			break;
			default:
				if(EntType == "player1" || EntType == "player2" || EntType == "zombie"){
					//Display a different image based upon the direction of travel
					switch(Vec[0]){
						case 'n':
							//xrow = 5, 4 cells
							this.Animate('n', Entity, bctx);
						break;
						case 'ne':
							//xrow = 0, 4 cells
							this.Animate('ne', Entity, bctx);
						break;
						case 'e':
							//xrow = 6, 6 cells
							this.Animate('e', Entity, bctx);
						break;
						case 'se':
							//xrow = 1, 4 cells
							this.Animate('se', Entity, bctx);
						break;
						case 's':
							//xrow = 4, 4 cells
							this.Animate('s', Entity, bctx);
						break;
						case 'sw':
							//xrow = 3, 4 cells
							this.Animate('sw', Entity, bctx);
						break;
						case 'w':
							//xrow = 7, 6 cells
							this.Animate('w', Entity, bctx);
						break;
						case 'nw':
							//xrow = 2, 4 cells
							this.Animate('nw', Entity, bctx);
						break;
						case 'c':
							Entity.SetFrame(0);
							bctx.drawImage(Sprite,0, 128, width, height, xcord, ycord, width, height);
						break;
						default:
							alert("Screenmap line 168 cannot draw image");
						break;
					}
				}
			break;
		}
    }
}*/
/**
* @param {Array[]} DOMList Updates the list of DOM Elements
*/
/*ScreenMap.prototype.UpdateDOM = function(DOMList){
	if(DOMList != null){
		this.DOM = DOMList;
	}
}*/
/**
* @param {TVZ_Entity[]} EntityList Updates the list of entities in the ScreenMap from a supplied Entity list
*/
/*ScreenMap.prototype.UpdateEntities = function(EntityList){
	if(EntityList != null){
		this.Entities = EntityList;
	}
}*/