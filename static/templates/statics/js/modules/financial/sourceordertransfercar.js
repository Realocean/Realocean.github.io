$(function () {
    // 获取预计过户时间
    vm.initTransfer(window.localStorage.getItem("transferDate"));

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        var laydate = layui.laydate;
        // 实际过户时间
        laydate.render({
            elem: '#actualTransferDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.sourceOrderSettlement.actualTransferDate=value;
            }
        });

        layui.form.render();
    });

    // 附件上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#orderSourceFile',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'orderSourceFile'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.fileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '车辆来源订单过户结算附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.fileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.fileList.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        sourceOrderSettlement:{},
        fileList: [],
        fileLstId: '0',
        verify: false
    },
    created: function(){
        var _this = this;

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileList.length;i++) {
                if(vm.fileList[i].id === id) {
                    vm.fileList.splice(i,1);
                    i= i-1;
                }
            }
        },

        initTransfer:function (transferDate){
            if(transferDate != null && transferDate!=""){
                vm.sourceOrderSettlement.transferDate = transferDate;
                $("#transferDate").val(transferDate);
            } else {
                vm.sourceOrderSettlement.transferDate = "--";
            }
        },

        saveOrUpdate: function (event) {
            if(vm.sourceOrderSettlement.actualTransferDate == null || vm.sourceOrderSettlement.actualTransferDate == ''){
                alert("请选择实际过户时间");
                return;
            }

            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if(vm.sourceOrderSettlement.refundAmount != undefined){
                if(vm.sourceOrderSettlement.refundAmount!='' || vm.sourceOrderSettlement.refundAmount!=null){
                    if(!reg.test(vm.sourceOrderSettlement.refundAmount)){
                        alert("可退金额/元输入格式不正确(格式：大于0的正整数或者带两位小数的正整数)");
                        return;
                    }
                }
            }
            if(vm.sourceOrderSettlement.payableAmount != undefined){
                if(vm.sourceOrderSettlement.payableAmount!='' || vm.sourceOrderSettlement.payableAmount!=null){
                    if(!reg.test(vm.sourceOrderSettlement.payableAmount)){
                        alert("应付金额/元输入格式不正确(格式：大于0的正整数或者带两位小数的正整数)");
                        return;
                    }
                }
            }
            vm.saveData();
        },

        saveData:function (event){
            vm.sourceOrderSettlement.settlementType = 2;
            vm.sourceOrderSettlement.carId = window.localStorage.getItem("carId");
            vm.sourceOrderSettlement.sourceOrderId = window.localStorage.getItem("id");
            vm.sourceOrderSettlement.fileList = vm.fileList;
            var url = "pay/carsourceorder/saveSourceOrderSettlement";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.sourceOrderSettlement),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
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
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
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

function initDate(laydate) {
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
