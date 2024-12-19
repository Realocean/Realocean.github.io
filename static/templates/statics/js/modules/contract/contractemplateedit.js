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
var ue =null;
var array= [];
var vm = new Vue({
    el: '#rrapp',
    data: {
        noticeContent: '',
        contractemplate: {},
        verify: false,

    },
    created: function () {
        var _this = this;
        _this.getConfig();
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        if(param&&param.data){
            _this.contractemplate = param.data;
            $.get(baseURL + "contract/contraccontent/bodyByTemplate/"+_this.contractemplate.id, function(r){
                _this.contractemplate.body = r;
            });
        }


        if (_this.contractemplate == null) {
            _this.contractemplate = {};
        }
        if (_this.contractemplate['operationId'] == null) {
            _this.contractemplate['operationId'] = sessionStorage.getItem("userId");
            _this.contractemplate['operationName'] = sessionStorage.getItem("username");
        }
        if (_this.contractemplate['rentType'] == null) {
            _this.contractemplate['rentType'] = '';
        }
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        getConfig:function(){
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
            var url = vm.contractemplate.id == null ? "contract/contractemplate/save" : "contract/contractemplate/update";
            console.log(vm.contractemplate)
            let str = ue.getAllHtml()||''
                  $("#copyEditor").html(str.replace(/\[\[/g, '').replace(/\]\]/g, ''));
                $("#copyEditor span").each(function(index,element){
                    let key = $(element).attr('id_key');
                    if(key){
                        $(element).html('[['+key+']]')
                    }
                })
            let params = {
                ...vm.contractemplate,
                body:$("#copyEditor").html()
            }
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
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
    upload.render({
        elem: '#uploaddoc',
        url: baseURL + 'contract/contractemplate/uploaddoc',
        data: {path:'contractemplate'},
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件,
        acceptMime: '.doc,.docx',
        exts: 'doc|docx', //
        done: function (res) {
            console.log(res);
            if (ue) {
                ue.execCommand('insertHtml', getHtml(res.body));
            }
        },
        error: function () {
            layer.msg('上传失败', {icon: 5});
        }
    });
}

function initVerify(form) {
    form.verify({
        validate_nameTpl: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入模版名称";
                }
            }
        },
        validate_rentType: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择模版租赁类型";
                }
            }
        }
    });
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(rentType)', function (data) {
        vm.contractemplate.rentType = data.value;
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
    parent.vm.reload();
    parent.layer.close(index);
}

function initData(){
    ue = UE.getEditor('container');
    ue.setOpt('maximumWords', 1024*1024*500);
    ue.setOpt('initialFrameWidth', '100%');
    ue.setOpt('wordCount', false);
    ue.setOpt('wordOverFlowMsg', '<span style="color:red;">你输入的字符个数已经超出最大允许值，服务器可能会拒绝保存！</span>');
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return baseURL+'/file/uploadMonofile';
        } else if (action == 'uploadvideo') {
            return baseURL + 'file/uploadMonofile';
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }
    //对编辑器的操作最好在编辑器ready之后再做
    let _this = this;
    ue.ready(function() {
    //设置编辑器的内容
    var param = parent.layer.boxParams.boxParams;
    ue.execCommand('serverparam', 'path', 'ueditor');
    if(param&&param.data){
        _this.contractemplate = param.data;
        console.log(param.data.body)
        $("#copyEditor").html(param.data.body);
        $("#copyEditor span").each(function(index,element){
            let key = $(element).attr('id_key');
            // $(element).html('<span>[[</span><span style="color: red;" id_key="'+key+'">' + value + '</span><span>]]</span>')
            if(key){
                let value = array.filter((item)=>item.key===key)[0].value;
                $('<span>[[</span><span id_key="'+key+'">' + value + '</span><span>]]</span>').replaceAll($(element));
                // $('<span>[[</span><span style="color: red;" id_key="'+key+'">' + value + '</span><span>]]</span>').replaceAll($(element));
            }

        })
        ue.setContent($("#copyEditor").html());
    }

});
}
// function initData() {
//     //初始化富文本编辑器
//     const E = window.wangEditor;
//     editor = new E('#Editor')
//     // 设置编辑区域高度为 400px
//     editor.config.height = 400;
//     editor.config.zIndex = 1;
//     editor.config.menus = [
//         'head', // 标题
//         'bold', // 粗体
//         'fontSize', // 字号
//         'fontName', // 字体
//         'italic', // 斜体
//         'underline', // 下划线
//         'strikeThrough', // 删除线
//         'foreColor', // 文字颜色
//         'backColor', // 背景颜色
//         'link', // 插入链接
//         'justify', // 对齐方式
//         'quote', // 引用
//         'table', // 表格
//         'emoticon', // 表情
//         'undo', // 撤销
//         'image', // 插入图片
//         'redo', // 重复
//     ]
//     editor.config.placeholder = '请输入模版内容';
//     editor.config.onchange = function (newHtml) {
//         vm.noticeContent = newHtml;
//         // let document.getElementById('copyEditor')
//         console.log($("#copyEditor span"));
//         $("#copyEditor").html(newHtml.replace(/\[\[/g, '').replace(/\]\]/g, ''));
//         $("#copyEditor span").each(function(index,element){
//             let key = $(element).attr('id_key');
//             $(element).html('[['+key+']]')
//         })

//     }
//     editor.create();
//     //富文本内容回显
//     editor.txt.html('<p>' + vm.noticeContent + '</p>')


// }
let index = 0;
function select(i) {
    ue.execCommand('inserthtml', '<span>[[</span><span id_key="'+array[i].key+'">' + array[i].value + '</span><span>]]</span>')
    // ue.execCommand('inserthtml', '<span>[[</span><span style="color: red;" id_key="'+array[i].key+'">' + array[i].value + '</span><span>]]</span>')
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
        content: '<div class="help"> <p>1.此编辑框可自行设置合同模板;</p><p>2.合同会以最近一次启用的模板为正式的合同模板;</p><p>3.若全部停用则以系统默认的模板为正式合同模板</p><p>4.通过设定字段名可添加公司，客户，合同，车辆的信息，在车辆管理的合同打印中，会将这些字段转换成对应的具体信息</p> </div>'
    });
}

function getHtml(str) {
    str = str.replace(/(\<html\>)|(\<\/html>)/gm, '')
    str = str.replace(/(\<head\>)|(\<\/head\>)/gm, '')
    return str.replace(/(\<body)/gm, '<div').replace(/(\<\/body\>)/gm, '</div>')
}
