$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});
var viewer;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        transferFileLst: [],
        transferFileLstId: 'transferFileLstId_0',
        carTransfer: {},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if(param!=null && param !='' && param!=undefined){
            _this.carTransfer = param.data;
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        delDeliveryFile: function (id) {
            for(var i = 0 ;i<vm.transferFileLst.length;i++) {
                if(vm.transferFileLst[i].id === id) {
                    vm.transferFileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        saveOrUpdate: function (event) {
            vm.carTransfer.deliveryFileLst = vm.transferFileLst;
            var url = vm.carTransfer.transferId == null ? "order/cartransfer/save" : "order/cartransfer/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carTransfer),
                success: function(r){
                    RemoveLoading();
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
    uploadAttachment(upload);
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
                    validate_transferId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "主键不能为空";
                    }
                }
            },
                    validate_orderNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "子订单主键不能为空";
                    }
                }
            },
                    validate_orderCarNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "子订单编号不能为空";
                    }
                }
            },
                    validate_carId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "车辆主键不能为空";
                    }
                }
            },
                    validate_estimatedTransferTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "预计过户时间不能为空";
                    }
                }
            },
                    validate_transferTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "过户时间(实际过户时间)不能为空";
                    }
                }
            },
                    validate_createTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "操作时间不能为空";
                    }
                }
            },
                    validate_updateTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "修改时间不能为空";
                    }
                }
            },
                    validate_delFlag: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "删除状态 0.正常 1.删除不能为空";
                    }
                }
            },
                    validate_remarks: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "过户备注不能为空";
                    }
                }
            },
                    validate_operatorId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "操作人id不能为空";
                    }
                }
            },
                    validate_operator: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "操作人不能为空";
                    }
                }
            },
            });
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
    laydate.render({
        elem: '#transferTime',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.carTransfer.transferTime = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

/**
 * 上传附件
 */
function uploadAttachment(upload){
    Upload({
        elid: 'transferFileLstId',
        edit: true,
        fileLst: vm.transferFileLst,
        param: {'path':'transfer'},
        fidedesc: '过户附件'
    }).initView();
}
