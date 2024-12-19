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
var billLstBuk;
var receivables_overdue_period = 0;
var vm = new Vue({
    el:'#rrapp',
    data:{
        oldOrderCar:{},
        newOrderCar:{},
        order:{},
        order1:{},
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
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        var id = param.id;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/config/getConfVal/receivables_overdue_period", function (r) {
            receivables_overdue_period = r^0;
        });
        $.get(baseURL + "order/order/info/" + id, function (r) {
            _this.order = JSON.parse(JSON.stringify(r.order));
            _this.order1 = JSON.parse(JSON.stringify(r.order));
            _this.oldOrderCar = {
                id: r.order.orderCar.id,
                code:r.order.orderCar.code,
                carNo:r.order.orderCar.carNo,
                timeStartRent:r.order.orderCar.timeStartRent,
                timeFinishRent:r.order.orderCar.timeFinishRent,
                freeDays:r.order.plan.freeDays||0,
                hasFreeDays:r.order.plan.hasFreeDays||0,
                paymentDay:r.order.orderCar.paymentDay,
                deposit:new Number(r.order.plan.downPayment||0) + new Number(r.order.plan.cashDeposit||0) + new Number(r.order.plan.servicingFee||0),
                averageRental:new Number(r.order.plan.monthlyRent||0) - new Number(r.order.plan.coverCharge||0),
                coverCharge:r.order.plan.coverCharge||0,
                paymentMethodStr:r.order.orderCar.paymentMethodStr,
                rentType:r.order.orderCar.rentType,
                rentGenerationMethod:r.order.plan.rentGenerationMethod^0,
            }
            _this.newOrderCar = {
                id: r.order.orderCar.id,
                createReceive:2,
                hasReceive:2,
                rentType:r.order.orderCar.rentType,
                rentGenerationMethod:r.order.plan.rentGenerationMethod^0,
                hasFreeDays:r.order.plan.hasFreeDays||0,
                freeDays:r.order.plan.freeDays||0,
            }
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
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
        saveOrUpdate: function () {
            //若未填入任何数据，不进行提交
            if((vm.newOrderCar.timeStartRent == null || vm.newOrderCar.timeStartRent == '') &&
                (vm.newOrderCar.timeFinishRent == null || vm.newOrderCar.timeFinishRent == '') &&
                (vm.newOrderCar.freeDays == null || vm.newOrderCar.freeDays == '') &&
                (vm.newOrderCar.paymentDay == null || vm.newOrderCar.paymentDay == '') &&
                (vm.newOrderCar.deposit == null || vm.newOrderCar.deposit == '') &&
                (vm.newOrderCar.depositPeriods == null || vm.newOrderCar.depositPeriods == '') &&
                (vm.newOrderCar.averageRental == null || vm.newOrderCar.averageRental == '') &&
                (vm.newOrderCar.coverCharge == null || vm.newOrderCar.coverCharge == '') &&
                (vm.newOrderCar.paymentMethod == null || vm.newOrderCar.paymentMethod == '')
            ){
                alert('未填写修改订单信息');
                return false;
            }
            if (vm.confirmationStatus != 2) {
                alert("请核对确认账单计划后再提交订单。");
                return;
            }
            vm.newOrderCar.billLst = vm.billLst;
            layer.confirm("因修改业务信息，已有的账单会被删除，重新生成新的账单，是否确定？",function(){
                vm.commonSave();
            });

        },
        commonSave:function(){
            var url = "order/ordercar/newUpdate";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.newOrderCar),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
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

}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        moneyVerify:function(value){
            if(value != null && value != ''){
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(reg.test(value) == false){
                    return "输入值不是正确金额";
                }
            }
        },
        daysVerify:function(value) {
            if (value != null && value != '') {
                var regNumber = /^\+?[1-9][0-9]*$/;
                if (regNumber.test(value) == false) {
                    return "免费天数必须是大于0的整数";
                }
            }
        },
        validate_firstRent: function (value) {
            if (vm.newOrderCar.rentGenerationMethod == 4) {
                if (value == null || value === '') {
                    return "请输入首期租金";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('radio(hasFreeDays)', function (data) {
        vm.newOrderCar.hasFreeDays = data.value;
    });
    form.on('radio(paymentMethod)', function (data) {
        vm.newOrderCar.paymentMethod = data.value;
        vm.newOrderCar.paymentMethodStr = data.elem.title;
        generateOrderbillView();
    });
    form.on('radio(hasReceive)', function (data) {
        vm.newOrderCar.hasReceive = data.value;
    });
    form.on('radio(rentGenerationMethod)', function (data) {
        vm.newOrderCar.rentGenerationMethod = data.value;
    });
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
    form.on('select(billFeeItem)', function (data) {
        vm.billFeeItem = data.value;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $(document).on('blur', '.freeDays,.deposit,.depositPeriods,.averageRental,.coverCharge', function () {
        if ($(this).val()) {
            setTimeout(function () {
                generateOrderbillView();
            }, 10);
        }
    });
}

function initTable(table, soulTable) {

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
    table.on('edit(billLst)', function(obj){
        vm.editbillItemlistener(obj);
    });
}

function initTableEvent(table) {
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
    var timeStartRent = laydate.render({
        elem: '#timeStartRent',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.newOrderCar.timeStartRent = value;
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
            vm.newOrderCar.timeFinishRent = value;
            var month = date.month -1;
            timeStartRent.config.max = date;
            timeStartRent.config.max.month = month;
            generateOrderbillView();
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
            Vue.set(vm.newOrderCar, "paymentDay", date.date);
            $('input#paymentDayVal').val(date.date);
        },
        ready: function(){//
            $('.laydate-theme-grid>div.layui-laydate-hint').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function dataRecombine() {
    vm.order.orderCar.timeStartRent = vm.newOrderCar.timeStartRent;
    vm.order.orderCar.timeFinishRent = vm.newOrderCar.timeFinishRent;
    vm.order.orderCar.tenancyType = 1;
    vm.order.plan.freeDays = vm.newOrderCar.freeDays;
    vm.order.plan.hasFreeDays = vm.newOrderCar.hasFreeDays;
    if (vm.order.plan.hasFreeDays <= 0) {
        vm.order.plan.hasFreeDays = 1;
    }
    vm.order.orderCar.paymentDay = vm.newOrderCar.paymentDay;
    if (vm.order.orderCar.paymentDayType <= 0) {
        vm.order.orderCar.paymentDayType = 2;
    }
    switch (vm.order.orderCar.rentType) {
        case 2:{
            vm.order.plan.servicingFee = vm.newOrderCar.deposit;
            vm.order.plan.servicingFeePeriods = vm.newOrderCar.depositPeriods;
            break;
        }
        case 5:{
            vm.order.plan.downPayment = vm.newOrderCar.deposit;
            vm.order.plan.downPaymentPeriods = vm.newOrderCar.depositPeriods;
            break;
        }
        default:{
            vm.order.plan.cashDeposit = vm.newOrderCar.deposit;
            vm.order.plan.cashDepositPeriods = vm.newOrderCar.depositPeriods;
        }
    }
    vm.order.plan.monthlyRent = vm.newOrderCar.averageRental;
    vm.order.plan.coverCharge = vm.newOrderCar.coverCharge;
    vm.order.orderCar.paymentMethod = vm.newOrderCar.paymentMethod;
    vm.order.plan.rentGenerationMethod = vm.newOrderCar.rentGenerationMethod;
    vm.order.plan.firstRent = vm.newOrderCar.firstRent;
}

function validateGenerateOrderbillView(){
    dataRecombine();
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

function confirmationBillView(status){
    dataRecombine();
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