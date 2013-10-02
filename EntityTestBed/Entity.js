/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main Entity object definition from walls to players to Enemies
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              Entity
 */
/**
 * @class
 * Class modeling an in-application Entity
 *
 * @description
 * All in-application entities are modeled as a generic entity type
 **/
 /**
 * @constructor
 */
var Entity = function(TVZ_CreatureType, TVZ_AIType, PosX, PosY, TVZ_Faction, GUID) {
    this.GUID = GUID;
    this.CreatureType = TVZ_CreatureType; //String name of the current creature type 
    this.ReferenceName = null; //Reference name of the current object
	this.PlayerInput = null;  //The player Input object (if defined then PC not defined is NPC)
	this.SpriteSheet = null;   //Set with setSpritesheet(src)
	this.Open = false;			//(For doors only)
	this.AIType = TVZ_AIType;  //AI type string for AI controller
	this.SolidFlag = 1;  //Boolean indicating if the object is solid or passthrough
	this.HitPoints = 1; //The total number of "hits" the entity can withstand before destruction **determined by creature type
	this.Speed = 0; //The traveling speed of the Entity **determined by creature Type
	this.TravelDirection = null; //The current traveling direction of the entity
	this.SightRadius = 5; //The sight radius of the current Entity **determined by creature type
	this.XPos = PosX;  //The current X position of the Entity
	this.YPos = PosY;  //The current Y position of the Entity
	this.ImageWidth = null;   //The Image width for the current spritesheet cell **determined by creature type
	this.ImageHeight = null; //The Image width for the current spritesheet cell **determined by creature type
	this.DestroySounds = null; //Creature Audio object for death sounds **determined by creature type
	this.MoveSounds = null; //Creature Audio object for movement sounds **determined by creature type
	this.AttackSounds = null; //Creature Audio object for attacking sounds **determined by creature type
	this.Faction = TVZ_Faction; //The current faction of the Entity (Determined who can damage and who can be damaged by the current)
	this.Weapon = null;  //The current weapon of the Entity **determined by creature type
	this.Inventory = null; //A String list of current Entities contained in the current Entity inventory **determined by creature type
	this.Acceleration = 0; //Acceleration constant applied to the current entity
	this.VelocityVector = new Array('c', 0); //Velocity vector of the entity indicating both a direction and a magnitude
	this.shown = true;     //Visibility of the Entity
	this.zoomLevel = 1;    //Zoom level of the Entity for resizing
	this.shadow = 0;    //Shadow on(1) or off(0)
	this.AIFocus = null;   //The current AI target of the object **Set by AI controller
	this.frames1 = 1;    //The number of frames in the current animation
	this.currentFrame = 0; //The current frame in the animation sequence
	this.DateObject = new Date(); //Creation timestamp for timer functions
	this.duration = 0;
	this.TravelCells = null; //Contains the number of cells for the entity on creation(N, NE, E, SE, S, SW, W, NW)
	this.CellOrder = null; //Maps the cell order to how the sprite appears in spritesheet 
	this.LastUpdate = null;
	this.IsMoving = false;
	this.Damage = 0;
	this.FiredBy = null;
	this.CurrentTarget = null; //Target that the current Entity is looking at
    this.Setup();
}
//--------------------------------------------------------SET METHODS------------------------------------------------------
/**
* Function to set the Entities currently watched Target
* @param {Boolean} Bool True or False indicating what to set it to
*/
Entity.prototype.SetOpen = function(Bool){
	if(Bool == true || Bool == false){
		this.Open = Bool;
	}
}
/**
* Function to set the Entities currently watched Target
* @param {Entity} Target Reference to a target Entity
*/
Entity.prototype.SetCurrentTarget = function(Target){
	if(Target != null && Target instanceof Entity){
		this.CurrentTarget = Target;
	}
}
/**
* Function to set width of the Entity image **will default to type value if not specified
* @param {Integer} Value Width value to set 
*/
Entity.prototype.SetImageWidth = function(Value){
	if(Value != null){
		this.ImageWidth = Value;
	}
}
/**
* Function to set the height of the Entity image **will default to type value if not specified
* @param {Integer} Value Height value to set
*/
Entity.prototype.SetImageHeight = function(Value){
	if(Value != null){
		this.ImageHeight = Value;
	}
}
/**
* Function to set the weapon of an entity
* @param {String} Weapon weapon to switch to 
*/
Entity.prototype.SetCurrentWeapon = function(Weapon){
	if(Weapon != null){
		this.Weapon = Weapon;
	}
}
/**
* Function to set the current entities sight radius
* @param {Integer} Radius Radius value to set
*/
Entity.prototype.SetSightRadius = function(Radius){
	if(Radius != null){
		this.SightRadius = Radius;
	}
}
/**
* Sets the Entity that fired the current entity 
* @param {Entity} Entity Reference to the entity to set
*/
Entity.prototype.SetFiredBy = function(Entity){
	if(Entity != null){
		this.FiredBy = Entity;
	}
}
/**
* Sets the Moving flag for an entity
*/
Entity.prototype.SetMoving = function(Boolean){
	if(Boolean != null){
		this.IsMoving=Boolean;
	}
}
/**
* Function to set the current frame
* @param {Integer} frameNumber the current frame number in the sequence
*/	 
Entity.prototype.SetFrame = function(frameNumber){
        this.currentFrame = frameNumber;    
}
//--------------------------------------------------------------GET ACCESSORS-----------------------------------------
/**
* Function to return the Entities currently watched Target
* @return {Entity} Returns a reference to the Entities current Target
*/
Entity.prototype.GetCurrentTarget = function(){
		return(this.CurrentTarget);
}
/**
* Function to return the number of hitpoints for the current entity
* @return {Integer} Returns the number of hitpoints for the current entity
*/
Entity.prototype.GetHitpoints = function() {
    return(this.HitPoints);
}
/**
* Function to return the cell values for the current Entity
* @return {Array[]} Dimensions x, y of the 2D image square
* @param {Entity} Entity Reference to the entity to set
*/
Entity.prototype.GetCells = function(Direction){
	if(this.TravelCells != null && Direction != null){
		switch(Direction){
			case 'n':
			return(this.TravelCells[0]);
			break;
			case 'ne':
			return(this.TravelCells[1]);
			break;
			case 'e':
			return(this.TravelCells[2]);
			break;
			case 'se':
			return(this.TravelCells[3]);
			break;
			case 's':
			return(this.TravelCells[4]);
			break;
			case 'sw':
			return(this.TravelCells[5]);
			break;
			case 'w':
			return(this.TravelCells[6]);
			break;
			case 'nw':
			return(this.TravelCells[7]);
			break;
			default:
			alert("Invalid Travel Direction: Entity");
			break;
		}
	}
}
/**
* Changes the current AI focus of the Entity
* @param {Entity} Reference Entity reference to focus on
*/
Entity.prototype.GetReferenceName = function() {
	if(this.ReferenceName != null){
		return(this.ReferenceName);
	}
}
/**
* Returns whether the current Entity is animating or not
* @return {Boolean} True; the entity is animating, false; the entity is not animating
*/
Entity.prototype.IsAnimating = function(){
	return(this.IsMoving);
}
/**
* Function to return who fired the entity
* @return {Entity} Reference to the firing Entity
*/
Entity.prototype.GetFiredBy = function(){
	if(this.FiredBy != null){
		return(this.FiredBy);
	}
}
/**
* Calculates each corner point for the entity and returns the whole as an array of points
* @return {Array[]} Array of corner points x, y for the current entity
*/
Entity.prototype.GetCorners = function(){
	var UL = new Array(this.XPos, this.YPos);
	var UR = new Array(UL[0] + this.ImageWidth, UL[1]);
	var LL = new Array(UL[0], UL[1] + this.ImageHeight);
	var LR = new Array(UL[0] + this.ImageWidth, UL[1] + this.ImageHeight);
	return(new Array(UL, UR, LL, LR));
}
/**
* Returns the external damage potential of the entity
* @return {Integer} Number representing the amount of damage a collision with the entity will cause
*/
Entity.prototype.GetDamage = function(){
	if(this.Damage != null){
	return(this.Damage);
	}
}
/**
* Returns an array of the Sprite directional cell order
* @return {Array[]} Array of Integers indicating the sprite directional cell order
*/
Entity.prototype.GetCellOrder = function(){
	return(this.CellOrder);
}
/**
* Gets the current frame in the sequence
* @return {Integer} Date object indicating the previous timestamp
*/ 
Entity.prototype.GetTimestamp = function(){
        return(this.LastUpdate);   
}
/**
* Function to get the current frame
* @return {Integer} Returns the current Frame
*/	
Entity.prototype.GetFrame = function(){
        return(this.currentFrame);   
}
/**
* Function to return the current sprite image depending on sprite factors
* @return {Image} Returns an Image for the current spritesheet
*/	 
Entity.prototype.GetSpriteSheet = function(){
    if(this.SpriteSheet != null){
        return(this.SpriteSheet);    
    }
}
/**
* Function to return the facing direction for the current Entity
* @return {String} Returns a string for the travel direction n e s w
*/	 
Entity.prototype.GetFacing = function(){
    return(this.TravelDirection);
}
/**
* Function to return the associated image dimensions
* @return {Integer[]} Returns the current width and height dimensions for the image
*/	
Entity.prototype.GetImageDimensions = function(){
    //Test for null values
    if(this.ImageHeight != null && this.ImageWidth != null){
        return(new Array(this.ImageWidth, this.ImageHeight));
    }
}
/**
* Function to return the current Entities weapon
* @return {String} Returns a string for the current weapon
*/	 
Entity.prototype.GetWeapon = function(){
    return(this.Weapon);
}
/**
* Function to return the Speed of the Entity 
* direction[0], magnitude[1]; directon can be c, u, d, l, r(center, up, down, left,right)
* @return {Array[]} Returns velocity vector of the current Entity Direction[0] Magnitude[1]
*/	 
Entity.prototype.GetSpeed = function(){
    return(this.Speed);
}
/**
* Function to return the Velocity vector of the Entity 
* direction[0], magnitude[1]; directon can be c, u, d, l, r(center, up, down, left,right)
* @return {Array[]} Returns velocity vector of the current Entity Direction[0] Magnitude[1]
*/	 
Entity.prototype.GetVelocity = function(){
    return(this.VelocityVector);
}
/**
* Function to return the current position of the Entity as an x, y array
* @return {Integer[]} Returns the current X and Y position of the Entity as an array
*/	
Entity.prototype.GetPosition = function(){
    if(this.XPos > -1 && this.YPos > -1){
    var tmp = new Array(this.XPos, this.YPos);
    return(tmp);
    }
}
/**
*@return {String} Returns the current creature type string for the entity
*/
Entity.prototype.GetType = function(){
    if(this.CreatureType != null){
    return(this.CreatureType);
    }
}
/**
* Function to return the current AI entity sight radius
* @return {Integer} Returns an integer value specifying the current sight radius of the entity
*/	
Entity.prototype.GetSightRadius = function(){
    return(this.SightRadius);
}
/**
* Updates the sprite change timestamp
*/	
Entity.prototype.UpdateModified = function(){
	this.LastUpdate = Math.round(new Date().getTime());
}
//-----------------------------------------------------------------------------------UTILITY METHODS-----------------------
/**
* Function to apply a velocity to an Entity
* @param {String} Direction The current 2 character string indicating the direction to apply the force
* @param {Integer} Magnitude The Integer magnitude to apply
*/
Entity.prototype.ApplyVelocity = function(Direction, Magnitude){
    if(Direction == 'c' || Direction == 'n' || Direction == 's' || Direction == 'w' || Direction == 'e' || Direction == 'ne' || Direction == 'nw' || Direction == 'se' || Direction == 'sw'){
    //We have a valid direction now make sure we do not have a negative magnitude
        if(Magnitude >= 0){
                this.VelocityVector = new Array(Direction, Magnitude);  
        }
    }   
}
/**
* Removes the specified entity from the current entities inventory
* @param {Entity} Entity Entity to remove from the current Entities inventory
*/
Entity.prototype.RemoveFromInventory = function(Entity) {
    //Loop through the Inventory, make sure it's created
    if(this.Inventory != null){
        //find each instance with the specified tag and delete it
        for(var j = 0; j < this.Inventory.length; j++){
            if(this.Inventory[j] == Entity){
            this.Inventory.splice(j, 1);
            }
        }
    }	
}
/**
* Adds the specified entity to the current entities inventory
* @param {Entity} ATOI Entity to add to the current Entities inventory
*/
Entity.prototype.AddToInventory = function(ATOI) {
    try{
        this.Inventory.push(ATOI);
    }
    catch(err){
    alert(err + "Trouble adding to inventory");
    }	
}
/**
* Sets the type of weapon for the current entity
* @param {Entity} GunType Inventory gun to change to
*/
Entity.prototype.ChangeWeapon = function(GunType) {
	try{
	   //Make sure the inventory has been created
	   if(this.Inventory != null){
            for(i = 0; i < this.Inventory.length; i++){
            //For each Item in the inventory check for the specified gun
                if(this.Inventory[i] == GunType){
                    //Found it so set to be the current weapon
                    this.Weapon = GunType;
                }
            }
            if(this.Weapon != GunType){
            //oops the weapon isn't in the player inventory generate error
            alert(this.ReferenceName + "Error: 101(47z " + "Cannot change weapon, does not exist in Creature inventory");
            }
	   }
	   else{
	   alert("Inventory is NULL");
	   }
	}
	catch(err)
	{
	   alert(this.ReferenceName + "Error: 101(47z: Could not change the current weapon"); 
	}
}
/**
* Changes the direction the sprite is facing
* @param {String} Direction The 2 character direction string to change to
*/
Entity.prototype.ChangeFacing = function(Direction) {
	try{
	   if(Direction == "n" || Direction == "ne" || Direction == "e" || Direction == "se" || Direction == "s" || Direction == "sw" || Direction == "w" || Direction == "nw"){
        this.TravelDirection = Direction;
        }
    }
    catch(err){
        alert(this.ReferenceName + "Error 101(47z: " + "Could not change Facing Direction"); 
    }
}
/**
* Changes the current AI focus of the Entity
* @param {Entity} Reference Entity reference to focus on
*/
Entity.prototype.AIFocusOn = function(Reference) {
	try{
	   this.AIFocus = Reference;
	}
	catch(err){
	   alert(this.ReferenceName + "Error: 101(47z " + "Could not change or set AI focus");
	}
}
/**
* Function to set the current position of the Entity
* @param {Integer} posX X position to move to
* @param {Integer} posY Y position to move to
*/
Entity.prototype.Move = function(posX, posY) {
    this.XPos = posX;
    this.YPos = posY;
}
/**
* Sets the flag for solid
* @param {Boolean} Solid Solid on or off
*/
Entity.prototype.ToggleSolid = function(Solid){
    if(Solid == true){
        this.SolidFlag = 1; 
    }
    else
    {
        if(Solid == false){
            this.SolidFlag = 0;       
        }
        else//Bad input - generate error 101(47z
        {
            alert(this.ReferenceName + ": Error 101(47z\n\n" + "The invalid Solid flag value, set to true or false");
        }
    }
}
/**
* Sets the player input
* @param {Input} Input Player input to link to this entity
*/
Entity.prototype.setPlayer = function(Input){  
    try{
        this.PlayerInput = Input;
    }
    catch(err){
        alert(err + "Could not set Input for  " + this.ReferenceName);
    }
}
/**
* Set number of animation cells from sprite sheet
* @param {Integer} frameCount The number of frames to set
*/
Entity.prototype.setFrames = function(frameCount) {
	if(frameCount != null){
        this.currentFrame = 0;
        this.frames = frameCount;
	}
}
/**
* Set the current sprite sheet for the Entity
* @param {String | Image} src Either the path string to an image to set or the Image object
*/
Entity.prototype.setSpritesheet = function(src) {
	if(src != null){
        if (src instanceof Image) {
		  this.SpriteSheet = src;
        } else {
		this.SpriteSheet = new Image();
		this.SpriteSheet.src = src;	
	   }
	}
}

//--------------------------------------------Default Constructors for different Entity types--------------------------------------
/**
* Default Configuration -- Sets up an ambiguous Entity
*/
Entity.prototype.DefaultConfiguration = function(){
alert("Error: Default Entity Configuration Called");
}
/**
* PlayerConfigurtion -- Sets up a plain player Entity with creation rules defined inline
*/
Entity.prototype.PlayerConfiguration = function(){
    try{
        this.AIType = "none";
        this.HitPoints = 1; 
        this.Speed = 3;
    	this.VelocityVector = new Array('c', this.Speed);
        this.SightRadius = 5;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = "pistol";
   		this.Inventory = ["pistol", "shotgun", "rifle"];
   		this.TravelDirection = "center";
   		this.ReferenceName = "Player";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2);	
    }catch(err){
    alert(err + "Could not set up Player");
    }
}
/**
* ZombieConfigurtion -- Sets up a plain zombie Entity with creation rules defined inline
*/
Entity.prototype.ZombieConfiguration = function(){
    try{
        this.HitPoints = 5; 
    	this.Speed = 6;
    	this.VelocityVector = new Array('c', this.Speed);
        this.SightRadius = 320;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = "claw";
   		this.Inventory = ["claw", "rags"];
   		this.TravelDirection = "center";
        this.ReferenceName = "Zombie";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2);
		this.Damage = 1;
    }catch(err){
    alert(err + "Could not set up Zombie");
    }
}
/**
* Pistol Bullet Configuration
*/
Entity.prototype.PistolBConfig = function(){
    try{
        this.HitPoints = 1;
		this.Damage = 1;
    	this.Speed = 20;
        this.SightRadius = 5;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = null;
   		this.Inventory = null;
        this.ReferenceName = "Pistol";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2);
    }catch(err){
    alert(err + "Could not set up Pistol Bullet");
    }
}
/**
* Shotgun Bullet Configuration
*/
Entity.prototype.ShotgunBConfig = function(){
    try{
        this.HitPoints = 1;
		this.Damage = 2;
    	this.Speed = 5;
        this.SightRadius = 5;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = null;
   		this.Inventory = null;
   		this.TravelDirection = "center";
        this.ReferenceName = "Shotgun";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2);   	
    }catch(err){
    alert(err + "Could not set up Shotgun Bullet");
    }
}
/**
* Rifle Bullet Configuration
*/
Entity.prototype.RifleBConfig = function(){
    try{
        this.HitPoints = 1; 
    	this.Speed = 15;
		this.Damage = 3;
        this.SightRadius = 5;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = null;
   		this.Inventory = null;
   		this.TravelDirection = "center";
        this.ReferenceName = "Rifle";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2); 	
    }catch(err){
    alert(err + "Could not set up Rifle Bullet");
    }
}
/**
* Wall Configuration
*/
Entity.prototype.WallConfig = function(){
    try{
        this.HitPoints = 100; 
    	this.Speed = 0;
        this.SightRadius = 0;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = null;
   		this.Inventory = null;
   		this.TravelDirection = "center";
        this.ReferenceName = "Wall";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2); 	
    }catch(err){
    alert(err + "Could not set up Wall Object");
    }
}
/**
* Door Configuration
*/
Entity.prototype.DoorConfig = function(){
	 try{
        this.HitPoints = 100; 
    	this.Speed = 0;
        this.SightRadius = 0;
        this.ImageWidth = 32;
        this.ImageHeight = 32;
        this.DestroySounds = null;
        this.MoveSounds = null;
        this.AttackSounds = null;
       	this.Weapon = null;
   		this.Inventory = null;
   		this.TravelDirection = "center";
        this.ReferenceName = "Door";
		this.TravelCells = new Array(4, 4, 6, 4, 4, 4, 6, 4);
		this.CellOrder = new Array(5, 0, 6, 1, 4, 3, 7, 2); 	
    }catch(err){
    alert(err + "Could not set up Wall Object");
    }
}
/**
* Function to set up a unique GUID on Entity creation
*/
Entity.prototype.Setup = function(){
    try{
        switch(this.CreatureType){
		case "Door":
			this.DoorConfig();
			break;			
		case "Wall":
			this.WallConfig();
			break;		
        case "zombie":
            this.ZombieConfiguration();
            break;
        case "player1":
            this.PlayerConfiguration();
            break; 
        case "player2":
            this.PlayerConfiguration();
            break; 
        case "TVZ_pistolBullet":
            this.PistolBConfig();
            break;  
        case "TVZ_shotgunBullet":
            this.ShotgunBConfig();
            break;
        case "TVZ_rifleBullet":
            this.RifleBConfig();
            break;
        default:
            this.DefaultConfiguration();
            break;
        }
    }
    catch(err){
    alert(err + " Could not switch based on Creature type");
    }
}
//---------------------------------------------Action Methods---------------------------------------------------------------
/**
* Animates the appropriate sprite sheet for the Entity
* @param {CanvasContext} CanvasContext The canvas context to animate on
* @param {Timer} Timer The timer object
*/
Entity.prototype.Animate = function(CanvasContext, Timer) {
    //..\img\Sprites
    if (Timer.getMilliseconds() > this.frameTime) {
        //Next Frame
        if (this.duration > 0)
        {
            var DateObject = new Date();

            if (this.duration > 0 && this.frames > 0) 
            {this.frameTime = DateObject.getTime() + (this.duration / this.frames);}
            else 
            {this.frameTime = 0;}

            this.offsetX = this.width * this.currentFrame;

            if (this.currentFrame === (this.frames - 1))
            {this.currentFrame = 0;} 
            else 
            {this.currentFrame++;}
	   }  
    }	
}
/**
* Cycles to the next weapon in the players inventory
*/
Entity.prototype.NextWeapon = function() {
	if(this.Inventory != null){
		var WeaponList = new Array();
		var Next = null;
		for(var i = 0; i < this.Inventory.length; i++){
			switch(this.Inventory[i]){
					case "pistol":
					//this.SetCurrentWeapon("pistol");
					WeaponList.push("pistol");
					break;
					case "shotgun":
					//this.SetCurrentWeapon("shotgun");
					WeaponList.push("shotgun");
					break;
					case "rifle":
					//this.SetCurrentWeapon("rifle");
					WeaponList.push("rifle");
					break;
					default:
					break;
			}
		}
		switch(this.Weapon){
			case "pistol":
				Next = "shotgun";
			break;
			case "shotgun":
				Next = "rifle";
			break;
			case "rifle":
				Next = "pistol";
			break;
			default:
			break;
		}
		for(var j = 0; j < WeaponList.length; j++){
			if(WeaponList[j] == "pistol" && Next == "pistol"){
				this.SetCurrentWeapon("pistol");
			}
			if(WeaponList[j] == "shotgun" && Next == "shotgun"){
				this.SetCurrentWeapon("shotgun");
			}
			if(WeaponList[j] == "rifle" && Next == "rifle"){
				this.SetCurrentWeapon("rifle");
			}
		}
	}
}
/**
* Fires the specified weapon in the specified direction from the current position of the Entity
* @param {String} Direction The 2 character direction to shoot
* @param {String} GunType The gun type to shoot with
*/
Entity.prototype.Shoot = function(Direction, GunType) {
    var MAX = 300;
    var FiredShot = null;
    var ShootingDirectionX = this.XPos;
    var ShootingDirectionY = this.YPos;
	//----------------------SET BULLET SPAWN POSITION HERE------------------------------------------
    switch(Direction){
        case 'n':
        if(ShootingDirectionY - 41 > 0){
			//ShootingDirectionY = ShootingDirectionY - 41;
        }
        break;
        case 'e':
        if(ShootingDirectionX + 41 < MAX){
			//ShootingDirectionX = ShootingDirectionX + 41;
        }
        break
        case 's':
        if(ShootingDirectionY + 41 < MAX){
			//ShootingDirectionY = ShootingDirectionY + 41;
        }
        break
        case 'w':
        if(ShootingDirectionX - 41 > 0){
			//ShootingDirectionX = ShootingDirectionX - 41;
        }
        break
        default:
        break;
    }
    try{
        switch(GunType){
            case "Pistol":
				FiredShot = new Entity("TVZ_pistolBullet", "TVZ_pistolBulletAI", ShootingDirectionX, ShootingDirectionY, this.Faction);
				var SPsheet = new Image();
				SPsheet.src = location.href.substring(0,location.href.lastIndexOf("/")+1) + "img/Sprites/TestImage.png";
				FiredShot.setSpritesheet(SPsheet);
				//Set the entity that fired it
				FiredShot.SetFiredBy(this);
            break;
            case "Shotgun":
				FiredShot = new Entity("TVZ_shotgunBullet", "TVZ_shotgunBulletAI", ShootingDirectionX, ShootingDirectionY, this.Faction);
				var SPsheet = new Image();
				SPsheet.src = location.href.substring(0,location.href.lastIndexOf("/")+1) + "img/Sprites/ShotgunB.png";
				FiredShot.setSpritesheet(SPsheet);
				//Set the entity that fired it
				FiredShot.SetFiredBy(this);
            break; 
            case "Rifle":
				FiredShot = new Entity("TVZ_rifleBullet", "TVZ_rifleBulletAI", ShootingDirectionX, ShootingDirectionY, this.Faction);
				var SPsheet = new Image();
				SPsheet.src = location.href.substring(0,location.href.lastIndexOf("/")+1) + "img/Sprites/TestImage.png";
				FiredShot.setSpritesheet(SPsheet);
				//Set the entity that fired it
				FiredShot.SetFiredBy(this);
            break;
            default:
				window.alert("Error: Cannot find the specified weapon");
            break;   
        }
    }
    catch(err){
		alert(err + " Error in bullet creation");
    }
    if(FiredShot){
    //Now fire the shot in the specified direction
        try{
            FiredShot.ChangeFacing(Direction);
            FiredShot.ApplyVelocity(Direction, FiredShot.GetSpeed());
            return(FiredShot);
        }
        catch(err){
			window.alert("Error Cannot fire " + FiredShot.CreatureType + " In the " + Direction + " Direction");
        }
    }
}
/**
* Does damage to the entity and returns 1 for alive and 0 for dead
* @param {Integer} PointValue Integer value representing the number of damage points to apply
* @return {Integer} An Integer flag for either 1 (alive after damage) or 0 (dead after damage)
*/
Entity.prototype.TakeDamage = function(PointValue) {
    if(this.HitPoints - PointValue <= 0){
    return(0);
    }
	this.HitPoints -= PointValue;
	return(1);
}