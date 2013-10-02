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
	this.Pages = new Array(new Stage("Index", Root));
	this.Pages[0].Load();
	this.ResourceRoot = Root;
	/*-------------------DATABASE CACHE---------------------------*/
	this.L2DOMCache = new Array();
	this.L2ImageCache= new Array();
	this.L2AudioCache = new Array();
	this.CacheInit(1);
}
//-----------------------------------------------------Get Accessors----------------------------------------------
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
//Warning: DATABASE DEFAULT SHOULD BE READ ONLY!!
//----------------------------------------------------UTILITY FUNCTIONS-------------------------------------------
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
* @param {String[]} FilenameArray The array of filename strings to load
* @return {Image[]} Returns a reference to the loaded Images in array format
*/
ResourceManager.prototype.ImageLoader = function(FilenameArray){
    if(FilenameArray != null){
        var ReturnArray = new Array();
        for(var i = 0; i < FilenameArray.length; i++){
                ReturnArray.push(new Image());
                ReturnArray[i].src = FilenameArray[i];
        }
        return(ReturnArray);
    }
}