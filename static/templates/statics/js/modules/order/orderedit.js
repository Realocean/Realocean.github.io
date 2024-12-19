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

var viewer;
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
var uploadContract;
var billLstBuk;
var chlRebateBillBuk;
var receivables_overdue_period = 0;
var order_alipay_daikou_sign = 1;
var order_default_sign = 0;

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
        checked:true,
        box:{
            box1:true
        },
        q: {
            keyword: null
        },
        order: {

        },
        billLst: [],
        channelRebateBillList: [],
        accessoryGroupList: [],
        insuranceGroupList: [],
        deptList: [],
        customerList: [],
        orderFileLst: [],
        deliveryFileLst: [],
        contractFileLst: [],
        transferFileLst: [],
        chlLst: [],
        usrLst: [],
        salePersonList: [],
        contractLst: [],
        insuranceItems: [],
        accessoryItems: [],
        feeItemLst: [],
        customerId: 'customerId_',
        orderMoneyDesc: '',
        orderMoneyHolder: '',
        billFeeItem: '',
        statisticsBillViewTxt: '',
        verify: false,
        selectDayUpdated: false,
        orderFileLstId: 'orderFileLstId_0',
        deliveryFileLstId: 'deliveryFileLstId_0',
        transferFileLstId: 'transferFileLstId_0',
        contractFileLstId: 'contractFileLstId_0',
        carUpdateId: 'carUpdateId_0',
        contractModelId: 'contractModelId_0',
        daikouMsgId: 'daikouMsgId_0',
        rentGenerationMethodId: 'rentGenerationMethod_id_0',
        feeItemId: '',
        confirmationStatus: 1,
        confirmationChlRebateStatus: 1,
        tenancyCalcType: 1,
        lessor_title:'出租方',
        leasee_title:'承租方',
        daikouFlag:sessionStorage.getItem("daikouFlag")^0,
        overdueFineConf:{},
    },
    watch: {
        customerList: function () {
            this.$nextTick(function(){
                customerSelectAddBtn();
            });
        },
        'order.customerName': function () {
            this.$nextTick(function(){
                customerSelectAddBtn();
            });
        }
    },
    created: function () {
        var _this = this;
        var param = {};
        if(parent.layui.larryElem === undefined){
            param = parent.layer.boxParams.boxParams;
        }else {
            param = parent.layui.larryElem.boxParams;
        }
        _this.order = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/config/getConfVal/receivables_overdue_period", function (r) {
            receivables_overdue_period = r^0;
        });
        $.get(baseURL + "sys/config/getConfVal/order_alipay_daikou_sign", function (r) {
            order_alipay_daikou_sign = r==null||r==''?1:r^0;
        });
        $.get(baseURL + "sys/config/getConfVal/order_default_sign", function (r) {
            order_default_sign = r^0;
        });
        $.get(baseURL + "sys/config/getparam/tenancy_calc_type", function (r) {
            if (r.config != null){
                _this.tenancyCalcType = parseInt(r.config['paramValue']);
            } else {
                _this.tenancyCalcType = 1;
            }
        });
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList.filter(function (v) {
                return v.sysDeptType != 5;
            });
        });
        $.get(baseURL + "order/order/customerList", function (r) {
            _this.customerList = r.customerList;
        });
        $.get(baseURL + "chl/chlchannel/chlLst", function (r) {
            _this.chlLst = r.chlLst;
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
            _this.salePersonList=r.usrLst;
        });
        $.get(baseURL + "order/ordercar/getOverdueFineConf", function (r) {
            _this.overdueFineConf = r.conf;
        });
        var type = param.orderType;
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
        if (_this.order.orderCar.rentType == null || _this.order.orderCar.rentType == ''){
            _this.order.orderCar.rentType = type;
        }
        if (_this.order.orderCar.rentType == 5) {
            _this.order.orderCar.isBill = 2;
        }
        if (_this.order.orderCar.rentType == 6) {
            _this.lessor_title = '售卖方';
            _this.leasee_title = '购买方';
        }
        // $.get(baseURL + "contract/contracordernotemplate/contractLst/"+_this.order.orderCar.rentType, function (r) {
        //     _this.contractLst = r.contractLst;
        // });
        $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + _this.order.orderCar.rentType, function (r) {
            _this.feeItemLst = r.datas;
        });
        $.get(baseURL + "sys/dict/getInfoByType/vehicleInsurance", function (r) {
            _this.insuranceGroupList = r.dict;
            if (_this.insuranceGroupList != null && _this.insuranceGroupList.length > 0){
                var parent = $('#insuranceGroup');
                _this.insuranceGroupList.forEach(function (d) {
                    parent.append('<input type="checkbox" lay-filter="insuranceItems" v-model="insuranceItems" name="insuranceItems" value="'+d.value+'" lay-skin="primary" title="'+d.value+'">');
                    // d.name,d.code;
                });
            }
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

        if (_this.order.lessorId == null){
            _this.order.lessorId = '';
        }
        if (_this.order.hasBank == null){
            _this.order.hasBank = false;
        }
        if (_this.order.repaymentMethod == null){
            _this.order.repaymentMethod = 2;
        }
        if (_this.order.customerId == null){
            _this.order.customerId = '';
        }
        if (_this.order.orderCar.deliveryFileLst != null){
            _this.deliveryFileLst = _this.order.orderCar.deliveryFileLst;
        }
        if (_this.order.orderCar.transferFileLst != null){
            _this.transferFileLst = _this.order.orderCar.transferFileLst;
        }
        if (_this.order.orderCar.orderFileLst != null){
            _this.orderFileLst = _this.order.orderCar.orderFileLst;
        }
        if (_this.order.contract == null){
            _this.order.contract = {};
        }
        if (_this.order.contract.contractType == null){
            _this.order.contract.contractType = 2;
        }
        if (_this.order.repaymentMethod == 4){
            _this.order.contract.contractType = 1;
            $('input[title="直接选择/填写合同信息"]').prop('disabled',true);
        }
        if (_this.order.contract.fileLst != null){
            _this.contractFileLst = _this.order.contract.fileLst;
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
        if (_this.order.orderCar.operatorId == null){
            _this.order.orderCar.operatorId = sessionStorage.getItem("userId");
            _this.order.orderCar.operator = sessionStorage.getItem("username");
        }
        if(_this.order.orderCar.rentType  != undefined  && _this.order.orderCar.rentType  != null && _this.order.orderCar.rentType != 6 && (_this.order.orderCar.tenancyType == undefined || _this.order.orderCar.tenancyType == null)){
            _this.order.orderCar.tenancyType = 2;
        }
        if (parseInt(_this.order.orderCar.tenancyType) === 2){
            _this.order.orderCar.timeStartRent = '';
            _this.order.orderCar.timeFinishRent = '';
        } else if (parseInt(_this.order.orderCar.tenancyType) === 1){
            _this.order.orderCar.tenancy = '';
        } else {
            // _this.order.orderCar.timeStartRent = '';
            // _this.order.orderCar.timeFinishRent = '';
            // _this.order.orderCar.tenancy = '';
        }
        if (_this.order.orderCar.insuranceItems != null && _this.order.orderCar.insuranceItems !== ''){
            _this.insuranceItems = _this.order.orderCar.insuranceItems.split(',');
        }
        if (_this.order.orderCar.accessoryItemsName != null && _this.order.orderCar.accessoryItemsName !== ''){
            _this.accessoryItems = _this.order.orderCar.accessoryItemsName.split(',');
        }
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
        if (_this.order.orderCar.rentType == 8) {
            _this.order.plan.rentGenerationMethod = 2;
        }
        if (_this.order.orderCar.rentType == 5) {
            _this.order.plan.paymentMethod = 1;
            _this.order.orderCar.paymentMethod = 1;
        }
        _this.order.orderCar.depotCityName = jointStr('/', _this.order.orderCar.depotName, _this.order.orderCar.cityName);
        _this.order.orderCar.brandSeriesName = jointStr('/', _this.order.orderCar.brandName, _this.order.orderCar.seriesName);
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
        customerSelectAddBtn();
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
        selectCustomer:function (){
            var index = layer.open({
                title: "选择客户",
                type: 2,
                area: ['70%', '80%'],
                content: tabBaseURL + "modules/common/selectcustomer.html",
                success: function (layero, num) {
                    var iframe = window['layui-layer-iframe' + num];
                },
                end: function(){
                    var obj = vm.customer;
                    if (obj != null){
                        Vue.set(vm.order, "customerId", obj.id);
                        Vue.set(vm.order, "customerType", obj.customerType);
                        Vue.set(vm.order, "customerName", obj.customerName);
                        Vue.set(vm.order, "customerAddr", obj.address||obj.nowAddr||obj.companyAddr||obj.contactAddr);
                        Vue.set(vm.order, "customerTel", obj.contactMobile);
                        Vue.set(vm.order, "contactPerson", obj.contactPerson);
                        Vue.set(vm.order, "hasBank", obj.hasBank);
                    }else {
                        Vue.set(vm.order, "customerType", '');
                        Vue.set(vm.order, "customerName", '');
                        Vue.set(vm.order, "customerAddr", '');
                        Vue.set(vm.order, "customerTel", '');
                        Vue.set(vm.order, "contactPerson", '');
                        Vue.set(vm.order, "hasBank", true);
                    }
                    // if ((vm.order.orderWay^0>>1) === 0){
                    //     vm.order.repaymentMethod = '2';
                    // }
                    vm.daikouMsgId = 'daikouMsgId_' + uuid(32);
                }
            });
            layer.full(index);

        },
        saveOrder: function () {
            vm.order.status = 1;
            vm.order.orderCar.status = 0;
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
            vm.order.orderCar.deliveryFileLst = vm.deliveryFileLst;
            vm.order.orderCar.transferFileLst = vm.transferFileLst;
            vm.order.orderCar.orderFileLst = vm.orderFileLst;
            if(vm.order.contract.contractType == 1){
                vm.order.contract.fileLst = vm.contractFileLst;
            }
            if(vm.order.contract.contractType == 2){
                vm.order.contract.fileLst=[];
            }
            var parm = JSON.parse(JSON.stringify(vm.order));
            if (contractExclude(parm.contract)){

            }else {
                parm.contract = null;
            }
            if ((parm.orderCar.rentType == 1 || parm.orderCar.rentType == 2) && parm.plan.monthlyRent != null) {
                parm.plan.monthlyRent = toMoney(Number(parm.plan.monthlyRent) + Number(parm.plan.coverCharge||0));
            }
            if (parm.orderCar.timeDelivery){
                parm.orderCar.timeDelivery = (new Date(parm.orderCar.timeDelivery.replace(/-/g, "/"))).getTime();
            }
            if (parm.plan.overdueFineConf == 1) {
                parm.plan.gracePeriod = vm.overdueFineConf.graceDays;
                parm.plan.overdueFineRatio = vm.overdueFineConf.lateRatio;
            }
            parm.plan.billLst = vm.billLst;
            parm.plan.channelRebateBillList = vm.channelRebateBillList;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + "order/order/save",
                contentType: "application/json",
                data: JSON.stringify(parm),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        saveOrUpdate: function () {
            if (vm.order.tsStatus == 2) {
                alert('当前订单未经过客户确认，请先保存，待客户确认后再提交。');
                return;
            }
            if (vm.order.repaymentMethod == 4 && (vm.order.contract.templateId == null || vm.order.contract.templateId == '')){
                alert('请选择合同模板');
                return;
            }
            if ((vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7 || vm.order.orderCar.rentType == 8) && (vm.order.orderCar.paymentMethod == null || vm.order.orderCar.paymentMethod === '')) {
                alert('请选择付款方式');
                return;
            }
            if (vm.order.orderCar.rentType != 6 && (vm.order.orderCar.tenancyType == null || vm.order.orderCar.tenancyType === '')) {
                alert('请选择租期类型');
                return;
            }
            if (vm.order.plan.modelId == null || vm.order.plan.modelId === '') {
                alert('请选择车型');
                return;
            }
            switch (parseInt(vm.order.orderCar.rentType)) {
                case 3://展示车
                case 4://试驾车
                case 1:{//经租
                    if (vm.order.plan.cashDeposit == null || vm.order.plan.cashDeposit === '') {
                        alert('请输入保证金');
                        return;
                    }
                    break;
                }
                case 2:{//以租代购
                    if (vm.order.plan.servicingFee == null || vm.order.plan.servicingFee === '') {
                        alert('请输入整备费');
                        return;
                    }
                    break;
                }
                case 5:{//融租
                    if (vm.order.plan.downPayment == null || vm.order.plan.downPayment === '') {
                        alert('请输入首付款');
                        return;
                    }
                    break;
                }
                case 6:{//直购
                    if (vm.order.plan.totalPrice == null || vm.order.plan.totalPrice === '') {
                        alert('请输入车辆总单价');
                        return;
                    }
                    break;
                }
                case 8:{//直购
                    if (vm.order.plan.targetAmount == null || vm.order.plan.targetAmount === '') {
                        alert('请输入达标额');
                        return;
                    }
                    if (vm.order.plan.yesTargetAmount == null || vm.order.plan.yesTargetAmount === '') {
                        alert('请输入达标使用费');
                        return;
                    }
                    if (vm.order.plan.noTargetAmount == null || vm.order.plan.noTargetAmount === '') {
                        alert('请输入不达标使用费');
                        return;
                    }
                    break;
                }
            }
            if (vm.order.orderCar.rentType < 6 && (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent === '')) {
                alert('请输入月租金');
                return;
            }
            if (vm.order.orderCar.rentType == 7 && (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent === '')) {
                alert('请输入挂靠费');
                return;
            }
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
            if (vm.confirmationStatus != 2) {
                alert("请核对确认账单计划后再提交订单。");
                return;
            }
            // if (vm.order.orderCar.rentType != 8 && vm.confirmationStatus != 2) {
            //     alert("请核对确认账单计划后再提交订单。");
            //     return;
            // }
            if (vm.confirmationChlRebateStatus != 2 && vm.channelRebateBillList.length > 0) {
            // if (vm.order.orderCar.rentType == 8 && vm.confirmationChlRebateStatus != 2 && vm.channelRebateBillList.length > 0) {
                alert("请核对确认渠道返利账单计划后再提交订单。");
                return;
            }
            PageLoading();
            if (vm.order.orderCar.rentType != 6 && vm.order.orderCar.rentType != 5 && parseInt(vm.order.orderCar.paymentMethod) != 5 && vm.order.orderCar.tenancyType == 1){
                $.ajaxSettings.async = false;
                var verificationTime = null;
                $.get(baseURL + 'order/ordercar/verificationTime?startTime='+vm.order.orderCar.timeStartRent+'&endTime='+vm.order.orderCar.timeFinishRent+'&paymentMethod='+vm.order.orderCar.paymentMethod, function (r) {
                    verificationTime = r;
                });
                $.ajaxSettings.async = true;
                if (verificationTime == null || parseInt(verificationTime.code) !== 0){
                    RemoveLoading();
                    alert(verificationTime.msg);
                    return;
                }
            }
            vm.order.status = 2;
            vm.order.orderCar.status = 1;
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
            vm.order.orderCar.deliveryFileLst = vm.deliveryFileLst;
            vm.order.orderCar.transferFileLst = vm.transferFileLst;
            vm.order.orderCar.orderFileLst = vm.orderFileLst;
            if(vm.order.contract.contractType == 1){
                vm.order.contract.fileLst = vm.contractFileLst;
            }
            if(vm.order.contract.contractType == 2){
                vm.order.contract.fileLst=[];
            }
            if (vm.order.orderCar.rentType == 5) {
                vm.order.plan.paymentMethod = 1;
                vm.order.orderCar.paymentMethod = 1;
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
                $.ajaxSettings.async = false;
                var agreementNo = null;
                $.get(baseURL + 'alipay/alipaysign/getCustomerAgreementNo/'+parm.customerId, function (r) {
                    agreementNo = r;
                });
                $.ajaxSettings.async = true;
                if (agreementNo == null || agreementNo.length < 1){
                    if (vm.overdueFineConf.autoPayModeEnable == 1) {
                        parm.repaymentMethod = 5;
                    } else {
                        RemoveLoading();
                        alert("支付宝代扣模式下，客户必须签约代扣才可以提交");
                        return;
                    }
                }
            }
            if (parm.repaymentMethod == 4){
                parm.plan.automaticBillingSequence = parm.plan.automaticBillingSequence|1;
            }
            if (parm.repaymentMethod == 3){
                parm.plan.automaticBillingSequence = parm.plan.automaticBillingSequence|2;
            }
            parm.plan.billLst = vm.billLst;
            parm.plan.channelRebateBillList = vm.channelRebateBillList;
            parm.orderCar.paymentMethod^=0;
            $.ajax({
                type: "POST",
                url: baseURL + "order/order/save",
                contentType: "application/json",
                data: JSON.stringify(parm),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        addNewCustomer: function () {
            var index = layer.open({
                title: "新增客户",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/order/selectcustomernew.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        reloadSelect: function (data) {
            if (data != null){
                vm.customerList.push(data);
                vm.customerId = 'customerId_' + uuid(16);
                $('dd.select-option-float-btn').before('<dd lay-value="' + data.id + '" class="select-this">' + data.customerName + '</dd>');
                $('select[name="customer"]').parent().find('>div>div>input').val(data.customerName);
            }
            $('select[name="customer"]:first').parent().find('>div').removeClass('layui-form-selected');
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
        delTransferFile: function (id) {
            for(var i = 0 ;i<vm.transferFileLst.length;i++) {
                if(vm.transferFileLst[i].id === id) {
                    vm.transferFileLst.splice(i,1);
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
        resetCarLst: function (type) {
            if (type == null){
                vm.order.plan.brandId = null;
                vm.order.plan.brandName = null;
                vm.order.plan.seriesId = null;
                vm.order.plan.seriesName = null;
                vm.order.plan.modelId = null;
                vm.order.plan.modelName = null;
                vm.order.orderCar.brandId = null;
                vm.order.orderCar.brandName = null;
                vm.order.orderCar.seriesId = null;
                vm.order.orderCar.seriesName = null;
                vm.order.orderCar.modelId = null;
                vm.order.orderCar.modelName = null;
            }
            vm.order.plan.downPayment = null;
            vm.order.plan.balancePayment = null;
            vm.order.plan.cashDeposit = null;
            vm.order.plan.monthlyRent = null;
            vm.order.plan.coverCharge = null;
            vm.order.plan.financeCompanyName = null;
            vm.order.plan.chlRebate = null;
            vm.order.plan.hasFreeDays = 0;
            vm.order.plan.freeDays = null;
            vm.order.plan.desc = null;
            vm.order.plan.servicingFee = null;
            vm.order.plan.totalPrice = null;
            layui.form.render('select');
            vm.reloadPlan();
        },
        selectCarModel: function () {
            var index = layer.open({
                title: "选择车辆品牌/车系/车型",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/order/selectcarmodel.html",
                end: function () {
                    layer.close(index);
                }
            });
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
                } else if (field.endsWith('Periods')) {//分期数
                    vm.order.plan[field] = parseInt(value);
                } else if (field === 'targetAmount') {//达标额/元/天
                    vm.order.plan.targetAmount = Number(value).toFixed(2);
                } else if (field === 'yesTargetAmount') {//达标使用费/元/台
                    vm.order.plan.yesTargetAmount = Number(value).toFixed(2);
                } else if (field === 'noTargetAmount') {//不达标使用费/元/台
                    vm.order.plan.noTargetAmount = Number(value).toFixed(2);
                } else {
                    vm.order.plan[field] = value;
                }
                // if (vm.order.orderCar.rentType != 8)
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
                //if (vm.order.orderCar.rentType == 8)
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
            //vm.contractFileLst=[];
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
            var index = layer.open({
                title: "编辑模板",
                type: 2,
                area: ['90%', '90%'],
                boxParams: {
                    templateBody:vm.order.contract.templateBody,
                    callback: function (body) {
                        vm.order.contract.templateBody = body;
                        layer.close(index);
                    }
                },
                content: tabBaseURL + "modules/contract/edittemplatebody.html",
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
                case 'regen':{
                    content = '点击后，账单付款计划将恢复为修改前的初始状态';
                    break;
                }
                case 'paymentDayType':{
                    content = '逾期期限按全局配置计算';
                    break;
                }
                case 'contract':{
                    content = isOpenSgin(order_alipay_daikou_sign,order_default_sign,vm.order)?'当前设置支持电子签，生成合同后会发起电子签章':'当前设置不支持电子签';
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
    initTable(vm.order.orderCar.rentType, layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initUpload(upload) {
    uploadContract = Upload({
        elid: 'contractFileLst',
        edit: true,
        fileLst: vm.contractFileLst,
        param: {'path':'contract'},
        fidedesc: '订单合同附件'
    });
    uploadContract.initView();

    Upload({
        elid: 'orderFileLst',
        edit: true,
        fileLst: vm.orderFileLst,
        param: {'path':'order-order'},
        fidedesc: '订单附件'
    }).initView();

    Upload({
        elid: 'deliveryFileLst',
        edit: true,
        fileLst: vm.deliveryFileLst,
        param: {'path':'order-delivery'},
        fidedesc: '交车附件'
    }).initView();

    Upload({
        elid: 'transferFileLst',
        edit: true,
        fileLst: vm.transferFileLst,
        param: {'path':'order-transfer'},
        fidedesc: '过户附件'
    }).initView();
}

function initData() {

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
    vm.daikouMsgId = 'daikouMsgId_' + uuid(32);
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
    form.verify({
        validate_customerId: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择客户";
                }
            }
        },
        validate_lessorId: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择"+vm.lessor_title;
                }
            }
        },
        validate_paymentMethod: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && (vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7)) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择付款方式";
                }
            }
        },
        validate_tenancyType: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.orderCar.rentType != 6) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择租期类型";
                }
            }
        },
        validate_timeStartRent: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.orderCar.rentType != 6) {
                if (vm.order.orderCar.tenancyType == null || vm.order.orderCar.tenancyType === '') {
                    vm.verify = false;
                    return "请先选择租期类型";
                } else if (parseInt(vm.order.orderCar.tenancyType) === 1){
                    if (value == null || value === '') {
                        vm.verify = false;
                        return "请选择租赁开始时间";
                    }
                }
            }
        },
        validate_timeFinishRent: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.orderCar.rentType != 6) {
                if (vm.order.orderCar.tenancyType == null || vm.order.orderCar.tenancyType === '') {
                    vm.verify = false;
                    return "请先选择租期类型";
                } else if (parseInt(vm.order.orderCar.tenancyType) === 1){
                    if (value == null || value === '') {
                        vm.verify = false;
                        return "请选择租赁结束时间";
                    }
                }
            }
        },
        validate_tenancy: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.orderCar.rentType != 6) {
                if (vm.order.orderCar.tenancyType == null || vm.order.orderCar.tenancyType === '') {
                    return "请先选择租期类型";
                }else if (parseInt(vm.order.orderCar.tenancyType) === 2){
                    if (value == null || value === '') {
                        vm.verify = false;
                        return "请输入租赁租期";
                    }
                    if(value != null && value!="" ){
                        var regNumber = /^\+?[1-9][0-9]*$/;
                        if(regNumber.test(value) == false){
                            return "租期必须为大于0的整数";
                        }
                    }

                    if (vm.order.orderCar.paymentMethod != null && vm.order.orderCar.paymentMethod !== ''){
                        switch (parseInt(vm.order.orderCar.paymentMethod)) {
                            case 1:{
                                if (value < 1){
                                    vm.verify = false;
                                    return "租期必须大于或等于付款租期";
                                }
                                break;
                            }
                            case 2:{
                                if (value < 2){
                                    vm.verify = false;
                                    return "租期必须大于或等于付款租期";
                                }
                                break;
                            }
                            case 3:{
                                if (value < 3){
                                    vm.verify = false;
                                    return "租期必须大于或等于付款租期";
                                }
                                break;
                            }
                            case 6:{
                                if (value < 6){
                                    vm.verify = false;
                                    return "租期必须大于或等于付款租期";
                                }
                                break;
                            }
                            case 4:{
                                if (value < 12){
                                    vm.verify = false;
                                    return "租期必须大于或等于付款租期";
                                }
                                break;
                            }
                        }
                    }
                }
            }
        },
        validate_paymentDay: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if ((vm.order.orderCar.rentType != 5 && vm.order.orderCar.rentType != 6) && vm.order.orderCar.paymentDayType == 2 && (value == null || value === '')) {
                    vm.verify = false;
                    return "请选择还款日";
                }
            }
        },
        validate_carId: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择车辆";
                }
            }
        },
        validate_timeDelivery: function () { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (vm.order.orderCar.timeDelivery == null || vm.order.orderCar.timeDelivery === '') {
                    vm.verify = false;
                    return "请选择交车时间";
                }
                // else if (parseInt(vm.order.orderCar.tenancyType) === 1
                //     && vm.order.orderCar.timeStartRent != null && vm.order.orderCar.timeStartRent !== ''
                //     && vm.order.orderCar.timeFinishRent != null && vm.order.orderCar.timeFinishRent !== ''
                // ){
                //     var startDate = Date.parse(vm.order.orderCar.timeStartRent);
                //     var endDate = Date.parse(vm.order.orderCar.timeFinishRent);
                //     var deliveryDate = Date.parse(vm.order.orderCar.timeDelivery);
                //     if (deliveryDate < startDate || deliveryDate > endDate){
                //         vm.verify = false;
                //         return "交车时间必须在租期内";
                //     }
                // }
            }
        },
        validate_estimatedTransferTime: function (value) {
            if(vm.verify && vm.order.orderCar.rentType == 6){
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择预计过户时间";
                }
            }
        },
        validate_timeRepayment: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.orderCar.rentType == 6) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择还款时间";
                }
            }
        },
        validate_deliveryOperationId: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择交车工作人员";
                }
            }
        },
        validate_firstRent: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.plan.rentGenerationMethod == 4) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请输入首期租金";
                }
            }
        },
        validate_gracePeriod: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.plan.overdueFineConf == 2) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请输入宽限天数";
                }
            }
        },
        validate_overdueFineRatio: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify && vm.order.plan.overdueFineConf == 2) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请输入滞纳比例";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('switch(switchTest)', function(data){
        if(data.elem.checked){
            Vue.set(vm.box, "box1", true);
        }else{
            Vue.set(vm.box, "box1", false);
        }
        console.log(this.box1)
    });

    form.on('submit(submit)', function () {
        vm.saveOrUpdate();
        return false
    });

    form.on('submit(addNewCustomer)', function () {
        vm.addNewCustomer();
        return false;
    });

    form.on('select(lessor)', function (data) {
        vm.order.lessorId = data.value;
        var obj = vm.deptList.filter(function (obj) {
            return obj.deptId == data.value;
        })[0];
        if (obj != null){
            Vue.set(vm.order, "lessorName", obj.name);
            generateOrderbillView();
        }else {
            Vue.set(vm.order, "lessorName", '');
        }
    });

    form.on('select(customer)', function (data) {
        var key = data.value;
        vm.order.customerId = key;
        var obj = vm.customerList.filter(function (obj) {
            return obj.id == key;
        })[0];
        if (obj != null){
            Vue.set(vm.order, "customerType", obj.customerType);
            Vue.set(vm.order, "customerName", obj.customerName);
            Vue.set(vm.order, "customerAddr", obj.address);
            Vue.set(vm.order, "customerTel", obj.contactMobile);
            Vue.set(vm.order, "contactPerson", obj.contactPerson);
            Vue.set(vm.order, "hasBank", obj.hasBank);
        }else {
            Vue.set(vm.order, "customerType", '');
            Vue.set(vm.order, "customerName", '');
            Vue.set(vm.order, "customerAddr", '');
            Vue.set(vm.order, "customerTel", '');
            Vue.set(vm.order, "contactPerson", '');
            Vue.set(vm.order, "hasBank", true);
        }
        // if ((vm.order.orderWay^0>>1) === 0){
        //     vm.order.repaymentMethod = '2';
        // }
        vm.daikouMsgId = 'daikouMsgId_' + uuid(32);
        $.get(baseURL + "order/order/customerList", function (r) {
            vm.customerList = r.customerList;
        });
    });

    form.on('select(feeItem)', function (data) {
        vm.feeItemId = data.value;
    });

    form.on('select(billFeeItem)', function (data) {
        vm.billFeeItem = data.value;
    });

    form.on('select(operatorSelect)', function (data) {
        vm.order.orderCar.operatorId = data.value;
        vm.order.orderCar.operator = data.elem[data.elem.selectedIndex].text;
    });

    form.on('radio(paymentMethod)', function (data) {
        vm.order.orderCar.paymentMethod = data.value;
        generateOrderbillView();
    });

    form.on('radio(contractType)', function (data) {
        if (vm.order.contract.contractType != data.value){
            vm.resetContract();
        }
        vm.order.contract.contractType = data.value;
        vm.contractModelId = 'contractModelId_' + uuid(6);
    });

    form.on('radio(repaymentMethod)', function (data) {
        vm.order.repaymentMethod = data.value;
    });

    form.on('radio(paymentDayType)', function (data) {
        vm.order.orderCar.paymentDayType = data.value;
    });

    form.on('radio(hasBalancePayment)', function (data) {
        vm.order.plan.hasBalancePayment = data.value;
        if (data.value == 1){
            $('#balancePaymentPlan').show();
        } else {
            $('#balancePaymentPlan').hide();
        }
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
            uploadContract.updateFile(obj.fileLst);
            if (vm.order.contract.timeSigned == null || vm.order.contract.timeSigned == ''){
                vm.order.contract.timeSigned = vm.order.contract.timeStart;
            }
        }
    });

    form.on('radio(tenancyType)', function (data) {
        vm.order.orderCar.tenancyType = data.value;
        if (vm.order.orderCar.tenancyType == 1){
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
        } else {
            timeDelivery.config.min = {
                year: 1900,
                month: 0,
                date: 1,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            timeDelivery.config.max = {
                year: 2099,
                month: 11,
                date: 31,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        generateOrderbillView();
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

    form.on('select(balancePaymentMethod)',function (data) {
        var serializeId = data.elem.attributes.sid.value;
        vm.order.plan.balancePaymentLst.forEach(function (value) {
            if (value.serializeId == serializeId) {
                value.paymentMethod = data.value;
            }
        });
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
        vm.rentGenerationMethodId = 'rentGenerationMethod_id_0' + uuid(32);
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

    $("#submit").on('click', function () {
        vm.verify = true;
    });

    $("#save").on('click', function () {
        vm.saveOrder();
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
    if (rentType == null || rentType === '') {
        $('#carBox').hide();
        vm.resetCarLst();
    }else {
        initializeTable(rentType, table)
    }
    initTableEvent(table);
    initTableEditListner(table);
}

function initializeTable(rentType, table) {
    var cols = [{field:'model', title: '*品牌/车系/车型', width:160, event: 'selectCarModel', templet: function (d) {
            var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
            if (txt == null || txt === '') {txt = '请选择';}
            return txt;
        }}];
    switch (parseInt(rentType)) {
        case 3://展示车
        case 4://试驾车
        case 1:{//经租
            cols.push({field:'cashDeposit', title: '*保证金/元/台',  edit: 'text', event: 'cashDeposit'});
            cols.push({field:'cashDepositPeriods', title: '*保证金分期',  edit: 'text', event: 'cashDepositPeriods'});
            cols.push({field:'monthlyRent', title: '*租金/元/台',  edit: 'text', event: 'monthlyRent'});
            cols.push({field:'coverCharge', title: '服务费', edit: 'text', event: 'coverCharge'});
            cols.push({field:'chlRebate', title: '渠道返利',  edit: 'text', event: 'chlRebate'});
            cols.push({field:'chlRebatePeriods', title: '返利分期',  edit: 'text', event: 'chlRebatePeriods'});
            cols.push({field:'hasFreeDays', title: '免费用车',  templet: '#selectHasFreeDays'});
            cols.push({field:'hasFreeDays', title: '免费类型',  templet: '#selectHasFreeDaysType'});
            cols.push({field:'freeDays', title: '免费天数', edit: 'text', event: 'freeDays'});
            break;
        }
        case 2:{//以租代购
            cols.push({field:'servicingFee', title: '*整备费/元/台', minWidth:200, edit: 'text', event: 'servicingFee'});
            cols.push({field:'servicingFeePeriods', title: '*整备费分期', minWidth:200, edit: 'text', event: 'servicingFeePeriods'});
            cols.push({field:'monthlyRent', title: '*租金/元/台', minWidth:200, edit: 'text', event: 'monthlyRent'});
            cols.push({field:'coverCharge', title: '服务费', minWidth:200, edit: 'text', event: 'coverCharge'});
            cols.push({field:'balancePayment', title: '尾款/元/台', minWidth:200, edit: 'text', event: 'balancePayment'});
            cols.push({field:'balancePaymentPeriods', title: '尾款分期', minWidth:200, edit: 'text', event: 'balancePaymentPeriods'});
            cols.push({field:'chlRebate', title: '渠道返利', minWidth:200, edit: 'text', event: 'chlRebate'});
            cols.push({field:'chlRebatePeriods', title: '返利分期',  edit: 'text', event: 'chlRebatePeriods'});
            break;
        }
        case 5:{//融租
            cols.push({field:'downPayment', title: '*首付款/元/台', minWidth:200, edit: 'text', event: 'downPayment'});
            cols.push({field:'downPaymentPeriods', title: '*首付款分期', minWidth:200, edit: 'text', event: 'downPaymentPeriods'});
            cols.push({field:'monthlyRent', title: '*租金/元/台', minWidth:200, edit: 'text', event: 'monthlyRent'});
            cols.push({field:'balancePayment', title: '尾款/元/台', minWidth:200, edit: 'text', event: 'balancePayment'});
            cols.push({field:'balancePaymentPeriods', title: '尾款分期', minWidth:200, edit: 'text', event: 'balancePaymentPeriods'});
            cols.push({field:'financeCompanyName', title: '金融公司名称', minWidth:200, edit: 'text', event: 'financeCompanyName'});
            cols.push({field:'chlRebate', title: '渠道返利', minWidth:200, edit: 'text', event: 'chlRebate'});
            cols.push({field:'chlRebatePeriods', title: '返利分期',  edit: 'text', event: 'chlRebatePeriods'});
            break;
        }
        case 6:{//直购
            cols.push({field:'totalPrice', title: '*车辆总单价/元/台', minWidth:200, edit: 'text', event: 'totalPrice'});
            cols.push({field:'chlRebate', title: '渠道返利', minWidth:200, edit: 'text', event: 'chlRebate'});
            cols.push({field:'chlRebatePeriods', title: '返利分期',  edit: 'text', event: 'chlRebatePeriods'});
            break;
        }
        case 7:{//挂靠
            cols.push({field:'monthlyRent', title: '*挂靠费/元/台', minWidth:200, edit: 'text', event: 'monthlyRent'});
            break;
        }
        case 8:{//直营
            cols.push({field:'cashDeposit', width: 100, title: '*保证金/元/台',  edit: 'text', event: 'cashDeposit'});
            cols.push({field:'cashDepositPeriods', width: 100, title: '*保证金分期',  edit: 'text', event: 'cashDepositPeriods'});
            cols.push({field:'targetAmount', width: 100, title: '*达标额/元/天', edit: 'text', event: 'targetAmount'});
            cols.push({field:'yesTargetAmount', width: 150, title: '*达标使用费/元/台', edit: 'text', event: 'yesTargetAmount'});
            cols.push({field:'noTargetAmount', width: 150, title: '*不达标使用费/元/台', edit: 'text', event: 'noTargetAmount'});
            cols.push({field:'coverCharge', width: 70,  title: '服务费', edit: 'text', event: 'coverCharge'});
            cols.push({field:'chlRebate', width: 80, title: '渠道返利',  edit: 'text', event: 'chlRebate'});
            cols.push({field:'chlRebatePeriods', width: 80, title: '返利分期',  edit: 'text', event: 'chlRebatePeriods'});
            cols.push({field:'hasFreeDays', width: 80, title: '免费用车',  templet: '#selectHasFreeDays'});
            cols.push({field:'hasFreeDays', title: '免费类型',  templet: '#selectHasFreeDaysType'});
            cols.push({field:'freeDays', width: 80, title: '免费天数', edit: 'text', event: 'freeDays'});
            break;
        }
    }
    cols.push({title: '操作', width: 70,  templet: '#barTpl'});
    table.render({
        id: "carLstid",
        elem: '#carLst',
        data: [vm.order.plan],
        cols: [cols],
        // width: cols.length*200,
        // page: false,limit: 500,
        done: function (res, curr, count) {
            $('#hasFreeDaysType').val(vm.order.plan.hasFreeDays);
            layui.form.render('select');
        }
    });
    $('#carBox').show();
    // if (rentType == 2 || rentType == 5){
    //     table.render({
    //         id: 'balancePaymentLstid',
    //         elem: '#balancePaymentLst',
    //         data: vm.order.plan.balancePaymentLst,
    //         cols: [[
    //             {field:'money', title: '尾款金额/元', edit: 'text', event: 'money'},
    //             {field:'paymentMethod', title: '尾款付款方式', templet: '#selectPaymentMethod'},
    //             {field:'timePayment1st', title: '预计第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
    //                     var txt = d.timePayment1st;
    //                     if ((/\d+/).test(txt)){
    //                         txt = isEmpty(dateFormatYMD(txt));
    //                     }else txt = '请选择第一次付款日期';
    //                     return txt;
    //                 }},
    //             {title: '操作', width: 120, templet: '#balancePaymentBarTpl', fixed: "right", align: "center"}
    //         ]],
    //         page: true,
    //         limits: [5, 8, 15],
    //         limit: 5,
    //         done: function (res, curr, count) {
    //             $('td[data-field="paymentMethod"]>div>select').each(function () {
    //                 var serializeId = this.attributes.sid.value;
    //                 var data = vm.order.plan.balancePaymentLst.filter(function (value) {
    //                     return value.serializeId == serializeId;
    //                 })[0];
    //                 var value = '';
    //                 if (data != null){
    //                     value = data.paymentMethod;
    //                 }
    //                 $(this).val(value);
    //             });
    //             layui.form.render('select');
    //             $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
    //         }
    //     });
    // }

    /*if (rentType == 6){
        table.render({
            id: 'feeLstid',
            elem: '#feeLst',
            data: vm.order.plan.feeLst,
            cols: [[
                {field:'typeFieldDesc', title: '类型'},
                {field:'money', title: '金额/元', edit: 'text', event: 'money'},
                {field:'paymentMethod', title: '付款方式', templet: '#selectFeeItemPaymentMethod'},
                {field:'timePayment1st', title: '第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
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
                {field:'signTime', title: '签约时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.signTime);}},
                {field:'product', title: '签约产品', minWidth:200, align: "center",templet: function (d) {return '商户代扣';}},
                {field:'timeUnsign', title: '解约时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeUnsign);}},
                {field:'status', title: '状态', minWidth:200, align: "center",templet: function (d) {return transformTypeByMap(d.status, { 1: '发起签约', 2: '签约失败', 3: '签约成功', 4: '已解约', 91: '已取消', 0: '生成签约单' });}},
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

    // if (vm.order.orderCar.rentType == 8) {
        table.render({
            id: 'chlRebateBillLstid',
            elem: '#chlRebateBillLst',
            data: vm.channelRebateBillList,
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
                {field:'receivableDate', title: '应付日期', event: 'selectReceivableDate2', templet: function (d) {
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
    // }
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
        if (layEvent === 'reset') {
            vm.resetCarLst(1);
        }else if (layEvent === 'selectCarModel') {
            vm.selectCarModel();
        }else if (layEvent === 'financeCompanyName') {
            tableEditMaxlength('financeCompanyName', 50);
        }else if (layEvent === 'freeDays') {
            tableEditMaxlength(layEvent, 5);
            tableEditOninputNumInteger(layEvent);
        }else if (layEvent.endsWith('Periods')) {
            tableEditMaxlength(layEvent, 5);
            tableEditOninputNumIntegerRange(layEvent, 0, 99);
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
        }else if (layEvent === 'selectReceivableDate2') {
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
    var timeStartRent = laydate.render({
        elem: '#timeStartRent',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.order.orderCar.timeStartRent = value;
            var month = date.month -1;
            timeFinishRent.config.min = date;
            timeFinishRent.config.min.month = month;
            if (parseInt(vm.order.orderCar.tenancyType) === 1){
                timeDelivery.config.value = value;
                timeDelivery.config.min = date;
                timeDelivery.config.min.month = month;
                generateOrderbillView();
            }
        }
    });

    var timeFinishRent = laydate.render({
        elem: '#timeFinishRent',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.order.orderCar.timeFinishRent = value;
            var month = date.month -1;
            timeStartRent.config.max = date;
            timeStartRent.config.max.month = month;
            if (parseInt(vm.order.orderCar.tenancyType) === 1){
                timeDelivery.config.max = date;
                timeDelivery.config.max.month = month;
                generateOrderbillView();
            }
        }
    });

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

    // timeDelivery =
    laydate.render({
        elem: '#timeDelivery',
        trigger: 'click',
        type: 'datetime',
        done: function (value) {
            vm.order.orderCar.timeDelivery = value;
        }
    });

    laydate.render({
        elem: '#estimatedTransferTime',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.estimatedTransferTime = value;
        }
    });

    laydate.render({
        elem: '#transferTime',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.transferTime = value;
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
        elem: '#timeRepayment',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.timeRepayment = value;
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
    /*var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);*/
    closeCurrent();
    var index = parent.layer.getFrameIndex(window.name);
    if(index){
        parent.vm.isClose = true;
    }
}

function customerSelectAddBtn() {
    setTimeout(function(){
        var t = '请选择'+vm.leasee_title;
        var selectParent = $('input[placeholder="'+t+'"]').parent().parent().find('dl.layui-anim-upbit');
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

function validateGenerateOrderbillView(){
    if ((vm.order.lessorId == null || vm.order.lessorId == '') && (vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7 || vm.order.orderCar.rentType == 8)) {
        return '请选择出租方';
    }
    if ((vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7 || vm.order.orderCar.rentType == 8) && (vm.order.orderCar.paymentMethod == null || vm.order.orderCar.paymentMethod === '')) {
        return '请选择付款方式';
    }
    if (vm.order.orderCar.rentType < 5 || vm.order.orderCar.rentType == 7 || vm.order.orderCar.rentType == 8) {
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
            if (vm.order.plan.cashDeposit == null || vm.order.plan.cashDeposit == '') {
                return '请输入保证金';
            }
            if (isEmptyReturnNull(vm.order.plan.cashDepositPeriods) == null) {
                return '请输入保证金分期数';
            }
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
    // if (vm.order.orderCar.rentType == 8) return;
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
    if (order.orderCar.rentType == 8) {
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