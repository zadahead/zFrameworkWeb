var uikit = uikit ? uikit : {};

uikit.zeditor = {
    timerFocus: null,
    timerTag: null,

    proc: {
        reg: null
    },

    init: function (elem) {

        //set input
        var input = $('<textarea>');
        input.bind('keydown', uikit.zeditor.set.html);
        input.bind('focus', (e) => {
            gt('zeditor', e).addClass('focused');
            uikit.zeditor.set.html(e);
        });

        input.bind('mouseup', (e) => {
            uikit.zeditor.set.html(e);
        });

        input.bind('mousemove', (e) => {
            
        });

        input.bind('blur', (e) => {
            uikit.zeditor.set.html(e);
        });
        input.bind('keyup', uikit.zeditor.set.html);
        input.attr('autocorrect', 'off');
        input.attr('autocapitalize', 'off');
        input.attr('spellcheck', 'false');
        

        //set board
        var board = $('<board>');
        board.bind('mouseup', uikit.zeditor.focus);
        board.bind('dblclick', uikit.zeditor.focus);


        //set caret / range
        var caret = $('<caret class="blink">&nbsp</caret>');
        var range = $('<range>&nbsp</range>');

        //set first value
        var value = elem.attr('value');
        if(value.trim() == '') { value = null; }
        if (value) {
            value = value.replace(/\'/gi, '"');
        }
        


        board.html(value ? value : '&nbsp;');
        input.val(value ? $(board).text() : ' ');


        elem.attr('data-validate-callback', 'uikit.zeditor.validate');

        //append
        elem.append(input);
        elem.append(board);

        elem.append(caret);
        elem.append(range);

        elem.append('<msg></msg>');


        //bind
        uikit.bind.change(input);

        //mark onload 
        uikit.zeditor.onload(elem);
    },

    onload: (wrap) => {
        var e = { target: wrap };

        
        //set intellisense
        uikit.zeditor.intelli(wrap);
       
        //set html
        uikit.zeditor.set.html(e);

        //set validator
        uikit.zeditor.validate(wrap); 
    },

    update: (wraps) => {
        if(!wraps)  { wraps = $('zeditor'); }
        
        wraps.each((i, t) => {
            var value = $(t).attr('value');
            $('textarea', $(t)).val(value);
            uikit.zeditor.onload($(t)); 
        })
    },

    intelli: (wrap) => {
        var intelli = wrap.attr('intelli');
        if (intelli) {
            wrap[0].intelli = eval(intelli);

            $('intelli', wrap).remove();

            var intelliTag = $('<intelli>');
            wrap.append(intelliTag);
        }
    },

    validate: (wrap) => {
        var validate = wrap.attr('validate');
        if (validate) {
            wrap[0].validate = eval(validate);
        }
    },

    reload: () => {
        $('zeditor').each((i, t) => {
            uikit.zeditor.onload($(t));
        })
    },

    blur: (e) => {
        var wrap = uikit.zeditor.get.wrap(e);

        var input = uikit.zeditor.get.input(e);

        if (input.val() == '') {
            input.val(' ');

            var board = uikit.zeditor.get.board(e);
            board.html('&nbsp;');
        }

        wrap.removeClass('intelli_on');

        gt('zeditor', e).removeClass('focused').removeClass('ranged');
    },

    focus: (e) => {
        clearTimeout(uikit.zeditor.timerFocus);

        var timer = e.type == 'mouseup' ? 1 : 150;

        uikit.zeditor.timerFocus = setTimeout(() => {
            var range = uikit.zeditor.get.html.range(e);

            var input = $('textarea', gt('zeditor', e));

            input[0].setSelectionRange(range.start, range.end);

            input.focus();

        }, timer);
    },

    push: {
        tags: (arr, item) => {

            var wrapper = null;

            if (!arr.length) {
                arr.push(item);
            } else {
                var jump = 0;
                arr.forEach(i => {
                    if(item.name == i.name && i.start >= item.start && i.end <= item.end) {
                        i.start = item.start < i.start ? item.start : i.start;
                        i.end = item.end > i.end ? item.end : i.end;
                        wrapper = i;
                    } else if (item.start > i.start &&
                        item.start < i.end) {
                        jump = item.end - item.start;
                        i.end += jump;
                        arr.push(item);
                        wrapper = i;
                    }
                });

                if (!wrapper) {
                    arr.push(item);
                }else{
                    arr.forEach(i => {
                        if (i.start > wrapper.end) {
                            i.start += jump;
                            i.end += jump;
                        }
                    });
                }
            }

            return wrapper;
            
        },

        isWrapper: (arr, item) => {
            var wrapper = null;

            if (!arr.length) {
                return false;
            } else {
                
                arr.forEach(i => {
                    if (item.start > i.start &&
                        item.start < i.end) {
                        wrapper = i;
                    }
                });
            }

            return wrapper;

        }
    },

    handle: {
        erase: (e, range, caret) => {
            return;

            if ((e.keyCode == 8 || e.keyCode == 46) && e.type == 'keydown') {
                var l = caret.end - caret.start + 1;

                range.forEach(i => {
                    if(i.start > caret.start) {
                        i.start -= l;
                        i.end -= l;
                    } else if(i.end > caret.start) {
                        i.end -= l;
                    }
                });
            }
        },

        arrowdown: (e) => {
            if (e.keyCode == 40 && e.type == 'keydown') {
                var wrap = uikit.zeditor.get.wrap(e);

                if (wrap.hasClass('intelli_on')) {
                    var length = $('intelli row', wrap).length;

                    if (length > 1) {
                        e.preventDefault();
                    }

                    var curr = $('intelli row.selected', wrap);
                    $('intelli row', wrap).removeClass('selected');

                    var next = curr.next();
                    if (next.length) {
                        next.addClass('selected');
                    } else {
                        curr.addClass('selected');

                        if (length == 1) {
                            wrap.removeClass('intelli_on');
                        }
                    }

                    $('intelli', wrap).scrollTo($('intelli row.selected', wrap));
                }
            }
        },

        arrowup: (e) => {
            if (e.keyCode == 38 && e.type == 'keydown') {
                var wrap = uikit.zeditor.get.wrap(e);

                if (wrap.hasClass('intelli_on')) {
                    var length = $('intelli row', wrap).length;

                    if (length > 1) {
                        e.preventDefault();
                    }

                    var curr = $('intelli row.selected', wrap);
                    $('intelli row', wrap).removeClass('selected');

                    var prev = curr.prev();
                    if (prev.length) {
                        prev.addClass('selected');
                    } else {
                        curr.addClass('selected');

                        if (length == 1) {
                            wrap.removeClass('intelli_on');
                        }
                    }

                    $('intelli', wrap).scrollTo($('intelli row.selected', wrap));
                }
            }
        },

        intelliRowClick: (e) => {
            var intelli = gt('intelli', e);
            $('.selected', intelli).removeClass('selected');
            gt('row', e).addClass('selected');

            var wrap = uikit.zeditor.get.wrap(e);
            var input = uikit.zeditor.get.input(e);
            
            var intelli = wrap[0].intelli; //intelli_on
            var caret = uikit.zeditor.get.caret.pos(input[0]);

            uikit.zeditor.handle.enter(e, true, caret, intelli);

            setTimeout(() => {
                input.focus();
            }, 1);
        },

        enter: (e, isForce, caret, intelli) => {
            var wrap = uikit.zeditor.get.wrap(e);

            if ((e.keyCode == KEY.ENTER)) {
                e.preventDefault();
            }

            if (e.keyCode == KEY.TAB && wrap.hasClass('intelli_on')) {
                e.preventDefault();
            }
            
            var isIntelliSet = false;

            if (isForce || ((e.keyCode == KEY.ENTER || e.keyCode == KEY.TAB) && e.type == 'keyup')) {
                
                var input = uikit.zeditor.get.input(e);
                var val = input.val();

                if (wrap.hasClass('intelli_on')) {
                    var selected = $('intelli row.selected', wrap);
                    if (!selected.length) {
                        return {
                            caret: caret,
                            isIntelliSet: false
                        }
                    }
                    
                    var data = selected[0].data;

                    var selectedValue = data.value;
                    var format = data.format;
                    var anchor = data.anchor;
                    var clear = data.clear;
                    var newVal = '';

                    for (var x in intelli) {
                        var reg = new RegExp('\\{0}[a-zA-Z0-9]*'.format(x), 'gi');

                        val = val.replace(reg, (tag, index, text) => {
                            if (caret >= index && caret <= index + tag.length) {
                                newVal = (clear ? '' : x) + selectedValue;
                                if (format) {
                                    newVal = format.format(newVal);
                                }

                                newVal += ' ';
                                caret += newVal.length - tag.length;



                                //var newRange = { start: caret - newVal.length, end: caret - 1, name: tagName }


                                //uikit.zeditor.push.tags(range.tags, newRange);

                                wrap.removeClass('intelli_on');

                                return newVal.trim();
                            }
                            return tag;
                        });

                        input.val(val);
                    }

                    if (newVal != '' && anchor) {
                        if(!isNaN(anchor)) {
                            caret += anchor;
                        } else{
                            caret = caret - newVal.length;

                            var isAnchor = false;
                            for (let i = caret + 1; i < val.length; i++) {
                                var char = val.charAt(i);
                                if (char.indexOfArr(anchor)) {
                                    caret = i + 1;
                                    isAnchor = true;
                                    break;
                                }
                            }

                            if (!isAnchor) {
                                caret += newVal.length;
                            }
                        }
                       
                        
                        input[0].setSelectionRange(caret, caret);
                        isIntelliSet = true;
                    }
                }
            }

            return {
                caret: caret,
                isIntelliSet: isIntelliSet
            };
        },

        intelli: (e, caret, intelli, isIntelliSet) => {

            if (e.type != 'blur' && e.keyCode != 38 && e.keyCode != 40 && ((e.keyCode != KEY.ENTER && e.keyCode != KEY.TAB) || isIntelliSet)) {
                if (intelli) {
                    var wrap = uikit.zeditor.get.wrap(e);
                    var input = uikit.zeditor.get.input(e);
                    var val = input.val();

                    var isIntelli = false;
                    for (var x in intelli) {
                        var reg = new RegExp('\\{0}[a-zA-Z0-9]*'.format(x), 'gi');

                        val.replace(reg, (tag, index, text) => {
                            if (caret >= index && caret <= index + tag.length) {
                                var t = tag.replace(x, '');

                                wrap.addClass('intelli_on');
                                var list = intelli[x]();

                                $('intelli', wrap).empty();

                                list.forEach(row => {
                                    if (new RegExp(t, 'gi').test(row.value)) {
                                        var text = row.text.replace(new RegExp('(' + t + ')', 'gi'), '<b>$1</b>');
                                        var rTag = $('<row>{0}</row>'.format(text));

                                        rTag[0].data = row;

                                        $('intelli', wrap).append(rTag);
                                    }
                                });
                                $('intelli row', wrap).first().addClass('selected');
                                isIntelli = true;
                                
                            }
                        });
                    }

                    if (!isIntelli) {
                        wrap.removeClass('intelli_on');
                    }


                    var c = $('caret', wrap)[0];

                    var left = c.offsetLeft;
                    var top = c.offsetTop + $(c).height();
                    $('intelli', wrap).css('left', left + 'px').css('top', top + 'px');

                    uikit.bind.mousedown($('intelli row', wrap), uikit.zeditor.handle.intelliRowClick);

                }


            }

        },

        validate: (e) => {

            var wrap = uikit.zeditor.get.wrap(e);

            var validate = wrap[0].validate;

            if (validate) {    
                
                var board = uikit.zeditor.get.board(e);
                var input = uikit.zeditor.get.input(e);
                var val = input.val();

                if (val != ' ') {
                    var c = uikit.zeditor.handle._validate(wrap, validate, val);
                    if (c.err) {
                        wrap.addClass('non-valid');
                    }
                    else {
                        wrap.removeClass('non-valid');

                        if (!wrap[0].validated) {
                            input.val(c.val);
                            board.html(c.html);    
                            wrap[0].validated = true;
                            input.focus();
                        }

                        
                    }
                }

                
            }

        },

        drawCaretRange: (e) => {
            var wrap = uikit.zeditor.get.wrap(e);
            var board = uikit.zeditor.get.board(e);
            var input = uikit.zeditor.get.input(e);
            var caret = uikit.zeditor.get.caret.pos(input[0]);
            var range = uikit.zeditor.get.range(input[0]);

            var val = input.val();


            input.css('width', board.width() + 'px').css('height', board.height() + 'px')
            //add range
            if (range.start != range.end) {
                val = val.substring(0, range.start) + '«' + val.substring(range.start, range.end - 1) + '»' + val.substring(range.end, val.length);
                wrap.addClass('ranged');
            }else {
                wrap.removeClass('ranged');
            }

            //add caret
            val = val.substring(0, caret) + '<caret>&nbsp;</caret>' + val.substring(caret, val.length);

            val = val.replace('Ç', '<caret>&nbsp;</caret>');
            val = val.replace('«', '<range>');
            val = val.replace('»', '</range>');



            board.html(val);

            var posCaret = absPos($('caret', board), wrap);
            $(' > caret', wrap).css('height', posCaret.height + 'px').css('left', posCaret.left + 'px').css('top', posCaret.top + 'px');


            var posRange = absPos($('range', board), wrap);
            if (posRange) {
                $(' > range', wrap).css('height', posRange.height + 'px').css('width', posRange.width + 'px').css('left', posRange.left + 'px').css('top', posRange.top + 'px');
            }
        },

        _validate: (wrap, regs, val) => {

            var setVal = val;      


            var isValid = true;

            for (var x in regs) {

                if (regs[x].struct.test(setVal)) { //@Lookup(#lookupname, $headername

                    if (regs[x].strict.test(setVal)) { //@Lookup(#lookupname, $headername

                        var reg = new RegExp(regs[x].strict, 'gi');

                        var m = setVal.match(reg);
                        
                        

                        var map = regs[x].map;
                        if (map && m) {

                            
                            setVal.replace(reg, (a, b, c) => {
                                for (let i = 0; i < map.length; i++) {
                                    const mp = map[i];

                                    var list = wrap[0].intelli[mp[0]]();
                                    var isExist = list.find((i) => { return i.value == b.trim(); });

                                    if (!isExist) {
                                        isValid = false;       
                                    }
                                }  
                                return a;
                            })
                        }

                        
                     


                        
                        uikit.zeditor.proc.reg = reg;
                        uikit.zeditor.proc.regData = regs[x];
                        uikit.zeditor.proc.regPrefix = x;

                        setVal = setVal.trim();

                        setVal = setVal.replace(reg, uikit.zeditor.handle.replacer);



                    }
                }
            }

            if (!isValid) {
                wrap.addClass('non-valid');
                wrap[0].nonValid = 'Data needs to be in the correct form';                
            }
            else {
                wrap.removeClass('non-valid');
                wrap[0].nonValid = false;
            }

            return {
                val: val,
                html: setVal.trim(),
                err: isValid
            }
            
        },

        replacer: function(a) {

            var reg = uikit.zeditor.proc.reg;
            var tag = uikit.zeditor.proc.regData.tag;
            if(!tag) {
                tag = uikit.zeditor.proc.regPrefix;
            }
            var repalceWidth = uikit.zeditor.proc.regData.repalceWidth;
            var onlyInner = uikit.zeditor.proc.regData.onlyInner;

            var tagReg = new RegExp('<{0}>'.format(tag));

            var isParent = false;
            var b = null;

            for (let i = 1; i < arguments.length; i++) {
                var arg = arguments[i];
                if (typeof (arg) == "number") { break; } 
                b = arg;

                if (arg.match(reg) && !arg.match(tagReg) && a != arg) {
                    a = a.replace(arg, arg.replace(reg, uikit.zeditor.handle.replacer));
                    isParent = true;
                }else{
                }
            }

            if(repalceWidth) {
                a = repalceWidth;
            }

            if (onlyInner) {
                a = b;
            }

            return !isParent ? '<{1}>{0}</{1}>'.format(a, tag) : a.replace(reg, uikit.zeditor.handle.replacer);
        },

        newtags: (e, range) => {
            if (uikit.zeditor.is.bold(e)) {
                uikit.zeditor.set.tags(range, 'b');
            }

            if (uikit.zeditor.is.underline(e)) {
                uikit.zeditor.set.tags(range, 'u');
            }
        }
    },

    set: {
        target: (target, value) => {
            $('textarea', target).val(value);
            uikit.zeditor.set.html({ target: target })
        },

        html: (e) => {
          

            if (uikit.zeditor.is.bold(e) || uikit.zeditor.is.underline(e)) {
                e.preventDefault();
            }

            var wrap = uikit.zeditor.get.wrap(e);
            var input = uikit.zeditor.get.input(e);
            var html = uikit.zeditor.get.board(e).html();

            var val = input.val();
            if (val.trim() == '') { val = ' '; html = '&nbsp;'; } //set default values


            if(e.type == 'keyup') {
                wrap[0].validated = false;
            }

            var intelli = wrap[0].intelli; //intelli_on
            var caret = uikit.zeditor.get.caret.pos(input[0]);
            var range = uikit.zeditor.get.range(input[0]);


            var res = uikit.zeditor.handle.enter(e, false, caret, intelli);
            caret = res.caret; //update the new caret porision after enter set
            val = input.val(); //update val

            //handle bold/underline and more tags
            uikit.zeditor.handle.newtags(e, range);


            

            uikit.zeditor.handle.erase(e, range.tags, range);
            uikit.zeditor.handle.arrowdown(e);
            uikit.zeditor.handle.arrowup(e);

            var isIntelliSet = res.isIntelliSet;

            //range.tags = uikit.zeditor.explore.html(html);
            var c = uikit.zeditor.handle._validate(wrap, wrap[0].validate, val);
            html = c.html ? c.html : html;

            //set caret and range
            uikit.zeditor.handle.drawCaretRange(e);

            //set and build board
            //uikit.zeditor.set.board(e, range, caret);
            uikit.zeditor.get.board(e).html(html);
           

           
            //show intellisense if needed 
            uikit.zeditor.handle.intelli(e, caret, intelli, isIntelliSet);

            

            //handle blur
            clearTimeout(uikit.zeditor.timerTag);

            uikit.zeditor.timerTag = setTimeout(() => {
               //uikit.zeditor.handle.validate(e);    
            }, 600);
            

            if (e.type == 'blur') {
                uikit.zeditor.blur(e);
            }
        },

        board: (e, range, caret) => {

            var input = uikit.zeditor.get.input(e);
            var val = input.val();

            var isActive = input[0] === document.activeElement // show if input is focused;


            //get current char clicked for higher speed fill when typing
            var special = (e.shiftKey || e.ctrlKey || e.altKey);
            var char = (e.type == 'keydown' && !special) ? String.fromCharCode(event.keyCode) : null;
            if (char && /[a-zA-Z0-9-_ ]/.test(char)) {
                char = char.toLowerCase();
            } else {
                char = null;
            }


            //set board
            var buffer = [];

            for (var i = 0; i < val.length + 1; i++) {

                if (isActive) {
                    if (i == caret) {
                        if (char) {
                            buffer.push(char);
                        }



                        buffer.push('<caret class="blink">&nbsp;</caret>');
                    }

                    if (i == range.start) {
                        buffer.push('<range>');
                    }

                    if (i == range.end) {
                        buffer.push('</range>');
                    }
                }

                range.tags.forEach(r => {
                    if (r.name.indexOf('~~dis') == -1) {
                        if (i == r.start) {
                            buffer.push('<{0}>'.format(r.name));
                        }

                        if (i == r.end + 1) {
                            buffer.push('</{0}>'.format(r.name));
                        }
                    }

                });





                if (val.charAt(i) == " ") {
                    buffer.push('&nbsp;');
                } else if (val.charAt(i) == "<") {
                    buffer.push('&lt;');
                } else if (val.charAt(i) == ">") {
                    buffer.push('&gt;');
                } else {
                    buffer.push(val.charAt(i));
                }


            }

            uikit.zeditor.get.board(e).html(buffer.join(''));
        },

        tags: (range, tname) => {

            var isInRange = false;
            range.tags.forEach(r => {
                if (r.name == tname && range.start >= r.start && range.end <= r.end) {
                    if (r.start == range.start && r.end == range.end) {
                        r.name = tname + '~~dis';
                    } else {
                        var end = r.end;
                        r.end = range.start;
                        uikit.zeditor.push.tags(range.tags, { start: range.end, end: end, name: tname });
                    }

                    isInRange = true;
                }
            });
            if (!isInRange) {
                uikit.zeditor.push.tags(range.tags, { start: range.start, end: range.end, name: tname });
            }
        }
    },

    explore: {
        html: (html) => {
            return uikit.zeditor.explore.tag(html);
        },

        reg: (reg, string) => {

            const matches = [];

            string.replace(reg, (tab, text, index) => {
                var start = index;
                var end = start + text.length;
                matches.push({ tab, text, start, end });
            });

            return matches;
        },

        tag: (val) => {

            val = val.replace('<caret class="blink">&nbsp;</caret>', '').replace(/\&nbsp\;/gi, ' ').replace(/\&gt\;/gi, '.').replace(/\&lt\;/gi, '.');
            val = val.replace('<range></range>', '');

           // console.log(val);

            var ranges = [];
            var caret = 0;

            for (var i = 0; i < val.length + 1; i++) {
                var char = val.charAt(i);

                switch (char) {
                    case '<':
                        if (val.charAt(i + 1) == '/') { //tag closure
                            while (val.charAt(i) != '>') {
                                i++;
                            }


                            for (let x = ranges.length - 1; x >= 0; x--) {
                                if (ranges[x].end == null) {
                                    ranges[x].end = caret;
                                    break;
                                }
                            }

                        } else { //tag begin
                            var range = { start: caret, end: null };
                            var tagName = [];
                            var isTagNameSet = false;
                            while (val.charAt(i) != '>') {
                                i++;
                                var c = val.charAt(i);

                                if (c == ' ' || c == '>') {
                                    isTagNameSet = true;
                                }

                                if (!isTagNameSet) {
                                    tagName.push(c);
                                }
                            }

                            range.name = tagName.join('');

                            ranges.push(range)
                        }
                        break;

                    default:
                        caret++;
                        break;
                }


            }


            //clear caret and range
            for (let i = ranges.length - 1; i >= 0; i--) {
                const r = ranges[i];
                if (r.name.indexOfArr(['caret', 'range'])) {
                    ranges.splice(i, 1);
                } else if(r.start == r.end) {
                    ranges.splice(i, 1);
                }
            }

            //sort results
            ranges.sort((a, b) => {
                if (a.name === b.name) {
                    return (a.start < b.start) ? -1 : (a.start > b.start) ? 1 : 0;
                }
                else {
                    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                }
            })


            //combine tags
            /*
            for (let i = ranges.length - 1; i >= 0; i--) {
                const r = ranges[i];
                const next = ranges[i - 1];

                if (next && next.name == r.name) {
                    var synced = uikit.zeditor.is.synced(r, next);
                    if (synced) {
                        next.start = synced.start;
                        next.end = synced.end;
                        ranges.splice(i, 1);
                    }

                }

            }
            */

           // console.log(ranges);
            return ranges;

        }
    },

    is: {
        cntrl: (e) => {
            if (e.type == 'keydown') {
                return e.ctrlKey;
            }
            return false;
        },

        shift: (e) => {
            return e.shiftKey;
        },

        alt: (e) => {
            return e.altKey;
        },

        bold: (e) => { //cntrl+b
            return (uikit.zeditor.is.cntrl(e) && e.keyCode == 66);
        },

        underline: (e) => { //contrl+u
            return (uikit.zeditor.is.cntrl(e) && e.keyCode == 85);
        },

        synced: (r1, r2) => {

            if (r2.end == r1.end && r2.start == r1.start) { return r1; }
            if ((r1.start >= r2.start && r1.end <= r2.end)) { return r1; }

            if (r2.end > r1.start) { return false; }

            var arr = {};
            for (let i = r1.start; i <= r1.end; i++) {
                arr[i] = true;
            }

            for (let i = r2.start; i <= r2.end; i++) {
                arr[i] = true;
            }

            var list = [];

            for (var x in arr) {
                list.push(parseInt(x));
            }

            list.sort((a, b) => { return a < b ? -1 : 1 });


            var isSynced = true;
            for (let i = 0; i < list.length; i++) {
                var next = list[i + 1];
                if (next) {
                    if ((next - list[i]) > 1) {
                        isSynced = false;
                        break;
                    }
                }

            }

            if (isSynced) {
                return {
                    start: list[0],
                    end: list[list.length - 1]
                }
            }
            return false;
        }
    },

    get: {
        wrap: (e) => {
            return gt('zeditor', e);
        },

        input: (e) => {
            var wrap = uikit.zeditor.get.wrap(e);
            return $('textarea', wrap);
        },

        board: (e) => {
            var wrap = uikit.zeditor.get.wrap(e);
            return $('board', wrap);
        },

        html: {
            range: (e) => {

                var board = $('board', gt('zeditor', e));

                var range = {
                    start: 0,
                    end: 0
                }

                var selObj = window.getSelection();
                if (selObj.focusNode) {
                    if (selObj.focusNode.localName == 'board' || $(selObj.focusNode).parents('board').length) {
                        var r = selObj.getRangeAt(0);

                        range.start = r.startOffset;
                        range.end = r.endOffset;

                        var startOffset = 0;
                        var endOffset = 0;

                        var list = [];
                        var state = 'pre';
                        board
                            .contents()
                            .filter(function () {
                                if (state != 'done') {
                                    if (this === r.startContainer || this.childNodes[0] === r.startContainer) { state = 'start'; }
                                    else if (this === r.endContainer || this.childNodes[0] === r.endContainer) { state = 'end'; }
                                    else if (state == 'start') { state = 'mid' }
                                    else if (state == 'end') { state = 'post' }

                                    list.push({
                                        state: state,
                                        elem: this,
                                        length: $(this).text().length
                                    })



                                    if (state == 'start' && r.startContainer === r.endContainer) {
                                        state = 'done';
                                    }
                                }

                            });

                        list.forEach(elem => {
                            switch (elem.state) {
                                case 'pre':
                                    range.start += elem.length;
                                    range.end += elem.length;
                                    break;
                                case 'mid':
                                    range.end += elem.length;
                                    break;
                                case 'end':
                                    var s = list.find((i) => { if (i.state == 'start') { return i; } });

                                    if (s) {
                                        range.end += s.length;
                                    }

                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }

                return range;


            }
        },

        range: (input) => {
            var start = input.selectionStart;
            var end = input.selectionEnd;
            return {
                start: start,
                end: end
            }
        },
        caret: {
            pos: (input) => {

                // Initialize
                var iCaretPos = 0;

                // IE Support
                if (document.selection) {

                    // Set focus on the element
                    input.focus();

                    // To get cursor position, get empty selection range
                    var oSel = document.selection.createRange();

                    // Move selection start to 0 position
                    oSel.moveStart('character', -input.value.length);

                    // The caret position is selection length
                    iCaretPos = oSel.text.length;
                }

                // Firefox support
                else if (input.selectionStart || input.selectionStart == '0')
                    iCaretPos = input.selectionDirection == 'backward' ? input.selectionStart : input.selectionEnd;

                // Return results
                return iCaretPos;
            }
        }
    }
}