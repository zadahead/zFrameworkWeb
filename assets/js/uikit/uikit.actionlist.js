/*
    ACTION LIST - handles a batch of list actions, for example grid/list view - adds and remove Selected class and call action
*/
var actionList = function (wrap, parent, actions, firstAction) {
    this.wrap = typeof (wrap) == "string" ? $('[data-wrap="{0}"]'.format(wrap)) : $(wrap);
    this.children = this.wrap.children();
    this.parent = parent;
    this.actions = actions;

    this.firstAction = firstAction ? firstAction : 0;

    this.set();

    //call first action
    $(this.children[this.firstAction]).click();
}

actionList.prototype.set = function () {
    var list = this.actions;
    var self = this;

    this.wrap.attr('act_lst', 'parent');
    this.children.attr('act_lst', 'child');

    var index = 0;
    list.forEach(action => {
        var func = this.parent + "." + action;

        var child = $(self.children[index]);
        if (child.length){
            child.attr('data-action', func);
            child.bind('click', self.onclick);
        }
        index++;
    });

    uikit.set.actions(self.wrap);
}

actionList.prototype.onclick = function (e) {
    var parent = gt('[act_lst="parent"]', e);
    var child = gt('[act_lst="child"]', e);

    $('[act_lst="child"]', parent).removeClass('selected');
    child.addClass('selected');
}