var uikit = uikit ? uikit : {}

uikit.filter = {
    init: (elem) => {

        //bind fields
        var fields = elem.attr('fields');
        elem[0].list = {
            fields: fields ? eval(fields)() : []
        }


        //bind fields
        var conds = elem.attr('conds');
        if (!elem[0].conds) {
            elem[0].conds = conds ? eval(conds)() : null;

            if (!conds) {
                conds = { cond: {} }
                elem[0].conds = conds;
            }
        }
        conds = elem[0].conds;
        

        /*
        var filter = {
            flag: '&&',
            sections: [
                {
                    grp: {
                        flag: '||',
                        sections: [
                            { cond: { f: 'ProductName', c: 'startsWith', v: 'mo' } },
                            { cond: { f: 'Color', c: 'contains', v: 'red' } }
                        ]
                    }
                },
                { cond: { f: 'Price', c: '<', v: '50' } }
            ]
        }
        */


        var addCond = (conds) => {
            var sectionTag = $('<section>');
            sectionTag.append(uikit.filter.get.cond(elem, conds))
            elem.append(sectionTag);
        }

        if (conds.flag) {
            if(!conds.sections.length) {
                addCond({});
            } else if (conds.sections.length == 1) {
                addCond(conds.sections[0].cond);
            } else{
                elem.append(uikit.filter.get.grp(elem, conds));
            }
        }

        if (conds.cond) {
            addCond(conds.cond);
        }

        
        uikit.set.all();

    },

    explore: {
        call: (wrap) => {
            var headersList = wrap[0].list.fields;

            var filt = {};
            filt = uikit.filter.explore.children(wrap.children(), filt, headersList);
            return filt;
        },

        children: (children, filt, headersList) => {

            children.each((i, t) => {
                var node = $(t)[0].nodeName.toLowerCase();

                switch (node) {
                    case 'grp':
                        var newfilt = {
                            flag: $('[data-flag].selected', $(t)).attr('data-flag'),
                            sections: []
                        }
                        if (filt.sections) {
                            filt.sections.push(newfilt);
                        } else {
                            filt = newfilt;
                        }
                        uikit.filter.explore.children($(' > section', $(t)).children(), newfilt, headersList)
                        break;
                    case 'section':
                        filt = uikit.filter.explore.children($(t).children(), filt, headersList);
                        break;
                    case 'cond':
                        var c = uikit.filter.explore.cond($(t), headersList);
                        if(filt.sections) {
                            filt.sections.push(c);
                        } else{
                            filt = c;
                        }
                        break;
                    default:
                        break;
                }
            })

            return filt;
        },

        cond: (cond, headersList) => {
            var f = explore.fields(cond);

            headersList.forEach(header => {
                if(f.f == header.id) {
                    f.type = header.type; 
                    f.filterPrefix = header.filterPrefix; 
                }
            });

            return {
                cond: f
            }
        }
    },

    list: {
        conds: () => {
            var list = [];
            list.push({ id: '==', value: '==' });
            list.push({ id: '>=', value: '>=' });
            list.push({ id: '<=', value: '<=' });
            list.push({ id: '>', value: '>' });
            list.push({ id: '<', value: '<' });
            list.push({ id: 'contains', value: 'Contains' });
            list.push({ id: 'startsWith', value: 'Starts With' });
            list.push({ id: 'endsWith', value: 'Ends With' });

            return list;
        }
    },

    get: {
        data: (wrap) => {
            return uikit.filter.explore.call(wrap);
        },

        dataText: {
            call: (wrap) => {
                var filt = uikit.filter.explore.call(wrap);

                var val = uikit.filter.get.dataText.explore(filt);
                return '[ {0} ]'.format(val);
            },

            explore: (filt) => {
                var buffer = [];
                for (var x in filt) {
                    switch (x) {
                        case 'cond':
                            buffer.push(uikit.filter.get.dataText.cond(filt[x]));
                            break;
                        case 'flag':
                            var f = filt[x];
                            var sections = filt.sections;
                            var index = 1;
                            sections.forEach(element => {
                                buffer.push('({0})'.format(uikit.filter.get.dataText.explore(element)));   

                                if(index < sections.length) {
                                    buffer.push(f == '&&' ? ' AND ' : ' OR ');
                                    index++;
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }

                return buffer.join('');
            },

            cond: (cond) => {
                return '{0} {1} "{2}"'.format(cond.f, cond.c, cond.v);
            },
        },

        grp: (wrap, params) => {
            
            /*
                    <grp>
                        <flag>
                            <div>AND</div>
                            <div class="selected">OR</div>
                        </flag>
                       <section></section>
                        <info>OR</info>
                        <section></section>
                        <tools>
                            <action type-link>+Add Cond</action>
                        </tools>
                    </grp>
            */

            var params = params ? params : {};

            if (!params.flag) { params.flag = '&&'; }

            if (!params.sections.length) { return '<span>'; }
            if (params.sections.length == 1) { return uikit.filter.get.cond(wrap, params.sections[0]); }

            var grp = $('<grp>');

            //set flag
            var flag = $('<flag>');
            flag.append('<div data-flag="{0}">{1}</div>'.format('&&', 'AND'));
            flag.append('<div data-flag="{0}">{1}</div>'.format('||', 'OR'));

            $('[data-flag="{0}"]'.format(params.flag), flag).addClass('selected');
            uikit.bind.click($('[data-flag]', flag), uikit.filter.on.flag);

            //append to grp
            grp.append(flag);


            //append sections to grp
            params.sections.forEach(prm => {
                var sectionTag = $('<section>');

                if (prm.flag) {
                    sectionTag.append(uikit.filter.get.grp(wrap, prm));
                }

                if (prm.cond) {
                    sectionTag.append(uikit.filter.get.cond(wrap, prm.cond));
                }

                grp.append(sectionTag);
                grp.append('<info>{0}</info>'.format($('[data-flag].selected', flag).html()));

                //{ grp: [ { cond: { f: 'Price', c: '>', v: '70' } } ] }
                //{ cond: { f: 'Price', c: '>', v: '70' } }
            });

            //remove last info cos its not needed in UI
            $('info', grp).last().remove();




            //draw tools 
            var tools = $('<tools>');
            tools.append('<action type-link data-action="uikit.filter.on.cond">+Add Cond</action>');

            //add tools 
            grp.append(tools);


            return grp;
        },

        cond: (wrap, params) => {
            /*
                    <cond>
                        <opr>
                            <list_container list="filter.list.headers" onchange="filter.on.change">
                                <div>Field</div>
                            </list_container>
                            <list_container list="filter.list.conds" onchange="filter.on.change">
                                <div>==</div>
                            </list_container>
                            <div>
                                <inpt value="" placeholder="..."></inpt>
                            </div>
                        </opr>
                        <tools>
                            <action type-link>+Add Group</action>
                            <icon bin></icon>
                        </tools>
                    </cond>
            */

            var list = wrap[0].list;
            var params = params ? params : {};

            if (!params.f) { params.f = 'Field'; }
            if (!params.c) { params.c = '=='; }
            if (!params.v) { params.v = ''; }

            var cond = $('<cond>');


            //draw operator
            var opr = $('<opr>');

            //set fields container
            var list_container_fields = $('<list_container>');
            list_container_fields[0].list = list.fields;
            list_container_fields.attr('onchange', 'uikit.filter.on.change');
            list_container_fields.attr('data-field', 'f');
            list_container_fields.attr('value', params.f);
            list_container_fields.append('<div>{0}</div>'.format(params.f));

            //set conds container
            var list_container_conds = $('<list_container>');
            list_container_conds[0].list = uikit.filter.list.conds;
            list_container_conds.attr('onchange', 'uikit.filter.on.change');
            list_container_conds.attr('data-field', 'c');
            list_container_conds.attr('value', params.c);
            list_container_conds.append('<div>{0}</div>'.format(params.c));

            //set value container
            var value_container = $('<div>');
            var inpt = $('<inpt value="{0}" placeholder="..."></inpt>'.format(params.v))
            inpt.attr('data-field', 'v');
            value_container.append(inpt);



            //append cotainers to opr
            opr.append(list_container_fields);
            opr.append(list_container_conds);
            opr.append(value_container);



            //draw tools
            var tools = $('<tools>');
            tools.append('<action type-link data-action="uikit.filter.on.group">AND / OR</action>');
            tools.append('<icon bin data-action="uikit.filter.on.remove"></icon>');


            //appern all to cond wrap 
            cond.append(opr);
            cond.append(tools);

            return cond;
        }
    },

    on: {
        change: (a, b) => {
            var cont = b.parents('list_container');

            $('trig div', cont).html(a);
        },

        remove: (e) => {
            var wrap = gt('filter', e);
            if($('cond', wrap).length == 1) { return; }

            uikit.filter.reload(e, () => {
                gt('section', e).remove();
            });
        },

        flag: (e) => {
            var flagTag = gt('flag', e);
            var flag = gt('[data-flag]', e).attr('data-flag');

            $('.selected', flagTag).removeClass('selected');

            $('[data-flag="{0}"]'.format(flag), flagTag).addClass('selected');

            uikit.filter.reload(e);
        },

        group: (e) => {
            var wrap = gt('filter', e);
            var section = gt('section', e);
            var cond = gt('cond', e);
            var headersList = wrap[0].list.fields;
           

            uikit.filter.reload(e, () => {
                var c = uikit.filter.explore.cond(cond, headersList);

                section.empty();

                section.append(uikit.filter.get.grp(wrap, {
                    flag: '&&',
                    sections: [
                        c,
                        { cond: {} }
                    ]
                }));
            });
        },

        cond: (e) => {
            var wrap = gt('filter', e);
            var grp = gt('grp', e);


            var sectionTag = $('<section>');

            sectionTag.append(uikit.filter.get.cond(wrap));

            
            uikit.filter.reload(e, ()=> {
                $(' > section', grp).last().after(sectionTag);
            })
            
        }
    },

    reload: (self, precond) => {
        setTimeout(() => {
            var wrap = gt('filter', self);

            if (precond) {
                precond();
            }

            uikit.set.all();

            var filt = uikit.filter.explore.call(wrap);
            
            wrap[0].conds = filt;

            wrap.empty();
            uikit.filter.init(wrap);
        }, 10);
    }

}