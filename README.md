# Goomba Engine for Javascript and Canvas

Because I can't find a Javascript documentation tool I like, I'm going to make this a giant, all-purpose README.

*WARNING: Goomba has only been tested using Chrome. A recent run on Firefox didn't work at all...*

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
    * [Creating new components](#creating-new-components)
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
ent.hasComponent(comp);
```
Parameters:<br />
<pre>
    comp - String, component name
</pre>
Return:<br />
<pre>
    True if the entity has the given component.
</pre>

##### mouseControls
Signature:<br />
```javascript
ent.mouseControls(bindings);
```
Parameters:<br />
<pre>
    bindings - An object containing all the bindings to add to the entity.
        Bindings take the form of:
            { BUTTON: function () {...} }
</pre>
Return:<br />
<pre>
    The entity.
</pre>

For a list of key names, look at the [Mouse](#mouse) reference.
##### onUpdate
Signature:<br />
```javascript
ent.onUpdate(callback);
```
Parameters:<br />
<pre>
    callback - A function to call every update cycle, 60 frames per second.
</pre>
Return:<br />
<pre>
    The entity.
</pre>

This is merely syntactic sugar for [bindEvent](#bindevent) using "Update".
##### removeComponent
Signature:<br />
```javascript
ent.removeComponent(comp)
```
Parameters:<br />
<pre>
    comp - String, component name
</pre>
Return:<br />
<pre>
    The entity.
</pre>

Removes the given component from the entity.
##### requiresComponent
Signature:<br />
```javascript
myComp.requiresComponent(comp)
```
Parameters:<br />
<pre>
    comp - String, component name
</pre>
Return:<br />
<pre>
    The entity.
</pre>

Really not very useful except in the creation of components. See [Creating new components](#creating-new-components).
##### triggerEvent
Signature:<br />
```javascript
ent.triggerEvent(event)
```
Parameters:<br />
<pre>
    event - String, event name
</pre>
Return:<br />
<pre>
    The entity.
</pre>

Triggers the given event inside *this entity only*. To trigger a global event, use Goomba.[triggerEvent(event)](#triggerevent-1);
####  Global Functions (Goomba.----)
All of these functions use Goomba's global namespace.<br />

##### background
Signature:<br />
```javascript
Goomba.background(bg)
```
Parameters:<br />
<pre>
    bg - Any string containing valid html tags for element backgrounds.
        This includes things like: "url('images/bg.png') no-repeat" OR "rgb(127, 100, 125)"
</pre>
Return:<br />
<pre>
    Undefined.
</pre>

Changes the background of the canvas element.
##### bindEvent
Signature:<br />
```javascript
Goomba.bindEvent(event, callback)
```
Parameters:<br />
<pre>
    event - String, event name.
    callback - A function to call whenever the event is triggered.
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>

Identical to ent.[bindEvent(event, callback)](#bindevent), just in the global space.
##### extend
Signature:<br />
```javascript
Goomba.extend(obj)
```
Parameters:<br />
<pre>
    obj - An object to smoosh into Goomba's space.
        All attributes and their keys are copied into Goomba's internal structure.
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>

Not sure why you'd need this, but it's there if you want it.
##### forEach
Signature:<br />
```javascript
Goomba.forEach(callback)
```
Parameters:<br />
<pre>
    callback - Function to call on each entity.
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>

Runs the callback on every existing entity.
##### init
Signature:<br />
```javascript
Goomba.init(width, height)
```
Parameters:<br />
<pre>
    width - Number, width in pixels of the canvas element to create.
    height - Number, height in pixels of the canvas element.
</pre>
Return:<br />
<pre>
    Undefined.
</pre>

This functions *must* be called before using any of Goomba's draw functionality (which really means any time after loading images).
##### isComponent
Signature:<br />
```javascript
Goomba.isComponent(comp)
```
Parameters:<br />
<pre>
    comp - String, component name.
</pre>
Return:<br />
<pre>
    True if the component has been created already.
</pre>

Use this to check for the existance of components.
##### load
Signature:<br />
```javascript
Goomba.load(assets, callback)
```
Parameters:<br />
<pre>
    assets - An object with keys as names and values as paths to images or sounds.
        Example:
            Goomba.load({
                player: "images/player.png",
                bulletSound: "sounds/bullet.wav"
            });
    callback - Function to run when all assets have successfully loaded.
</pre>
Return:<br />
<pre>
    Undefined.
</pre>

Use this function before anything else to make sure your assets are pre-loaded.
##### newComponent
Signature:<br />
```javascript
Goomba.newComponent(name, attrs)
```
Parameters:<br />
<pre>
    name - String, component name.
    attrs - Object containing all attributes and functions of the component.
</pre>
Return:<br />
<pre>
    Undefined.
</pre>

Use this function to create new components that you can re-use later.
##### newEntity
Signature:<br />
```javascript
Goomba.newEntity(comps);
```
Parameters:<br />
<pre>
    comps - Comma seperated list of components for this entity to have.
</pre>
Return:<br />
<pre>
    The entity.
</pre>

Use this function to create new entities.
##### removeEntity
Signature:<br />
```javascript
Goomba.removeEntity(id)
```
Parameters:<br />
<pre>
    id - The ID number of an entity. 
        Every entity has one accessible with: ent.id
        Goomba.removeEntity(myEnt.id)
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>

Removes the entity and all it's bound events from Goomba.
##### splitSprite
Signature:<br />
```javascript
Goomba.splitSprite(sprite, spriteW, spriteH, frames)
```
Parameters:<br />
<pre>
    sprite - The Gooma asset you want to split.
        Goomba.assets.----
    spriteW - The width of each sprite in pixels.
    frames - An object containing keys as names and objects as values.
        Example 'frames' object:
            var frames = {
                idle: {start: 0, end: 3, fps: 5},
                walk: {start: 5, end: 18, fps: 15}
            };
                start - frame index to start the animation
                end - frame index to end the animation
                fps - how fast the animation should play
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>

Use this function to split up spritesheets into animations.
##### state
Signature:<br />
```javascript
Goomba.state(name)
// OR
Goomba.state(name, callback)
```
Parameters:<br />
<pre>
    name - String, name of the state.
    ("optional") callback - Function to call when state is switched to.
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>

Goomba.state() is two functions in one.<br />
If used with just the name parameter, it signals Goomba to switch to the given state.<br />
If used with both parameters, it simply stores that state for later use.
##### triggerEvent
Signature:<br />
```javascript
Goomba.triggerEvent(event, data);
```
Parameters:<br />
<pre>
    event - String, name of event to trigger.
    (optional) data - Any data you want to pass to the event.
</pre>
Return:<br />
<pre>
    The global Goomba entity.
</pre>


## Built in Components

### Animation
For any entity that will use animations. <br />
<br />
Methods:<br />
<pre>
    setImg(image) - Sets the animation's spritesheet to the Goomba.asset.---- given.
    setAnimation(animation) - String parameter. Sets the currently running animation to the one given.
    resetAnimation(animation) - String parameter. Resets the given animation to frame 0 and time 0
</pre>
Attributes required:<br />
x, y<br />

Function calls required:<br />
[splitSprite](#splitsprite), setImg

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
For any entity that will should be falling downward and stopped on another entity.<br />
Methods:<br />
<pre>
gravitateTo(comp) - Makes the entity stop falling any time they contact the given component.
setGravityConst(newConst) - Sets the force of gravity to a new constant. (Default is 0.5)

</pre>
Attributes required:<br />
x, y, w, h<br />

Functions Required:<br />
gravitateTo (otherwise it's kinda useless)
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
For any entity that will do something when collided with. In all honesty, it's basically syntactic sugar for Collidable. I wanted it to be more, but can't figure out what to add.<br />
Methods:<br />
<pre>
onInteract(comp, callback) - This is actually just a wrapper for [onHit](#onhit)...
</pre>
Attributes required:
See [Collidable](#collidable)
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
For any entity that will be purely text.<br />
<br />
Methods:<br />
N/A
<br />
Attributes required:
x, y, text, (optional) font
## Helpful Topics

### Creating new components
Making new components is simple, just call Goomba.[newComponent(comp, attrs)](#newcomponent) and you have a new component!<br />
<br />
Some built-in functionality you should know about:<br />
Any component that has a function called "init" will have that function called whenever it is used in a new entity.<br />
Often I've used this.[requiresComponent(comp)](#requirescomponent) in an init to inherit some behavior from another component.<br />
<br />
### Creating new drawable components
All that is required for making new components that draw is to provide a "draw" method that takes a canvas context.
<br />
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
<br />
If you make any new entities with the "Circle" component, they will draw as a circle at its x, y coordinate.<br />
### Reference
#### Audio
Audio in Goomba is really just javascript Audio objects in disguise.<br />
<br />
If you know about Audio objects, all functions are available to you by accessing any sound after loading it by just using: Goomba.assets.mySound<br />
For example:<br />
Goomba.assets.mySound.play() will, no surprise here, play the sound!<br />
<br />
#### Canvas
You are not required to make your own canvas element when using Goomba. A call to init will make a canvas element for you.<br />
<br />
If you decide you desperately need access to the canvas, it's accessible through Gooma.canvas<br />
The HTML canvas element is accessible through Goomba.canvas.elem<br />
#### Events
The events already built into Goomba are:<br />
Update, KeyUp, KeyDown, MouseDown, MouseUp, MouseMove<br />
<br />
Update is triggered 60 times a second.<br />
KeyUp occurs whenever a keyboard key is released. KeyDown whenever a keyboard key is pressed.<br />
MouseUp/MouseDown are obvious. MouseMove is triggered whenever the mouse moves, which is a lot. But it keeps track of mouse position and entities covered by the mouse, so it's very useful. *However*, if you have a complex game with lots of entities and no mouse interaction, you should *definitely* go into the Goomba source and disable the MouseMove trigger at the bottom of the first giant function. (Currently line 834, but subject to change)<br />

You can, of course, always make your own events!
#### Keyboard
Here is the list of keyboard key names:<br />
BACKSPACE, TAB, ENTER, SHIFT, CTRL, ALT, PAUSE, CAPS, ESC, SPACE, PAGE\_UP, PAGE\_DOWN, END, HOME, LEFT\_ARROW, UP\_ARROW, RIGHT\_ARROW, DOWN\_ARROW, INSERT, DELETE, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, LEFT\_WIN\_KEY, RIGHT\_WIN\_KEY, SELECT, NUMPAD\_0, NUMPAD\_1, NUMPAD\_2, NUMPAD\_3, NUMPAD\_4, NUMPAD\_5, NUMPAD\_6, NUMPAD\_7, NUMPAD\_8, NUMPAD\_9, MULTIPLY, ADD, SUBSTRACT, DECIMAL, DIVIDE, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, NUM\_LOCK, SCROLL\_LOCK, SEMI\_COLON, EQUALS, COMMA, MINUS, PERIOD, FWD\_SLASH, GRAVE, OPEN\_BRACKET, BCK\_SLASH, CLOSE\_BRACKET, QUTOTE<br />
That was fun.
#### Mouse
Here are the button name:<br />
LEFT, RIGHT, MIDDLE<br />
<br />
There's a position with x and y available: Goomba.mouse.position<br />
<br />
There's also an array containing all the entities that the mouse is currently over: Goomba.mouse.onEntities<br />
#### Timer
The timer keeps track of the game and when to call update and draw.<br />
You shouldn't touch it.<br />
#### Viewport
Changing the viewport will shift the "camera". This is how side-scrolling works currently.<br />
I would like to make it more intuitive and add in some function calls, but for the time being you simply access it directy with Goomba.viewport.x and Goomba.viewport.y<br />
