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
        }
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.keyword = null;
        },
        view: function (id) {
            $.get(baseURL + "clues/cluesrecord/info/"+id, function(r){
                var param = {
                    data:r.cluesRecord
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/clues/cluesrecordview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/clues/cluesrecordedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "clues/cluesrecord/info/"+id, function(r){
                var param = {
                    data:r.cluesRecord
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/clues/cluesrecordedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "clues/cluesrecord/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            var url = baseURL + 'clues/cluesrecord/export?a=a';
            if(vm.q.keyword != null && vm.q.keyword != ''){
                url += ('&keyword='+vm.q.keyword);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    keyword: vm.q.keyword
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
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'clues/cluesrecord/list',
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'id', title: '线索记录id', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'cluesId', title: '线索id', minWidth:200, templet: function (d) {return isEmpty(d.cluesId);}},
                            {field:'customerNameOld', title: '客户名称(旧)', minWidth:200, templet: function (d) {return isEmpty(d.customerNameOld);}},
                            {field:'customerNameNew', title: '客户名称(新)', minWidth:200, templet: function (d) {return isEmpty(d.customerNameNew);}},
                            {field:'phoneOld', title: '电话(旧)', minWidth:200, templet: function (d) {return isEmpty(d.phoneOld);}},
                            {field:'phoneNew', title: '电话(新)', minWidth:200, templet: function (d) {return isEmpty(d.phoneNew);}},
                            {field:'cluesStateOld', title: '线索状态(旧)', minWidth:200, templet: function (d) {return isEmpty(d.cluesStateOld);}},
                            {field:'cluesStateNew', title: '线索状态(新)', minWidth:200, templet: function (d) {return isEmpty(d.cluesStateNew);}},
                            {field:'cluesDescribeOld', title: '线索描述(旧)', minWidth:200, templet: function (d) {return isEmpty(d.cluesDescribeOld);}},
                            {field:'cluesDescribeNew', title: '线索描述(新)', minWidth:200, templet: function (d) {return isEmpty(d.cluesDescribeNew);}},
                            {field:'followIdOld', title: '跟进人(旧)', minWidth:200, templet: function (d) {return isEmpty(d.followIdOld);}},
                            {field:'followIdNew', title: '跟进人(新)', minWidth:200, templet: function (d) {return isEmpty(d.followIdNew);}},
                            {field:'followNameOld', title: '跟进人姓名(旧)', minWidth:200, templet: function (d) {return isEmpty(d.followNameOld);}},
                            {field:'followNameNew', title: '跟进人姓名(新)', minWidth:200, templet: function (d) {return isEmpty(d.followNameNew);}},
                            {field:'contactOld', title: '联系人(旧)', minWidth:200, templet: function (d) {return isEmpty(d.contactOld);}},
                            {field:'contactNew', title: '联系人(新)', minWidth:200, templet: function (d) {return isEmpty(d.contactNew);}},
                            {field:'timeCreate', title: '创建时间（跟进时间）', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
                            {field:'timeUpdate', title: '更新时间', minWidth:200, templet: function (d) {return isEmpty(d.timeUpdate);}},
                            {field:'delect', title: '删除状态（0未删除，1已删除）', minWidth:200, templet: function (d) {return isEmpty(d.delect);}},
            
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        }
    });
}

function initDate(laydate) {

}
