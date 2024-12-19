//部门结构树
var dept_ztree;
var dept_setting = {
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

    },
    callback: {
        beforeClick: zTreeBeforeClick,
        onClick: zTreeOnClick
    }
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return true;
};
function zTreeOnClick(event, treeId, treeNode) {
    Vue.set(parent.vm.companyOrderInvoice,"lessorIssuesInvoiceId",treeNode.deptId);
    Vue.set(parent.vm.companyOrderInvoice,"lessorIssuesInvoiceName",treeNode.name);
    parent.layer.closeAll();
};
$(function(){
    vm.getDept();
});



var vm = new Vue({
    el:'#rrapp',
    data:{

    },
    computed: function () {
        layui.form.render();
    },
    mounted:function(){
        layui.form.render();
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list",{"sysDeptType":"1,2,3","sysDeptStatus":"1"}, function(r){
                dept_ztree = $.fn.zTree.init($("#deptTree"), dept_setting, r);
                var node = dept_ztree.getNodeByParam("deptId", parent.vm.companyOrderInvoice.lessorIssuesInvoiceId);
                if(node != null){
                    dept_ztree.selectNode(node);
                    Vue.set(parent.vm.companyOrderInvoice,"lessorIssuesInvoiceName",node.name);
                }
            })
        }
    }
});

