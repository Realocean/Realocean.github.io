$(function () {
    systemMessage();
    /**
     * 筛选监听下拉选、时间组件
     */
    layui.use(['form', 'laydate', 'upload'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        //消息类型
        form.on('select(msgStatus)', function (data) {
            vm.q.msgStatus = data.value;
        })
        //推送时间
        laydate.render({
            elem: '#createTime',
            type: 'date',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.createTime = value;
            }
        });
        form.render();
    });


    /**
     * 新增监听
     */
    layui.use(['form', 'laydate', 'upload'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var transfer = layui.transfer
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
            // if (data.elem.checked) {
            //     vm.sendObjectTypeArray.push(data.value);
            // } else {
            //     vm.sendObjectTypeArray.splice(vm.sendObjectTypeArray.indexOf(data.value), 1);
            // }
            // if (data.elem.checked && data.value == 3) {
            //     vm.selectCustom();
            // }
            // if (!data.elem.checked && data.value == 3) {
            //     vm.selectShow = false;
            // }
        });
        //短信新增-发送对象监听
        form.on('radio(smsSendObject)', function (data) {
            vm.smsMessage.sendObject = data.value;
            if (data.value == 2) {
                vm.sendObjectFlag = true;
                obtainCustomer();
            } else {
                vm.sendObjectFlag = false;
            }
        })

        //推送时间（定时发送时需要设置时间）
        laydate.render({
            elem: '#regularlySend',
            type: 'datetime',
            trigger: 'click',
            done: function (value, date, endDate) {
                console.log(value);
                vm.message.regularlySend = value;
            }
        });


        //上传附件
        uploadAttachment(upload);
        form.render();
    });


    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.detail(data.id);
        } else if (layEvent === 'edit') {
            vm.edit(data.id);
        }
    });

    //操作
    layui.table.on('tool(smsgrid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.smsDetail(data.id);
        }
    });

});


var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            msgContent: null,
            msgStatus: null,
            createTime: null,
            status: 1
        },
        showForm: false,
        regularly: false,
        selectShow: false,
        message: {},
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        inforData: {},
        sendObjectTypeArray: null,
        selectedName: [],
        sendStatus: true,
        sendObject: false,
        sendObjectData: null,
        smsMessage: {},
        sendObjectFlag: false,

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        changeStatus: function (status) {
            if (status == 1) {
                vm.q.status = 1;
                vm.sendStatus = true;
                vm.sendObject = false;
                systemMessage();
            } else if (status == 2) {
                vm.q.status = 2;
                vm.sendObject = true;
                vm.sendStatus = false;
                SMSMessage();
            }
            vm.reload();
        },
        reset: function () {
            vm.q.msgContent = null;
            vm.q.msgStatus = null;
            vm.q.createTime = null;
        },
        detail: function (id) {
            window.localStorage.setItem("id", id);
            var index = layer.open({
                title: "系统管理 > 消息推送 > 消息详情",
                type: 2,
                content: tabBaseURL + 'modules/message/systemmsgdetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id", null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        edit: function (id) {
            $.get(baseURL + "message/creatorDetail/" + id, function (res) {
                if (res.code == '0') {
                    vm.message = res.data;
                    vm.message.title = res.data.msgTitle;
                    vm.message.content = res.data.msgContent;
                    vm.deliveryFileLst = vm.message.attachment;
                    console.log("编辑回显数据：", vm.message);
                    layui.form.render();
                    var index = layer.open({
                        title: "系统管理 > 消息推送 > 编辑消息",
                        type: 1,
                        content: $("#editForm"),
                        end: function () {
                            vm.editForm = false;
                            layer.closeAll();
                        }
                    });
                    vm.editForm = true;
                    layer.full(index);
                } else {
                    alert(res.msg);
                }
            });
        },
        cancel: function () {
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.message = {};
            vm.smsMessage = {};
            vm.selectShow = false;
            vm.sendObjectFlag = false;
            // 清空单选框选中
            cleanRadiobox();
            if (vm.q.status == 1) {

                var index = layer.open({
                    title: "系统管理 > 消息推送 > 新增消息",
                    type: 1,
                    content: $("#editForm"),
                    end: function () {
                        vm.showForm = false;
                        layer.closeAll();
                    }
                });
                vm.showForm = true;
                layer.full(index);
            } else {
                var index = layer.open({
                    title: "系统管理 > 消息推送 > 新增短信通知",
                    type: 1,
                    content: $("#SMSeditForm"),
                    end: function () {
                        vm.showForm = false;
                        layer.closeAll();
                    }
                });
                vm.showForm = true;
                layer.full(index);
            }


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
        smsSave: function () {
            if(vm.smsMessage.sendObject == 2){
                if(vm.smsMessage.sendObjectData == undefined){
                    layer.alert("请选择发送用户");
                    return;
                }else {
                    if(vm.smsMessage.sendObjectData == '[]'){
                        layer.alert("请选择发送用户");
                        return;
                    }
                }
            }
            $.ajax({
                type: "POST",
                url: baseURL + "message/sms/add",
                contentType: "application/json",
                data:JSON.stringify(vm.smsMessage),
                success: function(res){
                    if(res.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(res.msg);
                    }
                }
            });
        },
        smsDetail:function (id) {
            window.localStorage.setItem("id", id);
            var index = layer.open({
                title: "系统管理 > 消息推送 > 短信通知详情",
                type: 2,
                content: tabBaseURL + 'modules/message/smsmsgdetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("id", null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    msgContent: vm.q.msgContent,
                    msgStatus: vm.q.msgStatus,
                    createTime: vm.q.createTime,
                }
            });
        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
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
            // var index = layer.open({
            //     title: "自定义员工",
            //     type: 2,
            //     content: tabBaseURL + "modules/common/selectcustom.html",
            //     end: function () {
            //         vm.selectedName = [];
            //         var arrData = [];
            //         $.each(vm.inforData, function (i, data) {
            //             vm.selectedName += data.name + ",";
            //             arrData.push(data);
            //         });
            //         vm.message.inforData = JSON.stringify(arrData);
            //         vm.selectedName = vm.selectedName.slice(0, vm.selectedName.length - 1);
            //         vm.selectShow = true;
            //     }
            // });
            // layer.full(index);
        },
    }
});


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
                    layer.closeAll();
                    vm.reload();
                });
            } else {
                alert(res.msg);
            }
        }
    });
}

function systemMessage() {
    layui.use(['form', 'element', 'table'], function () {
        var table = layui.table;
        table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'message/system/list',
            cols: [[
                {title: '操作', width:100, minWidth:100, templet: '#barTpl', fixed: "left", align: "center"},
                {
                    field: 'title', align: "center", title: '消息标题', templet: function (d) {
                    return isEmpty(d.title);
                }
                },
                {
                    align: "sendObjectTypeShow", title: '发送对象', templet: function (d) {
                        if(d.sendObjectTypeShow == null){
                            return '--';
                        }else{
                            return d.sendObjectTypeShow + " (已读" + d.personCount + ")";
                        }

                }
                },
                {
                    field: 'pushTypeShow',width:80, align: "center", title: '发送状态', templet: function (d) {
                    return isEmpty(d.pushTypeShow);

                }
                },
                {
                    field: 'sendPerson',width:80, align: "center", title: '发送人', templet: function (d) {
                    return isEmpty(d.sendPerson);

                }
                },
                {
                    field: 'createTime', align: "center", title: '推送时间', templet: function (d) {
                    return isEmpty(d.createTime);
                }
                },
            ]],
            page: true,
            limits: [10, 20, 50, 100],
            limit: 10,
        });
    });

}

function SMSMessage() {
    layui.use(['form', 'element', 'table'], function () {
        var table = layui.table;
        table.render({
            id: "gridid",
            elem: '#smsgrid',
            url: baseURL + 'message/sms/list',
            cols: [[
                {title: '操作', width: 80, templet: '#smsbarTpl', fixed: "left", align: "center"},
                {
                    field: 'smsContent', align: "center", title: '发送内容', templet: function (d) {
                    return isEmpty(d.smsContent);
                }
                },
                {
                    align: "sendObjectType", title: '发送对象', templet: function (d) {
                        if(d.sendObjectType == 1){
                            return "全部用户"
                        }else if(d.sendObjectType == 2){
                            return isEmpty(d.customerName) === '--'?'自定义用户':d.customerName;
                        }else{
                            return isEmpty(d.sendObjectType);
                        }
                }
                },
                {
                    field: 'successCount', align: "center", title: '成功条数', templet: function (d) {
                    return d.successCount;

                }
                },
                {
                    field: 'errorCount', align: "center", title: '失败条数', templet: function (d) {
                    return d.errorCount;

                }
                },
                {
                    field: 'userName', align: "center", title: '发送人', templet: function (d) {
                    return isEmpty(d.userName);
                }
                },
                {
                    field: 'createTime', align: "center", title: '发送时间', templet: function (d) {
                    return isEmpty(d.createTime);
                }
                },
            ]],
            page: true,
            limits: [10, 20, 50, 100],
            limit: 10,
        });
    });
}


/**
 * 获得用户列表
 */
function obtainCustomer() {
    var getData;
    var transfer = layui.transfer;
    $.get(baseURL + "message/obtainCustomer", function (res) {
        if (res.code == 0) {
            transfer.render({
                elem: '#test1',
                title: ['用户列表', '已选用户']
                ,showSearch: true
                , data: res.data
                , id:'demo1'
                , onchange: function (obj, index) {
                    // if (index == 0) {
                    //     console.log(obj); //得到当前被穿梭的数据
                    //     vm.smsMessage.sendObjectData = JSON.stringify(obj);
                    // }
                    console.log("sasadsd",transfer.getData('demo1'))
                    getData = transfer.getData('demo1');
                    vm.smsMessage.sendObjectData = JSON.stringify(getData);
                }
            })


        }
    });
}


/**
 * 清空单选框选中
 */
function cleanRadiobox(){
    $('input[name=sendObject]').prop('checked', false);
    layui.form.render('radio');
}

function texLength(obj, maxlength, id) {
    var curr = obj.value.length;
    if (curr > maxlength) {
        layer.msg('字数在' + maxlength + '字以内');
    } else {
        document.getElementById(id).innerHTML = curr;
    }
}
