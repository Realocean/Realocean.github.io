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
    layui.form.on('radio(hasBalancePayment)', function (data) {
        vm.order.plan.hasBalancePayment = data.value;
        if (data.value == 1){
            $('#balancePaymentPlan').show();
        } else {
            $('#balancePaymentPlan').hide();
        }
    });
});

var orderFileIdTmp;
var deliveryFileIdTmp;
var contractFileIdTmp;
var timeDelivery = {
    config:{
        min:{
            year: 1900,
            month: 0,
            date: 1,
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        max:{
            year: 2099,
            month: 11,
            date: 31,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    }
};
var viewer;
var viewTag = 'show';//show | edit
var instanceStatus = -1;//
var closePageTag = false;
var isInitiator = false;
var isApply = false;
var _usrId = '';
var processnode;
var currentNodeData;
var approveUser = [];
var uploadContract;
var billLstBuk;
var chlRebateBillBuk;
var receivables_overdue_period = 0;

var vm = new Vue({
    el: '#rrapp',
    data: {
        subtips:null,
        hetong:false,
        hetong1:false,
        hetong2:false,
        hetong3:false,
        hetong5:false,
        hetong6:false,
        q: {
            keyword: null
        },
        order: {

        },
        channelRebateBillList: [],
        billLst: [],
        billFeeItem: '',
        statisticsBillViewTxt: '',
        confirmationStatus: 1,
        confirmationChlRebateStatus: 1,
        insuranceGroupList: [],
        orderFileLst: [],
        deliveryFileLst: [],
        contractFileLst: [],
        transferFileLst: [],
        chlLst: [],
        salePersonList:[],
        usrLst: [],
        contractLst: [],
        insuranceItems: [],
        accessoryItems: [],
        feeItemLst: [],
        customerId: 'customerId_',
        orderMoneyDesc: '',
        orderMoneyHolder: '',
        verify: false,
        selectDayUpdated: false,
        orderFileLstId: 'orderFileLstId_0',
        deliveryFileLstId: 'deliveryFileLstId_0',
        contractFileLstId: 'contractFileLstId_0',
        transferFileLstId: 'transferFileLstId_0',
        carUpdateId: 'carUpdateId_0',
        tenancyCalcType: 1,
        detailsTabContentList: [
            '业务信息',
            '操作记录',
        ],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        processNode: {
            nodeField:[],
            nodeOther:[]
        },
        nodeFields: {},
        bpmChartDtoList: [],
        recallNodeName: '',
        dataSuccess: false,
        boxShow: false,
        boxInputShow: true,
        boxTitle: '',
        boxMark: '',
        boxHolder: '',
        fileLst2:[],
        fileLstId2: '0',
        boxTxt: '',
        contractModelId: 'contractModelId_0',
        feeItemId: '',
        daikouMsgId : '',
        customField: {},
        lessor_title:'出租方',
        leasee_title:'承租方',
        daikouFlag:sessionStorage.getItem("daikouFlag")^0,
        overdueFineConf:{},
        dialogVisible:false
    },
    computed: {
        isInitiatorShow: {
            get:function() {
                return this.activeUserId === this.order.operationId;
            }
        }
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        viewTag = param.viewTag;
        if (param.isApply != null){
            isApply = param.isApply;
        }
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/config/getConfVal/receivables_overdue_period", function (r) {
            receivables_overdue_period = r^0;
        });
        $.get(baseURL + "order/order/approveOrderDetail/" + param.id, function (r) {
            if (r.code == 0){
                _this.order = r.order;
                if (r.order.customField != null && r.order.customField != '') {
                    _this.customField = JSON.parse(r.order.customField);
                }
            }
        });
        var approve = '';
        switch (parseInt(_this.order.orderCar.rentType)) {
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
                _this.lessor_title = '售卖方';
                _this.leasee_title = '购买方';
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
        _this.order.processKey = approve;
        $.get(baseURL + "mark/processnode/getProcessInit?processKey="+approve+"&instanceId=" + _this.order.instanceId, function (r) {
            if (r.code == 0 && (processnode = r.data) != null){
                processnode['approveId'] = param.approveId;
                processnode['approveType'] = param.approveType;
                console.log(JSON.stringify(processnode));
                if (processnode['currentNodeData'] != null && processnode['currentNodeData'] != ''){
                    currentNodeData = processnode['currentNodeData'];
                    if (processnode['currentNodeData']['nodeBigValue'] != null && processnode['currentNodeData']['nodeBigValue'] != ''){
                        _this.processNode['nodeField'] = JSON.parse(processnode['currentNodeData']['nodeBigValue']);
                    }
                    if (processnode['currentNodeData']['nodeOtherValue'] != null && processnode['currentNodeData']['nodeOtherValue'] != ''){
                        _this.processNode['nodeOther'] = JSON.parse(processnode['currentNodeData']['nodeOtherValue']);
                    }
                    if (processnode['currentNodeData']['recallNodeName'] != null && processnode['currentNodeData']['recallNodeName'] != ''){
                        _this.recallNodeName = processnode['currentNodeData']['recallNodeName'];
                    }
                }
                if (processnode['instanceStatus'] != null && processnode['instanceStatus'] != ''){
                    instanceStatus = Number(processnode['instanceStatus']);
                }
                if (processnode['bpmChartDtoList'] != null && processnode['bpmChartDtoList'] != ''){
                    _this.bpmChartDtoList = processnode['bpmChartDtoList'];
                }
                if (processnode['approveUserDto'] != null && processnode['approveUserDto'] != ''){
                    var approveUserDto = processnode['approveUserDto'];
                    if (approveUserDto.approveUserId != null && approveUserDto.approveUserId != ''){
                        approveUser = approveUserDto.approveUserId.split(',');
                    }
                }
            }
        });
        _usrId = sessionStorage.getItem("userId");
        isInitiator = _usrId === _this.order.operationId;
        // _this.nodeFields = initializeShowLv(_this.processNode.nodeField);
        // _this.nodeFields = Object.assign({}, _this.nodeFields, initializeShowLv(_this.processNode.nodeField));
        initializeShowLv(_this.nodeFields, _this.processNode.nodeField);
        // console.log(JSON.stringify(_this.processNode.nodeField));
        console.log(JSON.stringify(_this.nodeFields));
        $.get(baseURL + "sys/dict/getInfoByType/vehicleInsurance", function (r) {
            _this.insuranceGroupList = r.dict;
            if (_this.insuranceGroupList != null && _this.insuranceGroupList.length > 0){
                var parent = $('#insuranceGroup');
                var disable = _this.nodeFields.billLading_orderCar_insuranceItems && _this.nodeFields.billLading_orderCar_insuranceItems.edit ? '' : 'disabled';
                _this.insuranceGroupList.forEach(function (d) {
                    parent.append('<input type="checkbox" lay-filter="insuranceItems" v-model="insuranceItems" name="insuranceItems" value="'+d.value+'" lay-skin="primary" title="'+d.value+'" '+disable+'>');
                });
            }
        });
        $.get(baseURL + "sys/dict/getInfoByType/accessoryItem", function (r) {
            _this.accessoryGroupList = r.dict;
            if (_this.accessoryGroupList != null && _this.accessoryGroupList.length > 0){
                var parent = $('#accessoryGroup');
                var disable = _this.nodeFields.vehicleBusiness_orderCar_accessoryItems && _this.nodeFields.vehicleBusiness_orderCar_accessoryItems.edit ? '' : 'disabled';
                _this.accessoryGroupList.forEach(function (d) {
                    parent.append('<input type="checkbox" lay-filter="accessoryItems" v-model="accessoryItems" name="accessoryItems" value="'+d.value+'" lay-skin="primary" title="'+d.value+'" '+disable+'>');
                });
            }
        });
        _this.dataSuccess = true;
        closePageTag = param.instanceStatus != null && param.instanceStatus == 1;
        if (closePageTag){
            instanceStatus = param.instanceStatus;
        }
        if (param.nodeCopy != null && param.nodeCopy != '' && param.nodeCopy.isRead == 2){
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processcopy/update",
                contentType: "application/json",
                data: JSON.stringify({id:param.nodeCopy.id,isRead:1}),
                success: function(r){
                }
            });
        }
        $.get(baseURL + "sys/config/getparam/tenancy_calc_type", function (r) {
            if (r.config != null){
                _this.tenancyCalcType = parseInt(r.config['paramValue']);
            } else {
                _this.tenancyCalcType = 1;
            }
        });
        $.get(baseURL + "chl/chlchannel/chlLst", function (r) {
            _this.chlLst = r.chlLst;
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
            _this.salePersonList = r.usrLst;
        });
        $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + _this.order.orderCar.rentType, function (r) {
            _this.feeItemLst = r.datas;
        });
        $.get(baseURL + "order/ordercar/getOverdueFineConf", function (r) {
            _this.overdueFineConf = r.conf;
        });
        if (_this.order.hasBank == null){
            _this.order.hasBank = false;
        }
        if (_this.order.repaymentMethod == null){
            _this.order.repaymentMethod = 2;
        }
        if (_this.order.lessorId == null){
            _this.order.lessorId = '';
        }
        if (_this.order.customerId == null){
            _this.order.customerId = '';
        }
        if (_this.order.orderCar == null){
            _this.order.orderCar = {};
        }
        if (_this.order.orderCar.id){
            $.get(baseURL + "order/orderbill/orderbillView/"+_this.order.orderCar.id, function (r) {
                if (r.data && r.data.length > 0) {
                    _this.billLst.splice(0);
                    for (let i = 0; i < r.data.length; i++) {
                        r.data[i].serializeId = uuid(32);
                        _this.billLst.push(r.data[i]);
                    }
                    billLstBuk = JSON.parse(JSON.stringify(r.data));
                }
            });

            $.get(baseURL + "order/orderbill/orderbillPaymentView/"+_this.order.orderCar.id, function (r) {
                if (r.data && r.data.length > 0) {
                    _this.channelRebateBillList.splice(0);
                    for (let i = 0; i < r.data.length; i++) {
                        r.data[i].serializeId = uuid(32);
                        _this.channelRebateBillList.push(r.data[i]);
                    }
                    chlRebateBillBuk = JSON.parse(JSON.stringify(r.data));
                }
            });
        }
        if (_this.order.orderCar.deliveryFileLst != null){
            _this.deliveryFileLst = _this.order.orderCar.deliveryFileLst;
        }
        if (_this.order.orderCar.orderFileLst != null){
            _this.orderFileLst = _this.order.orderCar.orderFileLst;
        }
        if (_this.order.contract == null){
            _this.order.contract = {};
        }
        if (_this.order.contract.contractType == null){
            _this.order.contract.contractType = 1;
        }
        if (_this.order.repaymentMethod == 4){
            _this.order.contract.contractType = 2;
            $('input[title="直接选择/填写合同信息"]').prop('disabled',true);
        }
        if (_this.order.contract.fileLst != null){
            _this.contractFileLst = _this.order.contract.fileLst;
        }
        if (_this.order.orderCar.transferFileLst != null){
            _this.transferFileLst = _this.order.orderCar.transferFileLst;
        }
        if (_this.order.plan == null){
            _this.order.plan = {};
        }else {
            if ((_this.order.orderCar.rentType == 1 || _this.order.orderCar.rentType == 2) && _this.order.plan.monthlyRent != null) {
                _this.order.plan.monthlyRent = toMoney(Number(_this.order.plan.monthlyRent) - Number(_this.order.plan.coverCharge||0));
            }
        }
        if (_this.order.plan.rentGenerationMethod == null || _this.order.plan.rentGenerationMethod == ''){
            _this.order.plan.rentGenerationMethod = 1;
        }
        if (_this.order.plan.hasFreeDays == null || _this.order.plan.hasFreeDays == ''){
            _this.order.plan.hasFreeDays = 0;
        }
        if (_this.order.plan.repaymentMethods == null || _this.order.plan.repaymentMethods == ''){
            _this.order.plan.repaymentMethods = _this.order.orderCar.rentType == 2?1:0;
        }
        if (_this.order.plan.hasBalancePayment == null || _this.order.plan.hasBalancePayment == ''){
            _this.order.plan.hasBalancePayment = 1;
        }
        if (_this.order.plan.balancePaymentLst == null){
            _this.order.plan.balancePaymentLst = [];
        }
        if (_this.order.plan.feeLst == null){
            _this.order.plan.feeLst = [];
        }
        if (_this.order.orderCar.paymentDayType == null || _this.order.orderCar.paymentDayType == ''){
            _this.order.orderCar.paymentDayType = 1;
        }
        if (_this.order.orderCar.paymentDayType == 1){
            _this.order.orderCar.paymentDay = '';
        }
        if (_this.order.orderCar.channelId == null){
            _this.order.orderCar.channelId = '';
        }
        if (_this.order.orderCar.salePersonId == null){
            _this.order.orderCar.salePersonId = sessionStorage.getItem("userId");
            _this.order.orderCar.salePersonName = sessionStorage.getItem("username");
        }
        if (_this.order.orderCar.deliveryOperationId == null){
            _this.order.orderCar.deliveryOperationId = sessionStorage.getItem("userId");
            _this.order.orderCar.deliveryOperationName = sessionStorage.getItem("username");
        }
        if (_this.order.orderCar.accessoryItemsName != null && _this.order.orderCar.accessoryItemsName !== ''){
            _this.accessoryItems = _this.order.orderCar.accessoryItemsName.split(',');
        }
        if (_this.order.orderCar.insuranceItems != null && _this.order.orderCar.insuranceItems !== ''){
            _this.insuranceItems = _this.order.orderCar.insuranceItems.split(',');
        }
        // if (_this.order.orderCar.rentType != null && _this.order.orderCar.rentType !== ''){
        //     $.get(baseURL + "contract/contracordernotemplate/contractLst/"+_this.order.orderCar.rentType, function (r) {
        //         _this.contractLst = r.contractLst;
        //     });
        // }
        if (_this.order.orderCar.timeStartRent != null && _this.order.orderCar.timeStartRent !== ''){
            _this.order.orderCar.timeStartRent = dateFormatYMD(_this.order.orderCar.timeStartRent);
        }
        if (_this.order.orderCar.timeFinishRent != null && _this.order.orderCar.timeFinishRent !== ''){
            _this.order.orderCar.timeFinishRent = dateFormatYMD(_this.order.orderCar.timeFinishRent);
        }
        if (_this.order.orderCar.timeDelivery != null && _this.order.orderCar.timeDelivery !== ''){
            _this.order.orderCar.timeDelivery = dateFormat(_this.order.orderCar.timeDelivery);
        }
        if (_this.order.orderCar.mileageNextDate != null && _this.order.orderCar.mileageNextDate !== ''){
            _this.order.orderCar.mileageNextDate = dateFormatYMD(_this.order.orderCar.mileageNextDate);
        }
        if (_this.order.orderCar.timeTransferEstimated != null && _this.order.orderCar.timeTransferEstimated !== ''){
            _this.order.orderCar.timeTransferEstimated = dateFormatYMD(_this.order.orderCar.timeTransferEstimated);
        }
        if (_this.order.orderCar.timeRepayment != null && _this.order.orderCar.timeRepayment !== ''){
            _this.order.orderCar.timeRepayment = dateFormatYMD(_this.order.orderCar.timeRepayment);
        }
        if (_this.order.customField == null){
            _this.customField = {};
        }
        if (_this.order.orderCar.rentType == 5) {
            _this.order.plan.paymentMethod = 1;
            _this.order.orderCar.paymentMethod = 1;
        }
        _this.order.orderCar.depotCityName = jointStr('/', _this.order.orderCar.depotName, _this.order.orderCar.cityName);
        _this.order.orderCar.brandSeriesName = jointStr('/', _this.order.orderCar.brandName, _this.order.orderCar.seriesName);
        flowFieldPolishing(_this.nodeFields);
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
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
            else if(data ==6){
                this.hetong6 = false
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
            }else if(data ==6){
                this.$nextTick(()=>{
                    this.hetong6 = true
                })
            }
        },
        detailsTabContentBindtap(index) {
            vm.detailsTabContentListActiveIndex = index;
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        delOrderFile: function (id) {
            for(var i = 0 ;i<vm.orderFileLst.length;i++) {
                if(vm.orderFileLst[i].id === id) {
                    vm.orderFileLst.splice(i,1);
                    i= i-1;
                }
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
        delContractFile: function (id) {
            for(var i = 0 ;i<vm.contractFileLst.length;i++) {
                if(vm.contractFileLst[i].id === id) {
                    vm.contractFileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        editcarlistener: function (obj) {// 编辑车辆
            //
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regInt = /^[0-9]*$/;
            var regTxt = /(financeCompanyName)/;
            if ((!regTxt.test(field) && !regNumber.test(value))||((field === 'freeDays' || field.endsWith('Periods')) && !regInt.test(value))) {
                alert("请输入正确的数字");
                vm.order.plan[field] = '';
            }else {
                if (field === 'cashDeposit') {//*保证金/元/台
                    vm.order.plan.cashDeposit = Number(value).toFixed(2);
                } else if (field === 'monthlyRent') {//*租金/元/台
                    vm.order.plan.monthlyRent = Number(value).toFixed(2);
                } else if (field === 'coverCharge') {//服务费
                    vm.order.plan.coverCharge = Number(value).toFixed(2);
                } else if (field === 'chlRebate') {//渠道返利
                    vm.order.plan.chlRebate = Number(value).toFixed(2);
                } else if (field === 'freeDays') {//免费用车时间/天数/台
                    vm.order.plan.freeDays = parseInt(value);
                } else if (field === 'downPayment') {//*首付款/元/台
                    vm.order.plan.downPayment = Number(value).toFixed(2);
                } else if (field === 'servicingFee') {//整备费/元/台
                    vm.order.plan.servicingFee = Number(value).toFixed(2);
                } else if (field === 'totalPrice') {//总单价/元/台
                    vm.order.plan.totalPrice = Number(value).toFixed(2);
                } else if (field === 'balancePayment') {//总单价/元/台
                    vm.order.plan.balancePayment = Number(value).toFixed(2);
                } else {
                    vm.order.plan[field] = value;
                }
                if (field === 'balancePayment'
                    || field === 'totalPrice'
                    || field === 'downPayment'
                    || field === 'coverCharge'
                    || field === 'monthlyRent'
                    || field === 'servicingFee'
                    || field === 'cashDeposit'
                    || field.endsWith('Periods')
                ) {
                    generateOrderbillView();
                }
                if (field === 'chlRebate' || field === 'chlRebatePeriods') {
                    generateChlRebatebillView();
                }
            }
            vm.reloadPlan();
        },
        reloadPlan: function () {
            if ($('div[lay-id="carLstid"]').length > 0){
                layui.table.reload('carLstid', {data: [vm.order.plan]});
            }
        },
        selectCar: function () {
            if (vm.order.plan.modelId == null || vm.order.plan.modelId === ''){
                alert('请先添加方案');
                return;
            }
            var param = {
                orderCarId: vm.order.orderCar.id,
                brandId: vm.order.plan.brandId,
                seriesId: vm.order.plan.seriesId,
                modelId: vm.order.plan.modelId
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
        resetCar: function () {
            vm.order.orderCar = Object.assign({}, vm.order.orderCar, {
                carId:null,
                carNo:null,
                vinNo:null,
                deptId:null,
                deptName:null,
                depotId:null,
                depotName:null,
                cityId:null,
                cityName:null,
                mileage:null,
                brandSeriesName:null,
                modelName:null,
                accessoryItems:null
            });
            vm.accessoryItems = [];
        },
        resetContract: function () {
            vm.order.contract = Object.assign({}, vm.order.contract, {
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
        getContractLst: function (rentType) {
            // $.get(baseURL + "contract/contracordernotemplate/contractLst/"+rentType, function (r) {
            //     vm.contractLst = r.contractLst;
            // });
        },
        alertSelectRentType: function () {
            if (!(vm.order.orderCar.rentType != null && vm.order.orderCar.rentType !== '')) {
                alert('请先选择租赁类型');
            }
        },
        showCustomer: function (customerId) {
            window.localStorage.setItem("id",customerId);
            var index = layer.open({
                title: "客户详情",
                type: 2,
                content: tabBaseURL + "modules/customer/customerdetail.html",
                end: function () {
                    window.localStorage.setItem("id",null);
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        delTransferFile: function (id) {
            for(var i = 0; i < vm.transferFileLst.length; i++) {
                if(vm.transferFileLst[i].id === id) {
                    vm.transferFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        approve: function () {//审核通过
            this.dialogVisible = true

            console.log(this.dialogVisible)

            //校验
            vm.order.customField = JSON.stringify(vm.customField);
            for (var key in vm.nodeFields) {
                var field = vm.nodeFields[key];
                if (field.edit && field.required && field.verify != null && field.verify != ''){
                    var orderTmp = vm.order;
                    var value;
                    if (field.fieldInfo === 'insuranceItems') {
                        if (vm.insuranceItems != null && vm.insuranceItems.length > 0) {
                            value = 'a';
                        }
                    } else if (field.fieldInfo === 'contractFile' && vm.order.contract.contractType == 1) {
                        if (vm.contractFileLst != null && vm.contractFileLst.length > 0) {
                            value = 'a';
                        }
                    } else if (field.fieldInfo === 'deliveryFile') {
                        if (vm.deliveryFileLst != null && vm.deliveryFileLst.length > 0) {
                            value = 'a';
                        }
                    } else if (field.fieldInfo === 'orderFile') {
                        if (vm.orderFileLst != null && vm.orderFileLst.length > 0) {
                            value = 'a';
                        }
                    } else if (field.fieldInfo === 'transferFileLst') {
                        if (vm.transferFileLst != null && vm.transferFileLst.length > 0) {
                            value = 'a';
                        }
                    } else if (field.fieldInfo === 'hasBalancePayment') {
                        // if (vm.order.plan.balancePaymentLst != null && vm.order.plan.balancePaymentLst.length > 0) {
                        //     value = 'a';
                        // }else if (vm.order.plan.balancePaymentLst.filter(function (value) {
                        //     return (value.money == null || String(value.money).length < 1)
                        //         ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                        //         ||(value.timePayment1st == null || value.timePayment1st == '');
                        // }).length > 0){
                        //     field.fieldHint = '有未完善尾款方案';
                        //     value = '';
                        // }

                    } else if (field.fieldInfo === 'channel') {
                        if (vm.order.orderCar.channelId == null || vm.order.orderCar.channelId === '') {
                            value = '';
                        }
                    } else if (field.fieldInfo === 'paymentDay') {
                        if (vm.order.orderCar.paymentDayType == 2) {
                            value = orderTmp[field.classLevel][field.fieldInfo];
                        }
                    } else if (field.fieldInfo === 'feeItemLst') {
                        // if (vm.order.plan.feeLst == null
                        //     || vm.order.plan.feeLst.length < 1
                        //     || vm.order.plan.feeLst.filter(function (value) {
                        //         return (value.money == null || String(value.money).length < 1)
                        //             ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                        //             ||(value.timePayment1st == null || value.timePayment1st == '');
                        //     }).length > 0) {
                        //     value = '';
                        // } else {
                        //     value = 'a';
                        // }
                    } else if (field.fieldInfo === 'repaymentMethod') {
                        if (vm.order.repaymentMethod == null || vm.order.repaymentMethod == '') {
                            value = '';
                        }
                    } else if (field.classLevel === 'order'){
                        value = orderTmp[field.fieldInfo];
                    } else if (field.classLevel === 'customField'){
                        value = vm.customField[field.fieldInfo];
                    } else if (field.classLevel === 'transfer'){
                        if (field.fieldInfo === 'operator') {
                            if (vm.order.orderCar.operatorId == null || vm.order.orderCar.operatorId === '') {
                                value = '';
                            }
                        }else value = orderTmp.orderCar[field.fieldInfo];
                    } else if (field.fieldInfo === 'selectCarModel'){
                        value = orderTmp.orderCar.modelId;
                    } else if (field.fieldInfo === '"salePerson"'){
                        value = orderTmp.orderCar.salePersonId;
                    } else {
                        value = orderTmp[field.classLevel][field.fieldInfo];
                    }
                    if (value == null || value.toString() == '') {
                        if(vm.order.orderCar.rentType != 5&&vm.order.plan.downPaymentPeriods!=0){
                            alert(field.fieldHint);
                            return;
                        }
                    }
                }
            }
            if (vm.nodeFields.billLading_plan_billView && vm.nodeFields.billLading_plan_billView.edit) {
                if(vm.order.orderCar.rentType != 5&&vm.order.plan.downPaymentPeriods!=0){
                    if (vm.confirmationStatus != 2) {
                        alert("请核对确认账单计划后再提交订单。");
                        return;
                    }
                }
            }
            if (vm.nodeFields.billLading_plan_chlRebate && vm.nodeFields.billLading_plan_chlRebate.edit) {
                if (vm.confirmationChlRebateStatus != 2 && vm.channelRebateBillList.length > 0) {
                    alert("请核对确认渠道返利账单计划后再提交订单。");
                    return;
                }
            }
            //
            vm.boxTitle = '审核通过';
            vm.boxMark = '审核反馈';
          //vm.boxHolder = '可以输入审核意见/必填';
            vm.boxHolder = '可以输入审核意见/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                /*if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }*/
                if (vm.nodeFields.billLading_plan_hasFreeDays && vm.nodeFields.billLading_plan_hasFreeDays.edit && vm.nodeFields.billLading_plan_hasFreeDays.verify) {
                    // vm.order.plan.hasFreeDays = $('td[data-field="hasFreeDays"]>div>select option:selected').val();
                    if (vm.order.plan.hasFreeDays == null || vm.order.plan.hasFreeDays == ''){
                        vm.order.plan.hasFreeDays = 0;
                    }
                }
                vm.order.orderCar.orderFileLst = vm.orderFileLst;
                vm.order.orderCar.deliveryFileLst = vm.deliveryFileLst;
                vm.order.contract.fileLst = vm.contractFileLst;
                if (vm.order.orderCar.rentType == 5) {
                    vm.order.plan.paymentMethod = 1;
                    vm.order.orderCar.paymentMethod = 1;
                }
                return vm.requestAction('approveOrder');
            });
        },
        recall: function () {//撤回
            vm.boxTitle = '撤回确认';
            vm.boxMark = '确定要撤回申请单？撤回成功之后，将无法恢复';
            vm.boxHolder = '撤回原因/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                return vm.requestAction('recallOrder');
            });
        },
        delect: function () {//删除
            vm.boxTitle = '提示';
            vm.boxMark = '确定要删除？\n删除成功之后，将无法恢复';
            vm.boxHolder = '撤回原因/选填';
            vm.boxInputShow = false;
            vm.showBox(function () {
                return vm.requestAction('delectOrder');
            });
        },
        reedit: function () {//重新编辑
            var param = {
                id: vm.order.id,
                instanceStatus: 1,
                viewTag: 'edit',
                data: vm.order,
                approveId: processnode['approveId'],
                approveType: processnode['approveType']
            };
            var url = '';
            if((isApply || isInitiator) && currentNodeData.nodeType == 1){
                url = "modules/order/placeorderedit.html";
            }else {
                url = "modules/orderflow/orderflowedit.html";
            }
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
        reject: function () {//审核驳回
            vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('rejectOrder');
            });
        },
        refuse: function () {//审核拒绝
            vm.boxTitle = '审核拒绝';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('refuseOrder');
            });
        },
        showBox: function (submit) {
            vm.boxTxt = '';
            var index = layer.open({
                title: vm.boxTitle,
                type: 1,
                area: ['90%', '95%'],
                btn:['取消','确定'] ,
                content: $("#boxShow"),
                btnAlign: 'c',
                end: function(){
                    vm.boxShow = false;
                    vm.fileLst2=[];
                    layer.close(index);
                },
                btn1:function (index, layero) {
                    vm.boxShow = false;
                    vm.fileLst2=[];
                    layer.close(index);
                },
                btn2:function (index, layero) {
                    return submit();
                }
            });
            vm.boxShow = true;
        },
        requestAction: function (action) {
            /*if ((vm.order.orderCar.rentType == 2 || vm.order.orderCar.rentType == 5) && vm.order.plan.hasBalancePayment == 1){
                if (vm.order.plan.balancePaymentLst == null || vm.order.plan.balancePaymentLst.length < 1){
                    alert('请至少添加一条尾款方案，或者选择无尾款');
                    return;
                }
                if (vm.order.plan.balancePaymentLst.filter(function (value) {
                    return (value.money == null || String(value.money).length < 1)
                        ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                        ||(value.timePayment1st == null || value.timePayment1st == '');
                }).length > 0){
                    alert('有未完善尾款方案');
                    return;
                }
            }*/

            PageLoading();
            var closeBox = false;
            vm.order.auditMark = vm.boxTxt;
            vm.order.approveFileList=vm.fileLst2;
            vm.order.processnode = processnode;
            vm.order.customField = JSON.stringify(vm.customField);
            vm.order.orderCar.insuranceItems = jointStr(',', vm.insuranceItems);
            if (vm.insuranceGroupList != null && vm.insuranceGroupList.length > 0){
                var code = [];
                vm.insuranceGroupList.forEach(function (ins) {
                    if ($.inArray(ins.value, vm.insuranceItems) >= 0) {
                        code.push(ins.code);
                    }
                });
                vm.order.orderCar.insuranceItemsCode = jointStr(',', code);
            }
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

            var parm = JSON.parse(JSON.stringify(vm.order));
            if (contractExclude(parm.contract)){

            }else {
                parm.contract = null;
            }
            if (parm.orderCar.rentType == 1 || parm.orderCar.rentType == 2) {
                parm.plan.monthlyRent = toMoney(Number(parm.plan.monthlyRent) + Number(parm.plan.coverCharge||0));
            }
            if (parm.orderCar.timeDelivery){
                parm.orderCar.timeDelivery = (new Date(parm.orderCar.timeDelivery.replace(/-/g, "/"))).getTime();
            }
            if (parm.plan.overdueFineConf == 1) {
                parm.plan.gracePeriod = vm.overdueFineConf.graceDays;
                parm.plan.overdueFineRatio = vm.overdueFineConf.lateRatio;
            }
            if (parm.repaymentMethod == 4){
                parm.plan.automaticBillingSequence = parm.plan.automaticBillingSequence|1;
            }
            if (parm.repaymentMethod == 3){
                parm.plan.automaticBillingSequence = parm.plan.automaticBillingSequence|2;
            }
            if (vm.nodeFields.billLading_plan_billView.show) {
                parm.plan.billLst = vm.billLst;
            }
            if (vm.nodeFields.billLading_plan_chlRebate.show) {
                parm.plan.channelRebateBillList = vm.channelRebateBillList;
            }
            parm.orderCar.paymentMethod^=0;
            $.ajaxSettings.async = false;
            $.ajax({
                type: "POST",
                url: baseURL + "/order/order/" + action,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(parm),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closeBox = true;
                            layer.closeAll();
                            closePage();
                        });
                    } else {
                        closeBox = false;
                        alert(r.msg);
                    }
                }
            });
            $.ajaxSettings.async = true;
            return closeBox;
        },
        getFileData:function (data){
            let param={
                data:data
            }
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL +"modules/common/approvefileview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        delFile2: function (id) {
            for(var i = 0 ;i<vm.fileLst2.length;i++) {
                if(vm.fileLst2[i].id === id) {
                    vm.fileLst2.splice(i,1);
                    i= i-1;
                }
            }
        },
        viewReceived: function () {//应收列表
            var param = {
                id: vm.order.orderCar.code,
            };
            var index = layer.open({
                title: "应收列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        viewInsurance: function () {//保险列表
            if (vm.order.orderCar.vinNo == null || vm.order.orderCar.vinNo == ''){
                alert('该订单无关联车辆');
                return false;
            }
            var param = {
                vinNo: vm.order.orderCar.vinNo,
            };
            var index = layer.open({
                title: "保险列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/maintenance/insurancemanage.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        editDoc: function () {
            var param = {
                title:vm.order.contract.templateName,
                url:vm.order.contract.urlDoc,
                type:'edit_ordercontrac',
                tag:vm.order.contract.id,
            };
            var index = layer.open({
                title: "编辑合同",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/docedit/editdoc.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        viewDoc: function () {
            var param = {
                title:vm.order.contract.templateName,
                url:vm.order.contract.urlDoc
            };
            var index = layer.open({
                title: "查看合同",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/docedit/viewdoc.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        downloadDoc: function () {
            vm.downDoc(vm.order.contract.code+'.pdf', encodeURI(vm.order.contract.urlPdf));
        },
        printDoc: function () {
            printJS({printable: vm.order.contract.base64, type: 'pdf', base64: true});
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
        addBalancePaymentPlan: function () {
            if (vm.order.plan.balancePaymentLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.timePayment1st == null || value.timePayment1st == '');
            }).length > 0){
                alert('有未完善方案，请先完善后再添加');
                return;
            }
            var serializeId = 0;
            if(vm.order.plan.balancePaymentLst.length > 0){
                vm.order.plan.balancePaymentLst.forEach(function (value) {
                    if (value.serializeId > serializeId) serializeId = value.serializeId;
                })
            }
            var item = {
                serializeId:serializeId+1,
                elid: 'serializeId_'+(serializeId+1),
                typeFieldName:'balance_payment',
                typeFieldDesc:'尾款',
                money:'',
                paymentMethod:5,
                timePayment1st:''
            };
            vm.order.plan.balancePaymentLst.push(item);
            vm.reloadBalancePaymentPlan();
        },
        reloadBalancePaymentPlan: function () {
            layui.table.reload('balancePaymentLstid', {
                page: {
                    curr: getCurrPage('balancePaymentLstid', vm.order.plan.balancePaymentLst.length)
                },
                data: vm.order.plan.balancePaymentLst});
        },
        balancePaymentPlanDelectObj: function (obj) {
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
                vm.reloadBalancePaymentPlan();
            });
        },
        editbalancePaymentlistener: function (obj) {
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
            vm.reloadBalancePaymentPlan();
        },
        selectorTemplate: function () {
            var param = {
                rentType: vm.order.orderCar.rentType
            };
            var index = layer.open({
                title: "选择合同模板",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectortemplate.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        selectorContract: function () {
            var param = {};
            var index = layer.open({
                title: "选择合同",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/order/selectorcontract.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        editTemplateBody: function () {
            var _index = layer.open({
                title: "编辑模板",
                type: 2,
                area: ['90%', '90%'],
                boxParams: {
                    templateBody:vm.order.contract.templateBody,
                    callback: function (body) {
                        vm.order.contract.templateBody = body;
                        if (vm.order.contract.contractType == 2 && vm.order.contract.urlHtm != null && vm.order.contract.urlHtm != ''){
                            layer.confirm('是否要立即生成合同？', function(index) {
                                var map = {
                                    orderCarId: vm.order.orderCar.id,
                                    body: body
                                };
                                PageLoading();
                                $.ajax({
                                    type: "POST",
                                    url: baseURL + 'order/order/regenerateDocByBody',
                                    contentType: "application/json",
                                    data: JSON.stringify(map),
                                    async: false,
                                    success: function(r){
                                        RemoveLoading();
                                        if(r.code === 0){
                                            Vue.set(vm.order.contract, "code", r.contract.code);
                                            Vue.set(vm.order.contract, "urlDoc", r.contract.urlDoc);
                                            Vue.set(vm.order.contract, "urlPdf", r.contract.urlPdf);
                                            Vue.set(vm.order.contract, "urlHtm", r.contract.urlHtm);
                                            Vue.set(vm.order.contract, "urlImgs", r.contract.urlImgs);
                                            Vue.set(vm.order.contract, "base64", r.contract.base64);
                                            Vue.set(vm.order.contract, "body", r.contract.body);
                                            alert('操作成功', function () {
                                                layer.close(index);
                                                layer.close(_index);
                                            });
                                        }else{
                                            alert(r.msg);
                                        }
                                    }
                                });
                            });
                        }
                        layer.close(_index);
                    }
                },
                content: tabBaseURL + "modules/contract/edittemplatebody.html",
                end: function () {
                    layer.close(_index);
                }
            });
        },
        addFeeItem: function () {
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if (vm.order.plan.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if (vm.feeItemId == 'monthly_rent' && vm.order.plan.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0) {
                alert('月租只能添加一条');
                return;
            }
            var feeItem = vm.feeItemLst.filter(function (f) {
                return f.fieldName == vm.feeItemId;
            })[0];
            // var oldFeePlan = vm.selectCar.planList.filter(function (f) {
            //     return f.typeFieldName == vm.feeItemId;
            // })[0];
            // if (oldFeePlan == null )oldFeePlan = {};
            var serializeId = 0;
            if(vm.order.plan.feeLst.length > 0){
                vm.order.plan.feeLst.forEach(function (value) {
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
                // money:oldFeePlan.money,
                paymentMethod:feeItem.defaultPaymentMethod,
                timePayment1st:''
                // timePayment1st:oldFeePlan.timePayment1st
            };
            vm.order.plan.feeLst.push(item);
            vm.reloadFeeItem();
        },
        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.order.plan.feeLst.length)
                },
                data: vm.order.plan.feeLst});
        },
        feeItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.order.plan.feeLst.length;i++) {
                    if(vm.order.plan.feeLst[i].serializeId === serializeId) {
                        vm.order.plan.feeLst.splice(i,1);
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
            vm.order.plan.feeLst.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadFeeItem();
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
                case 'paymentDayType':{
                    content = '逾期期限按全局配置计算';
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
            if (vm.billLst.length < 1) {
                alert("账单数据为空");
                return;
            }
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
        regenChlRebate:function (serializeId) {
            var txt = generateChlRebatebillView();
            if (txt) {
                alert(txt);
            }
        },
        confirmationChlRebate:function () {
            if (vm.channelRebateBillList.length < 1) {
                alert("账单数据为空");
                return;
            }
            if (vm.confirmationChlRebateStatus == 1) {
                confirmationChlRebateBillView(2);
            }
        },
        chlRebateBillItemlistener:function (obj) {
            var field = obj.field;
            var value = obj.value;
            var regNumber = /^[0-9]+\.?[0-9]*$/;
            var regTxt = /(remarks)/;
            var item = vm.channelRebateBillList.filter(function (item) {
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
            confirmationChlRebateBillView(1);
            reloadChlRebatebillView();
        },
    }
});

function init(layui) {
    // initializeShowLv();
    initTable(vm.order.orderCar.rentType, layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initBpmChart();
    initData();
}

function initBpmChart() {
    BpmChart({instanceId: vm.order.instanceId}).initView();
}

function initUpload(upload) {
    Upload({
        elid: 'addOrderFile',
        edit: vm.nodeFields.billLading_orderCar_orderFile.edit,
        fileLst: vm.orderFileLst,
        param: {'path':'order-order'},
        fidedesc: '订单附件'
    }).initView();

    Upload({
        elid: 'addDeliveryFile',
        edit: vm.nodeFields.payCarBusiness_orderCar_deliveryFile.edit,
        fileLst: vm.deliveryFileLst,
        param: {'path':'order-delivery'},
        fidedesc: '交车附件'
    }).initView();

    Upload({
        elid: 'addTransferFile',
        edit: vm.nodeFields.carTransfer_transfer_transferFileLst.edit,
        fileLst: vm.transferFileLst,
        param: {'path':'order-transfer'},
        fidedesc: '过户附件'
    }).initView();

    uploadContract = Upload({
        elid: 'contractFileLst',
        edit: vm.nodeFields.contractBusiness_contract_contractFile.edit,
        fileLst: vm.contractFileLst,
        param: {'path':'contract'},
        fidedesc: '订单合同附件'
    });
    uploadContract.initView();

    upload.render({
        elem: '#addFile2',
        url: baseURL + 'file/uploadFile',
        data: {'path':'processApprove'},
        field:'files',
        auto:true,
        size: 50*1024*1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
        exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar', //
        choose: function(obj){
            // PageLoading();
            obj.preview(function(index, file, result){
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                var ext = fileName.slice(extIndex);
                var fileNameNotext = fileName.slice(0, extIndex);
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1:0;
                fileIdTmp = vm.fileLst2.length + '_' + uuid(60);
                var fileTmp={
                    id: fileIdTmp,
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc:'审批附件',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.fileLst2.push(fileTmp);
            });
        },
        done: function (res) {
            // RemoveLoading();
            if (res.code == '0') {
                vm.fileLst2.forEach(function (value) {
                    if (value.id === fileIdTmp) value.url = res.data[0];
                });
                vm.fileLstId2 = 'fileLstId_' + uuid(6);
            } else {
                layer.msg('上传失败', {icon: 5});
                vm.delFile2(fileIdTmp);
            }
            fileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delFile2(fileIdTmp);
            fileIdTmp = null;
        }
    });
}

function initData() {
    vm.order.orderCar.depotCityName = jointStr('/', vm.order.orderCar.depotName, vm.order.orderCar.cityName);
    vm.order.orderCar.brandSeriesName = jointStr('/', vm.order.orderCar.brandName, vm.order.orderCar.seriesName);

    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[0];

    if (vm.order.orderCar.timeStartRent != null && vm.order.orderCar.timeStartRent !== ''){
        var tmp = vm.order.orderCar.timeStartRent.split('-');
        var startdate = {
            year: parseInt(tmp[0]),
            month: parseInt(tmp[1]),
            date: parseInt(tmp[2]),
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        timeDelivery.config.value = vm.order.orderCar.timeStartRent;
        timeDelivery.config.min = startdate;
        timeDelivery.config.min.month = startdate.month - 1;
    }
    if (vm.order.orderCar.timeFinishRent != null && vm.order.orderCar.timeFinishRent !== ''){
        var tmp = vm.order.orderCar.timeFinishRent.split('-');
        var enddate = {
            year: parseInt(tmp[0]),
            month: parseInt(tmp[1]),
            date: parseInt(tmp[2]),
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        timeDelivery.config.max = enddate;
        timeDelivery.config.max.month = enddate.month - 1;
    }

    // if (vm.order.plan.hasBalancePayment == 1){
    //     $('#balancePaymentPlan').show();
    // } else {
    //     $('#balancePaymentPlan').hide();
    // }
    $('#overdueFineConfDefault').prop('checked', vm.order.plan.overdueFineConf == 1);
    $('#overdueFineConfCustom').prop('checked', vm.order.plan.overdueFineConf == 2);
    if (vm.billLst.length > 0) {
        confirmationBillView(vm.billLst[0].status == 2?2:1);
        reloadOrderbillView();
    }
    if (vm.channelRebateBillList.length > 0) {
        confirmationChlRebateBillView(vm.channelRebateBillList[0].status == 2?2:1);
        reloadChlRebatebillView();
    }
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    var formVerify = {};
    if (vm.nodeFields != null){
        for (var key in vm.nodeFields){
            var field = vm.nodeFields[key];
            if (field.verify != null && field.verify != ''){
                formVerify[field.verify] = function (value, item) {
                    if (vm.verify) {
                        if (value == null || value === '') {
                            vm.verify = false;
                            return item.placeholder;
                        }
                    }
                };
            }
        }
        form.verify(formVerify);
    }
}

function initChecked(form) {
    form.on('select(billFeeItem)', function (data) {
        vm.billFeeItem = data.value;
    });

    form.on('submit(approve)', function () {
        vm.approve();
        return false
    });

    form.on('checkbox(insuranceItems)', function (data) {
        var item = data.value;
        var checked = data.elem.checked;
        if (checked){
            if ($.inArray(item, vm.insuranceItems) >= 0) {
            }else{
                vm.insuranceItems.push(item);
            }
        } else {
            if ($.inArray(item, vm.insuranceItems) >= 0) {
                for (var i = 0; i < vm.insuranceItems.length; i++) {
                    if (vm.insuranceItems[i] == item) {
                        vm.insuranceItems.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
        }
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

    form.on('select(operator)', function (data) {
        var usrid = data.value;
        vm.order.orderCar.operatorId = usrid;
        var obj = vm.usrLst.filter(function (obj) {
            return obj.userId == usrid;
        })[0];
        if (obj != null){
            vm.order.orderCar.operator = obj.username;
        }else {
            vm.order.orderCar.operator = '';
        }
        vm.transferFileLst.forEach(function (value) {
            value.operatorId = usrid;
            value.operator = vm.order.orderCar.operator;
        });
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

    form.on('select(contract)', function (data) {
        var id = data.value;
        if (id == null || id === ''){
            vm.resetContract();
        }
        var obj = vm.contractLst.filter(function (obj) {
            return obj.id == id;
        })[0];
        if (obj != null){
            vm.order.contract = Object.assign({}, vm.order.contract, {
                id:id,
                code:obj.code,
                timeStart:obj.timeStart,
                timeFinish:obj.timeFinish,
                timeSigned:obj.timeSigned,
                desc:obj.desc,
            });
            vm.order.contract = Object.assign({}, vm.order.contract, obj);
            uploadContract.updateFile(obj.fileLst);
            if (vm.order.contract.timeSigned == null || vm.order.contract.timeSigned == ''){
                vm.order.contract.timeSigned = vm.order.contract.timeStart;
            }
        }
    });

    form.on('select(channel)', function (data) {
        var id = data.value;
        vm.order.orderCar.channelId = id;
        var obj = vm.chlLst.filter(function (obj) {
            return obj.id == id;
        })[0];
        if (obj != null){
            vm.order.orderCar.channelName = obj.channelName;
        }else {
            vm.order.orderCar.channelName = '';
        }
    });

    form.on('select(salePerson)', function (data) {
        vm.order.orderCar.salePersonId = data.value;
        if(data.value != null && data.value != ''){
            vm.order.orderCar.salePersonName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.order.orderCar.salePersonName='';
        }
    });

    form.on('radio(contractType)', function (data) {
        if (vm.order.contract.contractType != data.value){
            vm.resetContract();
        }
        vm.order.contract.contractType = data.value;
        vm.contractModelId = 'contractModelId_' + uuid(6);
    });

    form.on('radio(isDepositPaid)', function (data) {
        vm.customField.isDepositPaid = data.value;
    });

    form.on('radio(isCarNoRegistered)', function (data) {
        vm.customField.isCarNoRegistered = data.value;
    });

    form.on('radio(isInsuranceConfirmed)', function (data) {
        vm.customField.isInsuranceConfirmed = data.value;
    });

    form.on('radio(isContractConfirmed)', function (data) {
        vm.customField.isContractConfirmed = data.value;
    });

    form.on('radio(isReceivedPayment)', function (data) {
        vm.customField.isReceivedPayment = data.value;
    });

    form.on('switch(hasFreeDays)',function (data) {
        vm.order.plan.hasFreeDays = data.elem.checked ? vm.order.plan.hasFreeDays | data.elem.checked : 0;
        $('#hasFreeDaysType').val(vm.order.plan.hasFreeDays);
        layui.form.render('select');
    });

    form.on('select(hasFreeDaysType)',function (data) {
        vm.order.plan.hasFreeDays = data.value ? data.value : 0;
        $('#switchHasFreeDays').prop('checked', vm.order.plan.hasFreeDays & 1 === 1);
        layui.form.render('checkbox');
    });

    form.on('radio(repaymentMethod)', function (data) {
        vm.order.repaymentMethod = data.value;
    });

    form.on('radio(paymentDayType)', function (data) {
        vm.order.orderCar.paymentDayType = data.value;
    });

    form.on('select(balancePaymentMethod)',function (data) {
        var serializeId = data.elem.attributes.sid.value;
        vm.order.plan.balancePaymentLst.forEach(function (value) {
            if (value.serializeId == serializeId) {
                value.paymentMethod = data.value;
            }
        });
    });

    form.on('select(feeItem)', function (data) {
        vm.feeItemId = data.value;
    });

    form.on('select(feeItemPaymentMethod)',function (data) {
        var serializeId = data.elem.attributes.sid.value;
        vm.order.plan.feeLst.forEach(function (value) {
            if (value.serializeId == serializeId) {
                value.paymentMethod = data.value;
            }
        });
    });

    form.on('radio(rentGenerationMethod)', function (data) {
        vm.order.plan.rentGenerationMethod = data.value;
    });

    form.on('switch(overdueFineConfDefault)',function (data) {
        vm.order.plan.overdueFineConf = data.elem.checked ? 1 : 0;
        $('#overdueFineConfCustom').prop('checked', vm.order.plan.overdueFineConf == 2);
        $('#overdueFineConfDefault').prop('checked', vm.order.plan.overdueFineConf == 1);
        layui.form.render('checkbox');
    });

    form.on('switch(overdueFineConfCustom)',function (data) {
        vm.order.plan.overdueFineConf = data.elem.checked ? 2 : 0;
        $('#overdueFineConfCustom').prop('checked', vm.order.plan.overdueFineConf == 2);
        $('#overdueFineConfDefault').prop('checked', vm.order.plan.overdueFineConf == 1);
        layui.form.render('checkbox');
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });

    $("#approve").on('click', function () {
        vm.verify = true;
    });

    $("#recall").on('click', function () {
        vm.recall();
    });

    $("#delect").on('click', function () {
        vm.delect();
    });

    $("#reedit").on('click', function () {
        vm.reedit();
    });

    $("#reject").on('click', function () {
        vm.reject();
    });

    $("#refuse").on('click', function () {
        vm.refuse();
    });

    $('span[name="viewReceived"]').on('click', function () {
        vm.viewReceived();
    });

    $('span[name="viewInsurance"]').on('click', function () {
        vm.viewInsurance();
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

    $("#tenancy").on('blur', function () {
        if (vm.order.orderCar.tenancyType == 2) {
            setTimeout(function () {
                generateOrderbillView();
            }, 10);
        }
    });
}

function initTable(rentType, table, soulTable){
    initializeTable(rentType, table)

    table.render({
        id: "operationlogid",
        elem: '#operationlog',
     // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.order.id,
            auditType: 3
        },
        cols: [[
            {
                field: 'operatorName', align:'center',title: '操作人', minWidth: 200, templet: function (d) {
                    return isEmpty(d.operatorName);
                }
            },
            {
                field: 'memo', align:'center',title: '操作内容', minWidth: 200, templet: function (d) {
                    return isEmpty(d.memo);
                }
            },
            {
                field: 'timeCreate', align:'center',title: '操作时间', minWidth: 200, templet: function (d) {
                    return isEmpty(d.timeCreate);
                }
            },
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });
    initTableEvent(table);
    initTableEditListner(table);
}

function initializeTable(rentType, table) {
    var cols = [{field:'model', title: '*品牌/车系/车型', align:'center',hide: vm.nodeFields.billLading_orderCar_selectCarModel&&vm.nodeFields.billLading_orderCar_selectCarModel.hide, minWidth:200, templet: function (d) {
            var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
            if (txt == null || txt === '') {txt = '请选择品牌/车系/车型';}
            return txt;
        }}];
    switch (parseInt(rentType)) {
        case 3://展示车
        case 4://试驾车
        case 1:{//经租
            cols.push({field:'cashDeposit', align:'center',title: '*保证金/元/台', hide: vm.nodeFields.billLading_plan_cashDeposit.hide, minWidth:200});
            cols.push({field:'cashDepositPeriods', align:'center', title: '*保证金分期', hide: vm.nodeFields.billLading_plan_cashDeposit.hide, minWidth:200});
            cols.push({field:'monthlyRent', align:'center',title: '*租金/元/台', hide: vm.nodeFields.billLading_plan_monthlyRent.hide, minWidth:200});
            if (vm.nodeFields.billLading_plan_coverCharge.edit){
                cols.push({field:'coverCharge', align:'center',title: vm.nodeFields.billLading_plan_coverCharge.required?'*服务费':'服务费', hide: vm.nodeFields.billLading_plan_coverCharge.hide, minWidth:200, edit: 'text', event: 'coverCharge'});
            } else {
                cols.push({field:'coverCharge', align:'center',title: vm.nodeFields.billLading_plan_coverCharge.required?'*服务费':'服务费', hide: vm.nodeFields.billLading_plan_coverCharge.hide, minWidth:200, templet: function (d) {return isEmpty(d.coverCharge);}});
            }
            if (vm.nodeFields.billLading_plan_chlRebate.edit) {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebate'});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebatePeriods'});
            } else {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebatePeriods);}});
            }
            if (vm.nodeFields.billLading_plan_hasFreeDays.edit){
                cols.push({field:'hasFreeDays', align:'center',title: vm.nodeFields.billLading_plan_hasFreeDays.required?'*免费用车天数':'免费用车天数', hide: vm.nodeFields.billLading_plan_hasFreeDays.hide, minWidth:200, templet: '#selectHasFreeDays'});
                cols.push({field:'hasFreeDays', align:'center',title: vm.nodeFields.billLading_plan_hasFreeDays.required?'*免费用车天数类型':'免费用车天数类型', hide: vm.nodeFields.billLading_plan_hasFreeDays.hide, minWidth:200, templet: '#selectHasFreeDaysType'});
            } else {
                cols.push({field:'hasFreeDays', align:'center',title: vm.nodeFields.billLading_plan_hasFreeDays.required?'*免费用车天数':'免费用车天数', hide: vm.nodeFields.billLading_plan_hasFreeDays.hide, minWidth:200, templet:function (d) {
                        if (d.hasFreeDays&1 == 1){
                            return '是';
                        } else {
                            return '否';
                        }
                    }});
                cols.push({field:'hasFreeDays', align:'center',title: vm.nodeFields.billLading_plan_hasFreeDays.required?'*免费用车天数类型':'免费用车天数类型', hide: vm.nodeFields.billLading_plan_hasFreeDays.hide, minWidth:200, templet: function (d) {
                        if (d.hasFreeDays == 3){
                            return '租期前';
                        } else if (d.hasFreeDays == 1) {
                            return '租期后';
                        }else {
                            return '--';
                        }
                    }});
            }
            if (vm.nodeFields.billLading_plan_freeDays.edit) {
                cols.push({field:'freeDays', align:'center',title: vm.nodeFields.billLading_plan_freeDays.required?'*免费用车时间/天数/台':'免费用车时间/天数/台', hide: vm.nodeFields.billLading_plan_freeDays.hide, minWidth:200, edit: 'text', event: 'freeDays'});
            } else {
                cols.push({field:'freeDays', align:'center',title: vm.nodeFields.billLading_plan_freeDays.required?'*免费用车时间/天数/台':'免费用车时间/天数/台', hide: vm.nodeFields.billLading_plan_freeDays.hide, minWidth:200, templet: function (d) {return isEmpty(d.freeDays);}});
            }
            break;
        }
        case 2:{//以租代购
            cols.push({field:'servicingFee', align:'center',title: '*整备费/元/台', hide: vm.nodeFields.billLading_plan_servicingFee.hide});
            cols.push({field:'servicingFeePeriods', align:'center', title: '*整备费分期', hide: vm.nodeFields.billLading_plan_servicingFee.hide});
            cols.push({field:'monthlyRent', align:'center',title: '*租金/元/台', hide: vm.nodeFields.billLading_plan_monthlyRent.hide});
            if (vm.nodeFields.billLading_plan_coverCharge.edit){
                cols.push({field:'coverCharge', align:'center',title: vm.nodeFields.billLading_plan_coverCharge.required?'*服务费':'服务费', hide: vm.nodeFields.billLading_plan_coverCharge.hide, minWidth:200, edit: 'text', event: 'coverCharge'});
            } else {
                cols.push({field:'coverCharge', align:'center',title: vm.nodeFields.billLading_plan_coverCharge.required?'*服务费':'服务费', hide: vm.nodeFields.billLading_plan_coverCharge.hide, minWidth:200, templet: function (d) {return isEmpty(d.coverCharge);}});
            }
            cols.push({field:'balancePayment', align:'center', title: '尾款/元/台', hide: vm.nodeFields.billLading_plan_hasBalancePayment.hide});
            cols.push({field:'balancePaymentPeriods', align:'center', title: '尾款分期', hide: vm.nodeFields.billLading_plan_hasBalancePayment.hide});
            if (vm.nodeFields.billLading_plan_chlRebate.edit) {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebate'});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebatePeriods'});
            } else {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebatePeriods);}});
            }
            break;
        }
        case 5:{//融租
            cols.push({field:'downPayment', align:'center',title: '*首付款/元/台', hide: vm.nodeFields.billLading_plan_downPayment.hide});
            cols.push({field:'downPaymentPeriods', align:'center', title: '*首付款分期', hide: vm.nodeFields.billLading_plan_downPayment.hide});
            cols.push({field:'monthlyRent', align:'center',title: '*租金/元/台', hide: vm.nodeFields.billLading_plan_monthlyRent.hide});
            cols.push({field:'balancePayment', align:'center', title: '尾款/元/台', hide: vm.nodeFields.billLading_plan_hasBalancePayment.hide});
            cols.push({field:'balancePaymentPeriods', align:'center', title: '尾款分期', hide: vm.nodeFields.billLading_plan_hasBalancePayment.hide});
            if (vm.nodeFields.billLading_plan_financeCompanyName.edit){
                cols.push({field:'financeCompanyName',align:'center', title: vm.nodeFields.billLading_plan_financeCompanyName.required?'*金融公司名称':'金融公司名称', hide: vm.nodeFields.billLading_plan_financeCompanyName.hide, minWidth:200, edit: 'text', event: 'financeCompanyName'});
            } else {
                cols.push({field:'financeCompanyName', align:'center',title: vm.nodeFields.billLading_plan_financeCompanyName.required?'*金融公司名称':'金融公司名称', hide: vm.nodeFields.billLading_plan_financeCompanyName.hide, minWidth:200, templet: function (d) {return isEmpty(d.financeCompanyName);}});
            }
            if (vm.nodeFields.billLading_plan_chlRebate.edit) {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebate'});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebatePeriods'});
            } else {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebatePeriods);}});
            }
            break;
        }
        case 6:{//直购
            cols.push({field:'totalPrice', align:'center',title: '*车辆总单价/元/台', hide: vm.nodeFields.billLading_plan_totalPrice.hide});
            if (vm.nodeFields.billLading_plan_chlRebate.edit) {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebate'});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, edit: 'text', event: 'chlRebatePeriods'});
            } else {
                cols.push({field:'chlRebate', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*渠道返利':'渠道返利', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}});
                cols.push({field:'chlRebatePeriods', align:'center',title: vm.nodeFields.billLading_plan_chlRebate.required?'*返利分期':'返利分期', hide: vm.nodeFields.billLading_plan_chlRebate.hide, minWidth:200, templet: function (d) {return isEmpty(d.chlRebatePeriods);}});
            }
            break;
        }
        case 7:{//挂靠
            cols.push({field:'monthlyRent', align:'center',title: '*挂靠费/元/台', minWidth:200, edit: 'text', event: 'monthlyRent'});
            break;
        }
    }
    table.render({
        id: "carLstid",
        elem: '#carLst',
        data: [vm.order.plan],
        cols: [cols],
        width: cols.length*200,
        page: false,limit: 500,
        done: function (res, curr, count) {
            $('#hasFreeDaysType').val(vm.order.plan.hasFreeDays);
            layui.form.render('select');
        }
    });
    $('#carBox').show();
    /*if ((rentType == 2 || rentType == 5) && vm.nodeFields.billLading_plan_hasBalancePayment.show){
        var datas = [];
        if (vm.order.plan.balancePaymentLst.length > 0){
            vm.order.plan.balancePaymentLst.forEach(function (value) {
                var item = {
                    serializeId:value.serializeId,
                    elid: 'serializeId_'+(value.serializeId),
                    typeFieldName:value.typeFieldName,
                    typeFieldDesc:value.typeFieldDesc,
                    money:value.money,
                    paymentMethod:value.paymentMethod,
                    timePayment1st:value.timePayment1st
                };
                datas.push(item);
            });
        }
        table.render({
            id: 'balancePaymentLstid',
            elem: '#balancePaymentLst',
            data: datas,
            cols: [[
                {field:'money', align:'center',title: '尾款金额/元', edit: 'text', event: 'money'},
                {field:'paymentMethod',align:'center', title: '尾款付款方式', templet: '#selectPaymentMethod'},
                {field:'timePayment1st',align:'center', title: '预计第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
                        var txt = d.timePayment1st;
                        if ((/\d+/).test(txt)){
                            txt = isEmpty(dateFormatYMD(txt));
                        }else txt = '请选择第一次付款日期';
                        return txt;
                    }},
                {title: '操作',align:'center', width: 120, templet: '#balancePaymentBarTpl', fixed: "right", align: "center"}
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
    }

    if (rentType == 6){
        var datas = [];
        if (vm.order.plan.feeLst.length > 0){
            vm.order.plan.feeLst.forEach(function (value) {
                var item = {
                    serializeId:value.serializeId,
                    elid: 'serializeId_'+(value.serializeId),
                    typeFieldName:value.typeFieldName,
                    typeFieldDesc:value.typeFieldDesc,
                    money:value.money,
                    paymentMethod:value.paymentMethod,
                    timePayment1st:value.timePayment1st
                };
                datas.push(item);
            });
        }
        table.render({
            id: 'feeLstid',
            elem: '#feeLst',
            data: vm.order.plan.feeLst,
            cols: [[
                {field:'typeFieldDesc',align:'center', title: '类型'},
                {field:'money',align:'center', title: '金额/元', edit: 'text', event: 'money'},
                {field:'paymentMethod',align:'center', title: '付款方式', templet: '#selectFeeItemPaymentMethod'},
                {field:'timePayment1st', align:'center',title: '第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
                        var txt = d.timePayment1st;
                        if ((/\d+/).test(txt)){
                            txt = isEmpty(dateFormatYMD(txt));
                        }else if (d.typeFieldName === 'monthly_rent'){
                            txt = '--';
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
                    var value = vm.order.plan.feeLst.filter(function (value) {
                        return value.serializeId == serializeId;
                    })[0].paymentMethod;
                    $(this).val(value);
                });
                layui.form.render('select');
                $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
            }
        });
    }*/

    if (vm.order.repaymentMethod == 4) {
        table.render({
            id: "signlistid",
            elem: '#signList',
            url: baseURL + 'alipay/alipaysign/queryList',
            where: {customerId:vm.order.customerId},
            cols: [[
                {field:'signTime', align:'center',title: '签约时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.signTime);}},
                {field:'product', align:'center',title: '签约产品', minWidth:200, align: "center",templet: function (d) {return '商户代扣';}},
                {field:'timeUnsign', align:'center',title: '解约时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeUnsign);}},
                {field:'status', align:'center',title: '状态', minWidth:200, align: "center",templet: function (d) {return transformTypeByMap(d.status, { 1: '发起签约', 2: '签约失败', 3: '签约成功', 4: '已解约', 91: '已取消', 0: '生成签约单' });}},
                {field:'remark', title: '签约失败原因', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.remark);}},
            ]],
            page: true,
            loading: true,
            limits: [5, 10, 20, 50],
            limit: 5,
            autoColumnWidth: {
                init: false
            }
        });
    }

    if (vm.nodeFields.billLading_plan_billView && vm.nodeFields.billLading_plan_billView.show){
        if (vm.nodeFields.billLading_plan_billView.edit) {
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
        } else {
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
                    {field:'receivableAmount', title: '应还金额/元', templet: function (d) {return toMoney(d.receivableAmount);}},
                    {field:'receivableDate', title: '应还日期', templet: function (d) {
                            var txt = d.receivableDate;
                            if ((/\d+/).test(txt)){
                                txt = isEmpty(dateFormatYMD(txt));
                            }
                            return txt;
                        }},
                    {field:'overdueDate', title: '逾期期限', templet: function (d) {return isEmpty(d.overdueDate)}},
                    {field:'billStartTime', title: '账单开始时间', templet: function (d) {return isEmpty(d.billStartTime)}},
                    {field:'billEndTime', title: '账单结束时间', templet: function (d) {return isEmpty(d.billEndTime)}},
                    {field:'remarks', title: '备注', templet: function (d) {return isEmpty(d.remarks)}},
                ]],
                page: true,
                limits: [5, 8, 15],
                limit: 5,
            });
        }
    }

    if (vm.nodeFields.billLading_plan_chlRebate && vm.nodeFields.billLading_plan_chlRebate.show){
        if (vm.nodeFields.billLading_plan_chlRebate.edit) {
            table.render({
                id: 'chlRebateBillLstid',
                elem: '#chlRebateBillLst',
                data: vm.channelRebateBillList,
                width: 1000,
                cols: [[
                    {field:'collectionType', title: '付款类型', templet: d => '渠道返利'},
                    {field:'stage', title: '期数', templet: function (d) {
                            if (d.stage == null || d.stage == '') {
                                return '--';
                            } else {
                                return '第'+d.stage+'期';
                            }
                        }},
                    {field:'receivableAmount', title: '应付金额/元', edit: 'text', event: 'receivableAmount'},
                    {field:'receivableDate', title: '应付日期', event: 'selectReceivableDate', templet: function (d) {
                            var txt = d.receivableDate;
                            if ((/\d+/).test(txt)){
                                txt = isEmpty(dateFormatYMD(txt));
                            }else txt = '请选择应还日期';
                            return txt;
                        }},
                    {field:'remarks', edit: 'text', title: '备注', event: 'remarks'},
                    {title: '操作', width: 120, templet: '#chlRebateBillBarTpl', fixed: "right", align: "center"}
                ]],
                page: true,
                limits: [5, 8, 15],
                limit: 5,
                done: function (res, curr, count) {
                    layui.form.render('select');
                    $('td[data-field="receivableDate"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
                }
            });
        } else {
            table.render({
                id: 'chlRebateBillLstid',
                elem: '#chlRebateBillLst',
                data: vm.channelRebateBillList,
                width: 1000,
                cols: [[
                    {field:'collectionType', title: '付款类型', templet: d => '渠道返利'},
                    {field:'stage', title: '期数', templet: function (d) {
                            if (d.stage == null || d.stage == '') {
                                return '--';
                            } else {
                                return '第'+d.stage+'期';
                            }
                        }},
                    {field:'receivableAmount', title: '应付金额/元'},
                    {field:'receivableDate', title: '应付日期', templet: function (d) {
                            var txt = d.receivableDate;
                            if ((/\d+/).test(txt)){
                                txt = isEmpty(dateFormatYMD(txt));
                            }else txt = '--';
                            return txt;
                        }},
                    {field:'remarks', title: '备注'},
                ]],
                page: true,
                limits: [5, 8, 15],
                limit: 5,
            });
        }
    }
}

function initTableEditListner(table) {
    table.on('edit(carLst)', function(obj){
        vm.editcarlistener(obj);
    });

    table.on('edit(balancePaymentLst)', function(obj){
        vm.editbalancePaymentlistener(obj);
    });

    table.on('edit(feeLst)', function(obj){
        vm.editfeeItemlistener(obj);
    });

    table.on('edit(billLst)', function(obj){
        vm.editbillItemlistener(obj);
    });

    table.on('edit(chlRebateBillLst)', function(obj){
        vm.chlRebateBillItemlistener(obj);
    });
}

function initTableEvent(table) {
    table.on('tool(carLst)', function (obj) {
        var layEvent = obj.event;
        if (layEvent === 'chlRebate') {
            tableEditMaxlength('chlRebate', 10);
            tableEditOninputNum('chlRebate');
        }else if (layEvent === 'financeCompanyName') {
            tableEditMaxlength('financeCompanyName', 50);
        }else if (layEvent === 'freeDays' || layEvent.endsWith('Periods')) {
            tableEditMaxlength(layEvent, 5);
            tableEditOninputNumInteger(layEvent);
        }else {
            tableEditMaxlength(layEvent, 10);
            tableEditOninputNum(layEvent);
        }
    });

    table.on('tool(balancePaymentLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.balancePaymentPlanDelectObj(obj);
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

    table.on('tool(feeLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'delect') {
            vm.feeItemDelectObj(obj);
        }else if (layEvent === 'selectTimePayment1st') {
            if (data.typeFieldName == 'monthly_rent'){
                return;
            }
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
                    vm.order.plan.feeLst.forEach(function (value) {
                        if (value.serializeId === data.serializeId) value.timePayment1st = data.timePayment1st;
                    });
                    vm.reloadFeeItem();
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
            var _this = this;
            setTimeout(function () {
                layui.laydate.render({
                    elem: _this.firstChild,
                    trigger: 'click',
                    closeStop: _this,
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
            }, 100);
        }else if (layEvent === 'receivableAmount') {
            tableEditMaxlength(layEvent, 10);
            tableEditOninputNum(layEvent);
        }else if (layEvent === 'remarks') {
            tableEditMaxlength(layEvent, 20);
        }
    });

    table.on('tool(chlRebateBillLst)', function (obj) {
        var layEvent = obj.event;
        var data = obj.data;
        if (layEvent === 'regen') {
            var _obj = chlRebateBillBuk.filter(function (item) {
                return item.serializeId === data.serializeId;
            })[0];
            for (var i = 0; i < vm.channelRebateBillList.length; i++) {
                if (vm.channelRebateBillList[i].serializeId === data.serializeId) {
                    vm.channelRebateBillList[i] = JSON.parse(JSON.stringify(_obj));
                    break;
                }
            }
            confirmationChlRebateBillView(1);
            reloadChlRebatebillView();
        }else if (layEvent === 'selectReceivableDate') {
            var txt = '';
            if ((/\d+/).test(data.receivableDate)){
                txt = isEmpty(dateFormatYMD(data.receivableDate));
            }else {
                var now = new Date();
                txt = now.format('yyyy-MM-dd');
            }
            this.firstChild.textContent = txt;
            var _this = this;
            setTimeout(function () {
                layui.laydate.render({
                    elem: _this.firstChild,
                    trigger: 'click',
                    closeStop: _this,
                    isInitValue: false,
                    value: txt,
                    btns: ['now', 'confirm'],
                    show: true,
                    done: function (value, date) {
                        data.receivableDate = new Date(value).getTime();
                        vm.channelRebateBillList.forEach(function (value) {
                            if (value.serializeId === data.serializeId) {
                                value.receivableDate = data.receivableDate;
                            }
                        });
                        confirmationChlRebateBillView(1);
                        reloadChlRebatebillView();
                    }
                });
            }, 100);
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
        elem: '#paymentDay',
        trigger: 'click',
        theme: 'grid',
        type: 'date',
        isInitValue: false,
        showBottom: false,
        value: '1989-10-01',
        min: '1989-10-01',
        max: '1989-10-31',
        done: function (value, date) {
            Vue.set(vm.order.orderCar, "paymentDay", date.date);
            $('input#paymentDayVal').val(date.date);
        },
        ready: function(){//
            $('.laydate-theme-grid>div.layui-laydate-hint').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
        }
    });

    //timeDelivery =
    laydate.render({
        elem: '#timeDelivery',
        trigger: 'click',
        type: 'datetime',
        done: function (value) {
            vm.order.orderCar.timeDelivery = value;
        }
    });

    laydate.render({
        elem: '#mileageNextDate',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.mileageNextDate = value;
        }
    });

    var timeStart = laydate.render({
        elem: '#timeStart',
        trigger: 'click',
        done: function (value, date) {
            vm.order.contract.timeStart = value;
            timeFinish.config.min = date;
            timeFinish.config.min.month = date.month -1;
            if (vm.order.contract.timeSigned == null || vm.order.contract.timeSigned == ''){
                vm.order.contract.timeSigned = vm.order.contract.timeStart;
            }
        }
    });

    var timeFinish = laydate.render({
        elem: '#timeFinish',
        trigger: 'click',
        done: function (value, date) {
            vm.order.contract.timeFinish = value;
            timeStart.config.max = date;
            timeStart.config.max.month = date.month -1;
        }
    });

    laydate.render({
        elem: '#timeSigned',
        trigger: 'click',
        done: function (value) {
            vm.order.contract.timeSigned = value;
        }
    });

    laydate.render({
        elem: '#timeTransferEstimated',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.timeTransferEstimated = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (!closePageTag){
        if (parent.vm.hasOwnProperty('reload')){
            parent.vm.reload();
        }
    }
    parent.layer.close(index);
    if (closePageTag){
        if (parent.vm.hasOwnProperty('closePage')){
            parent.vm.closePage();
        }
    }
}

function customerSelectAddBtn() {
    setTimeout(function(){
        var selectParent = $('input[placeholder="请选择客户"]').parent().parent().find('dl.layui-anim-upbit');
        if (!selectParent.hasClass('select-nobottom')) {
            selectParent.addClass('select-nobottom');
        }
        if (selectParent.find('dd.select-option-float-btn').length < 1){
            selectParent.append('<dd lay-value="-1" class="select-option-float-btn" style="cursor: default"><button lay-filter="addNewCustomer" lay-submit style="width: 50%;cursor: pointer">新增客户信息</button></dd>');
        }
    },300);
}

function inputSelect(){
    var code = $("#contractValue").val();
    var id = $('datalist>option[value="'+code+'"]').attr("text");
    if (id == null || id === ''){
        vm.resetContract();
        Vue.set(vm.order.contract, 'code', code);
    }
    var obj = vm.contractLst.filter(function (obj) {
        return obj.id == id;
    })[0];
    if (obj != null){
        vm.order.contract = Object.assign({}, vm.order.contract, {
            id:id,
            code:obj.code,
            timeStart:obj.timeStart,
            timeFinish:obj.timeFinish,
            timeSigned:obj.timeSigned,
            desc:obj.desc,
        });
        uploadContract.updateFile(obj.fileLst);
        if (vm.order.contract.timeSigned == null || vm.order.contract.timeSigned == ''){
            vm.order.contract.timeSigned = vm.order.contract.timeStart;
        }
    }
}

function getPeyTypeStr(paymentMethod) {
    return getPaymentMethodStr(paymentMethod);
}

function getAuditStatusStr() {
    return '提单审核中';
}

function getOrderStatusStr() {
    if (instanceStatus == 5){
        return '已撤回';
    } else if (instanceStatus == 2){
        return '已拒绝';
    } else if (instanceStatus == 3){
        return '已完成';
    } else {
        return processnode.currentNodeData.nodeName;
    }
}

function isShowContent() {
    return instanceStatus == 2
        || instanceStatus == 5
        ||instanceStatus == 6;
}

function getAuditMarkType() {
    if (instanceStatus == 2 || instanceStatus == 6) {
        return '审核反馈';
    }else if (instanceStatus == 5) {
        return '撤回原因';
    }
}

function getAuditMarkStr() {
    if (processnode != null && processnode.approveData != null){
        return processnode.approveData.approveContent;
    } else {
        return '---';
    }
}

function initializeShowLv(nodeFields, nodeField) {
    if (nodeField != null && nodeField.length > 0){
        nodeField.forEach(function (section) {
            if (section.fields != null && section.fields.length > 0) {
                if (isApply && isInitiator && ('show' === viewTag)) {
                    if (section.moduleConfig !=3) {
                        if (section.fields.filter(function (f) {
                            return !f.applyWatch;
                        }).length === section.fields.length) {
                            section.moduleConfig = 3;
                        }
                    }else {
                        if (section.fields.filter(function (f) {
                            return !f.applyWatch;
                        }).length !== section.fields.length) {
                            section.moduleConfig = 2;
                        }
                    }
                }else {
                    if (section.moduleConfig !=3) {
                        if (section.fields.filter(function (f) {
                            return f.hide;
                        }).length === section.fields.length) {
                            section.moduleConfig = 3;
                        }
                    }else {
                        if (section.fields.filter(function (f) {
                            return f.hide;
                        }).length !== section.fields.length) {
                            section.moduleConfig = 2;
                        }
                    }
                }
            }
            // if (section.moduleConfig !=3
            //     && isApply && isInitiator && ('show' === viewTag)
            //     && section.fields != null
            //     && section.fields.length > 0
            //     && section.fields.filter(function (f) {
            //         return !f.applyWatch;
            //     }).length === section.fields.length){
            //     section.moduleConfig = 3;
            // }
            //
            // if (section.moduleConfig !=3
            //     && section.fields != null
            //     && section.fields.length > 0
            //     && section.fields.filter(function (f) {
            //         return f.hide;
            //     }).length === section.fields.length){
            //     section.moduleConfig = 3;
            // }

            getShowLv(nodeField, nodeFields, section.moduleInfo);
            if (section.fields != null && section.fields.length > 0) {
                section.fields.forEach(function (field) {
                    getShowLv(nodeField, nodeFields, section.moduleInfo, field.classLevel, field.fieldInfo);
                });
            }
        });
    }
}

function getShowLv(nodeField, nodeFields, moduleInfo, classLevel, fieldInfo) {
    var key = '';
    var model = {
        'show':false,
        'edit':false,
        'visible':false,
        'hide':false,
        'required':false,
        'applyWatch':false,
        'classLevel':'',
        'fieldInfo':'',
        'verify':'',
        'fieldHint':''
    };
    var section = {};
    if (isNotEmpty(moduleInfo)) {
        key += moduleInfo;
        section = nodeField.filter(function (m) {
            return m.moduleInfo === moduleInfo;
        })[0];
        model.edit = section.moduleConfig == 1;
        model.visible = section.moduleConfig == 2;
        model.hide = section.moduleConfig == 3;
    }
    var field = {};
    if (isNotEmpty(classLevel) && isNotEmpty(fieldInfo) && isNotEmpty(section)) {
        key += ('_'+classLevel+'_'+fieldInfo);
        field = section.fields.filter(function (f) {
            return  f.classLevel === classLevel && f.fieldInfo === fieldInfo;
        })[0];
        model.classLevel = field.classLevel;
        model.fieldInfo = field.fieldInfo;
        model.edit = (field.edit||false)&&('edit' === viewTag);
        model.visible = (field.visible||false)||(field.edit||false);
        model.hide = field.hide||false;
        model.required = field.required||false;
        model.applyWatch = field.applyWatch||false;
        model.fieldHint = field.fieldHint;
        if (isApply && isInitiator) {
            model.edit = false;
            model.visible = false;
            model.hide = false;
            model.required = false;
            if (model.applyWatch){
                model.visible = true;
            }
        }
        if (model.required) {
            model.verify = key;
        }
    }
    model.show = model.visible || model.edit;
    // model.show = model.visible || model.edit || (field.edit||false);
    nodeFields[key] = model;
}

function isEdit() {
    return (instanceStatus == 1 || instanceStatus == 6) && !isApply && viewTag === 'edit';
}

function isReedit() {
    return instanceStatus == 6
        && (
            (
                !isApply
                && currentNodeData
                && (
                    (
                        currentNodeData.nodeFlag == 3
                        && isInitiator
                    )
                    ||
                    (
                        (currentNodeData.nodeFlag == 1 || currentNodeData.nodeFlag == 2)
                        && $.inArray(_usrId, approveUser) >= 0
                    )
                )
            )
            || (isApply && currentNodeData && currentNodeData.nodeType == 1)
        )
        && viewTag === 'show';
}

function isDelect() {
    return (instanceStatus == 2 || instanceStatus == 5) && isApply && viewTag === 'show';
}

function isRecall() {
    return (instanceStatus == 1 || instanceStatus == 6) && isApply && viewTag === 'show';
}

function isShowReceived() {
    return true;
}

function isShowInsurance() {
    return true;
}

function validateGenerateOrderbillView(){
    if ((vm.order.lessorId == null || vm.order.lessorId == '') && (vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7)) {
        return '请选择出租方';
    }
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
            // if (vm.order.plan.cashDeposit == null || vm.order.plan.cashDeposit == '') {
            //     return '请输入保证金';
            // }
            // if (isEmptyReturnNull(vm.order.plan.cashDepositPeriods) == null) {
            //     return '请输入保证金分期数';
            // }
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent == '') {
                return '请输入租金';
            }
            break;
        }
        case 2:{//以租代购
            if (vm.order.plan.servicingFee == null || vm.order.plan.servicingFee == '') {
                return '请输入整备费';
            }
            if (isEmptyReturnNull(vm.order.plan.servicingFeePeriods) == null) {
                return '请输入整备费分期数';
            }
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent == '') {
                return '请输入租金';
            }
            break;
        }
        case 5:{//融租
            if (vm.order.plan.downPayment == null || vm.order.plan.downPayment == '') {
                return '请输入首付款';
            }
            if (isEmptyReturnNull(vm.order.plan.downPaymentPeriods) == null) {
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
    if (msg === 'success') {
        generateOrderbillView();
    } else {
        alert(msg);
    }
}

function generateOrderbillView(){
    var msg = validateGenerateOrderbillView();
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
    var param = {
        order: order,
        orderCar: order.orderCar,
        orderCarPlan: order.plan,
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
                    alert("账单业务相关数据未填写，未生成预览账单");
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

function reloadChlRebatebillView() {
    layui.table.reload('chlRebateBillLstid', {
        page: {
            curr: getCurrPage('chlRebateBillLstid', vm.channelRebateBillList.length)
        },
        data: vm.channelRebateBillList
    });
    layui.table.render();
}

function confirmationChlRebateBillView(status){
    if (vm.channelRebateBillList.length > 0) {
        //金额校验
        if (status == 2) {
            var amountTotle = 0;
            for (var i = 0; i < vm.channelRebateBillList.length; i++) {
                amountTotle = add(amountTotle, vm.channelRebateBillList[i].receivableAmount);
            }
            if (Number(vm.order.plan.chlRebate) != Number(amountTotle)) {
                alert("渠道返利账单与租赁方案设置不一致，请核对后再确认账单");
                return;
            }
        }
        vm.channelRebateBillList.forEach(function (item) {
            item.status = status;
        })
        vm.confirmationChlRebateStatus = status;
    }
}

function generateChlRebatebillView(){
    // if (vm.order.orderCar.rentType != 8) return;
    if (vm.order.plan.chlRebate == null || vm.order.plan.chlRebate == '') {
        return "渠道返利不能为空";
    }
    if (vm.order.plan.chlRebatePeriods == null || vm.order.plan.chlRebatePeriods == '') {
        return "渠道返利分期不能为空";
    }
    vm.channelRebateBillList.splice(0);
    var order = JSON.parse(JSON.stringify(vm.order));
    var chlRebate = order.plan.chlRebate;
    var chlRebatePeriods = order.plan.chlRebatePeriods;
    var now = new Date();
    var amount = div(chlRebate, chlRebatePeriods);
    for (var i = 1; i <= chlRebatePeriods; i++) {
        var item = {
            "serializeId":uuid(32),
            "collectionType":14,
            "receivableAmount":amount,
            "receivableDate":now.format("yyyy-MM-dd"),
            "typeFieldName":"chl_rebate",
            "typeFieldDesc":"渠道返利",
            "orderNum":8,
            "stage":i,
        }
        if (i == chlRebatePeriods) {
            item.receivableAmount = chlRebate;
        }
        vm.channelRebateBillList.push(item);
        chlRebate = sub(chlRebate, amount);
    }
    chlRebateBillBuk = JSON.parse(JSON.stringify(vm.channelRebateBillList));
    confirmationChlRebateBillView(1);
    reloadChlRebatebillView()
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
        vm.confirmationStatus = status;
    }
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
