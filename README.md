# Goomba Engine for Javascript and Canvas

Because I can't find a Javascript documentation tool I like, I'm going to make this a giant, all-purpose README.

My apologies in advance.

Contents:

* [Basic Info](#basicinfo)
* [Hello World](#helloworld)
* [Functions](#funcs)
    * [Goomba](#goomba)
        * [Entities](#entityfuncs)
            * [addAttrs](#addAttrs)
            * [addComponent](#addComponent)
            * [bindEvent](#bindEvent)
            * [controls](#controls)
            * [hasComponent](#hasComponent)
            * [mouseControls](#mouseControls)
            * [onUpdate](#onUpdate)
            * [removeComponent](#removeComponent)
            * [requiresComponent](#requiresComponent)
            * [triggerEvent](#triggerEvent)
        * [Global](#globalfuncs)
            * [background](#background)
            * [bindEvent](bindEventglobal)
            * [draw](#draw)
            * [extend](#extend)
            * [forEach](#forEach)
            * [init](#init)
            * [isComponent](#isComponent)
            * [load](#load)
            * [newComponent](#newComponent)
            * [newEntity](#newEntity)
            * [splitSprite](#splitSprite)
            * [state](#state)
            * [triggerEvent](#triggerEventglobal)
* [Components](#components)
    * [Animation](#animation)
    * [Collidable](#collidable)
    * [Color](#color)
    * [Gravity](#gravity)
    * [Image](#image)
    * [Interactive](#interactive)
    * [Scoreboard](#scoreboard)
    * [Text](#text)
* [Helpful Topics](#helpfultopics)
    * [Creating new drawable components](#creatingdrawablecomponents)
* [Reference](#reference)
    * [Audio](#audio)
    * [Canvas](#canvas)
    * [Events](#events)
    * [Keyboard](#keyboard)
    * [Mouse](#mouse)
    * [Timer](#timer)
    * [Viewport](#viewport)

## <a id="basicinfo"></a>Basic info
This is an engine meant for games, but could plausibly be used for other multimedia applications.

It is entity and compontent based, so throw your OOP desires out the window.

This engine runs solely on Canvas, no DOM support.

To check for canvas compatability, read the table [here](http://caniuse.com/#feat=canvas).

## <a id="helloworld"></a>"Hello World" -> Pong
The simplest game I can think of is Pong. Just two rectangles with a bouncing ball.

Here's how you make Pong with Goomba:

```javascript
// Initialize the canvas with a given width and height.
// Goomba does the Canvas creation for you, so no need to make a canvas 
// in your html document
Goomba.init(600, 300);
 
// Create a new entity with the component "Paddle", this will be 
// important for checking collisions later
Goomba.newEntity("Paddle, Color")
    // Add attributes to the paddle, x, y, width, height, 
    // and an optional color
    .addAttrs({x: 10, y: 20, w: 15, h: 150, color: "#000000"})
    // Bind keys to actions
    .controls({
        W: function () { this.y -= 2 },
        S: function () { this.y += 2 }
    });

Goomba.newEntity("Paddle, Color")
    .addAttrs({x: 570, y: 20, w: 15, h: 150, color: "#FF0000"})
    .controls({
        UP_ARROW: function () { this.y -= 2 },
        DOWN_ARROW: function () { this.y += 2 } 
    });

// This is the ball, it uses a built-in component, Collidable, 
// which offers the onHit method
Goomba.newEntity("Collidable, Color")
    .addAttrs({x: 300, y: 150, w: 10, h: 10, velX: 4, velY: 4})
    // Goomba will do an update event 60 times per second
    // attaching an onUpdate to an entity will make sure
    // everything inside happens every frame
    .onUpdate(function () {
        // Hit ceiling or floor
        if (this.y + this.h > Game.height || this.y < 0) {
            this.velY = -this.velY;
        }

        // Reaches either side
        if (this.x < 0 || this.x > Game.width) {
            this.x = Game.width / 2;
            this.y = Game.height / 2;
        }

        this.x += this.velX;
        this.y += this.velY;
    })
    // Handles hits with the given component and runs the callback 
    // when a collision occurs
    .onHit("Paddle", function () {
        this.velX = -this.velX;
    });
```
That's it. Everything else is handled for you. No need to worry about game loops or rendering.<br />
<br />
## <a id="funcs"></a>Functions
### <a id="goomba"></a> Goomba
#### <a id="entityfuncs"></a>Entity Functions (entity.----)
##### <a id="addAttrs"></a>addAttrs
##### <a id="addComponent"></a>addComponent
##### <a id="bindEvent"></a>bindEvent
##### <a id="controls"></a>controls
##### <a id="hasComponent"></a>hasComponent
##### <a id="mouseControls"></a>mouseControls
##### <a id="onUpdate"></a>onUpdate
##### <a id="removeComponent"></a>removeComponent
##### <a id="requiresComponent"></a>requiresComponent
##### <a id="triggerEvent"></a>triggerEvent
####  <a id="globalfuncs"></a> Global Functions (Goomba.----)
##### <a id="background"></a>background
##### <a id="bindEvent"></a>bindEvent
##### <a id="draw"></a>draw
##### <a id="extend"></a>extend
##### <a id="forEach"></a>forEach
##### <a id="init"></a>init
##### <a id="isComponent"></a>isComponent
##### <a id="load"></a>load
##### <a id="newComponent"></a>newComponent
##### <a id="newEntity"></a>newEntity
##### <a id="splitSprite"></a>splitSprite
##### <a id="state"></a>state
##### <a id="triggerEvent"></a>triggerEvent
## <a id="components"></a>Built in Components
### <a id="animation"></a>Animation
### <a id="collidable"></a>Collidable
For any entity that will collide with something. <br />
<br />
Methods:<br />
onHit("Component", function () { ... }) - Runs callbacks when a collision with the given component occurs.<br />
(optional) setBounds(polygon) - set the bounds of the entity, the polygon must have attributes x, y, w, h<br />
<br />
Attributes required:<br />
x, y, w, h or x, y, img or setBounds called with a valid polygon<br />
### <a id="color"></a>Color
Used for entities that are colored rectangles.<br />
<br />
Methods:<br />
N/A<br />
<br />
Attributes required:<br />
x, y, w, h<br />
<br />
Attributes optional:<br />
color (default is '#8ED6FF')<br />
### <a id="gravity"></a>Gravity
### <a id="image"></a>Image
For any entity that will use an image instead of a solid rectangle.<br />
** This component is inherited by default **<br />
All images need to be loaded before the game is started using:
```javascript
Goomba.load({p1: "img/p1.png", p2: "img/p2.jpg", ....}, function () {
    startGame();
});
```
All images will then be stored as
```
Goomba.assets.imgName
```
<br />
Methods:<br />
setImg(Goomba.assets.myImage)<br />
<br />
Attributes required:<br />
x, y, img (handled with the call to setImg)<br />
### <a id="interactive"></a>Interactive
### <a id="scoreboard"></a>Scoreboard
For any entity that will act as a text scoreboard.<br />
<br />
Methods:<br />
N/A<br />
<br />
Attributes required:<br />
x, y, score (usually set to 0 initially), text (the prefix to the scoreboard, ex: "Left Player Points: ")<br />
<br />
Attributes optional:<br />
font (default to "normal 12px Verdana")<br />
### <a id="text"></a>Text
## <a id="helpfultopics"></a>Helpful Topics
### <a id="creatingdrawablecomponents"></a>Creating new drawable components
All that is required for making new components that draw is to provide a "draw" method that takes a canvas context.

Example:
```javascript
Goomba.newComponent("Circle", {
    init: function () {
        this.draw = function (context) {
            context.beginPath();
            context.arc(this.x, this.y, 50, 0, 2  Math.PI, false);
            context.fillStyle = "#8ED6FF";
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = "black";
            context.stroke();
        }
    }
})
```

If you make any new entities with the "Circle" component, they will draw as a circle at its x, y coordinate.<br />
### <a id="reference"></a>Reference
#### <a id="audio"></a>Audio
#### <a id="canvas"></a>Canvas
#### <a id="events"></a>Events
#### <a id="keyboard"></a>Keyboard
#### <a id="mouse"></a>Mouse
#### <a id="timer"></a>Timer
#### <a id="viewport"></a>Viewport

