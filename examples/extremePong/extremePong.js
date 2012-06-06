// Example Pong Game
var Game = {
    width: 600,
    height: 300,
    leftBound: 0,
    rightBound: 1200
};

var assets = {
    extreme: "extreme.png"
};

Goomba.load(assets, function () {
    startGame();

    // Start off in the menu!
    Goomba.state("menu");
});

function startGame () {
    Goomba.init(Game.width, Game.height);

    Goomba.state("game", function () {
        Goomba.newEntity("")
            .addAttrs({x: 0, y: -150})
            .setImg(Goomba.assets.extreme);

        Goomba.newEntity("Paddle, Color")
            .addAttrs({ x: 10, y: 50, w: 5, h: 150, color: "#000000" })
            .controls({
                W: function() { this.y -= 2; },
                S: function() { this.y += 2; }
            });

        Goomba.newEntity("Paddle, Color")
            .addAttrs({ x: 1170, y: 50, w: 5, h: 150, color: "#FF0000" })
            .controls({ 
                UP_ARROW: function() { this.y -= 2; },
                DOWN_ARROW: function() { this.y += 2; }
            });

        Goomba.newEntity("Ball, Collidable, Color")
            .addAttrs({ x: 300, y: 150, w: 15, h: 15, velX: 4, velY: 4, color: "#FF6600" })
            .onUpdate(function() {
                // Hit ceiling or floor
                if (this.y + this.h > Game.height || this.y < 0) {
                    this.velY = -this.velY;
                }

                // Reaches either side
                if (this.x < Game.leftBound) {
                    this.x = Game.rightBound / 2;
                    this.y = Game.height / 2;
                    this.velX = 4;
                    this.velY = 4;
                    Goomba.triggerEvent("RightScore");
                }

                if (this.x > Game.rightBound) {
                    this.x = Game.rightBound / 2;
                    this.y = Game.height / 2;
                    this.velX = 4;
                    this.velY = 4;
                    Goomba.triggerEvent("LeftScore");
                }

                this.x += this.velX;
                this.y += this.velY;

                Goomba.viewport.x = this.x - Game.width / 2;

                if (Goomba.viewport.x < 0) {
                    Goomba.viewport.x = 0;
                };

                if (Goomba.viewport.x > Game.rightBound - Game.width) {
                    Goomba.viewport.x = Game.rightBound - Game.width;
                };
            }).onHit("Paddle", function(collisions) {
                this.velX = -this.velX;

                this.velX += this.velX < 0 ? -0.4 : 0.4;
                this.velY += this.velY < 0 ? -0.4 : 0.4;

                this.x = this.x < Game.width / 2 ? 
                    collisions[0].x + collisions[0].w : collisions[0].x - this.w;

                spawnPoints();
            });

        Goomba.newEntity("Scoreboard").addAttrs({
            x: 0,
            y: 10,
            text: "Left Points: ",
            score: 0
        }).bindEvent("LeftScore", function() {
            this.score++;
        });

        Goomba.newEntity("Scoreboard").addAttrs({
            x: 1100,
            y: 10,
            text: "Right Points: ",
            score: 0
        }).bindEvent("RightScore", function() {
            this.score++;
        });
    });

    Goomba.state("menu", function () {
        Goomba.newEntity("Color")
                .addAttrs({x: 0, y: 0, w: Game.width, h: Game.height, color: "#FFFFFF"})
                .mouseControls({
                    LEFT: function () { 
                        Goomba.state("game");
                    }
                });

        Goomba.newEntity("Text")
            .addAttrs({x: Game.width / 2 - 50, y: Game.height / 2, text: "Extreme Pong!\n Click to play!"});
    });
}

function spawnPoints () {
    for (var i = 0; i < 5; i++) {
        var randX = Math.floor((Math.random() * (Game.rightBound - 60)) + 30);
        var randY = Math.floor(Math.random() * (Game.height - 10));
        Goomba.newEntity("Color, Collidable")
            .addAttrs({ x: randX, y: randY, w: 10, h: 10, color: "#FFFF00"})
            .onHit("Ball", function () {
                if (Goomba("Ball")[0].velX > 0) {
                    Goomba.triggerEvent("LeftScore");
                } else {
                    Goomba.triggerEvent("RightScore");
                }

                Goomba.removeEntity(this.id);
            })
    };
}