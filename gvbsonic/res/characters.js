async function initCharData() {
	window.gvbsonicCharacters = [
		//sonic 3 sonic
		{
			name:"Sonic",
			fullname:"Sonic",
			scale:1,
			angle:45,
			smoothAngles:true,
			image:window.files.sonic,
			spritesheet:window.files.sonicspritesheet.sprites,
			animations:window.files.sonic3anims,
			signpostid:"sonic",
			abilites: [
				"spindash",
				"peelout",
				"roll"
			]
		},
		//sonic 3 tails (I think)
		{
			name:"Tails",
			fullname:"Tails",
			scale:1,
			angle:45,
			smoothAngles:true,
			image:window.files.tailss3,
			spritesheet:window.files.tailsS3Spritesheet.sprites,
			animations:window.files.tailsS3anims,
			signpostid:"sonic",
			abilites: [
				"spindash",
				"peelout",
				"roll",
				"flight"
			]
		},
		//sonic mania sonic
		{
			name:"Sonic",
			fullname:"Mania Sonic",
			scale:0.5,
			angle:1,
			smoothAngles:true,
			image:window.files.maniaSonic,
			spritesheet:window.files.maniaSonicSpritehseet.sprites,
			animations:window.files.maniaSonicAnimations,
			signpostid:"sonic",
			abilites: [
				"spindash",
				"peelout",
				"roll"
			]
		},
		//Super sonic
		{
			name:"Super sonic",
			fullname:"Super Sonic",
			scale:1,
			angle:45,
			smoothAngles:true,
			image:window.files.superSonic,
			spritesheet:window.files.superSonicSpriteSheet.sprites,
			animations:window.files.superSonicAnimations,
			signpostid:"sonic",
			abilites: [
				"spindash",
				"peelout",
				"roll"
			]
		}
		
	];
	
	window.gvbsonicNPCCharacter = 1; //default NPC character selected, Sonic 3 Tails.
	window.gvbsonicSelectedChar = 2; //default character selected, Mania Sonic.
}