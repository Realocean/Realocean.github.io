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
        },
        view: function (id) {
            $.get(baseURL + "cluesnew/cluesdeal/info/"+id, function(r){
                var param = {
                    data:r.cluesDeal
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesdealview.html",
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
                content: tabBaseURL + "modules/cluesnew/cluesdealedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "cluesnew/cluesdeal/info/"+id, function(r){
                var param = {
                    data:r.cluesDeal
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesdealedit.html",
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
                    url: baseURL + "cluesnew/cluesdeal/delete",
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
            window.location.href = urlParamByObj(baseURL + 'cluesnew/cluesdeal/export', vm.q);
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
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'cluesnew/cluesdeal/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'id', title: '', minWidth:200, templet: function (d) {return isEmpty(d.id);}},
                            {field:'cluesId', title: '线索ID', minWidth:200, templet: function (d) {return isEmpty(d.cluesId);}},
                            {field:'cluesType', title: '线索类型：1、预定购车/租车 2、运力合作 3、预约试驾 4、活动咨询 5、合同加盟 6、线索记录', minWidth:200, templet: function (d) {return isEmpty(d.cluesType);}},
                            {field:'followType', title: '线索记录跟进方式：1、面谈 2、电话 3、微信 4、短信 5、邮件 6、QQ 7、其它', minWidth:200, templet: function (d) {return isEmpty(d.followType);}},
                            {field:'cluesStatus', title: '线索记录-线索状态：1、初步接触 2、潜在客户 3、持续跟进 4、忠诚客户 5、无效客户 6、成交客户', minWidth:200, templet: function (d) {return isEmpty(d.cluesStatus);}},
                            {field:'intentionStatus', title: '线索记录-意向情况：1、无意向 2、低意向 3、中意向 4、高意向 5、已成单', minWidth:200, templet: function (d) {return isEmpty(d.intentionStatus);}},
                            {field:'dealStatusResult', title: '处理状态中文标示', minWidth:200, templet: function (d) {return isEmpty(d.dealStatusResult);}},
                            {field:'dealResult', title: '处理备注/跟进内容', minWidth:200, templet: function (d) {return isEmpty(d.dealResult);}},
                            {field:'dealTime', title: '处理/跟进时间', minWidth:200, templet: function (d) {return isEmpty(d.dealTime);}},
                            {field:'dealProcessorId', title: '处理者ID', minWidth:200, templet: function (d) {return isEmpty(d.dealProcessorId);}},
                            {field:'dealProcessor', title: '处理者/跟进人', minWidth:200, templet: function (d) {return isEmpty(d.dealProcessor);}},
                            {field:'newFollowDeptId', title: '新跟进人部门id', minWidth:200, templet: function (d) {return isEmpty(d.newFollowDeptId);}},
                            {field:'newFollowDeptName', title: '新跟进人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.newFollowDeptName);}},
                            {field:'oldFollowId', title: '原跟进人id', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowId);}},
                            {field:'oldFollowName', title: '原跟进人名称', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowName);}},
                            {field:'oldFollowDeptId', title: '原跟进人部门id', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowDeptId);}},
                            {field:'oldFollowDeptName', title: '原跟进人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.oldFollowDeptName);}},
                            {field:'operatorId', title: '当前录入人id', minWidth:200, templet: function (d) {return isEmpty(d.operatorId);}},
                            {field:'operatorName', title: '当前录入人名称', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
                            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
                            {field:'timeUpdate', title: '更新时间', minWidth:200, templet: function (d) {return isEmpty(d.timeUpdate);}},
                            {field:'deleted', title: '0未删除，1已删除', minWidth:200, templet: function (d) {return isEmpty(d.deleted);}},
            
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
