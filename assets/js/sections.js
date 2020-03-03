var section = {
    is: {
        on: false
    },

    timer: null,

    set: function (sec, query, callback, cErr, params) {
        section.fill(sec, sec, query, callback, cErr, params);
    },

    fill: function (wrap, sec, query, callback, cErr, params) {
        var secTag = section.get(wrap);
        var params = params ? params : {};

        routing.send(wrap, sec);

        if (!params.isPreventRoll) {
            section.roll(wrap);
        }

        section.call(sec, query, (html) => {

            secTag[0].data = {
                wrap: wrap,
                section: sec,
                query: query,
                params: params
            }

            if (params.onUpdate) {
                params.onUpdate(secTag, html);
            } else {
                secTag.empty().append(html).attr('data-state', 'show');
            }

            uikit.set.all();
            core.init.call();

            if (callback) {
                callback(html);
            }

            
        }, cErr, true);
    },

    reload: (e, callback) => {
        var pop = gt('[data-section]', e);
        var data = pop[0].data;

        section.fill(data.wrap, data.section, data.query, callback, null, data.params);
    },

    reloads : {
        list: [],

        call: (targets, callback) => {
            if(typeof(targets) == 'string') {
                targets = $('[data-form="{0}"]'.format(targets));
            }
            else if(targets.target) { targets = $(targets.target).parents('[data-form]').first(); }

            section.reloads.list = targets;
            section.reloads.callback = callback;
            section.reloads.next();
        },


        next: () => {
            var next = section.reloads.list[0];
            if(next) {
                var e = { target: $(next) }

                if (uikit.pop.is.it(e)) {
                    uikit.pop.reload(e, section.reloads.onload);
                } else {
                    section.reload(e, section.reloads.onload);
                }
            } else{
                if (section.reloads.callback) {
                    section.reloads.callback();
                }
            }
        },

        onload: () => {
            section.reloads.list.splice(0, 1);
            section.reloads.next();
        }

    },



    update: function (sec, row, callback, cErr) {
        section.set(sec, null, callback, cErr, {
            isPreventRoll: true,
            onUpdate: (secTag, html) => {
                var id = row[0];
                var prefix = row[1];

                var tagPrev = $('[{0}={1}]'.format(prefix, id), secTag);
                var tagNew = $('[{0}={1}]'.format(prefix, id), $(html));

                tagPrev.replaceWith(tagNew);


                var scriptPrev = $('script'.format(prefix, id), secTag);

                var reg = /\<script data-name=\"[\s\S]*?\"\>([\s\S]*?)\<\/script\>/gim;

                var scriptNew = reg.exec(html);
                if (scriptNew && scriptNew[1]) {
                    var name = scriptPrev.attr('data-name');
                    if (name) {
                        data[name] = eval(scriptNew[1]);
                    }
                }

            }
        })
    },

    get: function (sec) {
        return $('[data-section="{0}"]'.format(sec));
    },

    roll: function (sec) {
        var secTag = section.get(sec);

        secTag.append(uikit.clone.loader('bar')).attr('data-state', 'loading');
    },

    call: function (sec, query, callback, cErr, noloader) {
        if (section.is.on) {
            clearTimeout(section.timer);
            core.log('loading...');

            section.timer = setTimeout(() => {
                section.call(sec, query, callback, cErr, noloader);
            }, 500);
            return;
        }

        var noloader = noloader ? noloader : false;
        section.is.on = true;

        ajax.call('POST', 'sections/' + sec, query, function() {
            section.is.on = false;
            core.log();
            callback.apply(this, arguments);
        }, cErr, { nonapi: true, port: 'web', noloader: noloader });
    },

    clear: function (sec) {
        var secTag = section.get(sec);

        secTag.empty().removeAttr('data-state');
    }
}