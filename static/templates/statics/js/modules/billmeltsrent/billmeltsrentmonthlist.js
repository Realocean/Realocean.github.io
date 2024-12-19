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
            statusType: null,
        },
        preId:'LAY_BILLMELTSRENT_',
        isClose: true,
        statusIndex: 'receivable_amount',
        statusLst: [],
        carTreeList: [],
        channelLst: [],
        deptList: [],
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async= false;
        _this.statusLst = getStatusLst();
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            _this.carTreeList = r.carTreeVoList;
        });
        $.get(baseURL + 'customer/getChannel', function (r) {
            _this.channelLst = r.data;
        });
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList;
        });
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        changeStatus: function (item, index) {
            vm.statusIndex = item.key;
            vm.q.statusType = vm.statusIndex;
            vm.reload();
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.carnovin=null;
            vm.q.modelId=null;
            vm.q.customerName=null;
            vm.q.businessNo=null;
            vm.q.contractNo=null;
            vm.q.stage=null;
            vm.q.billNo=null;
            vm.q.channelId=null;
            vm.q.repaymentType=null;
            vm.q.customerType=null;
            vm.q.leaseId=null;
            vm.q.receivableDate=null;
        },
        collection: function (billId) {
            $.get(baseURL + "billmeltsrent/billmeltsrentmonth/info/"+billId, function(r){
                var index = layer.open({
                    title: "收款",
                    type: 2,
                    area: ['700px', '400px'],
                    boxParams: {
                        data: r.billMeltsRentmonth,
                        callback:function (d) {
                            layer.close(index);
                            vm.reload();
                        }
                    },
                    content: tabBaseURL + "modules/billmeltsrent/collection.html",
                    end: function () {
                        layer.close(index);
                    }
                });
            });
        },
        view: function (billId) {
            $.get(baseURL + "billmeltsrent/billmeltsrentmonth/info/"+billId, function(r){
                var param = {
                    data:r.billMeltsRentmonth
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/billmeltsrent/billmeltsrentmonthview.html",
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
                content: tabBaseURL + "modules/billmeltsrent/billmeltsrentmonthedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (billId) {
            $.get(baseURL + "billmeltsrent/billmeltsrentmonth/info/"+billId, function(r){
                var param = {
                    data:r.billMeltsRentmonth
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/billmeltsrent/billmeltsrentmonthedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (billIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "billmeltsrent/billmeltsrentmonth/delete",
                    contentType: "application/json",
                    data: JSON.stringify(billIds),
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
            window.location.href = urlParamByObj(baseURL + 'billmeltsrent/billmeltsrentmonth/export', vm.q);
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
                    form[0].action = baseURL + 'billmeltsrent/billmeltsrentmonth/downxlserr';
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
            vm.reloadStatusCount();
        },
        reloadStatusCount: function (event) {
            vm.statusLst = getStatusLst();
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
            {type: 'text', label: '车牌号/车架号', placeholder: '请输入车牌号/车架号', fieldName: 'carnovin'},
            {type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList},
            {type: 'text', label: '客户名称', placeholder: '请输入客户名称', fieldName: 'customerName'},
            {type: 'text', label: '订单编号', placeholder: '请输入订单编号', fieldName: 'businessNo', selectFilter: true},
            {type: 'text', label: '合同编号', placeholder: '请输入合同编号', fieldName: 'contractNo', selectFilter: true},
            {type: 'text', label: '期数', placeholder: '请输入期数', fieldName: 'stage', selectFilter: true},
            {type: 'text', label: '账单编号', placeholder: '请输入账单编号', fieldName: 'billNo', selectFilter: true},
            {type: 'select', label: '所属渠道', fieldName: 'channelId', selectListValueName: 'id', selectListTxtName: 'channelName',
                selectList: vm.channelLst, selectFilter: true},
            // {type: 'select', label: '月租付款方式', fieldName: 'paymentMethod', selectMap: {
            //         1:'月付',
            //         2:'两月付',
            //         3:'季付',
            //         6:'半年付',
            //         4:'年付',
            //         5:'一次性结清'
            //     }, selectFilter: true},
            {type: 'select', label: '还款类型', fieldName: 'repaymentType', selectMap: {1:'客户自付', 2:'公司代付'}, selectFilter: true},
            {type: 'select', label: '客户类型', fieldName: 'customerType', selectMap: {1:'企业', 2:'个人'}, selectFilter: true},
            {type: 'select', label: '出租方', fieldName: 'leaseId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList, selectFilter: true},
            {type: 'date', label: '应收时间', placeholder: '选择日期范围', fieldName: 'receivableDate', selectFilter: true},
            // {type: 'date', label: '实收时间', placeholder: '选择日期范围', fieldName: 'actualDate', selectFilter: true},
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
        url: baseURL + 'billmeltsrent/billmeltsrentmonth/imports',
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
        var billIds = vm.selectedRows();
        if(billIds == null){
            return;
        }
        vm.del(billIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        toolbar: true,
        defaultToolbar: ['filter'],
        url: baseURL + 'billmeltsrent/billmeltsrentmonth/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作',  width:100, minWidth:100, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carPlateNo', title: '车牌号', align:"center",fixed: "left",minWidth:200, templet: function (d) {return isEmpty(d.carPlateNo);}},
            {field:'stage', title: '期数', minWidth:200, templet: function (d) {return isEmpty(d.stage)+'期';}},
            {field:'customerName', title: '客户名称', minWidth:250, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'status', title: '支付状态', minWidth:200, templet: function (d) {return transformTypeByMap(d.status, {1:'待收款', 2:'已收款'});}},
            {field:'repaymentType', title: '还款类型', minWidth:200, templet: function (d) {return transformTypeByMap(d.repaymentType, {1:'客户自付', 2:'公司代付'});}},
            {field:'receivableAmount', title: '应收金额', minWidth:200, templet: function (d) {return toMoney(d.receivableAmount);}},
            {field:'receivedAmount', title: '已收金额', minWidth:200, templet: function (d) {return toMoney(d.receivedAmount);}},
            {field:'uncollectedAmount', title: '待收金额', minWidth:200, templet: function (d) {return toMoney(d.uncollectedAmount);}},
            {field:'vin', title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vin);}},
            {field:'brandName', title: '品牌/车系/车型', minWidth:300, templet: function (d) {return jointStr('/', d.brandName, d.seriesName, d.modelName);}},
            {field:'businessNo', title: '业务单号', minWidth:200, templet: function (d) {return isEmpty(d.businessNo);}},
            {field:'customerType', title: '客户类型', minWidth:200, templet: function (d) {return transformTypeByMap(d.customerType, {1:'企业', 2:'个人'});}},
            {field:'contractNo', title: '合同编号', minWidth:200, templet: function (d) {return isEmpty(d.contractNo);}},
            {field:'leaseName', title: '出租方', minWidth:250, templet: function (d) {return isEmpty(d.leaseName);}},
            {field:'channelName', title: '渠道商', minWidth:250, templet: function (d) {return isEmpty(d.channelName);}},
            {field:'billNo', title: '账单编号', minWidth:200, templet: function (d) {return isEmpty(d.billNo);}},
            // {field:'paymentMethod', title: '付款方式', minWidth:200, templet: function (d) {return transformTypeByMap(d.paymentMethod, {1:'月付', 2:'两月付', 3:'季付', 4:'年付', 5:'一次性付款'});}},
            {field:'billStartTime', title: '账单开始时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.billStartTime);}},
            {field:'billEndTime', title: '账单结束时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.billEndTime);}},
            {field:'receivableDate', title: '应收日期', minWidth:200, templet: function (d) {return dateFormatYMD(d.receivableDate);}},
            // {field:'actualDate', title: '实收时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.actualDate);}},
            {field:'remarks', title: '备注', minWidth:200, templet: function (d) {return isEmpty(d.remarks);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
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
            vm.update(data.billId);
        } else if(layEvent === 'del'){
            var billId = [data.billId];
            vm.del(billId);
        } else if(layEvent === 'view'){
            vm.view(data.billId);
        } else if(layEvent === 'collection'){
            vm.collection(data.billId);
        }
    });
}

function initDate(laydate) {

}

function getStatusLst() {
    var _statusLst;
    $.ajax({
        type: "GET",
        url: baseURL + 'billmeltsrent/billmeltsrentmonth/getStatusList',
        async: false,
        success: function(r){
            _statusLst = r.statusLst;
        }
    });
    return _statusLst;
}