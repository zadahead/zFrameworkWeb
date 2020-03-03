

/*
    AJAX
    handles all api request needed for app
*/

var ajax = {};

ajax.is = {
    on: false
}

ajax.users = {
    login: function (params, callback, cErr) {
        ajax.login('users', params, callback, cErr)
    },

    set: {
        currClient: function (currId, callback, cErr) {
            ajax.post('users/updateCurrClient', { currClient: currId }, callback, cErr);
        },
        updateClientsList: function (params, callback, cErr) {
            ajax.post('users/updateClientsList', {  }, callback, cErr);
        }
    }
};

ajax.client = {
    data: {
        get: function (callback, cErr) {
            ajax.get('client/data', null, callback, cErr); 
        }
    }
}

ajax.template = {
    get: function (templateId, typeId, categoryId, callback, cErr) {
        ajax.get('template/get', { templateId: templateId, typeId: typeId, categoryId: categoryId  }, callback, cErr);
    }
}

ajax.rule = {
    getOptions: function ( typeId, callback, cErr) {
        ajax.get('rule/get', { ruleId: -1, typeId: typeId }, callback, cErr);
    }
}

ajax.inventory = {
    set: {
        file_headers: function (list, callback, cErr) {
            ajax.post('inventory/setInvFileHeaders', { list: list }, callback, cErr); 
        },

        client: {
            lookup: function (data, callback, cErr) {
                ajax.req.call('set/lookup', data, callback, cErr); 
            },

            template: function (data, callback, cErr) {
                ajax.post('template/set', data, callback, cErr); 
            },

            rule: function (data, callback, cErr) {
                ajax.post('rule/set', data, callback, cErr);
            },

            attributes: function (data, callback, cErr) {
                ajax.post('attributes/set', data, callback, cErr);
            }
        }
    },

    process: function (data, callback, cErr) {
        ajax.req.call('process', data, callback, cErr); 
    },

    export: function (data, callback, cErr) {
        ajax.req.call('export/inventory', { params: data }, callback, cErr); 
    },

    delRows: function (data, callback, cErr) {
        ajax.req.call('delRows/inventory', { params: data }, callback, cErr);
    },

    remove: {
        lookup: function (lookupId, callback, cErr) {
            ajax.delete('lookup/remove', { lookupId: lookupId }, callback, cErr); 
        },

        rule: function (ruleId, callback, cErr) {
            ajax.delete('rule/remove', { ruleId: ruleId }, callback, cErr);
        },

        client: {
            template: function (templateId, callback, cErr) {
                ajax.delete('template/remove', { templateId: templateId }, callback, cErr);
            }
        }
    }
}

ajax.mapping = {

    connectcross: function (data, callback, cErr) {
        ajax.req.call('connectcross', data, callback, cErr);
    },

    connectMappingCategories: function (data, callback, cErr) {
        ajax.req.call('connectMappingCategories', data, callback, cErr);
    },

    get: {
        unmapped: function (list, callback, cErr) {
            ajax.post('cmdb_categories/get/unmapped', { list: list }, callback, cErr);
        }
    },

    export: {
        cross: function (data, callback, cErr) {
            ajax.req.call('export/mapping', { params: data }, callback, cErr);
        },

        lookup: function (name, callback, cErr) {
            ajax.req.call('export/cmdb_categories/lookup', { name: name }, callback, cErr);
        },

        manageList: function (callback, cErr) {
            ajax.req.call('export/cmdb_categories/manageList', null, callback, cErr);
        }
    },

    set: {
        attributes: function (data, callback, cErr) {
            ajax.post('mapping/attributes', data, callback, cErr);
        }
    },

    clear: {
        override: function (data, callback, cErr) {
            ajax.post('mapping/attributes/clear/override', data, callback, cErr);
        }
    },

    remove: {
        category: function (categoryId, callback, cErr) {
            ajax.delete('mapping/category', { categoryId: categoryId}, callback, cErr); 
        }
    }
}


ajax.clients = {
    set: function (data, callback, cErr) {
        ajax.put('clients/set', data, callback, cErr);
    },

    remove: function (data, callback, cErr) {
        ajax.delete('clients/remove', { id: data }, callback, cErr);
    }
}

ajax.labels = {
    connect: function (data, callback, cErr) {
        ajax.req.call('connectlabel', data, callback, cErr);
    },

    auto: {
        set: function (data, callback, cErr) {
            ajax.post('autolabels/set', data, callback, cErr);
        },

        connect: function (data, callback, cErr) {
            ajax.req.call('schedule.label', data, callback, cErr);
        },

        remove: function (data, callback, cErr) {
            ajax.delete('autolabel/remove', { id: data }, callback, cErr);
        },
    },
}

ajax.req = {
    call: function (path, data, callback, cErr) {
        ajax.post(path, data, callback, cErr, { port: 'web', nonapi: true });
    }
}

ajax.ftp = {
    add: function (data, callback, cErr) {
        ajax.post('ftp/add', data, callback, cErr);
    },

    edit: function (data, callback, cErr) {
        ajax.post('ftp/edit', data, callback, cErr);
    },

    remove: function (data, callback, cErr) {
        ajax.delete('ftp/remove', { id: data }, callback, cErr);
    },

    connect: function (data, callback, cErr) {
        ajax.req.call('schedule.ftp', data, callback, cErr);
    },
}


ajax.gridview = {
    set: function (data, callback, cErr) {
        ajax.post('gridviews/set', data, callback, cErr);
    },

    remove: function (data, callback, cErr) {
        ajax.delete('gridviews/remove', { id: data }, callback, cErr);
    },
}






ajax.get = function (path, item, callback, cErr) {
    ajax.call('GET', path, item, callback, cErr);
}

ajax.login = function (path, item, callback, cErr) {
    ajax.call('POST', path + '/login', item, callback, cErr);
}

ajax.check = function (path, item, callback, cErr) {
    ajax.call('GET', path + '/check', item, callback, cErr);
}

ajax.post = function (path, item, callback, cErr, params) {
    ajax.call('POST', path, item, callback, cErr, params);
}

ajax.put = function (path, item, callback, cErr) {
    ajax.call('PUT', path, item, callback, cErr);
}

ajax.delete = function (path, item, callback, cErr) {
    ajax.call('DELETE', path, item, callback, cErr);
}

ajax.calls = [];

ajax.call = function (method, path, datax, callback, cErr, params) {
    /*
        create an ajax call to WEB or API
    */
    var params = params ? params : {};

    var callPath = path;

    if (ajax.calls.find((m) => { return m == callPath })) { return; }

    var action = $('[ajax-on="{0}"]'.format(callPath));

    if (action.length) {
        action.addClass('on').removeAttr('error').removeAttr('ok');
    } else {
        if (!params.noloader) {
            $('ajaxloader').addClass('on');
        }
    }
    
    ajax.calls.push(callPath);

    ajax.is.on = true;
    var params = params ? params : {};
    var datax = datax ? datax : {};

    if (!params.nonapi) {
        path = 'api/' + path;
    }


    var d = {}
    if (typeof (datax) != 'string' && datax.length) {
        d.list = datax;
        datax = d;
    }


    var token = getCookie('eManage-access-token');

    if (method == "GET") {
        var prefix = "?";

        if (typeof datax == 'undefined') {
            datax = '';
        }

        if (typeof datax == "object") {
            datax = JSON.toQuery(datax);
        }

        if (datax.indexOf('?') == -1) {
            prefix = '&';
        }

        datax += prefix + '&token={0}'.format(token);
    } else {
        datax.token = token;
    }

    var port = params.port == "web" ? data.res.config.web.url : data.res.config.api.url;


    $.ajax({
        url: '{0}/{1}'.format(port, path),
        type: method,
        headers: {},
        data: method == "GET" ? datax : params.port == "web" ? JSON.stringify(datax) : JSON.stringify(datax).encode(JSON.stringify(datax)),

        success: function (data) {
            if(data == -1) {
                ajax.end(callPath, 'error');

                ajax.error(data, 'Non valid form');    

                if (cErr) {
                    cErr(data);
                }

            }else{
                ajax.end(callPath, 'ok');

                if (callback) {
                    callback(data);
                }
            }
        },
        error: function (xhr, status, data) {
            ajax.end(callPath, 'error');
            
            ajax.error(data, xhr.responseJSON ? xhr.responseJSON : xhr.responseText);

            if (cErr) {
                cErr(data);
            }
        }
    });
}

ajax.end = function (path, status) {
    var action = $('[ajax-on="{0}"]'.format(path));

    if (action.length) {
        action.removeClass('on');
        action.attr(status, 'on');
    }else{
        $('ajaxloader').removeClass('on');
    }
    

    var calls = ajax.calls;
    for (let i = 0; i < calls.length; i++) {
        const call = calls[i];
        if(call == path) {
            calls.splice(i, 1);
        }
    }



    ajax.is.on = false;
}

ajax.error = function (e, text) {
    msgerr('Request Error: ' + text, e);

    $('consolelog').removeClass('on');

    console.log('**ERROR ajax: {0} || {1}'.format(e, text));
}



