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
var ztree;
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var vm = new Vue({
    el:'#rrapp',
    data:{
        hetong:false,
        q:{
            keyword: null
        },
        clues: {},
        followType: '',
        handoveruserlist:[],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.clues = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/dept/list", function(r){
            ztree = $.fn.zTree.init($("#deptTree"), setting, r);
        })
        if (_this.clues.followType == 2){
            $.get(baseURL + "sys/user/listall?deptId="+_this.clues.followDeptId, function(r){
                _this.handoveruserlist=r.userList;
            })
        }
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        retractChange:function(data){
            if(data == 1){
                this.hetong = false
            }
        },
        expandChange:function(data){
            console.log(1)
            if(data == 1){
                this.$nextTick(()=>{
                    this.hetong = true
                })
                
            }
        },
        saveOrUpdate: function (event) {
            if (vm.clues.customerType == null || vm.clues.customerType === '') {
                alert('请选择线索客户类型');
                return;
            }
            if (vm.clues.followId == vm.clues.operatorId){
                vm.clues.followType = 1;
            }else vm.clues.followType = 2;
            var url = vm.clues.cluesId == null ? "cluesnew/clues/save" : "cluesnew/clues/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
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
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '350px'],
                shade: 0,
                shadeClose: false,
                content: $("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    vm.clues.followDeptId = node[0].deptId;
                    vm.clues.followDeptName = node[0].name;
                    vm.getUserList(vm.clues.followDeptId);
                    layer.close(index);
                },
                end: function(){
                    $("#deptLayer").hide();
                }
            });
        },
        getUserList :function(deptId){
            vm.handoveruserlist=[];
            $.ajax({
                async :false,
                type: "GET",
                url: baseURL + "sys/user/listall?deptId="+deptId,
                success: function(r){
                    vm.handoveruserlist=r.userList;
                }
            });
        }
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
        validate_customerName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "客户名称不能为空";
                }
            }
        },
        validate_phone: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "联系电话不能为空";
                }
            }
        },
        validate_cluesState: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择线索状态";
                }
            }
        },
        validate_cluesSource: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择线索来源";
                }
            }
        },
        validate_intentionStatus: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择意向情况";
                }
            }
        },
        validate_followId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.clues.followType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择跟进人";
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
    });

    form.on('select(cluesSource)', function (data) {
        vm.clues.cluesSource = data.value;
    });

    form.on('select(intentionStatus)', function (data) {
        vm.clues.intentionStatus = data.value;
    });

    form.on('select(cluesState)', function (data) {
        vm.clues.cluesState = data.value;
    });

    form.on('radio(followType)', function (data) {
        var type = parseInt(data.value);
        vm.clues.followType = type;
        switch (type){
            case 1:{
                vm.clues.followId = vm.clues.operatorId;
                vm.clues.followName = vm.clues.operatorName;
                vm.clues.followDeptId = vm.clues.operatorDeptId;
                vm.clues.followDeptName = vm.clues.operatorDeptName;
                break;
            }
            case 2:{
                vm.clues.followId = '';
                vm.clues.followName = '';
                vm.clues.followDeptId = '';
                vm.clues.followDeptName = '';
                break;
            }
        }

    });

    form.on('select(followId)', function(data){
        var userId = data.value;
        vm.clues.followId = userId;
        var obj = vm.handoveruserlist.filter(function (obj) {
            return obj.userId == userId;
        })[0];
        if (obj != null){
            vm.clues.followName = obj.username;
        }else {
            vm.clues.followName = '';
        }
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
