uikit.emailer = {
    init: function (elem) {
        var inpt = $('<inpt type="text"></inpt>')
        inpt.attr("placeholder", elem.attr('placeholder'));
        inpt.attr("icon", "envelope-o");


        var value = elem.attr('value');
        if (value) {
            inpt.attr('value', elem.attr('value'));
        }


        var actions = $('<actions></actions>');

        actions.append('<icon data-tracker="{1}" {0}></icon>'.format('check', 'none'));

        
        if (elem.prev().length){
            actions.append('<icon data-action="{1}" {0}></icon>'.format('minus', 'uikit.emailer.on.remove'));
        }else{
            actions.append('<icon data-action="{1}" {0}></icon>'.format('plus', 'uikit.emailer.on.add'));
            elem.addClass('prime');
        }
        

        inpt.append(actions);

        elem.append(inpt);

        uikit.emailer.bind(elem);

        if(value){
            core.evt.bind('uikit.emailer', 'uikit_load', uikit.emailer.on.kitload);
        }
    },

    bind: function (elem) {
        uikit.bind.typing(elem, 'uikit.emailer.on.track');
        uikit.bind.enter(elem, 'uikit.emailer.on.add');
    },

    on: {
        kitload: function (e) {
            var list = $('emailer input');
            for (let u = 0; u < list.length; u++) {
                const element = list[u];
                uikit.emailer.on.track({ target: element });    
            }
            
        },

        add: function (e) {
            var wrap = gt('inpt', e);
            var val = $('input', wrap).val();

            if (validator.email(val)) {
                var emailerWrap = gt('emailer', e);
                var emailer = $('<emailer></emailer');

                emailerWrap.after(emailer);

                uikit.set.all();

                uikit.fill.attr(emailerWrap, emailer, { isKeepParentAttr: true, isPreventClass: true });

                $('input', emailer).focus();
            }
            else{ 
                $('input', wrap).focus();
            }

        },

        remove: function (e) {
            var wrap = gt('emailer', e);
            if(wrap.hasClass('prime')){ return; }

            var prev = wrap.prev();
            wrap.remove();
            $('input', prev).focus();
        },

        track: function (e) {
            var wrap = gt('inpt', e);
            var tracker = $('[data-tracker]', wrap);

            tracker.removeClass('valid non-valid');
    
            var val = $('input', wrap).val();
            if (val.trim() == ""){ 
                if (e.keyCode == KEY.BACKSPACE && !wrap.parents('emailer').hasClass('prime')){
                    uikit.emailer.on.remove(e);
                }
                return; 
            }

            var reg = /[;,]$/;
            var clearVal = val.replace(reg, '');

            if (reg.test(val) && validator.email(clearVal)){
                $('input', wrap).val(clearVal);
                uikit.emailer.on.add(e);
            }
            else if (validator.email(val)){
                tracker.addClass('valid');
            }else{
                tracker.addClass('non-valid');
            }
        }
    }
}