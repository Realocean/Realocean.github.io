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

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        unbinddesc: null,
        orderId: null,
        orderCarId: null,
        contractId: null,
        orderType: null,
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.orderId = param.orderId;
        _this.orderCarId = param.orderCarId;
        _this.contractId = param.contractId;
        _this.orderType = param.orderType;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            PageLoading();
            var map = {
                unbinddesc: vm.unbinddesc,
                orderCarId: vm.orderCarId,
                orderType: vm.orderType,
                contractId: vm.contractId
            };
            $.ajax({
                type: "POST",
                url: baseURL + 'contract/contracordernotemplate/unbindcontract',
                contentType: "application/json",
                data: JSON.stringify(map),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage(vm.orderType);
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
    form.verify({
        validate_desc: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入解绑原因";
                }
            }
        }
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

}

function closePage(type) {
    if (type == 1){
        parent.vm.closePage();
    }else {
        var index = parent.layer.getFrameIndex(window.name);
        parent.vm.reload();
        parent.layer.close(index);
    }
}
