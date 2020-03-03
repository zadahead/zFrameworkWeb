uikit.pop = {
    section: function (sec, query, callback, onClose, params) {
        if(typeof(query) == "function") { callback = query; query = null; }
        var params = params ? params : {};

        section.call(sec, query, (html) => {

            var pop = $('<pop>');
            if(params.type) {
                pop.attr('type-' + params.type, 'on');
            }

            pop[0].data = {
                section: sec,
                query: query
            }

            pop.append('<popwrap>');
            $('popwrap', pop).append('<strip type-dark justify-end>');
            $('popwrap', pop).append('<content>');

            $('strip', pop).append('<icon cross data-action="uikit.pop.close" />');

            $('content', pop).append(html);

            $('body').append(pop);
            uikit.set.all();
            core.init.call();

            if (onClose) {
                pop[0].onClose = onClose;
            }

            if (callback) {
                callback();
            }

            setTimeout(() => {
                pop.addClass('on');
            }, 100);

        });
    },

    sectionWide: function (sec, query, callback, onClose) {
        uikit.pop.section(sec, query, callback, onClose, { type: 'wide'});
    },

    is: {
        it: (e) => {
            return gt('pop', e).length; 
        }
    },

    reload: (e, callback) => {
        if (!uikit.pop.is.it(e)) {
            section.reload(e, callback);
            return;
        } 

        var pop = gt('pop', e);
        var data = pop[0].data;
        
        var content = $('popwrap > content', pop);
        content.append(uikit.clone.loader('bar'));

        section.call(data.section, data.query, (html) => {
            content.empty().append(html);
            content.attr('data-change', 'saved');
            
            uikit.set.all();
            core.init.call();

            if(callback) {
                callback();
            }
        })
    },

    close: (e, callback, d) => {
        var pop = gt('pop', e);
        var isChanges = explore.change(pop);
        var isSaved = explore.saved(pop);


        var func = () => {
            pop.removeClass('on');

            if (pop[0].onClose) {
                pop[0].onClose(isSaved, d);
            }

            setTimeout(() => {
                pop.remove();
                if (callback) {
                    callback(isSaved);
                }
            }, 200);
        }


        if (isChanges) {
            confirm('Unsaved changes were made. cancel changes and continue?', () => {
                func();
            })
        } else{
            func();
        }
        
    }
}