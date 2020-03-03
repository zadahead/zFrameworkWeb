
var FileUploader = function (params) {
    params.trig.id = getIDNum();
    $(params.trig).addClass("file_uploader_trig");

    if (params.trig) {
        if (params.trig.nodeName.toLowerCase() != "input") {
            var id = params.trig.id + "_trig";

            //<input type="file" name="files[]" multiple />
            var parent = params.trig.parentNode;
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("id", params.trig.id + "_trig");
            if (params.multiple) {
                input.setAttribute("multiple", "multiple");
            }

            if (params.accept) {
                input.setAttribute("accept", params.trig.accept);
            } else {
                input.setAttribute("accept", "image/x-png, image/gif, image/jpeg");
            }


            input.style.display = "none";

            params.trig.onclick = function (e) {
                var target = $(e.target);
                if (!target.hasClass("file_uploader_trig")) { target = target.parents('.file_uploader_trig'); }

                if (target.hasClass("uploading")) { return; }


                FileUploader.struct.trig = target;

                var input = document.getElementById(target[0].id + "_trig");
                input.click();
            }

            var frmid = 'frm' + params.trig.id;
            var form = $(' <form id="{0}" name="myform" action="uploader"></form>'.format(frmid));
            form.append(input)
            parent.appendChild(form[0]);

            this.trig = input;
        } else {
            this.trig = params.trig;
        }
        params.trig.events = params.events ? params.events : [];
        this.trig.events = params.events ? params.events : [];
        this.trig.accept = params.accept ? params.accept : null;
        this.trig.data = params.data ? params.data : [];
    }

    if (params.dropZone) {
        this.dropZone = params.dropZone;
        this.dropZone.events = params.events ? params.events : [];
    }

    FileUploader.struct.kind = params.kind ? params.kind : 1; //canvas

    this.init();

    if (params.trig) {
        if (this.trig.events.oninit) {
            this.trig.events.oninit();
        }
    }
}

FileUploader.struct = {
    is: {
        supported: function () {
            return (window.File && window.FileReader && window.FileList && window.Blob);
        },

        preloading: false,

        alive: false,
        holt: false
    },

    trig: null,

    kind: 1,

    evt: null,

    reader: null,

    index: 0,
    nonimages: 0,
    maxLoad: 100,

    track: {
        total: 0,
        loaded: 0,
        selected: 0,
        preload: 0
    },

    list: {
        curr: [],

        selected: [],

        preload: [],

        client: [],

        mobile: []
    },

    vars: {
        reader: null
    }
}

FileUploader.prototype.init = function () {
    if (FileUploader.struct.is.supported()) {
        if (this.trig) {
            this.trig.addEventListener('change', FileUploader.handle.load.selected, false);
            this.trig.addEventListener('click', FileUploader.handle.load.click, false);
        }

        if (this.dropZone) {
            this.dropZone.addEventListener('dragover', FileUploader.handle.drag.over, false);
            this.dropZone.addEventListener('dragleave', FileUploader.handle.drag.leave, false);
            this.dropZone.addEventListener('drop', function (e) {
                FileUploader.handle.drag.drop(e);
                FileUploader.handle.load.selected(e, { files: e.dataTransfer.files });
            }, false);
        }

        document.body.addEventListener('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);

        FileUploader.struct.reader = new FileReader();
    }
}

FileUploader.handle = {
    msg: {
        show: function () {
            var length = FileUploader.struct.track.selected;
            var loaded = FileUploader.struct.track.preload;
            var nonimages = FileUploader.struct.nonimages;

            console.log(length, loaded, nonimages);
        },

        pre: function (count) {
            if (!count) { count = ""; }
            console.log("MSG", count)
        },

        hide: function () {
            console.log("MSG hide");
        }
    },

    timestamp: {
        timer: null,
        duration: null,

        data: [],

        update: function (data, isForce) {
            var files = FileUploader.struct.uploadedFiles;
            if (!files) { return; }

            var sizes = 0;
            for (var i = 0; i < files.length; i++) {
                sizes += files[i].size;
            }

            var selected = FileUploader.struct.list.selected;
            for (var i = 0; i < selected.length; i++) {
                sizes += selected[i].size;
            }

            if (data) {
                FileUploader.handle.timestamp.data.push(data);
            }
            var d = FileUploader.handle.timestamp.data;
            if (isForce || d.length == 1 || d.length % 3 == 0) {
                var calc = {
                    size: 0,
                    diff: 0
                };

                var count = 0;
                for (var i = (d.length - 1); i >= 0; i--) {
                    if (!d[i]) { break; }
                    if (count == 6) { break; }

                    calc.size += d[i].size;
                    calc.diff += d[i].diff;
                    count++;
                }

                var size = parseInt((calc.size / count));
                var diff = parseInt((calc.diff / count));

                var duration = (sizes / size) * diff;
                FileUploader.handle.timestamp.duration = duration;

                var left = files.length + selected.length;

                //console.log(duration, sizes, { size: size, diff: diff, left: left });

                FileUploader.handle.timestamp.tick();
            }

        },

        tick: function () {
            clearInterval(FileUploader.handle.timestamp.timer);

            var duration = FileUploader.handle.timestamp.duration;
            var events = FileUploader.target.events;

            var timer = duration, hours, minutes, seconds;
            FileUploader.handle.timestamp.timer = setInterval(function () {
                var time = parseInt(timer / 60, 10);
                hours = Math.floor(time / 60);
                minutes = parseInt(time % 60);
                seconds = parseInt(timer % 60, 10);

                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                var time = hours != "00" ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;
                if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                    time = '--:--';
                }

                if (events.ontick) {
                    events.ontick(time);
                }

                if (--timer < 0) {
                    timer = duration;
                }

                if (hours == "00" &&
                    minutes == "00" &&
                    seconds == "00") {
                    FileUploader.handle.timestamp.update(null, true);
                }
            }, 1000);
        }
    },

    validate: {
        images: function (files) {
            return files;
        }
    },

    load: {
        click: function (evt) {
            if (evt.target.events.onclick) {
                evt.target.events.onclick((resp) => {
                    FileUploader.struct.is.holt = !resp;
                });
            }
        },

        selected: function (evt, params) {
            if (FileUploader.struct.is.holt) { return; }

            msg(data.res.FU_FETCHING, function () {
                FileUploader.struct.is.holt = false;
                params = params ? params : {};

                evt.stopPropagation();
                evt.preventDefault();

                FileUploader.target = evt.target;

                if (FileUploader.target.events.prestart) {
                    FileUploader.target.events.prestart();
                }

                var files = params.files ? params.files : evt.target.files ? evt.target.files : evt.dataTransfer ? evt.dataTransfer.files : []; // FileList object

                if (!files.length) {
                    msg(data.res.FU_NO_FILES);
                    return;
                }

                var valid = false;

                var valid = FileUploader.handle.validate.images((valid ? valid : files));


                var uploadedFiles = FileUploader.struct.uploadedFiles;
                if (!uploadedFiles) {
                    uploadedFiles = FileUploader.struct.uploadedFiles = [];
                }
                for (var i = 0; i < valid.length; i++) {
                    FileUploader.struct.uploadedFiles.push(valid[i]);
                }

                FileUploader.struct.track.total += valid.length;

                FileUploader.struct.evt = evt;


                if (!FileUploader.struct.is.alive) {
                    var events = FileUploader.target.events;
                    if (events.ontick) {
                        events.ontick('--:--');
                    }

                    FileUploader.handle.load.rest();
                }


            });
        },

        rest: function () {
            FileUploader.struct.trig.addClass('uploading');

            FileUploader.struct.nonimages = [];

            var files = FileUploader.struct.uploadedFiles;
            var maxLoad = FileUploader.struct.maxLoad;

            if (files) {
                FileUploader.struct.index = FileUploader.struct.list.selected.length;

                for (var i = 0; i < maxLoad; i++) {
                    var file = files[i];
                    if (!file) { break; }

                    FileUploader.struct.list.selected.push(file);
                }
                FileUploader.struct.track.selected = FileUploader.struct.list.selected.length;

                //clear uploadedFiles
                FileUploader.struct.uploadedFiles.splice(0, maxLoad);

                //load
                if (!FileUploader.struct.is.preloading) {
                    FileUploader.handle.load.client();
                }
            } else {
                FileUploader.events.complete();
            }
        },

        reloadInit: function () {
            var p = FileUploader.struct.trig;
            var events = p[0].events;
            var accept = p[0].accept;
            var callback = p[0].callback;
            var id = p[0].id;

            var newP = p.clone();
            newP[0].events = events;
            if (callback) {
                newP[0].callback = callback;
            }


            $(p).replaceWith(newP);

            //if (FileUploader.target.events.onReloadInit) {
            //    FileUploader.target.events.onReloadInit();
            //}

            $('form#frm{0}'.format(id)).remove();

            FileUploader.struct.trig = newP;

            var fluTop = new FileUploader({
                trig: newP[0],
                events: events,
                accept: accept
            });
        },

        client: function () {

            var index = FileUploader.struct.index;
            var file = FileUploader.struct.list.selected[index];

            FileUploader.handle.msg.show();

            var URL = window.URL || window.webkitURL;

            if (file) {
                FileUploader.struct.is.preloading = true;

                var struct = FileUploader.struct;
                var events = FileUploader.target.events;

                FileUploader.struct.reader.onprogress = null;

                FileUploader.struct.reader.onloadstart = null;

                FileUploader.struct.reader.onloadend = (function (theFile) {
                    return function (e) {
                        var events = FileUploader.target.events;

                        if (e.target.readyState == FileReader.DONE) {

                            var stream = e.target.result;
                            var bin = new BinaryFile(stream);
                            var exif = EXIF.readFromBinaryFile(bin);

                            bin = null;

                            var preloads = FileUploader.struct.list.client;
                            var date = preloads.length ? preloads[preloads.length - 1].taken : new Date();

                            if (exif.DateTimeOriginal) {
                                date = FileUploader.get.exifDate(exif.DateTimeOriginal);
                            }

                            var call = function (id, path, params) {
                                FileUploader.struct.list.client.push({
                                    id: id,
                                    clientId: id,
                                    path: path ? path : '',
                                    url: "",
                                    target: null,
                                    name: file.name,
                                    size: file.size,
                                    width: exif.PixelXDimension,
                                    height: exif.PixelYDimension,
                                    taken: file.lastModifiedDate,
                                    stream: URL.createObjectURL(file),
                                    orientation: exif.Orientation,
                                    error: false,
                                    params: params
                                });

                                FileUploader.struct.track.preload++;

                                exif = null;

                                setTimeout(FileUploader.handle.load.client, 5);
                            }

                            if (events.onid) {
                                events.onid(call);
                            } else {
                                call(parseInt(getIDNum()));
                            }
                        }
                    };
                })(file);

                FileUploader.struct.reader.onerror = FileUploader.events.errorPreLoad;
                FileUploader.struct.reader.onabort = FileUploader.events.errorPreLoad;

                if (!FileUploader.struct.reader.readAsBinaryString) {
                    FileUploader.struct.reader.readAsDataURL(file);
                } else {
                    FileUploader.struct.reader.readAsBinaryString(file);
                }

                FileUploader.struct.index++;
            } else {
                var nonimages = FileUploader.struct.nonimages;
                if (nonimages.length) {
                    var info = [];
                    info.push('<div>' + data.res.get("k1331").format(nonimages.length) + '</div>')
                    info.push('<div class="info">(');
                    for (var i = 0; i < nonimages.length; i++) {
                        if (i > 0) { info.push(', '); }
                        info.push(nonimages[i]);
                    }
                    info.push(')</div>');

                    alertPop(info.join(''));
                }
                FileUploader.struct.is.preloading = false;
                FileUploader.struct.track.preload = 0;
                FileUploader.struct.track.selected = 0;

                FileUploader.struct.nonimages = [];

                if (typeof (canvas) != "undefined" && canvas.resurrection.is.on()) {
                    FileUploader.handle.load.resurrection();
                } else {
                    FileUploader.handle.load.ids.call();
                }
            }
        },

        ids: {
            data: [],
            loaded: 0,

            call: function () {
                var preload = FileUploader.struct.list.client;
                var events = FileUploader.target.events;

                var source;
                if (typeof (mobile) == "undefined") {
                    source = 4;
                }
                else {
                    source = 6;
                }

                var data = [];

                for (var i = 0; i < preload.length; i++) {
                    var item = preload[i];
                    if (item.id == -1) {
                        data.push({
                            clientId: preload[i].clientId,
                            width: preload[i].width,
                            height: preload[i].height,
                            taken: preload[i].taken,
                            fileName: preload[i].name,
                            sourceid: source
                        });
                    }
                }

                FileUploader.handle.msg.pre();

                FileUploader.handle.load.ids.data = data;
                FileUploader.handle.load.ids.loaded = 0;

                if (events.onbeforeSingle) {
                    events.onbeforeSingle();
                }

                FileUploader.handle.load.ids.chunk();
            },

            chunk: function () {
                FileUploader.handle.load.ids.finish();
            },

            finish: function () {
                var preload = FileUploader.struct.list.client;
                var events = FileUploader.target.events;
                var data = FileUploader.target.data;

                FileUploader.handle.msg.hide();

                if (events.oncomplete) {
                    events.oncomplete(preload);
                }

                if (!FileUploader.struct.is.alive) {
                    FileUploader.handle.file.loadNext();
                }
            }
        }
    },

    file: {
        loadNext: function () {
            if (FileUploader.struct.is.holt) { return; }

            FileUploader.struct.is.alive = true;

            var struct = FileUploader.struct;
            var events = FileUploader.events;


            if (true) {
                var file = FileUploader.get.next();
                var client = FileUploader.get.nextClient();


                if (typeof (client) == "undefined") {
                    FileUploader.events.complete();
                    return;
                }


                var events = FileUploader.target.events;

                if (!events) {
                    return;
                }

                if (!client) {
                    events.complete();
                    return;
                }

                FileUploader.struct.list.curr = {
                    id: client.id
                }

                if (events.onuploadStart) {
                    events.onuploadStart(file, {
                        length: FileUploader.struct.track.total,
                        uploaded: FileUploader.struct.track.loaded,
                        imgId: FileUploader.get.nextClient().id
                    });
                }

                if (file) {
                    fetch.file(file, client, FileUploader.target.id, {

                        start: function () {
                            if (events.onstart) {
                                events.onstart();
                            }
                        },

                        ontimestamp: function (e, timestamp) {
                            FileUploader.handle.timestamp.update(timestamp);
                        },

                        progress: function (e) {
                            if (e.lengthComputable) {
                                var length = e.total
                                var left = e.loaded

                                var total = FileUploader.struct.track.total;
                                var uploaded = FileUploader.struct.track.loaded;

                                var cs = toChunk(left, length, total, uploaded);

                                if (events.onuploadProccess) {
                                    events.onuploadProccess(cs, client.id);
                                }
                            }
                        },

                        onload: function (e, result) {
                            var events = FileUploader.target.events;
                            var file = FileUploader.get.nextClient();

                            var imgId = file.id;

                            ///replace existing images
                            FileUploader.handle.file.remove();

                            var left = FileUploader.struct.list.selected.length;



                            if (events.onuploadComplete) {
                                events.onuploadComplete(file, result, imgId);
                            }

                            //go next
                            if (left) {
                                FileUploader.handle.file.loadNext();
                            } else {
                                FileUploader.events.complete();
                            }
                        },

                        onerror: function (e) {
                            var events = FileUploader.target.events;
                            if (events.error) {
                                events.error(e);
                            }

                            FileUploader.handle.file.remove();
                            FileUploader.handle.file.loadNext();
                        }
                    });
                    FileUploader.struct.track.loaded++;
                } else {
                    events.complete();
                }
            }

        },

        remove: function (index) {
            var index = index ? index : 0;
            var clientIndex = index;
            if (index == 0) {
                for (var i = 0; i < FileUploader.struct.list.client.length; i++) {
                    if (!FileUploader.struct.list.client[i].ismobile) {
                        clientIndex = i;
                        break;
                    }
                }
            }
            FileUploader.struct.list.client.splice(clientIndex, 1);
            FileUploader.struct.list.selected.splice(index, 1);
        }
    },

    uploadedImages: function (result, imgId) {
        ////replace existing images
        var bank = $('[data-src][data-img-id="' + imgId + '"]');
        if (bank.length) {
            for (var i = 0; i < bank.length; i++) {
                var im = $(bank[i]);
                var src = im.attr("data-src");
                $("img", im).attr("src", src);

                $("img", im).attr("data-full-width", result.Width);
                $("img", im).attr("data-full-height", result.Height);

                if (im[0].attr) {
                    im[0].attr["data-full-width"] = result.Width;
                    im[0].attr["data-full-height"] = result.Height;
                } else {

                }
            }
        }
    },

    drag: {
        over: function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

            evt.target.className = evt.target.className + " hover";

            FileUploader.target.events = evt.target.events;

            if (FileUploader.target.events.dragOver) {
                FileUploader.target.events.dragOver();
            }
        },

        leave: function (evt) {
            if (!evt.target.className) { return; }

            evt.target.className = evt.target.className.replace(/ hover/gi, "");

            FileUploader.target.events = evt.target.events;

            if (FileUploader.target.events.dragLeave) {
                FileUploader.target.events.dragLeave();
            }
        },

        drop: function (evt) {
            FileUploader.handle.drag.leave(evt);
        }
    }
}
FileUploader.update = {
    list: [],
    tryouts: 0,

    loaded: function (bankId, result, file) {
        FileUploader.update.list.push({
            bank: bankId,
            result: result,
            client: file
        })
        if (FileUploader.update.list.length == 1) {
            FileUploader.update.call();
        }
    },

    call: function () {
        setTimeout(function () {

            var next = FileUploader.update.list[0];
            if (next) {
                var bank = $('[data-src][data-img-id="' + next.bank + '"]');

                //clean block

                //rest
                var result = next.result;

                if (bank.length) {
                    var src = result.Url.split('||')[0];

                    tryouts = FileUploader.update.tryouts;
                    if (tryouts > 10) {
                        $("img", bank).remove();

                        FileUploader.update.tryouts = 0;
                        FileUploader.update.list.splice(0, 1);
                        FileUploader.update.call();
                    }

                    FileUploader.update.tryouts++;

                    var img = new Image();

                    img.onload = function () {

                        for (var i = 0; i < bank.length; i++) {
                            var im = $(bank[i]);
                            var src = im.attr("data-src");

                            if (window.location.href.indexOf('localhost') != -1) {
                                src = src.replace(/http:\/\/\//, resolveUrl + "/");
                            }

                            $("img", im).removeClass("keep_it");
                            $("img", im).attr("src", src + '?cache=' + getIDNum());

                            $("img", im).attr("data-full-width", result.Width);
                            $("img", im).attr("data-full-height", result.Height);

                            if (im[0].attr) {
                                im[0].attr["data-full-width"] = result.Width;
                                im[0].attr["data-full-height"] = result.Height;
                            } else {

                            }
                        }
                        FileUploader.update.tryouts = 0;
                        FileUploader.update.list.splice(0, 1);
                        FileUploader.update.call();
                    }

                    img.onerror = function () {
                        FileUploader.update.call();
                    }

                    img.onabort = function () {
                        FileUploader.update.call();
                    }

                    img.src = src;
                } else {
                    FileUploader.update.tryouts = 0;
                    FileUploader.update.list.splice(0, 1);
                    FileUploader.update.call();
                }
            }
        }, 2000);
    }
}
FileUploader.get = {
    next: function () {
        var struct = FileUploader.struct;
        var file = struct.list.selected[0]; //first in first out
        return file;
    },

    nextClient: function () {
        var struct = FileUploader.struct;
        for (var i = 0; i < struct.list.client.length; i++) {
            if (!struct.list.client[i].ismobile) {
                var file = struct.list.client[i]; //first in first out
                break;
            }
        }
        return file;
    },

    target: function () {
        var file = FileUploader.get.next();
        return file.target;
    },

    exifDate: function (raw) {
        //2014:02:28 14:06:01
        var split = raw.split(" ");
        var date = split[0];
        var time = split[1];
        if (date && time) {
            var dates = date.split(":");
            var year = dates[0];
            var month = dates[1];
            var day = dates[2];

            var times = time.split(":");
            var hours = times[0];
            var minutes = times[1];
            var seconds = times[2];

            return new Date(year, parseInt(month) - 1, day, hours, minutes, seconds);
        } else {
            return new Date();
        }
    }
}

FileUploader.target = {
    events: null,
    data: null,
    id: null
}

FileUploader.events = {
    start: function (evt) {
        var events = FileUploader.target.events;
        if (events.onstart) {
            events.onstart(evt);
        }
    },

    upload: function (evt) {
        FileUploader.handle.file.upload(evt);
    },

    progress: function (evt) {
        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {

            }

            var events = FileUploader.target.events;

            if (events.onprogress) {
                events.onprogress(evt, percentLoaded);
            }
        }
    },

    errorPreLoad: function () {
        var index = FileUploader.struct.index - 1;

        var file = FileUploader.struct.list.selected[index];

        FileUploader.struct.nonimages.push(file.name);


        FileUploader.handle.file.remove(index);
        FileUploader.struct.index = index;

        setTimeout(FileUploader.handle.load.client, 5);
    },


    error: function (evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:
                break; // noop
            default:
                alert('An error occurred reading this file.');
        };
    },

    complete: function () {
        var events = FileUploader.target.events;

        FileUploader.struct.is.alive = false;

        FileUploader.handle.msg.hide();


        var files = FileUploader.struct.uploadedFiles;
        if (files.length) {
            FileUploader.handle.load.rest();
        } else {
            if (events.onAllUploadComplete) {
                events.onAllUploadComplete();
            }

            FileUploader.struct.trig.removeClass('uploading');

            FileUploader.struct.track.total = 0;
            FileUploader.struct.track.loaded = 0;
            FileUploader.struct.list.client = [];
            FileUploader.struct.list.selected = [];
            FileUploader.struct.list.curr = [];
            FileUploader.struct.list.mobile = [];

            clearInterval(FileUploader.handle.timestamp.timer);
            FileUploader.handle.timestamp.data = [];

            FileUploader.handle.load.reloadInit();

            setTimeout(function () {
                FileUploader.update.list = [];
            }, 10000)

            if (typeof (canvas) != "undefined") {
                canvas.resurrection.check(true);
            }


        }
    },

    abort: function () {
        console.log("abort");
    }
}

