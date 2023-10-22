class TailsCPUAI {
	constructor () {
		this.player = null;
		this.target = null;
		this.state = "follow";
		this.followFrame = 0;
		this.spindashFrame = 0;
		this.stuckFrames = 0;
		this.startSpindash = 0;
		this.onscreensprites = [];
	}
	followingState () {
		//search for all sprites on screen, then if there are certian objects,
		//such as monitors, make the ai attack them.
		
		this.player.left = false;
		this.player.right = false;
		this.player.down = false;
		this.player.up = false;
		this.player.wantsToFly = false;
		
		/*for (var sprite of window.sprites) {
			if (sprite.stype !== "tile") {
				//console.log(sprite.stype,sprite);
			}
			if (
			sprite.visible && 
			(sprite.trs > 0.5) 
			&&
			(!(
			sprite.y > 370 ||
            sprite.y < -370 ||
            sprite.x > 350 ||
            sprite.x < -350
			))
			&&
			//check if the sprite is an engine, so we dont get confused if its an debug mode object.
			(!sprite.isEngineSprite)
			){
				var t = this;
				function targetSpeed() {
					t.player.speed = (sprite.x - t.player.x) / 18;
					if (t.player.speed > 4) {
						t.player.speed = 4;
					}
					if (t.player.speed < -4) {
						t.player.speed = -4;
					}
				}
				if (sprite.stype == "motobug") {
					this.player.jump = true;
					targetSpeed();
					return;
				}
				if (sprite.stype == "monitor-ring") {
					if (!sprite.broken) {
						this.player.jump = true;
						targetSpeed();
						return;
					}
				}
				if (sprite.stype == "ring") {
					if ((Math.round(this.player.y/15)*15) > (Math.round(sprite.y/15)*15)) {
						this.player.jump = true;
					}
					targetSpeed();
					return;
				}

			}
		}*/
		this.player.jump = false;
		
		
		var j = this.target.jump;
		var spindashing = this.target.spindash;
		var _ai = this;
		setTimeout(() => {
			_ai.player.jump = j;
		},500)
		
		if ((Math.round(this.player.x/70)*70) > (Math.round(this.target.x/70)*70)) {
			this.player.left = true;
			if (this.player.pushing) {
				if (this.followFrame > 64) {
					this.player.jump = true;
					this.followFrame = 0;
				} else {
					if (this.followFrame > 20) {
						this.player.jump = false;
					}
				}
				
			} else {
				this.player.jump = false;
			}
			if (this.stuckFrames > 150) {
				if (Math.abs(this.player.speed) < 3) {
					this.player.left = false;
					this.player.right = false;
					this.startSpindash = 0;
					this.state = "spindash";
				}
			}
		} else {
			if ((Math.round(this.player.x/70)*70) < (Math.round(this.target.x/70)*70)) {
				this.player.right = true;
				if (this.player.pushing) {
					if (this.followFrame > 64) {
						this.player.jump = true;
						this.followFrame = 0;
					} else {
						if (this.followFrame > 20) {
							this.player.jump = false;
						}
					}
					
				}  else {
					this.player.jump = false;
				}
				if (this.stuckFrames > 150) {
					if (Math.abs(this.player.speed) < 3) {
						this.player.left = false;
						this.player.right = false;
						this.startSpindash = 0;
						this.state = "spindash";
					}
				}
			} else {
				this.followFrame = 0;
				this.stuckFrames = 0;
			}
		}
		this.followFrame += 1;
		this.stuckFrames += 1;
		
		if (this.player.hirt) {
			this.player.down = false;
			this.player.jump = false;
			this.state = "spindash";
			this.startSpindash = 0;
			this.followFrame = 0;
			this.stuckFrames = 0;
		}
	}
	
	getReadyToLeaveLevel () {
		this.player.up = false;
		this.player.down = false;
		this.player.left = false;
		this.player.right = false;
		this.player.jump = false;
	}
	
	spindashState () {
		this.player.left = false;
		this.player.right = false;
		this.player.up = false;
		if (Math.abs(this.player.speed) < 1) {
			this.player.down = true;
			if (this.player.onfloor) {
				if (this.startSpindash > 20) {
					if (this.spindashFrame > 8) {
						this.player.jump = true;
						this.spindashFrame = 0;
					} else {
						if (this.spindashFrame > 5) {
							this.player.jump = false;
						}
					}
					this.spindashFrame += 1;
					this.startSpindash += 1;
					if (this.startSpindash > 100) {
						this.player.down = false;
						this.player.jump = false;
						this.state = "follow";
						this.startSpindash = 0;
						this.followFrame = 0;
						this.stuckFrames = 0;
					}
				} else {
					this.startSpindash += 1;
				}
			}
			
		} else {
			
		}
	}
	respawnState () {
		if (this.player.onfloor) {
			this.player.flying = false;
			this.state = "follow";
		}
	}
	frame () {
		if (this.player && this.target) {
			if (this.state == "follow") {
				this.followingState();
			}
			if (this.state == "spindash") {
				this.spindashState();
			}
			if (this.state == "respawn") {
				this.respawnState();
			}
		}
	}
}