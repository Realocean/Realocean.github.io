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

            var cluesIds = [];
            $.each(list, function(index, item) {
                cluesIds.push(item.cluesId);
            });
            return cluesIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (cluesId) {
            $.get(baseURL + "cluesnew/clues/info/"+cluesId, function(r){
                var param = {
                    data:r.clues
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesview.html",
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
                content: tabBaseURL + "modules/cluesnew/cluesedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (cluesId) {
            $.get(baseURL + "cluesnew/clues/info/"+cluesId, function(r){
                var param = {
                    data:r.clues
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/cluesnew/cluesedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (cluesIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "cluesnew/clues/delete",
                    contentType: "application/json",
                    data: JSON.stringify(cluesIds),
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
            window.location.href = urlParamByObj(baseURL + 'cluesnew/clues/export', vm.q);
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
        var cluesIds = vm.selectedRows();
        if(cluesIds == null){
            return;
        }
        vm.del(cluesIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'cluesnew/clues/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type:'checkbox'},
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                            {field:'cluesId', title: '', minWidth:200, templet: function (d) {return isEmpty(d.cluesId);}},
                            {field:'customerType', title: '客户类型：1个人，2企业', minWidth:200, templet: function (d) {return isEmpty(d.customerType);}},
                            {field:'customerName', title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
                            {field:'contact', title: '联系人', minWidth:200, templet: function (d) {return isEmpty(d.contact);}},
                            {field:'phone', title: '电话', minWidth:200, templet: function (d) {return isEmpty(d.phone);}},
                            {field:'occupation', title: '职业', minWidth:200, templet: function (d) {return isEmpty(d.occupation);}},
                            {field:'usualResidence', title: '常住地', minWidth:200, templet: function (d) {return isEmpty(d.usualResidence);}},
                            {field:'rentCarPurpose', title: '租车用途', minWidth:200, templet: function (d) {return isEmpty(d.rentCarPurpose);}},
                            {field:'cluesState', title: '线索状态：1、初步接触 2、潜在客户 3、持续跟进 4、忠诚客户 5、无效客户 6、成交客户', minWidth:200, templet: function (d) {return isEmpty(d.cluesState);}},
                            {field:'cluesSource', title: '线索来源；1、电话营销 2、主动来电 3、客户介绍 4、自己挖掘 5、网络搜索 6、其他途径', minWidth:200, templet: function (d) {return isEmpty(d.cluesSource);}},
                            {field:'intentionStatus', title: '意向情况：1、无意向 2、低意向 3、中意向 4、高意向 5、已成单', minWidth:200, templet: function (d) {return isEmpty(d.intentionStatus);}},
                            {field:'qqNumber', title: 'QQ号码', minWidth:200, templet: function (d) {return isEmpty(d.qqNumber);}},
                            {field:'mailBox', title: '电子邮箱', minWidth:200, templet: function (d) {return isEmpty(d.mailBox);}},
                            {field:'operatorId', title: '当前录入人id', minWidth:200, templet: function (d) {return isEmpty(d.operatorId);}},
                            {field:'operatorName', title: '当前录入人名称', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
                            {field:'followId', title: '跟进人id', minWidth:200, templet: function (d) {return isEmpty(d.followId);}},
                            {field:'followName', title: '跟进人名称', minWidth:200, templet: function (d) {return isEmpty(d.followName);}},
                            {field:'countFollow', title: '跟进次数', minWidth:200, templet: function (d) {return isEmpty(d.countFollow);}},
                            {field:'operatorDeptId', title: '当前录入部门id', minWidth:200, templet: function (d) {return isEmpty(d.operatorDeptId);}},
                            {field:'operatorDeptName', title: '当前录入人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.operatorDeptName);}},
                            {field:'followDeptId', title: '跟进人部门id', minWidth:200, templet: function (d) {return isEmpty(d.followDeptId);}},
                            {field:'followDeptName', title: '跟进人部门名称', minWidth:200, templet: function (d) {return isEmpty(d.followDeptName);}},
                            {field:'deleted', title: '0未删除，1已删除', minWidth:200, templet: function (d) {return isEmpty(d.deleted);}},
                            {field:'cluesDescribe', title: '线索描述', minWidth:200, templet: function (d) {return isEmpty(d.cluesDescribe);}},
                            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
                            {field:'updateTime', title: '修改时间', minWidth:200, templet: function (d) {return isEmpty(d.updateTime);}},
                            {field:'lastFollowTime', title: '最后跟进时间', minWidth:200, templet: function (d) {return isEmpty(d.lastFollowTime);}},
                            {field:'dealProcessor', title: '处理者/跟进人', minWidth:200, templet: function (d) {return isEmpty(d.dealProcessor);}},
                            {field:'sysUserId', title: '系统用户id/指派人ID', minWidth:200, templet: function (d) {return isEmpty(d.sysUserId);}},
                            {field:'deptId', title: '所属部门id', minWidth:200, templet: function (d) {return isEmpty(d.deptId);}},
                            {field:'supId', title: '渠道商id', minWidth:200, templet: function (d) {return isEmpty(d.supId);}},
                            {field:'orderSupId', title: '下单渠道商id', minWidth:200, templet: function (d) {return isEmpty(d.orderSupId);}},
                            {field:'cluesTypeName', title: '线索类型；默认是线索记录', minWidth:200, templet: function (d) {return isEmpty(d.cluesTypeName);}},
                            {field:'assignName', title: '指派人名称', minWidth:200, templet: function (d) {return isEmpty(d.assignName);}},
            
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
            vm.update(data.cluesId);
        } else if(layEvent === 'del'){
            var cluesId = [data.cluesId];
            vm.del(cluesId);
        } else if(layEvent === 'view'){
            vm.view(data.cluesId);
        }
    });
}

function initDate(laydate) {

}
