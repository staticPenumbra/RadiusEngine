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
	this.Sprites = new Array();
	this.Entities = new Array();
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
			case "Index":
			this.Index();
			break;
			case "About":
			this.About();
			break;
			case "Games":
			this.Games();
			break;
			case "Research":
			this.Research();
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
Stage.prototype.Research = function(){
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
    this.Title = "Home";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = true;
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("Installed.png", "BG.png");
	this.Triggers.push("CornerDialogueTrigger");
    /*----------------------------------------Music------------------------------------------------------------*/
	this.AudioKeys.push("Installed.ogg");
	this.AudioData.push(this.ResourceRoot + 'Audio/Music/Stage1/Installed.ogg');
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("Installed.png");
	this.ImageData.push(this.ResourceRoot + 'img/Installed.png');
	this.ImageKeys.push("BG.png");
	this.ImageData.push(this.ResourceRoot + 'img/BG.png');
	/*--------------------------------------Menu Backgrounds---------------------------------------------------*/
	this.ImageKeys.push("MenuBackground.png");
	this.ImageData.push(this.ResourceRoot + 'img/Backgrounds/MainBack.png');
	/*-------------------------------------Player Sprite Sheet-------------------------------------------------*/
    this.ImageKeys.push("Player1.png");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player1.png');
	this.ImageKeys.push("Player2.png");
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
	this.DOMKeys.push("Link1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 100, 100, 100, "Blog", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link2");
	this.DOMData.push(new Array(50, 150, 100, 100, "YouTube", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link3");
	this.DOMData.push(new Array(50, 200, 100, 100, "Web Avant", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link4");
	this.DOMData.push(new Array(50, 250, 100, 100, "Git Repository", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link5");
	this.DOMData.push(new Array(50, 300, 100, 100, "Games", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Text1");
	this.DOMData.push(new Array(880, 100, 100, 100, "Welcome to the new codequest homepage", "italic bold 20px Verdana", "white"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(880, 150, 100, 100, "We like cats....", "bold 20px Verdana", "white"));
	/*------------------------------------Trigger Definitions--------------------------------------------------*/
	//this.Triggers.push(new Trigger("dialogue", true, new Array(200, 200), new Array(50, 50)));
	//this.Triggers.push(new Trigger("spawn", true, new Array(200, 200), new Array(50, 50)));
}
Stage.prototype.Games = function(){
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
    this.Title = "Home";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = true;
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("Installed.png", "BG.png");
	this.Triggers.push("CornerDialogueTrigger");
    /*----------------------------------------Music------------------------------------------------------------*/
	this.AudioKeys.push("Installed.ogg");
	this.AudioData.push(this.ResourceRoot + 'Audio/Music/Stage1/Installed.ogg');
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("Installed.png");
	this.ImageData.push(this.ResourceRoot + 'img/Installed.png');
	this.ImageKeys.push("BG.png");
	this.ImageData.push(this.ResourceRoot + 'img/BG.png');
	/*--------------------------------------Menu Backgrounds---------------------------------------------------*/
	this.ImageKeys.push("MenuBackground.png");
	this.ImageData.push(this.ResourceRoot + 'img/Backgrounds/MainBack.png');
	/*-------------------------------------Player Sprite Sheet-------------------------------------------------*/
    this.ImageKeys.push("Player1.png");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player1.png');
	this.ImageKeys.push("Player2.png");
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
	this.DOMKeys.push("Link1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 100, 100, 100, "Blog", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link2");
	this.DOMData.push(new Array(50, 150, 100, 100, "YouTube", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link3");
	this.DOMData.push(new Array(50, 200, 100, 100, "Web Avant", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link4");
	this.DOMData.push(new Array(50, 250, 100, 100, "Git Repository", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link5");
	this.DOMData.push(new Array(50, 300, 100, 100, "Games", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Text1");
	this.DOMData.push(new Array(880, 100, 100, 100, "Welcome to the new codequest homepage", "italic bold 20px Verdana", "white"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(880, 150, 100, 100, "We like cats....", "bold 20px Verdana", "white"));
	/*------------------------------------Trigger Definitions--------------------------------------------------*/
	//this.Triggers.push(new Trigger("dialogue", true, new Array(200, 200), new Array(50, 50)));
	//this.Triggers.push(new Trigger("spawn", true, new Array(200, 200), new Array(50, 50)));
}
Stage.prototype.About = function(){
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
    this.Title = "Home";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = true;
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("Installed.png", "BG.png");
	this.Triggers.push("CornerDialogueTrigger");
    /*----------------------------------------Music------------------------------------------------------------*/
	this.AudioKeys.push("Installed.ogg");
	this.AudioData.push(this.ResourceRoot + 'Audio/Music/Stage1/Installed.ogg');
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("Installed.png");
	this.ImageData.push(this.ResourceRoot + 'img/Installed.png');
	this.ImageKeys.push("BG.png");
	this.ImageData.push(this.ResourceRoot + 'img/BG.png');
	/*--------------------------------------Menu Backgrounds---------------------------------------------------*/
	this.ImageKeys.push("MenuBackground.png");
	this.ImageData.push(this.ResourceRoot + 'img/Backgrounds/MainBack.png');
	/*-------------------------------------Player Sprite Sheet-------------------------------------------------*/
    this.ImageKeys.push("Player1.png");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player1.png');
	this.ImageKeys.push("Player2.png");
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
	this.DOMKeys.push("Link1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 100, 100, 100, "Blog", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link2");
	this.DOMData.push(new Array(50, 150, 100, 100, "YouTube", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link3");
	this.DOMData.push(new Array(50, 200, 100, 100, "Web Avant", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link4");
	this.DOMData.push(new Array(50, 250, 100, 100, "Git Repository", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Link5");
	this.DOMData.push(new Array(50, 300, 100, 100, "Games", "italic bold 24px Verdana", "white"));
	this.DOMKeys.push("Text1");
	this.DOMData.push(new Array(880, 100, 100, 100, "Welcome to the new codequest homepage", "italic bold 20px Verdana", "white"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(880, 150, 100, 100, "We like cats....", "bold 20px Verdana", "white"));
	/*------------------------------------Trigger Definitions--------------------------------------------------*/
	//this.Triggers.push(new Trigger("dialogue", true, new Array(200, 200), new Array(50, 50)));
	//this.Triggers.push(new Trigger("spawn", true, new Array(200, 200), new Array(50, 50)));
}
Stage.prototype.Index = function(){
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
    this.Title = "Home";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = true;
	/*---------------------------------------------CATEGORY GROUPINGS(Starting Elements)------------------------------*/
	this.Entities.push("Ball");
	this.Backgrounds.push("RadiusLogo.png");
	this.Sprites.push("Spinny.png");
	//this.Triggers.push("CornerDialogueTrigger");
    /*----------------------------------------Music------------------------------------------------------------*/
	this.AudioKeys.push("Installed.ogg");
	this.AudioData.push(this.ResourceRoot + 'Audio/Music/Stage1/Installed.ogg');
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("RadiusLogo.png");
	this.ImageData.push(this.ResourceRoot + 'img/RadiusLogo.png');
	/*--------------------------------------Menu Backgrounds---------------------------------------------------*/
	this.ImageKeys.push("MenuBackground.png");
	this.ImageData.push(this.ResourceRoot + 'img/Backgrounds/MainBack.png');
	/*-------------------------------------Player Sprite Sheet-------------------------------------------------*/
    this.ImageKeys.push("Spinny.png");
	this.ImageData.push(this.ResourceRoot + 'img/websitespinny.png');
	this.ImageKeys.push("Player1.png");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player1.png');
	this.ImageKeys.push("Player2.png");
	this.ImageData.push(this.ResourceRoot + 'img/Sprites/Player2.png');
	/*-------------------------------------Entity Starting Data------------------------------------------------*/
	//this.EntityKeys.push("Player1");
	//this.EntityData.push(new Array(10,10));
	//this.EntityKeys.push("Player2");
	//this.EntityData.push(new Array(10, 80));
	this.EntityKeys.push("Ball");
	this.EntityData.push(new Array(100,100));
	//this.EntityKeys.push("CornerDialogueTrigger");
	//Type, FireOnce, Position, Dimensions
	//this.EntityData.push(new Array("dialogue", true, 200, 200, 50, 50));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Link1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 100, 100, 100, "Blog", "italic bold 24px Verdana", "black"));
	this.DOMKeys.push("Link2");
	this.DOMData.push(new Array(50, 150, 100, 100, "YouTube", "italic bold 24px Verdana", "black"));
	this.DOMKeys.push("Link3");
	this.DOMData.push(new Array(50, 200, 100, 100, "Web Avant", "italic bold 24px Verdana", "black"));
	this.DOMKeys.push("Link4");
	this.DOMData.push(new Array(50, 250, 100, 100, "Git Repository", "italic bold 24px Verdana", "black"));
	this.DOMKeys.push("Link5");
	this.DOMData.push(new Array(50, 450, 100, 100, "New Stuff:", "italic bold 20px Verdana", "black"));
	this.DOMKeys.push("Text0");
	this.DOMData.push(new Array(50, 300, 100, 100, "Games", "italic bold 24px Verdana", "black"));
	this.DOMKeys.push("Text1");
	this.DOMData.push(new Array(400, 50, 100, 100, "Welcome to the new codequest homepage", "italic bold 20px Verdana", "black"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(800, 150, 100, 100, "NEWS AREA", "bold italic 20px Verdana", "black"));
	this.DOMKeys.push("Text3");
	this.DOMData.push(new Array(800, 200, 100, 100, "10/3/2013 - Webhost is hijacking the page.  The radius project is in the process of porting to a new hosting company due to the pop up ads that have been written into the page without permission.  There's no need to expect any delays or interruptions.  The process should be fairly seamless when everything switches over, thanks to everyone for your support!", "bold 12px Verdana", "black"));
	this.DOMKeys.push("Text4");
	this.DOMData.push(new Array(50, 500, 100, 100, "Memristors!", "italic bold 15px Verdana", "black"));
	this.DOMKeys.push("Text5");
	this.DOMData.push(new Array(200, 500, 100, 100, "Cybernetics", "italic bold 15px Verdana", "black"));
	/*------------------------------------Trigger Definitions--------------------------------------------------*/
	//this.Triggers.push(new Trigger("dialogue", true, new Array(200, 200), new Array(50, 50)));
	//this.Triggers.push(new Trigger("spawn", true, new Array(200, 200), new Array(50, 50)));
}
