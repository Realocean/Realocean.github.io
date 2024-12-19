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
        cluesDeal: {},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.cluesDeal = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.cluesDeal.id == null ? "cluesnew/cluesdeal/save" : "cluesnew/cluesdeal/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.cluesDeal),
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
                    validate_cluesId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "线索ID不能为空";
                    }
                }
            },
                    validate_cluesType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "线索类型：1、预定购车/租车 2、运力合作 3、预约试驾 4、活动咨询 5、合同加盟 6、线索记录不能为空";
                    }
                }
            },
                    validate_followType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "线索记录跟进方式：1、面谈 2、电话 3、微信 4、短信 5、邮件 6、QQ 7、其它不能为空";
                    }
                }
            },
                    validate_cluesStatus: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "线索记录-线索状态：1、初步接触 2、潜在客户 3、持续跟进 4、忠诚客户 5、无效客户 6、成交客户不能为空";
                    }
                }
            },
                    validate_intentionStatus: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "线索记录-意向情况：1、无意向 2、低意向 3、中意向 4、高意向 5、已成单不能为空";
                    }
                }
            },
                    validate_dealStatusResult: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "处理状态中文标示不能为空";
                    }
                }
            },
                    validate_dealResult: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "处理备注/跟进内容不能为空";
                    }
                }
            },
                    validate_dealTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "处理/跟进时间不能为空";
                    }
                }
            },
                    validate_dealProcessorId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "处理者ID不能为空";
                    }
                }
            },
                    validate_dealProcessor: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "处理者/跟进人不能为空";
                    }
                }
            },
                    validate_newFollowDeptId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "新跟进人部门id不能为空";
                    }
                }
            },
                    validate_newFollowDeptName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "新跟进人部门名称不能为空";
                    }
                }
            },
                    validate_oldFollowId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "原跟进人id不能为空";
                    }
                }
            },
                    validate_oldFollowName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "原跟进人名称不能为空";
                    }
                }
            },
                    validate_oldFollowDeptId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "原跟进人部门id不能为空";
                    }
                }
            },
                    validate_oldFollowDeptName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "原跟进人部门名称不能为空";
                    }
                }
            },
                    validate_operatorId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "当前录入人id不能为空";
                    }
                }
            },
                    validate_operatorName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "当前录入人名称不能为空";
                    }
                }
            },
                    validate_timeCreate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "创建时间不能为空";
                    }
                }
            },
                    validate_timeUpdate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "更新时间不能为空";
                    }
                }
            },
                    validate_deleted: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "0未删除，1已删除不能为空";
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
