$(function () {
    // 清空单选框选中
    cleanRadiobox();
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });


    layui.use('form', function() {
        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;

        //推送时间下拉选
        form.on('select(sendTime)', function (data) {
            vm.message.pushType = data.value;
            if (data.value == 2) {
                vm.regularly = true;
            } else {
                vm.regularly = false;
            }
        })
        //发送对象
        form.on('radio(sendObjectbox)', function (data) {
            vm.sendObjectTypeArray = data.value;
            if(data.value == 3){
                vm.selectShow = true;
                vm.selectCustom();
                // vm.sendObjectTypeArray.push(data.value);
            }else{
                vm.selectShow = false;
                vm.message.inforData = null;
            }
        });
        //上传附件
        uploadAttachment(upload);
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        message: {},
        smsMessage:{},
        selectShow:false,
        sendObjectFlag:false,
        regularly: false,
        verify: false,
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        //自定义渠道商/员工
        selectCustom: function () {
            $.get(baseURL + "message/selectCondition", function (res) {
                if (res.code == 0) {
                    layui.transfer.render({
                        elem: '#test2',
                        title: ['用户列表', '已选用户']
                        , data: res.data
                        ,showSearch:true
                        ,parseData: function(res){
                            return {
                                "value": res.id
                                ,"title": res.name
                            }
                        }
                        , onchange: function (obj, index) {
                            if (index == 0) {
                                vm.message.inforData = JSON.stringify(obj);
                            }
                        }

                    })
                }
            });
        },
        cancel: function () {
            parent.layer.closeAll();
        },
        save: function () {
            vm.message.attachment = vm.deliveryFileLst;
            vm.message.sendObjectType = vm.sendObjectTypeArray;
            vm.message.msgSendType = 1;
            save(vm.message);
        },
        send: function () {
            vm.message.attachment = vm.deliveryFileLst;
            vm.message.sendObjectType = vm.sendObjectTypeArray;
            if (vm.message.pushType == 2) { //推送类型：定时发送
                vm.message.msgSendType = 3; //版本：定时发送
            } else {
                vm.message.msgSendType = 2; //版本：发送
            }
            save(vm.message);
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {

}

function initChecked(form) {

}

function initClick() {

}

function initTable(table, soulTable) {

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

/**
 * 清空单选框选中
 */
function cleanRadiobox(){
    $('input[name=sendObject]').prop('checked', false);
    layui.form.render('radio');
}

/**
 * 新增
 * @param param
 */
function save(param) {
    $.ajax({
        type: "POST",
        url: baseURL + "message/system/add",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (res) {
            if (res.code === 0) {
                alert('操作成功', function (index) {
                    parent.layer.closeAll();
                    parent.vm.reload();
                });
            } else {
                alert(res.msg);
            }
        }
    });
}

/**
 * 上传附件
 */
function uploadAttachment(upload) {
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadFile',
        data: {'path': 'message_image'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg', //
        choose: function (obj) {
            PageLoading();
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileName,
                    nameExt: ext,
                    typeFile: fileType,
                };
                vm.deliveryFileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.deliveryFileLst.forEach(function (value) {
                    if (value.id === deliveryFileIdTmp) value.url = res.data[0];
                });
                vm.deliveryFileLstId = 'deliveryFileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
            }
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}

function texLength(obj, maxlength, id) {
    var curr = obj.value.length;
    if (curr > maxlength) {
        layer.msg('字数在' + maxlength + '字以内');
    } else {
        document.getElementById(id).innerHTML = curr;
    }
}