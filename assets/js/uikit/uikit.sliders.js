uikit.sliders = {
    init: function (elem) {
        var sldr = $(elem);
        var items = $('> item', sldr);

        var group = sldr.attr('group');
        var circles = $('circles[group="{0}"]'.format(group));

        var params = {}
        if(elem.attr('data-params')) {
            var splt = elem.attr('data-params').split(',');
            splt.forEach(item => {
                params[item] = true;
            });
        }

        sldr[0].validate = sldr.attr('data-validate');
        sldr[0].callback = sldr.attr('data-callback');

        if (circles.length) {
            for (let i = 0; i < items.length; i++) {
                var circle = $('<circle>');
                circle.attr('data-index', i);
                if (!params.disable_circles) {
                    circle.attr('data-action', 'uikit.sliders.on.circle');
                }

                circles.append(circle);
            }
        }

        
        core.evt.bind('uikit.sliders', 'uikit_load', uikit.sliders.on.kitload);
        
    },

    on: {
        kitload: function (e) {
            uikit.get($('slider'), (elem) => {
                if (!elem[0].isActivated) {
                    uikit.sliders.set.active(elem, 0);    
                }
                elem[0].isActivated = true;
            }, null, true);
            
        },

        circle: function (e) {
            var circle = gt('circle', e);
            var group = circle.parents('[group]').attr('group');

            var wrap = $('slider[group="{0}"]'.format(group));

            var index = parseInt(circle.attr('data-index'));

            uikit.sliders.set.active(wrap, index);
        }
    },

    get: {
        group: function (sldr) {
            var sldr = $(sldr);
            var items = $('> item', sldr);

            var group = sldr.attr('group');
            var circles = $('circles[group="{0}"]'.format(group));

            return {
                items: items,
                circles: $('circle', circles),
                active: parseInt($('circle.active', circles).attr('data-index'))
            }
        },

        wrap: function (e) {
            var wrap = gt('slider', e);
            if (!wrap.length) {
                var group = gt('[group]', e).attr('group');
                wrap = $('slider[group="{0}"]'.format(group));
            }

            if (!wrap.length) {
                var group = gt('[data-slider]', e).attr('data-slider');
                wrap = $('slider[group="{0}"]'.format(group));
            }
            return wrap;
        }
    },

    set: {
        active: function (wrap, index, isForce) {
            var validate = !isForce && wrap[0].validate ? eval(wrap[0].validate) : (active, index, callback) => { callback(index); }

            
            var group = uikit.sliders.get.group(wrap);

            validate(group.active, index, (nextTab) => {
                if (nextTab == undefined) { return; }
                
                group.items.removeClass('active');
                group.circles.removeClass('active');

                $(group.items[nextTab]).addClass('active');
                $(group.circles[nextTab]).addClass('active');

                var active = $(group.items[nextTab]).attr('data-form');


                var transform = (nextTab * 100) * -1;

                group.items.css('transform', 'translateX({0}%)'.format(transform));

                if(wrap[0].callback) {
                    eval(wrap[0].callback)(nextTab, active);
                }
            })
        },

        next: function (wrap, cond) {
            var items = $(' > item', wrap);
            var index = 0;

            for (let i = 0; i < items.length; i++) {
                const item = $(items[i]);
                if (item.hasClass('active')) {
                    index = cond(items, item, i);
                    break;
                }
            }

            uikit.sliders.set.active(wrap, index);
        }
    },

    goto: function (group, index, isForce) {
        var wrap = $('slider[group="{0}"]'.format(group));
        uikit.sliders.set.active(wrap, index, isForce);
    },

    next: function (e) {
        var wrap = uikit.sliders.get.wrap(e);
        uikit.sliders.set.next(wrap, (items, item, i) => {
            var index = i + 1;
            if (!$(items[index]).length) {
                index = 0;
            }
            return index;
        })        
    },

    prev: function (e) {
        var wrap = uikit.sliders.get.wrap(e);
        uikit.sliders.set.next(wrap, (items, item, i) => {
            var index = i - 1;
            if (!$(items[index]).length) {
                index = items.length - 1;
            }
            return index;
        })

        
    }
}