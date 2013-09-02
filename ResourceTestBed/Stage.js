/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the definitions and loading for a stage, including backgrounds and resources
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              Stage
 */
/**
 * @class
 * Class modeling a basic relational database
 *
 * @description
 * The Database contains it's own resources and the layout for the entire application
 **/
 /**
 * @constructor
 */
var Stage = function(Name, fileRoot) {
	/*----------------INITIALIZE DB-------------------------*/
	this.ResetDatabase();
	/*----------------META VARIABLES------------------------*/
    this.Name = Name; //Page or Area reference name
	this.Title = null; //Title of the currently loaded page
	this.ScreenWidth = null; //Width of the Page
	this.ScreenHeight = null; //Height of the Page
	this.ResourceRoot = fileRoot; //Installation Root Directory
	this.TimeLimit = 0; //Area time-out value
	this.TitleFlag = false; //Is this the default page?
}
//Frees previously loaded resources and reinitializes
Stage.prototype.ResetDatabase = function(){
	/*----------------META VARIABLES------------------------*/
    this.Name = null;
	this.Title = null;
	this.ScreenWidth = null;
	this.ScreenHeight = null;
	this.TimeLimit = null;
	this.TitleFlag = null;
	this.Backgrounds = new Array();
	this.Triggers = new Array();
	/*-------------------DATABASE CACHE---------------------------*/
	this.CacheKeys = new Array();
	this.CacheData = new Array();
	/*---------------DOM DB------------------------------*/
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	/*---------------IMAGE DB------------------------*/
	this.ImageKeys = new Array();//KEY
	this.ImageData= new Array();//VALUE
	/*---------------AUDIO DB------------------------*/
	this.AudioKeys = new Array();//KEY
	this.AudioData = new Array();//VALUE
	/*---------------ENTITY DB--------------------------------*/
	this.EntityKeys = new Array();//KEY
	this.EntityData = new Array();//VALUE
}
//------------------------------------------------------------------SET ACCESSORS---------------------------
/**
* @param {String} Name The name of the page to load from
*/
Stage.prototype.SetPageName = function(Name){
	if(Name != null){
		this.Name = Name;
	}
}
//-----------------------------------------------------------------GET ACCESSORS--------------------------
/**
* @return {Integer[]} Returns an Integer array with the current stages screen dimensions
*/
Stage.prototype.GetDimensions = function(){
    return(new Array(this.ScreenWidth, this.ScreenHeight));
}
//---------------------------------------------------------------UTILITY FUNCTIONS--------------------------------------------
//Load predefined values for an area
Stage.prototype.Load = function(){
	if(this.Name != null){
		switch(this.Name){
			case "Page1":
			this.Page1();
			break;
			default:
			alert(this.Name + " is undefined");
			break;
		}
	}else{
		alert("Error: Trying to load undefined name");
	}
}
//Searches Cache for Item and returns if present otherwise runs retrieve and load then returns item
/**
* @param {String} RootContainer Name of the root container to search in
* @param {String} Key Key value String to search for and return
* @return {Array[]} Returns a reference to the container searched for
*/
Stage.prototype.CacheRetrieve = function(RootContainer, Key){
	if(RootContainer != null && Key != null){
		var CachePull = this.CacheKeys.indexOf(Key);
		if(CachePull == -1){
			//Cache miss
			//Try the pull from Database 
			var DBPull = this.Retrieve(RootContainer, Key);
			if(DBPull == -1){
				//Item does not exist in cache or Database
				alert("Element: " + Key + " not found in database during cache retrieval");
			}else{
				//Add the element to the cache and then return
				this.CacheKeys.push(Key);
				this.CacheData.push(DBPull);
				return(DBPull);
			}
		}else{
			//found it, return database element
			return(this.CacheData[CachePull]);
		}
	}
}
//Locates Declaration and loads then returns loaded
/**
* @param {String} RootContainer Name of the root container to search in
* @param {String} Key Key value String to search for and return
* @return {Array[]} Returns a reference to the container searched for
*/
Stage.prototype.Retrieve = function(RootContainer, Key){
	if(RootContainer != null && Key != null){
		switch(RootContainer){
			case "Audio":
				var KeyRoot = this.AudioKeys;
				var DataRoot = this.AudioData;
			break;
			case "Image":
				var KeyRoot = this.ImageKeys;
				var DataRoot = this.ImageData;
			break;
			case "DOM":
				var KeyRoot = this.DOMKeys;
				var DataRoot = this.DOMData;
			break;
			case "Entity":
				var KeyRoot = this.EntityKeys;
				var DataRoot = this.EntityData;
			break;
			default:
				alert("Error 101(47z: Database retrieval -- Unknown root element");
			break;
		}
		//Search the Key string
		var index = KeyRoot.indexOf(Key);
		if(index == -1){
			//DB miss
			alert("Element: " + Key + " not found in database");
			return(-1);
		}else{
			//found it, return database element
			return(DataRoot[index]);
		}
	//Error in processing return null
	return(null);
	}
}
Stage.prototype.Page1 = function(){
	/*----------------------------------------Define Database Structure----------------------------------------*/
	// Database shall enforce a maximum depth of 1
	// Application should utilize caching for efficiency
	/*---------------------------------------------------------------------------------------------------------*/	
	this.EntityKeys = new Array();
	this.EntityData = new Array();
	
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    this.Title = "Page1";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = true;
	//Main background rendering order
	this.Backgrounds.push("Installed");
	this.Triggers.push("CornerDialogueTrigger");
    /*----------------------------------------Music------------------------------------------------------------*/
	this.AudioKeys.push("Installed");
	this.AudioData.push(this.ResourceRoot + 'Audio/Music/Stage1/Installed.ogg');
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("Installed");
	this.ImageData.push(this.ResourceRoot + 'Installed.png');
	/*--------------------------------------Menu Backgrounds---------------------------------------------------*/
	this.ImageKeys.push("MenuBackground");
	this.ImageData.push(this.ResourceRoot + 'img/Backgrounds/MainBack.png');
	/*-------------------------------------Player Sprite Sheet-------------------------------------------------*/
    this.ImageKeys.push("Player1");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player1.png');
	this.ImageKeys.push("Player2");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player2.png');
	/*-------------------------------------Entity Starting Data------------------------------------------------*/
	this.EntityKeys.push("Player1");
	this.EntityData.push(new Array(10,10));
	this.EntityKeys.push("Player2");
	this.EntityData.push(new Array(10, 80));
	this.EntityKeys.push("CornerDialogueTrigger");
	//Type, FireOnce, Position, Dimensions
	this.EntityData.push(new Array("dialogue", true, 200, 200, 50, 50));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Menu1");
	this.DOMData.push(new Array(20,20,640,522, new Array("Resume Application", "Options", "Exit"),"Main Menu", "italic bold 24px Verdana", 15));
	this.ImageKeys.push("MenuCursor");
	this.ImageData.push(this.ResourceRoot + 'img/Backgrounds/hand.png');
	/*------------------------------------Trigger Definitions--------------------------------------------------*/
	//this.Triggers.push(new Trigger("dialogue", true, new Array(200, 200), new Array(50, 50)));
	//this.Triggers.push(new Trigger("spawn", true, new Array(200, 200), new Array(50, 50)));
}
