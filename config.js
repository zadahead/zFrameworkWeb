
var isDev = 1;

var hostname = isDev ? 'localhost' : '139.162.207.107';


var config = {

    web: {
        port: isDev ? '5000' : '80',
        hostname: hostname,
    },

    api: {
        port: isDev ? '5001' : '5001',
        hostname: hostname
    },

    secret: 'nemomolamoral',
    tokenExpiresInSeconds: 86400, // expires in 24 hours
}

config.web.url = 'http://{0}:{1}'.format(config.web.hostname, config.web.port);
config.api.url = 'http://{0}:{1}'.format(config.api.hostname, config.api.port);



module.exports = config;