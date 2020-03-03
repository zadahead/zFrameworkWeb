var cssToStyle = {
    call: function (tag) {
        cssToStyle.fetch('body');



        cssToStyle.replace(tag);

        return $('body > div')[0].outerHTML.replace(/&quot;/gi, "'");
    },

    fetch: function (parent) {
        var children = cssToStyle.get.inners(parent);

        for (let i = 0; i < children.length; i++) {
            const child = $(children[i]);
            if (cssToStyle.is.allowed(child)) {
                if (cssToStyle.is.allowedSet(child)) {
                    cssToStyle.set(child);
                }

                cssToStyle.fetch(child);
            }
        }
    },

    replace: function (tag) {

        switch (tag[0].nodeName) {
            case 'IMG':
                break;
            case 'A':
                cssToStyle.replace($(tag).children());
                break;
            default:

                $(tag).replaceWith(function () {
                    if ($(this).children().length) {
                        cssToStyle.replace($(this).children());
                    }

                    if (!cssToStyle.is.allowedSet($(this))) {
                        return $(this);
                    }


                    var div = $('<div>');

                    var style = $(this).attr('style');
                    if (style) {
                        div.attr('style', style);
                    }

                    var src = $(this).attr('src');
                    if (src) {
                        div.attr('src', src);
                    } else {
                        div.html($(this).html());
                    }

                    return div;
                });

                break;
        }
    },

    is: {
        allowed: function (child) {
            switch (child[0].nodeName) {
                case 'SCRIPT':
                case 'GHOST':
                    return false;
                default:
                    return true;
            }
        },

        allowedSet: function (child) {
            switch (child[0].nodeName) {
                case 'IF':
                case 'THEN':
                case 'ELSE':
                    return false;
                default:
                    return true;
            }
        }
    },

    set: function (child) {
        var availStyles = [
            'height', 'width', 'max-width',

            'border', 'border-radius', 'padding', 'margin', 'direction',

            'font', 'font-family', 'font-style', 'font-variant', 'font-size',
            'font-weight', 'letter-spacing', 'line-height', 'text-align',
            'text-decoration', 'text-indent', 'text-transform', 'white-space',
            'word-spacing', 'vertical-align',

            'color', 'background-color', 'background-image', 'background-position', 'background-size',
            'background-repeat',

            'display',

            'list-style-type', 'align-items', 'justify-content', 'flex', 'flex-direction'
        ]

        var css = currCSS(child);
        availStyles.forEach(style => {
            switch (style) {
                case 'width':
                    if (child.attr('auto-width') != undefined) {
                        child.css(style, 'auto');
                    }
                    else if (child.attr('flex-width') != undefined || child.parents('[flex-width]').length) {
                        child.css(style, (child.width() + 1) + 'px');
                    } else {
                        let padding = toFloat(css['padding-right']) + toFloat(css['padding-left']);
                        let margin = toFloat(css['margin-right']) + toFloat(css['margin-left']);
                        child.css(style, 'calc(100% - {0}px'.format(padding + margin));
                    }
                    break;
                case 'max-width':
                    let mw = toFloat(css['max-width']);
                    if (mw) {
                        child.css('width', '100%');
                    }

                    child.css(style, css[style]);
                    break;
                case 'height':
                    if (child.attr('flex-height') != undefined || child.parents('[flex-height]').length) {
                    } else {
                        child.css(style, (child.height()) + 'px');
                    }
                    break;
                case 'margin':
                    if (child.attr('auto-margin') != undefined) {
                        child.css('margin', 'auto');
                    }else{
                        var set = (st) => {
                            var st = 'margin-' + st;
                            child.css(st, css[st]);
                        }
                        set('left');
                        set('right');
                        set('top');
                        set('bottom');
                    }
                    

                    break;
                case 'padding':
                    var set = (st) => {
                        var st = 'padding-' + st;
                        child.css(st, css[st]);
                    }
                    set('left');
                    set('right');
                    set('top');
                    set('bottom');

                    break;
                default:
                    child.css(style, css[style]);
                    break;
            }
        });

        $(child).each(function () {
            $.each(this.attributes, function () {
                if (this.specified
                    && this.name.indexOf('src') == -1
                    && this.name.indexOf('type') == -1
                    && this.name.indexOf('style') == -1
                    && this.name.indexOf('flex-') == -1
                    && this.name.indexOf('href') == -1
                    && this.name.indexOf('target') == -1) {

                    child.removeAttr(this.name);
                }
            });
        });

        if (child.attr('src')) {
            child.attr('src', '{{res.email.imgUrl|| company_id }}');
            child.css('height', 'auto');
        }

        if (child[0].style.backgroundImage != 'none') {
            child[0].style.backgroundImage = 'url("{{res.email.imgUrl|| company_id }}")';
        }
    },

    get: {
        inners: function (elem) {
            return $('> *', $(elem));
        }
    }
}