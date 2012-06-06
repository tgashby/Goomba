# Goomba Engine for Javascript and Canvas

Because I can't find a Javascript documentation tool I like, I'm going to make this a giant, all-purpose README.

My apologies in advance.

Contents:

* [Basic Info](#basic-info)
* [Hello World](#hello-world---pong)
* [Functions](#functions)
    * [Goomba](#-goomba)
        * [Entities](#entity-functions-entity----)
            * [addAttrs](#addattrs)
            * [addComponent](#addcomponent)
            * [bindEvent](#bindevent)
            * [controls](#controls)
            * [hasComponent](#hascomponent)
            * [mouseControls](#mousecontrols)
            * [onUpdate](#onupdate)
            * [removeComponent](#removecomponent)
            * [requiresComponent](#requirescomponent)
            * [triggerEvent](#triggerevent)
        * [Global](#-global-functions-goomba----)
            * [background](#background)
            * [bindEvent](bindevent-1)
            * [draw](#draw)
            * [extend](#extend)
            * [forEach](#foreach)
            * [init](#init)
            * [isComponent](#iscomponent)
            * [load](#load)
            * [newComponent](#newcomponent)
            * [newEntity](#newentity)
            * [splitSprite](#splitsprite)
            * [state](#state)
            * [triggerEvent](#triggerevent-1)
* [Components](#built-in-components)
    * [Animation](#animation)
    * [Collidable](#collidable)
    * [Color](#color)
    * [Gravity](#gravity)
    * [Image](#image)
    * [Interactive](#interactive)
    * [Scoreboard](#scoreboard)
    * [Text](#text)
* [Helpful Topics](#helpful-topics)
    * [Creating new drawable components](#creating-new-drawable-components)
* [Reference](#reference)
    * [Audio](#audio)
    * [Canvas](#canvas)
    * [Events](#events)
    * [Keyboard](#keyboard)
    * [Mouse](#mouse)
    * [Timer](#timer)
    * [Viewport](#viewport)

## Basic info
This is an engine meant for games, but could plausibly be used for other multimedia applications.

It is entity and compontent based, so throw your OOP desires out the window.

This engine runs solely on Canvas, no DOM support.

To check for canvas compatability, read the table [here](http://caniuse.com/#feat=canvas).

## "Hello World" -> Pong
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
## Functions
### Goomba
Signature: 
```javascript
Goomba(selector);
```

Parameters:
    selector - String or Number.
        When used with a string, returns all entities that have the series of components specified.
        When used with a number, returns the one component with that id.

Return:
    Array of entities. Always. Even if used with an id.

Examples:
```javascript
Goomba("Hello"); // Returns all entities with the "Hello" component
Goomba("Hello World"); // All entities with "Hello" AND "World" components
Goomba("Hello, World"); // All entities with "Hello" OR "World" components
```
#### Entity Functions (entity.----)

##### addAttrs
Signature:

Parameters:

##### addComponent
Signature:

Parameters:

##### bindEvent
Signature:

Parameters:

##### controls
Signature:

Parameters:

##### hasComponent
Signature:

Parameters:

##### mouseControls
Signature:

Parameters:

##### onUpdate
Signature:

Parameters:

##### removeComponent
Signature:

Parameters:

##### requiresComponent
Signature:

Parameters:

##### triggerEvent
Signature:

Parameters:

####  Global Functions (Goomba.----)

##### background
Signature:

Parameters:

##### bindEvent
Signature:

Parameters:

##### draw
Signature:

Parameters:

##### extend
Signature:

Parameters:

##### forEach
Signature:

Parameters:

##### init
Signature:

Parameters:

##### isComponent
Signature:

Parameters:

##### load
Signature:

Parameters:

##### newComponent
Signature:

Parameters:

##### newEntity
Signature:

Parameters:

##### splitSprite
Signature:

Parameters:

##### state
Signature:

Parameters:

##### triggerEvent
Signature:

Parameters:

## Built in Components

### Animation

Methods:

Attributes required:


### Collidable
For any entity that will collide with something. <br />
<br />
Methods:<br />
onHit("Component", function () { ... }) - Runs callbacks when a collision with the given component occurs.<br />
(optional) setBounds(polygon) - set the bounds of the entity, the polygon must have attributes x, y, w, h<br />
<br />
Attributes required:<br />
x, y, w, h or x, y, img or setBounds called with a valid polygon<br />
### Color
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
### Gravity

Methods:

Attributes required:

### Image
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
### Interactive

Methods:

Attributes required:

### Scoreboard
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
### Text

Methods:

Attributes required:

## Helpful Topics
### Creating new drawable components
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
### Reference
#### Audio

#### Canvas

#### Events

#### Keyboard

#### Mouse

#### Timer

#### Viewport

