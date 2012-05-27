var Game = {w: 800, h: 600}

var assets = {
	player: "img/player.png",
	sound: "sound/StopRightNow.ogg"
};

Goomba.load(assets, function () {
	startGame();

	// Start off in the menu!
	Goomba.state("menu");
});



function startGame() {
	Goomba.init(Game.w, Game.h);

	Goomba.splitSprite(Goomba.assets.player, 64, 128, {
		idle: {start: 0, end: 3, fps: 5},
		walk: {start: 5, end: 18, fps: 15},
		cry: {start: 20, end: 24, fps: 10}
	});

	Goomba.state("game", function () {
		// Player
		Goomba.newEntity("Animation, Collidable, Gravity")
			.setImg(Goomba.assets.player)
			.setAnimation("idle")
			.addAttrs({x: Game.w / 2, y: 0, xVel: 0, yVel: 0})
			.controls({
				A: function () { this.xVel -= 1; },
				S: function () { this.xVel += 1; },
				SPACE: function () { this.yVel -= 7; },
				Q: function () { this.setAnimation("walk"); },
				W: function () { this.setAnimation("cry"); },
				Z: function () { Goomba.assets.sound.play(); }
			})
			.onUpdate(function () {
				// Player-y stuff, jumping, etc
			})
			.onHit("Platform", function () {
				// Collision stuff	
			});

		// Platforms
		// Goomba.newEntity("Image, Platform")
		// 	.addAttrs({});
	});

	Goomba.state("menu", function () {
		Goomba.newEntity("Color")
			.addAttrs({x: 0, y: 0, w: Game.w, h: Game.h})
			.mouseControls({
				LEFT: function () { 
					Goomba.state("game");
					console.log("Game time!");
				}
			});
	});
}