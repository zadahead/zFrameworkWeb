var uikit = uikit || {};

uikit.evt = uikit.evt || {};

uikit.evt.dragger = {
    curr: null,

    is: {
        on: () => {
            return $('body').hasClass('on_drag');
        }
    },

    bind: (elem) => {
        uikit.bind.mousedown(elem, uikit.evt.dragger.on.down);

        var params = null;
        if (elem.attr('on-params')) {
            params = eval(elem.attr('on-params'))
        }
        if (!params) { params = {}; }
        
        var evt = {
            start: params.start ? params.start : elem.attr('on-start'),
            move: params.move ? params.move : elem.attr('on-move'),
            stop: params.stop ? params.stop : elem.attr('on-stop')
        }

        if (params.parent) {
            elem[0].parent = elem.parents(params.parent);
        }

        if (params.dblclick) {
            elem[0].dblclick = params.dblclick;
            elem.bind('dblclick', uikit.evt.dragger.on.dblclick);
        }

       

        for(var x in evt) {
            if(evt[x]) {
                evt[x] = eval(evt[x]);
            }
        }

        elem[0].evt = evt;
    },

    on: {
        down: (e) => {
            e.preventDefault();
            var dragger = gt('[dragger]', e);
            dragger[0].start = { x: mouse.x, y: mouse.y, offset: dragger.offset() };
            uikit.evt.dragger.curr = dragger[0];

            var curr = uikit.evt.dragger.curr;

            if(curr.parent) {
                curr.start.offset.left -= curr.parent.offset().left;
                curr.start.offset.top -= curr.parent.offset().top;
            }

            track('dragger', EVT_ACTIONS.MOVE, uikit.evt.dragger.on.move);

            track('dragger', EVT_ACTIONS.UP, uikit.evt.dragger.on.up);

            
            if (curr.evt.start) {
                var d = uikit.evt.dragger.get.data();
                curr.evt.start({ target: curr }, d);
            }

            $('body').addClass('on_drag');
        },

        move: () => {
            var curr = uikit.evt.dragger.curr;
            if (curr.evt.move) {
                var d = uikit.evt.dragger.get.data();
                curr.evt.move({ target: curr }, d);
            }
        },

        up: (e) => {
            untrack('dragger');

            var curr = uikit.evt.dragger.curr;
            if (curr.evt.stop) {
                var d = uikit.evt.dragger.get.data();
                curr.evt.stop({ target: curr }, d);
            }

            setTimeout(() => {
                $('body').removeClass('on_drag');
            }, 50);
        },

        dblclick: (e) => {
            var dragger = gt('[dragger]', e);
            if (dragger[0].dblclick) {
                dragger[0].dblclick(dragger);
            }
        }
    },

    get: {
        data: () => {
            var start = uikit.evt.dragger.curr.start;
            var left = start.offset.left + (mouse.x - start.x);
            var top = start.offset.top + (mouse.y - start.y);


            

            return {
                left: left,
                top: top,
                size: {
                    width: (mouse.x - start.x),
                    height: (mouse.y - start.y)
                }
            }
        }
    }
}