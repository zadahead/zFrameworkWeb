uikit.lazy = {
    list: {},

    curr: null,

    lastScroll: -1,
    timer: null,

    duplicator: (name, list, onsetter, prefix, onload, validate) => {
        var el = $('duplicator[{0}]'.format(name));
        uikit.lazy.init(el, list, name,

            (row, index, rowHeight) => {
                var setter = onsetter(row, index);
                return uikit.duplicator.appendRow(name, setter, (clone) => {
                    clone.attr('data-index', index);
                    uikit.bind.setter(clone, 'uikit.lazy.on.change');
                });
            },

            (rows) => {
                uikit.duplicator.appendRows(rows);
            },

            onload, 
            prefix,
            validate
        );
    },

    init: (el, list, name, onrow, onrows, onload, prefix, validate) => {

        uikit.lazy.list[name] = {
            list: list,
            p: $(el).parent(),
            onrow: onrow,
            onrows: onrows,
            onload: onload,
            prefix: prefix,
            validate: validate
        }

        uikit.lazy.list[name].p.unbind('scroll').bind('scroll', uikit.lazy.on.scroll);

        el.attr('data-lazy-name', name);
        if(validate) {
            el.attr('data-validate-callback', 'uikit.lazy.validate');
        }

        uikit.lazy.load(el);
    },

    update: {
        list: (name, list) => {
            uikit.lazy.list[name].list = list;
            uikit.lazy.load($('[data-lazy-name="{0}"]'.format(name)));
        }
    },

    load: (el) => {
        var name = $(el).attr('data-lazy-name');

        var d = uikit.lazy.list[name];
        var onrow = d.onrow;
        var onrows = d.onrows;
        var list = d.list;



       

        //fill first row to determine the height
        if (!d.rowHeight) {
            $(el).empty();
            $(el).css('height', "auto");
            $(el).removeClass('on');
            var first = list[0];
            var r = onrow(first, 0, 0);
            onrows([r]);

            var h = absPos($(el)).full.height;
            d.rowHeight = h;

            $(el).css('height', (h * list.length) + "px");
            d.p[0].scrollTop = 0;

            $(el).empty();
            var rows = $('<rows></rows>')
            var pointer = $('<pointer>{0}</pointer>'.format(0));
            $(el).append(pointer);
            $(el).append(rows);
            d.pointer = pointer;
            d.pointer.hide();
            d.el = $(el);
        }

        $('rows', $(el)).empty();



        $(el).addClass('on');

        var margin = 10; //added rows
        var st = d.st = d.p[0].scrollTop;
        var i = parseInt(d.p[0].scrollTop / d.rowHeight);
        var l = i + parseInt(d.p[0].offsetHeight / d.rowHeight);

        uikit.lazy.curr = d;
        //pointer.css('top', st + 'px');

        i -= margin;
        l += margin;

        if (i < 0) { i = 0; }
        if (l > list.length) { l = list.length; }

        //top the wrapbox
        $('rows', $(el)).css('top', (i * d.rowHeight) + 'px');

        var rows = [];
        for (let index = i; index < l; index++) {
            var row = list[index];
            if (row) {
                var r = onrow(row, index, d.rowHeight);
                rows.push(r);
            }
        }

        onrows(rows);

        $('rows', $(el)).append($('row', $(el)));

        d.p[0].scrollTop = uikit.lazy.lastScroll = st;

        if (d.onload) {
            d.onload();
        }

        /*
        var index = 0;
        list.forEach(row => {
            onrow(row, index);
            index++;
        });
        */
    },

    set: {
        field: (field, value) => {
            switch (field[0].nodeName.toLowerCase()) {
                case 'inpt':
                    $(field).attr('value', value);
                    $(field).attr('onchange', 'lazy.on.change');
                    break;
                default:
                    $(field).html(value);
                    break;
            }
        }
    },

    get: {
        list: (name) => {
            var d = uikit.lazy.list[name];
            uikit.lazy.curr = d;
            return d.list;
        }
    },

    validate: () => {
        var d = uikit.lazy.curr;

        var unValid = [];
        for (let i = 0; i < d.list.length; i++) {
            if(unValid.length > 10) {
                unValid.push('And more...');
                break;
            }
            const row = d.list[i];
            var err = d.validate(row, i);
            if (err) {
                unValid.push(err);
            }
        }

        if(unValid.length) {
            msgerr(unValid.join('<br />'), 'Non valid form');
            return 'unvalid';
        }
        return;
    },

    on: {
        change: (val, e) => {
            var field = gt('[data-field]', e).attr('data-field');
            var index = gt('[data-index]', e).attr('data-index');

            var lz = gt('[data-lazy-name]', e);
            var name = $(lz).attr('data-lazy-name');
            var list = uikit.lazy.list[name].list;

            list[parseInt(index)][field] = val;

            //console.log(field, index, val);
        },

        scroll: (e) => {

            clearTimeout(uikit.lazy.timer);
            if (uikit.lazy.lastScroll != e.target.scrollTop) {
                uikit.lazy.curr.el.css('background', 'linear-gradient(to bottom,#ffffff {0}px, #f1f1f1 1px)'.format(uikit.lazy.curr.rowHeight - 1));
                uikit.lazy.curr.el.css('background-size', '100% {0}px'.format(uikit.lazy.curr.rowHeight));

                uikit.lazy.curr.pointer.show();
                uikit.lazy.curr.pointer.css('top', e.target.scrollTop + 'px');

                var index = parseInt(e.target.scrollTop / uikit.lazy.curr.rowHeight);
                var value = uikit.lazy.curr.prefix ? uikit.lazy.curr.list[index][uikit.lazy.curr.prefix].substr(0, 2) : index + 1;
                uikit.lazy.curr.pointer.html(value);


                uikit.lazy.lastScroll = e.target.scrollTop;
                uikit.lazy.timer = setTimeout(() => {
                    uikit.lazy.curr.el.css('background', 'none');

                    var el = gt('[data-lazy-name]', e);
                    uikit.lazy.load(el);
                    setTimeout(() => {
                        uikit.lazy.curr.pointer.hide();
                    }, 10);
                }, 200);
            }
        }
    }
}