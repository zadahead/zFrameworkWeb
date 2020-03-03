var config = require('./config');

config.secret = '';

var res = {
    config: config,

    global: {
        helloworld: 'Hello Mosh'
    }

}

module.exports = res;
