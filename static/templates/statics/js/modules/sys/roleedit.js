$(function () {
    initParam();
    if(vm.tempRole == undefined || vm.tempRole == null || vm.tempRole.roleId == null ){
        vm.getMenuTree(188);
    }else{
        vm.getMenuTree(vm.tempRole.roleId);
    }

    //初始化日期
    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form
        form.render();
        //自定义验证
        form.verify({
            roleName: function(value){
                if(value=="" ||value==null){
                    return '角色名称不能为空';
                }
            }
        });
        form.on('submit(saveOrUpdate)', function(){
            vm.saveOrUpdate();
            return false;
        });
        form.on('checkbox(appLabel)', function(data){
            if(data.elem.checked){
                vm.role.appLabelList.push(data.value);
            }else{
                vm.role.appLabelList=vm.role.appLabelList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.appLabelList);
            vm.role.appLabelList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });
        form.on('checkbox(reminder)', function(data){
            if(data.elem.checked){
                vm.role.reminderList.push(data.value);
            }else{
                vm.role.reminderList=vm.role.reminderList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.reminderList);
            vm.role.reminderList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });
        form.on('checkbox(dailyTool)', function(data){
            if(data.elem.checked){
                vm.role.dailyToolList.push(data.value);
            }else{
                vm.role.dailyToolList=vm.role.dailyToolList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.dailyToolList);
            vm.role.dailyToolList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });
        form.on('checkbox(vehicleManagement)', function (data) {
            if (data.elem.checked) {
                vm.role.vehicleManagementList.push(data.value);
            } else {
                vm.role.vehicleManagementList = vm.role.vehicleManagementList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.vehicleManagementList);
            vm.role.vehicleManagementList = Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });

        form.on('checkbox(channelManagement)', function (data) {
            if (data.elem.checked) {
                vm.role.channelManagement.push(data.value);
            } else {
                vm.role.channelManagement = vm.role.channelManagement.filter(t => t != data.value);
            }
            var set = new Set(vm.role.channelManagement);
            vm.role.channelManagement = Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });

        form.on('checkbox(salesManagement)', function (data) {
            if (data.elem.checked) {
                vm.role.salesManagementList.push(data.value);
            } else {
                vm.role.salesManagementList = vm.role.salesManagementList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.salesManagementList);
            vm.role.salesManagementList = Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });

        form.on('checkbox(carButton)', function(data){
            if(data.elem.checked){
                vm.role.carButtonList.push(data.value);
            }else{
                vm.role.carButtonList=vm.role.carButtonList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.carButtonList);
            vm.role.carButtonList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });

        form.on('checkbox(carDetail)', function(data){
            if(data.elem.checked){
                vm.role.carDetailList.push(data.value);
            }else{
                vm.role.carDetailList=vm.role.carDetailList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.carDetailList);
            vm.role.carDetailList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });
        form.on('checkbox(orderButton)', function(data){
            if(data.elem.checked){
                vm.role.orderButtonList.push(data.value);
            }else{
                vm.role.orderButtonList=vm.role.orderButtonList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.orderButtonList);
            vm.role.orderButtonList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });

        form.on('checkbox(orderDetail)', function(data){
            if(data.elem.checked){
                vm.role.orderDetailList.push(data.value);
            }else{
                vm.role.orderDetailList=vm.role.orderDetailList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.orderDetailList);
            vm.role.orderDetailList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });


        form.on('checkbox(customerDetail)', function(data){
            if(data.elem.checked){
                vm.role.customerDetailList.push(data.value);
            }else{
                vm.role.customerDetailList=vm.role.customerDetailList.filter(t => t != data.value);
            }
            var set = new Set(vm.role.customerDetailList);
            vm.role.customerDetailList=Array.from(set); // Array.from方法可以将 Set 结构转为数组。
        });
    });
});

//菜单树
var menu_ztree;
var menu_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl",
            icon:null
        },

    },
    check:{
        enable:true,
        nocheckInherit:true
    }
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        showForm: true,
        tempRole: {},
        role:{
            roleId:null,
            roleName:null,
            remark:null,
            reminder:null, //APP控制台-提醒事件字符串
            dailyTool:null, //APP控制台-日常工具字符串
            vehicleManagement:null, //APP控制台-车辆管理字符串
            salesManagement:null, //APP控制台-销售管理字符串
            carButton:null, //APP车辆-按钮操作权限字符串
            carDetail:null,//APP车辆-详情操作权限字符串
            orderButton:null, //APP订单-按钮操作权限字符串
            orderDetail:null, //APP订单-详情操作权限字符串
            customerDetail: null, //APP客户-详情业务信息操作权限字符串
            appLabelList:[], // app底部标签功能
            reminderList: [], //APP控制台-提醒事件
            dailyToolList: [], //APP控制台-日常工具
            vehicleManagementList: [], //APP控制台-车辆管理
            salesManagementList: [], //APP控制台-销售管理
            carButtonList: [], //APP车辆-按钮操作权限
            carDetailList: [],//APP车辆-详情操作权限
            orderButtonList: [], //APP订单-按钮操作权限
            orderDetailList: [],//APP订单-详情操作权限
            customerDetailList: [],//APP客户管理-详情业务信息操作权限
            channelManagement: []
        },
        appLabelList:[],// APP底部标签功能
        reminderList: [], //APP控制台-提醒事件
        dailyToolList: [], //APP控制台-日常工具
        vehicleManagementList: [], //APP控制台-车辆管理
        salesManagementList: [], //APP控制台-销售管理
        carButtonList: [], //APP车辆-按钮操作权限
        carDetailList: [],//APP车辆-详情操作权限
        orderButtonList: [],//APP订单-按钮操作权限
        orderDetailList: [],//APP订单-详情操作权限
        customerDetailList: [],//APP客户管理-详情业务信息操作权限
        channelManagement: []
    },
    created: function() {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tempRole = param.role;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        closePage: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },
        getRole: function(roleId){
            $.get(baseURL + "sys/role/info/"+roleId, function(r){
                if(vm.role != undefined && vm.role != null){
                    vm.role = r.role;
                    if(vm.role.reminder == undefined || vm.role.reminder == null || vm.role.reminder == ''){
                        Vue.set(vm.role, "reminderList", []);
                    }else{
                        Vue.set(vm.role, "reminderList", vm.role.reminder.split(","));
                    }
                    if(vm.role.appLabel == undefined || vm.role.appLabel == null || vm.role.appLabel == ''){
                        Vue.set(vm.role, "appLabelList", []);
                    }else{
                        Vue.set(vm.role, "appLabelList", vm.role.appLabel.split(","));
                    }
                    if (vm.role.dailyTool == undefined || vm.role.dailyTool == null || vm.role.dailyTool == '') {
                        Vue.set(vm.role, "dailyToolList", []);
                    } else {
                        Vue.set(vm.role, "dailyToolList", vm.role.dailyTool.split(","));
                    }
                    if (vm.role.vehicleManagement == undefined || vm.role.vehicleManagement == null || vm.role.vehicleManagement == '') {
                        Vue.set(vm.role, "vehicleManagementList", []);
                    } else {
                        Vue.set(vm.role, "vehicleManagementList", vm.role.vehicleManagement.split(","));
                    }

                    if (vm.role.channelManagement == undefined || vm.role.channelManagement == null || vm.role.channelManagement == '') {
                        Vue.set(vm.role, "channelManagement", []);
                    } else {
                        Vue.set(vm.role, "channelManagement", vm.role.channelManagement.split(","));
                    }


                    if (vm.role.salesManagement == undefined || vm.role.salesManagement == null || vm.role.salesManagement == '') {
                        Vue.set(vm.role, "salesManagementList", []);
                    } else {
                        Vue.set(vm.role, "salesManagementList", vm.role.salesManagement.split(","));
                    }
                    if (vm.role.carButton == undefined || vm.role.carButton == null || vm.role.carButton == '') {
                        Vue.set(vm.role, "carButtonList", []);
                    } else {
                        Vue.set(vm.role, "carButtonList", vm.role.carButton.split(","));
                    }
                    if(vm.role.carDetail == undefined || vm.role.carDetail == null || vm.role.carDetail == ''){
                        Vue.set(vm.role, "carDetailList", []);
                    }else{
                        Vue.set(vm.role, "carDetailList", vm.role.carDetail.split(","));
                    }
                    if(vm.role.orderButton == undefined || vm.role.orderButton == null || vm.role.orderButton == ''){
                        Vue.set(vm.role, "orderButtonList", []);
                    }else{
                        Vue.set(vm.role, "orderButtonList", vm.role.orderButton.split(","));
                    }
                    if(vm.role.orderDetail == undefined || vm.role.orderDetail == null || vm.role.orderDetail == ''){
                        Vue.set(vm.role, "orderDetailList", []);
                    }else{
                        Vue.set(vm.role, "orderDetailList", vm.role.orderDetail.split(","));
                    }

                    if(vm.role.customerBussiness == undefined || vm.role.customerBussiness == null || vm.role.customerBussiness == ''){
                        Vue.set(vm.role, "customerDetailList", []);
                    }else{
                        Vue.set(vm.role, "customerDetailList", vm.role.customerBussiness.split(","));
                    }
                }
                //勾选角色所拥有的菜单
                var menuIds = vm.role.menuIdList;
                for(var i=0; i<menuIds.length; i++) {
                    var node = menu_ztree.getNodeByParam("menuId", menuIds[i]);
                    menu_ztree.checkNode(node, true, false);
                }
            });
        },
        saveOrUpdate: function () {
            if(vm.reminderList.length >0){
                Vue.set(vm.role, "reminder", vm.role.reminderList.join(","));
            }
            if(vm.appLabelList.length >0){
                Vue.set(vm.role, "appLabel", vm.role.appLabelList.join(","));
            }
            if(vm.dailyToolList.length >0){
                Vue.set(vm.role, "dailyTool", vm.role.dailyToolList.join(","));
            }
            if(vm.vehicleManagementList.length >0){
                Vue.set(vm.role, "vehicleManagement", vm.role.vehicleManagementList.join(","));
            }
            if(vm.salesManagementList.length >0){
                Vue.set(vm.role, "salesManagement", vm.role.salesManagementList.join(","));
            }
            if(vm.carButtonList.length >0){
                Vue.set(vm.role, "carButton", vm.role.carButtonList.join(","));
            }
            if(vm.carDetailList.length >0){
                Vue.set(vm.role, "carDetail", vm.role.carDetailList.join(","));
            }
            if (vm.orderButtonList.length > 0) {
                Vue.set(vm.role, "orderButton", vm.role.orderButtonList.join(","));
            }
            if (vm.orderDetailList.length > 0) {
                Vue.set(vm.role, "orderDetail", vm.role.orderDetailList.join(","));
            }
            if (vm.customerDetailList.length > 0) {
                Vue.set(vm.role, "customerBussiness", vm.role.customerDetailList.join(","));

            }
            if (vm.channelManagement.length > 0) {
                Vue.set(vm.role, "channelManagement", vm.role.channelManagement.join(","));

            }

            //获取选择的菜单
            var nodes = menu_ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            for (var i = 0; i < nodes.length; i++) {
                menuIdList.push(nodes[i].menuId);
            }
            vm.role.menuIdList = menuIdList;
            if(vm.tempRole.roleId ==undefined || vm.tempRole.roleId==null){
                vm.role.roleId = null;
            }
            var url = vm.role.roleId == null ? "sys/role/save" : "sys/role/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.role),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        getMenuTree: function(roleId) {
            $('#menuTree').html('');
            //加载菜单树
            $.get(baseURL + "sys/menu/list", function(r){
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r);
                //展开所有节点
                menu_ztree.expandAll(false);
                if(roleId != null){
                    vm.getRole(roleId);
                }
            });
        }
    }
});

function initParam() {
    var url = "sys/dict/roleparamlist";
    $.ajax({
        type: "GET",
        url: baseURL + url,
        success: function(r){
            if(r.code === 0) {
                if (r.reminderList != undefined && r.reminderList != null) {
                    vm.reminderList = r.reminderList;
                }
                if (r.appLabelList != undefined && r.appLabelList != null) {
                    vm.appLabelList = r.appLabelList;
                }
                if (r.dailyToolList != undefined && r.dailyToolList != null) {
                    vm.dailyToolList = r.dailyToolList;
                }
                if (r.vehicleManagementList != undefined && r.vehicleManagementList != null) {
                    vm.vehicleManagementList = r.vehicleManagementList;
                }
                if (r.channelManagement != undefined && r.channelManagement != null) {
                    vm.channelManagement = r.channelManagement;
                }
                if (r.salesManagementList != undefined && r.salesManagementList != null) {
                    vm.salesManagementList = r.salesManagementList;
                }
                if (r.carButtonList != undefined && r.carButtonList != null) {
                    vm.carButtonList = r.carButtonList;
                }
                if (r.carDetailList != undefined && r.carDetailList != null) {
                    vm.carDetailList = r.carDetailList;
                }
                if (r.orderButtonList != undefined && r.orderButtonList != null) {
                    vm.orderButtonList =r.orderButtonList;
                }
                if(r.orderDetailList != undefined && r.orderDetailList != null){
                    vm.orderDetailList =r.orderDetailList;
                }
                if(r.customerDetailList != undefined && r.customerDetailList != null){
                    vm.customerDetailList =r.customerDetailList;
                }
            }else{
                alert(r.msg);
            }
        }
    });
}