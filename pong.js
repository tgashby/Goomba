// Example Pong Game
var Game = {width: 600, height: 300};

Goomba.init(Game.width, Game.height);

var lftScore = Goomba.Entity("Scoreboard")
                    .attr({x: 10, y: 10, score: 0})
                    .bind("Update", function () {
                        Goomba.drawText(this.x, this.y, "Left Score: " + this.score);
                    });

var rtScore = Goomba.Entity("Scoreboard")
                    .attr({x: 580, y: 10, score: 0})
                    .bind("Update", function () {
                        Goomba.drawText(this.x, this.y, "Right Score: " + this.score);
                    });

var lftPaddle = Goomba.Entity("Paddle")
                    .attr({x: 10, y: 20, w: 30, h: 100})
                    .control(Goomba.W, function () { this.y -= 10; })
                    .control(Goomba.S, function () { this.y += 10; });

var rtPaddle = Goomba.Entity("Paddle")
                    .attr({x: 590, y: 20, w: 30, h: 100})
                    .control(Goomba.UP_ARROW, function () { this.y -= 10; })
                    .control(Goomba.DOWN_ARROW, function () { this.y += 10; });

var ball = Goomba.Entity()
                    .attr({x: 300, y: 150, w: 10, h: 10, velX: 4, velY: 4})
                    .bind("Update", function () {
                        if (this.y + this.h > Game.height || this.y < 0) {
                            this.velY = -this.velY;
                        }

                        if (this.x < 0) {
                            rtScore.score++;
                        }

                        if (this.x > Game.width) {
                            lftScore.score++;
                        }
                    })
                    .onHit("Paddle", function () {
                        this.velX = -this.velX;
                    });