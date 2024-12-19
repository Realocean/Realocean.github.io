var gridTable;
var aaabbb = "123123123"
//接口配置
document.write('<script src="/static/templates/statics/js/api.js"></script>');
// document.write('<script src="./api.js"></script>');

 //本地
// baseURL = "/xz-admin-api/";
// pdfViewUrl = 'http://zlhy7:81/image-server/pdfjs/web/viewer.html?file=';
// imageURL = "http://zlhy7:81/nginx/";
// importURL = "http://zlhy7:81/nginx/";
// fileSaveURL = "http://zlhy7:81/nginx/";
// fileURL = "http://zlhy7:81/nginx/";
// (function () {})

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};
T.p = url;

//全局配置
$.ajaxSetup({
    dataType: "json",
    cache: false,
    timeout: 30000000, // 30秒超时时间
    // xhrFields: { withCredentials: true },
    beforeSend: function (xhr) {
        // console.log(xhr)
        // xhr.setRequestHeader('cookie',sessionStorage.getItem('cookie'))
    },
    complete: function (xhr) {
        // console.log(xhr)
        if (xhr.status == 401) {
            // if (top) {
            //     top.location.href = 'login.html';
            // } else {
            //     window.location.href = 'login.html';
            // }
        }
    }
});

//重写alert
window.alert = function (msg, callback) {
    layer.alert(msg, function (index) {
        layer.close(index);
        if (typeof (callback) === "function") {
            callback("ok");
        }
    });
}
/* 时间戳转化开始 */
Date.prototype.format = function (fmt) { //author: meizz  
    var o = {
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "h+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3),    //q是季付
        "S": this.getMilliseconds() //毫秒  
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//重写confirm式样框
window.confirm = function (msg, callback) {
    layer.confirm(msg, { btn: ['确定', '取消'] },
        function () {//确定事件
            if (typeof (callback) === "function") {
                callback("ok");
            }
        });
}

var loadingIndex = 0;

function PageLoading() {
    loadingIndex = layer.load(1, {
        shade: [0.1, '#fff']
    })
}

function RemoveLoading() {
    layer.close(loadingIndex);
}

// 正确写法，这样写，后面设置个别的时候就可以生效
if (window.layer) {
    $(document).bind("ajaxSend", function () {
        PageLoading();
    }).bind("ajaxComplete", function () {
        RemoveLoading();
    });
}

//在不需要加载loading的ajax中设置
// $.ajaxSetup({ global: false });
// 或
// $.ajax({
// 	url:url,
// 	method:'get',
// 	global:false,
// 	...
// })

function dateFormat(value) {
    if (value == null || value == '') {
        return "--";
    }
    var date = new Date(value).format("yyyy-MM-dd hh:mm:ss");
    return value ? date : "--";
}
function dateFormatYMD(value) {
    if (value == null || value == '' || value.length < 8) {
        return "--";
    }
    var date = new Date(value).format("yyyy-MM-dd");
    return value ? date : "--";
}

function dateFormatYMDHM(value) {
    if (value == null || value == '') {
        return "--";
    }
    var date = new Date(value).format("yyyy-MM-dd hh:mm");
    return value ? date : "--";
}

function getCurrPage(id, dataLength) {
    var limit = $('div[lay-id="' + id + '"]').find('span[class="layui-laypage-limits"]').find('option:selected').val();
    var page = $('div[lay-id="' + id + '"]').find('em[class="layui-laypage-em"]').next().html();
    var curr = 1;
    if (limit > 0 && page > 0 && dataLength > 0) {
        var maxPage = parseInt(dataLength / limit) + (dataLength % limit > 0 ? 1 : 0);
        curr = page > maxPage ? maxPage : page;
    }
    return curr;
}

Window.prototype.showloading = function (t) {
    if (t) {//如果是true则显示loading
        loading = layer.load(1, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
    } else {//如果是false则关闭loading
        layer.closeAll('loading');
    }
}
function formatBrandModelName(carBrandName, carModelName) {
    var carBrandSeriesModelName = "";
    if (carBrandName != undefined && carBrandName != null && carBrandName != '') {
        carBrandSeriesModelName = carBrandName;
    }
    if (carModelName != undefined && carModelName != null && carModelName != '') {
        if (carBrandSeriesModelName == '') {
            carBrandSeriesModelName = carModelName;
        } else {
            carBrandSeriesModelName = carBrandSeriesModelName + "/" + carModelName;
        }
    } else {
        if (carBrandSeriesModelName == '') {
            return "-";
        } else {
            return carBrandSeriesModelName;
        }
    }
    return carBrandSeriesModelName;
}

/**
 * 下载交还车pdf模板
 * @param pdfType
 */
function downPDF(pdfType) {
    var url = "";
    var fileName = "";
    if (pdfType == '1') {
        //签字交车单/验车单PDF
        url = "";
        fileName = "签字交车单/验车单PDF模板.pdf";
    } else if (pdfType == '2') {
        //盖章交车单PDF
        url = "";
        fileName = "盖章交车单PDF模板.pdf";
    } else if (pdfType == '3') {
        //还车签字单PDF
        url = "";
        fileName = "签字还车验车单PDF模板.pdf";
    } else if (pdfType == '4') {
        //还车盖章单PDF
        url = "";
        fileName = "盖章还车验车单PDF模板.pdf";
    }
    var uri = baseURL + 'order/companyordercar/download?uri=' + encodeURI(url) + "&fileName=" + fileName;
    window.location.href = uri;
}

/**
 * 金额格式化
 * @param num
 * @returns {string}
 */
function numFormat(num) {
    var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    return c;
}

function isEmpty(s,defauleStr) {
    if (s != null && String(s).length > 0 && s != 'null') {
        return s;
    } else {
        return defauleStr||'--';
    }
}

function isEmptyReturnNull(s) {
    if (s != null && String(s).length > 0 && s != 'null') {
        return s;
    } else {
        return null;
    }
}

function isNotEmpty(s) {
    if (s != null && s != '') {
        return true;
    } else {
        return false;
    }
}

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '_';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}


function checkNum(obj) {
    if (obj == undefined || obj == null) {
        return;
    }
    obj = obj.toString().replace(/^0+/g, '0');//第一个数不能为0 ，若为0替换为空
    obj = obj.toString().replace(/[^\d.]/g, "");//是否是数字 和小数点，若是除数字 和小数点之外的则替换为空
    obj = obj.toString().replace(/^\./g, "");//确证第一个为数字而不是“.”
    obj = obj.toString().replace(/\.{2,}/g, ".");//只能输入一个“.”
    obj = obj.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");//保证”.“只出现一次，而不能出现两次以上
    obj = obj.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   ]
    return obj;
}
function checkNumTenancy(value) {
    if (value == undefined || value == null) {
        return;
    }
    value = value.toString().replace(/^(0+)|[^\d]+/g, '')
    return value;
}

function aZ(obj) {
    obj.value = obj.value.replace(/([^A-Za-z])|([\x5c])/g, "");
}
function num(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
}
function numInteger(obj) {
    obj.value = obj.value.replace(/[^\d]/g, "");
}
function maxLength(obj, length) {
    if (length > 0 && length <= obj.value.length()) {
        obj.value = obj.value.substring(0, length);
    }
}
//里程数输入处理
function sumOdographInput(obj) {
    //修复第一个字符是小数点 的情况.
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
}
//点击图片查看图片原图
function previewImage(src) {
    var img = new Image();
    img.src = src;
    //获取图片宽度
    //var imgHtml = "<img src='" + src + "' />";
    var imgHtml = "<img src='" + src + "' width='500px' height='500px'/>";
    //弹出层
    layer.open({
        type: 1,
        shade: 0.8,
        offset: 'auto',
        area: [500 + 'px', 550 + 'px'],
        shadeClose: true,
        //点击外围关闭弹窗
        scrollbar: false,
        //不现实滚动条
        title: "图片预览",
        //不显示标题
        content: imgHtml,
        //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        cancel: function () {
            //layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
        }
    });
}

function formatBrandSeriesModelName(carBrandName, carSeriesName, carModelName) {
    var carBrandSeriesModelName = "";
    if (carBrandName != undefined && carBrandName != null && carBrandName != '') {
        carBrandSeriesModelName = carBrandName;
    }
    if (carBrandSeriesModelName != '') {
        if (carSeriesName != undefined && carSeriesName != null && carSeriesName != '') {
            carBrandSeriesModelName += "/" + carSeriesName;
        }
    } else {
        if (carSeriesName != undefined && carSeriesName != null && carSeriesName != '') {
            carBrandSeriesModelName += carSeriesName;
        }
    }

    if (carBrandSeriesModelName != '') {
        if (carModelName != undefined && carModelName != null && carModelName != '') {
            carBrandSeriesModelName += "/" + carModelName;
        }
    } else {
        if (carModelName != undefined && carModelName != null && carModelName != '') {
            carBrandSeriesModelName += carModelName;
        }
    }
    if (carBrandSeriesModelName == "") {
        return "--";
    }
    return carBrandSeriesModelName;
}

function validateMoney(money) {
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (reg.test(money)) {
        return "Y";
    }
    return "请输入正确的金额,且最多两位小数!";
}

function validateInteger(num) {
    var reg = /^[+]{0,1}(\d+)$/;
    if (reg.test(num)) {
        return "Y";
    }
    return "请输入正整数！";
}

function validateWidth(width) {
    var reg = /^-?\d+(\.\d{1,3})?$/;;
    if (reg.test(width)) {
        return "Y";
    }
    return "请输入正确的值,且最多三位小数!";
}

function previewImg(obj) {
    var imgHtml = "<img src='" + obj.currentTarget.src + "' />";
    //捕获页
    layer.open({
        type: 1,
        shade: false,
        title: false, //不显示标题
        //area:['600px','500px'],
        area: ['90%', '90%'],
        content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        cancel: function () {
            //layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
        }
    });
}

function jointStr(separator, ...strs) {
    var txt = '';
    if (strs != null && strs.length > 0) {
        strs.forEach(function (str) {
            if (str != null && str != '') {
                txt += ((separator || '/') + str);
            }
        })
    }
    txt = txt.length > 0 ? txt.substring(1) : txt;
    return txt;
}

var fileIdTmp = null;
function initializeUploadByConf(conf) {
    var elid = conf['elid'];
    var fileLst = conf['fileLst'];
    var callBack = conf['callBack'];
    var operationId = conf['operationId'];
    var operationName = conf['operationName'];
    var param = conf['param'];
    var fidedesc = conf['fidedesc'];
    var exts = conf['exts'];
    var acceptMime = conf['acceptMime'];
    elid = elid == '' ? [] : elid;
    fileLst = fileLst == null ? [] : fileLst;
    callBack = callBack == null ? function () { } : callBack;
    operationId = operationId == null ? sessionStorage.getItem("userId") : operationId;
    operationName = operationName == null ? sessionStorage.getItem("username") : operationName;
    fidedesc = fidedesc == null ? '附件' : fidedesc;
    acceptMime = acceptMime == null ? '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg' : acceptMime;
    exts = exts == null ? 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg' : exts;
    initializeUpload(elid, fileLst, callBack, operationId, operationName, param, fidedesc, acceptMime, exts);
}
/**
 *
 * @param elid upload绑定元素id
 * @param fileLst 保存文件列表，不能为null
 * @param callBack 回调
 * @param operationId 上传人
 * @param operationName 上传人
 * @param param 参数
 * @param fidedesc 附件描述
 */
function initializeUpload(elid, fileLst, callBack, operationId, operationName, param, fidedesc, acceptMime, exts) {
    var data = { 'path': 'doc' };
    if (param != null) for (var key in param) {
        data[key] = param[key];
    }
    var _fileName;
    var _base64;
    layui.upload.render({
        elem: ('#' + elid),
        url: baseURL + 'file/uploadFile',
        data: data,
        field: 'files',
        auto: true,
        size: 30 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: acceptMime,
        exts: exts, //
        choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                fileIdTmp = fileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: fileIdTmp,
                    operationId: operationId,
                    operationName: operationName,
                    nameDesc: fidedesc,
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                _fileName = fileName;
                _base64 = result.split(',')[1];
                fileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                fileLst.forEach(function (value) {
                    if (value.id === fileIdTmp) value.url = res.data[0];
                });
                callBack('success', res, _fileName, _base64);
            } else {
                layer.msg('上传失败', { icon: 5 });
                for (var i = 0; i < fileLst.length; i++) {
                    if (fileLst[i].id === fileIdTmp) {
                        fileLst.splice(i, 1);
                        i = i - 1;
                    }
                }
                callBack('fail', res);
            }
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', { icon: 5 });
            for (var i = 0; i < fileLst.length; i++) {
                if (fileLst[i].id === fileIdTmp) {
                    fileLst.splice(i, 1);
                    i = i - 1;
                }
            }
            callBack('fail');
            fileIdTmp = null;
        }
    });
}

/**
 * 上传文件组件初始化
 * @param uploadParams 参数
 * @param elem 文件上传元素选择器，这个必须形参传入
 */
function initUploadCommons(uploadParams,elem){
    // 其他参数有需要自己加
    /*
    path 上传文件位置
    nameDesc 附件备注
    vm，页面vm对象
    layui,前端对象某弹层的
    vm对象中文件id和列表对应属性名，默认为 fileLstId,fileLst
    multiple 是否多传
    delFileMethod 多文件上传，文件删除方法名
    */
    var defaultUploadParams = {
        "path": "uploadFile",
        "nameDesc": "附件备注",
        "vm": null,
        "vmPropertyName":["fileLstId","fileLst"],
        "layui": null,
        "multiple": true,
        "delFileMethod": "delFile",
        "operationId":sessionStorage.getItem("userId"),
        "operationName":sessionStorage.getItem("username"),
    };
    // 会覆盖原参数
    $.extend( defaultUploadParams,uploadParams);
    // vm中文件id属性名
    var fileLstIdPropertyName = defaultUploadParams.vmPropertyName[0];
    // vm中文件列表属性名
    var fileLstPropertyName = defaultUploadParams.vmPropertyName[1];
    // 没有vm对象就不往下走
    if(defaultUploadParams.vm==null || defaultUploadParams.vm[fileLstIdPropertyName]==null){
        return false;
    }
    layui.upload.render({
        elem: elem,
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path':defaultUploadParams.path},
        field:'files',
        auto:true,
        size: 50*1024*1024,
        accept: 'file',
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar',
        multiple: defaultUploadParams.multiple,
        number:20,
        done: function (res) {
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                defaultUploadParams.vm[defaultUploadParams.delFileMethod](fileIdTmp);
                fileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                fileIdTmp = defaultUploadParams.vm[fileLstIdPropertyName].length + '_' + uuid(60);
                var fileTmp = {
                    id: fileIdTmp,
                    operationId: defaultUploadParams.operationId,
                    operationName: defaultUploadParams.operationName,
                    nameDesc: defaultUploadParams.nameDesc,
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                defaultUploadParams.vm[fileLstPropertyName].push(fileTmp);
                defaultUploadParams.vm[fileLstIdPropertyName] = fileLstIdPropertyName+'_' + uuid(6);
            });
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            defaultUploadParams.vm[defaultUploadParams.delFileMethod](fileIdTmp);
            fileIdTmp = null;
        }
    });
}

var paymentMethodMap = { 1: '月付', 2: '两月付', 3: '季付', 4: '年付', 5: '一次性结清', 6: '半年付', 7: '日付', 8: '周付' };
var orderRentTypeMap = { 1: '经租', 2: '以租代购', 3: '展示车', 4: '试驾车', 5: '融租', 6: '直购', 7: '挂靠', 8: '直营' };
var billRentTypeMap = { 1: '经租', 2: '以租代购', 3: '展示车', 4: '试驾车', 5: '融租', 6: '直购', 7: '活动订单', 8: '挂靠', 9: '直营' };
var collectionTypeMap = { 0: "其他", 1: "保证金", 2: "租金", 3: "首付款", 4: "退车结算款", 5: "换车结算款", 6: "备用车结算款", 7: "整备费", 8: "尾款", 9: "定金", 10: "其他费用", 11: "车辆总单价", 12: "挂靠费", 13: "应付转下期", 14: "渠道返利", 15: "维保相关费用" };
var paymentTypeMap = { 0: "其他", 1: "微信小程序支付", 2: "公帐", 3: "私帐", 4: "银行卡", 5: "支付宝", 6: "微信", 7: "信用卡", 8: "pos", 9: "现金", 10: "代扣/银行卡" };

function getPaymentMethodStr(rentType) {
    return transformTypeByMap(rentType, paymentMethodMap);
}

function getRentTypeStr(rentType) {
    return transformTypeByMap(rentType, orderRentTypeMap);
}

function getBillRentTypeStr(rentType) {
    return transformTypeByMap(rentType, billRentTypeMap);
}

function getCollectionTypeStr(rentType) {
    return transformTypeByMap(rentType, collectionTypeMap);
}

function getPaymentTypeStr(rentType) {
    return transformTypeByMap(rentType, paymentTypeMap);
}

function transformTypeByMap(type, map) {
    return map == null || type == null ? '--' : (map[new String(type).trim()] || '--');
}

function getObjKey(obj, val) {
    for (var key in obj) {
        var value = obj[key];
        if (value != null && value == val) {
            return key;
        }
    }
}

function tableEditMaxlength(field, length) {
    $('td[data-field="' + field + '"]>input.layui-table-edit').attr('maxlength', length.toString());
}

function tableEditOninputNum(field) {
    $('td[data-field="' + field + '"]>input.layui-table-edit').attr('oninput', 'num(this)');
}

function tableEditOninputNumInteger(field) {
    $('td[data-field="' + field + '"]>input.layui-table-edit').attr('oninput', 'numInteger(this)');
}

function urlParamByObj(url, obj) {
    var paramsUrl = url + '?';
    for (var key in obj) {
        var value = obj[key];
        if (value != null && new String(value).length > 0) {
            paramsUrl += (key + '=' + value + '&')
        }
    }
    paramsUrl += ('a=' + uuid(16));
    return encodeURI(paramsUrl);
}

function initializeSearchDate(target, prefix, daterange) {
    var dateSelected = daterange.split(' - ');
    var start = dateSelected[0] + ' 00:00:00';
    var end = dateSelected[1] + ' 23:59:59';
    target[prefix + 'start'] = start;
    target[prefix + 'end'] = end;
}

function resetNULL(target) {
    for (var key in target) {
        target[key] = null;
    }
}

function urlToBase64(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function () {
            let canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            // 将图片插入画布并开始绘制
            canvas.getContext('2d').drawImage(image, 0, 0);
            // result
            let result = canvas.toDataURL('image/png')
            resolve(result);
        };
        // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
        image.setAttribute("crossOrigin", 'Anonymous');
        image.src = url;
        // 图片加载失败的错误处理
        image.onerror = () => {
            reject(new Error('转换失败'));
        };
    });
}

function contractExclude(contract) {
    return (contract.fileLst != null && contract.fileLst.length > 0) || attributeCount(contract, 'fileLst', 'contractType') > 0;
}

function attributeCount(obj, ...filterExclude) {
    var count = 0;
    for (var i in obj) {
        if ($.inArray(i, filterExclude) < 0 && isNotEmpty(obj[i])) {  // 建议加上判断,如果没有扩展对象属性可以不加
            count++;
        }
    }
    return count;
}



//金额输入处理
function moneyInput(value) {
    //修复第一个字符是小数点 的情况.
    let fa = '';
    if (value !== '' && value.substr(0, 1) === '.') {
        value = "";
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf(".") < 0 && value !== "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) === '0' && value.length === 2) {
            value = value.substr(1, value.length);
        }
    }
    value = fa + value;
    return value;
}

function toMoney(money) {
    return new Number(money || 0).toFixed(3).replace(/([0-9]+\.[0-9]{2})[0-9]*/, "$1");
}

function copeObjProperty(source, target) {
    if (source == null || target == null) return;
    for (var key in source) {
        target[key] = source[key];
    }
}

/***
 * 页面tab跳转
 * @param url 跳转地址
 * @param title 标题
 * @param obj   参数
 */
function addTab(url, title, obj) {
    top.parent.window.larryTab.tabAdd({
        id: Math.floor(Math.random() * (100 - 50)) + 50,
        href: url,
        title: title,
        params: obj
    })
}

/***
 * 关闭当前页面（tab）
 */
function closeCurrent() {
    var index = parent.layer.getFrameIndex(window.name);
    if (index) {//如果页面是layer打开的那么使用这个关闭
        parent.layer.closeAll();
        parent.vm.reload();
    } else {//如果页面不是layer打开的那么使用系统菜单tab关闭关闭当前页面
        top.parent.window.larryTab.tabCtrl("closeCurrent")
    }
}

// 权限请求缓存
var PromissionCache = {};
/**
 * 请求验证权限
 * @param {String[]} permission 权限字段
 * @returns {Promise<Boolean>} 是否有权限
 */
function hasPermission(permission) {
    return new Promise(function (resolve) {
        if (Array.isArray(PromissionCache[permission])) {
            PromissionCache[permission].push(resolve);
        } else {
            PromissionCache[permission] = [resolve];
            // console.log(permission, PromissionCache);
            $.ajax({
                url: baseURL + '/hasPermission?perm=' + permission,
                success: function (res) {
                    PromissionCache[permission].forEach(_resolve => {
                        // 测试无权限情景
                        // // var _permission = 'message:systemmessage:add'; // 想要屏蔽的权限
                        // var _permission = 'sys:user:update'; // 想要屏蔽的权限
                        // if (permission == _permission) {
                        //     _resolve(false);
                        // } else
                        _resolve(!!res.data);
                    });
                    delete PromissionCache[permission];
                },
                error: function () {
                    PromissionCache[permission].forEach(_resolve => {
                        _resolve(false);
                    });
                    delete PromissionCache[permission];
                }
            });
        }
    })
}

/**
 * 权限处理程序
 * @param {HTMLElement} el 验证权限DOM元素
 * @param {Object} binding 指令绑定对象
 * @param {String[]} binding.value 指令绑定值
 */
function permissionHandle(el, binding) {
    hasPermission(`${binding.value}`)
        .then(function (res) {
            res || el.remove();
        })
        .catch(function () {
            el.remove();
        })
        .finally(() => {
            $(el).show();
        })
}

/**
 * 自定义指令：按钮权限
 */

// console.log('vue==>', window.Vue)

function registerDirectives(app){
    // app是一个Vue实例
    app.directive('m-perm', {
    // 当被绑定的元素插入到 DOM 中时……
        mounted: function (el, binding) {
            // console.log('mounted', el ,binding)
            permissionHandle(el, binding)
        },
        beforeMount: function (el) {
    // $(el).attr('mf-perm',123);
            $(el).hide();
        }
    });
}

if(window.Vue.version.startsWith("3")){
    // console.log('vue3版本')
    // window.Vue && Vue.directive('m-perm', {
    //     // 当被绑定的元素插入到 DOM 中时……
    //     mounted: function (el, binding) {
    //         console.log('mounted', el ,binding)
    //         permissionHandle(el, binding)
    //     },
    //     beforeMount: function (el) {
    //         // $(el).attr('mf-perm',123);
    //         $(el).hide();
    //     }
    // });
}else{
    // console.log('vue2版本')
    window.Vue && Vue.directive && Vue.directive('m-perm', {
        // 当被绑定的元素插入到 DOM 中时……
        inserted: permissionHandle,
        bind: function (el) {
            // $(el).attr('mf-perm',123);
            $(el).hide();
        }
    });

}


/**
 * Hack 处理layui渲染的表格
 */
setInterval(function () {
    var el = $('[v-m-perm]');
    if (el && el.length) {
        Array.from(el).forEach(function (val) {
            var item = $(val);
            var permission = item.attr('v-m-perm');
            // console.log('首次获取', permission, JSON.parse(permission.replace(/\'/g,'"')));
            try {
                permission = JSON.parse(permission.replace(/\'/g, '"'));
            } catch (error) {
                permission = '';
            }
            permission && permissionHandle(val, { value: permission });
            item.removeAttr('v-m-perm');
            item.hide();
        })
    }
}, 300);

setTimeout(function(){
    var btns = document.querySelectorAll("a");
    for (var i = 0; i < btns.length; i++) {
        var btn = btns[i];
        if (btn && btn.innerText && ('查询' === btn.innerText || '导出' === btn.innerText)){
            btn.onmouseup = function () {
                // console.log(vm.q);
                trimQueryParam(vm.q);
                // console.log(vm.q);
            }
        }
    }
}, 100);

function trimQueryParam(obj) {
    console.log(':0')
    if (obj)for (var key in obj) {
        var value= obj[key];
        if (value && (typeof value=='string') && value.constructor == String) {
            Vue.set(obj, key, value.trim());
        }
    }
}

function isBlank(value) {
    return value == null || value === '';
}

function flowFieldPolishing(arr) {
    if (arr == null) return;
    flowFieldPolishing_attr(arr, 'v-if');
    flowFieldPolishing_attr(arr, 'v-show');
}

function flowFieldPolishingNull(arr) {
    if (arr == null) return;
    for (var key in arr) {
        if (!arr[key]) {
            arr[key] = {}
        }
    }
}

function flowFieldPolishing_attr(arr, attrKey) {
    var reg = /nodeFields\.(?!.*(\s))(.*?)\.(show|hide)/;
    $.each($('div['+attrKey+'^="nodeFields"]'), function (doc) {
        var rExe = $(this).attr(attrKey).match(reg);
        if (rExe != null && rExe.length > 2){
            var key = rExe[2];
            if (arr[key] == null) {
                arr[key] = {
                    show: false
                };
            }
        }
    });

    var txt = $('#carLstTable').attr('v-show');
    if (txt && txt.length > 0){
        var txts = txt.replace(/\s*/g, '').replace(/\./g, '').replace(/!/g, '').replace(/nodeFields/g, '').replace(/hide/g, '').split('||');
        $.each(txts, function (index,key) {
            if (arr[key] == null) {
                arr[key] = {
                    show: false
                };
            }
        });
    }
}

var settlementGroupDefault = {
    config1: {fieldHint:"可退金额"},
    config2: {fieldHint:"违章费用"},
    config3: {fieldHint:"保险费用"},
    config4: {fieldHint:"扣款费用"},
    config5: {fieldHint:"银行信息"},
    config6: {fieldHint:"退换车说明"},
};

function initSettlementFeeSnapshoot(viewSnapshoot){
    var serviceConfigDiv = $('#serviceConfig');
    if (serviceConfigDiv) {
        serviceConfigDiv.html(decodeURI(viewSnapshoot));
    }
}

function initSettlementFeeItemView(nodeFields, settlementFeeItem, confFey, param, callback){
    $.ajaxSettings.async = false;
    var editcallback = callback?callback:'editcallback';
    var serviceConfigDiv = $('#serviceConfig');
    if (serviceConfigDiv) {
        $.get(baseURL+"serviceconfig/serviceconfiggroup/listSys", function (r) {
            var customGroup = r.data;
            console.log(customGroup);
            feeGroupView(settlementFeeItem,confFey,serviceConfigDiv,param,customGroup,editcallback);
        });
        $.get(baseURL+"serviceconfig/serviceconfiggroup/listCustom", function (r) {
            var customGroup = r.data;
            console.log(customGroup);
            feeGroupView(settlementFeeItem,confFey,serviceConfigDiv,param,customGroup,editcallback);
        });
    }
    return encodeURI(serviceConfigDiv.html());
}

function feeGroupView(settlementFeeItem,confFey,serviceConfigDiv,param,customGroup,editcallback){
    if (customGroup != null && customGroup.length > 0) {
        for (var i = 0; i < customGroup.length; i++) {
            var group = customGroup[i];
            var view = '';
            view += '<legend class="aTitle customGroup '+(confFey+group.groupKey)+'">'+group.groupName+'</legend>';
            view += '<hr class="layui-bg-black customGroup '+(confFey+group.groupKey)+'">';
            view += '<div class="layui-row layui-form-row-content customGroup '+(confFey+group.groupKey)+'">';
            param['groupKey'] = group.groupKey;
            $.get(baseURL+"serviceConfig/listServiceConfig", param, function (r) {
                var data = r.data;
                if (data){
                    $.each(data, function (index, obj) {
                        view += feeItemView(settlementFeeItem, obj, editcallback);
                    })
                }
            });
            view += '</div>';
            serviceConfigDiv.append(view);
        }
    }
}

function feeItemView(settlementFeeItem, obj, editcallback) {
    var view = '';
    obj['value'] = '';
    settlementFeeItem[obj.serviceField] = obj;
    view += '<div class="layui-inline layui-col-md6 layui-col-sm6 layui-col-xs6">';
    if (obj.required == 1) {
        view += '    <label class="layui-form-label"><span style="color:red">*</span>'+obj.serviceName+':</label>';
    } else {
        view += '    <label class="layui-form-label">'+obj.serviceName+':</label>';
    }
    view += '    <div class="layui-input-inline">';
    view += '        <input type="text" class="layui-input" id="'+obj.serviceField+'"';
    view += '         v-model="settlementFeeItem.'+obj.serviceField+'.value"';
    if (obj.required == 1) {
        view += '         lay-verify="required"';
        // view += '         lay-verify="validate_'+obj.serviceField+'"';
    }
    if (obj.serviceProperty == 1 || obj.serviceProperty == 2) {
        view += '         oninput="edit(this, \'num\', \''+obj.serviceField+'\', \''+editcallback+'\',\'9999999.99\')"';
    } else {
        view += '         maxlength="200"';
    }
    view += '         placeholder="请输入'+obj.serviceName+'"';
    view += '         autocomplete="off">';
    view += '    </div>';
    view += '</div>';
    return view;
}

function visibleStateModification(nodeFields, confFey) {
    // console.log('nodeFields', nodeFields)
    // console.log('confFey', confFey)
    for (var i = 1; i < 9; i++) {
        var conf = nodeFields[confFey + i];
        // console.log('conf', conf)
        if (conf && conf.show) {
            $('.'+(confFey + i)).show();
            var inputs = $('.'+(confFey + i)+' input');
            if (!conf.edit || 'false' === conf.edit) {
                inputs.attr({'disabled': 'disabled','placeholder': ''})
                inputs.addClass('input-noborder');
                inputs.removeAttr('lay-verify');
                var span = inputs.parent().parent().find('label>span');
                if (span && span.length > 0) {
                    span.empty();
                }
            }
        } else {
            var inputs = $('.'+(confFey + i)+' input');
            inputs.removeAttr('lay-verify');
            $('.'+(confFey + i)).hide();
        }
    }
}
// function initSettlementFeeItemView(nodeFields, settlementFeeItem, confFey, param, callback){
//     $.ajaxSettings.async = false;
//     var editcallback = callback?callback:'editcallback';
//     var serviceConfigDiv = $('#serviceConfig');
//     if (serviceConfigDiv) {
//         var readonly = ' disabled style="border: none" ';
//         for (var i = 1; i < 7; i++) {
//             var conf = nodeFields[confFey + i];
//             if (conf && conf.show) {
//                 var view = '';
//                 view += '<legend class="aTitle">'+conf.fieldHint+'</legend>';
//                 view += '<hr class="layui-bg-black">';
//                 view += '<div class="layui-row layui-form-row-content">';
//                 param['serviceType'] = i;
//                 $.get(baseURL+"serviceConfig/listServiceConfig", param, function (r) {
//                     var data = r.data;
//                     if (data){
//                         $.each(data, function (index, obj) {
//                             obj['value'] = '';
//                             settlementFeeItem[obj.serviceField] = obj;
//                             view += '<div class="layui-inline layui-col-md6 layui-col-sm6 layui-col-xs6">';
//                             view += '    <label class="layui-form-label">'+obj.serviceName+':</label>';
//                             view += '    <div class="layui-input-inline">';
//                             view += '        <input type="text" class="layui-input" id="'+obj.serviceField+'"';
//                             view += '         v-model="settlementFeeItem.'+obj.serviceField+'.value"';
//                             if (obj.serviceProperty == 1 || obj.serviceProperty == 2) {
//                                 view += '         oninput="edit(this, \'num\', \''+obj.serviceField+'\', \''+editcallback+'\',\'9999999.99\')"';
//                             } else {
//                                 view += '         maxlength="50"';
//                             }
//                             if (!conf.edit) {
//                                 view += readonly;
//                             } else {
//                                 view += '         placeholder="请输入'+obj.serviceName+'"';
//                             }
//                             view += '         autocomplete="off">';
//                             view += '    </div>';
//                             view += '</div>';
//                         })
//                     }
//                 });
//                 view += '</div>';
//                 serviceConfigDiv.append(view);
//             }
//         }
//     }
//     return {
//         view:serviceConfigDiv.html()
//     };
// }

function settlementFeeItemAmount(settlementFeeItem) {
    var settleAmount = 0;
    for (var serviceField in settlementFeeItem) {
        var feeItem = settlementFeeItem[serviceField];
        if (feeItem.serviceProperty == 1){
            settleAmount = sub(settleAmount, feeItem.value);
        } else if (feeItem.serviceProperty == 2){
            settleAmount = add(settleAmount, feeItem.value);
        } else {}
        feeItem.updateTime="";
        feeItem.createTime="";
    }
    return {
        settleAmount:Math.abs(settleAmount),
        type:(settleAmount<=0)^0
    }
}

function sub(arg1, arg2) {
    return toMoney(new Number(arg1||0) - new Number(arg2||0));
}

function add(arg1, arg2) {
    return toMoney(new Number(arg1||0) + new Number(arg2||0));
}

function div(arg1, arg2) {
    return toMoney(new Number(arg1||0) / new Number(arg2||0));
}

function receivableOverdueDays(status,hzType,overdueDate,actualDate) {
    var overdueDays = null;
    if (overdueDate) switch (hzType^0) {
        case 1:{//全额坏账
            overdueDays = '--';
            break;
        }
        default:{//未坏账,部分坏账
            var currentDate = new Date().format("yyyy-MM-dd");
            switch (status^0) {
                case 4://已坏帐
                case 5:{//已作废
                    overdueDays = '--';
                    break;
                }
                default:{//待收款,已收款,待追帐,已退款,代扣扣款中,代扣失败,部分扣款成功
                    if (actualDate) {
                        currentDate = actualDate;
                    }
                    var diffTime = Date.parse(currentDate) - Date.parse(overdueDate);
                    if (diffTime < 0) {
                        overdueDays = 0;
                    } else {
                        overdueDays = Math.floor(diffTime / (1000 * 3600 * 24));
                    }
                }
            }
        }
    }
    return overdueDays;
}

function isImg(uri) {
    return (/png|jpg|jpeg/).test(uri);
}

function toCamel(str) {
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + $2.toUpperCase();
    });
}

function getTimeFinishRent(order) {
    var timeFinishRent = order.orderCar.timeFinishRent;
    var hasFreeDays = order.plan.hasFreeDays;
    var freeDays = order.plan.freeDays;
    var finishRent;
    if(timeFinishRent == null){
        return '--';
    }
    if (hasFreeDays == 1 && freeDays != null && freeDays != ''){
        finishRent =  new Date(timeFinishRent);
        finishRent.setDate(finishRent.getDate() + freeDays);
    }
    return finishRent ? finishRent.format('yyyy-MM-dd') : timeFinishRent;
}

function getDecimalNumber(val){
    const decimalPart = Number(val).toString().split('.')[1];
    return decimalPart ? decimalPart.length : 0;
}

function isOpenSgin(sign,defaultsign,order) {
    var order_alipay_daikou_sign = sign == 1 && order != null && order.tsStatus != null && order.tsStatus != 0 && order.repaymentMethod == 4;
    var order_default_sign = defaultsign == 1 && (order == null || order.tsStatus == null || order.tsStatus == 0);
    return order_alipay_daikou_sign||order_default_sign;
}

function PrintHtml(printHtml) {
    var iframe = document.createElement('IFRAME');
    var doc = null;
    iframe.setAttribute('id', 'iframe_'+uuid(16));
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    // 这里可以自定义样式
    doc.write('<style type="text/css"> ' +
        '/* 分页符 */\n' +
        '        .print_gap{page-break-before: always;}\n' +
        '        .print_gap .gap_line {height: 1px; background: #e5e5e5; margin: 40pt 0 30pt; }\n' +
        '\n' +
        '        /* 浏览器打印预览及最终打印的样式 */\n' +
        '        @media print{\n' +
        // '            /* 去除页眉页脚 */\n' +
        // '.waifu, .cPlayer, #back-to-top, .text-bar, .respond, .comment_reply, #postnav, #footer {\n' +
        // '        visibility: hidden !important;\n' +
        // '    }'+
        // '    .header{' +
        // '     visibility: hidden !important;' +
        // '}'+
        '  div table img{\n' +
        '    page-break-inside: avoid;\n' +
        '  }'+
        '            @page { size: auto;}\n' +
        '            body{width:580pt; margin: 0 auto; padding: 0 30px; height: auto;}\n' +
        '            .print_page .print_item{padding-top: 15pt;}\n' +
        '\n' +
        '            .app_sidebar, .app_topbar, .fixed_head { display: none; }\n' +
        '            .app_main, .app_main .main, #page{padding: 0;}\n' +
        '            .print_gap .gap_line{margin: 0; visibility: hidden;}\n' +
        '            .noprint { display: none; }\n' +
        '            input.text{border:none;}\n' +
        '            input.text::placeholder{visibility: hidden;}\n' +
        '        }' +
    '</style>');
    doc.write(printHtml);
    doc.close();
    iframe.contentWindow.focus();
    setTimeout(function () {
        iframe.contentWindow.print();
    },500);
    if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe);
    }
}



function getSearchDateByType(type){
    // var _this = this;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();
    var dayOfWeek = now.getDay();
    var dateValue = '';
    switch (parseInt(type)) {
        case 0:{//昨天
            var aback = new Date();
            aback.setDate(now.getDate() - 1);
            dateValue = formatDate(aback) + ' - ' + formatDate(aback);
            break;
        }
        case 1:{//今天
            dateValue = formatDate(now) + ' - ' + formatDate(now);
            break;
        }
        case 2:{//上周
            var aback = new Date();
            aback.setDate(now.getDate() - 7);
            var aback_year = aback.getFullYear();
            var aback_month = aback.getMonth();
            var aback_day = aback.getDate();
            var aback_dayOfWeek = aback.getDay();
            dateValue = getWeekStartDate(aback_year, aback_month, aback_day, aback_dayOfWeek) + ' - ' + getWeekEndDate(aback_year, aback_month, aback_day, aback_dayOfWeek);
            break;
        }
        case 3:{//本周
            dateValue = getWeekStartDate(year, month, day, dayOfWeek) + ' - ' + getWeekEndDate(year, month, day, dayOfWeek);
            break;
        }
        case 4:{//上月
            var nowdays = new Date();
            var aback_year = nowdays.getFullYear();
            var aback_month = nowdays.getMonth();
            if(aback_month==0){
                aback_month = 12;
                aback_year = aback_year-1;
            }
            dateValue = (aback_year + '-' + formatDayNum(aback_month) + '-01') + ' - ' + (aback_year + '-' + formatDayNum(aback_month) + '-' + getMonthLastday(aback_year, aback_month));
            break;
        }
        case 5:{//本月
            dateValue = (year + '-' + formatDayNum(month+1) + '-01') + ' - ' + (year + '-' + formatDayNum(month+1) + '-' + getMonthLastday(year, month+1));
            break;
        }
        case 6:{//本季
            if (month == 0 || month == 1 || month == 2) {
                dateValue = year + '-01-01' + ' - ' + year + '-3-31';
            }else if (month == 3 || month == 4 || month == 5) {
                dateValue = year + '-04-01' + ' - ' + year + '-6-30';
            }else if (month == 6 || month == 7 || month == 8) {
                dateValue = year + '-07-01' + ' - ' + year + '-9-30';
            }else if (month == 9 || month == 10 || month == 11) {
                dateValue = year + '-10-01' + ' - ' + year + '-12-31';
            }
            break;
        }
        case 7:{//本年
            dateValue = year + '-01-01' + ' - ' + year + '-12-31';
            break;
        }
    }
    // console.log('时间', dateValue)

    var dateSelected = dateValue.split(' - ');
    var start = dateSelected[0] + ' 00:00:00';
    var end = dateSelected[1] + ' 23:59:59';

    return [start, end]

    // return dateValue;
}
function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    return (year + '-' + formatDayNum(month) + '-' + formatDayNum(day));
}
function formatDayNum(num) {
    if(num < 10){
        num = '0' + num;
    }
    return num;
}
function getWeekStartDate(year, month, day, dayOfWeek) {
    var weekStartDate = new Date(year, month, day-(dayOfWeek-1));
    return formatDate(weekStartDate);
}
function getWeekEndDate(year, month, day, dayOfWeek) {
    var weekEndDate = new Date(year, month, day + (7 - dayOfWeek));
    return formatDate(weekEndDate);
}
function getMonthLastday(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:{
            return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11:{
            return 30;
        }
        case 2:{
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        }
    }
}

function debounce(fn, delay) {
    const delays = delay || 200
    let timer
    return function () {
        const th = this
        const args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            timer = null
            fn.apply(th, args)
        }, delays)
    }
}

function initializeShowLv(nodeFields, nodeField,viewTag) {
    console.log("initializeShowLv"+111111)
    if (nodeField != null && nodeField.length > 0){
        nodeField.forEach(function (section) {
            getShowLv(nodeField, nodeFields, section.moduleInfo);
            if (section.fields != null && section.fields.length > 0) {
                section.fields.forEach(function (field) {
                    getShowLv(nodeField, nodeFields, section.moduleInfo, field.classLevel, field.fieldInfo,viewTag);
                });
            }
        });
    }
}

function getShowLv(nodeField, nodeFields, moduleInfo, classLevel, fieldInfo,viewTag) {
    var key = '';
    var model = {
        'show':false,
        'edit':false,
        'visible':false,
        'hide':false,
        'required':false,
        'applyWatch':false,
        'classLevel':'',
        'fieldInfo':'',
        'verify':'',
        'fieldHint':''
    };
    var section = {};
    if (isNotEmpty(moduleInfo)) {
        key += moduleInfo;
        section = nodeField.filter(function (m) {
            return m.moduleInfo === moduleInfo;
        })[0];
        model.edit = section.moduleConfig == 2;
        model.visible = section.moduleConfig == 1;
        model.hide = section.moduleConfig == 3;
    }
    var field = {};
    if (isNotEmpty(classLevel) && isNotEmpty(fieldInfo) && isNotEmpty(section)) {
        key += ('_'+classLevel+'_'+fieldInfo);
        field = section.fields.filter(function (f) {
            return  f.classLevel === classLevel && f.fieldInfo === fieldInfo;
        })[0];
        model.classLevel = field.classLevel;
        model.fieldInfo = field.fieldInfo;
        model.edit = Boolean(field.edit === true || field.edit === 'true');
        model.visible = Boolean(field.visible === true || field.visible === 'true');
        model.hide = Boolean(field.hide === true || field.hide === 'true');
        console.log('===>', field.required)
        model.required = Boolean(field.required === true || field.required === 'true') ? 'required':false;
        model.applyWatch = Boolean(field.applyWatch === true || field.applyWatch === 'true');
        model.fieldHint = field.fieldHint;
        if(viewTag == 'approveDetail'){
            model.visible = field.edit||field.visible;
            model.visible=true;
            model.edit = false;
        }
        if(viewTag == 'applyDetail'){
            model.visible = field.applyWatch;
            model.edit = false;
        }
    }
    model.show = model.visible || model.edit;
    nodeFields[key] = model;
}
