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
        nocheckInherit:true,
    }
};
var vm = new Vue({
    el:'#rrapp',
    data: {
        q: {
            keyword: null
        },
        //设备生产商下拉列表数据源
        tenantEntity: {},
        menuPermissionTypeId: 'menuPermissionTypeId_0',
        tenantFlag: false,
        verify: false
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tenantEntity = param.data;
        if(_this.tenantEntity.smsStatus == null){
              _this.tenantEntity.smsStatus = 1;
        }
        if(_this.tenantEntity.bigScreenFlag == null){
            _this.tenantEntity.bigScreenFlag = 1;
        }
        if(_this.tenantEntity.menuPermissionType == null){
            _this.tenantEntity.menuPermissionType = 1;
        }
        if(_this.tenantEntity.menuIdList == null){
            _this.tenantEntity.menuIdList = [];
        }
        _this.tenantFlag = sessionStorage.getItem("tenantFlag")^0;
        if (_this.tenantFlag) {
            _this.tenantEntity.tenantType = 1;
        }
    },
    mounted() {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var nodes = menu_ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            for (var i = 0; i < nodes.length; i++) {
                menuIdList.push(nodes[i].menuId);
            }
            vm.tenantEntity.menuIdList = menuIdList;
            var url = vm.tenantEntity.tenantId == null ? "merchant/tenant/add" : "merchant/tenant/updateTenant";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tenantEntity),
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
    $('#menuTree').html('');
    $.get(baseURL + "sys/menu/list", function(r){
        menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r);
        //展开所有节点
        menu_ztree.expandAll(false);
        if(vm.tenantEntity.menuIdList != null && vm.tenantEntity.menuIdList.length > 0){
            for(var i=0; i<vm.tenantEntity.menuIdList.length; i++) {
                var node = menu_ztree.getNodeByParam("menuId", vm.tenantEntity.menuIdList[i]);
                menu_ztree.checkNode(node, true, false);
            }
        }
    });

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        tenantCode: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "商户号不能为空";
                }
            }
        },
        tenantName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "商户名称不能为空";
                }
            }
        },
        tenantConcat: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "商户联系人不能为空";
                }
            }
        },
        tenantPhone: function (value, item) {
            if (value == null || value == '') {
                return "联系电话不能为空";
            }
        },
        altMchNo: function (value, item) {
            if (value == null || value == '') {
                return "分账方编号不能为空";
            }
        },
        tenantType: function (value, item) {
            if (value == null || value == '') {
                return "商户类型不能为空";
            }
        },
        illegalQuery: function (value, item) {
            if (value == null || value == '') {
                return "违章查询链接不能为空";
            }
        },
        illegalNation: function (value, item) {
            if (value == null || value == '') {
                return "全国违章查询链接不能为空";
            }
        },
        ocrClientId: function (value, item) {
            if (value == null || value == '') {
                return "图文识别appId不能为空";
            }
        },
        ocrClientSecret: function (value, item) {
            if (value == null || value == '') {
                return "图文识别appSecret不能为空";
            }
        },
        cljkLoginName: function (value, item) {
            if (value == null || value == '') {
                return "车辆监控登录名不能为空";
            }
        },
        cljkPassword: function (value, item) {
            if (value == null || value == '') {
                return "车辆监控登录密码不能为空";
            }
        },
         smsUid: function (value, item) {
             if(vm.tenantEntity.smsStatus == 1){
                 if (value == null || value == '') {
                     return "短信密账号不能为空!";
                 }
             }
         },
        smsPassword: function (value, item) {
           if(vm.tenantEntity.smsStatus == 1){
                if (value == null || value == '') {
                    return "短信密码不能为空!";
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

    //是否断油电
    form.on('select(tenantType)', function (data) {
        vm.tenantEntity.tenantType = data.value;
    });

    form.on('radio(smsStatus)', function(data){
        vm.tenantEntity.smsStatus = data.value;
    });
    form.on('radio(bigScreenFlag)', function(data){
        vm.tenantEntity.bigScreenFlag = data.value;
    });
    form.on('radio(menuPermissionType)', function(data){
        Vue.set(vm.tenantEntity, 'menuPermissionType', data.value^0);
        vm.menuPermissionTypeId = 'menuPermissionTypeId_'+uuid(32);
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
