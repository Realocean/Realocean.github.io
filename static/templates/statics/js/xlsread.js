var XlsRead = (function (w) {
    var XlsRead = function (conf) {
        return new XlsRead.fn.init(conf.elid, conf.callback);
    };

    XlsRead.fn = XlsRead.prototype = {
        constructor: XlsRead,
        init: function (elid, callback) {
            this.elid = elid;
            this.callback = (callback == null ? function () {} : callback);
            this.reader = null;
            this.rABS = false;
            this.initView = function () {
                this.initializeView();
            }
        },
        initializeView: function () {
            this.uploadRender();
            this.initXlsRead();
        },
        uploadRender: function () {
            var _this = this;
            var supplierDoc = $(('#'+_this.elid));
            $('#importXls').remove();
            $('#commit').remove();
            var viewUpload = '';
            viewUpload += '<a class="layui-btn layui-btn-checked" id="importXls" style="width: 104px;">批量导入</a>';
            viewUpload += '<a class="layui-btn layui-btn-checked" id="commit" style="width: 104px;z-index: 99;position: relative;left: -104px">批量导入</a>';
            supplierDoc.append(viewUpload);
            // supplierDoc.append('<a class="layui-btn layui-btn-checked" id="importXls" style="margin: 15px 15px 15px 0;">批量导入</a>');
            layui.upload.render({
                elem: '#importXls',
                field:'files',
                accept: 'file',
                auto:false,
                acceptMime: '.xls,.xlsx',
                exts: 'xls|xlsx', //
                choose: function(obj){
                    obj.preview(function(index, file, result){
                        _this.readXls(file, result);
                    });
                },
            });

            $('#commit').on('click', function () {
                if (_this.callback) {
                    if (_this.callback('onBeforeUpload')) {
                        $('#importXls').click();
                    }
                } else {
                    $('#importXls').click();
                }
            });
        },
        readXls: function (file, result) {
            if(this.rABS) {
                this.reader.readAsArrayBuffer(file);
            } else {
                this.reader.readAsBinaryString(file);
            }
        },
        fixdata: function(data){
            var o = "", l = 0, w = 10240;
            for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        },
        initXlsRead: function(){
            var _this = this;
            _this.reader = new FileReader();
            _this.reader.onload = function(e) {
                $.ajaxSettings.async = false;
                showloading(true);
                var data = e.target.result;
                var wb;//读取完成的数据
                if(_this.rABS) {
                    wb = XLSX.read(btoa(_this.fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                var workbookSheets = wb.Sheets;
                var importCount = 0;
                var errCol = [];
                for (var sheet in workbookSheets) {
                    if (workbookSheets.hasOwnProperty(sheet)) {
                        fromTo = workbookSheets[sheet]['!ref'];
                        var xlsxData = XLSX.utils.sheet_to_json(workbookSheets[sheet]);
                        // 结果数组
                        _this.callback('onDateReady', xlsxData);
                        for (var key in xlsxData) {
                            var successCount = (_this.callback('onDateItemRead', xlsxData[key]))^0;
                            if (successCount > 0){
                                importCount += successCount;
                            }else {
                                errCol.push(xlsxData[key]);
                            }
                        }
                    }
                }
                _this.callback('onDateFinish', importCount);
                var content = '导入'+importCount+'条数据';
                var errCount = errCol.length;
                var errDatas;
                var btn = [];
                if (errCount > 0){
                    content += '<br/>';
                    content += ('失败'+errCount+'条');
                    btn.push('下载失败数据');
                    var colTmp = errCol[0];
                    var title = {};
                    for (var key in colTmp) {
                        if (!/--(.*?)--/.test(key)){
                            title[key] = key;
                        }
                    }
                    errDatas = JSON.parse(JSON.stringify(errCol));
                    errDatas.unshift(title);
                }
                btn.push('关闭');
                var index = layer.confirm(content, {
                    btn: btn
                }, function () {
                    if (errCount > 0) {
                        layui.excel.exportExcel({
                            sheet1: errDatas
                        }, '错误数据.xlsx', 'xlsx');
                    }
                    layer.close(index);
                }, function () {
                    layer.close(index);
                });
                showloading(false);
                $.ajaxSettings.async = true;
                _this.uploadRender();
            };
        }
    };

    XlsRead.fn.init.prototype = XlsRead.fn;

    return XlsRead;
})();