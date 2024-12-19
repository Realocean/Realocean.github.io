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
        scPlanConfig: {},
        associationModeList: [],
        verify: false
    },
    created: function(){
         
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scPlanConfig = param.data;
        _this.getAssociationModeList(_this.scPlanConfig.connectionWayNo);
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        associationModeChange:function(data){
            vm.scPlanConfig.associationModeList = [];
            if(vm.associationModeList != null && vm.associationModeList.length > 0 && data != null && data.length > 0){
                for (let item of data) {
                    for (let item1 of vm.associationModeList) {
                        if(item == item1.associationModeId){
                            vm.scPlanConfig.associationModeList.push({'associationModeId':item1.associationModeId,'associationModeName':item1.associationModeName});
                            break;
                        }
                    }
                }
            }
        },
        getAssociationModeList: function (data) {
            $.ajax({
                type: "GET",
                url: baseURL + 'qmyx/scplanconfig/associationModeList/'+data,
                success: function(r){
                    if(r.code === 0){
                        vm.associationModeList=r.associationModeList;
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },chosePlan: function () {
            //iframe 层
            layer.open({
                type: 2,
                title: '选择方案',
                shadeClose: true,
                shade: 0.8,
                area: ['80%', '70%'],
                content: '../../modules/qmyx/selectsccommissionplanlist.html' //iframe的url
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.scPlanConfig.id == null ? "qmyx/scplanconfig/save" : "qmyx/scplanconfig/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.scPlanConfig),
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
                        return "主键id不能为空";
                    }
                }
            },
                    validate_tenantId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "租户id不能为空";
                    }
                }
            },
                    validate_code: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "编号不能为空";
                    }
                }
            },
                    validate_commissionId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "佣金方案id不能为空";
                    }
                }
            },
                    validate_delFlag: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "删除状态(1-未删除，2-已删除)不能为空";
                    }
                }
            },
                    validate_createTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "创建时间不能为空";
                    }
                }
            },
                    validate_updateTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "更新时间不能为空";
                    }
                }
            },
                    validate_createBy: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "创建者不能为空";
                    }
                }
            },
                    validate_updateBy: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "更新者不能为空";
                    }
                }
            },
                    validate_remark: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "备注不能为空";
                    }
                }
            },
           /* validate_associatedBusinessNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "关联业务不能为空";
                    }
                }
            },*/
            validate_connectionWayNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "关联方式不能为空";
                    }
                }
            },
           /* validate_associationModeId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '' || vm.scPlanConfig.associationModeName == null || vm.scPlanConfig.associationModeName == '') {
                        vm.verify = false;
                        return "关联业务不能为空";
                    }
                }
            },*/
            validate_planId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '' ) {
                        vm.verify = false;
                        return "关联方案不能为空";
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
    form.on('select(associatedBusinessNo)', function(data){
        vm.scPlanConfig.associatedBusinessNo = data.value;
    });
    form.on('radio(connectionWayNo)', function(data){
        vm.scPlanConfig.connectionWayNo = data.value;
        vm.scPlanConfig.associationModeList = [];
        vm.scPlanConfig.tempAssociationModeData = [];
        vm.associationModeList = [];
        vm.getAssociationModeList(data.value);
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
