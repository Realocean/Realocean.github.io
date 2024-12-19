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
        illegalConsumLog: {},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.illegalConsumLog = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.illegalConsumLog.id == null ? "order/illegalconsumlog/save" : "order/illegalconsumlog/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.illegalConsumLog),
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
    form.verify({
                    validate_id: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "不能为空";
                    }
                }
            },
                    validate_carId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "车辆id不能为空";
                    }
                }
            },
                    validate_carPlateNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "车牌号不能为空";
                    }
                }
            },
                    validate_feedbackDate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "反馈时间不能为空";
                    }
                }
            },
                    validate_feedbackResult: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "查询结果不能为空";
                    }
                }
            },
                    validate_queryBatch: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "查询批次不能为空";
                    }
                }
            },
                    validate_startTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "发起时间不能为空";
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
                    validate_operatorName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "操作人名称不能为空";
                    }
                }
            },
                    validate_operatorDate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "操作时间不能为空";
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

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
