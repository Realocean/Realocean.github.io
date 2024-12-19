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

            var subSchemeIds = [];
            $.each(list, function(index, item) {
                subSchemeIds.push(item.subSchemeId);
            });
            return subSchemeIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (subSchemeId) {
            $.get(baseURL + "subscheme/subscheme/info/"+subSchemeId, function(r){
                var param = {
                    data:r.subScheme
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/subscheme/subschemeview.html",
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
                content: tabBaseURL + "modules/subscheme/subschemeedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (subSchemeId) {
            $.get(baseURL + "subscheme/subscheme/info/"+subSchemeId, function(r){
                var param = {
                    data:r.subScheme
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/subscheme/subschemeedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (subSchemeIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "subscheme/subscheme/delete",
                    contentType: "application/json",
                    data: JSON.stringify(subSchemeIds),
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
            window.location.href = urlParamByObj(baseURL + 'subscheme/subscheme/export', vm.q);
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
        var subSchemeIds = vm.selectedRows();
        if(subSchemeIds == null){
            return;
        }
        vm.del(subSchemeIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
   //   toolbar: true,
   //   defaultToolbar: ['filter'],
        url: baseURL + 'subscheme/subscheme/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'subSchemeId', title: '子方案ID', minWidth:200, templet: function (d) {return isEmpty(d.subSchemeId);}},
                            {field:'schemeId', title: '主方案ID', minWidth:200, templet: function (d) {return isEmpty(d.schemeId);}},
                            {field:'downPayment', title: '首付款', minWidth:200, templet: function (d) {return isEmpty(d.downPayment);}},
                            {field:'monthlyRent', title: '月租金', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
                            {field:'tenancy', title: '租期', minWidth:200, templet: function (d) {return isEmpty(d.tenancy);}},
                            {field:'balance', title: '尾款', minWidth:200, templet: function (d) {return isEmpty(d.balance);}},
                            {field:'deposit', title: '保证金', minWidth:200, templet: function (d) {return isEmpty(d.deposit);}},
                            {field:'isEnable', title: '启用停用(1启用，2停用)', minWidth:200, templet: function (d) {return isEmpty(d.isEnable);}},
                            {field:'deleted', title: '删除状态(0未删除,1已删除)', minWidth:200, templet: function (d) {return isEmpty(d.deleted);}},
                            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
                            {field:'createrId', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.createrId);}},
                            {field:'modifyTime', title: '修改时间', minWidth:200, templet: function (d) {return isEmpty(d.modifyTime);}},
                            {field:'modifierId', title: '修改人', minWidth:200, templet: function (d) {return isEmpty(d.modifierId);}},
            
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
            vm.update(data.subSchemeId);
        } else if(layEvent === 'del'){
            var subSchemeId = [data.subSchemeId];
            vm.del(subSchemeId);
        } else if(layEvent === 'view'){
            vm.view(data.subSchemeId);
        }
    });
}

function initDate(laydate) {

}
