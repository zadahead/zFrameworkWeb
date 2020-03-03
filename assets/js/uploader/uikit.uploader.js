uikit.uploader = {
    init: function (elem) {
        /*  
            <line action>
                <icon cloud-upload></icon>
                <linkbtn>Upload Logo</linkbtn>
            </line>

            <line bar>
                <bar>
                    <per></per>
                </bar>
            </line>
        */

        var title = elem.attr('data-title');
        var accept = elem.attr('data-accept');
        var callback = elem.attr('data-callback');

        //action
        var line = $('<line action>');

        line.append('<action {1} type-skinny>{0}</action>'.format(title, 'cloud-upload'));

        elem.append(line);


        //bar
        var line = $('<line bar>');
    
        line.append('<bar>');
        $('bar', line).append('<per>');

        elem.append(line);

        if (callback){
            elem[0].callback = eval(callback);
        }

        //set up events
        new FileUploader({
            trig: elem[0],
            events: uikit.uploader.events,
            accept: accept ? accept : '*'
        });
    },

    set: {
        bar: function (per) {
            $('bar', FileUploader.struct.trig).css('width', per + '%');
            $('per', FileUploader.struct.trig).html(per + '%');
        }
    },

    events: {
        onid: function (callback) {
            var path = FileUploader.struct.trig.attr('data-path');
            var id = FileUploader.struct.trig.attr('data-id');

            id = parseInt(getIDNum());


            var clbk = (params) => {
                if (path && id) {
                    callback(id, path, params);
                } else {
                    callback(id);
                }
            }


            var loadParams = FileUploader.struct.trig.attr('data-load-params');
            if (loadParams) {
                eval(loadParams)((params) => {
                    clbk(params);
                });
            } else {
                clbk();
            }

            
        },

        onReloadInit: function () {
            console.log('onReloadInit');
        },

        onclick: function (callback) {
            console.log('onclick');
            var onstart = FileUploader.struct.trig.attr('data-onstart');
            if (onstart) {
                eval(onstart)(callback);
            }else {
                callback(true);
            }
        },

        ontick: function (time) {
            console.log('ontick');
        },

        prestart: function (evt, length) {
            uikit.uploader.set.bar(0);
            $('ajaxloader').addClass('on');
            
            console.log('prestart');
        },

        progress: function (evt, percentLoaded) {
            console.log('progress');
        },

        onbeforeSingle: function () {
            console.log('onbeforeSingle');
        },

        oncompleteSingle: function (evt, curr, mobile) {
            console.log('oncompleteSingle');
        },

        oncomplete: function (preload, mobile) {
            console.log('oncomplete');
        },

        onuploadStart: function (file, data, mobile, mobileId) {
            console.log('onuploadStart');
        },

        onstart: function () {
            console.log('onstart');
        },

        onuploadProccess: function (chunks, imgId, mobile, mobileId) {
            uikit.uploader.set.bar(chunks.chunk);

            console.log('onuploadProccess');
        },

        onuploadComplete: function (file, result, imgId) {
            uikit.uploader.set.bar(100);

            var json = result;
            try {
                json = JSON.parse(result);
            } catch (error) { }

            if (FileUploader.struct.trig[0].callback){
                FileUploader.struct.trig[0].callback(file.id, json);
            }
            

            FileUploader.struct.trig.attr('data-id', file.id);
            core.evt.shout('uploader_uploaded', { target: FileUploader.struct.trig });

            console.log('onuploadComplete');
        },

        onAllUploadComplete: function () {
            $('ajaxloader').removeClass('on');
            console.log('onAllUploadComplete');
        }
    }
}