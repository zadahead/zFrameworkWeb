uikit.groupby = {
    init: (elem) => {
        var field = elem.attr('field');

        var children = elem.children();

        for (let i = 0; i < children.length; i++) {
            const child = $(children[i]);
            
            var f = child.attr('data-' + field);
            if (!$('[field-name="{0}"]'.format(f), elem).length) {
                uikit.groupby.append.box(elem, f);
            }

            var wrap = $('[field-name="{0}"]'.format(f), elem);
            $('content', wrap).append(child);
        }

        uikit.set.all();
    },

    append: {
        box: (elem, field) => {
            var box = $('<box>');
            var state = elem.attr('state') ? elem.attr('state') : 'open';

            box.append('<trigger>');

            $('trigger', box).append('<icon chevron-right />');
            $('trigger', box).append('<icon chevron-down />');
            $('trigger', box).append('<headline>{0}</headline>'.format(field));

            $(box).attr('data-state', state);

            $('trigger', box).attr('data-action', 'uikit.groupby.on.trigger');

            box.append('<content>');

            box.attr('field-name', field);
            elem.append(box);
        }
    },

    on: {
        trigger: (e) => {
            var box = gt('box', e);

            if(box.attr('data-state') == 'open') {
                box.attr('data-state', 'close');
            }else {
                box.attr('data-state', 'open');
            }
        }
    }
}