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
            keyword: null,
            type: null,
            timeDate: null,
            timeDatestart: null,
            timeDateend: null,
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

            var cluesRecordIds = [];
            $.each(list, function(index, item) {
                cluesRecordIds.push(item.cluesRecordId);
            });
            return cluesRecordIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (cluesRecordId) {
            $.get(baseURL + "cluesnew/cluesrecord/info/"+cluesRecordId, function(r){
                var param = {
                    data:r.cluesRecord
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesrecordview.html",
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
                content: tabBaseURL + "modules/cluesnew/cluesrecordedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (cluesRecordId) {
            $.get(baseURL + "cluesnew/cluesrecord/info/"+cluesRecordId, function(r){
                var param = {
                    data:r.cluesRecord
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesrecordedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (cluesRecordIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "cluesnew/cluesrecord/delete",
                    contentType: "application/json",
                    data: JSON.stringify(cluesRecordIds),
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
            window.location.href = urlParamByObj(baseURL + 'cluesnew/cluesrecord/export', vm.q);
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
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '关键字', placeholder: '请输入关键字', fieldName: 'keyword',},
            {type: 'select', label: '状态', placeholder: '请选择状态', fieldName: 'type', selectMap: {
                    0:'正常',
                    1:'禁用',
                }, selectFilter: true
            },
            {type: 'date', label: '日期', placeholder: '选择日期范围', fieldName: 'timeDate', selectFilter: true},
            //{type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList},
            //{type: 'select', label: '出租方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList, selectFilter: true},
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
            }
        }
    }).initView();
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
        var cluesRecordIds = vm.selectedRows();
        if(cluesRecordIds == null){
            return;
        }
        vm.del(cluesRecordIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'cluesnew/cluesrecord/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'cluesRecordId', title: '', minWidth:200, templet: function (d) {return isEmpty(d.cluesRecordId);}},
                            {field:'cluesId', title: '线索id', minWidth:200, templet: function (d) {return isEmpty(d.cluesId);}},
                            {field:'newFollowId', title: '新跟进人id', minWidth:200, templet: function (d) {return isEmpty(d.newFollowId);}},
                            {field:'newFollowName', title: '新跟进人名称', minWidth:200, templet: function (d) {return isEmpty(d.newFollowName);}},
                            {field:'newFollowDeptId', title: '新跟进人部门id', minWidth:200, templet: function (d) {return isEmpty(d.newFollowDeptId);}},
                            {field:'newFollowDeptName', title: '新跟进人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.newFollowDeptName);}},
                            {field:'oldFollowId', title: '原跟进人id', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowId);}},
                            {field:'oldFollowName', title: '原跟进人名称', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowName);}},
                            {field:'oldFollowDeptId', title: '原跟进人部门id', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowDeptId);}},
                            {field:'oldFollowDeptName', title: '原跟进人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowDeptName);}},
                            {field:'operatorId', title: '当前录入人id', minWidth:200, templet: function (d) {return isEmpty(d.operatorId);}},
                            {field:'operatorName', title: '当前录入人名称', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
                            {field:'operatorDeptId', title: '当前录入部门id', minWidth:200, templet: function (d) {return isEmpty(d.operatorDeptId);}},
                            {field:'operatorDeptName', title: '当前录入人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.operatorDeptName);}},
                            {field:'desc', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.desc);}},
                            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
                            {field:'timeUpdate', title: '更新时间', minWidth:200, templet: function (d) {return isEmpty(d.timeUpdate);}},
                            {field:'delect', title: '删除状态（0未删除，1已删除）', minWidth:200, templet: function (d) {return isEmpty(d.delect);}},
            
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
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
            vm.update(data.cluesRecordId);
        } else if(layEvent === 'del'){
            var cluesRecordId = [data.cluesRecordId];
            vm.del(cluesRecordId);
        } else if(layEvent === 'view'){
            vm.view(data.cluesRecordId);
        }
    });
}

function initDate(laydate) {

}
