exports = module.exports = function (http) {

    http.router = {
        route: function (route) {
            if(route == ""){
                return http.router.home;
            }

            if (http.router[route]) {
                return http.router[route];
            }

            try {

                var func = eval('http.router.' + route.replace(/\//gim, '.'));

                if (func) {
                    return func;
                }
            }
            catch (e) {

            }

            return http.router.nopage;
        }
    }

    require('./views')(http.router);
}