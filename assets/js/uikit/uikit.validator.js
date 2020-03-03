
/*
    EXPLORE - handles all related to get json data out of a DOM content, and set DOM with values from json object
*/

var validator = {
    MSG: {
        EMAIL: 'Email is invalid',
        DOMAIN: 'Domain is invalid',
        PHONE: 'Phone number is invalid',
        EMPTY: 'This field cannot be empty',
    },

    all: function (fields) {
        var nonValid = [];

        var fieldsObj = explore.fields(fields);

        for (let i = 0; i < fields.length; i++) {
            var field = $(fields[i]);
            if (field.is(':hidden')) { continue; }
            
            if (!field.attr('data-validate') && !field.attr('data-validate-callback')) { continue; }

            field.removeClass('non-valid');

            if (field.attr('data-validate')) {
                var list = field.attr('data-validate').split(',');


                for (let j = 0; j < list.length; j++) {
                    var val = list[j].trim();
                    var v = explore.value(field, true);
                    v = v.id ? v.id : v.value ? v.value : v;

                    var isNonValid = validator.set(validator[val](v), field, validator.MSG[val.toUpperCase()]);
                    if (isNonValid) {
                        nonValid.push(isNonValid);
                    }
                }
            }

            if ($('[data-tracker].non-valid', field).length) {
                var m = $('[data-tracker].non-valid').attr('data-titler');
                nonValid.push(validator.set(false, field, m));
            }

            if(field[0].nonValid) {
                nonValid.push(validator.set(false, field, field[0].nonValid));
            }


            if (field.attr('data-validate-callback')) {
                var list = field.attr('data-validate-callback').split(',');

                try {
                    for (let j = 0; j < list.length; j++) {
                        var evt = list[j].trim();

                        var isNonValid = eval(evt)(field, fieldsObj);
                        if (isNonValid) {
                            nonValid.push(validator.set(false, field, isNonValid));
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }


        }

        if (nonValid.length) {
            return nonValid;
        } else {
            return null;
        }
    },

    set: function (state, elem, msg) {
        if (!state) {
            elem.addClass('non-valid');

            return {
                field: elem[0],
                $field: elem,
                msg: msg
            };
        }
        return null;
    },

    get: function (state, elem, msg) {
        if (!state) {
            elem.addClass('non-valid');
            elem[0].msg.push(msg);

            return 1;
        }
        return 0;
    },


    email: function (email) {
        var re = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return re.test(String(email).toLowerCase());
    },

    domain: function (v, opts) {
        if (typeof v !== 'string') return false
        if (!(opts instanceof Object)) opts = {}

        var parts = v.split('.')
        if (parts.length != 2) { //prevent sub domain;
            if (parts.length == 3 && v.indexOfArr('.co.')) {
                //valid .co.il domain
            } else {
                return false; 
            }
        }
        

        if (v.startsWith('http:') || v.startsWith('https:')) return false; //prevent http:// ,  https://

        if (v.startsWith('www.')) return false; //www

        var tld = parts.pop()
        var tldRegex = /^(?:xn--)?[a-zA-Z0-9]+$/gi

        if (!tldRegex.test(tld)) return false
        if (opts.subdomain == false && parts.length > 1) return false

        var isValid = parts.every(function (host, index) {
            if (opts.wildcard && index === 0 && host === '*' && parts.length > 1) return true

            var hostRegex = /^(?!:\/\/)([a-zA-Z0-9]+|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])$/gi;

            return hostRegex.test(host)
        })

        return isValid;
    },

    phone: function (phone) {
        var phoneRe = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
        var digits = phone.replace(/\D/g, "");
        return phoneRe.test(digits);
    },

    empty: function (value) {
        if (typeof (value) == 'object') {
            return JSON.stringify(value) != '{}';
        } else{
            return (value.trim() != "") && (value != "-1");
        }
    }
}
