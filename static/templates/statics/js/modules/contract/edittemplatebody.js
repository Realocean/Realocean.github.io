$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable', 'base64'], function () {
        init(layui);
        layui.form.render();
    });
});
var editor = null;
var ue = null;
var array = [];
var callback;
var templateBody;
var vm = new Vue({
    el: '#rrapp',
    data: {
        verify: false,
    },
    created: function () {
        var _this = this;
        _this.getConfig();
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            callback = param.callback;
            templateBody = param.templateBody;
        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        getConfig: function () {
            $.ajax({
                type: "GET",
                url: baseURL + 'contract/contractemplate/getContractemplateconf',
                contentType: "application/json",
                success: function (r) {
                    if (r.code === 0) {
                        array = r.conf || [];
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            });

        },
        saveOrUpdate: function (event) {
            let str = ue.getAllHtml() || '';
            $("#copyEditor").html(str.replace(/\[\[/g, '').replace(/\]\]/g, ''));
            $("#copyEditor span").each(function (index, element) {
                let key = $(element).attr('id_key');
                if (key) {
                    $(element).html('[[' + key + ']]')
                }
            })
            if (callback) callback($("#copyEditor").html());
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initData();

    initEventListener(layui);
    initUpload(layui.upload);
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initUpload(upload) {
}

function initVerify(form) {
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function initTable(table, soulTable) {

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}


function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

function initData() {
    ue = UE.getEditor('container');
    ue.setOpt('maximumWords', 1024 * 1024 * 500);
    ue.setOpt('wordCount', false);
    ue.setOpt('wordOverFlowMsg', '<span style="color:red;">你输入的字符个数已经超出最大允许值，服务器可能会拒绝保存！</span>');
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function (action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return baseURL + '/file/uploadMonofile';
        } else if (action == 'uploadvideo') {
            return baseURL + 'file/uploadMonofile';
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }
    //对编辑器的操作最好在编辑器ready之后再做
    let _this = this;
    ue.ready(function () {
        //设置编辑器的内容
        ue.execCommand('serverparam', 'path', 'ueditor');
        $("#copyEditor").html(templateBody);
        $("#copyEditor span").each(function (index, element) {
            let key = $(element).attr('id_key');
            // $(element).html('<span>[[</span><span style="color: red;" id_key="'+key+'">' + value + '</span><span>]]</span>')
            if (key) {
                let value = array.filter((item) => item.key === key)[0].value;
                $('<span>[[</span><span style="color: red;" id_key="' + key + '">' + value + '</span><span>]]</span>').replaceAll($(element));
            }

        })
        ue.setContent($("#copyEditor").html());

    });
}

let index = 0;

function select(i) {
    ue.execCommand('inserthtml', '<span>[[</span><span style="color: red;" id_key="' + array[i].key + '">' + array[i].value + '</span><span>]]</span>')
    layer.close(layer.index)
}

function selectField() {
    layer.open({
        type: 1, // page 层类型
        area: ['600px', '300px'],
        title: '字段',
        shade: 0.6, // 遮罩透明度
        shadeClose: true, // 点击遮罩区域，关闭弹层
        maxmin: false, // 允许全屏最小化
        anim: 0, // 0-6 的动画形式，-1 不开启
        content: '<div class="morediv" style="padding: 24px;"> </div>'
    });
    var div = '';
    for (var i = 0; i < array.length; i++) {
        div += '<a class="layui-btn btn-primary" onclick="select(' + i + ')">' + array[i].value + '</a></a>'
    }
    $('.morediv').html(div)
}

function help() {
    layer.open({
        type: 1, // page 层类型
        area: ['500px', '250px'],
        title: '帮助',
        shade: 0.6, // 遮罩透明度
        shadeClose: true, // 点击遮罩区域，关闭弹层
        maxmin: false,
        anim: 0,
        content: '<div class="help"> <p>1.此编辑框可自行设置合同模板;</p><p>2.合同会以最近一次编辑内容做为正式的合同模板;</p><p>3.通过设定字段名可添加公司，客户，合同，车辆的信息，在车辆管理的合同打印中，会将这些字段转换成对应的具体信息</p> </div>'
    });
}

function getHtml(str) {
    str = str.replace(/(\<html\>)|(\<\/html>)/gm, '')
    // str = (decodeURI(str)).replace(/(\<html\>)|(\<\/html>)/gm, '')
    // str = (layui.base64.decode(str)).replace(/(\<html\>)|(\<\/html>)/gm, '')
    str = str.replace(/(\<head\>)|(\<\/head\>)/gm, '')
    return str.replace(/(\<body)/gm, '<div').replace(/(\<\/body\>)/gm, '</div>')
}