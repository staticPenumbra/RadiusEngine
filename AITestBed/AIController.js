/*----------------------------------------------------------------------------------------------------------
::“Copyright 2013 Clayton Burnett” 
::This program is distributed under the terms of the GNU General Public License
------------------------------------------------------------------------------------------------------------*/
/**
 * @fileOverview
 *
 * This file contains the AI Controller implementation code AI actions are all run through the AI controller
 *
 * @author Clayton Burnett <clay@codequest.co>
 */
 
/**
 * ###############################################################################################################
 *                                              AIController
 */
/**
 * @class
 * Class modelling the various actions an AI can take
 *
 * @description
 * AI Entities are registered with the AI Controller, the controller controls decision making for AI
 **/
 /**
 * @constructor
 */
var AIController = function() {
    //Default Constructor
	this.CurrentEntity = null;
	this.CurrentEntityPosition = null;
	this.Entities = new Array();
	this.PlayerEntities = new Array();
}
//--------------------------------------------SET ACCESSORS--------------------------
/**
* @param {Entity[]} EntityList The canvas context to animate on
*/
AIController.prototype.UpdateEntities = function(EntityList) {
    if(EntityList != null){
        this.Entities = EntityList;
    }
}
/**
* @param {Entity} Entity The canvas context to animate on
*/
AIController.prototype.SetCurrentEntity = function(Entity) {
    if(Entity != null){
        this.CurrentEntity = Entity;
        this.CurrentEntityPosition = Entity.GetPosition();
    }
}

//--------------------------------------------GET ACCESSORS--------------------------

/**
* @return {Entity} Returns the current entity being processed
*/
AIController.prototype.GetCurrentEntity = function(Entity) {
	return(this.Entity);
}



//---------------------------------------------PATHFINDING FUNCTIONS
//Function to move to the last detected X,Y of the Target
/**
* @param {Entity} Target The Entity to move to
* @param {Entity} Entity The moving Entity
*/
AIController.prototype.MoveToTarget = function(Target, Entity) {
	if(Target != null && Entity != null){
		var TargetPosition = Target.GetCorners();
		var MoverPosition = Entity.GetCorners();
		var dx = null;
		var dy = null;
		//Calculate midpoint of the Entities
		var TargetMid = new Array(Math.round((TargetPosition[3][0] + TargetPosition[0][0]) / 2) , Math.round((TargetPosition[3][1] + TargetPosition[0][1]) / 2));
		var MoverMid = new Array(Math.round((MoverPosition[3][0] + MoverPosition[0][0]) / 2) , Math.round((MoverPosition[3][1] + MoverPosition[0][1]) / 2));
		
		//Target is in quadrant 1
		if(MoverMid[0] <= TargetMid[0] && MoverMid[1] >= TargetMid[1]){
			if(MoverMid[0] < TargetMid[0] && MoverMid[1] > TargetMid[1]){
				Entity.ApplyVelocity('ne', Entity.GetSpeed());
				Entity.SetMoving(true);
			}else{
				//if x < then increase x by speed
				if(MoverMid[0] < TargetMid[0]){
					Entity.ApplyVelocity('e', Entity.GetSpeed());
					Entity.SetMoving(true);
				//else if y < then increase y by speed
				}else{
					Entity.ApplyVelocity('n', Entity.GetSpeed());
					Entity.SetMoving(true);
				}
			}
		}
        //Target is in quadrant 2
		if(MoverMid[0] >= TargetMid[0] && MoverMid[1] >= TargetMid[1]){
			if(MoverMid[0] > TargetMid[0] && MoverMid[1] > TargetMid[1]){
				Entity.ApplyVelocity('nw', Entity.GetSpeed());
				Entity.SetMoving(true);
			}else{
				//if x < then increase x by speed
				if(MoverMid[0] > TargetMid[0]){
					Entity.ApplyVelocity('w', Entity.GetSpeed());
					Entity.SetMoving(true);
				//else if y < then increase y by speed
				}else{
					Entity.ApplyVelocity('n', Entity.GetSpeed());
					Entity.SetMoving(true);
				}
			}
		}
		//Target is in quadrant 3
		if(MoverMid[0] >= TargetMid[0] && MoverMid[1] <= TargetMid[1]){
			if(MoverMid[0] > TargetMid[0] && MoverMid[1] < TargetMid[1]){
				Entity.ApplyVelocity('sw', Entity.GetSpeed());
				Entity.SetMoving(true);
			}else{
				//if x < then increase x by speed
				if(MoverMid[0] > TargetMid[0]){
					Entity.ApplyVelocity('w', Entity.GetSpeed());
					Entity.SetMoving(true);
				//else if y < then increase y by speed
				}else{
					Entity.ApplyVelocity('s', Entity.GetSpeed());
					Entity.SetMoving(true);
				}
			}
		}
		//Target is in quadrant 4
		if(MoverMid[0] <= TargetMid[0] && MoverMid[1] <= TargetMid[1]){
			if(MoverMid[0] < TargetMid[0] && MoverMid[1] < TargetMid[1]){
				Entity.ApplyVelocity('se', Entity.GetSpeed());
				Entity.SetMoving(true);
			}else{
				//if x < then increase x by speed
				if(MoverMid[0] < TargetMid[0]){
					Entity.ApplyVelocity('e', Entity.GetSpeed());
					Entity.SetMoving(true);
				//else if y < then increase y by speed
				}else{
					Entity.ApplyVelocity('s', Entity.GetSpeed());
					Entity.SetMoving(true);
				}
			}
		}
	}
}
//Calculates if the second Entity is within range of the first
/**
* @param {Entity} Viewer The Entity doing the searching
* @param {Entity} Viewee The Entity to compare to
* @return {Boolean} Returns true: the target is in range or false: not in range
*/
AIController.prototype.DetectAvailableTarget = function(Viewer, Viewee) {
	if(Viewer != null && Viewee != null){
		var VieweePoints = Viewee.GetCorners();
		var ViewerPoints = Viewer.GetCorners();
		var ViewerSightRadius = Viewer.GetSightRadius();
		var DistanceBetween = null;
		var dx = null;
		var dy = null;
		//Calculate midpoint of the Entities
		var VieweeMid = new Array(Math.round((VieweePoints[3][0] + VieweePoints[0][0]) / 2) , Math.round((VieweePoints[3][1] + VieweePoints[0][1]) / 2));
		var ViewerMid = new Array(Math.round((ViewerPoints[3][0] + ViewerPoints[0][0]) / 2) , Math.round((ViewerPoints[3][1] + ViewerPoints[0][1]) / 2));
		
		//First find what scenario we're dealing with and compare the points in the correct scenario
		//D = sqrt((dx^2 + dy^2)
		//UR Q1 E1PT2 to E2PT3
		if(ViewerMid[0] <= VieweeMid[0] && ViewerMid[1] >= VieweeMid[1]){
		//Compare those points, find the positive difference
			dx = VieweeMid[0] - ViewerMid[0];
			dy = ViewerMid[1] - VieweeMid[1];
			DistanceBetween = Math.round(Math.sqrt((dx * dx)+(dy * dy)));
		}
        //UL Q2 E1PT1 to E2PT4
		if(ViewerMid[0] >= VieweeMid[0] && ViewerMid[1] >= VieweeMid[1]){
		//Compare those points, find the positive difference
			dx = ViewerMid[0] - VieweeMid[0];
			dy = ViewerMid[1] - VieweeMid[1];
			DistanceBetween = Math.round(Math.sqrt((dx * dx)+(dy * dy)));
		}
		//LL Q3 E1PT3 to E2PT2
		if(ViewerMid[0] >= VieweeMid[0] && ViewerMid[1] <= VieweeMid[1]){
		//Compare those points, find the positive difference
			dx = ViewerMid[0] - VieweeMid[0];
			dy = VieweeMid[1] - ViewerMid[1];
			DistanceBetween = Math.round(Math.sqrt((dx * dx)+(dy * dy)));
		}
		//LR Q4 E1PT4 to E2PT1
		if(ViewerMid[0] <= VieweeMid[0] && ViewerMid[1] <= VieweeMid[1]){
		//Compare those points, find the positive difference
			dx = VieweeMid[0] - ViewerMid[0];
			dy = VieweeMid[1] - ViewerMid[1];
			DistanceBetween = Math.round(Math.sqrt((dx * dx)+(dy * dy)));
		}
		//Compare to view radius
		if(DistanceBetween <= ViewerSightRadius){
			return(true);
		}else{
			return(false);
		}	
	}
}

//Targets the player nearest the entity if they are in view
/**
* @return {Entity} Returns the current entity being processed or null if none in range
*/
AIController.prototype.TargetNearestPlayer = function(Entity) {
	if(this.Entities != null){
		//-----SECTION 1 VARIABLES
        var TargetSelection = null;
		var PlayersDetected = new Array();
		//Gather a reference to the player entities
        for(var i = 0; i < this.Entities.length; i++){
            if(this.Entities[i].GetType() == "player1" || this.Entities[i].GetType() == "player2"){
				PlayersDetected.push(this.Entities[i]);
            } 
        }	
		//update the player list
		this.PlayerEntities = PlayersDetected;
		//-----SECTION 2 VARIABLES
		var NumPlayerEntities = this.PlayerEntities.length;
			
        //Consider who is available and closest if there are potential targets
        if(NumPlayerEntities != 0){
            for(var i = 0; i < NumPlayerEntities; i++){
                //Decide if they are an available target
				var GoodTarget = this.DetectAvailableTarget(Entity, this.PlayerEntities[i]);
				//Target the entity if they are in range	
				if(GoodTarget == true){
					Entity.SetCurrentTarget(this.PlayerEntities[i]);
					return(this.PlayerEntities[i]);
				}
			}
		return(null);	
		}
	}
}


//----------------------------------------------------AI Type Definitions-----------------------------------------

//Runtime Routine for a zombie entity
AIController.prototype.SimpleZombieRoutine = function() {
	//Target the nearest Player if in view
	if(this.PlayerEntities != null){
		for(var i = 0; i < this.Entities.length; i++){
			//If the entity is a zombie then target nearest player
			if(this.Entities[i].GetType() == "zombie"){
				var newTarget = this.TargetNearestPlayer(this.Entities[i]);
				this.MoveToTarget(newTarget , this.Entities[i]);
			}
		}
	}
}

//AI routine for the Pistol Bullet
AIController.prototype.PistolBulletRoutine = function() {
    if(this.Entities != null){
    var CurrentEntityPos = this.CurrentEntity.GetPosition();
    var CurrentVelocity = this.CurrentEntity.GetVelocity();
    
    //direction magnitude
        switch(CurrentVelocity[0]){
        case "n":
        this.CurrentEntity.ApplyVelocity('n', this.CurrentEntity.GetSpeed());
		this.CurrentEntity.SetMoving(true);
        break;
        case "s":
        this.CurrentEntity.ApplyVelocity('s', this.CurrentEntity.GetSpeed());
		this.CurrentEntity.SetMoving(true);
        break;
        case "w":
        this.CurrentEntity.ApplyVelocity('w', this.CurrentEntity.GetSpeed());
		this.CurrentEntity.SetMoving(true);
        break;
        case "e":
        this.CurrentEntity.ApplyVelocity('e', this.CurrentEntity.GetSpeed());
		this.CurrentEntity.SetMoving(true);
        break;
        case "c":
		this.CurrentEntity.SetMoving(false);
        break;
        default:
        break;
        }
    }
}
//----------------------------------------------------Action Functions--------------------------------------------
//Runs the AI routine for the specified Entity
/**
* @param {Entity} Entity The Entity to run an AI routine on
*/
AIController.prototype.RunRoutine = function(Entity) {
    if(Entity != null && Entity != 0){
        var tempType = Entity.GetType();
        switch(tempType){
            case "player1":
            break;
            case "player2":
            break;
            case "zombie":
            this.SimpleZombieRoutine();
            break;
            case "TVZ_pistolBullet":
            this.PistolBulletRoutine();
            break;
            case "TVZ_shotgunBullet":
            break;
            case "TVZ_rifleBullet":
            break;
            default:
				alert("AI Error: Unlisted entity type");
            break;
        }   
    }
}