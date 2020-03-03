
String.prototype.format = function (args) {
    var formatted = this;

    if ((typeof args == "object")) {
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, args[i]);
        }
    } else {
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
    }


    return formatted;
};

String.prototype.indexOfArr = function (arr) {
    for (i = 0; i < arr.length; i++) {
        if (this.indexOf(arr[i]) != -1) {
            return true;
        }
    }
    return false;
}


Object.defineProperty(Object.prototype, 'clone', {
    enumerable: false,
    value: function () {
        var newObj = (this instanceof Array) ? [] : {};
        for (i in this) {
            if (i == 'clone') continue;
            if (this[i] && typeof this[i] == "object") {
                newObj[i] = this[i].clone();
            } else newObj[i] = this[i]
        } return newObj;
    }
});