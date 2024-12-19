var Upload = (function (w) {
    /**
     *
     * @param elid 绑定标签id，不能为null
     * @param edit true时表示当前为编辑页面，在非编辑状态时会隐藏删除和添加文件模块
     * @param fileLst 保存文件列表，不能为null
     * @param callBack 回调
     * @param operationId 上传人
     * @param operationName 上传人
     * @param param 参数
     * @param fidedesc 附件描述
     * @returns {Upload.init|init}
     * @constructor
     */
    var Upload = function (elid, edit, fileLst, callBack, operationId, operationName, param, fidedesc, maxLength, bindObj, multipleFiles) {
        if (elid == null){
            throw '参数不能为空';
        }
        if (typeof elid === 'object') {
            var conf = elid;
            return new Upload.fn.init(conf.elid, conf.edit, conf.fileLst, conf.callBack, conf.operationId, conf.operationName, conf.param, conf.fidedesc, conf.maxLength, conf.bindObj, conf.multipleFiles);
        }else {
            return new Upload.fn.init(elid, edit, fileLst, callBack, operationId, operationName, param, fidedesc, maxLength, bindObj, multipleFiles);
        }
    };

    Upload.fn = Upload.prototype = {
        constructor: Upload,
        init: function (elid, edit, fileLst, callBack, operationId, operationName, param, fidedesc, maxLength, bindObj, multipleFiles) {
            this.elid = elid;
            this.edit = edit == true;
            this.fileLst = (fileLst == null ? [] : fileLst);
            this.callBack = callBack;
            this.operationId = (operationId == null ? sessionStorage.getItem("userId") : operationId);
            this.operationName = (operationName == null ? sessionStorage.getItem("username") : operationName);
            this.param = param;
            this.fidedesc = (fidedesc == null ? '附件' : fidedesc);
            this.maxLength = (maxLength == null ? -1 : maxLength);
            this.bindObj = (bindObj == null ? {objId:null, objType:null} : bindObj);
            this.viewer = null;
            this.multipleFiles = (multipleFiles == null ? true : multipleFiles);
            this.clickId = 'addFile_' + uuid(16);
            this.initView = function () {
                this.initializeView();
            }
        },
        initializeView: function () {
            var parent = $('#' + this.elid);
            var view = '';
            view += '<div class="layui-input-inline-upload">';
            if (this.fileLst.length > 0) {
                var _this = this;
                this.fileLst.forEach(function (item) {
                    if (item.id == null || item.id == '') item.id = '0_' + uuid(60);
                    for (var key in item) {
                        if (item[key] == null) {
                            item[key] = '';
                        }
                    }
                    view += (_this.generateItemView(item, _this.edit));
                });
            }
            if (this.edit) {
                view += '<div class="layui-input-inline-upload-button box-rect box-rect-event" style="width:180px;height:120px"  id="' + this.clickId + '">';
                view += '	<img src="/statics/images/upfile@2x.png" style="width:180px;height:120px">';
                view += '</div>';
                view += '</div>';
                view += '<div class="layui-input-inline-upload-text" style="font-size:12px;width:380px;height:20px;line-height:20px">附件说明：附件最大支持30M，';
                view += '	<br/>';
                view += '	支持格式：PDF、Word、Excel、JPG、PNG 、ZIP、RAR 、MP4';
                view += '</div>';
            }
            parent.append(view);
            this.updateViewLength();
            this.initializeUpload();
        },
        initializeUpload: function () {
            var _this = this;
            var data = {'path': 'doc'};
            if (_this.param != null) for (var key in _this.param) {
                data[key] = _this.param[key];
            }
            layui.upload.render({
                elem: ('#' + _this.clickId),
                url: baseURL + 'file/uploadMonofile',
                data: data,
                field: 'file',
                auto: true,
                size: 30 * 1024 * 1024,
                accept: 'file', //普通文件,
                multiple: _this.multipleFiles,
                number:20,
                acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar,.mp4',
                exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar|mp4', //
                choose: function (obj) {
                    PageLoading();
                    $.ajaxSettings.async = false;
                    // var files = obj.pushFile();
                    obj.preview(function (index, file, result) {
                        var fileName = file.name;
                        var extIndex = fileName.lastIndexOf('.');
                        var ext = fileName.slice(extIndex);
                        var fileNameNotext = fileName.slice(0, extIndex);
                        var regExt = /png|jpg|jpeg/;
                        var fileType = regExt.test(ext) ? 1 : 0;
                        var fileTmp = {
                            id: _this.fileLst.length + '_' + uuid(60),
                            operationId: _this.operationId,
                            operationName: _this.operationName,
                            objId: _this.bindObj.objId,
                            objType: _this.bindObj.objType,
                            nameDesc: _this.fidedesc,
                            nameAccessory: fileNameNotext,
                            nameFile: fileName,
                            nameExt: ext,
                            typeFile: fileType,
                        };
                        for (var k in fileTmp) {
                            if (fileTmp[k] == null) {
                                fileTmp[k] = '';
                            }
                        }
                        $('#' + _this.clickId).before(_this.generateItemView(fileTmp, _this.edit));
                        _this.fileLst.push(fileTmp);
                        _this.updateViewLength();
                    });
                    $.ajaxSettings.async = true;
                },
                done: function (res) {
                    RemoveLoading();
                    var originalFilename = res.originalFilename;
                    if (res.code == '0') {
                        var url = res.data;
                        var fileImg = null;
                        _this.fileLst.forEach(function (value) {
                            if ((value.url == null || value.url === '') && value.nameFile === originalFilename) {
                                fileImg = value;
                                value.url = url;
                            }
                        });
                        console.log('_this.fileLst', _this.fileLst)
                        console.log('fileImg', fileImg)
                        if (url == null || url == ''){
                            layer.msg('上传失败', {icon: 5});
                            _this.onResault('fail','',{nameFile:originalFilename});
                        } else {
                            _this.onResault('success', url, fileImg);
                        }
                    } else {
                        layer.msg('上传失败', {icon: 5});
                        _this.onResault('fail','',{nameFile:originalFilename});
                    }
                },
                error: function () {
                    RemoveLoading();
                    layer.msg('上传失败', {icon: 5});
                    _this.onResault('fail','',null);
                }
            });
        },
        onResault: function (tag, url, addFile) {
            if ('fail' === tag) {
                for (var i = 0; i < this.fileLst.length; i++) {
                    var value = this.fileLst[i];
                    if ((value.url == null || value.url === '') && (addFile == null || value.nameFile === addFile.nameFile)) {
                        this.fileLst.splice(i, 1);
                        i = i - 1;
                    }
                }
            }else if ('success' === tag){
                var _this = this;
                if (addFile.typeFile == 1){
                    $(('#' + 'img_' + addFile.id)).attr('src', (imageURL + url));
                } else {
                }
            }
            this.updateViewLength();
            if (this.callBack != null) this.callBack(tag, url, addFile);
        },
        generateItemView: function (item, edit) {
            var idDel = 'delFile_' + item.id;
            var idShow = 'downDoc_' + item.id;
            var idDown = 'showDoc_' + item.id;
            var idImg = 'img_' + item.id;
            var idTxt = 'txt_' + item.id;
            var idDiv = 'div_' + item.id;
            var view = '';
            var viewStyle = edit ? 'width: 49%;left: 51%' : 'width: 100%';
            view += '<div class="layui-input-inline-upload-show box-rect" id="'+idDiv+'">';
            if (item.typeFile == 1) {
                view += '<div class="layui-input-inline-upload-button">';
                view += '	<img id="'+idImg+'" class="view-img" style="width:180px;height:120px" src="'+(imageURL + item.url)+'">';
                view += '</div>';
            }
            if (item.typeFile != 1) {
                view += '<div class="layui-input-inline-upload-button" id="'+idTxt+'">'+item.nameAccessory+'</div>';
            }
            if (edit) {
                view += '<div class="layui-input-inline-upload-show-delete btn-event" style="width: 49%;z-index: 9999999;" name="'+item.id+'" id="'+idDel+'">删除</div>';
            }
            if (item.typeFile != 1) {
                if (item.nameExt.toLowerCase() == '.pdf' && !edit){
                    view += '<div style="width: 49%;z-index: 9999999;" class="layui-input-inline-upload-show-delete btn-event" name="'+item.id+'" id="'+idDown+'">下载</div>';
                }else {
                    view += '<div style="' + viewStyle + ';z-index: 9999999;" class="layui-input-inline-upload-show-delete btn-event" name="'+item.id+'" id="'+idDown+'">下载</div>';
                }
            }
            if (item.typeFile == 1 || item.nameExt.toLowerCase() == '.pdf') {
                if (item.nameExt.toLowerCase() == '.pdf' && !edit){
                    view += '<div style="width: 49%;left: 51%;z-index: 9999999;" class="layui-input-inline-upload-show-delete btn-event" name="'+item.id+'" id="'+idShow+'">预览</div>';
                }else {
                    view += '<div style="' + viewStyle + ';z-index: 9999999;" class="layui-input-inline-upload-show-delete btn-event" name="'+item.id+'" id="'+idShow+'">预览</div>';
                }
            }
            if (item.nameFile){
                view += '<div style="display: block; margin-top: 5px; width: 180px;word-wrap:break-word;word-break: break-all;font-size: 13px" >'+item.nameFile+'</div>';
            }
            view += '</div>';
            var _this = this;
            setTimeout(function(){
                var delDiv=document.getElementById(idDel);
                if (delDiv != null){
                    delDiv.onclick=function(){
                        var id = $(this)[0].attributes.name.value;
                        var delFile;
                        for (var i = 0; i < _this.fileLst.length; i++) {
                            if (_this.fileLst[i].id === id) {
                                delFile = _this.fileLst[i];
                                _this.fileLst.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        $(this).parent().remove();
                        _this.updateViewLength();
                        if (_this.callBack != null && delFile != null) _this.callBack('delect', delFile);
                    };
                }
                var downDiv=document.getElementById(idDown);
                if (downDiv != null){
                    downDiv.onclick=function(){
                        var id = $(this)[0].attributes.name.value;
                        var file = _this.fileLst.filter(function (file) {
                            return file.id === id;
                        })[0];
                        _this.upload_down_doc(file.nameFile, file.url)
                    };
                }
                var showDiv=document.getElementById(idShow);
                if (showDiv != null){
                    showDiv.onclick=function(){
                        var id = $(this)[0].attributes.name.value;
                        var file = _this.fileLst.filter(function (file) {
                            return file.id === id;
                        })[0];
                        _this.upload_show_doc(file)
                    };
                }

            },300);
            return view;
        },
        upload_down_doc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+encodeURI(fileName);
            window.location.href = uri;
        },
        upload_show_doc: function (file) {
            if (file.nameExt.toLowerCase() == '.pdf'){
                var index = layer.open({
                    title: "预览",
                    type: 2,
                    area: ['80%', '80%'],
                    skin: "pdfview",
                    content: pdfViewUrl + imageURL + file.url,
                    end: function () {
                        layer.close(index);
                    }
                });
            }else {
                if (this.viewer != null){
                    this.viewer.close();
                    this.viewer = null;
                }
                this.viewer = new PhotoViewer([
                    {
                        src: fileURL+file.url,
                        title: file.nameAccessory
                    }
                ], {
                    appendTo:'body',
                    zIndex:99891018
                });
            }
        },
        updateFile: function (fileLst) {
            for (var i = 0; i < this.fileLst.length; i++) {
                var idDiv = 'div_' + this.fileLst[i].id;
                this.fileLst.splice(i, 1);
                i = i - 1;
                $(('#'+idDiv)).remove();
            }
            if (fileLst != null && fileLst.length > 0){
                var _this = this;
                fileLst.forEach(function (f) {
                    _this.fileLst.push(f);
                    for (var k in f) {
                        if (f[k] == null) {
                            f[k] = '';
                        }
                    }
                    $('#' + _this.clickId).before(_this.generateItemView(f, _this.edit));
                })
            }
            this.updateViewLength();
        },
        clearFile: function () {
            for (var i = 0; i < this.fileLst.length; i++) {
                var idDiv = 'div_' + this.fileLst[i].id;
                this.fileLst.splice(i, 1);
                i = i - 1;
                $(('#'+idDiv)).remove();
            }
            this.updateViewLength();
        },
        updateViewLength: function () {
            var addView = $('#' + this.clickId);
            if (this.maxLength !== -1 && addView != null && addView.length > 0) {
                if (this.fileLst.length < this.maxLength) {
                    addView.show();
                } else {
                    addView.hide();
                }
            }
        }
    };

    Upload.fn.init.prototype = Upload.fn;

    return Upload;
})();
