uikit.sta = { //stand alone 
    init: function (elem) {
        var sec = elem.attr('name');
        elem.attr('data-section', sec);

        var query = elem.attr('query');

        setTimeout(() => {
            uikit.sta.load(sec, query);
        }, 1000);
    },

    load: (sec, query) => {
        section.set(sec, query, null, null, { isPreventRoll: true });
    }
}