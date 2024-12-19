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
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'driver/driversalary/export', vm.q);
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
                    form[0].action = baseURL + 'driver/driversalary/downxlserr';
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
            {type: 'text', label: '流水编号', placeholder: '请输入流水编号', fieldName: 'code',},
            {type: 'text', label: '司机名称', placeholder: '请输入司机名称', fieldName: 'driverName',},
            {type: 'text', label: '司机电话', placeholder: '请输入司机电话', fieldName: 'driverTel',},
            {type: 'text', label: '车牌号', placeholder: '请输入车牌号', fieldName: 'carNo', selectFilter: true},
            {type: 'select', label: '发放状态', placeholder: '请选择发放状态', fieldName: 'paidStatus', selectMap: {
                    0:'未完成',
                    1:'已完成',
                }, selectFilter: true
            },
            {type: 'text', label: '平台', placeholder: '请输入平台', fieldName: 'platform', selectFilter: true},
            {type: 'date', label: '导入日期', placeholder: '选择日期范围', fieldName: 'timeCreate', selectFilter: true},
            {type: 'date', label: '合同开始日期', placeholder: '选择日期范围', fieldName: 'timeStart', selectFilter: true},
            {type: 'date', label: '合同结束日期', placeholder: '选择日期范围', fieldName: 'timeFinish', selectFilter: true},
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
        url: baseURL + 'driver/driversalary/imports',
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
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        // toolbar: true,
        // defaultToolbar: ['filter'],
        url: baseURL + 'driver/driversalary/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {field:'code', title: '流水编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
            {field:'driverName', title: '司机', minWidth:200, templet: function (d) {return isEmpty(d.driverName);}},
            {field:'driverTel', title: '电话', minWidth:200, templet: function (d) {return isEmpty(d.driverTel);}},
            {field:'carNo', title: '车牌', minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
            {field:'timeStart', title: '合同开始日期', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeStart);}},
            {field:'timeFinish', title: '合同结束日期', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeFinish);}},
            {field:'serviceFee', title: '服务费', minWidth:200, templet: function (d) {return toMoney(d.serviceFee);}},
            {field:'cashDeposit', title: '保证金', minWidth:200, templet: function (d) {return toMoney(d.cashDeposit);}},
            {field:'monthlyRent', title: '租金', minWidth:200, templet: function (d) {return toMoney(d.monthlyRent);}},
            {field:'platform', title: '平台', minWidth:200, templet: function (d) {return isEmpty(d.platform);}},
            {field:'unitPeriod', title: '结算单位', minWidth:200, templet: function (d) {return isEmpty(d.unitPeriod);}},
            {field:'settlementInterval', title: '结算周期', minWidth:200, templet: function (d) {return isEmpty(d.settlementInterval);}},
            {field:'totalFlowWater', title: '总流水', minWidth:200, templet: function (d) {return toMoney(d.totalFlowWater);}},
            {field:'totalReward', title: '总奖励', minWidth:200, templet: function (d) {return toMoney(d.totalReward);}},
            {field:'violationsFine', title: '违章罚款', minWidth:200, templet: function (d) {return toMoney(d.violationsFine);}},
            {field:'otherDeductions', title: '其他扣款', minWidth:200, templet: function (d) {return toMoney(d.otherDeductions);}},
            {field:'prepaidPayroll', title: '预支薪资', minWidth:200, templet: function (d) {return toMoney(d.prepaidPayroll);}},
            {field:'accountPayable', title: '应付薪资', minWidth:200, templet: function (d) {return toMoney(d.accountPayable);}},
            {field:'paid', title: '已付薪资', minWidth:200, templet: function (d) {return toMoney(d.paid);}},
            {field:'unpaid', title: '未付薪资', minWidth:200, templet: function (d) {return toMoney(d.unpaid);}},
            {field:'paidStatus', title: '发放状态', minWidth:200, templet: function (d) {return transformTypeByMap(d.paidStatus, { 1: '已完成', 0: '未完成' });}},
            {field:'totalOnlineDuration', title: '总在线时长', minWidth:200, templet: function (d) {return isEmpty(d.totalOnlineDuration);}},
            {field:'totalServiceDuration', title: '总服务时长', minWidth:200, templet: function (d) {return isEmpty(d.totalServiceDuration);}},
            {field:'totalUnitQuantity', title: '总完单量', minWidth:200, templet: function (d) {return isEmpty(d.totalUnitQuantity);}},
            {field:'totalDistance', title: '总里程', minWidth:200, templet: function (d) {return toMoney(d.totalDistance);}},
            {field:'timeCreate', title: '导入时间', minWidth:200, templet: function (d) {return dateFormat(d.timeCreate);}},
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
