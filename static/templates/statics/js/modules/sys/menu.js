$(function () {

    layui.form.on('radio(type)', function(data){
        vm.menu.type = data.value;
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

});

var setting = {
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
        }
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        showForm: false,
        menu:{
            parentName:null,
            parentId:0,
            type:1,
            orderNum:0
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        getMenu: function(){
            //加载菜单树
            $.get(baseURL + "sys/menu/select", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.menuList);
                var node = ztree.getNodeByParam("menuId", vm.menu.parentId);
                ztree.selectNode(node);

                vm.menu.parentName = node.name;
            })
        },
        add: function(){
            vm.menu = {parentName:null,parentId:0,type:1,orderNum:0};
            vm.getMenu();

            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        update: function () {
            var menuId = getMenuId();
            if(menuId == null){
                return ;
            }

            $.get(baseURL + "sys/menu/info/"+menuId, function(r){
                vm.menu = r.menu;

                vm.getMenu();
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        del: function () {
            var menuId = getMenuId();
            if(menuId == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/menu/delete",
                    data: "menuId=" + menuId,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function () {
            var url = vm.menu.menuId == null ? "sys/menu/save" : "sys/menu/update";
            $.ajax({
                type: "POST",
                url:  baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.menu),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        menuTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.menu.parentId = node[0].menuId;
                    vm.menu.parentName = node[0].name;

                    layer.close(index);
                },
                end: function(){
                    $("#menuLayer").hide();
                }
            });
        },
        reload: function () {
            Menu.table.refresh();
        }
    }
});


var Menu = {
    id: "menuTable",
    table: null,
    layerIndex: -1
};

/**
 * 初始化表格的列
 */
Menu.initColumn = function () {
    var columns = [
        {field: 'selectItem', radio: true},
        {title: '菜单ID', field: 'menuId', visible: false, align: 'center', valign: 'middle', width: '80px'},
        {title: '菜单名称', field: 'name', align: 'center', valign: 'middle',  width: '180px'},
        {title: '上级菜单', field: 'parentName', align: 'center', valign: 'middle',  width: '100px'},
        {title: '图标', field: 'icon', align: 'center', valign: 'middle',  width: '80px', formatter: function(item, index){
            return item.icon == null ? '' : '<i class="'+item.icon+' fa-lg"></i>';
        }},
        {title: '类型', field: 'type', align: 'center', valign: 'middle',  width: '100px', formatter: function(item, index){
            if(item.type === 0){
                return '<span class="label label-primary">目录</span>';
            }
            if(item.type === 1){
                return '<span class="label label-success">菜单</span>';
            }
            if(item.type === 2){
                return '<span class="label label-warning">按钮</span>';
            }
        }},
        {title: '排序号', field: 'orderNum', align: 'center', valign: 'middle',  width: '100px'},
        {title: '菜单URL', field: 'url', align: 'center', valign: 'middle',  width: '160px'},
        {title: '授权标识', field: 'perms', align: 'center', valign: 'middle', sortable: true}]
    return columns;
};


function getMenuId () {
    var selected = $('#menuTable').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return null;
    } else {
        return selected[0].id;
    }
}


$(function () {
    var colunms = Menu.initColumn();
    var table = new TreeTable(Menu.id, baseURL + "sys/menu/list", colunms);
    table.setExpandColumn(2);
    table.setIdField("menuId");
    table.setCodeField("menuId");
    table.setParentCodeField("parentId");
    table.setExpandAll(false);
    table.init();
    Menu.table = table;
});
