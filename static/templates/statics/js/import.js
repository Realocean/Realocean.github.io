document.write('<script src="../../statics/common/xlsx/dist/xlsx.core.min.js"></script>');
document.write('<script src="../../statics/common/layui_exts/excel.js"></script>');

var Import = (function (w) {
    /**
     *
     * @param elid 绑定标签id，不能为null
     * @param typeStr 导入标题
     * @param templetUrl 模板地址
     * @param actionUrl 导入请求地址，该请求返回根数据对象需包含：all-该次导入全部数量
                                                          success-导入成功数量
                                                          fail-导入失败数量
                                                          allDatas-所有导入数据列表（防止数据在交互或序列化过程中存在排序操作，需转为json字符串）
                                                          failDatas-失败数据列表（防止数据在交互或序列化过程中存在排序操作，需转为json字符串）
     * @param colLst （选填）自定义回显数据列，如不使用该参数列回显数据时，须确保excel文档列与解析数据实体列顺序一致
     * @param callBack （选填）回调函数
     * @param fieldName （选填）actionUrl请求中field名
     * @param dataParam （选填）actionUrl请求中额外参数
     * @param hasShowReview （选填）是否需要回显，默认为true
     * @param beanName （选填）如需下载错误数据是，需配置exl实体类全路径
     * @param reviewFieldTransformMap （选填）自动生成预览时，预览字段转义对应map表
     *                                  {
     *                                      field1 : {1:'name1',2:'name2'}
     *                                  }
     * @returns {Import.init|init}
     * @constructor
     * @desc 使用示例：
     * ① new Import({
            elid:'impBody',
            typeStr:'账单',
            templetUrl:'importData/clnj/clnjdr.xlsx',
            actionUrl:'maintenance/inspectionmanage/import',
            fieldName:'file',
            beanName:'io.xz.modules.maintenance.excel.InspectionManageBean',
        }).initView();
       ② new Import({
            elid:'impBody',
            typeStr:'账单',
            templetUrl:'importData/clnj/clnjdr.xlsx',
            actionUrl:'maintenance/inspectionmanage/import',
        }).initView();
       ③ new Import({
            elid:'impBody',
            typeStr:'账单',
            templetUrl:'importData/clnj/clnjdr.xlsx',
            actionUrl:'maintenance/inspectionmanage/import',
            colLst:[
                {field:'operatorName', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
                {field:'memo', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
                {field:'timeCreate', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
            ],
            callBack:function(tag,res){

            },
            reviewFieldTransformMap:{
                customerType:{1:'企业',2:'个人'},
                paymentMethod:{1:'月付',2:'两月付',3:'季付',6:'半年付',4:'年付',5:'一次性结清'}
            }
        }).initView();
     *
     */
    var Import = function (elid, typeStr, templetUrl, actionUrl, colLst, callBack, fieldName, dataParam, hasShowReview, beanName, reviewFieldTransformMap) {
        if (elid == null){
            throw '参数不能为空';
        }
        if (typeof elid === 'object') {
            var conf = elid;
            return new Import.fn.init(conf.elid, conf.typeStr, conf.templetUrl, conf.actionUrl, conf.colLst, conf.callBack, conf.fieldName, conf.dataParam, conf.hasShowReview, conf.beanName, conf.reviewFieldTransformMap);
        }else {
            return new Import.fn.init(elid, typeStr, templetUrl, actionUrl, colLst, callBack, fieldName, dataParam, hasShowReview, beanName, reviewFieldTransformMap);
        }
    };

    Import.fn = Import.prototype = {
        constructor: Import,
        init: function (elid, typeStr, templetUrl, actionUrl, colLst, callBack, fieldName, dataParam, hasShowReview, beanName, reviewFieldTransformMap) {
            this.elid = elid;
            this.typeStr = typeStr;
            this.templetUrl = templetUrl;
            this.actionUrl = actionUrl;
            this.colLst = (colLst == null ? [] : colLst);
            this.callBack = callBack;
            this.fieldName = fieldName;
            this.dataParam = dataParam;
            this.hasShowReview = false; // = hasShowReview == null ? true : new Boolean(hasShowReview);
            this.beanName = beanName;
            this.reviewFieldTransformMap = reviewFieldTransformMap;
            this.reader = null;
            this.rABS = false;
            this.tableObj = null;
            this.colNames = [];
            this.expCols = [];
            this.failDatas = [];
            this.autoCols = colLst == null || JSON.stringify(colLst).length < 50;
            this.downTempletId = 'downTemplet_' + uuid(16);
            this.uploadId = 'uploadXls_' + uuid(16);
            this.viewFailDataId = 'viewFailData_' + uuid(16);
            this.reviewDataId = 'reviewDataData_' + uuid(16);
            this.msgId = 'msg_' + uuid(16);
            this.initView = function () {
                this.initializeView();
            }
        },
        initializeView: function () {
            var _this = this;
            var parent = $('#' + _this.elid);
            var view = '';
            view += '<div class="details-conteiner">';
            view += '    <div class="details-content-box">';
            view += '        <div class="list-search-sup-title new-layui-title fm-daoru-title">';
            view += '            导入'+_this.typeStr+'信息';
            view += '        </div>';
            view += '        <div class="list-search-sup-title new-layui-title">';
            view += '            <div style="display:flex;align-items:center">'
            view += '            <img style="width: 80px; margin-right: 10px;" src="../../statics/images/shuju-2@2x.png">'
            view += '            <div>'
            view += '               <div class="fm-subsub-title">请填写导入数据信息</div>'
            view += '               <div style="font-size: 14px;color:#999;margin:10px 0;">提示：请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</div>';
            view += '               <a id="'+_this.downTempletId+'" type="button" class="fm-button-text">下载模板 <i class="larry-icon larry-huancun" style="margin-left:5px" /></a>';
            view += '            </div>';
            view += '            </div>';
            view += '        </div>';
            view += '        <div class="list-search-sup-title new-layui-title">';
            view += '            <div style="display:flex;align-items:center">'
            view += '            <img style="width: 80px; margin-right: 10px;" src="../../statics/images/wenjianjia@2x.png">'
            view += '            <div>'
            view += '            <div class="fm-subsub-title">请上传导入文件</div>'
            view += '            <div style="font-size: 14px;color:#999;margin:10px 0;">提示：文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M，最多支持导入3000条数据</div>';
            view += '            <a id="'+_this.uploadId+'" type="button" class="fm-button-text">点击上传<i class="larry-icon larry-friendLink2"  style="margin-left:5px" /></a>';
            view += '            </div>';
            view += '            </div>';
            view += '        </div>';
            if (_this.hasShowReview) {
                view += '        <div class="list-search-sup-title new-layui-title fm-daoru-title">';
                view += '            ' + _this.typeStr + '信息预览';
                view += '        </div>';
                view += '        <div class="details-layui-row" id="txtDiv">';
                view += '            <span id="' + _this.msgId + '">本次共计导入数据 条，成功 条，失败 条</span>';
                view += '            <a class="layui-grid-btn-xs" style="margin-left: 30px;" id="' + _this.viewFailDataId + '">点此查看失败数据</a>';
                view += '        </div>';
                view += '        <div class="details-layui-row" id="reviewDiv">';
                view += '            <div class="table">';
                view += '                <table class="layui-hide" id="' + _this.reviewDataId + '" lay-filter="review"></table>';
                view += '            </div>';
                view += '        </div>';
            }
            view += '    </div>';
            view += '</div>';
            parent.append(view);
            if (_this.hasShowReview) {
                this.initXlsRead();
                this.initializeTable();
            }
            this.initializeUpload();
            this.initializeOnClickListener();
        },
        initializeUpload: function () {
            var _this = this;
            var data = {};
            if (_this.dataParam != null) for (var key in _this.dataParam) {
                data[key] = _this.dataParam[key];
            }
            layui.upload.render({
                elem: ('#' + _this.uploadId),
                url: baseURL + _this.actionUrl,
                data: data,
                field: _this.fieldName || '',
                auto: true,
                size: 10 * 1024 * 1024,
                accept: 'file', //普通文件
                acceptMime: '.xls,.xlsx',
                exts: 'xls|xlsx', //
                multiple: true,
                number:20,
                choose: function (obj) {
                    PageLoading();
                    $.ajaxSettings.async = false;
                    // var files = obj.pushFile();
                    obj.preview(function (index, file, result) {
                        if (_this.hasShowReview && _this.autoCols) _this.readXls(file, result);
                    });
                    $.ajaxSettings.async = true;
                },
                done: function (res) {
                    RemoveLoading();
                    _this.failDatas=[];
                    if (res.resultFlag == '1') {
                        _this.onResault('success', res);
                    } else {
                        // layer.msg('上传失败', {icon: 5});
                        _this.onResault('fail', res);
                    }
                },
                error: function () {
                    RemoveLoading();
                    _this.failDatas=[];
                    layer.msg('上传失败', {icon: 5});
                }
            });
        },
        initXlsRead: function(){
            var _this = this;
            _this.reader = new FileReader();
            _this.reader.onload = function(e) {
                $.ajaxSettings.async = false;
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
                for (var sheet in workbookSheets) {
                    if (workbookSheets.hasOwnProperty(sheet)) {
                        fromTo = workbookSheets[sheet]['!ref'];
                        var xlsxData = XLSX.utils.sheet_to_json(workbookSheets[sheet]);
                        // 结果数组
                        // console.log(JSON.stringify(xlsxData.slice(0,3)));
                        _this.initializeTableCols(xlsxData.slice(0,3));
                    }
                }
                $.ajaxSettings.async = true;
            };
        },
        initializeTableCols: function (xlsxData) {
            var _this = this;
            if (_this.autoCols && xlsxData != null && xlsxData.length > 0){
                _this.colNames.splice(0);
                xlsxData = JSON.parse(JSON.stringify(xlsxData));
                for (var i = 0; i < Math.min(3, xlsxData.length); i++) {
                    var xlsCol = xlsxData[i];
                    if (Object.getOwnPropertyNames(xlsCol).length > _this.colNames.length){
                        _this.colNames.splice(0)
                        for (var key in xlsCol){
                            var value = xlsCol[key].replace('*', '');
                            if (value === '导入状态' || value === '错误信息'){
                                continue;
                            }
                            _this.colNames.push(value)
                        }
                    }
                }
                _this.colNames.push('导入状态');
                _this.colNames.push('备注');
                console.log(_this.colNames);
                //
                _this.colLst.splice(0);
                for (var i = 0; i < _this.colNames.length; i++) {
                   var title = _this.colNames[i];
                    _this.colLst.push(
                        {
                            title: title,
                            fieldIndex: i,
                            minWidth: 200,
                            templet: function (d) {
                                var obj = JSON.parse(JSON.stringify(d));
                                delete obj.LAY_INDEX;
                                delete obj.LAY_TABLE_INDEX;
                                var array=new Array();
                                var j=0;
                                for(var key in obj) {
                                    var value = obj[key];
                                    if (_this.reviewFieldTransformMap != null && _this.reviewFieldTransformMap.hasOwnProperty(key)){
                                        value = transformTypeByMap(value, _this.reviewFieldTransformMap[key]);
                                    }
                                    array[j++]=value;
                                }
                                var index = $(this)[0].fieldIndex;
                                return isEmpty(array.length > index ? array[index]:'');
                            }
                        }
                    );
                }
            }
        },
        initializeTable: function () {
            var _this = this;
            layui.config({
                base: '../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            }).use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
                _this.tableObj = layui.table.render({
                    id: "reviewid",
                    elem: ('#' + _this.reviewDataId),
                    data: [],
                    cols:[],
                    page: true,
                    loading: true,
                    limits: [10, 20, 50, 100],
                    limit: 10,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function(res, curr, count){
                        layui.soulTable.render(this);
                        setTimeout(function(){
                            var tableWidth = $('div[lay-id="reviewid"]>div[class="layui-table-box"]>div>table').width();
                            var defaultWidth = $('#' + _this.elid).parent().width();
                            var width = Math.max(tableWidth, defaultWidth);
                            $('#reviewDiv').width(width);
                            $('#reviewDiv>div[class="table"]').width(width);
                            $('div[lay-id="reviewid"]').width(width);
                            $('div[lay-id="reviewid"]>div[class="layui-table-box"]').width(width);
                            $('div[lay-id="reviewid"]>div[class="layui-table-box"]').children().width(width);
                        }, 10);
                    }
                });
            });
        },
        initializeOnClickListener: function () {
            var _this = this;
            setTimeout(function(){
                var downTemplet = document.getElementById(_this.downTempletId);
                if (downTemplet != null){
                    downTemplet.onclick = function(){
                        window.location.href = importURL+_this.templetUrl;
                    };
                }
                //
                var viewFailData = document.getElementById(_this.viewFailDataId);
                if (viewFailData != null){
                    viewFailData.onclick = function(){
                        _this.viewFailData();
                    };
                }
                //
            },300);
        },
        viewFailData: function () {
            var _this = this;
            if (_this.failDatas == null || _this.failDatas.length < 1){
                alert("无失败数据");
            }else {
                var index = layer.open({
                    title: "查看失败数据",
                    type: 2,
                    area: ['80%', '80%'],
                    boxParams: {
                        failDatas:_this.failDatas,
                        colNames:_this.colNames,
                        colLst:_this.colLst,
                        beanName:_this.beanName,
                    },
                    content: tabBaseURL + "modules/utils/viewfaildatas.html",
                    end: function () {
                        layer.close(index);
                    }
                });
            }
        },
        onResault: function (tag, res) {
            var _this = this;
            console.log(JSON.stringify(res));
            // if ('fail' === tag) {
            //
            // }else if ('success' === tag){
            //
            // }
            var allDatas = [];
            if (res.hasOwnProperty('resultFlag')){
                var msgTxt = '本次共计导入数据'+(res.all^0)+'条，成功'+(res.success^0)+'条，失败'+(res.fail^0)+'条';
                $('#' + _this.msgId).html(msgTxt);
                //
                if (res.allDatas){
                    allDatas = JSON.parse(res.allDatas);
                }
                if (res.failDatas){
                    _this.failDatas = JSON.parse(res.failDatas);
                }
                alert(res.msg, function(index){});
            }else {
                layer.msg(res.msg || '上传失败', {icon: 5});
            }
            if (_this.hasShowReview) {
                layui.table.reload(
                    'reviewid',
                    {
                        page: {curr: 1},
                        cols: [_this.colLst],
                        data: allDatas
                    }
                );
            }
            if (this.callBack != null) this.callBack(tag, res);
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
    };

    Import.fn.init.prototype = Import.fn;

    return Import;
})();
