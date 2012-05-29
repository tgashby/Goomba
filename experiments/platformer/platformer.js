var Game = {w: 800, h: 600}

var assets = {
	player: "img/player.png",
	platform: "img/platform.png",
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

	Goomba.splitSprite(Goomba.assets.platform, 233, 90, {
		idle: {start: 0, end: 3, fps: 3}
	});

	Goomba.state("game", function () {
		// Player
		Goomba.newEntity("Animation, Collidable, Gravity")
			.setImg(Goomba.assets.player)
			.setAnimation("idle")
			.addAttrs({x: Game.w / 2, y: Game.h - 128, xVel: 0, yVel: 0, jumping: false})
			.controls({
				A: function () { 
					this.xVel -= 1;
					this.flip = true;
				},
				S: function () { 
					this.xVel += 1;
					this.flip = false;
				},
				SPACE: function () {
					if (!this.jumping) {
						this.yVel -= 15;
						this.jumping = true;
						console.log(this.yVel);
					}
				},
				Q: function () { this.setAnimation("walk"); },
				W: function () { this.setAnimation("cry"); },
				Z: function () { Goomba.assets.sound.play(); }
			})
			.onUpdate(function () {
				// Player-y stuff, jumping, etc
				var X_MAX = 5;
				var gravity = 0.9;

				if (this.xVel > X_MAX) {
					this.xVel = X_MAX;
				};

				if (this.xVel < -X_MAX) {
					this.xVel = -X_MAX;
				};

				if (this.xVel !== 0) {
					this.xVel += (this.xVel < 0) ? 0.2 : -0.2;

					this.setAnimation("walk");

					if (this.xVel < 0.2 && this.xVel > -0.2) {
						this.xVel = 0;

						this.setAnimation("idle");
					};
				};

				if (this.y < 0) {
					this.y = 0;
				};

				if (this.y > Game.h - 128) {
					this.y = Game.h - 128;
					this.jumping = false;
				};

				if (this.jumping) {
					this.yVel += gravity;
				};

				this.x += this.xVel;
				this.y += this.yVel;
			})
			.onHit("Platform", function (collisions) {
				// Collision stuff

				if (this.y > collisions[0].y) {
					this.y = collisions[0].y + collisions[0].h;
				}

				this.yVel = 0;
				this.jumping = false;
			});

		// Platforms
		Goomba.newEntity("Animation, Platform")
			.setImg(Goomba.assets.platform)
			.setAnimation("idle")
			.addAttrs({x: Game.w / 2, y: 300});
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