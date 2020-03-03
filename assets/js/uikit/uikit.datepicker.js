uikit.datepicker = {
    init: function (elem) {

        var date = elem.attr('value');

        if (date) {
            date = new DateX(date);
            var def = uikit.datepicker.to.def(date, elem);
            elem[0].value = date;
        } else {
            date = new DateX();
            var def = elem.attr('def');
            if (!def) {
                def = uikit.datepicker.to.def(date, elem);
            }
        }


        var action = $('<action trig chevron-down>{0}</action>'.format(def));
        var content = $('<content>');


        elem.append(action);
        elem.append(content);
        elem.addClass('sys_floater');

        if (elem.attr('data-validator')) {
            elem[0].validator = eval(elem.attr('data-validator'));
        }



        $(elem).each(function () {
            $.each(this.attributes, function () {
                if (this.specified) {
                    elem.attr(this.name, this.value);
                }
            });
        });

        uikit.datepicker.bind(elem);
        uikit.datepicker.set(elem, date);
    },

    bind: function (wrap) {
        var content = $('content', wrap);
        var action = $('[trig]', wrap);

        uikit.bind.click($('weekdays div:not([headers])', content), uikit.datepicker.fill);

        uikit.bind.click($('icon', content), function (e) {
            var wrap = gt('datepicker', e);
            var content = gt('content', e);
            var date = wrap[0].value ? wrap[0].value : new Date();


            var icon = gt('icon', e);


            if (icon.parents('month').length) {
                if (icon.attr('arrow-left2') == '') {
                    date.setMonth(date.getMonth() - 1);
                } else {
                    date.setMonth(date.getMonth() + 1);
                }
            } else if (icon.parents('year').length) {
                if (icon.attr('arrow-left2') == '') {
                    date.setYear(date.getFullYear() - 1);
                } else {
                    date.setYear(date.getFullYear() + 1);
                }
            }

            setTimeout(() => {
                uikit.datepicker.set(wrap, date, true);
            }, 50);
        });

        uikit.bind.click(action, function (e) {
            var wrap = gt('datepicker', e);
            var dp = gt('div.selected', wrap);

            var date = dp.length ? dp[0].date : new Date();

            if ($(wrap).hasClass('open')) {
                $(wrap).removeClass('open');
            } else {
                $('datepicker').removeClass('open');
                $(wrap).addClass('open');

                uikit.datepicker.fill(e);

                uikit.datepicker.set(wrap, date);

                core.evt.shout('date_picker_open', e);
            }
        });
    },

    fill: function (e) {
        var wrap = gt('datepicker', e);
        var dp = gt('div', e);

        if (dp[0]) {
            var date = dp[0].date;

            if (date) {


                var dateStr = uikit.datepicker.to.str(date);

                wrap[0].value = date.setClock(12, 00);
                wrap[0].dateStr = dateStr;

                $('[trig] span', wrap).first().html(dateStr);

                $('weekdays div:not([headers])', wrap).removeClass('selected');
                dp.addClass('selected');

                $(wrap).removeClass('open');
            }
        }
        

    },

    to: {
        str: function (date) {
            return '{0} / {1} / {2}'.format(date.getMonth() + 1, date.getDate(), date.getFullYear());
        },
        def: function (date, elem) {
            var def = elem.attr('def');
            var dateStr = uikit.datepicker.to.str(date);

            if (def) {
                def = '{0} ({1})'.format(def, dateStr);
            } else {
                def = '{0}'.format(dateStr);
            }
            return def;
        }
    },

    set: function (wrap, date, isSetValue) {
        //set wrap 
        var content = $('content', wrap);

        content.empty();

        var dateStr = uikit.datepicker.to.str(date);

        if (isSetValue) {
            wrap[0].value = date;
            wrap[0].dateStr = dateStr;
        }




        var weekdays = getDaysInMonth(date.getMonth(), date.getFullYear());
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        var headerFormat = '<line space-between><icon arrow-left2 /><div>{0}</div><icon arrow-right2 /></line>';
        var yearTag = $('<year>');
        yearTag.append(headerFormat.format(date.getFullYear()));

        var monthTag = $('<month>');
        monthTag.append(headerFormat.format(months[date.getMonth()]));

        var line = $('<line space-between spread-even-inner margin-inner></line>');

        line.append(yearTag);
        line.append(monthTag);

        content.append(line);


        var weekdaysTag = $('<weekdays>');



        for (let i = 0; i <= 6; i++) {
            var el = $('<div header>{0}</div>'.format(days[i]));
            weekdaysTag.append(el);
        }

        var index = 0;
        var firstDay = weekdays[0].weekday;

        var dtvalidator = wrap[0].validator ? wrap[0].validator() : {};
        if (!dtvalidator) { dtvalidator = {}; }


        for (let i = 1; i <= 6; i++) {
            for (let j = 0; j <= 6; j++) {
                if (j == firstDay && !index) {
                    var el = $('<div>{0}</div>'.format(weekdays[index].day));
                    el[0].date = weekdays[index].date;


                    if (dtvalidator.max && dtvalidator.max < weekdays[index].date) {
                        el.addClass('dis');
                    }

                    if (dtvalidator.min && dtvalidator.min.yesterday() > weekdays[index].date) {
                        el.addClass('dis');
                    }

                    if (!el.hasClass('dis') && date.getDate() == weekdays[index].day) {
                        el.addClass('selected');
                    }

                    weekdaysTag.append(el);

                    index++;
                } else {
                    var val = index && weekdays[index] ? weekdays[index].day : '';
                    var el = $('<div>{0}</div>'.format(val));

                    if (index && weekdays[index]) {
                        el[0].date = weekdays[index].date;


                        if (dtvalidator.max && dtvalidator.max < weekdays[index].date) {
                            el.addClass('dis');
                        }

                        if (dtvalidator.min && dtvalidator.min.yesterday() > weekdays[index].date) {
                            el.addClass('dis');
                        }

                        if (!el.hasClass('dis') && date.getDate() == weekdays[index].day) {
                            el.addClass('selected');
                        }

                        index++;
                    }

                    weekdaysTag.append(el);
                }
            }
        }





        content.append(weekdaysTag);

        uikit.datepicker.bind(wrap);

        uikit.set.all();
    }
}