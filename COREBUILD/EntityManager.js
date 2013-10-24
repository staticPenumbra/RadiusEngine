/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the main EntityManager definition
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
/**
 * ###############################################################################################################
 *                                              EntityManager
 */
/**
 * @class
 * Manager Class for the List of Application Entities
 *
 * @description
 * All in-application Entities are registered with the Entity Manager
 **/
 /**
 * Specifies an in application entity manager
 * @constructor
 */
var EntityManager = function() {
	this.Entities = new Array();
	this.AIManager = new AIController(this.Entities);
	this.CurrentGUID = 0;
	this.NumPlayers = 0;
	this.NumNPC = 0;
	this.ResourceManager = null;
}
//------------------------------------------------------------------------GET ACCESSORS---------------------------------------------
/**
* Returns the set of current application entities
* @return {Entity[]} A reference to an array of current Entities
*/
EntityManager.prototype.GetEntities = function(){
	if(this.Entities != null){
		return(this.Entities);
	}
}
//------------------------------------------------------------------------SET ACCESSORS---------------------------------------------
/**
* Sets the ResourceManager
* @param {ResourceManager} A reference to an array of current Entities
*/
EntityManager.prototype.SetResourceManager = function(Manager){
	if(Manager != null){
		this.ResourceManager = Manager;
	}
}
/**
* Sets a Door to the open position
* @param {Entity[]} A reference to an array of current Entities
*/
EntityManager.prototype.SetOpen = function(Door){
	if(Door.GetReferenceName() == "Door"){
	//woo it's a real door
		Door.SetOpen(true);
	}
}
//------------------------------------------------------------------------UTILITY FUNCTIONS-----------------------------------------
/**
* Function to reset the Entity manager when the stage is switched
* @param {Entity[]} A reference to an array of current Entities
*/
EntityManager.prototype.Reset = function(){
	this.Entities = new Array();
	this.AIManager = new AIController(this.Entities);
	this.CurrentGUID = 0;
	this.NumPlayers = 0;
}
/**
* Function to Load stage entities from the resource manager
* @param {Integer} PageIndex The page number to load
* @param {ResourceManager} ResourceManager A handle to the running instance of the resource manager
* @return {Entity[]} A reference to an array of all the loaded entities
*/
EntityManager.prototype.LoadEntities = function(PageIndex, ResourceManager){
	//Clear out the old Entity List
	this.Entities = ResourceManager.LoadPageEntities(PageIndex);
	return(this.Entities);
}
/**
* Helper function for collision algorithm takes two point arrays
* @param {Array[]} Object1 A reference to the colliding array of box points UL,UR,LL, LR
* @param {Array[]} Object2 A reference to the stationary array of box points UL,UR,LL, LR
*/
EntityManager.prototype.CollisionCheck = function(Object1, Object2){
		//vert
		var cond1 = (Object1[0][1] > Object2[2][1]);
		//vert
		var cond2 = (Object1[2][1] < Object2[0][1]);
		//horiz
		var cond3 = (Object1[1][0] < Object2[0][0]);
		//horiz
		var cond4 = (Object1[0][0] > Object2[1][0]);
		if(!((cond1) || (cond2) || (cond3) || (cond4))){
		//We're not outside the box so we must be inside
		return(true);
		}
}
/**
* Checks to make sure an entity hasn't tripped a trigger returns an array of fired triggers
* @param {Trigger[]} Triggers A reference to an array of triggers to test
* @return {Trigger[]} A reference to an array of all the fired triggers in this application cycle
*/
EntityManager.prototype.CheckTriggers = function(Triggers){
	if(Triggers != null){
		var FiredTriggers = new Array();
		for(var i = 0; i < Triggers.length; i++){
			var Trigger = Triggers[i];
			var TriggerPosition = Trigger.GetPosition();
			var TriggerCorners = Trigger.GetCorners();
			//For each Trigger try the list of application entities make sure to only process players
				for(var j = 0; j < this.Entities.length; j++){
					var Entity = this.Entities[j];
					if(Entity.GetReferenceName() == "Player"){
						var EntityPosition = Entity.GetPosition();
						var EntityVector = Entity.GetVelocity();
						var EntityCorners = Entity.GetCorners();
						//Compare the current position to see if the Entity is on the Trigger
						if(this.CollisionCheck(EntityCorners, TriggerCorners)){
							//We're not outside the box so we must be inside fire the trigger
							FiredTriggers.push(Trigger.Fire(Entity));
							//Make sure to remove the trigger from the processing list if it's fire once
							if(Trigger.GetFireOnce() == true){
								Triggers.splice(i, 1);
							}
						}
					}
				}
		}
		return(FiredTriggers);
	}
}
/**
* Helper function to change an entities travel direction
* @param {Entity} Entity The entity to modify
* @param {String} Facing A string indicating the travel direction to change to
*/
EntityManager.prototype.PlayerState = function(Entity, Facing){
      if(Entity != null){
        var EntSpeed = Entity.GetSpeed();
        Entity.ChangeFacing(Facing);
        Entity.ApplyVelocity(Facing, EntSpeed);
      }
}
/**
* Loads and adds an Entity to the Entity manager
* @param {String} EntityType The type of entity to add: Zombie, Player, Wall, Door etc.
* @param {String} AIType The AI type controlling the entity null for player
* @param {Input} Controller The Current Input object to register to the entity(player only)
* @param {Integer} StageIndex Index of the stage to load resources from
* @param {Integer} ImageIndex Database index of the entity Image
* @param {Integer} EntityIndex Database index of the entity
* @return {Entity} A handle to the loaded entity
*/
EntityManager.prototype.LoadEntity = function(EntityType, AIType, Controller, StageIndex, ImageIndex, EntityIndex){
	try{
		if(EntityType != null && AIType != null && Controller != null && StageIndex != null){
			switch(EntityType){
				case "Wall":
					var Position = this.ResourceManager.GetStartingPosition(StageIndex, EntityIndex, "Wall");
					var Sprite = this.ResourceManager.GetWallSprite(StageIndex, ImageIndex);
					var NewEntity = new Entity("Wall", AIType, Position[0], Position[1], "WALL_FACTION", this.CurrentGUID);
				break;
				case "Door":
					var Position = this.ResourceManager.GetStartingPosition(StageIndex, EntityIndex, "Door");
					var Sprite = this.ResourceManager.GetDoorSprite(StageIndex, ImageIndex);
					var NewEntity = new Entity("Door", AIType, Position[0], Position[1], "WALL_FACTION", this.CurrentGUID);
				break;
				case "Zombie":
					var Position = this.ResourceManager.GetStartingPosition(StageIndex, EntityIndex, "NPC");
					var Sprite = this.ResourceManager.GetNPCSprite(StageIndex, ImageIndex);
					var NewEntity = new Entity("zombie", AIType, Position[0], Position[1], "ZOMBIE_FACTION", this.CurrentGUID);
				break;
				case "Player":
					var Position = this.ResourceManager.GetStartingPosition(StageIndex, this.NumPlayers, "Player");
					var Sprite = this.ResourceManager.LoadPlayerSprite(StageIndex, this.NumPlayers);
					var NewEntity = new Entity("player" + (this.NumPlayers+1), "none", Position[0], Position[1], "PLAYER_FACTION", this.CurrentGUID);
				break;
				default:
				alert("Error: Trying to add Unknown entity type");
				return(false);
				break;
			}
			this.NumPlayers = this.NumPlayers + 1;
			NewEntity.setSpritesheet(Sprite);
            this.Entities.push(NewEntity);
			return(NewEntity);
		}
	}
	catch(err){
    alert(err.toString() + "101(47z Error: Couldn't Add " + EntityType + " to Application");
    }
}
/**
* Function to shoot the current weapon in the current direction
* @param {Entity} Entity the Shooting Entity
*/
EntityManager.prototype.Shoot = function(Entity){
    //Switch handler based on the weapon type
    switch(Entity.GetWeapon()){
        case "Claw":
        var Bullet = Entity.Shoot(Entity.GetFacing(), "Claw");
        this.AddEntity(Bullet);
        break;
        case "Knife":
        var Bullet = Entity.Shoot(Entity.GetFacing(), "Knife");
        this.AddEntity(Bullet);
        break;
        case "pistol":
        var Bullet = Entity.Shoot(Entity.GetFacing(), "Pistol");
        this.AddEntity(Bullet);
        break;
        case "rifle":
        var Bullet = Entity.Shoot(Entity.GetFacing(), "Rifle");
        this.AddEntity(Bullet);
        break;
        case "shotgun":
        var Bullet = Entity.Shoot(Entity.GetFacing(), "Shotgun");
        this.AddEntity(Bullet);
        break;
        default:
        alert("Error: Updater.Shoot invalid weapon type");
        break;
    }
}
/**
* Function to add an Entity to the Application
* @param {Entity} TVZ_Entity The Entity to add to the list of active entities 
*/
EntityManager.prototype.AddEntity = function(TVZ_Entity) {
    if(TVZ_Entity != null){
        this.Entities.push(TVZ_Entity);
    }
}
/**
* Function to remove an out of bounds bullet
* @param {Entity} Entity The Entity to check for bullet syndrome
* @return {Integer} Flag integer indicating whether the bullet was killed 1 or not 0
*/
EntityManager.prototype.KillBullets = function(Entity){
    if(Entity.GetType() == 'TVZ_pistolBullet' || Entity.GetType() == 'TVZ_shotgunBullet' || Entity.GetType() == 'TVZ_rifleBullet'){
        //Delete entity
		this.RemoveEntity(Entity);
		//return 1 killed
		return(1);
    }
	return(0);
}
/**
* Function to remove a door
* @param {Entity} Entity The Entity to check for door syndrome
* @return {Integer} Flag integer indicating whether the door was killed 1 or not 0
*/
EntityManager.prototype.KillDoors = function(Entity){
    if(Entity.GetType() == 'Door'){
        //Delete entity
		this.RemoveEntity(Entity);
		//return 1 killed
		return(1);
    }
	return(0);
}
/**
* Remove the given Entity from the Entity list
* @param {Entity} TVZ_Entity The Entity to remove from the Entity list
*/
EntityManager.prototype.RemoveEntity = function(Entity) {
    if(Entity != null){
        //Iterate through the Entity list and remove the listed object reference
        for(var i = 0; i<this.Entities.length; i++){
            if(this.Entities[i] == Entity){
            this.Entities.splice(i, 1);
            }
        }
    }
}
/**
* Function to change the current entity weapon
* @param {String} PlayerOrNPC States whether player type or NPC type
* @param {String} args Keymapping args
*/
EntityManager.prototype.EntityCHWeapon = function(PlayerOrNPC, args){
    if(PlayerOrNPC != null && args != null){
        for(var i = 0; i < this.Entities.length; i++){
        var Ent = this.Entities[i];
            switch(Ent.GetType()){
                case "player1":
                if(args == "player1 chweapon"){
					Ent.NextWeapon();
                }
                break;
                case "player2":
                if(args == "player2 chweapon"){
					Ent.NextWeapon();
                }
                break;
                default:
                break;    
            }
        }
    }   
}
/**
* Function to shoot the current weapon in the current direction
* @param {String} PlayerOrNPC States whether player type or NPC type
* @param {String} args Keymapping args
*/
EntityManager.prototype.EntityShoot = function(PlayerOrNPC, args){
    if(PlayerOrNPC != null && args != null){
        for(var i = 0; i < this.Entities.length; i++){
        var Ent = this.Entities[i];
            switch(Ent.GetType()){
                case "player1":
                if(args == "player1 shoot"){
                this.Shoot(Ent);
                }
                break;
                case "player2":
                if(args == "player2 shoot"){
                this.Shoot(Ent);
                }
                break;
                default:
                break;    
            }
        }
    }   
}
/**
* Function to check for the death of an entity takes in an array of names
* @param {String[]} Names An array of entity type name strings to check
* @return {Boolean} Flag indicating whether an instance of the name was found or not
*/
EntityManager.prototype.CheckDead = function(Names){
	if(Names != null){
		//for each name
		for(var i = 0;i < Names.length; i++){
			//for each entity
			for(var j = 0; j < this.Entities.length; j++){
				//Compare name string
				if(Names[i] == this.Entities[j].GetType()){
					//Found one so still alive
					return(false);
				}
			}
		
		}
	return(true);
	}
}
/**
* Function to update all of the Entity positions every cycle
* @param {String[]} Names An array of entity type name strings to check
* @return {Boolean} Flag indicating whether an instance of the name was found or not
*/
EntityManager.prototype.UpdateEntities = function(){
    if(this.Entities != null && this.Entities.length > 0){
    //We have entities to update
        for(var i = 0; i < this.Entities.length; i++){
            //Make sure the entity is on screen 
            var Removed = this.CheckBounds(this.Entities[i]);
			//Need to decrement i after an element is deleted and the number of entities is reduced
			if(Removed > 0){
				i = i - Removed;
			}
            //Update Entity Position
            Removed = this.UpdatePosition(this.Entities[i]);
			//we need to decrement i if any removed
			if(Removed > 0){
				i = i - Removed;
			}
            //If the Entity is an AI
			if(!(this.Entities[i])){
			 alert("Undefined Entity");
			}
                if(this.Entities[i].GetType() == "zombie"){
                    this.AIManager.SetCurrentEntity(this.Entities[i]);
                    this.AIManager.RunRoutine(this.Entities[i]);
                }
                if(this.Entities[i].GetType() == "TVZ_pistolBullet"){
                    this.AIManager.SetCurrentEntity(this.Entities[i]);
                    this.AIManager.RunRoutine(this.Entities[i]);
                }
                if(this.Entities[i].GetType() == "TVZ_shotgunBullet"){
                    this.AIManager.SetCurrentEntity(this.Entities[i]);
                    this.AIManager.RunRoutine(this.Entities[i]);
                }
                if(this.Entities[i].GetType() == "TVZ_rifleBullet"){
                    this.AIManager.SetCurrentEntity(this.Entities[i]);
                    this.AIManager.RunRoutine(this.Entities[i]);
                }
        }
        this.AIManager.UpdateEntities(this.Entities);    
    }
}
/**
* Returns an array of 4 coordinate points UpperL, UpperR, LowerL, LowerR
* @param {Entity} Entity1 The Entity to process
* @returns {Array[]} Returns the array of x,y points [Upper Left, Upper Right, Lower Left, Lower Right]
*/
EntityManager.prototype.GetCornerPoints = function(Entity){
    if(Entity != null){
        var ImageDimensions = Entity.GetImageDimensions();
        //Upper Left
        var UL = Entity.GetPosition();
        //Upper Right
        var UR = new Array(UL[0] + ImageDimensions[0], UL[1]);
        //Lower Left
        var LL = new Array(UL[0], UL[1] + ImageDimensions[1]);
        //Lower Right
        var LR = new Array(UL[0] + ImageDimensions[0], UL[1] + ImageDimensions[1]);
        return(new Array(UL, UR, LL, LR));
    }
}
/**
* Applies Damage and returns the number of killed entities
* @param {Entity} Weapon Colliding/Damaging Entity
* @param {Entity} Victim The Victim taking damage
* @return {Integer} Integer representing the number of killed Entities
*/
EntityManager.prototype.DoDamage = function(Weapon, Victim){
	if(Weapon != null && Victim != null){
		var killed = 0;
		switch(Weapon.GetType()){
		    //Pistol Bullet Collision Handler
			case "TVZ_pistolBullet":
				var dead = Victim.TakeDamage(Weapon.GetDamage());
				if(dead == 0){
					this.RemoveEntity(Victim);
					killed++;
				}
				this.RemoveEntity(Weapon);
				killed++;
			break;
			case "TVZ_shotgunBullet":
				var dead = Victim.TakeDamage(Weapon.GetDamage());
				if(dead == 0){
					this.RemoveEntity(Victim);
					killed++;
				}
				this.RemoveEntity(Weapon);
				killed++;
			break;
			case "TVZ_rifleBullet":
				var dead = Victim.TakeDamage(Weapon.GetDamage());
				if(dead == 0){
					this.RemoveEntity(Victim);
					killed++;
				}
				this.RemoveEntity(Weapon);
				killed++;
			break;
			//Zombie Collision Handler
			case "zombie":
				if(Victim.GetType() != "zombie"){
					var dead = Victim.TakeDamage(Weapon.GetDamage());
					if(dead == 0){
						this.RemoveEntity(Victim);
						killed++;
					}
				}
			break;
			default:
			break;
		}
		return(killed);
	}
}
/**
* Function to fix the orientation of 2 colliding entities
* @param {Entity} Mover The Moving Entity
* @param {Entity} Obstacle The Entity to avoid collison with
* @param {String} MoverLocation The Direction the Mover is from the obstacle.  Valid: n, ne, e, se, s, sw, w, nw 
*/
EntityManager.prototype.SetSnug = function(Mover, Obstacle, MoverLocation){
    var MoverVector = Mover.GetVelocity();
    var MoverCorners = Mover.GetCorners();//[Upper Left, Upper Right, Lower Left, Lower Right]
    var ObstacleCorners = Obstacle.GetCorners();//[Upper Left, Upper Right, Lower Left, Lower Right]
    switch(MoverLocation){
    case 'n':
    if(MoverVector[0] == 's'){
        if(MoverVector[1] + MoverCorners[2][1] > ObstacleCorners[0][1]){
            Mover.ApplyVelocity('s', (ObstacleCorners[0][1] - 1) - MoverCorners[2][1]);
        }
    }
    break;
    case 's':
    if(MoverVector[0] == 'n'){
        if(MoverCorners[0][1] - MoverVector[1] < ObstacleCorners[2][1]){
            Mover.ApplyVelocity('n', MoverCorners[0][1] - ObstacleCorners[2][1] + 1);
        }
    }
    break;
    case 'e':
    if(MoverVector[0] == 'w'){
        if(MoverCorners[0][0] - MoverVector[1] < ObstacleCorners[1][0]){
            Mover.ApplyVelocity('w', MoverCorners[0][0] - (ObstacleCorners[1][0] + 1));
        }
    }
    break;
    case 'w':
    if(MoverVector[0] == 'e'){
        if(MoverCorners[1][0] + MoverVector[1] > ObstacleCorners[0][0]){
            Mover.ApplyVelocity('e', (ObstacleCorners[0][0] - 1) - MoverCorners[1][0]);
        }
    }
    break;
    default:
		alert("EntityManager SetSnug Unknown Direction");
    break;
    }                            
}
/**
* Function to stop an entity
* @param {Entity} Entity The Entity to stop 
*/
EntityManager.prototype.StopEntity = function(Entity){
	var Vector = Entity.GetVelocity();
	var Pos = Entity.GetPosition();
	switch(Vector[0]){
		case "n":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0], Pos[1] + Vector[1]);
		break;
		case "s":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0], Pos[1] - Vector[1]);
		break;
		case "e":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0] - Vector[1], Pos[1]);
		break;
		case "w":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0] + Vector[1], Pos[1]);
		break;
		case "ne":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0] - Vector[1], Pos[1] + Vector[1]);
		break;
		case "se":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0] - Vector[1], Pos[1] - Vector[1]);
		break;
		case "nw":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0] + Vector[1], Pos[1] + Vector[1]);
		break;
		case "sw":
			Entity.ApplyVelocity("c", 0);
			Entity.Move(Pos[0] + Vector[1], Pos[1] - Vector[1]);
		break;
		default:
			alert("Unknown wall contact direction");
		break;
	}	
}
/**
* Function to check an entity for collision against all other application entities
* @param {Entity} Entity The Entity to check 
* @returns {Integer} The number of killed entities
*/
EntityManager.prototype.CheckAllCollisions = function(Entity){
	if(Entity != null){
		var E1Corners = Entity.GetCorners();
		var Entity1UL = E1Corners[0];
		var Entity1UR = E1Corners[1];
		var Entity1LL = E1Corners[2];
		var Entity1LR = E1Corners[3];
		var killed = 0;
		//Now that we have the position compare it to the other entities in the Application
		for(var i = 0; i < this.Entities.length; i++){
			if(this.Entities[i] != Entity){
				var E2Corners = this.Entities[i].GetCorners();
				var Entity2UL = E2Corners[0];
				var Entity2UR = E2Corners[1];
				var Entity2LL = E2Corners[2];
				var Entity2LR = E2Corners[3];
				//Establish the 4 basic conditions 
				var ResultMatrix = new Array((Entity1UR[0]<Entity2UL[0]), (Entity1UL[0]>Entity2UR[0]), (Entity1UL[1]>Entity2LL[1]), (Entity1LL[1]<Entity2UL[1]));
				if(this.CollisionCheck(this.Entities[i].GetCorners(), Entity.GetCorners())){
				//alert("Collision: " + this.Entities[i].GetReferenceName() + " With " + Entity.GetReferenceName());
				var ColliderName = Entity.GetReferenceName();
				var CollideeName = this.Entities[i].GetReferenceName();
					if(ColliderName == "Player" && CollideeName == "Door"){
						//Open the door
						//alert("Door Collision");
						this.SetOpen(this.Entities[i]);
					}else{
						//We have a collision Apply damage, make sure we dont clobber the one who fired us
						if(this.Entities[i] != Entity.GetFiredBy()){
							//Account for a wall collision
							if(CollideeName == "Wall" || CollideeName == "Door"){
								//We have a wall entity so push back on the moving entity or kill it if it's a bullet	
								//If its a Door cause Damage to the door
								switch(Entity.GetType()){
									case "TVZ_pistolBullet":
										if(CollideeName == "Door"){
											var DoorDie = this.Entities[i].TakeDamage(Entity.GetDamage());
											if(DoorDie == 0){
												this.KillDoors(this.Entities[i]);
												killed++;
											}	
											//we have a colliding bullet kill it
											this.KillBullets(Entity);
											killed++;
										}else{
											//we have a colliding bullet kill it
											this.KillBullets(Entity);
											killed++;
										}
									break;
									case "TVZ_shotgunBullet":
										if(CollideeName == "Door"){
											var DoorDie = this.Entities[i].TakeDamage(Entity.GetDamage());
											if(DoorDie == 0){
												this.KillDoors(this.Entities[i]);
												killed++;
											}	
											//we have a colliding bullet kill it
											this.KillBullets(Entity);
											killed++;
										}else{
											//we have a colliding bullet kill it
											this.KillBullets(Entity);
											killed++;
										}
									break;
									case "TVZ_rifleBullet":
										if(CollideeName == "Door"){
											var DoorDie = this.Entities[i].TakeDamage(Entity.GetDamage());
											if(DoorDie == 0){
												this.KillDoors(this.Entities[i]);
												killed++;
											}	
											//we have a colliding bullet kill it
											this.KillBullets(Entity);
											killed++;
										}else{
											//we have a colliding bullet kill it
											this.KillBullets(Entity);
											killed++;
										}
									break;
									case "player1":
										//UPDATE TO USE THE OPEN FEATURE / CHANGE IMAGE TO OPEN STATE
										//this.Entities[i].SetOpen(true);
										this.StopEntity(Entity);
									break;
									case "player2":
										//UPDATE TO USE THE OPEN FEATURE / CHANGE IMAGE TO OPEN STATE
										//this.Entities[i].SetOpen(true);
										this.StopEntity(Entity);
									break;
									default:
										this.StopEntity(Entity);
									break;
								}
							}else{
								killed = this.DoDamage(Entity, this.Entities[i]);
							}
						}
					}
				}
			}
		}
		//return the number of killed entities
		return(killed);
	}
}
/**
* Function to check if an entity is within screen bounds and stop it if it is going over
* @param {Entity} Entity The Entity to check bounds on
* @returns {Integer} The number of killed objects
*/
EntityManager.prototype.CheckBounds = function(Entity){
    //Make sure there is an Entity being passed
    if(Entity != null){
        var Pos = Entity.GetPosition();
        var Velo = Entity.GetVelocity();
        var pts = this.GetCornerPoints(Entity);
		var killed = 0;
        if(Velo[0] == 'w' && Pos[0] - Velo[1] <= 0){ 
            //Reset Vector
            Entity.ApplyVelocity('w', Pos[0] - 1);
            killed = this.KillBullets(Entity);
        }
        if(Velo[0] == 'e' && pts[1][0] + Velo[1] >= this.ResolutionX - 1){
            //Reset Vector
            Entity.ApplyVelocity('e', (this.ResolutionX - 1) - pts[1][0]);
            killed = this.KillBullets(Entity);
        }
        if(Velo[0] == 'n' && Pos[1] - Velo[1] <= 0){
            //Reset Vector
            Entity.ApplyVelocity('n', Pos[1] - 1);
            killed = this.KillBullets(Entity);
        } 
        if(Velo[0] == 's' && pts[2][1] + Velo[1] >= this.ResolutionY - 1){
            //Reset Vector
            Entity.ApplyVelocity('s', (this.ResolutionY - 1) - pts[2][1]);
            killed = this.KillBullets(Entity);
        }  
		return(killed);
    }
}
/**
* Function to update an entity based on its component Vector
* @param {Entity} Entity The Entity to update
* @returns {Integer} The number of removed entities
*/
EntityManager.prototype.UpdatePosition = function(Entity){
    if(Entity != null){
		var removed = 0;
        switch(Entity.GetVelocity()[0]){
            case 'c':
            break;
            case 'n':
            Entity.Move(Entity.GetPosition()[0], Entity.GetPosition()[1] - Entity.GetVelocity()[1]);
            removed = this.CheckAllCollisions(Entity);
            break;
            case 's':
            Entity.Move(Entity.GetPosition()[0], Entity.GetPosition()[1] + Entity.GetVelocity()[1]);
            removed = this.CheckAllCollisions(Entity);
            break;
            case 'w':
            Entity.Move(Entity.GetPosition()[0] - Entity.GetVelocity()[1], Entity.GetPosition()[1]);
            removed = this.CheckAllCollisions(Entity);
            break;
            case 'e':
            Entity.Move(Entity.GetPosition()[0] + Entity.GetVelocity()[1], Entity.GetPosition()[1]);
            removed = this.CheckAllCollisions(Entity);
            break;
			case 'ne':
			Entity.Move(Entity.GetPosition()[0] + Entity.GetVelocity()[1], Entity.GetPosition()[1] - Entity.GetVelocity()[1]);
            removed = this.CheckAllCollisions(Entity);
			break;
			case 'se':
			Entity.Move(Entity.GetPosition()[0] + Entity.GetVelocity()[1], Entity.GetPosition()[1] + Entity.GetVelocity()[1]);
            removed = this.CheckAllCollisions(Entity);
			break;
			case 'nw':
			Entity.Move(Entity.GetPosition()[0] - Entity.GetVelocity()[1], Entity.GetPosition()[1] - Entity.GetVelocity()[1]);
            removed = this.CheckAllCollisions(Entity);
			break;
			case 'sw':
			Entity.Move(Entity.GetPosition()[0] - Entity.GetVelocity()[1], Entity.GetPosition()[1] + Entity.GetVelocity()[1]);
            removed = this.CheckAllCollisions(Entity);
			break;
            default:
            alert("Unmapped update direction");
            break;
        }
		return(removed);
    }
}
/**
* Handler to create an entity move event
* @param {boolean} PlayerOrNPC flag indicating whether the moving entity is 0 Player or 1 NPC
* @param {String} args Preprocessed arguments indicating the key that was pressed   
*/
EntityManager.prototype.EntityMove = function(PlayerOrNPC, args){
    //Returns the Arguments player/NPC, player1/player2 up/down/left/right
     if(args == "player1 up" || args == "player1 down" || args == "player1 left" || args == "player1 right"){
    //start movement in the specified direction for player 1
        for(var i = 0; i < this.Entities.length; i++){
            var Ent = this.Entities[i];
            if(Ent.GetType() == "player1"){
                var velo = Ent.GetVelocity();
				Ent.SetMoving(true);
                switch(args){
                    case "player1 up":
                        this.PlayerState(Ent, 'n');
                        this.Player1KeyHeld = 1;
                        break;
                    case "player1 down":
                        this.PlayerState(Ent, 's');
                        this.Player1KeyHeld = 1;
                        break;
                    case "player1 left":
                        this.PlayerState(Ent, 'w');
                        this.Player1KeyHeld = 1;
                        break;
                    case "player1 right":
                        this.PlayerState(Ent, 'e');
                        this.Player1KeyHeld = 1;
                        break;
                    default:
                        alert("Error, Unknown Direction");
                        break;
                }
            }
        }
    }else{
        if(args == "player2 up" || args == "player2 down" || args == "player2 left" || args == "player2 right"){
        //start movement in the specified direction for player 2
            for(var i = 0; i < this.Entities.length; i++){
                var Ent = this.Entities[i];
                var EntSpeed = Ent.GetSpeed();
                if(this.Entities[i].GetType() == "player2"){
					this.Entities[i].SetMoving(true);
                    switch(args){
                        case "player2 up":
                        this.PlayerState(Ent, 'n');
                        this.Player1KeyHeld = 1;
                        break;
                        case "player2 down":
                        this.PlayerState(Ent, 's');
                        this.Player1KeyHeld = 1;
                        break;
                        case "player2 left":
						this.PlayerState(Ent, 'w');
                        this.Player1KeyHeld = 1;
                        break;
                        case "player2 right":
						this.PlayerState(Ent, 'e');
                        this.Player1KeyHeld = 1;
                        break;
                        default:
                        alert("Error, Unknown Direction");
                        break;
                    }
                }
            }
        }else{
        alert("Entity not a Player!");
        }
    } 
}
/**
* Handler to stop entity movement in a direction
* @param {boolean} PlayerOrNPC flag indicating whether the moving entity is 0 Player or 1 NPC
* @param {String} args Preprocessed arguments indicating the key that was pressed   
*/
EntityManager.prototype.EntityStop = function(PlayerOrNPC, args){
    //Returns the Arguments player/NPC, player1/player2 up/down/left/right
    if(args == "player1 up" || args == "player1 down" || args == "player1 left" || args == "player1 right"){
    //stop movement in the specified direction for player 1
        this.Player1KeyHeld = 0;
        for(var i = 0; i < this.Entities.length; i++){
                var Ent = this.Entities[i];
                if(Ent.GetType() == "player1"){
                    Ent.ApplyVelocity(Ent.GetVelocity()[0], 0);
					Ent.SetMoving(false);
                }
        }
    }
    else{
        if(args == "player2 up" || args == "player2 down" || args == "player2 left" || args == "player2 right"){
        //stop movement in the specified direction for player 2
        this.Player2KeyHeld = 0;
        for(var i = 0; i < this.Entities.length; i++){
                var Ent = this.Entities[i];
                if(Ent.GetType() == "player2"){
                    Ent.ApplyVelocity(Ent.GetVelocity()[0], 0);
					Ent.SetMoving(false);
                }
        }
        }else{
        //!!!Not a player, stop NPC movement 
        }
    }
}