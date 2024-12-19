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
            activityName: null,
            activityStartTime: null,
            payTime: null,
            status: null,
            payStatus: null,
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
        formatStatus:function(status){
            if(status == null){
                return "--";
            }

            if(status == 1){
                return "未使用";
            }else if (status == 2){
                return "已使用";
            }else if (status == 3){
                return "已过期";
            }else if (status == 4){
                return "已取消";
            }else if (status == 5){
                return "已退款";
            }else if (status == 6){
                return "部分核销";
            }
        },
        formatPayStatus:function(status){
            if(status == null){
                return "--";
            }
            if(status == 1){
                return "未支付";
            }else if (status == 2){
                return "已支付";
            }
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var activityOrderNos = [];
            $.each(list, function(index, item) {
                activityOrderNos.push(item.activityOrderNo);
            });
            return activityOrderNos;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (activityOrderNo) {
            $.get(baseURL + "activityorder/scorderactivity/info/"+activityOrderNo, function(r){
                var param = {
                    data:r.scOrderActivity,
                    scOrderServiceInfo:r.scOrderServiceInfo
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/activityorder/scorderactivityview.html",
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
                content: tabBaseURL + "modules/activityorder/scorderactivityedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (activityOrderNo) {
            $.get(baseURL + "activityorder/scorderactivity/info/"+activityOrderNo, function(r){
                var param = {
                    data:r.scOrderActivity
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/activityorder/scorderactivityedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (activityOrderNos) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "activityorder/scorderactivity/delete",
                    contentType: "application/json",
                    data: JSON.stringify(activityOrderNos),
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
        refund: function (activityOrderNos) {
            confirm('确定要退款？', function(){
                $.ajax({
                    type: "PUT",
                    url: baseURL + "activityorder/scorderactivity/refund",
                    contentType: "application/json",
                    data: JSON.stringify(activityOrderNos),
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
            window.location.href = urlParamByObj(baseURL + 'activityorder/scorderactivity/export', vm.q);
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
                    form[0].action = baseURL + 'activityorder/scorderactivity/downxlserr';
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
            {type: 'text', label: '活动名称', placeholder: '请输入活动名称', fieldName: 'activityName',selectFilter: false},
            {type: 'dateori', label: '活动开始时间', placeholder: '请选择活动开始时间', fieldName: 'activityStartTime',selectFilter: false},

            {type: 'select', label: '使用状态', placeholder: '全部', fieldName: 'status', selectMap: {
                    1:'未使用',
                    2:'已使用',
                    3:'已过期',
                    4:'已取消',
                    5:'已退款',
                    6:'部分核销'
                }, selectFilter: false
            },

            {type: 'dateori', label: '支付时间', placeholder: '请选择支付时间', fieldName: 'payTime',selectFilter: true},
            {type: 'select', label: '订单状态', placeholder: '全部', fieldName: 'payStatus', selectMap: {
                    1:'未支付',
                    2:'已支付',
                }, selectFilter: true
            },
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
        url: baseURL + 'activityorder/scorderactivity/imports',
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
        var activityOrderNos = vm.selectedRows();
        if(activityOrderNos == null){
            return;
        }
        vm.del(activityOrderNos);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'activityorder/scorderactivity/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'activityName', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'activityOrderNo', title: '订单编号', minWidth:200, templet: function (d) {return isEmpty(d.activityOrderNo);}},
            {field:'customerName', title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'customerPhone', title: '联系电话', minWidth:200, templet: function (d) {return isEmpty(d.customerPhone);}},
            {field:'number', title: '购买数量/件', minWidth:200, templet: function (d) {return isEmpty(d.number);}},
            {field:'payStatusStr', title: '订单状态', minWidth:200, templet: function (d) {return isEmpty(d.payStatusStr)}},
            {field:'statusStr', title: '使用状态', minWidth:200, templet: function (d) {
                    return isEmpty(d.statusStr);
            }},
            {field:'amount', title: '活动支付总金额/元', minWidth:200, templet: function (d) {return isEmpty(d.amount);}},
            {field:'skTenant', title: '收款商户', minWidth:200, templet: function (d) {return isEmpty(d.skTenant);}},
            {field:'payTime', title: '支付时间', minWidth:200, templet: function (d) {return dateFormatYMDHM(d.payTime);}},
            {field:'refundTime', title: '退款时间', minWidth:200, templet: function (d) {return dateFormatYMDHM(d.refundTime);}}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100, 200],
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
            vm.update(data.activityOrderNo);
        } else if(layEvent === 'del'){
            var activityOrderNo = [data.activityOrderNo];
            vm.del(activityOrderNo);
        } else if(layEvent === 'view'){
            vm.view(data.activityOrderNo);
        }else if(layEvent === 'refund'){
            vm.refund(data.activityOrderNo);
        }
    });
}

function initDate(laydate) {

}
