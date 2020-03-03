

uikit.duplicator = {
    list: {},

    init: function (elem) {
        $(elem).each(function () {
            $.each(this.attributes, function () {
                if (this.specified && this.name && !this.value && this.name != 'empty') {
                    if (!uikit.duplicator.list[this.name]) {
                        uikit.duplicator.list[this.name] = $(elem).clone();
                    }
                }
            });

            if (elem.attr('empty') == '') {
                elem.empty();
            }
        });
    },

    remove: (e) => {
        var parent = gt('duplicator', e);
        if (!parent.children().length) {
            parent = gt('line', e);
            if (parent.length) {
                uikit.remove.wrap(parent);
            } else {
                parent = gt('row', e);
                if (parent.length) {
                    uikit.remove.wrap(parent);
                }
            }
            return;
        }

        if (parent.children().length == 1) {
            return;
        } else {
            var parentNode = parent.children().first()[0].nodeName.toLowerCase();
            var wrap = gt(parentNode, e);
            uikit.remove.wrap(wrap);
        }
    },

    prepend: function (name, setter, isPreset, isPostSet) {
        uikit.duplicator.append(name, setter, true, isPreset, isPostSet);
    },

    append: function (name, setter, isPrepend, isPreset, isPostSet) {
        name = name.toLowerCase();

        var parent = $('duplicator[{0}]'.format(name));
        uikit.duplicator.appendTo(parent, name, setter, isPrepend, isPreset, isPostSet);
    },

    clear: function (name) {
        name = name.toLowerCase();

        var parent = $('duplicator[{0}]'.format(name));
        parent.empty();
    },

    appendDD: function (name, arr) {
        uikit.duplicator.append(name, null, null, (n) => {
            arr.forEach(i => {
                $(i.prefix, n)[0].list = i.list;
            });
        });
    },

    appendRow: (name, setter, preset) => {
        var parent = $('duplicator[{0}]'.format(name));
        var name = name.toLowerCase();
        var tag = uikit.duplicator.list[name];

        var parent = $(parent);



        var n = $(tag.clone().html());

        var uiel = $('[data-uikit-elem]', n);
        uiel.each((i, t) => {
            $(t)[0].setter = {}
        })


        parent.append(n);

        if (preset) {
            preset(n);
        }

        return {
            setter: setter,
            n: n
        }


       
    },

    appendRows: (rows, onset) => {        

        uikit.set.all();

        rows.forEach(row => {
            if (row.setter) {
                uikit.duplicator.set(row.n, row.setter);

                var inputs = $('input, textarea', row.n);
                inputs.each((i, t) => {
                    uikit.bind.change($(t));
                })

                if (onset) {
                    onset(row);
                }
            }
        });

        

        //auto focus input if there are any
        var lastN = rows[rows.length - 1];
        if(lastN) {
            $('input, textarea', lastN.n).first().focus();

            lastN.n.parent().scrollTop(lastN.n);
        }
    },

    appendTo: (parent, name, setter, isPrepend, isPreset, isPostSet) => {
        name = name.toLowerCase();
        var tag = uikit.duplicator.list[name];

        var parent = $(parent);

       

        var n = $(tag.clone().html());

        var uiel = $('[data-uikit-elem]', n);
        uiel.each((i, t) => {
            $(t)[0].setter = {}
        })


        if (isPrepend) {
            parent.prepend(n);
        } else {
            parent.append(n);
        }

        if (isPreset) {
            isPreset(n);
        }

        uikit.set.all();


        if (setter) {
            /*
                setter =  [
                    ['userblock', 'data-id', '1'],
                    ['userblock', 'data-name', 'Mosh'],
                    ['dropdown', 'value', '1']
                ]
            */
            uikit.duplicator.set(n, setter);
           
        }

        if (isPostSet) {
            isPostSet(n);
        }

        //auto focus input if there are any
        $('input, textarea', n).first().focus();


        var inputs = $('input, textarea', n);
        inputs.each((i, t) => {
            uikit.bind.change($(t));
        })

        n.parent().scrollTop(n);
    },

    set: (n, setter) => {
        for (let i = 0; i < setter.length; i++) {
            var s = setter[i];
            var tg = s[0];
            var prefix = s[1];
            var val = s[2];
            var isHTML = s[3];

            if (typeof (prefix) == 'function') {
                prefix($(tg, n));
            } else {
                var t = $('{0}[{1}]'.format(tg, prefix), n);
                if (!t.length) {
                    t = $('{0}'.format(tg), n);
                }
                if (!t.length) {
                    t = n;
                }

                if (prefix.startsWith('_')) {
                    switch (prefix) {
                        case '_remove':
                            t.remove();
                            break;
                        case '_hide':
                            t.hide();
                            break;
                        case '_keep':
                            break;
                        default:
                            break;
                    }
                }
                else if (prefix == 'html' || isHTML) {
                    t.html(val);
                } else {
                    if (prefix == 'value') {
                        switch (t[0].nodeName.toLowerCase()) {
                            case 'list_container':
                                uikit.list_container.select(t, val);
                                break;
                            case 'input':
                            case 'textarea':
                                t.val(val);
                                break;
                            default:
                                t.attr(prefix, val);
                                break;
                        }
                    } else {
                        t.attr(prefix, val);
                    }
                }
            }
        }
    }

}