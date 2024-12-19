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
        clues: {},
        usrLst: [],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.clues = param.data;
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (vm.clues.customerType == null || vm.clues.customerType == ''){
                alert('请选择客户类型');
                return;
            }
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + 'clues/clues/save',
                contentType: "application/json",
                data: JSON.stringify(vm.clues),
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
        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
       /* zTreeClickTwo: function(event, treeId, treeNode){
            Vue.set(vm.clues,"deptId",treeNode.deptId);
            Vue.set(vm.clues,"deptName",treeNode.name);
            layer.closeAll();
        },*/
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.clues,"deptId",treeNode.deptId);
            Vue.set(vm.clues,"deptName",treeNode.name);
            layer.closeAll();
        },
    }
});

function init(layui) {
    //初始化给单选按钮一个默认值
    vm.clues.customerType=1;
    //影藏联系人文本框及非空校验
    $("#contact").hide()
    $("#contactVerify").removeAttr("lay-verify");

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
        validate_cluesName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "客户名称不能为空";
                }
            }
        },
        deptNameVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "所属部门不能为空";
                }
            }
        },
        contactVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "联系人不能为空";
                }
            }
        },
        validate_phone: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                var reg= /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/;
                if (value == null || value == '') {
                    vm.verify = false;
                    return "电话不能为空";
                }
                if(!reg.test(value)){
                    return '电话号码输入有误，请重新输入';
                }
            }
        },
        validate_followUserId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "跟进人不能为空";
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

    form.on('radio(customerType)', function (data) {
        vm.clues.customerType = data.value;
        if(data.value==1){
            $("#contact").hide()
            $("#contactVerify").removeAttr("lay-verify");
        }else {
            $("#contact").show()
            $("#contactVerify").attr("lay-verify","contactVerify");
        }
    });

    form.on('select(operatorId)', function (data) {
        var usrid = data.value;
        vm.clues.sysUserId = usrid;
       /* var obj = vm.usrLst.filter(function (obj) {
            return obj.userId == usrid;
        })[0];
        if (obj != null){
            vm.clues.followUserName = obj.username;
        }else {
            vm.clues.followUserName = '';
        }*/
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
