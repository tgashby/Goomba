var Game = {w: 800, h: 600}

var images = {
	player: "img/player.png"
};

Goomba.load(images, function () {
	startGame();
});

function startGame() {
	Goomba.init(Game.w, Game.h);

	// Player
	Goomba.newEntity("Image, Collidable, Gravity")
		.setImg(Goomba.assets.player)
		.addAttrs({x: Game.w / 2, y: Game.h - 30, xVel: 0, yVel: 0})
		.controls({
			A: function () { this.xVel -= 1; },
			S: function () { this.xVel += 1; },
			SPACE: function () { this.yVel -= 7; }
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
}