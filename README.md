# Goomba Engine for Javascript and Canvas

Because I can't find a Javascript documentation tool I like, I'm going to make this a giant, all-purpose README.

My apologies in advance.

Contents:

* [Basic Info](#basic-info)
* [Hello World](#hello-world---pong)
* [Functions](#functions)
    * [Goomba](#goomba)
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
            * [removeEntity](#removeentity)
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
Parameters:<br />
<pre>
    selector - String or Number.
        When used with a string, returns all entities that have the series of components specified.
        When used with a number, returns the one component with that id.
</pre>

Return:<br />
<pre>
    Array of entities. Always. Even if used with an id.
</pre>

Examples:
```javascript
Goomba("Hello"); // Returns all entities with the "Hello" component
Goomba("Hello World"); // All entities with "Hello" AND "World" components
Goomba("Hello, World"); // All entities with "Hello" OR "World" components
```

It is also possible to just store entities into variables upon creation, see [newEntity](#newentity).
#### Entity Functions (entity.----)
Goomba entities can be used in two ways.<br />
```javascript
// First you need to create your entity
// Either make a new entity and set it into a variable
var myFavEnt = Goomba.newEntity("comp1, comp2");
// OR, don't.
Goomba.newEntity("comp1, comp2");

// Both will create an entity for Goomba's internal use.
// If you have a variable, you can refer to the entity by that variable when calling functions
myFavEnt.entityFunc(...);

//Otherwise, you can get the entity from Goomba.
Goomba("comp1 comp2")[0].entityFunc(...);
// The trouble with this method is that if you have more than one entity with those
// components, you're not guarenteed the order you'll get them back in order.
```

An important thing to know when dealing with entities is that it's common to chain function calls together. In most, if not all, of the examples, that's how I'm creating entities.
```javascript
Goomba.newEntity("hello, world").addAttrs({...}).setImg(Goomba.assets.blah); // And lots more can be chained
```
These chains can go on for as long as you have methods left you want to call.
##### addAttrs
Signature:<br />
```javascript
ent.addAttrs(obj);
```
Parameters:<br />
<pre>
    obj - An object containing all the attributes to add to the entity.
        All attributes will go directly into the entity with their corresponding keys.
</pre>
Return:<br />
<pre>
    The entity.
</pre>

This method adds attributes to a given entity. Most often called when initializing an entity.
##### addComponent
Signature:<br />
```javascript
ent.addComponent(comp);
```
Parameters:<br />
<pre>
    comp - A string, the component's name to add.
</pre>
Return:<br />
<pre>
    The entity.
</pre>

This method adds an existing (built-in or custom) to an entity.
##### bindEvent
Signature:<br />
```javascript
ent.bindEvent(event, callback);
```
Parameters:<br />
<pre>
    event - A string with the name of the event.
        If the event doesn't yet exist, it will add it, otherwise it will simply tack on another callback.
    callback - A function to call when the event is triggered
</pre>
Return:<br />
<pre>
    The entity.
</pre>

Example:
```javascript
// Write "Hello" to the console every update cycle
ent.bindEvent("Update", function () { 
    console.log("Hello!"); 
});
```
You can learn more about events, look at the [Events](#events) reference section.

##### controls
Signature:<br />
```javascript
ent.controls(bindings);
```
Parameters:<br />
<pre>
    bindings - An object containing all the bindings to add to the entity.
        Bindings take the form of:
            { KEY: function () {...} }
</pre>
Return:<br />
<pre>
    The entity.
</pre>

For a list of key names, look at the [Keyboard](#keyboard) reference.
##### hasComponent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### mouseControls
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### onUpdate
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### removeComponent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### requiresComponent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### triggerEvent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

####  Global Functions (Goomba.----)

##### background
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### bindEvent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### draw
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### extend
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### forEach
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### init
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### isComponent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### load
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### newComponent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### newEntity
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### removeEntity
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### splitSprite
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### state
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

##### triggerEvent
Signature:<br />
```javascript

```
Parameters:<br />
<pre>
    
</pre>
Return:<br />
<pre>
    The entity.
</pre>

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

