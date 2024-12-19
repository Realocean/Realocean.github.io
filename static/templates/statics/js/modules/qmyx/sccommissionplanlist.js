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
            planName: null
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

            var commissionPlanIds = [];
            $.each(list, function(index, item) {
                commissionPlanIds.push(item.commissionPlanId);
            });
            return commissionPlanIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (commissionPlanId) {
            $.get(baseURL + "qmyx/sccommissionplan/info/"+commissionPlanId, function(r){
                var param = {
                    data:r.scCommissionPlan
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/qmyx/sccommissionplanview.html",
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
                content: tabBaseURL + "modules/qmyx/sccommissionplanedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (commissionPlanId) {
            $.get(baseURL + "qmyx/sccommissionplan/info/"+commissionPlanId, function(r){
                var param = {
                    data:r.scCommissionPlan
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/qmyx/sccommissionplanedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (commissionPlanIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "qmyx/sccommissionplan/delete",
                    data: {'commissionPlanId':commissionPlanIds},
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
            window.location.href = urlParamByObj(baseURL + 'qmyx/sccommissionplan/export', vm.q);
        },
        importSuccess: function (map) {
            var btn = [];
            var isdownxls = map.allCount != null && Number(map.allCount || 1) !== Number(map.successCount || 0);
            if (isdownxls) {
                btn.push('下载失败数据');
            }
            btn.push('关闭');
            var index = layer.confirm(map.message, {
                btn: btn
            }, function () {
                if (isdownxls) {
                    var form = $('form#downLoadXls');
                    form.find('input[name="datas"]').val(JSON.stringify(map.errDatas));
                    form[0].action = baseURL + 'qmyx/sccommissionplan/downxlserr';
                    form.submit();
                }
                layer.close(index);
                vm.reload();
            }, function () {
                layer.close(index);
                vm.reload();
            });
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
    initUpload(layui.upload);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '方案名称', placeholder: '请输入方案名称', fieldName: 'planName',},
            /*{type: 'select', label: '状态', placeholder: '请选择状态', fieldName: 'type', selectMap: {
                    0:'正常',
                    1:'禁用',
                }, selectFilter: true
            },*/
            /*{type: 'date', label: '创建时间', placeholder: '选择创建时间', fieldName: 'createTime', selectFilter: true},*/
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


function initUpload(upload) {
    upload.render({
        elem: '#inports',
        url: baseURL + 'qmyx/sccommissionplan/imports',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        before: function (obj) {
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            layer.close(layer.msg());
            if (parseInt(res.code) === 0) {
                vm.importSuccess(res);
            } else {
                layer.msg('文件解析失败:' + res.msg, {icon: 5});
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });
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
        var commissionPlanIds = vm.selectedRows();
        if(commissionPlanIds == null){
            return;
        }
        vm.del(commissionPlanIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'qmyx/sccommissionplan/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'planName', title: '方案名称', minWidth:200, templet: function (d) {return isEmpty(d.planName);}},
            {field:'planNo', title: '方案编号', minWidth:200, templet: function (d) {return isEmpty(d.planNo);}},
            {field:'primaryCommissionAmount', title: '一级分销佣金金额(元)', minWidth:200, templet: function (d) {return isEmpty(d.primaryCommissionAmount);}},
            {field:'primaryCommissionPercentage', title: '一级分销佣金百分比(%)', minWidth:200, templet: function (d) {return isEmpty(d.primaryCommissionPercentage);}},
            {field:'secondaryCommissionAmount', title: '二级分销佣金金额(元)', minWidth:200, templet: function (d) {return isEmpty(d.secondaryCommissionAmount);}},
            {field:'secondaryCommissionPercentage', title: '二级分销佣金百分比(%)', minWidth:200, templet: function (d) {return isEmpty(d.secondaryCommissionPercentage);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return dateFormatYMDHM(d.createTime);}},
            {field:'createBy', title: '创建者', minWidth:200, templet: function (d) {return isEmpty(d.createBy);}},

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
            vm.update(data.commissionPlanId);
        } else if(layEvent === 'del'){
            var commissionPlanId = data.commissionPlanId;
            vm.del(commissionPlanId);
        } else if(layEvent === 'view'){
            vm.view(data.commissionPlanId);
        }
    });
}

function initDate(laydate) {

}
