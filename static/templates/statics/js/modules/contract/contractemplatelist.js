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
            nameTpl: null,
            status: '',
        },
        isClose: true,
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
            resetNULL(vm.q);
            vm.q.status = '';
        },
        view: function (id) {
            $.get(baseURL + "contract/contraccontent/bodyByTemplate/"+id, function(r){
                var index = layer.open({
                    id: 'contractemplateview',
                    title: "查看",
                    type: 1,
                    content: r,
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
                content: tabBaseURL + "modules/contract/contractemplateedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "contract/contractemplate/info/"+id, function(r){
                var param = {
                    data:r.contractemplate
                };
                var index = layer.open({
                    title: "编辑",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contractemplateedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
            layer.full(index);
            // $.get(baseURL + "contract/contractemplate/info/"+id, function(r){
            //     var param = {
            //         title:r.contractemplate.nameFile,
            //         url:r.contractemplate.url,
            //         type:'edit_contractemplate',
            //         tag:id,
            //     };
            //     var index = layer.open({
            //         title: "编辑模板",
            //         type: 2,
            //         boxParams: param,
            //         content: tabBaseURL + "modules/docedit/editdoc.html",
            //         end: function () {
            //             layer.close(index);
            //         }
            //     });
            //     layer.full(index);
            // });
        },
        editStatus: function (id, editStatus) {
            confirm('确定要' +(editStatus == 1 ? '启用':'禁用')+ '该模版？', function(){
                var data = {
                    id: id,
                    status: editStatus
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + "contract/contractemplate/update",
                    contentType: "application/json",
                    data: JSON.stringify(data),
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
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "contract/contractemplate/delete",
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
            window.location.href = urlParamByObj(baseURL + 'contract/contractemplate/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
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
    form.on('select(status)', function (data) {
        vm.q.status = data.value;
    });
}

function initClick() {

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'contract/contractemplate/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:180, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'rentType', title: '模版租赁类型', minWidth:200, templet: function (d) {return getRentTypeStr(d.rentType);}},
            {field:'nameTpl', title: '模版名称', minWidth:200, templet: function (d) {return isEmpty(d.nameTpl);}},
            {field:'status', title: '状态', minWidth:200, templet: function (d) {return transformTypeByMap(d.status, {1:'正常', 2:'禁用'});}},
            {field:'countUse', title: '使用次数', minWidth:200, templet: function (d) {return isEmpty(d.countUse);}},
            {field:'desc', title: '模版备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
            {field:'operationName', title: '制作人', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return dateFormat(d.timeCreate);}}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
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
        if(layEvent === 'editStatus'){
            vm.editStatus(data.id, (data.status & 1) + 1);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        } else if(layEvent === 'edit'){
            vm.update(data.id);
        }
    });
}

function initDate(laydate) {

}
