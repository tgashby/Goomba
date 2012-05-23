(function (window, undefined) {
    // Keep track of current ID for next entity
    var currEntID = 1;

    // All the objects/components/events registered
    var components = {}, entities = {}, events = {};

    // Game speed variables
    var fps = 60, currFrame = 1;
    var tick, loops = 0, milliPerFrame = 1000 / fps, nextTick = (new Date).getTime();


    var Goomba = function(selector) {
        return new Goomba.fn.init(selector);
    }

    Goomba.fn = Goomba.prototype = {
        init: function (selector) {
            // By component
            if (typeof selector === "string") {
                var len = 0, delimiter, and = false, or = false, e, currEnt, comps;

                if (selector === '*') {
                    for (e in entities) {
                        this[e] = entities[e];
                        len++;
                    }

                    this.length = len;
                    return this;
                };

                if (selector.indexOf(',') !== -1) {
                    or = true;
                    delimiter = /\s*,\s*/;
                } else if (selector.indexOf(' ') !== -1) {
                    and = true;
                    delimiter = /\s+/;
                }

                for (e in entities) {
                    if (!entities.hasOwnProperty(e))
                        continue;

                    currEnt = entities[e];

                    if (and || or) {
                        comps = selector.split(delimiter);
                        cLen = comps.length;
                        score = 0;

                        for (var i = 0; i < cLen; i++) {
                            if (currEnt.m_comps[comps[i]]) {
                                score++;
                            };

                            if (and && score = cLen || or && score > 0) {
                                this[len] = e;
                                len++;
                            };
                        };
                    } else if (currEnt.m_comps[selector]) {
                        this[len] = e;
                        len++;
                    }
                }

                if (len > 0 && !(and || or)) {
                    this.extend(comps[selector]);
                };

                if (comps && and) {
                    for (var i = 0; i < cLen; i++) {
                        this.extend(comps[comps[i]]);
                    };
                };

                this.length = len;

            } else { // By ID
                if (!selector) {
                    selector = 0;

                    if (!(selector in entities)) {
                        entities[selector] = this;
                    };
                };

                if (!(selector in entities)) {
                    this.length = 0;
                    return this;
                };

                this['id'] = selector;
                this.length = 1;

                if (!this.m_comps) {
                    this.m_comps = {};
                };

                if (!entities[selector]) {
                    entities[selector] = this;
                };

                return entities[selector];
            };

            return this;
        },

        addComponent: function (comp) {
            this.m_comps[comp] = true;

            this.extend(components[comp]);

            if (components[comp] && "init" in components[comp]) {
                components[comp].init.call(this);
            };

            return this;
        },

        removeComponenet: function (comp) {
            for (var p in components[comp]) {
                delete this[p];
            }

            delete this.m_comps[comp];

            return this;
        },

        requiresComponent: function (comp) {
            this.addComponent(comp);

            return this;
        },

        hasComponenet: function (comp) {
            return this.m_comps[comp];
        },

        addAttrs: function (attr) {
            this.extend(attr);

            return this;
        },

        bindEvent: function (event, cb) {
            this.forEach(function () {
                if (!events[event]) {
                    events[event] = {};
                }

                var ev = events[event];

                if (!ev[this.id]) {
                    ev[this.id] = [];
                };

                ev[this.id].push(cb);
            });

            return this;
        },

        triggerEvent: function (event, params) {
            this.forEach(function () {
                if (events[event] && events[event][this.id]) {
                    var cb = events[event][this.id];

                    for (var i = 0; i < cb.length; i++) {
                        cb[i].call(this, params);
                    };
                };
            });

            return this;
        },

        forEach: function (cb) {
            if (this.length === 1) {
                cb.call(this, 1);
            };

            for (var i = 0; i < this.length; i++) {
                if (!entities[this[i]]) {
                    continue;
                };

                cb.call(entities[this[i]], i);
            }

            return this;
        },

        // Some sugar
        onUpdate: function (cb) {
            this.bindEvent("Update", cb);

            return this;
        },

        controls: function(bindings) {
            var x = this;

            for (var key in bindings) {
                if (bindings.hasOwnProperty(key)) {
                    var f = (function(k) {
                        return function() {
                            if (Goomba.keyboard.state[Goomba.keyboard.keys[k]]) {
                                bindings[k].call(x);
                            }
                        };
                    })(key);
                    
                    this.bindEvent("Update", f);
                };
            }

            return this;
        }
    };

    Goomba.fn.init.prototype = Goomba.fn;

    Goomba.extend = Goomba.fn.extend = function (obj) {
        var key;

        if (!obj) {
            return this;
        };

        for (key in obj) {
            if (this === obj[key])
                continue;

            this[key] = obj[key]
        }

        return this;
    };

    Goomba.extend({
        timer: {
            prev: (Number(new Date)),
            current: (Number(new Date)),
            currTime: Date.now(),

            init: function () {
                var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

                if (animFrame) {
                    tick = function () {
                        Goomba.timer.step();
                        animFrame(tick);
                    }

                    tick();

                } else {
                    tick = setInterval(Goomba.timer.step, milliPerFrame);
                }
            },

            step: function () {
                loops = 0;
                this.currTime = Date.now();

                if (this.currTime - nextTick > 60 * milliPerFrame) {
                    nextTick = this.currTime - milliPerFrame;
                };

                while (this.currTime > nextTick) {
                    Goomba.triggerEvent("Update", {currFrame: currFrame++});
                    nextTick += milliPerFrame;
                    loops++;
                }

                if (loops) {
                    Goomba.draw();
                };
            }
        },

        draw: function () {
            var cvs = Goomba.canvas;
            var ctx = cvs.context;

            ctx.clearRect(0, 0, cvs.w, cvs.h);

            for (var id in entities) {
                if (entities.hasOwnProperty(id)) {
                    var e = entities[id];

                    if (!e.draw) {
                        console.log("Cannot draw entity: " + e + ", no draw method");
                        continue;
                    };

                    ctx.save();
                    e.draw(ctx);
                    ctx.restore();

                    // if ("img" in e && "x" in e && "y" in e) {
                    //     ctx.drawImage(e.img, e.x, e.y)
                    // } else if ("x" in e && "y" in e && "w" in e && "h" in e) {
                    //     ctx.beginPath();
                    //     ctx.rect(e.x, e.y, e.w, e.h);
                    //     ctx.fillStyle = e.color || '#8ED6FF';
                    //     ctx.fill();
                    //     ctx.stroke();
                    // } else if ("img" in e) { // Badly made entity w/ image
                    //     console.log("Entity: " + e.id + " missing x or y attribute");
                    // } else { // Badly made entity without image
                    //     console.log("Entity: " + e.id + " missing x, y, w, or h attribute");
                    // }
                };
            }
        },

        newEntity: function () {
            var id = UID();
            var ent;

            entities[id] = null;

            ent = Goomba(id);
            entities[id] = ent;

            // If we have properties
            if (arguments.length > 0) {
                ent.addComponent.apply(ent, arguments);
            };

            if (!ent.draw) {
                ent.addComponent("Color");
            };

            return ent;
        },

        newComponent: function (name, funcs) {
            components[name] = funcs;
        },

        triggerEvent: function (event, params) {
            var evts = events[event];

            for (var ev in evts) {
                if (!evts.hasOwnProperty(ev)) {
                    continue;
                }

                for (var i = 0; i < evts[ev].length; i++) {
                    if (evts[ev] && evts[ev][i]) {
                        if (entities[ev]) {
                            evts[ev][i].call(Goomba(+ev), params);
                        } else {
                            evts[ev][i].call(Goomba, params);
                        }
                    };
                }
            }
        },

        bindEvent: function (event, cb) {
            if (!events[event]) {
                events[event] = {};
            };

            var ev = events[event];

            if (!ev.global) {
                ev.global = [];
            };

            return ev.global.push(cb) - 1;
        },

        isComponent: function (comp) {
            return comp in components;
        }
    });

    function UID () {
        var newID = currEntID++;

        if (newID in entities) {
            return UID();
        }

        return newID;
    }

    Goomba.bindEvent("Update", function () {});

    Goomba.newComponent("Collidable", {
        bounds: null,

        init: function() {

        },

        setBounds: function(poly) {
            if (!poly) {
                if (this.img) {
                    this.bounds = {x: 0, y: 0, w: this.img.width, h: this.img.height};
                } else {
                    this.bounds = {x: 0, y: 0, w: this.w, h: this.h};
                }
            } else {
                this.bounds = poly;
            }

            return this;
        },

        getCollisions: function (comp) {
            if (!this.bounds) {
                this.setBounds();
            };

            var collisions = [];

            for (var ent in entities) {
                if (!entities[ent].m_comps[comp]) {
                    continue;
                };

                var currEnt = entities[ent];

                if (collides(this, currEnt)) {
                    collisions.push(currEnt);
                };
            }

            if (collisions.length === 0) {
                return false;
            };

            return collisions;
        },

        onHit: function (comp, cb) {
            this.bindEvent("Update", function () {
                var collisions = this.getCollisions(comp);

                if (collisions) {
                    cb.call(this, collisions);
                };
            });
        }
    });

    function collides(a, b) {
        if (b.img) {
            b.w = b.img.width;
            b.h = b.img.height;
        }

        return a.x < b.x + b.w &&
             a.x + a.w > b.x &&
             a.y < b.y + b.h &&
             a.y + a.h > b.y;
    }

    Goomba.bindEvent("KeyUp", function (event) {
        Goomba.keyboard.state[event.keyCode] = false;
    });

    Goomba.bindEvent("KeyDown", function (event) {
        Goomba.keyboard.state[event.keyCode] = true;
    });

    Goomba.bindEvent("MouseUp", function (event) {
        Goomba.mouse.state[event.button] = false;
    });

    Goomba.bindEvent("MouseDown", function (event) {
        Goomba.mouse.state[event.button] = true;

        console.log("Mouse over: " + Goomba.mouse.onEntities);
    });

    Goomba.bindEvent("MouseMove", function (event) {
        Goomba.mouse.position = {x: event.offsetX, y: event.offsetY};

        Goomba.mouse.onEntities.splice(0, Goomba.mouse.onEntities.length);

        for (var e in entities) {
            if (entities.hasOwnProperty(e)) {
                var currEnt = entities[e];

                var mousePos = Goomba.mouse.position;

                // Hacky way to use the existing collision code
                mousePos.w = 1;
                mousePos.h = 1;

                if (collides(mousePos, currEnt)) {
                    Goomba.mouse.onEntities.push(currEnt);
                };
            };
        };
    });

    window.addEventListener('keyup', function(event) {
        Goomba.triggerEvent("KeyUp", event);
    }, false);

    window.addEventListener('keydown', function(event) {
        Goomba.triggerEvent("KeyDown", event);
    }, false);

    window.addEventListener('mousedown', function(event) {
        Goomba.triggerEvent("MouseDown", event);
    }, false);

    window.addEventListener('mouseup', function(event) {
        Goomba.triggerEvent("MouseUp", event);
    }, false);

    window.addEventListener('mousemove', function(event) {
        Goomba.triggerEvent("MouseMove", event);
    });

    window.Goomba = Goomba;
})(window);

(function (Goomba, window, document) {
    Goomba.extend({
        canvas: {
            context: null,
            w: null,
            h: null,

            init: function (w, h) {
                var cv;

                cv = document.createElement("canvas");
                cv.width = w;
                cv.height = h;
                cv.style.position = 'relative';
                cv.style.left = "0px";
                cv.style.top = "0px";

                document.body.appendChild(cv);
                Goomba.canvas.context = cv.getContext('2d');
                Goomba.canvas.w = w;
                Goomba.canvas.h = h;
            }
        },

        init: function (w, h) {
            if (!Goomba.canvas.context) {
                Goomba.canvas.init(w, h);
            };

            Goomba.timer.init();
        },

        keyboard: {
            keys: {
                'BACKSPACE': 8,
                'TAB': 9,
                'ENTER': 13,
                'PAUSE': 19,
                'CAPS': 20,
                'ESC': 27,
                'SPACE': 32,
                'PAGE_UP': 33,
                'PAGE_DOWN': 34,
                'END': 35,
                'HOME': 36,
                'LEFT_ARROW': 37,
                'UP_ARROW': 38,
                'RIGHT_ARROW': 39,
                'DOWN_ARROW': 40,
                'INSERT': 45,
                'DELETE': 46,
                '0': 48,
                '1': 49,
                '2': 50,
                '3': 51,
                '4': 52,
                '5': 53,
                '6': 54,
                '7': 55,
                '8': 56,
                '9': 57,
                'A': 65,
                'B': 66,
                'C': 67,
                'D': 68,
                'E': 69,
                'F': 70,
                'G': 71,
                'H': 72,
                'I': 73,
                'J': 74,
                'K': 75,
                'L': 76,
                'M': 77,
                'N': 78,
                'O': 79,
                'P': 80,
                'Q': 81,
                'R': 82,
                'S': 83,
                'T': 84,
                'U': 85,
                'V': 86,
                'W': 87,
                'X': 88,
                'Y': 89,
                'Z': 90,
                'NUMPAD_0': 96,
                'NUMPAD_1': 97,
                'NUMPAD_2': 98,
                'NUMPAD_3': 99,
                'NUMPAD_4': 100,
                'NUMPAD_5': 101,
                'NUMPAD_6': 102,
                'NUMPAD_7': 103,
                'NUMPAD_8': 104,
                'NUMPAD_9': 105,
                'MULTIPLY': 106,
                'ADD': 107,
                'SUBSTRACT': 109,
                'DECIMAL': 110,
                'DIVIDE': 111,
                'F1': 112,
                'F2': 113,
                'F3': 114,
                'F4': 115,
                'F5': 116,
                'F6': 117,
                'F7': 118,
                'F8': 119,
                'F9': 120,
                'F10': 121,
                'F11': 122,
                'F12': 123,
                'SHIFT': 16,
                'CTRL': 17,
                'ALT': 18,
                'PLUS': 187,
                'COMMA': 188,
                'MINUS': 189,
                'PERIOD': 190
            },

            state: {}
        },

        mouse: {
            button: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            },

            state: {},

            position: {},

            onEntities: []
        }
    });

    Goomba.newComponent("Color", {
        init: function () {
            this.draw = function (ctx) {
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.w, this.h);
                ctx.fillStyle = this.color || '#8ED6FF';
                ctx.fill();
                ctx.stroke();
            }
        }
    });

    Goomba.newComponent("Image", {
        init: function () {
            this.draw = function (ctx) {
                ctx.drawImage(this.img, this.x, this.y);
            }
        }
    });

    Goomba.newComponent("Scoreboard", {
        init: function() {
            this.draw = function (ctx) {
                ctx.font = this.font || "normal 12px Verdana";
                ctx.fillText(this.text + this.score, this.x, this.y);
            }
        }
    })
})(Goomba, window, window.document);

