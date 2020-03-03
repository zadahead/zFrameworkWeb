var core = {

    set: {
        token: function (token) {
            setCookie('eManage-access-token', token, 1); 
        }
    },

    get: {
        shortToken: () => {
            var token = getCookie('eManage-access-token');
            return token.substr(0, 50) + '||' + token.substr(token.length - 50, token.length);
        }
    },

    log: (text) => {
        if (text) {
            $('consolelog').html(text);
            $('consolelog').addClass('on');
            $('ajaxloader').addClass('on');
        } else {
            $('consolelog').html('');
            $('consolelog').removeClass('on');
            $('ajaxloader').removeClass('on');
        }

    },

    reload: () => {
        core.evt.list = [];
    },

    init: {
        list: [],
        awaits: [],

        add: function (func, isPreload) {
            if (isPreload) {
                core.init.list.unshift(func);
            } else {
                core.init.list.push(func);
            }
        },

        await: function (func) {
            core.init.awaits.push(func);
        },

        call: function () {
            core.init.list.forEach(func => {
                func();
            });
            core.init.list = [];

            if (core.init.awaits.length) {
                core.init.post.next();
            } else{
                core.evt.shout('page_load');
            }
        },

        post: {
            next: () => {
                var next = core.init.awaits[0];
                if (next) {
                    next();
                    core.init.awaits.splice(0, 1);
                    core.init.post.next();
                } else{
                    core.evt.shout('page_load_await');
                }
                
            }
        }
    },

    evt: {
        list: [],

        bind: function (sec, evt, callback, parent) {
            var isAdded = false;

            core.evt.list.forEach(item => {
                if (!isAdded) {
                    if (item.sec == sec && item.evt == evt) {
                        item.callback = callback;
                        item.parent = parent;
                        isAdded = true;
                    }
                }
            });

            if (!isAdded) {
                core.evt.list.push({
                    sec: sec,
                    evt: evt,
                    callback: callback,
                    parent: parent
                });
            }
        },

        unbind: function (sec) {
            var list = core.evt.list;
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i].sec == sec) {
                    core.evt.list.splice(i, 1);
                }
            }
        },

        shout: function (evt, data, parent, callback) {
            if (typeof (data) == 'function') {
                callback = data;
                data = null;
            } else if (typeof (parent) == 'function') {
                callback = parent;
                parent = null;
            }

            var list = core.evt.list;
            for (var i = 0; i < list.length; i++) {
                var p = parent ? list[i].parent ? list[i].parent : list[i].sec : null;
                if (list[i].evt == evt && p == parent) {
                    list[i].callback(data, callback);
                }
            }
        }
    }
}

$(document).ready(core.init.call);