$(function () {
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
    });
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form', 'layedit', "layer", 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            statusType: '',
            contractCode: null,
            orderCode: null,
            code: null,
            customerType: '',
            lessorId: '',
            customerName: null,
            carvinno: null,
            rentType: '',
            returnType: '',
            timeStartRent: null,
            timeStartRentstart: null,
            timeStartRentend: null,
            timeFinishRent: null,
            timeFinishRentstart: null,
            timeFinishRentend: null,
            timeCreate: null,
            timeCreatestart: null,
            timeCreateend: null,
            timeDelivery: null,
            timeDeliverystart: null,
            timeDeliveryend: null,
            timeApplySwop: null,
            timeApplySwopstart: null,
            timeApplySwopend: null,
            timeApplyReturn: null,
            timeApplyReturnstart: null,
            timeApplyReturnend: null,
            timeApplySpare: null,
            timeApplySparestart: null,
            timeApplySpareend: null,
            timeDeliveryEnable: null,
            timeDeliveryEnablestart: null,
            timeDeliveryEnableend: null,
            modelId: null,
        },
        exportTypeSelect: false,
        importTypeSelect: false,
        statusIndex: null,
        exportType: 1,
        importType: 1,
        statusLst: [],
        statusLstSub: [],
        carTreeList: [],
        deptList: [],
        orderCar:{},
        busType:null
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async= false;
        if (param != null){
            _this.statusIndex = param['statusKey'];
            if (_this.statusIndex != null && param['timeVal'] != null && param['timeVal'] != ''){
                switch (parseInt(_this.statusIndex)) {
                    case 301:{
                        _this.q.timeDeliveryEnable = param['timeVal'];
                        break;
                    }
                    case 500:{
                        _this.q.timeApplyReturn = param['timeVal'];
                        break;
                    }
                    case 300:{
                        _this.q.timeApplySwop = param['timeVal'];
                        break;
                    }
                    case 90:{
                        _this.q.timeApplySpare = param['timeVal'];
                        break;
                    }
                    default:{
                    }
                }
            }
        }

        _this.statusLst = getStatusLst(_this.q);
        _this.busType = 1;
        initializeStatusLst(_this.statusLst, _this.statusLstSub);
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList;
        });
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            _this.carTreeList = r.carTreeVoList;
        });
        $.ajaxSettings.async= true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        changeStatus: function (item, index) {
            if(vm.busType != null){
                vm.q.timeDeliveryEnable = null;
                vm.q.timeApplyReturn = null;
                vm.q.timeApplySwop = null;
                vm.q.timeApplySpare = null;
            }
            vm.statusIndex = item.key;
            vm.q.statusType = item.key;
            vm.reload();
            $('div[sname!="'+vm.statusIndex+'"]').removeClass('active');
            $('div[sname="'+vm.statusIndex+'"]').addClass('active');
            //getStatusLst(vm.q);
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
            vm.q.customerType = '';
            vm.q.lessorId = '';
            vm.q.rentType = '';
            vm.q.returnType = '';
            $('#carTreeList').val('');
        },
        view: function (data) {
            $.get(baseURL + "order/order/info/" + data.orderCarId, function (r) {
                r.order.orderCar.orderCarStatusStr = data.statusStr;
                var param = {
                    data: r.order
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/orderview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function () {
            var param = {
                data: {}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        placeOrder: function () {
            var param = {
                callback: function(orderType){
                    var approve = '';
                    switch (parseInt(orderType)) {
                        case 1://经租
                        case 3: //展示车
                        case 4: {//试驾车
                            approve = 'longRentOrderApprove';
                            break;
                        }
                        case 2:{//以租代购
                            approve = 'rentSaleOrderApprove';
                            break;
                        }
                        case 5: {//融租
                            approve = 'meltsRentOrderApprove';
                            break;
                        }
                        case 6: {//直购
                            approve = 'purchaseOrderApprove';
                            break;
                        }
                        case 7: {//
                            approve = 'affiliatedOrderApprove';
                            break;
                        }
                        default: {
                            approve = '';
                        }
                    }
                    $.get(baseURL + "mark/processnode/activitiEnable", {processKey: approve}, function (r) {
                        var param = {
                            data: {},
                            orderType: orderType
                        };
                        var url = r?'modules/order/placeorderedit.html':'modules/order/orderedit.html';
                        var index = layer.open({
                            title: "新增",
                            type: 2,
                            boxParams: param,
                            content: tabBaseURL + url,
                            end: function () {
                                layer.closeAll();
                            }
                        });
                        layer.full(index);
                    });
                }
            };
            var index = layer.open({
                title: "选择订单类型",
                type: 2,
                area: ['700px', '400px'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectordertype.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        update: function (data) {
            var rentType;
            var param;
            $.ajaxSettings.async = false;
            $.get(baseURL + "order/order/orderDetail/" + data.orderCarId, function (r) {
                param = {
                    data: r.order
                };
                rentType = r.order.orderCar.rentType;
            });
            var approve = '';
            switch (parseInt(rentType)) {
                case 1://经租
                case 3: //展示车
                case 4: {//试驾车
                    approve = 'longRentOrderApprove';
                    break;
                }
                case 2:{//以租代购
                    approve = 'rentSaleOrderApprove';
                    break;
                }
                case 5: {//融租
                    approve = 'meltsRentOrderApprove';
                    break;
                }
                case 6: {//直购
                    approve = 'purchaseOrderApprove';
                    break;
                }
                case 7: {//挂靠
                    approve = 'affiliatedOrderApprove';
                    break;
                }
                default: {
                    approve = '';
                }
            }
            $.ajaxSettings.async = true;
            $.get(baseURL + "mark/processnode/activitiEnable", {processKey: approve}, function (r) {
                var url = r?'modules/order/placeorderedit.html':'modules/order/orderedit.html';
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + url,
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            });
        },
        deliveryCar: function (data) {
            $.get(baseURL + "order/order/orderDetail/" + data.orderCarId, function (r) {
                var param = {
                    data: r.order
                };
                var index = layer.open({
                    title: "交车",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/delivercar.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        relet: function (data) {
            var param = {
                data: {}
            };
            var index = layer.open({
                title: "续租",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderrelerecordedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        closeTip: function () {
            vm.exportTypeSelect = false;
            vm.importTypeSelect = false;
            layer.closeAll();
        },

        selectedExportType: function () {
            var url = "";
            if(vm.exportType == 1){
                url = urlParamByObj(baseURL + 'order/order/export', vm.q);
            } else if(vm.exportType == 2){
                url = urlParamByObj(baseURL + 'order/order/basicsDataExport', vm.q);
            }

            $.ajaxSettings.async = false;
            PageLoading();
            window.location.href = url;
            $.ajaxSettings.async = true;
            RemoveLoading();
            vm.closeTip();
        },
        exports: function () {
            vm.exportType=1;
            layer.open({
                title: "选择导出类型",
                type: 1,
                area: ['500px', '300px'],
                content: $("#exportTypeSelect"),
                end: function () {
                    vm.exportTypeSelect = false;
                    layer.closeAll();
                }
            });
            vm.exportTypeSelect = true;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });

            vm.statusLst = getStatusLst(vm.q);
            initializeStatusLst(vm.statusLst, vm.statusLstSub);
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
                    form.find('input[name="rentType"]').val(map.rentType);
                    form.submit();
                }
                vm.closeTip();
                vm.reload();
            }, function () {
                vm.closeTip();
                vm.reload();
            });
        },
        // selectedImportType: function () {
        //     var span = $('#importFileSelect~span:not(:empty)');
        //     if (span == null || span.length == 0){
        //         alert('请选择数据文件');
        //     }
        // },
        importexl: function () {
            vm.importType=1;
            initImportUpload();
            layer.open({
                title: "数据导入",
                type: 1,
                area: ['500px', '300px'],
                content: $("#importTypeSelect"),
                end: function () {
                    vm.importTypeSelect = false;
                    layer.closeAll();
                }
            });
            vm.importTypeSelect = true;
        },
        audit: function (data) {
            if (data != null && data.buttonList != null && data.buttonList.length > 0){
                var btnData = null;
                data.buttonList.forEach(function (btn) {
                   if (btn.btnKey == 307 || btn.btnKey == 407){
                       btnData = btn;
                   }
                });
                if (btnData != null){
                    var viewTag = btnData.viewTag;
                    if ($.inArray(btnData.instanceStatus, ['2','3','4','5','1']) >= 0){
                        // if (viewTag == 'edit'){
                        //     viewTag = 'view';
                        // }
                        // if (viewTag == 'approve'){
                        //     viewTag = 'approveDetail';
                        // }
                    }
                    var param = {
                        id: btnData.businessId,
                        viewTag: viewTag,
                        isApply: btnData.viewTag == 'edit' ? false : btnData.isApply == 'true',
                        instanceId: btnData.instanceId,
                        instanceStatus: btnData.instanceStatus,
                        nodeId: btnData.nodeId,
                        approveId: btnData.nodeApproveId,
                        approveType: btnData.nodeApproveType
                    };
                    var url = '';
                    if (btnData.btnKey == 307){
                        param.instanceId = null;
                        url = 'modules/orderflow/orderflowedit.html';
                    } else if (btnData.btnKey == 407){
                        if(btnData.processKey == 'carBackApprove'){
                            url = "modules/order/applycarback.html";
                        }
                        if(btnData.processKey === 'purchaseBackApprove'){
                            url = "modules/order/applypurchaseback.html"
                        }
                        if(btnData.processKey == 'rentSaleApprove'){
                            url = "modules/order/applyrentback.html";
                        }
                        if(btnData.processKey == 'rentTransferCar'){
                            url = "modules/order/applytransfercar.html";
                        }
                        if(btnData.processKey == 'rentSaleTransferCar'){
                            url = "modules/order/applyrenttransfercar.html";
                        }
                    }
                    var index = layer.open({
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + url,
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                } else {
                    alert('订单状态有误');
                }
            } else {
                alert('订单状态有误');
            }
        },
        delect: function (data) {
            layer.confirm('确认删除该订单？', function(index){
                var param = {
                    orderId: data.orderId,
                    id: data.orderCarId
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + "order/order/orderListDelectOrder",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function(r){
                        if (parseInt(r.code) === 0) {
                            alert('操作成功', function () {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        }
    }
});

function init(layui) {
    initData();
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload, layui.layer);
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '车牌号/车架号', placeholder: '请输入车牌号/车架号', fieldName: 'carvinno'},
            {type: 'select', label: '售卖方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList},
            {type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList},
            {type: 'text', label: '客户名称', placeholder: '请输入客户名称', fieldName: 'customerName', selectFilter: true},
            {type: 'text', label: '合同编号', placeholder: '请输入合同编号', fieldName: 'contractCode', selectFilter: true},
            {type: 'text', label: '车辆主订单号', placeholder: '请输入车辆主订单号', fieldName: 'code', selectFilter: true},
            {type: 'text', label: '车辆订单号', placeholder: '请输入车辆订单号', fieldName: 'orderCode', selectFilter: true},
            {type: 'select', label: '客户类型', fieldName: 'customerType', selectMap: {1:'企业', 2:'个人',}, selectFilter: true},
            {type: 'select', label: '订单类型', fieldName: 'rentType', selectMap: {1:'经租', 2:'以租代购', 3:'展示车', 4:'试驾车', 5:'融租', 6:'直购',}, selectFilter: true},
            {type: 'select', label: '退车类别', fieldName: 'returnType', selectMap: {1:'租赁到期', 2:'违约退车', 3:'强制收车',4:'其他'}, selectFilter: true},
            {type: 'date', label: '订单发起时间', placeholder: '订单发起时间范围', fieldName: 'timeCreate', selectFilter: true},
            {type: 'date', label: '租赁开始时间', placeholder: '租赁开始时间范围', fieldName: 'timeStartRent', selectFilter: true},
            {type: 'date', label: '租赁结束时间', placeholder: '租赁结束时间范围', fieldName: 'timeFinishRent', selectFilter: true},
            {type: 'date', label: '提车时间', placeholder: '提车时间范围', fieldName: 'timeDelivery', selectFilter: true},
            {type: 'date', label: '换车申请时间', placeholder: '换车申请时间范围', fieldName: 'timeApplySwop', selectFilter: true},
            {type: 'date', label: '退车申请时间', placeholder: '退车申请时间范围', fieldName: 'timeApplyReturn', selectFilter: true},
            {type: 'date', label: '备用车申请时间', placeholder: '备用车申请时间范围', fieldName: 'timeApplySpare', selectFilter: true},
            {type: 'date', label: '可以交车时间', placeholder: '可以交车时间范围', fieldName: 'timeDeliveryEnable', selectFilter: true}
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

function initUpload(upload, layer) {
    upload.render({
        elem: '#inportslongrent',
        url: baseURL + 'order/order/inports',
        data: {
            rentType:1//融租
        },
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

    upload.render({
        elem: '#inportsrentsale',
        url: baseURL + 'order/order/inports',
        data: {
            rentType:2//租售
        },
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

function initImportUpload() {
    var uploadId = 'importFileSelect_' + uuid(16);
    var actionId = 'importFileSelectBtn_' + uuid(16);
    $('#importFileBlock').empty();
    $('#importFileBlock').append('<a class="layui-btn search-btn" id="'+uploadId+'">选择文件</a><span id="importFileName"></span>');
    $('#selectedImportBtnBlock').empty();
    $('#selectedImportBtnBlock').append('<a class="layui-btn reset-btn" @click="closeTip">取消</a>');
    $('#selectedImportBtnBlock').append('<button class="layui-btn search-btn" id="'+actionId+'">确定</button>');
    $(('#'+actionId)).on('click', function () {
        var emlSelector = ('#'+uploadId+'~span:not(:empty)');
        var span = $(emlSelector);
        if (span == null || span.length == 0){
            alert('请选择数据文件');
        }
    });
    layui.upload.render({
        elem: ('#'+uploadId),
        url: baseURL + 'order/order/inports',
        data: {
            rentType: -9
        },
        field: 'file',
        auto: false,
        bindAction: ('#'+actionId),
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        choose: function (obj) {
            obj.preview(function (index, file, result) {
                var fileName = file.name;
                $('#importFileName').html(fileName);
            });
        },
        before: function (obj) {
            this.data.rentType= vm.importType;
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
                initImportUpload();
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
            initImportUpload();
        }
    });
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}


function initData() {
    if (vm.statusIndex == null){
        vm.statusIndex = 0;
    }
    vm.q.statusType = vm.statusIndex;
    $('div[sname!="'+vm.statusIndex+'"]').removeClass('active');
    $('div[sname="'+vm.statusIndex+'"]').addClass('active');

    if (vm.statusIndex != null && vm.statusIndex != 0){
        switch (parseInt(vm.statusIndex)) {
            case 301:{
                if (vm.q.timeDeliveryEnable != null && vm.q.timeDeliveryEnable != '') {
                    initializeSearchDate('timeDeliveryEnable', vm.q.timeDeliveryEnable);
                }
                break;
            }
            case 500:{
                if (vm.q.timeApplyReturn != null && vm.q.timeApplyReturn != '') {
                    initializeSearchDate('timeApplyReturn', vm.q.timeApplyReturn);
                }
                break;
            }
            case 300:{
                if (vm.q.timeApplySwop != null && vm.q.timeApplySwop != '') {
                    initializeSearchDate('timeApplySwop', vm.q.timeApplySwop);
                }
                break;
            }
            case 90:{
                if (vm.q.timeApplySpare != null && vm.q.timeApplySpare != '') {
                    initializeSearchDate('timeApplySpare', vm.q.timeApplySpare);
                }
                break;
            }
            default:{
            }
        }
    }
}

function initChecked(form) {
    form.on('select(lessor)', function (data) {
        vm.q.lessorId = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
    form.on('select(customerType)', function (data) {
        vm.q.customerType = data.value;
    });
    form.on('select(returnType)', function (data) {
        vm.q.returnType = data.value;
    });
    form.on('radio(exportType)', function (data) {
        vm.exportType = data.value;
    });
    form.on('radio(importType)', function (data) {
        vm.importType = data.value;
    });
}

function initClick() {

}

function initTable(table, soulTable) {
    //财务管理交易流水详情查看订单跳转订单列表入参businessNo
    var businessNo = window.localStorage.getItem("businessNo");
    table.render({
        id: "gridid",
        elem: '#grid',
     // toolbar: true,
     // defaultToolbar: ['filter'],
        url: baseURL + 'order/order/queryList',
        where: {'orderCode': businessNo, 'statusType': vm.q.statusType,timeApplySwop: vm.q.timeApplySwop,
            timeApplySwopstart: vm.q.timeApplySwopstart,
            timeApplySwopend: vm.q.timeApplySwopend,
            timeApplyReturn: vm.q.timeApplyReturn,
            timeApplyReturnstart: vm.q.timeApplyReturnstart,
            timeApplyReturnend: vm.q.timeApplyReturnend,
            timeApplySpare: vm.q.timeApplySpare,
            timeApplySparestart: vm.q.timeApplySparestart,
            timeApplySpareend: vm.q.timeApplySpareend,
            timeDeliveryEnable: vm.q.timeDeliveryEnable,
            timeDeliveryEnablestart: vm.q.timeDeliveryEnablestart,
            timeDeliveryEnableend: vm.q.timeDeliveryEnableend,},
        cols: [[
            {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'carNo',fixed: "left", title: '车牌号',align:"center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.carNo);
                }
            },
            {
                field: 'vinNo', title: '车架号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.vinNo);
                }
            },
            {
                field: 'modelNames', title: '品牌/车系/车型', minWidth: 200, templet: function (d) {
                    return isEmpty(d.modelNames);
                }
            },
            {
                field: 'contractCode', title: '合同编号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.contractCode);
                }
            },
            {
                field: 'orderCarCode', title: '车辆订单编号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.orderCarCode);
                }
            },
            /*{
                field: 'orderCode', title: '车辆主订单编号', minWidth: 200, templet: function (d) {
                    return isEmpty(d.orderCode);
                }
            },*/
            {
                field: 'rentTypeStr', title: '车辆用途', minWidth: 200, templet: function (d) {
                    return isEmpty(d.rentTypeStr);
                }
            },
            {
                field: 'statusStr', title: '状态', minWidth: 200, templet: function (d) {
                    return isEmpty(d.statusStr);
                }
            },
            {
                field: 'swopDesc', title: '车辆状态说明', minWidth: 200, templet: function (d) {
                    return isEmpty(d.swopDesc);
                }
            },
            {field:'spareCarDesc', title: '备用车说明', minWidth:200, templet: function (d) {return isEmpty(d.spareCarDesc);}},
            {
                field: 'lessorName', title: '售卖方', minWidth: 200, templet: function (d) {
                    return isEmpty(d.lessorName);
                }
            },
            {
                field: 'customerName', title: '客户名称', minWidth: 200, templet: function (d) {
                    return isEmpty(d.customerName);
                }
            },
            {
                field: 'timeStartRent', title: '租赁开始日', minWidth: 200, sort: true, templet: function (d) {
                    return isEmpty(d.timeStartRent);
                }
            },
            {
                field: 'timeFinishRent', title: '租赁结束日', minWidth: 200, sort: true, templet: function (d) {
                    return isEmpty(d.timeFinishRent);
                }
            },
            {
                field: 'timeDelivery', title: '提车时间', minWidth: 200, sort: true, templet: function (d) {
                    return isEmpty(d.timeDelivery);
                }
            },
            {field:'returnTypeDesc', title: '退车类别', minWidth:200, templet: function (d) {return isEmpty(d.returnTypeDesc);}},
            {
                field: 'timeReturn', title: '实际还车时间', minWidth: 200, sort: true, templet: function (d) {
                    return isEmpty(d.timeReturn);
                }
            },
            {
                field: 'usrDays', title: '使用天数', minWidth: 200, sort: true, templet: function (d) {
                    if (d.orderStatus == 1 || d.orderCarStatus == 901) {
                        return "--";
                    } else {
                        return isEmpty(d.usrDays);
                    }
                }
            },
            /* {field:'cashDeposit', title: '保证金', minWidth:200, sort: true, templet: function (d) {return isEmpty(d.cashDeposit);}},
             {field:'downPayment', title: '首付款', minWidth:200, sort: true, templet: function (d) {return isEmpty(d.downPayment);}},
             {field:'monthlyRent', title: '租金', minWidth:200, sort: true, templet: function (d) {return isEmpty(d.monthlyRent);}},*/
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        parseData: function(res){
            if (res != null && res.data != null && res.data.length > 0){
                res.data.forEach(function (d) {
                    var btnKeys = [];
                    if (d.buttonList != null && d.buttonList.length > 0){
                        d.buttonList.forEach(function (btn) {
                            btnKeys.push(btn.btnKey);
                        });
                    }
                    d['btnKeys'] = btnKeys;
                });
            }
            return res;
        },
        done: function (res, curr, count) {
            window.localStorage.setItem("businessNo", '');
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            var field_left = $('td[data-field="0"]>div');
            if (field_left != null && field_left.length > 0){
                field_left.each(function () {
                    if ((/^\s*((<!--.*-->)|(\s*))\s*$/).test(this.innerHTML)){
                        $(this).text('--');
                    }
                })
            }
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
    table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.update(data);
        } else if (layEvent === 'view') {
            vm.view(data);
        } else if (layEvent === 'deliveryCar') {
            vm.deliveryCar(data);
        } else if (layEvent === 'audit') {
            vm.audit(data);
        } else if (layEvent === 'delect') {
            vm.delect(data);
        }
    });
}

function initDate(laydate) {

}

function getStatusLst(param) {
    console.log(JSON.parse(JSON.stringify(param)));
    var datas;
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/statusLst',
        async: false,
        data:JSON.parse(JSON.stringify(param)),
        success: function (r) {
            datas = r.statusLst;
        }
    });
    return datas;
}

function initializeStatusLst(statusLst, statusLstSub) {
    statusLstSub.splice(0);
    for(var i = 0 ;i<statusLst.length;i++) {
        if(statusLst[i].key == 101 || statusLst[i].key == 102 || statusLst[i].key == 700 || statusLst[i].key == 90 || statusLst[i].key == 800 || statusLst[i].key == 901 || statusLst[i].key == 902 || statusLst[i].key == 301) {
            statusLstSub.push(statusLst[i]);
            statusLst.splice(i,1);
            i= i-1;
        }
    }
}

//财务管理交易流水查看订单信息
function sendBusinessNo(businessNo) {
    vm.q.orderCode = businessNo;
    vm.reload();
}

function initializeSearchDate(prefix, daterange) {
    var dateSelected = daterange.split(' - ');
    var start = dateSelected[0] + ' 00:00:00';
    var end = dateSelected[1] + ' 23:59:59';
    vm.q[prefix+'start'] = start;
    vm.q[prefix+'end'] = end;
}
