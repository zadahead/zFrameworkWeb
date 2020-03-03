//require all z- 
var http = require('z-http');

//require config and core data
var config = require('./config');
var sys = require('./sys');


//attach router 
require('./http/router')(http);


//start server
http.start(config.web.port, 

    function (route) 
    {
        return http.router.route(route);
    }, 

    {
        public: 'assets'
    }

);




