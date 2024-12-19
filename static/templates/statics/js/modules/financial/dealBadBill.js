$(function () {
    vm.receivablesIds = window.localStorage.getItem("receivablesIds");
    vm.receivables.badRemark = "";
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
    let operType= window.localStorage.getItem("operType");
    if(operType !=null){
        vm.operType= operType;
    }
    // 附件上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#badBillFile',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'badBillFile'},
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
                    fileIdTmp = vm.badBillFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '车辆来源订单附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.badBillFileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.badBillFileList.forEach(function (value) {
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
        receivables: {},
        carSourceType:1,
        badBillFileList: [],
        fileLstId: '0',
        feeItemLst: [],
        feeItemId: '',
        receivablesIds:[],
        hzType:1,
        skAmount:null,
        operType:null,
    },
    created: function(){
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        delFile: function (id) {
            for(var i = 0 ;i<vm.badBillFileList.length;i++) {
                if(vm.badBillFileList[i].id === id) {
                    vm.badBillFileList.splice(i,1);
                    i= i-1;
                }
            }
        },

        saveOrUpdate: function (event) {
             
            console.log(vm.receivables.badRemark);
            if(vm.receivables.badRemark == ""){
                alert("请输入坏账原因");
                return false;
            }
            if(vm.hzType == 2 && (vm.skAmount ==null || vm.skAmount== '')){
                alert("坏账金额不能为空");
                return false;
            }
            if(vm.hzType == 2 && (vm.skAmount <=0)){
                alert("坏账金额必须大于0");
                return false;
            }
            if(vm.operType ==4){
                vm.hzType=null;
            }

            vm.receivables.badBillFileList = vm.badBillFileList;
            vm.receivables.receivablesIds = vm.receivablesIds;
            vm.receivables.badBillAmount = vm.skAmount;
            vm.receivables.hzType=vm.hzType;
            vm.receivables.operType = window.localStorage.getItem("operType");//坏账或备注
            var url = "financial/receivables/batchDealBadBill";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.receivables),
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
    form.on('radio(hzType)', function (data) {
        vm.hzType = data.value;
    });
    form.on('submit(dealBadBillSumbit)', function(){
        vm.saveOrUpdate();
        return false;
    });

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
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
    parent.vm.ids = [];
    parent.layer.close(index);
}


