var uikit = uikit || {};


var EVT_ACTIONS = {
    MOVE: "move",
    UP: "up",
    DOWN: "down",
    WHEEL: "wheel",
    MIDDLE: "middle",
    REZISE: "resize"
}


var mouse = {
    x: 0,
    y: 0,
    dir: {
        x: "",
        y: "",
        axis: ""
    },
    step: 0,
    speed: null,
    isDown: false,
    loaded: false,
    isScroll: false
}

var evt = {
    click: function () {
        return (isMobile.any() ? 'touchend' : 'click');
    },

    down: function () {
        return (isMobile.any() ? 'touchstart' : 'mousedown');
    },

    up: function () {
        return (isMobile.any() ? 'touchend' : 'mouseup');
    },

    move: function () {
        return (isMobile.any() ? 'touchmove' : 'mousemove');
    }
}


uikit.evt = {
    is: {
        on: false
    },

    init: () => {
        if (uikit.evt.is.on) { return; }
        uikit.evt.is.on = true;

        uikit.evt.attach.mouse();
        uikit.evt.attach.document();
        
    },

    state: {
        push: (page) => {
            history.pushState(page, '', page);
        }
    },

    listen: {
        list: [],

        start: () => {

        },

        add: (id, action, func, elem, isKeep) => {
            uikit.evt.listen.list.push({
                id: id,
                action: action,
                func: func,
                elem: elem,
                isKeep: isKeep
            });
        },

        shout: (e, action) => {
            var mouseHandlers = uikit.evt.listen.list;

            for (var i = 0; i < mouseHandlers.length; i++) {
                var mouseHandler = mouseHandlers[i];
                if (mouseHandler.action == action) {
                    mouseHandler.func(e, mouseHandler.elem);
                }
            }

        },

        remove: (id) => {
            var mouseHandlers = uikit.evt.listen.list;

            for (var i = mouseHandlers.length - 1; i >= 0; i--) {
                var mouseHandler = mouseHandlers[i];
                if (mouseHandler.id == id || id == -1) {
                    mouseHandlers.splice(i, 1);
                }
            }
        }
    },  

    attach: {
        document: () => {
            var attachEvents = function () {
                window.onresize = uikit.evt.on.document.resize;
            }


            attachEvents();
        },

        mouse: () => {

            //get mouses X and Y

            var ev = {
                down: isMobile.any() ? 'touchstart' : 'mousedown',
                up: isMobile.any() ? 'touchend' : 'mouseup',
                move: isMobile.any() ? 'touchmove' : 'mousemove'
            }


            var attachMouseEvents = function () {
                if (document.captureEvents) document.captureEvents(Event.MOUSEMOVE)
                if (mouse.loaded) { return; }
                mouse.loaded = true;

                if (isMobile.any()) {
                    //$(document).bind("mouseover", mouseismoving);
                    $("body").bind("touchmove", uikit.evt.on.mouse.moving);
                    $("body").bind("touchstart", uikit.evt.on.mouse.down);
                    $("body").bind("touchend", uikit.evt.on.mouse.up);

                } else if (document.addEventListener) {
                    var a = ["DOMMouseScroll", "mousewheel"];
                    for (var i = 0; i < a.length; i++) {
                        document.addEventListener(a[i], uikit.evt.on.mouse.wheel, false);
                    }

                    $(document).bind("mouseover", uikit.evt.on.mouse.moving);
                    $(document).bind(evt.move(), uikit.evt.on.mouse.moving);
                    $(document).bind(evt.down(), uikit.evt.on.mouse.down);
                    $(document).bind(evt.up(), uikit.evt.on.mouse.up);
                } else {
                    document.onmousewheel = uikit.evt.on.mouse.wheel;
                    document.onmousemove = uikit.evt.on.mouse.moving;
                    document.onmousedown = uikit.evt.on.mouse.down;
                    document.onmouseup = uikit.evt.on.mouse.up;
                }
            }


            attachMouseEvents();
           
        }
    },

    on: {
        document: {
            resize: (e) => {
                uikit.evt.listen.shout(e, EVT_ACTIONS.REZISE);
            }
        },

        mouse: {
            moving: (e) => {
                if (!e) { e = event; }

                var x = 0, y = 0;

                if (isMobile.any()) {
                    x = e.touches ? e.touches[0].clientX : e.changedTouches ? e.changedTouches[0].clientX : (e.originalEvent && e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.touches[0].clientX;
                    y = e.touches ? e.touches[0].clientY : e.changedTouches ? e.changedTouches[0].clientY : (e.originalEvent && e.originalEvent.changedTouches) ? e.originalEvent.changedTouches[0].pageY : e.originalEvent.touches[0].clientY;
                } 
                else {  // grab the x-y pos.s if browser is NS
                    x = e.pageX;
                    y = e.pageY;
                }
                if (x < 0) { x = 0; }
                if (y < 0) { y = 0; }

                if (mouse.isScroll) {
                    y -= $(window).scrollTop();
                }

                mouse.dir.x = (x > mouse.x) ? "right" : (x < mouse.x) ? "left" : "center";
                mouse.dir.y = (y > mouse.y) ? "down" : (y < mouse.y) ? "up" : "center";

                var diffX = mouse.x - x;
                var diffY = mouse.y - y;

                if (diffX < 0) { diffX = diffX * -1; }
                if (diffY < 0) { diffY = diffY * -1; }

                mouse.dir.axis = (diffX > diffY) ? "x" : "y";

                mouse.step++;



                mouse.x = x;
                mouse.y = y;
                //msg(mouse.x + ',' + mouse.y);

                uikit.evt.listen.shout(e, EVT_ACTIONS.MOVE);
                


                return true;
            },

            up: (e) => {
                if (!e) { e = event; }

                mouse.isDown = false;
                uikit.evt.listen.shout(e, EVT_ACTIONS.UP);
            },

            down: (e) => {
                if (!e) { e = event; }
                var mouseHandlers = uikit.evt.listen.list;
                mouse.isDown = true;

                for (var i = 0; i < mouseHandlers.length; i++) {
                    var mouseHandler = mouseHandlers[i];
                    if (mouseHandler.action == EVT_ACTIONS.DOWN) {
                        mouseHandler.func(e);
                    }

                    if (mouseHandler.action == EVT_ACTIONS.MIDDLE && e.button == 1) {
                        mouseHandler.func(e);
                    }
                }
            },

            wheel: (event) => {
                var mouseWheelCalls = 0;

                var delta = 0;
                if (!event) { event = window.event; }

                var target = event.target;

                if (event.wheelDelta) {
                    delta = event.wheelDelta / 120;

                    if (window.opera)
                        delta = -delta;
                } else if (event.detail) {
                    delta = -event.detail / 3;
                }

                /** If delta is nonzero, handle it.
                * Basically, delta is now positive if wheel was scrolled up,
                * and negative, if wheel was scrolled down.
                */

                mouseWheelCalls = 0;
                var mouseHandlers = uikit.evt.listen.list;

                if (delta) {
                    for (var i = 0; i < mouseHandlers.length; i++) {
                        var mouseHandler = mouseHandlers[i];
                        var cool = true;

                        if (mouseHandler.elem) {
                            if (!$(target).parents(mouseHandler.elem).length) {
                                cool = false;
                            }
                        }

                        if (cool) {
                            if (mouseHandler.action == EVT_ACTIONS.WHEEL) {
                                mouseHandler.func(target, delta, event);
                                mouseWheelCalls++;
                            }
                        }
                    }
                }

                if (mouseWheelCalls) {
                    if (event.preventDefault) { event.preventDefault(); }
                    event.returnValue = false;
                }
            }
        }
    }
};


var track = uikit.evt.listen.add;

var untrack = uikit.evt.listen.remove;