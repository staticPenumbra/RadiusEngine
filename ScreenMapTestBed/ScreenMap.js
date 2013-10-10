/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the ScreenMap object a data representation of a screen
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              ScreenMap
 */
/**
 * @class
 * Class modeling a current display frame and objects rendered to screen
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
	this.MenuSystem = new Array(); //Array of Menu layouts for the stage
	this.DOM = new Array();
}
//-----------------------------------------------------Get Methods-----------------------------------
/**
* Function to get the state of the menu option pointer
* @return {Integer} Returns an integer value for the state of the menu pointer
*/	
ScreenMap.prototype.GetMenuPointerPosition = function(){
	return(this.MenuSystem[0].GetCursorPosition());
}
/**
* Function to return the first Menu in the menu system
* @return {ApplicationMenu} Returns the first menu in the list of current stage menus
*/	
ScreenMap.prototype.GetMenu = function(){
	if(this.MenuSystem[0] != null){
		return(this.MenuSystem[0]);
	}
}
//-----------------------------------------------------Set Methods-----------------------------------
/**
* Function to set the state of the menu option pointer
* @param {Integer} Option The menu option to switch the cursor to
*/
ScreenMap.prototype.SetMenuPointerPosition = function(Option){
	if(Option != null && Option >= 0 && Option < this.MenuSystem[0].MenuOptions.length){
		this.MenuSystem[0].ChangeCursorPosition(Option);
	}
}
/**
* Sets the current Menu system
* @param {ApplicationMenu} Menu Adds the specified menu to the menu system for the stage, if passed null stops displaying the menu
*/
ScreenMap.prototype.SetMenuSystem = function(Menu){
	if(Menu != null){
		this.MenuSystem = new Array();
		this.MenuSystem.push(Menu);
	}else{
	//Escape pressed again stop displaying menu
		this.MenuSystem = new Array();
	}
}
/**
* Sets the current screen background image
* @param {Image} BG An instance of the background image to set
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
* Clears the current screen not needed with blitting
*/
ScreenMap.prototype.Clear = function(){
	this.bctx.clearRect(0, 0, this.XResolution, this.YResolution);
}
/**
* Function to flip the displayed screens by swapping video buffer
*/
ScreenMap.prototype.Blit = function(){
	if(this.bctx != null && this.ctx != null){
		var offscreen_data = this.bctx.getImageData(0, 0, this.XResolution, this.YResolution);
		this.ctx.putImageData(offscreen_data, 0, 0);
	}
}
/**
* Function to wrap the loaded text
* @param {CanvasContext} context the current Canvas context to display to
* @param {String} text The text to display within the DOM element
* @param {Integer} x The starting x position in pixels
* @param {Integer} y The starting y position in pixels
* @param {Integer} maxWidth The maximum width to use before wrap
* @param {Integer} lineHeight The height of the display text
*/
ScreenMap.prototype.WrapText = function(context, text, x, y, maxWidth, lineHeight){
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
}
/**
* Function to render the map to the background canvas and blit
*/
ScreenMap.prototype.RenderToCanvas = function(){
       this.bctx.drawImage(this.BackgroundImages[0], 0, 0);
	   if(this.BackgroundImages.length > 1){
       this.bctx.drawImage(this.BackgroundImages[1], 0, 0);
	   }
       //Render Entities
       //Make sure there are entities
	   if(this.DOM != null){
		 for(var i = 0; i <= this.DOM.length - 1; i++){
           //ALL LINKS FOR NOW
		    this.bctx.fillStyle = this.DOM[i][6];
			this.bctx.font = this.DOM[i][5];
			this.WrapText(this.bctx, this.DOM[i][4], this.DOM[i][0], this.DOM[i][1], 500, 20);
			//this.bctx.fillText(this.DOM[i][4], this.DOM[i][0], this.DOM[i][1]);
        } 
	   }
	   
       if(this.Entities != null){
        for(var i = 0; i <= this.Entities.length - 1; i++){
            if(this.Entities[i].SpriteSheet != null){
                //We have an Image to display so show it
                //Render Sprites
                this.DrawSprite(this.bctx, this.Entities[i]);
            }
        }
       }
	   if(this.BackgroundImages.length > 2){
       this.bctx.drawImage(this.BackgroundImages[2], 0, 0);
	   }
    //}
	//Account for a closed menu and a freshly constructed system
	if(this.MenuSystem != null && this.MenuSystem.length != 0){
		for(var i = 0; i < this.MenuSystem.length; i++){
			this.MenuSystem[i].Display(this.bctx);
		}
	}
	//Blit the image to screen
	this.Blit();
}
/**
* Render Event; Updates Entities and renders to canvas
* @param {Entity[]} EntityList Updated Entity List to process
* @param {Array[]} DOMList Updated DOM List to process
*/
ScreenMap.prototype.RenderCycle = function(EntityList, DOMList) {
    this.UpdateDOM(DOMList);
	this.UpdateEntities(EntityList);
    this.RenderToCanvas();
}
/**
* Function to draw a specified Entity on the background canvas for blitting
* @param {CanvasContext} bctx Canvas context reference to the background canvas
* @param {Entity} Entity A reference to the entity to render
*/
ScreenMap.prototype.DrawSprite = function(bctx, Entity){
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
}
//-----------------------------------------------Private Utility Functions-------------------------------
/**
* Function to caluculate the number of Entity positions on the map
* @return {Integer} Returns the number of entity slots in the current ScreenMap
*/	
ScreenMap.prototype.CalculateSlots = function(){
    if(this.NumCells != null && this.XResolution != null && this.YResolution != null){
    this.EntitySlots = (this.XResolution*this.YResolution)/this.NumCells;
    return(this.EntitySlots);
    }
}
/**
* @param {Array[]} DOMList Updates the list of DOM Elements
*/
ScreenMap.prototype.UpdateDOM = function(DOMList){
    this.DOM = DOMList;
}
/**
* @param {TVZ_Entity[]} EntityList Updates the list of entities in the ScreenMap from a supplied Entity list
*/
ScreenMap.prototype.UpdateEntities = function(EntityList){
    this.Entities = EntityList;
}
/**
* Function to animate an entity and draw the correct animation frame 
* @param {String} Direction String indicating the walking animation direction
* @param {Entity} Entity A reference to the entity to render
* @param {Entity} bctx A reference to the background canvas context
*/
ScreenMap.prototype.Animate = function(Direction, Entity, bctx){
	if(Direction != null && Entity != null && bctx != null){
		var Cells = Entity.GetCells(Direction);
		var position = Entity.GetPosition();
		var xcord = position[0];
		var ycord = position[1];
		var Sprite = Entity.GetSpriteSheet();
		var CurrentFrame = Entity.GetFrame();
		var ID = Entity.GetImageDimensions();
		var AnimationDelay = 80;
		var CellOrder = Entity.GetCellOrder();
		switch(Direction){
				case 'n':
					var Offset = 0;
				break;
				case 'ne':
					var Offset = 1;
				break;
				case 'e':
					var Offset = 2;
				break;
				case 'se':
					var Offset = 3;
				break;
				case 's':
					var Offset = 4;
				break;
				case 'sw':
					var Offset = 5;
				break;
				case 'w':
					var Offset = 6;
				break;
				case 'nw':
					var Offset = 7;
				break;
		}
		if(Entity.IsAnimating() == true){
			if(CurrentFrame >= Cells){
				Entity.SetFrame(0);
			}
			if(CurrentFrame < Cells){
				bctx.drawImage(Sprite,CurrentFrame * ID[0], ID[1] * CellOrder[Offset], ID[0], ID[1], xcord, ycord, ID[0], ID[1]);
				//Update the frame only if a certain amount of time has passed
				var previous = Entity.GetTimestamp();
				var next = Math.round(new Date().getTime());
				if(previous + AnimationDelay < next){
					CurrentFrame++;
					if(CurrentFrame >= Cells){
						Entity.SetFrame(0);
						Entity.UpdateModified();
					}else{
						Entity.SetFrame(CurrentFrame);
						Entity.UpdateModified();
					}
				}
			}
		}else{
			Entity.SetFrame(0);
			bctx.drawImage(Sprite,CurrentFrame * ID[0], ID[1] * CellOrder[Offset], ID[0], ID[1], xcord, ycord, ID[0], ID[1]);
		}
	}
}