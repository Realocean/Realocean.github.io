$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});
var uploadContract;
var billLstBuk;
var receivables_overdue_period = 0;
var viewer;
var deliveryFileIdTmp;
var transferType = 1;
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            keyword: null
        },
        carUpdateId: 'carUpdateId_1',
        deliveryFileLstId : 'deliveryFileLstId_1',
        contractModelId: 'contractModelId_0',
        feeItemId: null,
        monthlyRentAdjust : 0,
        monthlyRent: '',
        coverCharge: '',
        order: {},
        deliveryFileLst: [],
        feeItemLst: [],
        usrLst: [],
        accessoryItems: [],
        subtips:null,
        hetong:false,
        hetong1:false,
        hetong2:false,
        hetong3:false,
        hetong5:false,
        billLst: [],
        billFeeItem: '',
        statisticsBillViewTxt: '',
        confirmationStatus: 1,
        transferType: 1,
        contract: {
            contractType: ''
        },
        contractFileLst: [],
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        var order = param.data;
        var orderCar = param.data.orderCar;
        if (isEmptyReturnNull(param.transferType) != null) {
            transferType = param.transferType;
            _this.transferType = param.transferType;
        }
        _this.order = {
            id: order.id,
            orderCarIds: null,
            plan: order.plan,
            orderCar: {
                orderId: orderCar.orderId,
                rentType: orderCar.rentType,
                paymentMethod: orderCar.paymentMethod,
                insuranceItems: orderCar.insuranceItems,
                paymentDay: orderCar.paymentDay,
                paymentDayType: orderCar.paymentDayType,
                channelId: orderCar.channelId,
                channelName: orderCar.channelName,
                timeStartRent: orderCar.timeStartRent,
                currTimeStartRent: orderCar.currTimeStartRent == null ? orderCar.timeStartRent:orderCar.currTimeStartRent,
                timeFinishRent: orderCar.timeFinishRent,
                lastFinishRentTime: orderCar.lastFinishRentTime,
                salePersonId: orderCar.salePersonId,
                salePersonName: orderCar.salePersonName,
                stage: orderCar.stage,
                tenancy: orderCar.tenancy,
                tenancyType: orderCar.tenancyType,
                orderDesc: orderCar.orderDesc,
                timeDelivery: dateFormat(orderCar.timeDelivery||new Date().getTime()),
                swopOrderCarId: orderCar.id,
                deliveryOperationId: sessionStorage.getItem("userId"),
                deliveryOperationName: sessionStorage.getItem("username"),
                status: 1,
                deliveryFileLst: _this.deliveryFileLst,
                oldOrderCarNo: orderCar.code,
            }
        };
        // if (transferType == 0) {
        //     _this.order.orderCar.transferCarTime = orderCar.lastFinishRentTime;
        // }
        _this.order.plan.id = null;
        _this.order.plan.code = null;
        _this.order.plan.orderCarId = null;
        _this.order.plan.orderCarCode = null;
        _this.order.plan.timeCreate = null;
        _this.order.plan.timeUpdate = null;
        _this.order.plan.brandId = null;
        _this.order.plan.brandName = null;
        _this.order.plan.seriesId = null;
        _this.order.plan.seriesName = null;
        _this.order.plan.modelId = null;
        _this.order.plan.modelName = null;
        _this.order.plan.balancePaymentLst = [];
        if ((orderCar.rentType === 1 || orderCar.rentType === 2) && _this.order.plan.coverCharge != null){
            _this.order.plan.monthlyRent = toMoney(Number(_this.order.plan.monthlyRent) - Number(_this.order.plan.coverCharge));
            _this.order.plan.coverCharge = toMoney(_this.order.plan.coverCharge);
        }
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
        $.get(baseURL + "sys/config/getConfVal/receivables_overdue_period", function (r) {
            receivables_overdue_period = r^0;
        });
        $.get(baseURL + "sys/dict/getInfoByType/accessoryItem", function (r) {
            _this.accessoryGroupList = r.dict;
            if (_this.accessoryGroupList != null && _this.accessoryGroupList.length > 0){
                var parent = $('#accessoryGroup');
                _this.accessoryGroupList.forEach(function (d) {
                    parent.append('<input type="checkbox" lay-filter="accessoryItems" v-model="accessoryItems" name="accessoryItems" value="'+d.value+'" lay-skin="primary" title="'+d.value+'">');
                });
            }
        });
        $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + orderCar.rentType, function (r) {
            _this.feeItemLst = r.datas;
        });
        if (_this.feeItemLst == null){
            _this.feeItemLst = [];
        }
        for(var i = 0 ;i<_this.feeItemLst.length;i++) {
            if(_this.feeItemLst[i].fieldName === 'monthly_rent') {
                _this.feeItemLst.splice(i,1);
                i= i-1;
            }
            if(_this.feeItemLst[i].fieldName === 'cover_charge') {
                _this.feeItemLst.splice(i,1);
                i= i-1;
            }
        }
        $.ajaxSettings.async = true;
        // switch (parseInt(_this.order.rentType)) {
        //     case 1://经租
        //     case 3: //展示车
        //     case 4: {//试驾车
        //         _this.feeItemLst.push({id: 1, name: '保证金', fieldName: 'cash_deposit', defaultPaymentMethod: 5, multiple: true});
        //         break;
        //     }
        //     case 2:{//以租代购
        //         _this.feeItemLst.push({id: 2, name: '整备费', fieldName: 'servicing_fee', defaultPaymentMethod: 5, multiple: true});
        //         _this.feeItemLst.push({id: 4, name: '尾款', fieldName: 'balance_payment', defaultPaymentMethod: 5, multiple: true});
        //         break;
        //     }
        //     case 5: {//融租
        //         _this.feeItemLst.push({id: 3, name: '首付款', fieldName: 'down_payment', defaultPaymentMethod: 5, multiple: true});
        //         _this.feeItemLst.push({id: 4, name: '尾款', fieldName: 'balance_payment', defaultPaymentMethod: 5, multiple: true});
        //         break;
        //     }
        //     case 6: {//直购
        //         break;
        //     }
        //     default: {
        //     }
        // }
        // _this.feeItemLst.push({id: 5, name: '定金', fieldName: 'advance_deposit', defaultPaymentMethod: 5, multiple: true});
        // _this.feeItemLst.push({id: 6, name: '其他费用', fieldName: 'other_fee', defaultPaymentMethod: 5, multiple: true});
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        editTemplateBody: function () {
            var index = layer.open({
                title: "编辑模板",
                type: 2,
                area: ['90%', '90%'],
                boxParams: {
                    templateBody:vm.contract.templateBody,
                    callback: function (body) {
                        vm.contract.templateBody = body;
                        layer.close(index);
                    }
                },
                content: tabBaseURL + "modules/contract/edittemplatebody.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        retractChange:function(data){
            if(data == 1){
                this.hetong = false
            }else if(data ==2){
                this.hetong1 = false
            }
            else if(data ==3){
                this.hetong2 = false
            }
            else if(data ==4){
                this.hetong3 = false
            }
            else if(data ==5){
                this.hetong5 = false
            }
        },
        expandChange:function(data){
            console.log(1)
            if(data == 1){
                this.$nextTick(()=>{
                    this.hetong = true
                })

            }else if(data ==2){
                this.$nextTick(()=>{
                    this.hetong1 = true
                })
            }else if(data ==3){
                this.$nextTick(()=>{
                    this.hetong2 = true
                })
            }else if(data ==4){
                this.$nextTick(()=>{
                    this.hetong3 = true
                })
            }else if(data ==5){
                this.$nextTick(()=>{
                    this.hetong5 = true
                })
            }
        },
        delDeliveryFile: function (id) {
            for(var i = 0 ;i<vm.deliveryFileLst.length;i++) {
                if(vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        selectCar: function () {
            var param = {
                brandId: '',
                seriesId: '',
                modelId: '',
            };
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectcar.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        addFeeItem: function () {
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if (vm.order.plan.balancePaymentLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-5]{1}/).test(value.paymentMethod))
                    ||(value.timePayment1st == null || value.timePayment1st == '');
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            var feeItem = vm.feeItemLst.filter(function (f) {
                return f.id == vm.feeItemId;
            })[0];
            var serializeId = 0;
            if(vm.order.plan.balancePaymentLst.length > 0){
                vm.order.plan.balancePaymentLst.forEach(function (value) {
                    if (value.serializeId > serializeId) serializeId = value.serializeId;
                })
            }
            var item = {
                serializeId:serializeId+1,
                elid: 'serializeId_'+(serializeId+1),
                typeFieldName:feeItem.fieldName,
                typeFieldDesc:feeItem.name,
                multiple:feeItem.multiple,
                money:'',
                paymentMethod:feeItem.defaultPaymentMethod,
                timePayment1st:''
            };
            vm.order.plan.balancePaymentLst.push(item);
            vm.reloadFeeItem();
        },
        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.order.plan.balancePaymentLst.length)
                },
                data: vm.order.plan.balancePaymentLst});
        },
        feeItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.order.plan.balancePaymentLst.length;i++) {
                    if(vm.order.plan.balancePaymentLst[i].serializeId === serializeId) {
                        vm.order.plan.balancePaymentLst.splice(i,1);
                        i= i-1;
                        break;
                    }
                }
                vm.reloadFeeItem();
            });
        },
        editfeeItemlistener: function (obj) {
            //
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var v;
            if (!regNumber.test(value)) {
                alert("请输入正确的金额");
                v = '';
            }else {
                if (field === 'money') {//分期金额
                    v = Number(value).toFixed(2);
                }
            }
            vm.order.plan.balancePaymentLst.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadFeeItem();
        },
        saveOrUpdate: function (event) {
            // if (vm.order.plan.balancePaymentLst.filter(function (value) {
            //     return (value.money == null || String(value.money).length < 1)
            //         ||(value.paymentMethod == null || !(/[1-5]{1}/).test(value.paymentMethod))
            //         ||(value.timePayment1st == null || value.timePayment1st == '');
            // }).length > 0){
            //     alert('有未完善费用项');
            //     return;
            // }
            if (vm.confirmationStatus != 2 && vm.billLst.length > 0) {
                alert("请核对确认账单计划后再提交订单。");
                return;
            }
            PageLoading();
            vm.order.orderCar = Object.assign({}, vm.order.orderCar, {
                brandId: vm.order.plan.brandId,
                brandName: vm.order.plan.brandName,
                seriesId: vm.order.plan.seriesId,
                seriesName: vm.order.plan.seriesName,
                modelId: vm.order.plan.modelId,
                modelName: vm.order.plan.modelName
            });
            vm.order.orderCar.accessoryItemsName = jointStr(',', vm.accessoryItems);
            if (vm.accessoryGroupList != null && vm.accessoryGroupList.length > 0){
                var code = [];
                vm.accessoryGroupList.forEach(function (ins) {
                    if ($.inArray(ins.value, vm.accessoryItems) >= 0) {
                        code.push(ins.code);
                    }
                });
                vm.order.orderCar.accessoryItems = jointStr(',', code);
            }
            vm.order.contract = vm.contract;
            vm.order.contract.fileLst = vm.contractFileLst;
            var param = JSON.parse(JSON.stringify(vm.order));
            if (vm.order.orderCar.rentType === 1 || vm.order.orderCar.rentType === 2){
                param.plan.monthlyRent = toMoney(Number(param.plan.monthlyRent) + Number(param.plan.coverCharge));
            }
            param.plan.billLst = vm.billLst;
            if (contractExclude(param.contract)){

            }else {
                param.contract = null;
            }
            var url = "order/order/delivercar";
            if (transferType == 0) {
                url = "order/order/noSettleDelivercar";
            }
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        mouseout:function (){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move:function (action) {
            var content;
            switch (action) {
                case 'billView':{
                    content = '账单计划根据以上信息动态生成';
                    break;
                }
                case 'regen':{
                    content = '点击后，账单付款计划将恢复为修改前的初始状态';
                    break;
                }
            }
            if(!vm.subtips){
                vm.openMsg('#'+action,content);
            }
        },
        openMsg:function (id,content) {
            vm.subtips = layer.tips(content, id, {tips: 1});
        },
        regenBillView:function () {
            validateAndGenerateOrderbillView();
        },
        confirmation:function () {
            if (vm.confirmationStatus == 1) {
                confirmationBillView(2);
            }
        },
        editbillItemlistener:function (obj) {
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regTxt = /(remarks)/;
            var item = vm.billLst.filter(function (item) {
                return item.serializeId === obj.data.serializeId;
            })[0];
            if (!regTxt.test(field) && !regNumber.test(value)) {
                alert("请输入正确的数字");
                item[field] = '';
            }else {
                if (field === 'receivableAmount') {//*保证金/元/台
                    item.receivableAmount = Number(value).toFixed(2);
                } else {
                    item[field] = value;
                }
            }
            confirmationBillView(1);
            reloadOrderbillView();
        },
        addBillFeeItem:function () {
            if (vm.billFeeItem == null || vm.billFeeItem == '') {
                alert('请选择费用类型');
                return;
            }
            var now = new Date();
            var overduePeriod = getReceivablesOverduePeriod()^0;
            var item = {
                "serializeId":uuid(32),
                "collectionType":10,
                "receivableAmount":0.00,
                "receivableDate":now.format("yyyy-MM-dd"),
                "receivableDateDesc":null,
                "overduePeriod":overduePeriod,
                "typeFieldName":"other_fee",
                "typeFieldDesc":"其他",
                "orderNum":7,
            }
            if (overduePeriod > 0) {
                now.setDate(now.getDate() + overduePeriod);
            }
            item.overdueDate = now.format("yyyy-MM-dd");
            vm.billLst.push(item);
            billLstBuk = JSON.parse(JSON.stringify(vm.billLst));
            confirmationBillView(1);
            reloadOrderbillView();
        },
        billItemDelectObj:function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.billLst.length;i++) {
                    if(vm.billLst[i].serializeId === serializeId) {
                        vm.billLst.splice(i,1);
                        i= i-1;
                        break;
                    }
                }
                confirmationBillView(1);
                reloadOrderbillView();
            });
        },
        regen:function (serializeId) {
            var obj = billLstBuk.filter(function (item) {
                return item.serializeId === serializeId;
            })[0];
            for (var i = 0; i < vm.billLst.length; i++) {
                if (vm.billLst[i].serializeId === serializeId) {
                    vm.billLst[i] = JSON.parse(JSON.stringify(obj));
                    break;
                }
            }
            confirmationBillView(1);
            reloadOrderbillView();
        },
        resetContract: function () {
            vm.contract = Object.assign({}, vm.contract, {
                id:null,
                code:null,
                timeStart:null,
                timeSigned:null,
                timeFinish:null,
                desc:null,
                templateId: null,
                templateName: null
            });
            uploadContract.updateFile([]);
        },
        selectorTemplate: function () {
            var index = layer.open({
                title: "选择合同模板",
                type: 2,
                area: ['80%', '80%'],
                boxParams: {
                    rentType: vm.rentType,
                    action: 'callback',
                    callback: function (id, name, body) {
                        vm.contract.templateId = id;
                        vm.contract.templateName = name;
                        vm.contract.templateBody = body;
                        vm.contractModelId = 'contractModelId_' + uuid(6);
                        layer.close(index);
                    }
                },
                content: tabBaseURL + "modules/order/selectortemplate.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        selectorContract: function () {
            var index = layer.open({
                title: "选择合同",
                type: 2,
                area: ['80%', '80%'],
                boxParams: {
                    action: 'callback',
                    callback: function (data) {
                        vm.contract = Object.assign({}, vm.contract, data);
                        uploadContract.updateFile(data.fileLst);
                        vm.contractModelId = 'contractModelId_' + uuid(6);
                        layer.close(index);
                    }
                },
                content: tabBaseURL + "modules/order/selectorcontract.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {
    Upload({
        elid: 'addDeliveryFile',
        edit: true,
        fileLst: vm.deliveryFileLst,
        param: {'path':'order-delivery'},
        fidedesc: '交车附件'
    }).initView();

    uploadContract = Upload({
        elid: 'contractFileLst',
        edit: true,
        fileLst: vm.contractFileLst,
        param: {'path':'contract'},
        fidedesc: '订单合同附件'
    });
    uploadContract.initView();
}

function initData() {
    generateOrderbillView();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_deliveryOperationId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择交车工作人员";
            }
        },
        validate_carId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择车辆";
            }
        },
        validate_monthlyRent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请输入月租金额";
            }
        },
        // validate_transferCarTime: function (value, item) { //value：表单的值、item：表单的DOM对象
        //     if (value == null || value == '') {
        //         return "请选择换车时间";
        //     }
        // },
    });
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });

    form.on('checkbox(accessoryItems)', function (data) {
        var item = data.value;
        var checked = data.elem.checked;
        if (checked){
            if ($.inArray(item, vm.accessoryItems) >= 0) {
            }else{
                vm.accessoryItems.push(item);
            }
        } else {
            if ($.inArray(item, vm.accessoryItems) >= 0) {
                for (var i = 0; i < vm.accessoryItems.length; i++) {
                    if (vm.accessoryItems[i] == item) {
                        vm.accessoryItems.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
        }
    });

    form.on('select(deliveryOperation)', function (data) {
        var usrid = data.value;
        vm.order.orderCar.deliveryOperationId = usrid;
        var obj = vm.usrLst.filter(function (obj) {
            return obj.userId == usrid;
        })[0];
        if (obj != null){
            vm.order.orderCar.deliveryOperationName = obj.username;
        }else {
            vm.order.orderCar.deliveryOperationName = '';
        }
        vm.deliveryFileLst.forEach(function (value) {
            value.operationId = usrid;
            value.operationName = vm.order.orderCar.deliveryOperationName;
        });
    });

    form.on('radio(monthlyRentAdjust)', function (data) {
        vm.monthlyRentAdjust = data.value;
    });

    form.on('select(feeItem)', function (data) {
        vm.feeItemId = data.value;
    });

    form.on('select(balancePaymentMethod)',function (data) {
        var serializeId = data.elem.attributes.sid.value;
        vm.order.plan.balancePaymentLst.forEach(function (value) {
            if (value.serializeId == serializeId) {
                value.paymentMethod = data.value;
            }
        });
    });
    form.on('select(billFeeItem)', function (data) {
        vm.billFeeItem = data.value;
    });

    form.on('radio(paymentMethod)', function (data) {
        vm.order.orderCar.paymentMethod = data.value;
        generateOrderbillView();
    });

    form.on('radio(hasFreeDays)', function (data) {
        vm.order.plan.hasFreeDays = data.value;
        generateOrderbillView();
    });

    form.on('radio(contractType)', function (data) {
        if (vm.contract.contractType != data.value){
            vm.resetContract();
        }
        vm.contract.contractType = data.value;
        vm.contractModelId = 'contractModelId_' + uuid(6);
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });

    $("#selectorTemplate").on('click', function () {
        vm.selectorTemplate();
    });

    $("#selectorContract").on('click', function () {
        vm.selectorContract();
    });

    $("#editTemplateBody").on('click', function () {
        vm.editTemplateBody();
    });

    $(document).on('blur', '.freeDays,.monthlyRent,.coverCharge', function () {
        if ($(this).val()) {
            setTimeout(function () {
                generateOrderbillView();
            }, 10);
        }
    });
}

function initTable(table, soulTable) {
    table.render({
        id: 'feeLstid',
        elem: '#feeLst',
        data: vm.order.plan.balancePaymentLst,
        cols: [[
            {field:'typeFieldDesc', title: '类型'},
            {field:'money', title: '金额/元', edit: 'text', event: 'money'},
            {field:'paymentMethod', title: '付款方式', templet: '#selectPaymentMethod'},
            {field:'timePayment1st', title: '第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
                    var txt = d.timePayment1st;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else txt = '请选择第一次付款日期';
                    return txt;
                }},
            {title: '操作', width: 120, templet: '#feeItemBarTpl', fixed: "right", align: "center"}
        ]],
        page: true,
        limits: [5, 8, 15],
        limit: 5,
        done: function (res, curr, count) {
            $('td[data-field="paymentMethod"]>div>select').each(function () {
                var serializeId = this.attributes.sid.value;
                var value = vm.order.plan.balancePaymentLst.filter(function (value) {
                    return value.serializeId == serializeId;
                })[0].paymentMethod;
                $(this).val(value);
            });
            layui.form.render('select');
            $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
        }
    });

    table.render({
        id: 'billLstid',
        elem: '#billLst',
        data: vm.billLst,
        cols: [[
            {field:'typeFieldDesc', title: '账单类型'},
            {field:'stage', title: '期数', templet: function (d) {
                    if (d.stage == null || d.stage == '') {
                        return '--';
                    } else {
                        return '第'+d.stage+'期';
                    }
                }},
            {field:'receivableAmount', title: '应还金额/元', edit: 'text', event: 'receivableAmount'},
            {field:'receivableDate', title: '应还日期', event: 'selectReceivableDate', templet: function (d) {
                    var txt = d.receivableDate;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else txt = '请选择应还日期';
                    return txt;
                }},
            {field:'overdueDate', title: '逾期期限', templet: function (d) {return isEmpty(d.overdueDate)}},
            {field:'billStartTime', title: '账单开始时间', templet: function (d) {return isEmpty(d.billStartTime)}},
            {field:'billEndTime', title: '账单结束时间', templet: function (d) {return isEmpty(d.billEndTime)}},
            {field:'remarks', edit: 'text', title: '备注', event: 'remarks'},
            {title: '操作', width: 120, templet: '#billItemBarTpl', fixed: "right", align: "center"}
        ]],
        page: true,
        limits: [5, 8, 15],
        limit: 5,
        done: function (res, curr, count) {
            layui.form.render('select');
            $('td[data-field="receivableDate"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {
    table.on('edit(feeLst)', function(obj){
        vm.editfeeItemlistener(obj);
    });

    table.on('edit(billLst)', function(obj){
        vm.editbillItemlistener(obj);
    });
}

function initTableEvent(table) {
    table.on('tool(feeLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.feeItemDelectObj(obj);
        }else if (layEvent === 'selectTimePayment1st') {
            var txt = '';
            if ((/\d+/).test(data.timePayment1st)){
                txt = isEmpty(dateFormatYMD(data.timePayment1st));
            }else {
                var now = new Date();
                txt = now.format('yyyy-MM-dd');
            }
            this.firstChild.textContent = txt;
            layui.laydate.render({
                elem: this.firstChild,
                trigger: 'click',
                closeStop: this,
                isInitValue: false,
                value: txt,
                btns: ['now', 'confirm'],
                show: true,
                done: function (value, date) {
                    data.timePayment1st = new Date(value).getTime();
                    vm.order.plan.balancePaymentLst.forEach(function (value) {
                        if (value.serializeId === data.serializeId) value.timePayment1st = data.timePayment1st;
                    });
                    obj.update(data);
                    $('td[data-field="paymentMethod"]>div>select').each(function () {
                        var serializeId = this.attributes.sid.value;
                        var value = vm.order.plan.balancePaymentLst.filter(function (value) {
                            return value.serializeId == serializeId;
                        })[0].paymentMethod;
                        $(this).val(value);
                    });
                    layui.form.render('select');
                }
            });
        }else if (layEvent === 'money') {
            tableEditMaxlength('money', 10);
            tableEditOninputNum('money');
        }
    });

    table.on('tool(billLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.billItemDelectObj(obj);
        }else if (layEvent === 'regen') {
            vm.regen(data.serializeId);
        }else if (layEvent === 'selectReceivableDate') {
            var txt = '';
            if ((/\d+/).test(data.receivableDate)){
                txt = isEmpty(dateFormatYMD(data.receivableDate));
            }else {
                var now = new Date();
                txt = now.format('yyyy-MM-dd');
            }
            this.firstChild.textContent = txt;
            layui.laydate.render({
                elem: this.firstChild,
                trigger: 'click',
                closeStop: this,
                isInitValue: false,
                value: txt,
                btns: ['now', 'confirm'],
                show: true,
                done: function (value, date) {
                    data.receivableDate = new Date(value).getTime();
                    var overduePeriod = data.overduePeriod^0;
                    var dte = new Date(value);
                    if (overduePeriod > 0) {
                        dte.setDate(dte.getDate() + overduePeriod);
                    }
                    data.overdueDate = dte.format('yyyy-MM-dd');
                    vm.billLst.forEach(function (value) {
                        if (value.serializeId === data.serializeId) {
                            value.receivableDate = data.receivableDate;
                            value.overdueDate = data.overdueDate;
                        }
                    });
                    confirmationBillView(1);
                    reloadOrderbillView();
                }
            });
        }else if (layEvent === 'receivableAmount') {
            tableEditMaxlength(layEvent, 10);
            tableEditOninputNum(layEvent);
        }else if (layEvent === 'remarks') {
            tableEditMaxlength(layEvent, 20);
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem: '#mileageNextDate',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.mileageNextDate = value;
        }
    });

    laydate.render({
        elem: '#timeDelivery',
        trigger: 'click',
        type: 'datetime',
        done: function (value) {
            vm.order.orderCar.timeDelivery = value;
        }
    });

    laydate.render({
        elem: '#transferCarTime',
        trigger: 'click',
        max: vm.order.orderCar.timeFinishRent,
        min: vm.order.orderCar.currTimeStartRent,
        done: function (value) {
            vm.order.orderCar.transferCarTime = value;
            setTimeout(function () {
                $.ajaxSettings.async = false;
                $.get(baseURL + "order/ordercaralteration/monthlyRentDebt/"+vm.order.orderCar.oldOrderCarNo+"/"+new Date(value).getTime()+"/always", function (r) {
                    console.log(r);
                    if (r.lastStage) {
                        vm.order.orderCar.stage = Math.ceil(add(r.lastStage,1));
                    }
                });
                generateOrderbillView();
                $.ajaxSettings.async = true;
            }, 10);
        }
    });

    var contracttimeStart = laydate.render({
        elem: '#contracttimeStart',
        trigger: 'click',
        done: function (value, date) {
            vm.contract.timeStart = value;
            contracttimeFinish.config.min = date;
            contracttimeFinish.config.min.month = date.month -1;
            if (vm.contract.timeSigned == null || vm.contract.timeSigned == ''){
                vm.contract.timeSigned = vm.contract.timeStart;
            }
        }
    });

    var contracttimeFinish = laydate.render({
        elem: '#contracttimeFinish',
        trigger: 'click',
        done: function (value, date) {
            vm.contract.timeFinish = value;
            contracttimeStart.config.max = date;
            contracttimeStart.config.max.month = date.month -1;
        }
    });

    laydate.render({
        elem: '#contracttimeSigned',
        trigger: 'click',
        done: function (value) {
            vm.contract.timeSigned = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function validateGenerateOrderbillView(){
    if ((vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7) && (vm.order.orderCar.paymentMethod == null || vm.order.orderCar.paymentMethod === '')) {
        return '请选择付款方式';
    }
    if (vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7) {
        if (vm.order.orderCar.tenancyType == null || vm.order.orderCar.tenancyType === '') {
            return '请选择租期类型';
        }
        if (vm.order.orderCar.tenancyType == 1) {
            if (vm.order.orderCar.timeStartRent == null || vm.order.orderCar.timeStartRent == '') {
                return '请选择租赁开始时间';
            }
            if (vm.order.orderCar.timeFinishRent == null || vm.order.orderCar.timeFinishRent == '') {
                return '请输入租赁结束时间';
            }
        }
        if (vm.order.orderCar.tenancyType == 2) {
            if (vm.order.orderCar.tenancy == null || vm.order.orderCar.tenancy == '' || vm.order.orderCar.tenancy <= 0) {
                return '请选择租赁租期';
            }
        }
    }
    switch (parseInt(vm.order.orderCar.rentType)) {
        case 3://展示车
        case 4://试驾车
        case 1:{//经租
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent == '') {
                return '请输入租金';
            }
            break;
        }
        case 2:{//以租代购
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent == '') {
                return '请输入租金';
            }
            break;
        }
        case 5:{//融租
            if (vm.order.plan.downPayment == null || vm.order.plan.downPayment == '') {
                return '请输入首付款';
            }
            if (vm.order.plan.downPaymentPeriods == null || vm.order.plan.downPaymentPeriods == '') {
                return '请输入首付款分期数';
            }
            break;
        }
        case 6:{//直购
            if (vm.order.plan.totalPrice == null || vm.order.plan.totalPrice == '') {
                return '请输入车辆总单价';
            }
            break;
        }
        case 7:{//挂靠
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent == '') {
                return '请输入挂靠费';
            }
            break;
        }
    }
    return 'success';
}

function validateAndGenerateOrderbillView(){
    var msg = validateGenerateOrderbillView();
    console.log(msg);
    if (msg === 'success') {
        generateOrderbillView();
    } else {
        alert(msg);
    }
}

function generateOrderbillView(){
    var msg = validateGenerateOrderbillView();
    console.log(msg);
    if (msg !== 'success') {
        return;
    }
    var order = JSON.parse(JSON.stringify(vm.order));
    if (order.orderCar.rentType == 1 || order.orderCar.rentType == 2) {
        order.plan.monthlyRent = toMoney(Number(order.plan.monthlyRent) + Number(order.plan.coverCharge||0));
    }
    if (order.orderCar.rentType == 5 || order.orderCar.rentType == 6) {
        order.orderCar.paymentMethod = 1;
        order.orderCar.tenancyType = 2;
        order.orderCar.tenancy = 2;
        order.plan.monthlyRent = 1;
    }
    order.orderCar.timeStartRent = order.orderCar.transferCarTime || order.orderCar.lastFinishRentTime;
    // 因为这边换车结算和换车不结算页面公用一个页面所以才这么写
    //  换车不结算业务逻辑
    if(order.orderCar.transferCarTime != undefined && order.orderCar.transferCarTime != null){
        order.orderCar.timeStartRent = moment(order.orderCar.timeStartRent).add(1, 'days').format('YYYY-MM-DD');
    }
    //  换车结算业务逻辑
    if(order.orderCar.transferCarTime == undefined || order.orderCar.transferCarTime == null){
        order.orderCar.transferCarTime = moment(order.orderCar.timeStartRent).subtract(1, 'days').format('YYYY-MM-DD');
    }
    order.plan.cashDeposit = null;
    order.plan.downPayment = null;
    order.plan.servicingFee = null;
    order.plan.balancePayment = null;
    var param = {
        order: order,
        orderCar: order.orderCar,
        orderCarPlan: order.plan,
        stage: order.orderCar.stage
    };
    PageLoading();
    $.ajax({
        type: "POST",
        url: baseURL + "order/orderbill/generateOrderbillView",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (r) {
            RemoveLoading();
            if (parseInt(r.code) === 0) {
                if (r.data && r.data.length > 0) {
                    vm.billLst.splice(0);
                    for (let i = 0; i < r.data.length; i++) {
                        r.data[i].serializeId = uuid(32);
                        vm.billLst.push(r.data[i]);
                    }
                    billLstBuk = JSON.parse(JSON.stringify(r.data));
                    confirmationBillView(1);
                    reloadOrderbillView();
                } else {
                    vm.billLst.splice(0);
                    reloadOrderbillView();
                    //alert("账单业务相关数据未填写，未生成预览账单");
                }
            } else {
                alert(r.msg);
            }
        }
    });
}

function reloadOrderbillView() {
    layui.table.reload('billLstid', {
        page: {
            curr: getCurrPage('billLstid', vm.billLst.length)
        },
        data: vm.billLst
    });
    layui.table.render();
    statisticsBillView();
}

function confirmationBillView(status){
    if (vm.billLst.length > 0) {
        //金额校验
        if (status == 2) {
            var bill = JSON.parse(JSON.stringify(vm.billLst));
            var fieldNameDesc = null;
            var fieldName = null;
            var amountTotle = 0;
            var field;
            for (var i = 0; i < bill.length; i++) {
                if (fieldNameDesc==null) {
                    fieldNameDesc = bill[i].typeFieldDesc;
                    fieldName = bill[i].typeFieldName;
                }
                if (fieldNameDesc === bill[i].typeFieldDesc) {
                    amountTotle = add(amountTotle, bill[i].receivableAmount);
                    bill.splice(i,1);
                    i--;
                } else {
                    //
                    field = toCamel(fieldName);
                    if (field !== 'monthlyRent' && field !== 'otherFee') {
                        if (Number(vm.order.plan[field]) != Number(amountTotle)) {
                            alert(fieldNameDesc+"账单与租赁方案设置不一致，请核对后再确认账单");
                            return;
                        }
                    }
                    i=-1;
                    amountTotle=0;
                    fieldNameDesc=null;
                    fieldName=null;
                }
            }
            field = toCamel(fieldName);
            if (field !== 'monthlyRent' && field !== 'otherFee') {
                if (Number(vm.order.plan[field]) != Number(amountTotle)) {
                    alert(fieldNameDesc+"账单与租赁方案设置不一致，请核对后再确认账单");
                    return;
                }
            }
        }
        vm.billLst.forEach(function (item) {
            item.status = status;
        })
    }
vm.confirmationStatus = status;
}

function getReceivablesOverduePeriod(){
    var overduePeriod = receivables_overdue_period^0;
    if (vm.order.orderCar.paymentDayType == 1) {
        // if (vm.order.orderCar.timeDelivery != null) {
        //     overduePeriod = new Date(vm.order.orderCar.timeDelivery).format("dd");
        // } else  {
        //     overduePeriod = new Date().format("dd");
        // }
    }
    if (vm.order.orderCar.paymentDayType == 2 && vm.order.orderCar.paymentDay > 0) {
        overduePeriod = vm.order.orderCar.paymentDay;
    }
    if (vm.order.repaymentMethod == 4 && vm.order.plan.gracePeriod > 0) {
        overduePeriod = vm.order.plan.gracePeriod;
    }
    return overduePeriod;
}

// function tenancyEditCallBack(){
//     if (vm.order.orderCar.tenancyType == 2) {
//         setTimeout(function () {
//             generateOrderbillView();
//         }, 10);
//     }
// }

function statisticsBillView() {
    var txt = '';
    if (vm.billLst.length < 1) {
    } else {
        var bill = JSON.parse(JSON.stringify(vm.billLst));
        var fieldNameDesc = null;
        var amountTotle = 0;
        var totle = 0;
        var stage = 0;
        for (var i = 0; i < bill.length; i++) {
            if (fieldNameDesc==null) {
                fieldNameDesc = bill[i].typeFieldDesc;
            }
            if (fieldNameDesc === bill[i].typeFieldDesc) {
                amountTotle = add(amountTotle, bill[i].receivableAmount);
                bill.splice(i,1);
                i--;
                stage++;
            } else {
                txt += (fieldNameDesc+stage+'期'+amountTotle+'元；');
                totle = add(totle,amountTotle);
                i=-1;
                stage = 0;
                amountTotle=0;
                fieldNameDesc=null;
            }
        }
        totle = add(totle,amountTotle);
        txt += (fieldNameDesc+stage+'期'+amountTotle+'元；');
        txt += ('共计账单'+vm.billLst.length+'条，合计'+totle+'元。');
    }
    vm.statisticsBillViewTxt = txt;
}
