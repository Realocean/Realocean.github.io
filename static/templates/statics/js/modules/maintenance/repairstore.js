$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            storeName:null,
            contacts: null,
            contactNumber: null,
        },
        isFilter:false,
    },
    created: function () {
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        update: function (id) {
            $.get(baseURL + "maintenance/repairstore/info/"+id, function(r){
                var param = {
                    data:r.repairStore
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/maintenance/repairstoreedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (id) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/repairstore/delete",
                    data: "id=" + id,
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
        add: function(){
            var param = {
                data:{
                }
            };
            var index = layer.open({
                title: "新增门店信息",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/maintenance/repairstoreedit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
}


function initData() {
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(signStatus)', function (data) {
        vm.q.signStatus = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
}


function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL + 'maintenance/repairstore/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:170, minWidth:170, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'storeName', title: '门店名称', minWidth:200, templet: function (d) {return isEmpty(d.storeName);}},
            {field:'types', title: '维修类型', minWidth:200, templet: function (d) {return isEmpty(d.types);}},
            {field:'contacts', title: '联系人', minWidth:100, templet: function (d) {return isEmpty(d.contacts);}},
            {field:'contactNumber', title: '联系电话', minWidth:100, templet: function (d) {return isEmpty(d.contactNumber);}},
            {field:'deptName', title: '所属部门', minWidth:100, templet: function (d) {return isEmpty(d.deptName);}},
            {field:'storeAddress', title: '门店地址', minWidth:200, templet: function (d) {return isEmpty(d.storeAddress);}}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

    initTableEvent(table);
}


function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        }else if(layEvent === 'del'){
            vm.del(data.id);
        }
    });


}

