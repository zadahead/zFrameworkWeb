
/*
    EXPLORE - handles all related to get json data out of a DOM content, and set DOM with values from json object
*/

var field = {
    set: function (name, value) {
        var f = $('[data-field="{0}"]'.format(name));
        $('input', f).val(value);

        return f;
    }
}

var explore = {
    forms: function (names, onok, onerr) {
        var splt = names.split(',');

        var length = splt.length;
        var index = 0;
        var errs = 0;
        var form_name = '';

        var rslt = {};

        var ok = function (fields) {
            rslt[form_name] = fields;
            index++;


            if (index == length) {
                if (errs){
                    if (onerr) {
                        onerr(rslt);
                    }
                }else{
                    onok(rslt);
                }
            }
        }

        var err = function (errors) {
            errs++;
            ok(errors);
        }

        splt.forEach(name => {
            form_name = name.trim();
            explore.form(form_name, ok, err);
        });
    },

    form: function (name, onok, onerr) {
        var form = $('[data-form="' + name + '"]');
        if (!form.length) {
            form = $(name);
        }


        var fields = $('[data-field], [data-group], [data-lazy-name]', form);
        var errors = validator.all(fields);
        if (!errors) {
            if (onok) { onok(explore.fields(fields)) }

            if (uikit.last.action.click) {
                uikit.last.action.click.removeAttr('error');
            }
        } else {
            if (onerr) {
                onerr(errors)
            }
            explore.on.error(form, errors);

            if (uikit.last.action.click) {
                uikit.last.action.click.attr('error', 'on');
            }
        }
    },

    on: {
        error: function (form, errors) {
            errors.forEach(e => {
                $('msg', e.field).html(e.msg);
            });

            core.evt.bind('explore.form', 'list_container_blur', explore.on.blur);
            core.evt.bind('explore.form', 'date_picker_select', explore.on.blur);
            core.evt.bind('explore.form', 'uploader_uploaded', explore.on.blur);
            core.evt.bind('explore.form', 'radiobtn_change', explore.on.blur);
            if (!$('input', form).attr('data-explore-bind-blur')) {
                $('input', form).attr('data-explore-bind-blur', 'on').bind('blur', explore.on.blur);
            }
        },

        blur: function (e) {
            var form = gt('[data-form]', e);
            explore.form(form);
        }
    },

    change: (wrap) => {
        return $('[data-change="true"]', wrap).length;
    },

    saved: (wrap) => {
        return $('[data-change="saved"]', wrap).length;
    },

    mark: {
        save: (name) => {
            var wrap = $('[data-form="' + name + '"]');
            $('[data-change="true"]', wrap).attr('data-change', 'saved');
        }
    },

    fields: function (fields, isInner) {
        if (!fields.attr('data-field') && !fields.attr('data-group') && !fields.attr('data-lazy-name')) {
            fields = $('[data-field], [data-group], [data-lazy-name]', fields);
        }

        var data = {};

        for (let i = 0; i < fields.length; i++) {
            const field = $(fields[i]);
            if (field.is(':hidden')) { continue; }
            
            var id = field.attr('data-field') || field.attr('data-group') || field.attr('data-lazy-name');
            var vals = explore.value(field, isInner);
            if(vals == null) { continue; } 

            var val = vals.id ? vals.id : vals;
            var text = vals.value ? vals.value : null;

            var isGroup = false;
            for (let x in data) {
                if (id == x) {
                    if (typeof data[x] == 'object' && data[x].length) {
                        data[x].push(val);

                        if (text && data[x + '_value']) {
                            data[x + '_value'].push(text);
                        }
                    } else {
                        var v = data[x];
                        data[x] = [v, val];

                        if (text && data[x + '_value']) {
                            data[x + '_value'] = [v, text]
                        }
                    }
                    isGroup = true;
                    break;
                }
            }

            if (!isGroup) {
                if (field.attr('data-group')) {
                    data[id] = [val];


                    if (text) {
                        data[id + '_value'] = [text]
                    }
                } else {
                    data[id] = val;

                    if (text) {
                        data[id + '_value'] = text;
                    }
                }
            }
        }

        return data;
    },


    value: function (elem, isInner) {
        elem = $(elem);

        if (!isInner && elem.parents('[data-group], [data-lazy-name]').length) {
            return null;
        }
        else if (elem.attr('data-lazy-name')) {
            var name = elem.attr('data-lazy-name');
            return uikit.lazy.get.list(name);
        }
        else if(elem.attr('data-group')) {
            return explore.inners(elem);
        }
        else if (elem.attr("data-id")) {
            if (elem.attr("data-id") != "-1") {
                return { id: elem.attr("data-id"), value: elem.attr("data-value") };
            } else {
                return elem.attr('data-id');
            }
        } else if (elem.attr("data-value")) {
            return elem.attr("data-value");
        } else if (elem[0].value != undefined) {
            return elem[0].value;
        } else if (elem.is("input") || elem.is("textarea")) {
            return elem.val();
        } else if ($('input', elem).length && !$(elem).hasClass('on-tracker')) {
            return $('input', elem).val().replace(/\"/gi, '”');
        } else if ($('textarea', elem).length && !$(elem).hasClass('on-tracker')) {
            var val = elem[0].nodeName.toLowerCase() == 'zeditor' ? $('textarea', elem).val() : $('textarea', elem).val().replace(/\"/gi, '”'); 
            return val;
        } else {
            return '';
        }
    },

    inners: function (elem) {
        var fields = $('[data-field]', elem);


        var res = {}
        fields.each((i, el) => {
            var val = explore.value(el, true);
            var field = $(el).attr('data-field');

            res[field] = val;
        })

        return res;
    }
}

