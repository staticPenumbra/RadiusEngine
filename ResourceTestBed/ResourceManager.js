/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the game Resource Manager
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              ResourceManager
 */
/**
 * @class
 * Class modeling the database interface to application resources
 *
 * @description
 * All resources are aquired and manipulated through this manager in order to provide a clear simple way to access them
 **/
 /**
 * @constructor
 */
var ResourceManager = function(Root) {
	this.ResourceRoot = Root;
	this.GUIDTicker = 0;
	/*-------------------DATABASE CACHE---------------------------*/
	this.SiteDirectory = new Array("index","page2","page3","page4","page5","page6","page7", "page8", "page9","page10","page11","page12");
	this.Pages = this.Init();
	this.L2DOMCache = new Array();
	this.L2ImageCache= new Array();
	this.L2AudioCache = new Array();
	this.CacheInit(1);
}
//-----------------------------------------------------Get Accessors----------------------------------------------
/**
* Initialize the list of site pages
* @return {Array[]} Returns an array of Loaded Pages
*/
ResourceManager.prototype.Init = function(){
	if(this.SiteDirectory != null){
	var Loaded = new Array();
		for(var i=0; i<this.SiteDirectory.length;i++){
			var temp = new Stage(this.SiteDirectory[i], this.ResourceRoot);
			temp.Load();
			Loaded.push(temp);
		}
		return(Loaded);
	}else{
		console.log("Could not load Pages, are they defined in Resource Manager Site Directory?");
	}
}

/**
* Initialize or Reset the L2 Cache to Page defaults
* @param {Integer} PageIndex The page to load from
*/
ResourceManager.prototype.CacheInit = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
	//Init DOM
		this.L2DOMCache = this.GetDOMDefault(PageIndex);
	//Init Images
		this.L2ImageCache = this.LoadBackgrounds(PageIndex);
	//Init Audio
		this.L2AudioCache = this.LoadPageAudio(PageIndex);
	}
}
/**
* Add a DOM element to L2 Application cache
* @param {Array} Value The Array of DOM data for that element
*/
ResourceManager.prototype.AddDOMElement = function(Value){
	if(Value != null){
		this.L2DOMCache.push(Value);
	}
}
/**
* Remove a DOM element from the L2 Application cache
* @param {Array} Value The Array of DOM data for that element
*/
ResourceManager.prototype.RemoveDOMElement = function(Value){
	if(Value != null){
	//------------------------------------------------------STUB----------------------------------------
		alert("DOM REMOVAL NOT YET IMPLEMENTED");
	//--------------------------------------------------------------------------------------------------
	}
}
/**
* Return the Current DOM
* @param {Integer} PageIndex The page to load from
* @return {Array[]} Returns an array of DOM elements
*/
ResourceManager.prototype.GetDOM = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.L2DOMCache);
	}
}
/**
* Return the Current Images
* @param {Integer} PageIndex The page to load from
* @return {Image[]} Returns an array of Image elements
*/
ResourceManager.prototype.GetImages = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.L2ImageCache);
	}
}
/**
* Return the Current Audio
* @param {Integer} PageIndex The page to load from
* @return {Audio[]} Returns an array of Audio elements
*/
ResourceManager.prototype.GetAudio = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.L2AudioCache);
	}
}
/**
* Return the starting position of the specified DOM Entity of the specified type
* @param {Integer} PageIndex The page to load from
* @return {Integer[]} Returns an array of DOM elements
*/
ResourceManager.prototype.GetDOMDefault = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.Pages[PageIndex-1].DOMData);
	}
}
/**
* Return the starting position of the specified Entity of the specified type
* @param {Integer} PageIndex The page to load from
* @return {Integer[]} Returns an array specifying the x and y dimensions of the specified page
*/
ResourceManager.prototype.GetPageDimensions = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.Pages[PageIndex-1].GetDimensions());
	}
}
/**
* Return the Input controls for the specified page
* @param {Integer} PageIndex The page to load from
* @return {String[]} Returns a text string of inputs
*/
ResourceManager.prototype.GetPageInputs = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.Pages[PageIndex-1].Inputs);
	}
}
/**
* Load all page triggers from the database and return an array of them
* @param {Integer} PageIndex The page to load from
* @return {Array[]} Returns an array of Triggers
*/
ResourceManager.prototype.LoadTriggers = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		var Trigs = new Array();
		for(var i = 0; i < this.Pages[PageIndex-1].Triggers.length; i++){
			//Type, FireOnce, Position, Dimensions
			var add = this.GetEntityData(PageIndex, this.Pages[PageIndex-1].Triggers[i]);
			//"dialogue", true, 200, 200, 50, 50
			Trigs.push(new Trigger(add[0], add[1], new Array(add[2], add[3]), new Array(add[4], add[5])));
		}
		return(Trigs);
	}
}
/**
* Return the starting position of the specified Entity of the specified type
* @param {Integer} PageIndex The page to load from
* @param {String} EntityKey The database name of the entity
* @return {Integer[]} Returns an array specifying the x and y coordinate of the entity starting position
*/
ResourceManager.prototype.GetEntityData = function(PageIndex, EntityKey){
	if(PageIndex != null && PageIndex > 0 && EntityKey != null){
		return(this.Pages[PageIndex-1].CacheRetrieve("Entity", EntityKey));
	}
}
/**
* Returns an audio object for the stage audio
* @param {Integer} PageIndex Page number to test
* @return {Boolean} Returns a flag indicating "true" this is the index page or "false" it isn't
*/
ResourceManager.prototype.IsTitleScreen = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		return(this.Pages[PageIndex-1].TitleFlag);
	}
}
//----------------------------------------------------Set Accessors------------------------------------------------
//Warning: DATABASE DEFAULT SHOULD BE READ ONLY!! (UNLESS ADDRESSING L2 CACHE FOR RESIZE)
/**
* Set the Current DOM
* @param {Array[]} DOM The DOM elements to set in the cache
*/
ResourceManager.prototype.SetDOM = function(DOM){
		this.L2DOMCache = DOM;
}
//----------------------------------------------------UTILITY FUNCTIONS-------------------------------------------
/**
* Returns an audio object for the stage audio
* @param {Integer} PageIndex Page number to load from 
* @return {Array[]} Returns a loaded array of the starting page entities
*/
ResourceManager.prototype.LoadPageEntities = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		var toReturn = new Array();
		//create an Audio object for each sound in the Page
		for(var i =0; i < this.Pages[PageIndex-1].EntityKeys.length; i++){
			var temp = this.Pages[PageIndex-1].CacheRetrieve("Entity", this.Pages[PageIndex-1].EntityKeys[i]);
			//TVZ_CreatureType, TVZ_AIType, PosX, PosY, TVZ_Faction, GUID
			var returnItem = new Entity("Default", "Default", temp[0], temp[1], "Default", this.GUIDTicker);
			//Give the Entity a graphical representation
			returnItem.setSpritesheet(this.Pages[0].CacheRetrieve("Image", "Spinny.png"));
			toReturn.push(returnItem);
			this.GUIDTicker++;
		}
		return(toReturn);
	}
}
/**
* Returns an audio object for the stage audio
* @param {Integer} PageIndex Page number to load from 
* @return {Array[]} Returns a loaded array of the pages Audio
*/
ResourceManager.prototype.LoadPageAudio = function(PageIndex){
	if(PageIndex != null && PageIndex > 0){
		var toReturn = new Array();
		//create an Audio object for each sound in the Page
		for(var i =0; i < this.Pages[PageIndex-1].AudioKeys.length; i++){
			var temp = this.Pages[PageIndex-1].CacheRetrieve("Audio", this.Pages[PageIndex-1].AudioKeys[i]);
			toReturn.push(new Audio(temp, true, 5, 10.0, ".ogg"));
		}
		return(toReturn);
	}
}
/**
* Caches and returns all backgrounds for the specified stage
* @param {Integer} PageNumber Page number to load from 
* @return {Image[]} Returns all background objects for the current stage
*/
ResourceManager.prototype.LoadBackgrounds = function(PageNumber){
	if(PageNumber != null){
		var thePage = this.Pages[PageNumber - 1];
		var RetrievedBackgrounds = new Array();
		
		for(var i = 0; i < thePage.Backgrounds.length; i++){
			RetrievedBackgrounds.push(thePage.CacheRetrieve("Image", thePage.Backgrounds[i]));
		}
		return(this.ImageLoader(RetrievedBackgrounds));
	}
}
/**
* Takes an array of filenames and returns the corresponding array of Image objects
* @param {Array[]} ImageArray The array of filename strings to load
* @return {Array[]} Returns a Loaded Image object
*/
ResourceManager.prototype.ImageLoader = function(ImageArray){
    if(ImageArray != null){
        var ReturnArray = new Array();
        for(var i = 0; i < ImageArray.length; i++){
                var temp = new Image();
                temp.src = ImageArray[i][0];
                if(ImageArray[i].length > 1){
                	ReturnArray.push(new Array(temp, ImageArray[i][1], ImageArray[i][2]));
                }else{
                	ReturnArray.push(new Array(temp, 0, 0));
                }
        }
        return(ReturnArray);
    }
}
