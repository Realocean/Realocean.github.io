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
var vm = new Vue({
    el: '#rrapp',
    data: {
        hetong2:false,
        q: {
            keyword: null
        },
        order: {

        },
        insuranceGroupList: [],
        deptList: [],
        orderFileLst: [],
        chlLst: [],
        usrLst: [],
        salePersonList: [],
        insuranceItems: [],
        customerId: 'customerId_',
        verify: false,
        selectDayUpdated: false,
        orderFileLstId: 'orderFileLstId_0',
        rentGenerationMethodId: 'rentGenerationMethod_id_0',
        lessor_title:'出租方',
        leasee_title:'承租方',
        overdueFineConf:{},
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
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList.filter(function (v) {
                return v.sysDeptType != 5;
            });
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
        if (_this.order.orderCar == null) {
            _this.order.orderCar = {};
        }
        if (_this.order.orderWay == null) {
            _this.order.orderWay = 1;
        }
        if (_this.order.orderCar.rentType == null || _this.order.orderCar.rentType == '') {
            _this.order.orderCar.rentType = type;
        }
        if (_this.order.orderCar.rentType == 6) {
            _this.lessor_title = '售卖方';
            _this.leasee_title = '购买方';
        }
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

        if (_this.order.lessorId == null){
            _this.order.lessorId = '';
        }
        if (_this.order.hasBank == null){
            _this.order.hasBank = false;
        }
        if (_this.order.repaymentMethod == null){
            _this.order.repaymentMethod = 4;
        }
        if (_this.order.customerId == null){
            _this.order.customerId = '';
        }
        if (_this.order.orderCar.orderFileLst != null){
            _this.orderFileLst = _this.order.orderCar.orderFileLst;
        }
        if (_this.order.plan == null){
            _this.order.plan = {};
        }else {
            if (_this.order.plan.monthlyRent != null) {
                _this.order.plan.monthlyRent = toMoney(Number(_this.order.plan.monthlyRent) - Number(_this.order.plan.coverCharge||0));
            }
        }
        if (_this.order.plan.overdueFineConf == null || _this.order.plan.overdueFineConf == ''){
            _this.order.plan.overdueFineConf = 1;
        }
        if (_this.order.plan.gracePeriod == null || _this.order.plan.gracePeriod == ''){
            _this.order.plan.gracePeriod = _this.overdueFineConf.graceDays;
        }
        if (_this.order.plan.overdueFineRatio == null || _this.order.plan.overdueFineRatio == ''){
            _this.order.plan.overdueFineRatio = _this.overdueFineConf.lateRatio;
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
            _this.order.plan.hasBalancePayment = 0;
        }
        if (_this.order.plan.balancePaymentLst == null){
            _this.order.plan.balancePaymentLst = [];
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
        if(_this.order.orderCar.tenancyType == undefined || _this.order.orderCar.tenancyType == null){
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
        if (_this.order.orderCar.timeStartRent != null && _this.order.orderCar.timeStartRent !== ''){
            _this.order.orderCar.timeStartRent = dateFormatYMD(_this.order.orderCar.timeStartRent);
        }
        if (_this.order.orderCar.timeFinishRent != null && _this.order.orderCar.timeFinishRent !== ''){
            _this.order.orderCar.timeFinishRent = dateFormatYMD(_this.order.orderCar.timeFinishRent);
        }
        if (_this.order.orderCar.timeTransferEstimated != null && _this.order.orderCar.timeTransferEstimated !== ''){
            _this.order.orderCar.timeTransferEstimated = dateFormatYMD(_this.order.orderCar.timeTransferEstimated);
        }
        _this.order.orderCar.depotCityName = jointStr('/', _this.order.orderCar.depotName, _this.order.orderCar.cityName);
        _this.order.orderCar.brandSeriesName = jointStr('/', _this.order.orderCar.brandName, _this.order.orderCar.seriesName);
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        retractChange:function(data){
           if(data ==3){
                this.hetong2 = false
            }
        },
        expandChange:function(data){
            console.log(1)
           if(data ==3){
                this.$nextTick(()=>{
                    this.hetong2 = true
                })
            }
        },
        selectCustomer:function (){
            var index = layer.open({
                title: "选择客户",
                type: 2,
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
            vm.order.orderCar.orderFileLst = vm.orderFileLst;

            var parm = JSON.parse(JSON.stringify(vm.order));
            if ((parm.orderCar.rentType == 1 || parm.orderCar.rentType == 2) && parm.plan.monthlyRent != null) {
                parm.plan.monthlyRent = toMoney(Number(parm.plan.monthlyRent) + Number(parm.plan.coverCharge||0));
            }
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + "order/order/saveAlipayOrder",
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
            if (vm.order.orderCar.paymentMethod == null || vm.order.orderCar.paymentMethod === '') {
                alert('请选择付款方式');
                return;
            }
            if (vm.order.orderCar.tenancyType == null || vm.order.orderCar.tenancyType === '') {
                alert('请选择租期类型');
                return;
            }
            if (vm.order.plan.modelId == null || vm.order.plan.modelId === '') {
                alert('请选择车型');
                return;
            }
            switch (parseInt(vm.order.orderCar.rentType)) {
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
            }
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent === '') {
                alert('请输入月租金');
                return;
            }
            if (vm.order.orderCar.rentType == 2 && vm.order.plan.hasBalancePayment == 1){
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
            }
            PageLoading();
            if (parseInt(vm.order.orderCar.paymentMethod) != 5 && vm.order.orderCar.tenancyType == 1){
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
            vm.order.status = 1;
            vm.order.tsStatus = 2;
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
            vm.order.orderCar.orderFileLst = vm.orderFileLst;

            var parm = JSON.parse(JSON.stringify(vm.order));
            if (parm.orderCar.rentType == 1 || parm.orderCar.rentType == 2) {
                parm.plan.monthlyRent = toMoney(Number(parm.plan.monthlyRent) + Number(parm.plan.coverCharge||0));
            }
            if (parm.plan.overdueFineConf == 1) {
                parm.plan.gracePeriod = vm.overdueFineConf.graceDays;
                parm.plan.overdueFineRatio = vm.overdueFineConf.lateRatio;
            }
            $.ajax({
                type: "POST",
                url: baseURL + "order/order/saveAlipayOrder",
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
            if ((!regTxt.test(field) && !regNumber.test(value))||(field === 'freeDays' && !regInt.test(value))) {
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
                } else if (field === 'financeCompanyName') {//金融公司名称
                    vm.order.plan.financeCompanyName = value;
                }
            }
            vm.reloadPlan();
        },
        reloadPlan: function () {
            if ($('div[lay-id="carLstid"]').length > 0){
                layui.table.reload('carLstid', {data: [vm.order.plan]});
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
    Upload({
        elid: 'orderFileLst',
        edit: true,
        fileLst: vm.orderFileLst,
        param: {'path':'order-order'},
        fidedesc: '订单附件'
    }).initView();
}

function initData() {
    if (vm.order.plan.hasBalancePayment == 1){
        $('#balancePaymentPlan').show();
    } else {
        $('#balancePaymentPlan').hide();
    }
    $('#overdueFineConfDefault').prop('checked', vm.order.plan.overdueFineConf == 1);
    $('#overdueFineConfCustom').prop('checked', vm.order.plan.overdueFineConf == 2);
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
            if (vm.verify) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择付款方式";
                }
            }
        },
        validate_tenancyType: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value === '') {
                    vm.verify = false;
                    return "请选择租期类型";
                }
            }
        },
        validate_timeStartRent: function (value) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
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
            if (vm.verify) {
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
            if (vm.verify) {
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
                if (vm.order.orderCar.paymentDayType == 2 && (value == null || value === '')) {
                    vm.verify = false;
                    return "请选择付款日";
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
    form.on('submit(submit)', function () {
        vm.saveOrUpdate();
        return false
    });

    form.on('select(lessor)', function (data) {
        vm.order.lessorId = data.value;
        var obj = vm.deptList.filter(function (obj) {
            return obj.deptId == data.value;
        })[0];
        if (obj != null){
            Vue.set(vm.order, "lessorName", obj.name);
        }else {
            Vue.set(vm.order, "lessorName", '');
        }
    });

    form.on('radio(paymentMethod)', function (data) {
        vm.order.orderCar.paymentMethod = data.value;
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

    form.on('radio(tenancyType)', function (data) {
        vm.order.orderCar.tenancyType = data.value;
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
    var cols = [{field:'model', align: "center", title: '*品牌/车系/车型', minWidth:180, event: 'selectCarModel', templet: function (d) {
            var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
            if (txt == null || txt === '') {txt = '请选择品牌/车系/车型';}
            return txt;
        }}];
    switch (parseInt(rentType)) {
        case 1:{//经租
            cols.push({field:'cashDeposit', align: "center", title: '*保证金/元/台', minWidth:100, edit: 'text', event: 'cashDeposit'});
            cols.push({field:'monthlyRent', align: "center", title: '*租金/元/台', minWidth:80, edit: 'text', event: 'monthlyRent'});
            cols.push({field:'coverCharge', align: "center", title: '服务费', minWidth:50, edit: 'text', event: 'coverCharge'});
            cols.push({field:'chlRebate', align: "center", title: '渠道返利', minWidth:50, edit: 'text', event: 'chlRebate'});
            cols.push({field:'hasFreeDays', align: "center", title: '免费用车天数', minWidth:80, templet: '#selectHasFreeDays'});
            cols.push({field:'hasFreeDays', align: "center", title: '免费用车天数类型', minWidth:160, templet: '#selectHasFreeDaysType'});
            cols.push({field:'freeDays', align: "center", title: '免费用车时间/天数/台', minWidth:160, edit: 'text', event: 'freeDays'});
            break;
        }
        case 2:{//以租代购
            cols.push({field:'servicingFee', align: "center", title: '*整备费/元/台', minWidth:200, edit: 'text', event: 'servicingFee'});
            cols.push({field:'monthlyRent', align: "center", title: '*租金/元/台', minWidth:200, edit: 'text', event: 'monthlyRent'});
            cols.push({field:'coverCharge', align: "center", title: '服务费', minWidth:200, edit: 'text', event: 'coverCharge'});
            cols.push({field:'chlRebate', align: "center", title: '渠道返利', minWidth:200, edit: 'text', event: 'chlRebate'});
            break;
        }
    }
    cols.push({title: '操作', width: 100, templet: '#barTpl', align: "center"});
    table.render({
        id: "carLstid",
        elem: '#carLst',
        data: [vm.order.plan],
        cols: [cols],
        // width: cols.length*200,
        // cellMinWidth: 200,
        page: false,limit: 500,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            $('#hasFreeDaysType').val(vm.order.plan.hasFreeDays);
            layui.form.render('select');
        }
    });
    $('#carBox').show();
    if (rentType == 2){
        table.render({
            id: 'balancePaymentLstid',
            elem: '#balancePaymentLst',
            data: vm.order.plan.balancePaymentLst,
            cols: [[
                {field:'money', title: '尾款金额/元', edit: 'text', event: 'money'},
                {field:'paymentMethod', title: '尾款付款方式', templet: '#selectPaymentMethod'},
                {field:'timePayment1st', title: '预计第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
                        var txt = d.timePayment1st;
                        if ((/\d+/).test(txt)){
                            txt = isEmpty(dateFormatYMD(txt));
                        }else txt = '请选择第一次付款日期';
                        return txt;
                    }},
                {title: '操作', width: 120, templet: '#balancePaymentBarTpl', fixed: "right", align: "center"}
            ]],
            page: true,
            limits: [5, 8, 15],
            limit: 5,
            done: function (res, curr, count) {
                $('td[data-field="paymentMethod"]>div>select').each(function () {
                    var serializeId = this.attributes.sid.value;
                    var data = vm.order.plan.balancePaymentLst.filter(function (value) {
                        return value.serializeId == serializeId;
                    })[0];
                    var value = '';
                    if (data != null){
                        value = data.paymentMethod;
                    }
                    $(this).val(value);
                });
                layui.form.render('select');
                $('td[data-field="timePayment1st"]').prepend('<div style="position: absolute;line-height: 0;background-color: rgba(0, 0, 0, 0);text-indent: -99999px;width: 100%;height: 100%;z-index: 999999"></div>');
            }
        });
    }
    if (vm.order.tsStatue == 0 || vm.order.tsStatue == 2) {
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
            ]],
            page: true,
            loading: true,
            limits: [5, 10, 20, 50],
            limit: 5,
            autoColumnWidth: {
                init: false
            },
            done: function(res, curr, count){
                soulTable.render(this);
            }
        });
    }
}

function initTableEditListner(table) {
    table.on('edit(carLst)', function(obj){
        vm.editcarlistener(obj);
    });

    table.on('edit(balancePaymentLst)', function(obj){
        vm.editbalancePaymentlistener(obj);
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
            tableEditMaxlength('freeDays', 5);
            tableEditOninputNumInteger('freeDays');
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

    laydate.render({
        elem: '#timeTransferEstimated',
        trigger: 'click',
        done: function (value) {
            vm.order.orderCar.timeTransferEstimated = value;
        }
    });
}

function closePage() {
    closeCurrent();
    var index = parent.layer.getFrameIndex(window.name);
    if(index){
        parent.vm.isClose = true;
    }
}