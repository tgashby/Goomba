var Game = {w: 800, h: 600}

var assets = {
    player: "img/player.png",
    platform: "img/platform.png",
    goal: "img/goal.png",
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
        Goomba.newEntity("Player, Animation, Collidable, Gravity")
            .setImg(Goomba.assets.player)
            .setAnimation("idle")
            .addAttrs({x: Game.w / 2, y: Game.h - 128, xVel: 0})
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
                    if (!this.falling) {
                        this.yVel -= 17;
                    };
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

                this.x += this.xVel;

                if (this.x < 0) {
                    this.x = 0;
                };

                if (this.x > Game.w) {
                    this.x = Game.w;
                };

                Goomba.viewport.x = this.x - Game.w / 2;
            })
            .gravitateTo("Platform");

        // Platforms
        Goomba.newEntity("Animation, Platform")
            .setImg(Goomba.assets.platform)
            .setAnimation("idle")
            .addAttrs({x: Game.w / 2 + 30, y: 350});

        Goomba.newEntity("Animation, Platform")
            .setImg(Goomba.assets.platform)
            .setAnimation("idle")
            .addAttrs({x: 30, y: 350});

        // Floor "hack"
        Goomba.newEntity("Platform, Color")
            .addAttrs({x: -50, y: Game.h, w: Game.w + 50, h: 1});


        // Goal
        Goomba.newEntity("Interactive")
            .setImg(Goomba.assets.goal)
            .addAttrs({x: Game.w / 2, y: 0})
            .onInteract("Player", function () {
                Goomba.state("end");
            });
    });

    Goomba.state("menu", function () {
        Goomba.newEntity("Color")
            .addAttrs({x: 0, y: 0, w: Game.w, h: Game.h, color: "#FFFFFF"})
            .mouseControls({
                LEFT: function () { 
                    Goomba.state("game");
                }
            });

        Goomba.newEntity("Text")
            .addAttrs({x: Game.w / 2 - 50, y: Game.h / 2, text: "Menu! Click to play!"});
    });

    Goomba.state("end", function () {
        Goomba.newEntity("Color")
            .addAttrs({x: 0, y: 0, w: Game.w, h: Game.h, color: "#FFFFFF"})
            .mouseControls({
                LEFT: function () { 
                    Goomba.state("game");
                }
            });

        Goomba.newEntity("Text")
            .addAttrs({x: Game.w / 2 - 70, y: Game.h / 2, text: "You Win! (Click me to play again)"});
    })
}