uikit.search = {
    timer: null,
    timerTyping: null,

    init: function (elem) {
        var inpt = $('<inpt no-highlight type="text"></inpt>')
        inpt.attr("placeholder", elem.attr('placeholder'));

        var type = elem.attr('type');

        
        inpt.attr("icon", "search");

        var value = elem.attr('value');
        if(value){
            inpt.attr('value', elem.attr('value'));
            elem.attr('data-lastvalue', value);
            elem.attr('data-value', value);
        }
        

        var actions = $('<actions></actions>');
        actions.append('<icon data-action="{1}" {0}></icon>'.format('arrow-right', 'uikit.search.on.call'));


        inpt.append(actions);

        elem.append(inpt);

        switch (type) {
            case "external":
                break;
            default:
                elem.append('<results data-section="{0}"></results>'.format(elem.attr('section')));
                break;
        }

        uikit.search.bind(elem);
    },

    bind: function (elem) {
        
        uikit.bind.typing(elem, 'uikit.search.on.typing');
        uikit.bind.enter(elem, 'uikit.search.on.enter');
        

        var type = elem.attr('type');
        switch (type) {
            case "external":
                break;
            default:
                uikit.bind.arrow.down(elem, 'uikit.search.on.arrow.down');
                uikit.bind.arrow.up(elem, 'uikit.search.on.arrow.up');
                uikit.bind.blur(elem, 'uikit.search.on.blur');
                uikit.bind.click($('results', elem), 'uikit.search.on.row');
                break;
        }
    },

    on: {
        row: function (e) {
            var wrap = gt('search', e);    
            var row = gt('row', e);
            uikit.search.get.results(e, 'row').removeClass('selected');
            row.addClass('selected');

            uikit.search.on.enter(e);
        },

        arrow: {
            down: function (e) {
                var wrap = gt('search', e);    
                var row = uikit.search.get.results(e, 'row.selected');

                var next = row.next();
                if(!next.length){
                    next = $('results row', wrap).first();
                }

                uikit.search.get.results(e, 'row').removeClass('selected');

                next.addClass('selected');
            },

            up: function (e) {
                var wrap = gt('search', e);
                var row = uikit.search.get.results(e, 'row.selected');

                var prev = row.prev();
                if (!prev.length) {
                    prev = $('results row', wrap).last();
                }

                uikit.search.get.results(e, 'row').removeClass('selected');

                prev.addClass('selected');
            }
        },

        enter: function (e) {
            var wrap = gt('search', e);    
            var sec = wrap.attr('section');

            var row = uikit.search.get.results(e, 'row.selected');

            if(row.length){
                wrap.attr('data-id', row.attr('data-id'));

                var value = row.attr('data-value');
                if(value == undefined){
                    value = row.attr('data-id');
                }
                

                wrap.attr('data-lastvalue', value);
                wrap.attr('data-value', value);
                $('input', wrap).val(value);

                section.clear(sec);

                if (wrap[0].onpick){
                    wrap[0].onpick({
                        id: row.attr('data-id'),
                        value: row.attr('data-value')
                    })
                }
            }
        },

        blur: function (e) {
            clearTimeout(uikit.search.timer);

            uikit.search.timer = setTimeout(() => {
                var wrap = gt('search', e);
                var sec = wrap.attr('section');
                section.clear(sec);
            }, 500);
        },

        typing: function (e, isForce) {
            

            if(!isForce){
                var wrap = gt('search', e);
                var sec = wrap.attr('section');

                var lastvalue = wrap.attr('data-lastvalue');
                var val = $('input', wrap).val();

                if (val == lastvalue) { return; }

                clearTimeout(uikit.search.timerTyping);

                wrap.attr('data-id', '');
                wrap.attr('data-lastvalue', val);

                if (val == '') {
                    section.clear(sec);
                    return;
                }

                section.roll(sec);
            }

            
            
            if(ajax.is.on){
                uikit.search.timerTyping = setTimeout(() => {
                    uikit.search.on.typing(e, true);
                }, 100);
            }else{
                var t = isForce ? 100 : 600;

                uikit.search.timerTyping = setTimeout(() => {
                    uikit.search.on.call(e);
                }, t);
            }
            
        },

        call: function (e) {
            var wrap = gt('search', e);

            var clbk = (sec, query, onpick) => {
                if (sec){
                    section.set(sec, query, () => {
                        $('row', uikit.search.get.results(e)).first().addClass('selected');
                        $('input', wrap).focus();
                        wrap[0].onpick = onpick;
                    });
                }
            }

            var request = wrap.attr('request');
            if (request){
                eval(request)(clbk);
            }else{
                clbk(wrap.attr('section'));
            }
            
        }
    },

    get: {
        results: function (e, tag) {
            var wrap = gt('search', e);
            var sec = wrap.attr('section');
            var type = wrap.attr('type');

            switch (type) {
                case 'external':
                    return $('[data-section={0}] {1}'.format(sec, tag), wrap);
                default:
                    return $('results {0}'.format(tag), wrap);
                    
            }
            
        }
    }
}