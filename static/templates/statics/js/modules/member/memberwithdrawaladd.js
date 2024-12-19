$(function () {

    layui.use(['form', 'layedit', 'laydate', 'upload'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.verify({
                withdrawalAmountVerify: function (value) {
                    var reg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
                    if (value == "" || value == null) {
                        return '提现金额不能为空！';
                    }
                    if(!reg.test(value)){
                        return '金额的输入格式不正确,请确认!';
                    }

                    // 根据可提醒金额判断输入提醒金额是否可提
                    var amount = vm.memberWithdrawal.memberBalance;
                    if(amount <= 0){
                        return '提现账户余额不足，不能提现!';
                    }

                    if(value > amount){
                        return '提现金额必须小于或等于可提现金额!';
                    }
                },
                reWithdrawalAmountVerify: function (value) {
                    if(vm.memberWithdrawal.withdrawalAmount==null || vm.memberWithdrawal.withdrawalAmount==""){
                        return '提现金额不能为空！';
                    }
                    var reg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
                    if (value == "" || value == null) {
                        return '确认提现金额不能为空！';
                    }
                    if(!reg.test(value)){
                        return '金额的输入格式不正确,请确认!';
                    }
                    if(vm.memberWithdrawal.reWithdrawalAmount != vm.memberWithdrawal.withdrawalAmount){
                        return '提现金额与确认提现金额不一致请重新输入！';
                    }

                },
                withdrawalMethodVerify: function (value) {
                    if (value == "" || value == null) {
                        return '提现方式不能为空！';
                    }
                },
                intoBankdepositVerify: function (value) {
                    if (value == "" || value == null) {
                        return '开户行不能为空！';
                    }
                },
                intoAccountVerify: function (value) {
                    if (value == "" || value == null) {
                        return '卡号不能为空！';
                    }
                },
            });
            form.render();
    });

    //提现方式
    layui.form.on('select(withdrawalMethod)', function (data) {
        vm.memberWithdrawal.withdrawalMethod = data.value;
    });

    //附件上传
    layui.upload.render({
        elem: '#addFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path':'carrepairorder'},
        field:'files',
        auto:true,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        multiple: true,
        number:20,
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                vm.delFile(fileIdTmp);
                fileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                fileIdTmp = vm.fileLst.length + '_' + uuid(6);
                var fileTmp = {
                    id: fileIdTmp,
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc: '提现单上传凭证',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.fileLst.push(fileTmp);
                vm.fileLstId = 'fileLstId_' + uuid(6);
            });
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delFile(fileIdTmp);
            fileIdTmp = null;
        }
    });


    //保存按钮监听
    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        fileLst: [],
        fileLstId: '0',
        memberWithdrawal:{}
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        selectMemberInfor:function(){
            var index = layer.open({
                title: "选择客户",
                type: 2,
                content: tabBaseURL + 'modules/member/customerselect.html',
                end: function(){ }
            });
            layer.full(index);

        },
        //取消
        cancel: function(){
            parent.layer.closeAll();
        },
        //保存修改方法
        saveOrUpdate: function (event) {
            vm.memberWithdrawal.fileLst = vm.fileLst;
            var url = "member/memberwithdrawal/save";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.memberWithdrawal),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
    }
})

function initUpload(upload) {
     var operationId = sessionStorage.getItem("userId");
     var operationName = sessionStorage.getItem("username");
    upload.render({
        elem: '#addFile',
        url: baseURL + 'file/uploadFile',
        data: {'path':'contract'},
        field:'files',
        auto:true,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg', //
        choose: function(obj){
            PageLoading();
            obj.preview(function(index, file, result){
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                fileIdTmp = vm.fileLst.length + '_' + uuid(60);
                var fileTmp={
                    id: fileIdTmp,
                    operationId:operationId,
                    operationName:operationName,
                    nameDesc:'维修附件',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.fileLst.push(fileTmp);
            });
        },
        done: function (res) {
            RemoveLoading();
            if (res.code == '0') {
                vm.fileLst.forEach(function (value) {
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
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delFile(fileIdTmp);
            fileIdTmp = null;
        }
    });
}
