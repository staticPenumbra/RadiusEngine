/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main EventManager definition encapsulating any application event
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              EventManager
 */
/**
 * @class
 * Manager Class for a List of Events
 *
 * @description
 * All in-application events are registered and handled by the Event Manager
 **/
 /**
 * @constructor
 */
var EventManager = function(FrontCanvas, FrontCanvasContext, RearCanvas, RearCanvasContext, ResourceRoot, AudioDevice, Window) {
    //Default Constructor
	//Design contains
	this.WindowHandle = Window;
	this.FrontCanvas = FrontCanvas;
	this.FrontCanvasContext = FrontCanvasContext;
	this.RearCanvas = RearCanvas;
	this.RearCanvasContext = RearCanvasContext;
	this.ResourceRoot = ResourceRoot;
	this.AudioPlayers = AudioDevice;
	this.Updater = new Updater();
	this.ResourceManager = new ResourceManager(ResourceRoot);
	this.EntityManager = new EntityManager();
	this.ScreenMap = new ScreenMap(this.ResourceManager.GetPageDimensions(1)[0], this.ResourceManager.GetPageDimensions(1)[1], FrontCanvasContext, RearCanvasContext);
	this.Entities = new Array();
	this.UserInputs = new Array();
	this.CurrentEvents = new Array();
	this.Triggers = new Array();
	this.DeathStage = 2;
	this.AudioController = new AudioController();
	this.CurrentMenu = null;
	
	this.CurrentStage = null;
	this.MenuMode = false;
	this.LoadedAudio = new Array();
	this.EntityManager.SetResourceManager(this.ResourceManager);
}
//---------------------------------------------------------------------GET ACCESSORS--------------------------------------------------
//returns the current stage
/**
* @return {Stage} Returns a reference to the current stage
*/
EventManager.prototype.GetCurrentStage = function(){
	if(this.CurrentStage != null){
		return(this.CurrentStage);
	}
}
//---------------------------------------------------------------------SET ACCESSORS--------------------------------------------------
//Sets the current usable Inputs
/**
* @param {Input[]} Inputs Array of user Inputs to apply
*/
EventManager.prototype.SetUserInputs = function(Inputs) {
	if(Inputs){
		this.UserInputs = Inputs;
	}
}
//Sets the current controls for the specified stage
EventManager.prototype.SetStartingInputs = function(){
	//PLAYER1 INPUT CONFIG
	var Player1 = new Input("WASD");
	//PLAYER2 INPUT CONFIG
	var Player2 = new Input("IJKL");
	//MOUSE INPUT CONFIG
	var MouseControl = new Input("Mouse");
	//Now set the UserInput handling in the Event Manager
	this.UserInputs = new Array(Player1, Player2, MouseControl);
}
//---------------------------------------------------------------------UTILITY FUNCTIONS----------------------------------------------
//When all parameters are set then attempt to start the application with this function
EventManager.prototype.StartEngine = function(){
	this.AudioController.SetAvailableChannels(this.AudioPlayers);
	this.ChangeStage(1);
	this.SetStartingInputs();
}
//Changes The current scope of the application and starts a different stage
/**
* @param {Integer} EntryNumber Stage number to change to
*/
EventManager.prototype.ChangeStage = function(EntryNumber){
	this.CurrentStage = EntryNumber;
	//Change Canvas Screen Resolution
	var Dimension = this.ResourceManager.GetPageDimensions(EntryNumber);
	this.FrontCanvas.style.width = Dimension[0] + "px";
	this.RearCanvas.style.width = Dimension[0] + "px";
	this.FrontCanvas.style.height = Dimension[1] + "px";
	this.RearCanvas.style.height = Dimension[1] + "px";
	//Clear the screen
	this.ScreenMap.Clear();
	//Load Stage Triggers
	this.CacheTriggers(this.CurrentStage);
	//Set X and Y of the new screen resolution
	this.ScreenMap.SetResolution(Dimension[0], Dimension[1]);
	//Load Stage Entities
	this.EntityManager.Reset();
	this.Entities = new Array();
	this.Entities = this.EntityManager.LoadEntities(EntryNumber, this.ResourceManager, this.UserInputs);
	this.ScreenMap.UpdateEntities(this.Entities);
	if(EntryNumber == 0){
		//Display Title Menu
		//this.ShowTitleMenu();
	}
	//Set Background
	this.ScreenMap.SetBackgrounds(this.ResourceManager.LoadBackgrounds(EntryNumber));
	this.LoadMusic(EntryNumber);
}
//Removes the Menu Layer
EventManager.prototype.CloseMenu = function(){
	this.MenuMode = false;
	this.ScreenMap.SetMenuSystem(null);
	this.Updater.SetPaused(false);
}

//Function to display the current system menu
EventManager.prototype.ShowTitleMenu = function(){
	this.MenuMode = true;
	this.ScreenMap.SetMenuSystem(this.ResourceManager.LoadMainMenu())
	this.Updater.SetPaused(true);
}
//Handler for a key release event
/**
* @param {KeyEvent} e KeyEvent object passed by the event handler 
*/
EventManager.prototype.keyUp = function(e) {
    this.AddKeyEvent(e, "keyUp");
}
//Mouseclick event
EventManager.prototype.mouseClick = function(e){
	//Add Mouse Event
	this.AddMouseEvent(e, "Click");
}
//Mousemove event
EventManager.prototype.mouseMove = function(e){
	//Add Mouse Event
	this.AddMouseEvent(e, "Move");
}
//Handler for a keydown event
/**
* @param {KeyEvent} e KeyEvent object passed by the event handler 
*/
EventManager.prototype.keyDown = function(e){
    this.AddKeyEvent(e, "keyDown");
}
//Opens the In-application menu
/**
* @param {Stage} Stage Stage object to open the menu from
*/
EventManager.prototype.OpenMenu = function(Stage){
	this.CurrentMenu = this.ResourceManager.LoadApplicationMenu(Stage);
	this.CurrentMenu.ChangeCursorPosition(0);
	this.ScreenMap.SetMenuSystem(this.CurrentMenu);
	this.Updater.SetPaused(true);
	this.MenuMode = true;
	this.AudioController.PlayAudio("Sound", 0, this.LoadedAudio, false);
}
//Loads the current stage sound clips 
/**
* @param {Stage} Stage Stage object to load the music from
*/
EventManager.prototype.LoadMusic = function(Stage){
	if(Stage != null){
		//Clean previous stage audio
		this.AudioController.Clean();
		//Load new Audio
		this.LoadedAudio = this.ResourceManager.LoadPageAudio(Stage);
		//First Element of the Music is the title music set to repeat
		this.AudioController.PlayAudio("Music", 0, this.LoadedAudio, true);
	}
}
//Cache the triggers for the specified stage or the current stage if null
/**
* @param {Stage} Stage Stage object to load the triggers from
*/
EventManager.prototype.CacheTriggers = function(Stage){
	if(Stage != null){
		this.Triggers = this.ResourceManager.LoadTriggers(Stage);
	}else{
		this.Triggers = this.ResourceManager.LoadTriggers(this.CurrentStage);
	}
}
//Function to load Sound effects
EventManager.prototype.LoadSounds = function(Stage){
}
//Helper function to add keymappings
/**
* @param {String} Player The identifying string for the player to load
* @param {String} Type String representing the control type to switch to
* @param {String} UpOrDown String indicating either keyup or keydown
* @param {String} KeyCode KeyCode pressed
*/
EventManager.prototype.Codes = function(Player, Type, UpOrDown, KeyCode){
     var WASDControl = new Array(87, 83, 65, 68, 69, 27, 67, 13); //up, down. left, right, shoot, menu, chweapon, select
     var ArrowControl = new Array(38, 40, 37, 39, 17, 600, 78); //up, down. left, right, shoot, menu, chweapon
	 var IJKLControl = new Array(73, 75, 74, 76, 85, 600, 78);
     var KeyMapping = new Array("up", "down", "left", "right", "shoot", "menu", "chweapon", "select");
     
     switch(Type){
		case 'WASD':
			var iswasd = WASDControl.indexOf(KeyCode);
			if(iswasd != -1){
				this.AddEvent(new TVZ_Event(UpOrDown, Player + " " + KeyMapping[iswasd]));
			}
		break;
		case 'Arrow':
			var isarrow = ArrowControl.indexOf(KeyCode);
			if(isarrow != -1){
				this.AddEvent(new TVZ_Event(UpOrDown, Player + " " + KeyMapping[isarrow]));
			}
		break;
		case 'IJKL':
			var isijkl = IJKLControl.indexOf(KeyCode);
			if(isijkl != -1){
				this.AddEvent(new TVZ_Event(UpOrDown, Player + " " + KeyMapping[isijkl]));
			}
		break;
		default:
		break;
     }
}
//Handles Menu Selection routine
/**
* @param {Integer} PointerPosition Selected option of the on screen pointer
* @param {Menu} Menu Reference to the current Menu 
*/
EventManager.prototype.MenuHandler = function(PointerPosition, Menu) {
	if(PointerPosition != null && Menu != null){
		switch(PointerPosition){
			case 0:
				//alert("Option 1 Selected");
				this.ChangeStage(1);
				//this.ScreenMap.SetMenuSystem(null);
			break;
			case 1:
				alert("Option 2 Selected");
			break;
			case 2:
				//alert("Option 3 Selected");
				//this.WindowHandle.close();
			break;
			default:
				alert("Unknown Option");
			break;
		}
	}
}

//Function to take application parameters and call the appropriate rendering routine
EventManager.prototype.RenderToScreen = function(){
	//ScreenMap, EntityManager, EventManager.GetCurrentStage()
	//ScreenMap.Clear();
	//this.ScreenMap.SetBackgrounds(GetCurrentBackgrounds(this.CurrentStage));
	this.ScreenMap.RenderCycle(this.EntityManager.GetEntities(), this.ResourceManager.GetDOM(this.CurrentStage));
}
//------------------------------------PROCESSING FUNCTIONS------------------------------------
//Cycles through the list of events and tries running each of the procedures then removes them from the update list
//*********************LOOK OVER THIS*******************************************
EventManager.prototype.RunEvents = function() {
        //Make sure to preprocess event priorities and pause updates prior to running
        this.Preprocess();
        //this.UpdateEntities();
        //Make sure there are events to process
        if(this.CurrentEvents != null && this.CurrentEvents.length != 0){
            //Iterate through the list of events to process, they will be processed in the order recieved
            for(var k = 0; k < this.CurrentEvents.length; k++){
            //Call the events run method
                var out = this.CurrentEvents[k].Execute();
                //Events return a value when executed check for those events and handle output
                if(out == "killme"){
                this.EntityManager.RemoveEntity(this.CurrentEvents[k].GetArg());
                }
                if(this.CurrentEvents[k].GetType() == "create"){
                    //Returns the created Entity
                    this.EntityManager.AddEntity(out);
                }
                if(this.CurrentEvents[k].GetType() == "keyUp"){
                    //Returns the Arguments player1/player2 up/down/left/right/shoot
					switch(out){
						case "player1 shoot":
						break;
						case "player2 shoot":
						break;
						case "player1 menu":
						break;
						case "player2 menu":
						break;
						default:
						this.EntityManager.EntityStop("player", out);
						break;
					
					}
                }
                if(this.CurrentEvents[k].GetType() == "keyDown"){
                     //Returns the Arguments player1/player2 up/down/left/right/shoot
                    //Test for the type of event
					switch(out){
						case "player1 chweapon":
						this.EntityManager.EntityCHWeapon("player", out);
						this.AudioController.PlayAudio("Sound", 6, this.LoadedAudio, false);
						break;
						case "player2 chweapon":
						this.EntityManager.EntityCHWeapon("player", out);
						this.AudioController.PlayAudio("Sound", 6, this.LoadedAudio, false);
						break;
						case "player1 shoot":
						this.EntityManager.EntityShoot("player", out);
						this.AudioController.PlayAudio("Sound", 7, this.LoadedAudio, false);
						break;
						case "player2 shoot":
						this.EntityManager.EntityShoot("player", out);
						this.AudioController.PlayAudio("Sound", 7, this.LoadedAudio, false);
						break;
						case "player1 menu":
						//Open the Menu and pause the application
						if(this.Updater.IsPaused() == false){
							this.OpenMenu(this.CurrentStage);
						}else{
							this.CloseMenu();
						}
						break;
						case "player2 menu":
						break;
						case "player1 select":
						//Selecting a Menu Item
						if(this.MenuMode == true){
							this.MenuHandler(this.ScreenMap.GetMenuPointerPosition(), this.ScreenMap.GetMenu());
						}
						break;
						case "player2 select":
						break;
						default:
						//Must be Moving or selecting a menu option
						if(this.MenuMode == true){
							switch(out){
								case 'player1 up':
								this.ScreenMap.SetMenuPointerPosition(this.ScreenMap.GetMenuPointerPosition() - 1);
								this.AudioController.PlayAudio("Sound", 0, this.LoadedAudio, false);
								break;
								case 'player1 down':
								this.ScreenMap.SetMenuPointerPosition(this.ScreenMap.GetMenuPointerPosition() + 1);
								this.AudioController.PlayAudio("Sound", 0, this.LoadedAudio, false);
								break;
								case 'player1 left':
								break;
								case 'player1 right':
								break;
								case 'player2 up':
								this.ScreenMap.SetMenuPointerPosition(this.ScreenMap.GetMenuPointerPosition() - 1);
								this.AudioController.PlayAudio("Sound", 0, this.LoadedAudio, false);
								break;
								case 'player2 down':
								this.ScreenMap.SetMenuPointerPosition(this.ScreenMap.GetMenuPointerPosition() + 1);
								this.AudioController.PlayAudio("Sound", 0, this.LoadedAudio, false);
								break;
								case 'player2 left':
								break;
								case 'player2 right':
								break;
								default:
								alert("Bad Menu Input Argument");
								break;
							}
						}else{
							this.EntityManager.EntityMove("player", out);
						}
						break;
					
					}
                }
                //Remove the event from the update list
                this.DeleteEvent(k);    
            }
           
	   }
}
//Creates a fired trigger event and returns a handle
/**
* @param {Trigger} Trigger Reference to the trigger tripped
* @return {TVZ_Event} Created Event
*/
EventManager.prototype.CreateTriggerEvent = function(Trigger){
	var CreatedEvent = new TVZ_Event("trigger", Trigger);
	return(CreatedEvent);
}
//Preprocess the list of current updates to fix backup/interrupt and priority changes
EventManager.prototype.Preprocess = function(){
	//Check triggers
	var FiredTriggers = this.EntityManager.CheckTriggers(this.Triggers);
	//Create events for each trigger
	for(var i = 0; i < FiredTriggers.length; i++){
		this.CurrentEvents.push(this.CreateTriggerEvent(FiredTriggers[i]));
	}

    //Make sure there are events to process
     if(this.CurrentEvents != null && this.CurrentEvents.length != 0){
        //-----------------------BACKUP FOR APPLICATION PAUSE-------------------------
        //If there is no backup and the application is paused then make one **make sure to clear backup to null on restore;
        //if(this.Paused == true && this.BackupEventList == null && this.CurrentEvents != null){
        //    this.BackupEventList = this.CurrentEvents;
            //We've backed up the list and we are in pause mode so we can clear the current event list
            //this.CurrentEvents = null;
        //}  
        //----------------------SEARCH THE EVENT QUEUE FOR INTERRUPTS---------------
		if(this.Paused == false){
			for(var z = 0; z < this.CurrentEvents.length; z++){
				//Call the events run method, Interrupt priority established here
				//The below should ensure pause is always run before menu 
				if(this.CurrentEvents[z].GetType() == "pauseinterrupt"){
					this.CurrentEvents[z].Execute();
					//Remove the event from the update list
					this.DeleteEvent(z);
				}
				//Handler for an in application menu keypress
				if(this.CurrentEvents[z].GetType() == "displaymenu"){
					this.CurrentEvents[z].Execute();
					//Remove the event from the update list
					this.DeleteEvent(z);
                }    
			}
		}
     }
}
//Runs the main application loop
EventManager.prototype.RunCycle = function(){
	if(this.Updater != null){
		this.Updater.ProcessCycle(this, this.EntityManager, this.ScreenMap, this.ResourceManager, this.AudioController);
	}
}
//Function to package a mouse event into an event object
/**
* @param {Integer} KeyCode Mouse Event object code passed
* @param {String} Type Either Click or Move
*/
EventManager.prototype.AddMouseEvent = function(KeyCode, Type){
	if(this.UserInputs){
		for(var i = 0; i < this.UserInputs.length; i++){
		//Iterate through user inputs and find the mouse events
			if(this.UserInputs[i].GetControlType() == "Mouse"){
				switch(Type){
					case "Click":
						var MousePos = this.UserInputs[i].GetMousePosition();
						//AudioController.prototype.PlayAudio = function(Type, Track, AudioElements, Repeat){
						//this.AudioController.PlayAudio("Sound", 0, this.LoadedAudio, false);
						//alert("X: " + MousePos[0] + " Y: " + MousePos[1]);
						var elements = this.ResourceManager.GetDOM(this.CurrentStage);
						for(var i=0; i<=elements.length-1; i++){
							var eletemp = elements[i];
							var mouse = new Array(new Array(MousePos[0], MousePos[1]), new Array(MousePos[0]+1, MousePos[1]), new Array(MousePos[0], MousePos[1]+1), new Array(MousePos[0]+1, MousePos[1]+1));
							var text = new Array(new Array(eletemp[0], eletemp[1]), new Array(eletemp[0]+eletemp[2], eletemp[1]), new Array(eletemp[0], eletemp[1]+eletemp[3]), new Array(eletemp[0]+eletemp[2], eletemp[1]+eletemp[3]));
							//UL,UR,LL, LR
							if(this.EntityManager.CollisionCheck(mouse, text) == true){
								switch(i){
									case 0:
									window.location = "http://tvzdev.blogspot.com";
									break;
									case 1:
									window.location = "http://www.youtube.com/user/C120vv";
									break;
									case 2:
									window.location = "http://www.webavant.com";
									break;
									case 3:
									window.location = "https://github.com/staticPenumbra/RadiusEngine";
									break;
									case 4:
									this.ResourceManager.AddDOMElement(new Array(400, 400, 500, 100, "LOADING GITHUB", "italic bold 24px Verdana", "white"));
									break;
								}
							}
						}
					break;
					case "Move":
						//Grab the canvas bounding rectangle and subtract the click area
						var rect = this.FrontCanvas.getBoundingClientRect();
						this.UserInputs[i].SetMousePosition(KeyCode.clientX - rect.left, KeyCode.clientY - rect.top);
					break;
					default:
						alert("Unknown mouse event type");
					break;
				}
			}
		}
	}	
}

//Function to package a keypress event into an event object
/**
* @param {Integer} KeyCode KeyEvent object keycode passed by the event handler 
* @param {String} UpOrDown keyUp or keyDown event type passed by the event handler 
*/
EventManager.prototype.AddKeyEvent = function(KeyCode, UpOrDown){
    //First find out if this is a valid key
    //Even though this is a subclass it is run with window being the current object? this = Window
    if(this.UserInputs){
        var PlayerControls = new Array();
       
        switch(this.UserInputs.length){
            case 1:
            var P1Mappings = this.UserInputs[0].GetMappings();
            break;
            default:
            var P1Mappings = this.UserInputs[0].GetMappings();
            var P2Mappings = this.UserInputs[1].GetMappings();
            break;
            //default:
            //alert("Error: 101(47z: Illegal number of players");
            //break;
        }
        PlayerControls.push(P1Mappings[0]);
        if(P2Mappings != null){
            PlayerControls.push(P2Mappings[0]);
        }
        if(PlayerControls.length == 1){
            //1 Player Mode
            switch(PlayerControls[0]){
                case "WASD":
                this.Codes("player1", 'WASD', UpOrDown, KeyCode);
                break;
                case "Arrow":
                this.Codes("player1", 'Arrow', UpOrDown, KeyCode);
                break;
				case "IJKL":
				this.Codes("player1", 'IJKL', UpOrDown, KeyCode);
				break;
            } 
        }
        if(PlayerControls.length == 2){
        //2 Player Mode
            if(PlayerControls[0] == "WASD" || PlayerControls[1] == "WASD"){
                        if(PlayerControls[0] == "WASD"){
                        this.Codes("player1", 'WASD', UpOrDown, KeyCode);
                        }
                        if(PlayerControls[1] == "WASD"){
                        this.Codes("player2", 'WASD', UpOrDown, KeyCode);
                        }
            }
            if(PlayerControls[0] == "Arrow" || PlayerControls[1] == "Arrow"){
                        if(PlayerControls[0] == "Arrow"){
                        this.Codes("player1", 'Arrow', UpOrDown, KeyCode);
                        }
                        if(PlayerControls[1] == "Arrow"){
                        this.Codes("player2", 'Arrow', UpOrDown, KeyCode);
                        }
            }
			if(PlayerControls[0] == "IJKL" || PlayerControls[1] == "IJKL"){
                        if(PlayerControls[0] == "IJKL"){
                        this.Codes("player1", 'IJKL', UpOrDown, KeyCode);
                        }
                        if(PlayerControls[1] == "IJKL"){
                        this.Codes("player2", 'IJKL', UpOrDown, KeyCode);
                        }
            }
        }
    }
}

//Function to add an event to the event queue
/**
* @param {TVZ_Event} TVZ_Event The event to add to the event processing queue
*/
EventManager.prototype.AddEvent = function(TVZ_Event) {
    //Check for a valid event
    if(TVZ_Event != null){
        //First test to see if we are in a pause state
        if(this.Updater.IsPaused() == true){
            //If we're paused we can only add certain events for processing
            //Allowed: key events, menu events, interrupt events,
            var EvType = TVZ_Event.GetType();
            switch(EvType){
            case "keyUp":
            this.CurrentEvents.push(TVZ_Event);
            break;
            case "keyDown":
            this.CurrentEvents.push(TVZ_Event);
            break;
            case "pauseinterrupt":
            this.CurrentEvents.push(TVZ_Event);
            break;
            case "unpauseinterrupt":
            this.CurrentEvents.push(TVZ_Event);
            break;
            case "displaymenu":
            this.CurrentEvents.push(TVZ_Event);
            break;   
            }
        }
        else{
        //Were not in a paused state so we can add anything
        this.CurrentEvents.push(TVZ_Event);
        }
    }
}
//Removes an event from the list of current updates
/**
* @param {Integer} EventIndex The integer index of the item to be removed
*/
EventManager.prototype.DeleteEvent = function(EventIndex) {
    if(this.CurrentEvents != null && this.CurrentEvents.length != 0){
        this.CurrentEvents.splice(EventIndex, 1);
    }	
}
