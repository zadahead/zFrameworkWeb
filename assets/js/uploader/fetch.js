var fetch = {

    time: null,

    params: null,

    xhr: new XMLHttpRequest(),

    file: function (file, client, formId, params) {
        if (!file) { return; }


        fetch.params = params;
        fetch.params.imgId = client.id;

        if (fetch.params.start) {
            fetch.params.start();
        }

        fetch.time = {
            size: file.size,
            start: new Date(),
            end: null
        }
 
        setTimeout(function () {
            fetch.send(file, client, formId, params);
        }, 10);
    },

    send: function (file, client, formId, params) {
        var frm = $('form#frm{0}'.format(formId.replace('_trig', '')))[0];
        var formData = new FormData(frm);

        formData.append('name', client.id);
        formData.append('fileName', client.name);
        formData.append('fileSize', client.size);
        formData.append('fileTaken', client.taken);
        formData.append('token', core.get.shortToken());

        formData.append('path', client.path);

        formData.append("stream", file);
        if (client.params) {
            formData.append("params", JSON.stringify(client.params));
        }



        var cache = fetch.get.cacheId();

        if (fetch.xhr.upload) {
            fetch.xhr.upload.onprogress = fetch.peogress;
        } else {
            fetch.xhr.onprogress = fetch.peogress;
        }

        
        fetch.xhr.open('POST', '{0}/upload?cache={1}'.format(data.res.config.web.url, cache), true);
        fetch.xhr.onreadystatechange = function (e) {
            var _ref;



            if (fetch.xhr.readyState !== 4) {
                return;
            }
            response = fetch.xhr.responseText;

            try {
                if (!((200 <= (_ref = fetch.xhr.status) && _ref < 300))) {
                    fetch.on.err(response, fetch.xhr.status);
                } else {
                    if (fetch.xhr.getResponseHeader("content-type") && ~fetch.xhr.getResponseHeader("content-type").indexOf("application/json")) {
                        //try {
                        //    response = JSON.parse(response);

                        //} catch (_error) {
                        //    e = _error;
                        //    response = "Invalid JSON response from server.";
                        //}
                    }

                    if (fetch.params.ontimestamp) {
                        fetch.time.end = new Date();

                        fetch.params.ontimestamp(e, fetch.get.time());
                    }

                    $('uploader action').removeAttr('error');

                    if (fetch.params.onload) {
                        fetch.params.onload(e, response);
                        //                        fetch.params.onload(e, eval('[' + response + ']')[0]);
                    }
                }
            } catch (ex) {
                fetch.on.err(ex);
            }
        }


        fetch.xhr.send(formData);  // multipart/form-data
    },

    on: {
        err: (ex, status) => {
            msgerr('Upload Error: ' + ex, status);

            $('uploader action').attr('error', 'on');

            if (fetch.params.onerror) {
                fetch.params.onerror(ex);
            }
        }
    },

    peogress: function (e) {
        if (e.lengthComputable) {
            per = 100 * (e.loaded / e.total);
            if (fetch.params.progress) {
                fetch.params.progress(e);
            }
        }
    },

    get: {
        cacheId: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },

        time: function () {
            var size = fetch.time.size;
            var start = fetch.time.start;
            var end = fetch.time.end;

            var mill = 1000;
            var diff = Math.ceil((end.getTime() - start.getTime()) / (mill));

            return { size: size, diff: diff };
        }
    }
}