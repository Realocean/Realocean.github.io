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
            code: null,
            status:''
        },
        isClose: true,
        contraccarSource: {}
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
            vm.q.code = null;
            vm.q.status = '';
        },
        view: function (id) {
            $.get(baseURL + "order/contraccarsource/info/"+id, function(r){
                var param = {
                    data:r.contraccarSource
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contraccarsourceview.html",
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
                content: tabBaseURL + "modules/contract/contraccarsourceedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        invalid: function(id) {
            vm.contraccarSource.id = id;
            vm.contraccarSource.status = 2;
            $.ajax({
                type: "POST",
                url: baseURL + "order/contraccarsource/invalid",
                contentType: "application/json",
                data: JSON.stringify(vm.contraccarSource),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('作废成功', function(index){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        update: function (id) {
            $.get(baseURL + "order/contraccarsource/info/"+id, function(r){
                var param = {
                    data:r.contraccarSource
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contraccarsourceedit.html",
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
                    url: baseURL + "order/contraccarsource/delete",
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
            var url = baseURL + 'order/contraccarsource/export?a=a';
            if(vm.q.code != null && vm.q.code != ''){
                url += ('&code='+vm.q.code);
            }
            if(vm.q.status != null && vm.q.status != ''){
                url += ('&status='+vm.q.status);
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    code: vm.q.code,
                    status: vm.q.status
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
    form.on('select(status)', function (data) {
        vm.q.status = data.value;
    });
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
        url: baseURL + 'order/contraccarsource/queryList',
        cols: [[
            {title: '操作', templet:'#barTpl',fixed:"left",align:"center"},
            {field:'code', title: '合同编号',align:"center", templet: function (d) {return isEmpty(d.code);}},
            {field:'statusStr', title: '合同状态',align:"center", templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'contractStart', title: '合同生效日期',align:"center", templet: function (d) {return isEmpty(d.contractStart);}},
            {field:'contractEnd', title: '合同终止日期',align:"center", templet: function (d) {return isEmpty(d.contractEnd);}},
            {field:'createUserName', title: '提交人',align:"center", templet: function (d) {return isEmpty(d.createUserName);}},
            {field:'createTime', title: '合同记录时间',align:"center", templet: function (d) {return isEmpty(d.createTime);}},
            {field:'remark', title: '合同备注',align:"center", templet: function (d) {return isEmpty(d.remark);}}
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
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        } else if(layEvent === 'invalid'){
            vm.invalid(data.id);
        }
    });
}

function initDate(laydate) {

}
