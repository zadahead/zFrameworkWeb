
var res = require('../res');
var zview = require('z-views'); 

//init zview with res bank
zview.init({ res: res });


exports = module.exports = function (router) {


    router.sections = {
        more: (data, callback) => {
            
            zview.render('more', {
                query: data.payload
            }, callback);
        }
    } 
    //default page
    router.home = (data, callback) => {
        var list = [
            { name: 'zada', phone: 'asdasd'},
            { name: 'Adeel', phone: 'asdasd' },
            { name: 'Peyman', phone: 'asdasd' },
            { name: 'Marco', phone: 'asdasd' },
        ]
        router.master('home', {
            headline: 'hello headline',
            list: list,
            show: false
        }, callback, ['home_example', { bla: 'ba' }]);
    }

    //uikit info page
    router.uikit = (data, callback) => {
        router.inhouse('uikit', {}, callback);
    }

    //zhttp info page
    router.zhttp = (data, callback) => {
        router.inhouse('zhttp', {}, callback);
    }

    //zviews info page
    router.zviews = (data, callback) => {
        var list = [
            { name: 'person 1', age: '36' },
            { name: 'person 2', age: '21' },
            { name: 'person 3', age: '45' }
        ]

        router.inhouse('zviews', {
            headline: 'This is a headline',
            info: 'This is a simple info',
            list: list
        }, callback);
    }

    //inhose wrap - load template with master and added header/footer templates
    router.inhouse = (template, data, callback, script) => {
        zview.render(template, data, (content) => {
            router.master('inhouse', { content: content }, callback);
        }, script);
    }

    //master wrap - loads all wanted views inside a master wrap to include all needed files
    router.master = (template, data, callback, script) => {
        zview.render(template, data, (content) => {
            zview.render('master', { content: content }, callback, ['res', res]);
        }, script);
    }

    

    //fallback page when there is no page on the router to show
    router.nopage = (data, callback) => {
        callback('No Page boss.');
    }

}