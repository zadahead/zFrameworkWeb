

var msgLoading = (val, callback) => {
    msg(val);
    callback();
}

var alertPop = (val) => {
    alert(val);
}

var msgAlert = (val) => {
    alertPop(val);
}

var res = data.res;

var uikit = {
    timers: {
        scroll: null
    },

    init: function () {
        uikit.set.all();
        uikit.set.sys();
    },

    clear: function () {
    },

    test: function () {
    },

    set: {
        all: function () {
            //special 
            uikit.set.duplicator();

            
            //tools
            uikit.set.uploader();
            uikit.set.sliders();
            uikit.set.search();
            uikit.set.emailer();

            
            //ui elements
            uikit.set.list_container();
            uikit.set.dropdown();
            uikit.set.radiobtn();
            uikit.set.checkbox();
            uikit.set.datepicker();
            uikit.set.inpt();
            uikit.set.textbox();

            uikit.set.icon();
            uikit.set.flg();
            uikit.set.cflag();
            uikit.set.action();


          

            
           
            uikit.set.groupby();
            uikit.set.zeditor();
            uikit.set.filter();

            
            //website
            uikit.set.client();
            uikit.set.logo();
            uikit.set.userblock();
            

            //sytem
            uikit.set.fixers();
            uikit.set.tabIndex();
            uikit.set.loader();
            uikit.set.titler();
            uikit.set.actions();
            uikit.set.scrolls();

            //evt
            uikit.set.evt();
            uikit.set.href();
            uikit.set.prevent();

            //load stand alone elements
            uikit.set.sta();

            //shout
            core.evt.shout('uikit_load');
        },

        sys: function () {
            uikit.bind.click($('body'), function (e) {
                if (!gt('.sys_floater', e, true).length){
                    $('.sys_floater').removeClass('open');
                    $('body').removeClass('on_floater');
                }
            });

            $(window).bind('scroll', function (e) { 
                var scrollTop = $('html')[0].scrollTop;

                var fixers = $('[uik-fixer]');
                for (let i = 0; i < fixers.length; i++) {
                    const fixer = $(fixers[i]);
                    var offsetTop = parseFloat(fixer.attr('fixer-offsetTop'));

                    if (offsetTop <= scrollTop) {
                        if (!fixer.hasClass('on')) {
                            var pos = absPos(fixer);
                            fixer.css('width', pos.ex.width + 'px');
                        }

                        fixer.addClass('on');
                    }else{
                        fixer.removeAttr('style');

                        fixer.removeClass('on');
                    }
                }
            });
        },

        fixers: function () {
            uikit.get('[uik-fixer]', (elem) => {
                elem.attr('fixer-offsetTop', elem[0].offsetTop);
            })
        },

        uploader: function () {
            uikit.get('uploader', (elem) => {
                uikit.uploader.init(elem);
            })
        },

        sliders: function () {
            uikit.get('slider', (elem) => {
                uikit.sliders.init(elem);
            })
        },

        icon: function () {
            uikit.get('icon', (elem) => {
                $(elem).each(function () {
                    var isIconSet = false;
                    $.each(this.attributes, function () {
                        if (this.specified && 
                            this.name.indexOf('data-') == -1 && 
                            this.name.indexOf('type-') == -1 && 
                            !isIconSet) {
                            elem.append('<span class="icon-{0}"></span>'.format(this.name));
                            isIconSet = true;
                        }
                    });
                });
            })

            uikit.get('achivement', (elem) => {
                var value = elem.text();
                elem.empty();
                elem.append('<span>{0}</span>'.format(value));

                $(elem).each(function () {
                    $.each(this.attributes, function () {
                        if (this.specified && this.name.indexOf('data-') == -1) {
                            elem.prepend('<span class="icon-{0}"></span>'.format(this.name));
                        }
                    });
                });
            })
        },

        client: function (params) {
          /*
            <pic></pic>
            <title></title>
            <info></info>
            <icon></icon>
          */  

            uikit.get('client', (elem) => {
                $(elem).each(function () {
                    var attrs = [];
                    var type = elem.attr('type');

                    switch (type) {
                        case "pic":
                            for (let i = 0; i < 1; i++) {
                                elem.append('<section></section>');
                            }
                            break;
                    
                        default:
                            if (elem.attr('header') == undefined) {
                                for (let i = 0; i < 5; i++) {
                                    elem.append('<section></section>');
                                }
                            }
                            break;
                    }

                    
                    for (let i = 0; i < this.attributes.length; i++) {
                        const attr = this.attributes[i];

                        if (attr.specified && attr.name.indexOf('data-') == -1) {
                            var self = attr;

                            var append = (prefix) => {
                                if (self.value.trim() == "") { return; }

                                $('section:nth-child({0})'.format(prefix), elem).append('<info>{0}</info>'.format(self.value));
                                attrs.push(self.name);
                            }

                            switch (attr.name) {
                                case "clientid":
                                    var pic = $('<pic>');
                                    var src = "/assets/img/companies/{0}.jpg".format(attr.value);
                                    uikit.set.img(pic, src);

                                    $('section:nth-child(1)', elem).append(pic);
                                    elem.attr('data-id', attr.value);
                                    attrs.push(attr.name);

                                    $('section:nth-child(1)', elem).append('<icon check-circle></icon>');
                                    break;
                                case "name":
                                case "noid_name":
                                    append(2);
                                    break;
                                case "clienttype":
                                    append(3);
                                    break;
                                case "relationsstart":
                                    append(4);
                                    break;
                                case "contractlengthdays":
                                    append(5);
                                    break;
                                default:
                                    break;
                            }
                        }    
                    }
                    

                    attrs.forEach(attr => {
                        elem.removeAttr(attr);
                    });
                });
            })
        },


        action: function (action) {
            uikit.get(action ? gt('action', action) : 'action', (elem) => {
                var value = elem.text();
                elem.empty().append('<span>{0}</span>'.format(value));
                elem.append('<img spinner src="/assets/loaders/spinner.svg" />');
                elem.append('<span class="icon-warning sys"></span>');
                elem.append('<span class="icon-checkmark sys"></span>');
                
                
                $(elem).each(function () {
                    $.each(this.attributes, function () {
                        if (this.specified && 
                            this.name.indexOf('data-') == -1 &&
                            this.name.indexOf('type-') == -1 &&
                            this.name.indexOf('ajax-') == -1 &&
                            this.name.indexOf('icon-') == -1 &&
                            this.name != "class" && 
                            this.name != "tabindex") {
                                if (elem.attr('type-link') == '') {
                                    elem.prepend('<span class="icon-{0}"></span>'.format(this.name));
                                }else{
                                    elem.append('<span class="icon-{0}"></span>'.format(this.name));
                                }
                        }
                    });
                });
            })
        },

        titler: function () {
            uikit.get('[data-titler]', (elem) => {
                uikit.bind.move(elem, (e) => {
                    var tag = gt('[data-titler]', e);
                    if(!tag.length){ return; }

                    var val = tag.attr('data-titler');

                    var titler = $('titler');
                    $('text', titler).html(val);
                    $('body').append(titler);

                    var pos = absPos(tag).p;
                    titler.css('left', pos.left - (titler.width() / 2) + (pos.width / 2));
                    titler.css('top', pos.top - (titler.height()) - (pos.height));
                }, () => {
                    $('ghost').append($('titler'));
                })
            })
        },

        list_container: function () {
            uikit.get('list_container', (elem) => {
                uikit.fill.list_container(elem);
            })
        },

        duplicator: function () {
            uikit.get('duplicator', (elem) => {
                uikit.duplicator.init(elem);
            })
        },

        groupby: function () {
            uikit.get('groupby', (elem) => {
                uikit.groupby.init(elem);
            })
        },

        zeditor: function () {
            uikit.get('zeditor', (elem) => {
                uikit.zeditor.init(elem);
            })
        },

        filter: function () {
            uikit.get('filter', (elem) => {
                uikit.filter.init(elem);
            })
        },


        dropdown: function () {
            uikit.get('dropdown', (elem) => {
                var content = $('<list_container></list_container >');
                if(elem[0].list) {
                    content[0].list = elem[0].list;
                }else{
                    content.attr('list', elem.attr('list'))
                }

                var action = $('<action chevron-down>{0}</action>'.format(elem.attr('def')));

                if (elem.attr('ajax-on')) {
                    action.attr('ajax-on', elem.attr('ajax-on'));
                    elem.removeAttr('ajax-on');
                }
                content.append(action);

                

                $(elem).each(function () {
                    $.each(this.attributes, function () {
                        if (this.specified) {
                            content.attr(this.name, this.value);
                        }
                    });
                });

                elem.replaceWith(content);  
                content.attr('selector', 'on');

                uikit.get(content, (elem) => {
                    uikit.set.action(elem);

                    uikit.fill.list_container(elem);
                })
            })
        },

        radiobtn: function () {
            uikit.get('radiobtn', (elem) => {
                var options = $('opt', elem);
                var value = elem.attr('value');
                //console.log('rad valr', value);
                
                elem.removeAttr('value');

                uikit.get(options, (option) => {
                    var text = option.html();
                    option.empty();

                    option.append('<flg>');
                    var info = option.attr('info') ? '- <info>{0}</info>'.format(option.attr('info')) : '';

                    option.append('<title>{0}</title>{1}'.format(text, info));

                    if (value && value == option.attr('data-value')) {
                        $(option).addClass('selected');
                        elem.attr('data-value', value);
                    }

                    uikit.bind.click(option, (e) => {
                        var opt = gt('opt', e);

                        var value = opt.attr('data-value');

                        var wrap = gt('radiobtn', e);

                        wrap.attr('data-value', value);

                        $('opt', wrap).removeClass('selected');
                        $(opt).addClass('selected');

                        if (wrap.attr('onchange')) {
                            eval(wrap.attr('onchange'))(value, opt);
                        }

                        core.evt.shout('radiobtn_change', e);
                    })
                })
            })
        },

        checkbox: function() {
            uikit.get('checkbox', (elem) => {
                var text = elem.html();
                elem.empty();

                elem.append('<flg>');
                if (text != '') {
                    elem.append('<title>{0}</title>'.format(text));
                }

                if(elem.attr('value')) {
                    if (elem.attr('value') == 'true') {
                        elem.addClass('selected');
                    }
                }

                elem[0].value = elem.hasClass('selected');

                var onchange = elem.attr('on-change');
                elem[0].change = onchange && onchange != '' ? eval(onchange) : null;


                if (!elem.attr('noclick') && elem.attr('noclick') != '') {
                    uikit.bind.click(elem, (e) => {
                        var opt = gt('checkbox', e);

                        if ($(opt).hasClass('selected')) {
                            $(opt).removeClass('selected');
                        } else {
                            $(opt).addClass('selected');
                        }

                        if (opt[0].change) {
                            opt[0].change(e, $(opt).hasClass('selected'), opt);
                        }
                        
                        opt[0].value = $(opt).hasClass('selected');

                        core.evt.shout('radiobtn_change', e);
                    })
                }
                
            })
        },

        flg: function () {
            uikit.get('flg', (elem) => {
                elem.empty().append('<div>&nbsp;</div>');
            })
        },

        cflag: function () {
            uikit.get('cflag', (elem) => {
                //<img margin-side-thin="" src="/assets/img/flags/{{region}}.png">  
                
                var name = elem.attr('src');
                
                var src = '/assets/img/flags/{0}.png'.format(name);
                elem.css('background-image', "url('{0}')".format(src));
            })
        },

        datepicker: function () {
            uikit.get('datepicker', (elem) => {
                uikit.datepicker.init(elem);
            })
        },

        search: function () {
            uikit.get('search', (elem) => {
                uikit.search.init(elem);
            })
        },

        emailer: function () {
            uikit.get('emailer', (elem) => {
                uikit.emailer.init(elem);
            })
        },

        logo: function () {
            uikit.get('logo', (elem) => {
                elem.append('<img src="/assets/img/logo.png" />')
            })
        },

        userblock: function () {
            uikit.get('userblock', (elem) => {
                var id = elem.attr('data-id');
                var name = elem.attr('data-name');

                elem.append('<userpic data-id="{0}"></userpic>'.format(id));
                elem.append('<name>{0}</name>'.format(name));

                elem.removeAttr('data-name');
            })

            uikit.get('userpic', (elem) => {
                var id = elem.attr('data-id');
                var src = '/assets/img/users/{0}.jpg'.format(id);

                uikit.set.img(elem, src, 'none');
                
                elem.removeAttr('data-id');
            })

            uikit.get('company_logo', (elem) => {
                var id = elem.attr('id');

                var src = '/assets/img/companies/{0}.jpg'.format(id);
                
                uikit.set.img(elem, src);
                
                elem.removeAttr('id');

                
            })
        },

        img: function (elem, src, nophoto) {
            var nophoto = '/assets/img/{0}.jpg'.format(nophoto ? nophoto : 'nophoto');

            var img = $('<img src="{0}" />'.format(src));
            img[0].onload = (e) => {
                var img = $(e.target);
                var elem = $(img).parent();
                if (elem.attr('onload')) {
                    eval(elem.attr('onload'))();
                }
                $(img).remove();
            }

            img[0].onerror = (e) => {
                var img = $(e.target);
                var elem = $(img).parent();
                var nophoto = $(img).attr('data-src-nophoto');

                elem.css('background-image', 'url("{0}")'.format(nophoto));

                $(img).remove();
            }

            img.attr('data-src-nophoto', nophoto);
            elem.append(img);



            elem.css('background-image', 'url("{0}")'.format(src));
        },

        loader: function () {
            uikit.get('loader', (elem) => {

                $(elem).each(function () {
                    $.each(this.attributes, function () {
                        if (this.specified &&
                            this.name.indexOf('data-') == -1 &&
                            this.name != "class") {

                            elem.append('<img src="/assets/loaders/{0}.svg" />'.format(this.name));
                        }
                    });
                });
            })
        },

        inpt: function () {
            uikit.get('inpt', (elem) => {
                var input = $('<input />');

                var value = elem.attr('value');
                if (!value) { value = ''; }

                if (elem.attr('type-dis') == '') {
                    input.attr('disabled', 'disabled');
                }
                input.val(value);
                elem[0].defValue = value;

                var actions = $('<actions></actions>');

                elem.append(actions);

                var attrs = [];
                $(elem).each(function () {
                    $.each(this.attributes, function () {
                        // this.attributes is not a plain object, but an array
                        // of attribute nodes, which contain both the name and value
                        if (this.specified && this.name.indexOf('data-') == -1 && this.name.indexOf('type-') == -1) {
                            input.attr(this.name, this.value);

                            switch (this.name) {
                                case 'icon':
                                    elem.append('<icon {0}></icon>'.format(this.value));
                                    break;
                                case 'tracker':
                                    actions.append('<icon data-tracker="{1}" {0}></icon>'.format('check', this.value));
                                    break;
                                case 'type':
                                    if (this.value == 'register') {
                                        actions.append('<icon data-passeye {0}></icon>'.format('eye'));
                                        input.attr(this.name, 'password');
                                    }
                                    break;
                                default:
                                    break;
                            }
                            attrs.push(this.name);
                        }
                    });
                });

                attrs.forEach(attr => {
                    elem.removeAttr(attr);
                });

                input.bind('focus', function (e) {
                    var inpt = $('input', gt('inpt', e));

                    if (inpt.attr('type-dis') == '') {
                        inpt[0].blur();
                        return;
                    }

                    gt('inpt', e).addClass('focus');

                    var action = gt('[data-on-focus]', e).attr('data-on-focus');
                    if (action) {
                        eval(action)(e);
                    }
                });

                input.bind('blur', function (e) {
                    gt('inpt', e).removeClass('focus');

                    var action = gt('[data-on-blur]', e).attr('data-on-blur');
                    if (action) {
                        eval(action)(e);
                    }
                });

                uikit.bind.highlight(input);
                uikit.bind.change(input);

                if ($('[data-tracker]', elem).length) {
                    input.bind('focus keyup', function (e) {
                        var wrap = gt('inpt', e);
                        var val = $('input', wrap).val();
                        var tracker = $('[data-tracker]', wrap);

                        wrap.addClass('on-tracker');

                        tracker.removeClass('valid non-valid')

                        var action = tracker.attr('data-tracker');
                        if (action && action != '' && action != 'none') {
                            eval(action)(val, (flag) => {
                                if (flag) {
                                    tracker.addClass('non-valid');
                                    tracker.attr('data-titler', flag);
                                } else {
                                    tracker.addClass('valid')
                                    tracker.removeAttr('data-titler');
                                }
                                uikit.set.titler();
                                wrap.removeClass('on-tracker');
                            })
                        }

                    });
                }

                if ($('[data-passeye]', elem).length) {
                    uikit.bind.click($('[data-passeye]', elem), (e) => {
                        var inpt = $('input', gt('inpt', e));

                        if (input.attr('type') == 'password') {
                            input.attr('type', 'text');
                            gt('inpt', e).addClass('on_passeye');
                        } else {
                            input.attr('type', 'password');
                            gt('inpt', e).removeClass('on_passeye');
                        }
                    }, true);
                }

                elem.append(input);

                elem.append('<msg>');

                elem.append($('actions', elem));
            })
        },


        textbox: function (wrap) {
            uikit.get('textbox', (elem) => {
                var value = elem.attr('value');
                if(!value) { value = ''; }

                var textbox = $('<textarea>{0}</textarea>'.format(value));


                var attrs = [];
                $(elem).each(function () {
                    $.each(this.attributes, function () {
                        // this.attributes is not a plain object, but an array
                        // of attribute nodes, which contain both the name and value
                        if (this.specified && this.name.indexOf('data-') == -1 && this.name.indexOf('type-') == -1) {
                            textbox.attr(this.name, this.value);
                            attrs.push(this.name);
                        }
                    });
                });

                attrs.forEach(attr => {
                    elem.removeAttr(attr);
                });

                textbox.bind('focus', function (e) {
                    var inpt = $('input', gt('inpt', e));

                    if (inpt.attr('type-dis') == '') {
                        inpt[0].blur();
                        return;
                    }

                    gt('textbox', e).addClass('focus');

                    var action = gt('[data-on-focus]', e).attr('data-on-focus');
                    if (action) {
                        eval(action)(e);
                    }
                });

                textbox.bind('blur', function (e) {
                    gt('textbox', e).removeClass('focus');

                    var action = gt('[data-on-blur]', e).attr('data-on-blur');
                    if (action) {
                        eval(action)(e);
                    }
                });

                uikit.bind.highlight(textbox);
                uikit.bind.change(textbox);

                elem.append(textbox);

                elem.append('<msg>');
            })
        },

        actions: function (wrap) {
            var wrap = wrap ? $('[data-action]', wrap) : '[data-action]';
            uikit.get(wrap, (elem) => {
                var action = elem.attr('data-action');

                if (action) {
                    uikit.bind.click(elem, action);
                    uikit.bind.enter(elem, action);
                }
            }, 'data-action')
        },

        scrolls: function (wrap) {
            var wrap = wrap ? $('[data-onscroll]', wrap) : '[data-onscroll]';
            uikit.get(wrap, (elem) => {
                elem.bind('scroll', (e) => {
                    var action = gt('[data-onscroll]', e).attr('data-onscroll');
                    if (action) {
                        clearTimeout(uikit.timers.scroll);
                        uikit.timers.scroll = setTimeout(() => {
                            eval(action)();
                        }, 800);
                    }

                });
            }, 'data-onscroll');
        },

        evt: function () {
            uikit.evt.init();

            uikit.get('[dragger]', (elem) => {
                uikit.evt.dragger.bind(elem);
            }, 'dragger');
        },

        href: function () {
            uikit.get('[data-href]', (elem) => {
                var inner = elem.html();

                var a = $('<a>');
                a.attr('href', '/' + elem.attr('data-href'));
                a.append(inner);

                
                a.bind('click', (e) => {
                    e.preventDefault();

                    var wrap = gt('[data-href]', e);
                    if(!wrap.attr('data-action')) {
                        load.page(wrap.attr('data-href'));  
                    }
                })
                elem.empty().append(a);
            }, 'data-href');
        },

        sta: function () {
            uikit.get('sta', (elem) => {
                uikit.sta.init(elem);
            })
        },

        prevent: () => {
            uikit.get('[data-prevent]', (elem) => {
                var p = elem.attr('data-prevent');

                switch (p) {
                    case 'autofill':
                        var val = elem[0].defValue ? elem[0].defValue : '';

                        $('input, textarea', elem).attr('disabled', 'disabled');

                        uikit.bind.click(elem, (e) => {
                            if (gt('.diss', e).length) { return }

                            $('input, textarea', elem).removeAttr('disabled').focus();
                        })

                        break;

                    default:
                        break;
                }

            }, 'data-prevent');
        },

        tabIndex: function (wrap) {
            var tabIndex = 1;

            //clear all 
            $('[tabindex]').removeAttr('tabindex');

            uikit.get($('input, [data-action]'), (elem) => {
                elem.attr('tabindex', -1);
            }, null, true)

            //set new

            var wrap = wrap ? $(wrap) : $('body');

            uikit.get($('input , textarea', wrap), (elem) => {

                elem.attr('tabindex', tabIndex);
                tabIndex++;
            }, null, true)

            uikit.get($('[data-action]', wrap), (elem) => {

                elem.attr('tabindex', tabIndex);
                tabIndex++;
            }, null, true)
        }
    },

    bind: {
        click: function (elems, action, isAddAttr) {

            try {
                eval(action);

                for (let i = 0; i < elems.length; i++) {
                    const elem = $(elems[i]);

                    if (elem.attr('data-click-bind')) {
                        continue;
                    }


                    elem[0].action = action;
                    elem.bind('click', uikit.on.click);
                    elem.bind('mousedown', uikit.on.down);
                    elem.bind('mouseup', uikit.on.up);
                    elem.attr('data-click-bind', 'on');
                    if (isAddAttr) {
                        elem.attr('data-action', '');
                    }
                }

            } catch (e) {

            }
        },

        move: function (elems, action, leave) {
            try {
                eval(action);

                for (let i = 0; i < elems.length; i++) {
                    const elem = $(elems[i]);

                    if (!elem.attr('data-move-bind')) {
                        elem[0].moveaction = action;
                        elem[0].leave = leave;

                        elem.bind('mouseenter').bind('mouseenter', uikit.on.move);
                        elem.bind('mouseleave', uikit.on.leave);

                        elem.attr('data-move-bind', 'on');
                    }
                    
                }

            } catch (e) {

            }
        },

        mousedown: function (elems, down) {
            try {
                eval(down);

                for (let i = 0; i < elems.length; i++) {
                    const elem = $(elems[i]);

                    elem.bind('mousedown', down);

                    elem.attr('data-mousedown-bind', 'on');
                }

            } catch (e) {

            }
        },


        change: function (elem) {
            var nodeName = elem[0].nodeName.toLowerCase();
            switch (nodeName) {
                case "input":
                case "textarea":
                    elem[0].startVal = elem.val();
                    elem.bind('keyup', function (e) {
                        if(e.target.value != e.target.startVal) {
                            $(e.target).attr('data-change', 'true');
                        }else {
                            $(e.target).attr('data-change', 'false');
                        }

                        if($(e.target).attr('onchange')) {
                            eval($(e.target).attr('onchange'))(e.target.value, e);
                        }

                        var setter = $(e.target).parents('[data-setter-change]');

                        if (setter.length) {
                            eval(setter.attr('data-setter-change'))(e.target.value, e);
                        }
                    });        
                    break;
            
                default:
                    break;
            }
            
        },

        setter: function (wrap, func) { //bind elem change and trigger 
            var fields = $('[data-field]', wrap);

            $(fields).each(function () {
                var elem = $(this);
                elem.attr('data-setter-change', func);
            });

           

        },

        enter: function (elem, action) {
            elem.attr('data-on-enter', action);
            elem.bind('keyup', function (e) {
                if(e.keyCode == KEY.ENTER){
                    var action = gt('[data-on-enter]', e).attr('data-on-enter');
                    eval(action)(e);
                }
            });
        },

        blur: function (elem, action) {
            elem.attr('data-on-blur', action);
        },


        focus: function (elem, action) {
            elem.attr('data-on-focus', action);
        },

        typing: function (elem, action) { 
            elem.attr('data-on-typing', action);
            elem.bind('keyup', function (e) {
                var action = gt('[data-on-typing]', e).attr('data-on-typing');
                eval(action)(e);
            });
        },

        arrow: {
            down: function (elem, action) {
                elem.attr('data-on-arrow-down', action);
                elem.bind('keydown', function (e) {
                    if (e.keyCode == KEY.ARROW_DOWN) {
                        var action = gt('[data-on-arrow-down]', e).attr('data-on-arrow-down');
                        eval(action)(e);
                    }
                });
            },

            up: function (elem, action) {
                elem.attr('data-on-arrow-up', action);
                elem.bind('keydown', function (e) {
                    if (e.keyCode == KEY.ARROW_UP) {
                        var action = gt('[data-on-arrow-up]', e).attr('data-on-arrow-up');
                        eval(action)(e);
                    }
                });
            }
        },

        highlight: function (elem) {
            elem.bind('focus', function (e) {
                var input = $('input', gt('inpt', e));

                if (input.attr('type-dis') == '') {
                    input[0].blur();
                    return;
                }

                if(input.attr('no-highlight') == undefined) {
                    this.select();
                }
            });
        }
    },

    get: function (tag, action, prefix, isForce) {
        var tags = $(tag);

        for (let i = 0; i < tags.length; i++) {
            const elem = $(tags[i]);

            var t = typeof tag == "string" ? tag.replace(/[\]\[]/g, '') : prefix ? prefix : elem[0].nodeName;
            var settedClass = 'uikit_setted_' + t;

            if (!isForce && !elem.attr('data-' + settedClass)) {
                elem.attr('data-' + settedClass, 'on')
                action(elem);
            } else if (isForce) {
                action(elem);
            }
        }
    },

    get1: function (tag, action, prefix, isForce) {
        var tags = $(tag);

        for (let i = 0; i < tags.length; i++) {
            const elem = $(tags[i]);

            var t = typeof tag == "string" ? tag.replace(/[\]\[]/g, '') : prefix ? prefix : elem[0].nodeName;
            var settedClass = 'uikit_setted_' + t;

            if (!elem[0].setter) { elem[0].setter = {}; }
            

            if (!isForce && !elem[0].setter[settedClass]) {
                elem.attr('data-uik-el', 'on');
                //console.log(elem[0].nodeName);

                elem[0].setter[settedClass] = true;

                action(elem);
            } else if (isForce) {
                action(elem);
            }
        }
    },

    remove: {
        wrap: (wrap) => {
            wrap.parent().attr('data-change', 'true');
            wrap.fadeOut('fast', function () {
                $(this).remove();   
            })
        }
    },

    to: {
        list: {
            call: function (list) {
                return uikit.to.list.container(
                    list,

                    (id) => {

                    },

                    data.res.global.clear
                );
            },

            container: (list, id, value, action, resAll) => {
                if (!list) { list = []; }

                var arr = [];

                if(typeof id == "function") {
                    action = id;
                    resAll = value;

                    id = 'id';
                    value = 'value';
                }

                list.forEach(item => {

                    var found = arr.find(function (element) {
                        return item[id] == element.id;
                    });

                    if (!found) {
                        arr.push({
                            id: item[id],
                            value: item[value]
                        });
                    }
                });

                
                return {
                    data: arr,
                    action: action,
                    all: resAll
                };
            }
        }
    },

    clone: {
        loader: function (name) {
            return $('loader[{0}]'.format(name)).clone(); 
        }
    },

    sort: {
        list: (list, id, wrap, prefix) => {
            var clone = jQuery.extend(true, [], list);

            function propComparator(prop) {
                return function (a, b) {
                    if (prop.indexOf('.') != -1) {
                        try {
                            return eval('a.' + prop) - eval('b.' + prop);
                        } catch (error) {
                            return 0;
                        }
                    } else {
                        return a[prop] - b[prop];
                    }
                }
            }
            if(id){
                clone.sort(propComparator(id));
            }

            var wrap = $(wrap);
            clone.forEach(item => {
                var elem = $('[data-id="{0}"]'.format(item[prefix]), wrap);
                wrap.append(elem);
            });
        }
    },

    fill: {
        attr: function (elem, target, params) {
            var params = params ? params : {};

            var attrs = [];
            $(elem).each(function () {
                $.each(this.attributes, function () {
                    if (this.specified) {
                        var isValid = true;

                        if (params.isOnlyData && this.name.indexOf('data-') == -1){
                            isValid = false
                        } 

                        if (params.isPreventClass && this.name == "class") {
                            isValid = false
                        } 

                        if(isValid){
                            target.attr(this.name, this.value);
                            attrs.push(this.name);
                        }
                    }
                });
            });

            if (!params.isKeepParentAttr){
                attrs.forEach(attr => {
                    elem.removeAttr(attr);
                });
            }
        },

        list_container: function (elem) {
            var list = elem[0].list ? elem[0].list : elem.attr('list') ? elem.attr('list')  : null;

            if (!list) {
                var container = $('container', elem);
                if (container.length) {
                    list = {
                        html: container.clone(true, true)
                    }
                    elem.addClass('spread');
                    container.remove();
                }
            }

            if (!list) { console.log("list_container ERR {0}".format('must have a list attribute with a valid list')) };

            var trig = elem.html();
            elem.empty();
            elem.append('<trig>');
            $('trig', elem).append(trig);

            $('trig', elem).append('<arrow up>');

            list = eval(list);
            elem.append('<list_wrap>');
            $('list_wrap', elem).append('<list>');

            var listTag = $('list', elem);
            listTag.empty();

            if (typeof list == "function"){
                list = list();
            }

            if (elem.attr('onchange')){
                elem[0].onchange = eval(elem.attr('onchange'));
            }

            if (elem.attr('onremove')) {
                elem[0].onremove = eval(elem.attr('onremove'));
            }

            var defValue = elem.attr('value') ? elem.attr('value') : "-1";
            var isMulti = elem.attr('multi') == '';

            if(isMulti) {
                $('list_wrap', elem).append('<actions space-between>');

                var ok = $('<action checkmark type-link>OK</action>');
                var unselect = $('<action type-link>unselect</action>');

                $('list_wrap actions', elem).append(unselect);
                $('list_wrap actions', elem).append(ok);
                
                
                uikit.bind.click(unselect, 'uikit.on.list_container_unselect');
                uikit.bind.click(ok, 'uikit.on.list_container_ok');
                

                elem[0].value = [];
            }

            var append = (id, value, action, state, highlight, del) => {
                if (id == 'html') {
                    listTag.append(value);
                } else {
                    var itemTag = (id == 'sep') ? $('<title>') : $('<item>');
                    if (typeof (value) == 'function') {
                        action = value;
                        value = id;
                    }

                    if (!value) {
                        value = '';
                    }

                    itemTag[0].item_action = action;


                    if (id != 'sep') {
                        uikit.bind.click(itemTag, 'uikit.on.list_container_select');
                    }

                    if (isMulti) {
                        itemTag.empty().append('<line>');
                        $('line', itemTag).append($('<flg>'));
                        $('line', itemTag).append($('<info>'));
                        $('info', itemTag).append(value);

                        if (state) {
                            itemTag.addClass('selected');
                            if (value != id) {
                                elem[0].value.push({ id: id, value: value });
                            } else {
                                elem[0].value.push(value);
                            }
                        }

                        if (highlight) {
                            itemTag.attr('data-highlight', highlight);
                        }
                    } else {
                        if (state) {
                            itemTag.addClass('selected');
                        }


                        itemTag.html(value);
                    }

                    if (del) {
                        itemTag.append('<icon bin />');
                        uikit.bind.click($('icon[bin]', itemTag), 'uikit.on.list_container_remove');
                    }

                    itemTag.attr('data-id', id);

                    if (id == defValue || state) {
                        var container = listTag.parents('list_container');
                        container.attr('data-id', id);

                        if (id != "-1") {
                            $('span', $('trig action', container)).first().html(value);

                            container.addClass('selected');
                        }
                    }

                    listTag.append(itemTag)
                }
            }

            if(list.data){
                append("-1", list.all, list.action);

                list.data.forEach(item => {
                    append(item.id, item.value, list.action);
                });
            } else if (list.html) {
                append("html", list.html, list.callback);
            } else{
                list.forEach(item => {
                    var val = item.value ? item.value : item.name ? item.name : item;
                    var id = item.id ? item.id : x;
                    var state = item.selected;
                    var highlight = item.highlight;
                    var del = item.del;

                    append(id, val, null, state, highlight, del);
                });
                
            }
            

            elem.addClass('sys_floater');

            uikit.bind.click($('> trig', elem), 'uikit.on.list_container');

        }
    },

    on: {
        error: {
            photo: function (img) {
                img.src = '/assets/img/nophoto.jpg';
            }
        },

        click: function (e) {
            try {
                
                var elem = gt('[data-click-bind]', e);
                if (elem.hasClass('dis')) { return; }
                if (elem.attr('type-dis') == '') { return; }
                if (elem.hasClass('on')) { return; }

                if (!elem.length){ return; }
                if ($('.item-clicked', $(e.currentTarget)).length) { return; }
                var action = elem[0].action;

                uikit.last.action.click = elem;
                eval(action)(e);

            } catch(err){
                console.error(err);
            }
        },

        move: function (e) {
            try {

                var elem = gt('[data-move-bind]', e);
                if (elem.hasClass('dis')) { return; }

                if (!elem.length) { return; }
                if ($('.item-clicked', $(e.currentTarget)).length) { return; }

                var action = elem[0].moveaction;
                eval(action)(e);

            } catch (err) {
                console.error(err);
            }
        },
        

        leave: function (e) {
            try {

                var elem = gt('[data-move-bind]', e);
                if (elem.hasClass('dis')) { return; }

                if (!elem.length) { return; }
                if ($('.item-clicked', $(e.currentTarget)).length) { return; }

                var action = elem[0].leave;
                eval(action)(e);

            } catch (err) {
                console.error(err);
            }
        },

        down: function (e) {
            var elem = gt('[data-click-bind]', e);
            if(elem.hasClass('dis')){ return; }

            if ($('.item-clicked', elem).length) { return; }

            elem.addClass('item-clicked');
        },

        up: function (e) {
            setTimeout(() => {
                $('.item-clicked').removeClass('item-clicked');
            }, 200);
        },

        list_container: function (e) {
            var tag = gt('list_container', e);
            var isMulti = tag.attr('multi') == '';

            var isOpen = tag.hasClass('open');

            $('list_container.open').removeClass('open');
            $('body').removeClass('on_floater');

            if (!isMulti) {
                $('list item', tag).removeClass('selected');
            }

            if (isOpen) { 
                tag.removeClass('open'); 
            }
            else { 
                tag.addClass('open'); 
                tag.removeClass('botttom side_right');

                if(!isMulti) {
                    var selectedId = tag.attr('data-id');
                    $('list item[data-id="{0}"]'.format(selectedId), tag).addClass('selected');
                }
                

                var posListWrap = absPos($('list', tag));

                //$('list', tag).css('top', posListWrap.top + 'px');

                if (posListWrap.right > getWindowXY().w) {
                    tag.addClass('side_right');
                }

                if (posListWrap.bottom > getWindowXY().h) {
                    tag.addClass('botttom');
                }


                if (tag.parents('popwrap').length) {
                    var cont = $('> content', tag.parents('popwrap'));

                    var b = absPos(cont).bottom;
                    if (b < absPos($('list', tag)).bottom) {
                        tag.addClass('botttom');
                      
                        var t = absPos(cont).top;
                        if (t > absPos($('list', tag)).top) {
                            tag.removeClass('botttom');
                            $('body').addClass('on_floater');
                        }
                    }
                }
            }
        },

        list_container_ok: function (e) {
            var container = gt('list_container', e);
            var value = container[0].value;
            
            if (container[0].onchange) {
                container[0].onchange(e, value, container);
            }

            container.removeClass('open');
            core.evt.shout('list_container_blur', e);
        },

        list_container_unselect: function (e) {
            var container = gt('list_container', e);
            container[0].value = [];

            $('item', container).removeClass('selected');
        },

        list_container_remove: function (e) {
            var container = gt('list_container', e);
            var item = gt('item[data-id]', e);
            var id = item.attr('data-id');

            if (container[0].onremove) {
                container[0].onremove(e, id, item);
            }
        },

        list_container_select: function (e) {
            var tag = gt('item', e);
            var container = gt('list_container', e);
            var isSelector = container.attr('selector');
            var isMulti = container.attr('multi') == '';

            var action = tag[0].item_action;

            var id = gt('[data-id]', e).attr('data-id');
            var val = id != "-1" ? tag.html() : container.attr('def') ? container.attr('def') : tag.html();

            var trig = $('trig', container);

            $(container).attr('data-change', 'true');


            if(!isMulti) {
                if (id != "-1") {
                    if (action) { action(id, e); }
                    if (isSelector) {
                        container.addClass('selected');
                    }
                    container.attr('data-value', val);
                } else {
                    container.removeAttr('data-value');

                    if (action) { action(); }

                    if (isSelector) {
                        container.removeClass('selected');
                    }
                }

                container.attr('data-id', id);


                if (isSelector) {
                    $('span', trig).first().html(val);
                }

                if (container[0].onchange) {
                    container[0].onchange(id, tag);
                }

                container.removeClass('open');
                core.evt.shout('list_container_blur', e);
            } else{
                tag.toggleClass('selected');

                var list = [];
                var selected = $('item.selected', container);
                selected.each((i, t) => {
                    var id = $(t).attr('data-id');
                    var value = $('info', $(t)).text();

                    if(id == value) {
                        list.push(value);
                    } else{
                        list.push({ id: id, value: value });
                    }
                })

                container[0].value = list;
            }
            
        }
    },

    last: {
        action: { }
    },

    list_container: {
        select: (t, id) => {
            var target = $('item[data-id="{0}"]'.format(id), t);
            uikit.on.list_container_select({ target: target });
        },

        reload: (target) => {
            target.empty();
            target.removeAttr('data-uikit_setted_list_container');
            uikit.set.all();
        }
    },

    dropdown: {
        reload: (target, clear) => {
            var content = $('<dropdown></dropdown >');
            content.attr('list', target.attr('list'));
            content.attr('onchange', target.attr('onchange'));
            content.attr('value', target.attr('value'));
            content.attr('data-id', target.attr('data-id'));
            content.attr('data-field', target.attr('data-field'));
            content.attr('class', target.attr('class'));
            content.attr('ajax-on', $('[ajax-on]').attr('ajax-on'));

            if (clear) {
                content.removeAttr('value');
                content.removeAttr('data-id');
            }

            
            target.replaceWith(content);
            uikit.set.all();
        }
    }
}

core.init.await(uikit.init);
