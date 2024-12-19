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
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            keyword: null
        },
        carUpdateId: 'carUpdateId_1',
        settleBoxId: 'settleBoxId_0',
        deliveryFileLstId : 'deliveryFileLstId_1',
        contractModelId: 'contractModelId_0',
        rentGenerationMethodId: 'rentGenerationMethod_id_0',
        feeItemId: null,
        monthlyRentAdjust : 0,
        monthlyRent: '',
        coverCharge: '',
        order: {},
        orderOld: {},
        deliveryFileLst: [],
        feeItemLst: [],
        usrLst: [],
        accessoryItems: [],
        orderFileLst: [],
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
        var plan = param.data.plan;
        _this.orderOld = JSON.parse(JSON.stringify(order));
        _this.order = {
            lessorId: order.lessorId,
            lessorName: order.lessorName,
            customerId: order.customerId,
            customerType: order.customerType,
            customerName: order.customerName,
            customerAddr: order.customerAddr,
            customerTel: order.customerTel,
            contactPerson: order.contactPerson,
            operationId: sessionStorage.getItem("userId"),
            operationName: sessionStorage.getItem("username"),
            status: 2,
            plan: {
                rentGenerationMethod: 1,
                brandId: plan.brandId,
                brandName: plan.brandName,
                seriesId: plan.seriesId,
                seriesName: plan.seriesName,
                modelId: plan.modelId,
                modelName: plan.modelName,
                billType: plan.billType,
            },
            orderCar: {
                rentType: 1,
                tenancyType: 1,
                paymentDayType: 1,
                status: 200,
                timeDelivery: new Date().format("yyyy-MM-dd hh:mm:ss"),
                salePersonId: sessionStorage.getItem("userId"),
                salePersonName: sessionStorage.getItem("username"),
                carId: orderCar.carId,
                carNo: orderCar.carNo,
                vinNo: orderCar.vinNo,
                brandId: orderCar.brandId,
                brandName: orderCar.brandName,
                seriesId: orderCar.seriesId,
                seriesName: orderCar.seriesName,
                modelId: orderCar.modelId,
                modelName: orderCar.modelName,
                deptId: orderCar.deptId,
                deptName: orderCar.deptName,
                depotId: orderCar.depotId,
                depotName: orderCar.depotName,
                cityId: orderCar.cityId,
                cityName: orderCar.cityName,
                accessoryItemsName: orderCar.accessoryItemsName,
                accessoryItems: orderCar.accessoryItems,
                carDesc: orderCar.carDesc,
                insuranceItems: orderCar.insuranceItems,
                insuranceItemsCode: orderCar.insuranceItemsCode,
                channelId: orderCar.channelId,
                channelName: orderCar.channelName,
                delivery_operation_id: sessionStorage.getItem("userId"),
                delivery_operation_name: sessionStorage.getItem("username"),
                chainOrderCarId: orderCar.id,
            },
            settle: {
                settleOrderCarId: orderCar.id,
                refundable: {
                    wagesAmount: 0,
                    cashDepositAmount: 0,
                    flowAmount: 0,
                    deductionAmount: 0,
                    wagesIds: '',
                },
                receivable: {
                    rentAmount: 0,
                    maintenanceAmount: 0,
                    prepaidAmount: 0,
                    firstCashDepositAmount: 0,
                    firstRentAmount: 0,
                    prepaidIds: '',
                    billIds: '',
                },
                settleAmount: null
            }
        };
        $.ajaxSettings.async = false;
        $.get(baseURL + "order/order/chainSettle/"+orderCar.id, function (r) {
            _this.order.settle = r.data;
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
        $.get(baseURL + "sys/config/getConfVal/receivables_overdue_period", function (r) {
            receivables_overdue_period = r^0;
        });
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
        saveOrUpdate: function (event) {
            if (vm.confirmationStatus != 2) {
                alert("请核对确认账单计划后再提交订单。");
                return;
            }
            PageLoading();
            vm.order.contract = vm.contract;
            vm.order.contract.fileLst = vm.contractFileLst;
            vm.order.orderCar.orderFileLst = vm.orderFileLst;
            var param = JSON.parse(JSON.stringify(vm.order));
            param.plan.billLst = vm.billLst;
            param.plan.monthlyRent = toMoney(Number(param.plan.monthlyRent) + Number(param.plan.coverCharge||0));
            for (var i = 0; i < param.plan.billLst.length; i++) {
                var item = param.plan.billLst[i];
                if (item.typeFieldName === 'cash_deposit' && item.stage == 1) {
                    item.receivableDefaultStatus = 2;
                }
                if (item.typeFieldName === 'monthly_rent' && item.stage == 1) {
                    item.receivableDefaultStatus = 2;
                }
            }
            if (contractExclude(param.contract)){

            }else {
                param.contract = null;
            }
            var url = "order/order/chain2longrent";
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
                case 'firstCashDepositAmount':
                case 'firstRentAmount':{
                    content = '此处结算后将不再单独生成财务账单。';
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
                    callback: function (id, name) {
                        vm.contract.templateId = id;
                        vm.contract.templateName = name;
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
            }
            vm.reloadPlan();
        },
        reloadPlan: function () {
            if ($('div[lay-id="carLstid"]').length > 0){
                layui.table.reload('carLstid', {data: [vm.order.plan]});
            }
        },
        resetCarLst: function () {
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
        elid: 'orderFileLst',
        edit: true,
        fileLst: vm.orderFileLst,
        param: {'path':'order-order'},
        fidedesc: '转租附件'
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
    statisticsSettleAmount();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_timeStartRent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择开始时间";
            }
        },
        validate_timeFinishRent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择结束时间";
            }
        },
        validate_firstRent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请输入首期租金";
            }
        },
        validate_salePerson: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value == null || value == '') {
                return "请选择销售员";
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });

    form.on('radio(rentGenerationMethod)', function (data) {
        vm.order.plan.rentGenerationMethod = data.value;
        vm.rentGenerationMethodId = 'rentGenerationMethod_id_0' + uuid(32);
    });

    form.on('select(salePerson)', function (data) {
        vm.order.orderCar.salePersonId = data.value;
        if(data.value != null && data.value != ''){
            vm.order.orderCar.salePersonName=data.elem[data.elem.selectedIndex].text
        }else{
            vm.order.orderCar.salePersonName='';
        }
    });

    form.on('select(billFeeItem)', function (data) {
        vm.billFeeItem = data.value;
    });

    form.on('radio(paymentMethod)', function (data) {
        vm.order.orderCar.paymentMethod = data.value;
        generateOrderbillView();
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

    // $(document).on('blur', '.coverCharge', function () {
    //     if ($(this).val()) {
    //         setTimeout(function () {
    //             generateOrderbillView();
    //         }, 10);
    //     }
    // });
}

function initTable(table, soulTable) {
    var cols = [];
    cols.push({field:'cashDeposit', title: '*保证金/元/台',  edit: 'text', event: 'cashDeposit'});
    cols.push({field:'cashDepositPeriods', title: '*保证金分期',  edit: 'text', event: 'cashDepositPeriods'});
    cols.push({field:'monthlyRent', title: '*租金/元/台',  edit: 'text', event: 'monthlyRent'});
    cols.push({field:'coverCharge', title: '服务费', edit: 'text', event: 'coverCharge'});
    cols.push({field:'chlRebate', title: '渠道返利',  edit: 'text', event: 'chlRebate'});
    cols.push({field:'hasFreeDays', title: '免费用车',  templet: '#selectHasFreeDays'});
    cols.push({field:'hasFreeDays', title: '免费类型',  templet: '#selectHasFreeDaysType'});
    cols.push({field:'freeDays', title: '免费天数', edit: 'text', event: 'freeDays'});
    cols.push({title: '操作', width: 70,  templet: '#barTpl'});
    table.render({
        id: "carLstid",
        elem: '#carLst',
        data: [vm.order.plan],
        cols: [cols],
        done: function (res, curr, count) {
            $('#hasFreeDaysType').val(vm.order.plan.hasFreeDays);
            layui.form.render('select');
        }
    });
    $('#carBox').show();

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
    table.on('edit(carLst)', function(obj){
        vm.editcarlistener(obj);
    });

    table.on('edit(billLst)', function(obj){
        vm.editbillItemlistener(obj);
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

    var timeStartRent = laydate.render({
        elem: '#timeStartRent',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.order.orderCar.timeStartRent = value;
            vm.order.orderCar.timeDelivery = value+' 00:00:00';
            var month = date.month -1;
            timeFinishRent.config.min = date;
            timeFinishRent.config.min.month = month;
            generateOrderbillView();
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
            generateOrderbillView();
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
    // order.orderCar.timeStartRent = order.orderCar.lastFinishRentTime;
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
        var firstCashDepositAmount = 0;
        var firstRentAmount = 0;
        for (var i = 0; i < bill.length; i++) {
            if (fieldNameDesc==null) {
                fieldNameDesc = bill[i].typeFieldDesc;
            }
            if (bill[i].typeFieldName === 'cash_deposit' && bill[i].stage == 1) {
                firstCashDepositAmount = bill[i].receivableAmount;
            }
            if (bill[i].typeFieldName === 'monthly_rent' && bill[i].stage == 1) {
                firstRentAmount = bill[i].receivableAmount;
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
        vm.order.settle.receivable.firstRentAmount = firstRentAmount;
        vm.order.settle.receivable.firstCashDepositAmount = firstCashDepositAmount;
    }
    vm.statisticsBillViewTxt = txt;
    statisticsSettleAmount();
}

function deductionAmountEditCallBack() {
    setTimeout(function () {
        statisticsSettleAmount();
    }, 10);
}

function statisticsSettleAmount() {
    var amount = 0;//应退为正收未负
    amount = add(amount, vm.order.settle.refundable.wagesAmount);
    amount = add(amount, vm.order.settle.refundable.cashDepositAmount);
    amount = add(amount, vm.order.settle.refundable.flowAmount);
    amount = add(amount, vm.order.settle.refundable.deductionAmount);
    //
    amount = sub(amount, vm.order.settle.receivable.rentAmount);
    amount = sub(amount, vm.order.settle.receivable.maintenanceAmount);
    amount = sub(amount, vm.order.settle.receivable.prepaidAmount);
    amount = sub(amount, vm.order.settle.receivable.firstRentAmount);
    amount = sub(amount, vm.order.settle.receivable.firstCashDepositAmount);
    vm.order.settle.settleAmount = amount;
    vm.settleBoxId = 'settleBoxId_'+uuid(32);
}