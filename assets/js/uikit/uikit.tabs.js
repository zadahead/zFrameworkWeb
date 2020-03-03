uikit.tabs = {
    init: function (elems) {
        var elems = $(elems);

        uikit.bind.click(elems, uikit.tabs.on.click);

        elems.first().click();
    },

    get: {
        selected: function (wrap) {
            var tab = $('tabblock.selected', wrap);
            if(tab.length){
                var selected;
                $(tab).each(function () {
                    $.each(this.attributes, function () {
                        if (this.specified && !this.value) {
                            selected = this.name;
                        }
                    });
                });
                return selected;
            }
            return '';
        }
    },

    on: {
        click: function (e) {
            var tab = gt('tabblock', e);
            var parent = tab.parent().parent();
            $('tabblock', parent).removeClass('selected');
            $('tabcontent', parent).removeClass('show');

            tab.addClass('selected');

            var selected = uikit.tabs.get.selected(parent);
            

            var sel = $('tabcontent[{0}]'.format(selected));

            if (sel.length) {
                sel.addClass('show');
            }
        }
    }
}