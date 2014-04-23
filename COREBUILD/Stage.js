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
	this.Sounds = new Array();
	this.Inputs = new Array();
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
			case "index":
			this.index();
			break;
			case "page2":
			this.page2();
			break;
			case "page3":
			this.page3();
			break;
			case "page4":
			this.page4();
			break;
			case "page5":
			this.page5();
			break;
			case "page6":
			this.page6();
			break;
			case "page7":
			this.page7();
			break;
			case "page8":
			this.page8();
			break;
			case "page9":
			this.page9();
			break;
			case "page10":
			this.page10();
			break;
			case "page11":
			this.page11();
			break;
			case "page12":
			this.page12();
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
Stage.prototype.index = function(){
	this.EntityKeys = new Array();
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page1";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = true;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("ppt1.png");
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("ppt1.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg1/ppt1.png',460,230));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 500, 25, "Radius Core", "44px Arial", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(200, 130, 900, 25, "(An introduction to web application development with Radius)", "28px Arial", "blue"));
}
Stage.prototype.page2 = function(){
	this.EntityKeys = new Array();
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    this.Title = "page2";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("ppt2.png");
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("ppt2.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg2/ppt2.png', 800, 200));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 500, 25, "Introduction/Who I am", "40px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 130, 650, 25, "* Background", "32px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 180, 650, 25, "  - Software Validation (Intel)", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 240, 650, 25, "  - API Design (Intel)", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 300, 650, 25, "  - Embedded Computer graphics systems (Intel)", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 360, 750, 25, "  - E-Commerce web applications and browser plugins (Intel)", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 440, 600, 25, "* Developer/Entrepreneur", "32px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 490, 600, 25, "  - New web technologies", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	this.DOMData.push(new Array(50, 540, 600, 25, "  - Platform Independent solutions", "24px Verdana", "blue"));				
}
Stage.prototype.page3 = function(){
	this.EntityKeys = new Array();
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page3";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("drupal.png","wordpress.png","joomla.png","netnuke.png","refinery.png","modx.png");
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("drupal.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg3/drupal.png',120, 430));
	this.ImageKeys.push("wordpress.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg3/wordpress.png', 250, 530));
	this.ImageKeys.push("joomla.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg3/joomla.png', 450, 430));
	this.ImageKeys.push("netnuke.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg3/netnuke.png', 640, 530));
	this.ImageKeys.push("refinery.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg3/refinery.png', 850, 430));
	this.ImageKeys.push("modx.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg3/modx.png', 1000, 530));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 700, 25, "Overview(What is a CMS)", "40px Verdana", "black"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 330, 1100, 25, " *Radius is not a full CMS...yet", "30px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 150, 700, 25, " - Manages Site Layout and Data Features", "30px Verdana", "red"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 900, 25, " - Can require little or no coding", "30px Verdana", "black"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 250, 1000, 25, " - Usually customized through things like themes and modules", "30px Verdana", "blue"));		
}
Stage.prototype.page4 = function(){
	this.EntityKeys = new Array();
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	this.Inputs = new Array("WASD", "Mouse");
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page4";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("barricade.png","concrete5.png","couch.png","drupal5.png","glfusion.png");
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("barricade.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg4/barricade.png',700,470));
	this.ImageKeys.push("concrete5.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg4/concrete5.png',500,470));
	this.ImageKeys.push("couch.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg4/couch.png',300,470));
	this.ImageKeys.push("drupal5.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg4/drupal5.png',70,430));
	this.ImageKeys.push("glfusion.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg4/glfusion.png',300,550));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 500, 25, "Possible roadblocks to modern CMS", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 150, 500, 25, "HTML5 application support", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 500, 25, "Embedded memory constraints", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 250, 500, 25, "Plugins and runtime constraints", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 300, 500, 25, "Code Maintainability (Tight coupling)", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 350, 500, 25, "Future support (Language specific)", "24px Verdana", "blue"));		
}
Stage.prototype.page5 = function(){
this.EntityKeys = new Array();
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page5";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 900, 25, "Introduction to Radius", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 150, 1100, 25, "Radius is an HTML5 client framework for developing fully interactive web applications", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 900, 25, "Features: ", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 250, 900, 25, " - Full separation of client and server implementations", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 300, 900, 25, " - Stand alone(does not require other libraries or plugins)", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 350, 900, 25, " - Lightweight capability for embedded devices", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 400, 1100, 25, " - Inexpensive web hosting Written in Javascript, server language agnostic", "24px Verdana", "blue"));	
}
Stage.prototype.page6 = function(){
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page6";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 500, 25, "High Level Overview", "40px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 1100, 25, " ** Entire Application running inside of canvas no DOM or CSS needed", "30px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 300, 900, 25, " ** The HTML defines a hardware profile", "30px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 400, 900, 25, " ** Site is defined within a custom database backend", "30px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 500, 700, 25, " ** A webserver is all you need to run Radius", "30px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 600, 900, 25, "Note: Browser independent but must support HTML5", "30px Verdana", "black"));	
}
Stage.prototype.page7 = function(){
	this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page6";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	this.Backgrounds.push("iphone.png");
	/*--------------------------------------Backgrounds--------------------------------------------------------*/
	this.ImageKeys.push("iphone.png");
	this.ImageData.push(new Array(this.ResourceRoot + 'img/pg7/iphone.png', 650, 40));
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(350, 50, 500, 25, "Site Design Theory", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 150, 500, 25, "Template Page Elements", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 500, 25, " - Layout on Grid", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 250, 500, 25, "Set Hardware memory profile", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 300, 500, 25, " - Memory Sensitive?", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 350, 500, 25, "Accumulate resources", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 400, 500, 25, " - Mp3, Mpeg4, ogg", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 450, 500, 25, "Apply AI to entities", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 500, 500, 25, " - Adaptive Features and Menu systems", "24px Verdana", "blue"));		
}
Stage.prototype.page8 = function(){
this.EntityData = new Array();
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page8";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 800, 25, "“Core” Components", "italic bold 40px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 150, 1100, 25, "TriggerManager (Passive interaction interface manages listeners)", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 200, 1100, 25, "Updater (application clock library controls runtime speed)", "24px Verdana", "red"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 250, 1100, 25, "ScreenMap (Engine graphics rendering interface)", "24px Verdana", "green"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 300, 1100, 25, "ResourceManager (Database interface for engine runtime)", "24px Verdana", "maroon"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 350, 1100, 25, "MenuManager (Controls UI interface to application with menu layers)", "24px Verdana", "black"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 400, 1100, 25, "InputManager (Controls Engine interface to hardware IO devices)", "24px Verdana", "green"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 450, 1300, 25, "EntityManager (Controls application and game entities managing object lifetime)", "24px Verdana", "purple"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 500, 1300, 25, "EventManager (controls packaging and depackaging of events on event bus; “singleton” class)", "24px Verdana", "magenta"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 550, 1300, 25, "AudioManager (Should Manage Allocation/Dealloc of Audio clips and play interface)", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(20, 600, 1100, 25, "AIManager (Should manage AI subroutines for autonomous objects)", "24px Verdana", "red"));	
}
Stage.prototype.page9 = function(){
	this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    this.Title = "page9";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(400, 300, 900, 25, "Sample Site Declaration", "40px Verdana", "blue"));
}
Stage.prototype.page10 = function(){
this.AudioKeys = new Array();
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page10";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 500, 25, "Beyond Core", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 150, 900, 25, "Streaming Video Module", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 1100, 25, " - Allow efficient streaming of user videos", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 250, 500, 25, "SEO Module", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 300, 1100, 25, " - Meta for interacting with web spiders", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 350, 700, 25, "Community templates", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 400, 1100, 25, " - More site template files for people to mod", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 450, 1100, 25, "Radius Package Manager", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 500, 1100, 25, " - A way to easily search for and find libraries", "24px Verdana", "blue"));
}
Stage.prototype.page11 = function(){
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page11";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(450, 50, 500, 25, "How to Contribute", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 150, 1100, 25, "Browse the code and grab your copy: https://github.com/staticPenumbra/RadiusEngine", "24px Verdana", "blue"));
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 200, 1100, 25, "For questions about getting the code e-mail me (In-person meetings preferred)", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 300, 1100, 25, "Contact: clay@codequest.co", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 350, 1100, 25, "Site URL: www.codequest.co", "24px Verdana", "blue"));	
	this.DOMKeys.push("Text2");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(50, 400, 1100, 25, "Informal Development Blog: tvzdev.blogspot.com", "24px Verdana", "blue"));		
}
Stage.prototype.page12 = function(){
	this.AudioData = new Array();
	this.ImageKeys = new Array();
	this.ImageData = new Array();
	this.DOMKeys = new Array();
	this.DOMData = new Array();
	 /*--------------------------------------------GENERAL------------------------------------------------------*/
    	this.Title = "page12";
   	this.ScreenWidth = 1400;
	this.ScreenHeight = 600;
	this.TitleFlag = false;
	this.Inputs = new Array("WASD", "Mouse");
	/*---------------------------------------------CATEGORY GROUPINGS------------------------------------------*/
	/*------------------------------------Stage Menu Configuration---------------------------------------------*/
	this.DOMKeys.push("Text1");
	//Origin x, y, dimx, dimy, text, font
	this.DOMData.push(new Array(500, 300, 500, 25, "Questions", "bold 44px Arial", "blue"));
}
