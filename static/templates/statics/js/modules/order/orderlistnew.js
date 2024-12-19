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

var reg_htmlabel = /<(.*?)>/g;

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: searchMap,
        exportTypeSelect: false,
        importTypeSelect: false,
        statusIndex: null,
        exportType: 1,
        importType: 1,
        statusLst: [],
        statusLstSub: [],
        statusLstSubs: [],
        carTreeList: [],
        deptList: [],
        orderCar:{},
        busType:null,
        channelList:[],
        salePersonList:[],
        warehouseData: {
            warehouseId:null,
            warehouseName:null,
        },
        // statusLstId:'statusLstId_0',
    },
    created: function () {
        var _this = this;
        $.ajaxSettings.async= false;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            if (param.orderType) {
                _this.q.orderType = param.orderType;
            }
            if (param.contractorderCode) {
                _this.q.contractorderCode = param.contractorderCode;
            }
            if (param.carvinno) {
                _this.q.carvinno = param.carvinno;
            }
        }
        _this.busType = 1;
        initializeStatusLst(getStatusLst(_this.q), _this.statusLst, _this.statusLstSub, _this.statusLstSubs);
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList;
            for (let i = 0; i < searchCols.length; i++) {
                var col = searchCols[i];
                if (col.fieldName === 'lessorId'){
                    col.selectList = _this.deptList;
                }
            }
        });
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            _this.carTreeList = r.carTreeVoList;
            for (let i = 0; i < searchCols.length; i++) {
                var col = searchCols[i];
                if (col.fieldName === 'modelId'){
                    col.selectList = _this.carTreeList;
                }
            }
        });
        $.getJSON(baseURL + "chl/chlchannel/search/list", function (r) {
            _this.channelList = r.channelList;
            for (let i = 0; i < searchCols.length; i++) {
                var col = searchCols[i];
                if (col.fieldName === 'channelId'){
                    col.selectList = _this.channelList;
                }
            }
        });

        $.getJSON(baseURL + "sys/user/usrLst", function (r) {
            _this.salePersonList = r.usrLst;
            for (let i = 0; i < searchCols.length; i++) {
                var col = searchCols[i];
                if (col.fieldName === 'salePersonId'){
                    col.selectList = _this.salePersonList;
                }
            }
        });
        var orderCode = window.localStorage.getItem("businessNo");
        if (orderCode != null && orderCode !== '') {
            _this.q.orderCode = orderCode;
        }
        this.$nextTick(()=>{
            if (param){
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
        })

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
            vm.q.statusType = vm.statusIndex;
            $('div[sname!="'+vm.statusIndex+'"]').removeClass('active');
            $('div[sname="'+vm.statusIndex+'"]').addClass('active');
            //getStatusLst(vm.q);
            onStatusChangedSearchView(item.key);
            onStatusChangedDataUrl(item.key);
            vm.reload({field:'orderCarCode', type: null});
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
            vm.q.reletOrderStatus = '';
            vm.q.channelId = '';
            vm.q.salePersonId = '';
            $('#carTreeList').val('');
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
                                // console.log("closeAll")
                                layer.closeAll();
                            },
                        });
                        console.log('新增:',index);
                        layer.full(index);
                    });
                }
            };
            var index = layer.open({
                title: "选择订单类型",
                type: 2,
                area: ['600px', '300px'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectordertype.html",
                end: function () {
                    console.log('选择订单类型:',index);
                    layer.close(index);
                }
            });
        },
        placeOrderAlipay: function () {
            var param = {
                filter: [1,2],
                callback: function(orderType){
                    var param = {
                        data: {},
                        orderType: orderType
                    };
                    var index = layer.open({
                        title: "新增",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + 'modules/order/ordereditalipay.html',
                        end: function () {
                            layer.closeAll();
                        },
                    });
                    layer.full(index);
                }
            };
            var index = layer.open({
                title: "选择订单类型",
                type: 2,
                area: ['600px', '300px'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectordertype.html",
                end: function () {
                    console.log('选择订单类型:',index);
                    layer.close(index);
                }
            });
        },
        update: function (orderCarId) {
            var rentType;
            var param;
            $.ajaxSettings.async = false;
            $.get(baseURL + "order/order/orderDetail/" + orderCarId, function (r) {
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
                case 7: {//
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
        deliveryCar: function (orderCarId) {
            $.get(baseURL + "order/order/orderDetail/" + orderCarId, function (r) {
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
            } else if(vm.exportType == 3){
                vm.q.statusType = vm.statusIndex;
                url = urlParamByObj(baseURL + 'order/order/orderCarExport', vm.q);
            }

            $.ajaxSettings.async = false;
            PageLoading();
            window.location.href = url;
            $.ajaxSettings.async = true;
            RemoveLoading();
            vm.closeTip();
        },
        exports: function () {
            // vm.exportType=1;
            // layer.open({
            //     title: "选择导出类型",
            //     type: 1,
            //     area: ['500px', '300px'],
            //     content: $("#exportTypeSelect"),
            //     end: function () {
            //         vm.exportTypeSelect = false;
            //         layer.closeAll();
            //     }
            // });
            // vm.exportTypeSelect = true;
            $.ajaxSettings.async = false;
            PageLoading();
            window.location.href = urlParamByObj(baseURL + 'order/order/basicsDataExport', vm.q);
            $.ajaxSettings.async = true;
            RemoveLoading();
            vm.closeTip();
        },
        reload: function (obj) {
            layui.table.reload('gridid', {
                initSort: obj,
                page: {
                    curr: 1
                },
                url: dataUrl,
                where: JSON.parse(JSON.stringify(vm.q))
            });

            initializeStatusLst(getStatusLst(vm.q), vm.statusLst, vm.statusLstSub, vm.statusLstSubs);
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
        delectOrder: function (param) {
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
        },
        delect: function (orderId,status) {
            resetNULL(vm.warehouseData);
            layer.confirm('确认删除该订单？', function(index){
                var param = {
                    orderId: orderId
                };
                if (status == 200 || status == 110) {
                    var index = layer.open({
                        title: "选择车辆退回仓库",
                        type: 2,
                        area: ['80%', '80%'],
                        boxParams: {
                            emptyEnable: true
                        },
                        content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                        end: function(){
                           if (vm.warehouseData && vm.warehouseData.saved) try {
                                param = Object.assign({}, param,{
                                    depotId:vm.warehouseData.warehouseId,
                                    depotName:vm.warehouseData.warehouseName,
                                });
                                console.log(param);
                                vm.delectOrder(param);
                            } catch (e) {
                                console.log(e);
                            }
                            layer.close(index);
                        }
                    });
                } else {
                    vm.delectOrder(param);
                }
            });
        },
        tableFiledSkipOtherView: function (view) {
            var obj = view[0];
            var action = obj.className.trim();
            var id = obj.attributes['obj-id'].value.trim();
            var no = obj.attributes['obj-no'].value.trim();
            var instanceId = obj.attributes['obj-instanceId'].value.trim();
            var processKey = obj.attributes['obj-processKey'].value.trim();
            console.log(action + ',' + id + ',' + no + ',' + instanceId + ',' + processKey);
            //.carDetail,.contractDetail,.orderDetail,.customerDetail,.spareOrder
            switch (action) {
                case 'carDetail': {
                    vm.carDetailView(id, no);
                    break;
                }
                case 'contractDetail': {
                    vm.contractDetailView(id, no);
                    break;
                }
                case 'orderDetail': {
                    vm.orderDetailView(id, no, instanceId, processKey);
                    break;
                }
                case 'customerDetail': {
                    vm.customerDetailView(id, no);
                    break;
                }
                case 'spareOrder': {
                    vm.spareOrderView(id, no);
                    break;
                }
                case 'showSginUrl': {
                    vm.copySginUrl(no);
                    break;
                }
                case 'sendMsg': {
                    vm.sendMsg(id);
                    break;
                }
            }
        },
        sendMsg: function (sginId) {
            layer.confirm('确认要补发短信？', function(index){
                var param = {
                    sginId: sginId
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + 'contract/contracordernotemplate/sendMsg',
                    async: false,
                    data:JSON.parse(JSON.stringify(param)),
                    success: function (r) {
                        if (parseInt(r.code) === 0) {
                            alert('短信发送成功，请注意查收', function () {
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        copySginUrl: async function f(text) {
            try {
                const t = document.createElement('textarea')
                t.nodeValue = text
                t.value = text
                document.body.appendChild(t)
                t.select()
                document.execCommand('copy');
                document.body.removeChild(t)
                alert('签章链接已复制');
            } catch (e) {
                console.log(e)
            }
        },
        carDetailView: function (id, no) {
            var index = layer.open({
                title: "车辆详情",
                type: 2,
                content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.initEditData(id);
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        contractDetailView: function (id, no) {
            if (no.match(/^(.*?)QYHT(\d+?)$/)) {
                $.get(baseURL + "contract/contracbusiness/info/"+id, function(r){
                    var param = {
                        data:r.contracbusiness
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/contract/contracbusinessview.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            } else {
                $.get(baseURL + "contract/contracordernotemplate/info/" + id, function (r) {
                    var param = {
                        contracorderNotemplate: r.contracorderNotemplate,
                        statusStr: r.contracorderNotemplate.statusStr
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/contract/contracordernotemplateview.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }
        },
        orderDetailView: function (id, no, instanceId, processKey) {

                var param = {
                    instanceId: instanceId,
                    processKey: processKey,
                    id: id
                };
                console.log(param);
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
        },
        customerDetailView: function (id, no) {
            localStorage.setItem("id", id);
            var title = "客户信息";
            var index = layer.open({
                title: title,
                type: 2,
                content: tabBaseURL + 'modules/customer/customerdetail.html',
                shade: false,
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        spareOrderView: function (id, no) {
            $.get(baseURL + "cartransfer/sparecar/info/"+id, function(r){
                var index = layer.open({
                    title: "备用车详情",
                    type: 2,
                    content: tabBaseURL + "modules/order/sparecardetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.spareCarApply = r.spareCar;
                        iframe.vm.receivablesList = r.spareCar.receivablesList;
                        if(r.spareCar.isApply == 1){
                            iframe.vm.payDayShow = true;
                        }else{
                            iframe.vm.payDayShow = false;
                        }
                        if(r.spareCar.spareCarStatus == 2){
                            iframe.vm.returnCarBtn = true;
                        }else{
                            iframe.vm.returnCarBtn = false;
                        }
                        if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                            iframe.vm.returnCarForm = true;
                            iframe.vm.detailsSupTabContentList = [
                                '备用车基础信息',
                                '备用车信息',
                                '合同信息',
                                '其他关联单据信息',
                                '备用车退车信息'
                            ];
                        }else{
                            iframe.vm.returnCarForm = false;
                            iframe.vm.detailsSupTabContentList = [
                                '备用车基础信息',
                                '备用车信息',
                                '合同信息',
                                '其他关联单据信息'
                            ];
                        }
                        iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                        iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                        iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                        iframe.vm.reloadData();
                        iframe.vm.initOperatorLog(id);
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        selectTransferType: function (id) {
            var param = {
                callback: function(transferType){//原车辆是否结算：1是0否
                    if (transferType == 1) {
                        vm.applyRenturnOrTransferCar(id, 1);
                    } else {
                        $.get(baseURL + "order/order/orderDetail/" + id, function (r) {
                            var param = {
                                data: r.order,
                                transferType: transferType
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
                    }
                }
            };
            var index = layer.open({
                title: false,
                closeBtn: 0,
                type: 2,
                area: ['350px', '200px'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selecttransfertype.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        tableOperationView: function (view) {
            var obj = view[0];
            var action = obj.className.trim();
            var id = obj.attributes['obj-id'].value.trim();
            var no = obj.attributes['obj-no'].value.trim();
            var instanceId = obj.attributes['obj-instanceId'].value.trim();
            var processKey = obj.attributes['obj-processKey'].value.trim();
            var businessId = obj.attributes['obj-businessId'].value.trim();
            var viewTag = obj.attributes['obj-viewTag'].value.trim();
            var approveId = obj.attributes['obj-approveId'].value.trim();
            var approveType = obj.attributes['obj-approveType'].value.trim();
            var nodeId = obj.attributes['obj-nodeId'].value.trim();
            var nodeName = obj.attributes['obj-nodeName'].value.trim();
            console.log(action +','+ id +','+ no +','+ instanceId +','+ processKey +','+ businessId +','+ viewTag +','+ approveId +','+ approveType +','+ nodeId +','+ nodeName);
            switch (action) {
                case 'approveOrderDetail':{
                    vm.orderDetailView(id, no, instanceId, processKey);
                    break;
                }
                case 'orderDelect':{
                    vm.delect(id,viewTag);
                    break;
                }
                case 'orderEdit':{
                    vm.update(id);
                    break;
                }
                case 'deliveryCar':{
                    vm.deliveryCar(id);
                    break;
                }
                case 'approveOrderEdit':{
                    vm.approveOrderEdit(id, businessId, approveId, approveType, viewTag, processKey, instanceId);
                    break;
                }
                case 'approveOrderAudit':{
                    vm.approveOrderAudit(id, businessId, approveId, approveType, viewTag, processKey, nodeId, nodeName, instanceId);
                    break;
                }
                case 'approveCartransfer':{
                    vm.selectTransferType(id);
                    break;
                }
                case 'approveCarback':{
                    vm.applyRenturnOrTransferCar(id, 2);
                    break;
                }
                case 'feeRemission':{
                    vm.feeRemission(id);
                    break;
                }
                case 'transferCar':{
                    vm.transferCar(id);
                    break;
                }
                case 'useEdit':{
                    vm.useEdit(id);
                    break;
                }
                case 'chain2longrent':{
                    vm.chain2longrent(id);
                    break;
                }
                case 'chainsgin':
                case 'chaindeliverycar':
                case 'chainvalidatecar':
                case 'chainaudit':{
                    vm.update(id);
                    break;
                }
            }
        },
        chain2longrent: function (id) {
            //专租赁
            $.get(baseURL + "order/order/orderDetail/" + id, function (r) {
                var param = {
                    data: r.order
                };
                var index = layer.open({
                    title: "转租赁",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/order/chain2longrent.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        useEdit: function (id) {
            //用车中订单编辑
            var index = layer.open({
                title: "订单维护",
                type: 2,
                boxParams:{id:id},
                content: tabBaseURL + "modules/order/orderUseEdit.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];

                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        approveOrderAudit: function (orderCarId, businessId, approveId, approveType, viewTag, processKey, nodeId, nodeName, instanceId) {
            var param = '';
            var url = '';
            if($.inArray(processKey, ['longRentOrderApprove','rentSaleOrderApprove','purchaseOrderApprove','meltsRentOrderApprove','affiliatedOrderApprove']) >= 0){
                param = {
                    id: businessId,
                    viewTag: viewTag,
                    approveId: approveId,
                    approveType: approveType
                };
                url = "modules/orderflow/orderflowedit.html";
            }else{
                param = {
                    id: businessId,
                    viewTag: viewTag,
                    instanceId: instanceId,
                    nodeId: nodeId,
                    approveId: approveId,
                    approveType: approveType
                };
                if(processKey === 'carBackApprove'){
                    url = "modules/order/applycarback.html";
                }
                if(processKey === 'purchaseBackApprove'){
                    url = "modules/order/applypurchaseback.html"
                }
                if(processKey === 'rentSaleApprove'){
                    url = "modules/order/applyrentback.html";
                }
                if(processKey === 'rentTransferCar'){
                    window.localStorage.setItem("type",1);
                    url = "modules/order/applytransfercar.html";
                }
                if(processKey === 'rentSaleTransferCar'){
                    window.localStorage.setItem("type",1);
                    url = "modules/order/applyrenttransfercar.html";
                }
                if(processKey === 'spareCarApprove'){
                    url = "modules/order/sparecarflow.html";
                }
                if(processKey === 'spareCarReturnApprove'){
                    url = "modules/order/sparecarback.html";
                }
                if(processKey === 'carMoveApprove'){
                    url = "modules/car/carmove.html";
                }
            }
            $.get(baseURL + "order/order/orderDetail/" + orderCarId, function (r) {
                param.data = r.order;
                var index = layer.open({
                    title: nodeName,
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + url,
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });

        },
        approveOrderEdit: function (orderCarId, businessId, approveId, approveType, viewTag, processKey, instanceId) {
            var data = {};
            var url;
            $.ajaxSettings.async = false;
            $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
                data = r.order;
            });
            $.ajaxSettings.async = true;
            if($.inArray(processKey, ['longRentOrderApprove','rentSaleOrderApprove','purchaseOrderApprove','meltsRentOrderApprove','affiliatedOrderApprove']) >= 0){
                url = "modules/order/placeorderedit.html";
            }else{
                if(processKey === 'carBackApprove' || processKey === 'purchaseBackApprove' || processKey === 'rentSaleApprove' || processKey === 'rentTransferCar' || processKey === 'rentSaleTransferCar'){
                    viewTag = 'reedit';
                }
                if(processKey === 'carBackApprove'){
                    url = "modules/order/applycarback.html";
                }
                if(processKey === 'purchaseBackApprove'){
                    url = "modules/order/applypurchaseback.html"
                }
                if(processKey === 'rentSaleApprove'){
                    url = "modules/order/applyrentback.html";
                }
                if(processKey === 'rentTransferCar'){
                    url = "modules/order/applytransfercar.html";
                }
                if(processKey === 'rentSaleTransferCar'){
                    url = "modules/order/applyrenttransfercar.html";
                }
                if(processKey === 'spareCarApprove'){
                    url = "modules/order/sparecarflow.html";
                }
                if(processKey === 'spareCarReturnApprove'){
                    url = "modules/order/sparecarback.html";
                }
                if(processKey === 'carMoveApprove'){
                    url = "modules/car/carmove.html";
                }
            }
            var param = {
                id: businessId,
                instanceStatus: 1,
                viewTag: viewTag,
                data: data,
                approveId: approveId,
                approveType: approveType,
                instanceId: instanceId
            };
            var index = layer.open({
                title: "重新编辑",
                type: 2,
                boxParams: param,
                content: tabBaseURL + url,
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        applyRenturnOrTransferCar: function (orderCarId, type) {
            var title="申请退车";
            var processKey = '';
            var url = ''
            var data = {};
            $.ajaxSettings.async = false;
            $.get(baseURL + "order/order/detailInfo/" + orderCarId, function (r) {
                data = r.order;
            });
            $.ajaxSettings.async = true;
            if(type == 1){
                if(data.orderCar.rentType == 2 || data.orderCar.rentType == 5){
                    title="申请换车";
                    processKey = 'rentSaleTransferCar'
                    url = "modules/order/applyrenttransfercar.html";
                }else{
                    title="申请换车";
                    processKey = 'rentTransferCar'
                    url = "modules/order/applytransfercar.html";
                }
            }else{
                if(data.orderCar.rentType == 2 || data.orderCar.rentType == 5 || data.orderCar.rentType == 7){
                    processKey = 'rentSaleApprove'
                    url = "modules/order/applyrentback.html";
                }else if(data.orderCar.rentType == 6){
                    processKey = 'purchaseBackApprove'
                    url = "modules/order/applypurchaseback.html";
                }else{
                    processKey = 'carBackApprove'
                    url = "modules/order/applycarback.html";
                }
            }
            window.localStorage.setItem("code",data.orderCar.code);
            window.localStorage.setItem("type",type);
            //查看流程审批是否启动
            $.get(baseURL + "mark/processnode/activitiEnable",{processKey:processKey}, function (r) {
                if(r && data.orderCar.rentType != 8){
                    var param = {
                        viewTag: 'apply',
                        data: data
                    };
                    var index = layer.open({
                        title: title,
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + url,
                        end: function () {
                            window.localStorage.setItem("code",null);
                            window.localStorage.setItem("type",null);
                            // closePage();
                        }
                    });
                    layer.full(index);
                }else{
                    var index = layer.open({
                        title: title,
                        type: 2,
                        boxParams: {
                            processKey:processKey
                        },
                        content: tabBaseURL + "modules/order/applyFor.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.initOrderData(data);
                        },
                        end: function () {
                            window.localStorage.setItem("code",null);
                            window.localStorage.setItem("type",null);
                            // closePage();
                        }
                    });
                    layer.full(index);
                }
            });
        },
        feeRemission:function (orderCarId) {
            var param = {
                data: {orderCarId:orderCarId}
            };
            var index = layer.open({
                title: "申请费用减免",
                type: 2,
                boxParams: param,
                content: tabBaseURL + 'modules/order/feeRemission.html',
                end: function () {
                    vm.reload();
                }
            });
            layer.full(index);
        },
        transferCar: function(orderCarId){
            //申请过户
            layer.confirm('请您确认过户车辆相关金额是否已交清', {btn: ['取消','已交清']},
                function(){
                    layer.closeAll();
                },
                function(){
                    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
                        if(r.order.orderCar.isTransferCar == 0){
                            alert("订单有应收未收金额，请财务确认收款后进行过户！");
                            return false;
                        }else{
                            var index = layer.open({
                                title: "申请过户",
                                type: 2,
                                content: tabBaseURL + "modules/car/cartransferedit.html",
                                success: function(layero,num){
                                    var iframe = window['layui-layer-iframe'+num];
                                    iframe.vm.carTransfer = Object.assign({},iframe.vm.carTransfer,{
                                        orderNo:r.order.orderCar.id,
                                        orderCarNo:r.order.orderCar.code,
                                        carId:r.order.orderCar.carId,
                                        estimatedTransferTime:r.order.orderCar.transferCar == null? '':r.order.orderCar.transferCar.estimatedTransferTime,
                                        transferTime:r.order.orderCar.transferCar == null? '':r.order.orderCar.transferCar.transferTime,
                                        operatorId:r.order.orderCar.transferCar == null? '':r.order.orderCar.transferCar.operatorId,
                                        operator:r.order.orderCar.transferCar == null? '':r.order.orderCar.transferCar.operator,
                                        remarks:r.order.orderCar.transferCar == null? '':r.order.orderCar.transferCar.remarks,
                                        transferId:r.order.orderCar.transferCar == null? '':r.order.orderCar.transferCar.transferId
                                    });
                                    iframe.vm.deliveryFileLst = r.order.orderCar.transferFileLst;
                                },
                                end: function () {
                                    vm.showForm = false;
                                    layer.closeAll();
                                }
                            });
                            vm.showForm = true;
                            layer.full(index);
                        }
                    });

                });
        },
    }
});

function init(layui) {
    initSearch();
    initData();

    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload, layui.layer);
}

function initSearch() {
    searchView = Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: searchCols,
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
    });
    searchView.initView();
}

function initUpload(upload, layer) {
}initSearch

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
    onStatusChangedDataUrl(vm.statusIndex);
    onStatusChangedSearchView(vm.statusIndex);
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
    form.on('radio(exportType)', function (data) {
        vm.exportType = data.value;
    });
    form.on('radio(importType)', function (data) {
        vm.importType = data.value;
    });
}

function initClick() {
    $(document).on('click', '.carDetail,.contractDetail,.orderDetail,.customerDetail,.spareOrder,.showSginUrl,.sendMsg', function () {
        vm.tableFiledSkipOtherView($(this));
    });

    $(document).on('click', '.approveOrderDetail,.orderDelect,.orderEdit,.approveOrderEdit,.approveOrderAudit,.deliveryCar,.approveCarback,.approveCartransfer,.feeRemission,.transferCar,.useEdit,.chain2longrent,.chainsgin,.chaindeliverycar,.chainvalidatecar,.chainaudit', function () {
        vm.tableOperationView($(this));
    });
}

function initTable(table, soulTable) {
    //财务管理交易流水详情查看订单跳转订单列表入参businessNo
    var businessNo = window.localStorage.getItem("businessNo");
    vm.q.orderCode=businessNo;
    tableView = table.render({
        id: "gridid",
        elem: '#grid',
        autoSort: false,
     // toolbar: true,
     // defaultToolbar: ['filter'],
        url: dataUrl,
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [tableCols],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function (res, curr, count) {
            window.localStorage.setItem("businessNo", '');
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
            //
            // tableStyleAmendment(res.data);
            onStatusChangedTableView(vm.statusIndex);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
    initTableSort(table);
}

function initTableSort(table) {
    table.on('sort(grid)', function(obj){
        for(var key in vm.q){
            if (key.endsWith('Sort')){
                vm.q[key] = null;
            }
        }
        vm.q[obj.field+'Sort'] = obj.type;
        vm.reload(obj);

        console.log('服务端排序。order by '+ obj.field + ' ' + obj.type);
        // tableStyleAmendment();
    });
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event
         if (layEvent === 'mmvMore') {
            var mmvDropDonw = $(obj.tr[1]).find('.mmv-dropdonw');
            var wrap = mmvDropDonw.find('.mmv-dropdonw-wrap');
            var top = mmvDropDonw.offset().top;
            var left = mmvDropDonw.offset().left;
            var scroll = $(window).scrollTop();
            if ($(window).height()<top - scroll + 20+ wrap.height()){
                wrap.css('bottom', 0);
            }else{
                wrap.css('top', top - scroll + 30 + 'px');
            }
            wrap.css('left', left + 30 + 'px');
            wrap.show();
            setTimeout(()=> {
                $(window).one('click', function() {
                    wrap.hide();
                });
                $(window).one('scroll', function() {
                    wrap.hide();
                });
            },300);
        }else{}
    });
}

function initDate(laydate) {

}

function getStatusLst(param) {
    // console.log(JSON.parse(JSON.stringify(param)));
    var datas;
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/statusMap',
        async: false,
        // data:JSON.parse(JSON.stringify(param)),
        success: function (r) {
            datas = r.statusMap;
        }
    });
    // datas = statusCols;
    return datas;
}

function initializeStatusLst(statusMap, statusLst, statusLstSub, statusLstSubs) {
    statusLstSubs.splice(0);
    statusLstSub.splice(0);
    statusLst.splice(0);
    Array.prototype.push.apply(statusLst, statusCols);
    for(var i = 0 ;i<statusLst.length;i++) {
        statusLst[i].count = statusMap[statusLst[i].key];
        var key = parseInt(statusLst[i].key);
        if($.inArray(key, [710, 711, 720, 721]) >= 0) {
            statusLstSub.push(statusLst[i]);
            statusLst.splice(i,1);
            i= i-1;
        }
        if($.inArray(key, [ 400, 301, 201, 101, 102, 900, 901]) >= 0) {
            statusLstSubs.push(statusLst[i]);
            statusLst.splice(i,1);
            i= i-1;
        }
    }
    // if (vm != null && vm.statusLstId != null){
    //     vm.statusLstId = 'statusLstId_' + uuid(32);
    // }
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

function getTextWidth(str) {
    const dom = document.createElement('span');
    dom.style.display = 'inline-block';
    // dom.style.visibility = 'hidden';
    dom.style.fontSize = '12px';
    dom.textContent = str;
    document.body.appendChild(dom);
    const width = dom.clientWidth;
    // console.log(width);
    document.body.removeChild(dom);
    return width;
}

function tableStyleAmendment(data) {
    var actionTd = $('td[data-field="orderCarExplain"],td[data-field="carNo"],td[data-field="vinNo"],td[data-field="contractCode"],td[data-field="orderCarCode"],td[data-field="customerName"],td[data-field="orderCarCodeRelet"]');
    actionTd.attr('style', '');
    actionTd.each(function (index, td){
        $(td).attr('data-content', '');
        var div = $(td).find('>div');
        $(td).empty();
        $(td).append(div);
    });
    //
    var orderCarExplain = $('td[data-field="orderCarExplain"]');
    var maxWidth = 200;
    if (data != null) for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var context = d.orderCarExplain;
        if (isNotEmpty(context)){
            var context_arr = context.split('<br/>');
            for (let j = 0; j < context_arr.length; j++) {
                var txt = context_arr[j].replace(reg_htmlabel, '');
                maxWidth = Math.max(maxWidth, getTextWidth(txt));
            }
        }
    }
    var width = maxWidth === 200 ? maxWidth : (maxWidth + 70);
    $('th[data-field="orderCarExplain"]>div').width(width);
    orderCarExplain.find('>div').width(width);
    //
    var el_trbtns = 'table:has(tbody:has(tr:has(td[data-field="btns"])))';
    var data_body = $('div[class="layui-table-body layui-table-main"]>' + el_trbtns + '>tbody');
    var btns_tr = $('div[class="layui-table-fixed layui-table-fixed-l"]>div.layui-table-body>' + el_trbtns + '>tbody>tr');
    btns_tr.each(function (index, tr) {
        var data_id = $(tr).find('>td>div>span').attr('data-id');
        var height = data_body.find('>tr:has(td[data-field="btns"]:has(div:has(span[data-id="'+data_id+'"])))').height();
        $(tr).height(height);
    })
}