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
        enable:false,
        nocheckInherit:true,
    }
};
var vm = new Vue({
    el:'#rrapp',
    data:{
        tenantEntity: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.tenantEntity = param.data;
        if(_this.tenantEntity.menuIdList == null){
            _this.tenantEntity.menuIdList = [];
        }
    },
    computed:{
        getTenantFlag: {
            get: function () {
                if (this.tenantEntity.tenantFlag == 0) {
                    return "正常";
                } else if (this.tenantEntity.tenantFlag == 1) {
                    return "停用";
                } else {
                    return "--";
                }
            }
        },
        getBigScreenFlag: {
            get: function () {
                if (this.tenantEntity.bigScreenFlag == 0) {
                    return "开启";
                } else if (this.tenantEntity.bigScreenFlag == 1) {
                    return "关闭";
                } else {
                    return "--";
                }
            }
        },
        getTenantType: {
            get: function () {
                if (this.tenantEntity.tenantType == 0) {
                    return "平台";
                } else if (this.tenantEntity.tenantType == 1) {
                    return "商户";
                } else {
                    return "--";
                }
            }

        }

    },
    updated: function(){
        layui.form.render();
    },
    methods: {

    }
});

function init(layui) {
    initEventListener(layui);

    $('#menuTree').html('');
    $.get(baseURL + "sys/menu/list", function(r){
        for (let i = 0; i < r.length; i++) {
            if($.inArray(r[i].menuId, vm.tenantEntity.menuIdList) < 0) {
                r.splice(i,1);
                i = i-1;
            }
        }
        menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r);
        //展开所有节点
        menu_ztree.expandAll(false);
    });
}

function initEventListener(layui) {
    initClick();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
