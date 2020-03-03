var rules_opt = {
    list: {
        headers: [],
        lookups: [],
        rules: [],
    },
    validate: {

        brl: { //$headerName
            struct: /\^([a-z0-9\_]+)/,
            strict: /\^([a-z0-9\_]+)/,

            map: ['^'],

            tag: 'brl',

            trim: true
        },

        hdr: { //$headerName
            struct: /\$([a-z0-9\_]+)/,
            strict: /\$([a-z0-9\_]+)/,

            map: ['$'],

            tag: 'hdr',

            trim: true
        },

        sys: { //$headerName
            struct: /\*([a-zA-Z]+\*)/,
            strict: /\*([a-zA-Z]+\*)/,

            map: ['*'],

            tag: 'sys',

            trim: true
        },

        lkup: { //$headerName
            struct: /\#([a-z0-9\_]+)/,
            strict: /\#([a-z0-9\_]+)/,

            map: ['#'],

            tag: 'lkup',

            trim: true
        },

        rule: {  //@Lookup(#lookupname, $headername)
            struct: /@(.*)\((.*)\)/,
            strict: /@([a-zA-Z]+)\(([^,]*), (.*)\)/,


            tag: 'rule',

            trim: true
        },

        join: {  //@Lookup(#lookupname, $headername)
            struct: /@(.*)\((.*)\)/,
            strict: /@JOIN\((.*)\)/,


            tag: 'rule',

            trim: true
        },

        t: {  //"free text"
            struct: /\"([^\"]*)\"/,
            strict: /\"([^\"]*)\"/,

            val: '"{0}"',
            html: '<t>"{0}"</t>',
        }


    },

    intelli: {

        '^': () => {
            var inv_rules = rules_opt.list.rules;
            var list = [];
            inv_rules.forEach(i => {
                list.push({ text: i.name, value: i.name.toLowerCase().replace(/\s/gi, '_'), anchor: 1 })
            });

            return list;
        },
        
        '$': () => {
            var inv_file_headers = rules_opt.list.headers;
            var list = [];
            inv_file_headers.forEach(i => {
                list.push({ text: i.name, value: i.name.toLowerCase().replace(/\s/gi, '_'), anchor: 1 })
            });

            return list;
        },

        '*': () => {
            var list = [];
            
            list.push({ text: 'DELETE', value: 'DELETE*', anchor: 1 })

            return list;
        },

        '@': () => {
            return [
                { text: 'Header', value: '', format: '${0}', anchor: -1, clear: true },
                { text: 'Free Text', value: '', format: '"{0}"', anchor: -2, clear: true },
                { text: 'Lookup', value: 'Lookup', format: '{0}(#, $)', anchor: ['#'] },
                { text: 'Rule', value: '', format: '^{0}', anchor: -1, clear: true },
                { text: 'IFBLANK', value: 'IFBLANK', format: '{0}($, $)', anchor: ['$'] },
                { text: 'JOIN', value: 'JOIN', format: '{0}("" , "" , "")', anchor: ['('] },
                { text: 'SELECTCASE', value: 'SELECTCASE', format: '{0}($ , "" , "")', anchor: ['$'] },
                { text: 'REPLACEWORDLIST', value: 'REPLACEWORDLIST', format: '{0}(#, $)', anchor: ['#'] },
                { text: 'REPLACE', value: 'REPLACE', format: '{0}($ , "" , "")', anchor: ['$'] },
                { text: 'PROPER', value: 'PROPER', format: '{0}($)', anchor: ['$'] },
                { text: 'GETPART', value: 'GETPART', format: '{0}($ , "" , 1)', anchor: ['$'] },
                { text: 'TOUPPER', value: 'TOUPPER', format: '{0}($)', anchor: ['$'] },
                { text: 'TOLOWER', value: 'TOLOWER', format: '{0}($)', anchor: ['$'] },
                { text: 'LEFT', value: 'LEFT', format: '{0}($, 1)', anchor: ['$'] },
                { text: 'RIGHT', value: 'RIGHT', format: '{0}($, 1)', anchor: ['$'] },
                { text: 'CONTAINS', value: 'CONTAINS', format: '{0}($ , "")', anchor: ['$'] },
                { text: 'ISBLANK', value: 'ISBLANK', format: '{0}($)', anchor: ['$'] },
                { text: 'NOT', value: 'NOT', format: '{0}($)', anchor: ['$'] },
                { text: 'SKIPSKUIF', value: 'SKIPSKUIF', format: '{0}($ , $)', anchor: ['$'] },
            ]
        },

        '#': () => {
            var inv_lookups = rules_opt.list.lookups;
            var list = [];
            inv_lookups.forEach(i => {
                list.push({ text: i.name, value: i.name.toLowerCase().replace(/\s/gi, '_'), anchor: ['$'] })
            });

            return list;
        }
    }
}