$(function () {
    /***
     * 页面初始化根据车辆id赋值
     */
    if(parent.layui.larryElem != undefined){
        var params = parent.layui.larryElem.boxParams;
        vm.getOrderRelercordByCarId(params.carId);
    }
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
var releFileIdTmp;
var timeFinish;
var viewer;
var uploadContract;
var vm = new Vue({
    el:'#rrapp',
    data:{
        hetong:false,
        hetong1:false,
        q:{
            keyword: null
        },
        tenancyCalcType: '',
        feeViewId: 'feeViewId_0',
        feeItemId: '',
        planAdjust: 0,
        usrLst: [],
        orderLst: [],
        feeItemLst: [],
        selectCar: {
            orderCarId: '',
            planObj: {},
            planList: []
        },
        orderRelerecord: {
            operationId: '',
            hasFreeDays: 0,
            freeDays: '',
            fileLst: [],
            feeLst: []
        },
        contract: {
            contractType: ''
        },
        contractFileLst: [],
        releFileLstId: 'releFileLstId_0',
        contractModelId: 'contractModelId_0',
        hasFreeDays: 0,
        rentType: 1,//只有长租可以续租
        verify: false,
        subtips:null,
        hetong2:false,
        hetong3:false,
        hetong5:false,
        billLst: [],
        billFeeItem: '',
        statisticsBillViewTxt: '',
        confirmationStatus: 1,
        order:{
            plan:{

            },
            orderCar: {

            }
        },
        paymentDayList:[],
        payType:[],
        lateDayList:[],
        billPlanCols:[
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
        ],
        planCols:[
            {field:'typeFieldDesc', title: '类型', templet: function (d) {return isEmpty(d.typeFieldDesc);}},
            {field:'money', title: '金额/元', templet: function (d) {return isEmpty(d.money);}},
            {field:'paymentMethodStr', title: '付款方式', templet: function (d) {return isEmpty(d.paymentMethodStr);}},
            {field:'timePayment1st', title: '第一次付款日期', templet: function (d) {return isEmpty(dateFormatYMD(d.timePayment1st))}}
        ],
        planCols2:[
            {field:'model', title: '品牌/车系/车型', minWidth:200, templet: function (d) {
                    var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
                    if (txt == null || txt === '') {txt = '请选择品牌/车系/车型';}
                    return txt;
                }},
            {field:'cashDeposit', title: '保证金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.cashDeposit);}},
            {field:'monthlyRent', title: '租金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'coverCharge', title: '服务费', minWidth:200, templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'chlRebate', title: '渠道返利', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
            {field:'hasFreeDays', title: '免费用车天数', minWidth:200, templet:function (d) {
                    if (d.hasFreeDays&1 == 1){
                        return '有';
                    } else {
                        return '无';
                    }
                }},
            {field:'hasFreeDays', title: '免费用车天数类型', minWidth:200, templet: function (d) {
                    if (d.hasFreeDays == 3){
                        return '租期前';
                    } else if (d.hasFreeDays == 1) {
                        return '租期后';
                    } else {
                        return '--';
                    }
                }},
            {field:'freeDays', title: '免费用车时间/天数/台', minWidth:200, templet: function (d) {return isEmpty(d.freeDays);}}
        ],
        groupList:[],
        rentPrefix:''

    },
    watch: {
        feeItemLst: function () {
            this.$nextTick(function(){
                setTimeout(function(){
                    planAdjustChange();
                },300);
            });
        }
    },
    created: function(){
        this.paymentDayList = Array.from({length:31}, (_,i)=>i+1);
        this.lateDayList = Array.from({length:30}, (_, i)=>i+1);
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        // _this.orderRelerecord = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/config/getConfVal/receivables_overdue_period", function (r) {
            receivables_overdue_period = r^0;
            setTimeout(()=>{
                _this.getReceivablesOverduePeriod();
            }, 3000)
        });
        $.get(baseURL + "sys/config/getparam/tenancy_calc_type", function (r) {
            if (r.config != null){
                _this.tenancyCalcType = parseInt(r.config['paramValue']);
            } else {
                _this.tenancyCalcType = 1;
            }
        });
        $.get(baseURL + "sys/user/usrLst", function (r) {
            _this.usrLst = r.usrLst;
        });
        // $.get(baseURL + "order/orderrelerecord/enableReleList", function (r) {
        //     _this.orderLst = r.datas;
        // });
        $.ajaxSettings.async = true;

        if(_this.order &&_this.order.orderCar && _this.order.orderCar.rentType == 8){
            _this.payType = payType.splice(0, 3)
        }else {
            _this.payType = payType
        }

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        paymentMethodChange(val){
            let find = this.payType.find(item=>item.code===val);
            if(find){
                if(val === 7){
                    Vue.set(this, 'rentPrefix', "日");
                }else if(val === 8){
                    Vue.set(this, 'rentPrefix', "周");
                }else {
                    Vue.set(this, 'rentPrefix', "月");
                }
            }else {
                Vue.set(this, 'rentPrefix', '');
            }
            this.$forceUpdate();
            this.generateOrderbillView();
        },
        lateChange(){
            let that = this
            let day = 0
            if(this.order.orderCar.graceDay){
                day = Number(this.order.orderCar.graceDay)
            }

            if(this.billLst && this.billLst.length>0){
                this.billLst.forEach(item=>{
                    if(that.order.orderCar.aaaaaa){
                        item.receivableDate = that.order.orderCar.aaaaaa
                    }
                    item.overdueDate = moment(item.receivableDate, "YYYY-MM-DD").add(day, "days").format('YYYY-MM-DD')
                })
            }
            console.log('this.billLst', this.billLst)
            this.$forceUpdate()
        },
        getPayType(type){
            return getPayType(type)
        },
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
        addFeeItem: function () {
            if (vm.feeItemId == null || vm.feeItemId == ''){
                alert('请先选择费用项类型');
                return;
            }
            if (vm.orderRelerecord.feeLst.filter(function (value) {
                return (value.money == null || String(value.money).length < 1)
                    ||(value.paymentMethod == null || !(/[1-8]{1}/).test(value.paymentMethod))
                    ||(value.typeFieldName != 'monthly_rent' && value.typeFieldName != 'cover_charge' && (value.timePayment1st == null || value.timePayment1st == ''));
            }).length > 0){
                alert('有未完善费用项，请先完善后再添加');
                return;
            }
            if (vm.feeItemId == 'monthly_rent' && vm.orderRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'monthly_rent';
            }).length > 0) {
                alert('月租只能添加一条');
                return;
            }
            if (vm.feeItemId == 'cover_charge' && vm.orderRelerecord.feeLst.filter(function (value) {
                return value.typeFieldName == 'cover_charge';
            }).length > 0) {
                alert('服务费只能添加一条');
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
            if(vm.orderRelerecord.feeLst.length > 0){
                vm.orderRelerecord.feeLst.forEach(function (value) {
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
            vm.orderRelerecord.feeLst.push(item);
            vm.reloadFeeItem();
        },
        reloadFeeItem: function () {
            layui.table.reload('feeLstid', {
                page: {
                    curr: getCurrPage('feeLstid', vm.orderRelerecord.feeLst.length)
                },
                data: vm.orderRelerecord.feeLst});
        },
        feeItemDelectObj: function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.data.serializeId;
                obj.del();
                layer.close(index);
                for(var i = 0 ;i<vm.orderRelerecord.feeLst.length;i++) {
                    if(vm.orderRelerecord.feeLst[i].serializeId === serializeId) {
                        vm.orderRelerecord.feeLst.splice(i,1);
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
            vm.orderRelerecord.feeLst.forEach(function (value) {
                if (value.serializeId === obj.data.serializeId) value.money = v;
            });
            vm.reloadFeeItem();
        },
        delFile: function (id) {
            for(var i = 0 ;i<vm.orderRelerecord.fileLst.length;i++) {
                if(vm.orderRelerecord.fileLst[i].id === id) {
                    vm.orderRelerecord.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
        reloadPlanLst: function (datas) {
            layui.table.reload('quondamPlanLstid', {data: datas});
        },
        reloadPlanObj: function (datas) {
            layui.table.reload('quondamPlanObjid', {data: datas});
        },
        saveOrUpdate: function (event) {
            let that = this

            let forms = [
                this.$refs['selectCarForm'].validate(),
                this.$refs['orderRelerecordForm'].validate(),
                this.$refs['orderForm'].validate(),
                this.$refs['contractForm'].validate()
            ]

            Promise.all(forms).then(valid=>{
                if (valid) {
                    if (vm.confirmationStatus != 2) {
                        alert("请核对确认账单计划后再提交订单。");
                        return;
                    }

                    PageLoading();
                    vm.orderRelerecord.planAdjust = vm.planAdjust;
                    vm.orderRelerecord.oldPlanLst = vm.selectCar.planList;
                    vm.contract.fileLst = vm.contractFileLst;
                    vm.orderRelerecord.contract = vm.contract;
                    var parm = JSON.parse(JSON.stringify(vm.orderRelerecord));
                    if (contractExclude(parm.contract)){

                    }else {
                        parm.contract = null;
                    }
                    if(vm.contract.templateBody != undefined && vm.contract.templateBody != null){
                        parm.contract.templateBody = encodeURI(vm.contract.templateBody);
                    }
                    parm.billLst = vm.billLst;
                    parm.paymentMethod = vm.order.orderCar.paymentMethod;
                    parm.hasFreeDays = vm.order.plan.hasFreeDays;
                    parm.freeDays = vm.order.plan.freeDays;
                    parm.cashDeposit = vm.order.plan.cashDeposit;
                    parm.cashDepositPeriods = vm.order.plan.cashDepositPeriods;
                    parm.monthlyRent = vm.order.plan.monthlyRent;

                    parm.targetAmount = vm.order.plan.targetAmount;
                    parm.yesTargetAmount = vm.order.plan.yesTargetAmount;
                    parm.noTargetAmount = vm.order.plan.noTargetAmount;
                    parm.graceDay = vm.order.orderCar.graceDay;

                    parm.coverCharge = vm.order.plan.coverCharge;
                    $.ajax({
                        type: "POST",
                        url: baseURL + 'order/orderrelerecord/save',
                        contentType: "application/json",
                        data: JSON.stringify(parm),
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
                }else {
                    this.$message({
                        message: '请完成必填项',
                        type: 'warning'
                    });
                }
            })

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

        getOrderRelercordByCarId: function (carId){
            $.ajax({
                type: "POST",
                url: baseURL + 'order/orderrelerecord/enableReleList2?carId='+carId,
                success: function(r){
                    if(r.code === 0){
                        vm.onCarSelectedLitener(r.data);
                    }else{
                        alert(r.msg);
                    }
                }
            });

        },

        selectCarNo: function () {
            // console.log('aaaaaa')
            // var param = {
            //     callback: vm.onCarSelectedLitener
            // };
            // var index = layer.open({
            //     title: "选择车辆",
            //     type: 2,
            //     area: ['80%', '80%'],
            //     boxParams: param,
            //     content: tabBaseURL + "modules/order/selectordercarrele.html",
            //     end: function () {
            //         layer.close(index);
            //     }
            // });

            SelCarRelet({
                visible:true,
                ignoreNoCarFlag:1
            }).then(res=>{
                vm.onCarSelectedLitener(res[0])
            })
        },
        onCarSelectedLitener: function (data) {
            let _this = this;
            var orderCarId = data.orderCarId;
            if (orderCarId == null || orderCarId == ''){
                vm.selectCar = {
                    orderCarId: '',
                    planObj: {},
                    planList: []
                };
                vm.orderRelerecord.quondamOrderCarId = '';
                vm.orderRelerecord.timeStart = '';
                vm.feeItemLst = [];
                vm.orderRelerecord.feeLst = [];
                vm.order = {
                    orderCar: {},
                    plan: {},
                }
            } else if (orderCarId == vm.selectCar.orderCarId) {

            } else {

                vm.selectCar = data;
                vm.orderRelerecord.quondamOrderCarId = orderCarId;
                vm.orderRelerecord.timeStart = vm.selectCar.timeStartRentNew;
                vm.orderRelerecord.paymentDay = vm.selectCar.paymentDay;
                //
                $.ajaxSettings.async = false;
                $.get(baseURL + "order/orderfeeitemdict/selectorByRentType/" + vm.selectCar.rentType, function (r) {
                    vm.feeItemLst = r.datas;
                });
                $.get(baseURL + "order/order/orderDetail/" + orderCarId, function (r) {
                    vm.order = r.order;
                    vm.order.orderCar.timeStartRent = vm.selectCar.timeStartRentNew;
                    vm.order.orderCar.timeFinishRent = vm.orderRelerecord.timeFinish;
                    vm.order.plan.cashDeposit = null;
                    vm.order.plan.cashDepositPeriods = null;



                    _this.carSeled();
                });
                $.ajaxSettings.async = true;
                //
                if (vm.selectCar.planList != null && vm.selectCar.planList.length > 0){
                    var monthlyRent = null;
                    var coverCharge = null;
                    for (let i = 0; i < vm.selectCar.planList.length; i++) {
                        if (vm.selectCar.planList[i].typeFieldName === 'cover_charge'){
                            coverCharge = vm.selectCar.planList[i];
                        }
                        if (vm.selectCar.planList[i].typeFieldName === 'monthly_rent'){
                            monthlyRent = vm.selectCar.planList[i];
                        }
                    }
                    if (monthlyRent != null && coverCharge != null){
                        monthlyRent.money = toMoney(Number(monthlyRent.money) - Number(coverCharge.money));
                    }
                }
                if (vm.selectCar.planObj != null){
                    if (vm.selectCar.planObj.monthlyRent != null && vm.selectCar.planObj.coverCharge != null){
                        vm.selectCar.planObj.monthlyRent = toMoney(Number(vm.selectCar.planObj.monthlyRent) - Number(vm.selectCar.planObj.coverCharge));
                    }
                }

                //
                vm.orderRelerecord.feeLst = [];
                //
                if (vm.planAdjust == 1){
                    selectAllPlan();
                }
                vm.billLst.splice(0);
                _this.carSeled();
                confirmationBillView(1);
                reloadOrderbillView();
            }

            $.get(baseURL + "serviceConfig/listServiceConfig", {
                suitRentType: vm.selectCar.rentType,
                suitType: 5//下单
            }, function (r) {
                vm.groupList = r.data;
            });

            vm.orderRelerecord.timeFinish = '';
            vm.reloadPlanLst(vm.selectCar.planList);
            vm.reloadPlanObj([vm.selectCar.planObj]);
            vm.reloadFeeItem();
            startTimeChange(vm.orderRelerecord.timeStart);
            vm.feeViewId = 'feeViewId_'+uuid(32);
            generateOrderbillView();
        },
        carSeled:function () {
            let _this = this;

            _this.paymentMethodChange(_this.order.orderCar.paymentMethod);
            if(_this.order &&_this.order.orderCar && _this.order.orderCar.rentType == 8){
                _this.payType = payType.splice(0, 3)

                _this.planCols2 = [
                    {field:'model', title: '品牌/车系/车型', minWidth:200, templet: function (d) {
                            var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
                            if (txt == null || txt === '') {txt = '请选择品牌/车系/车型';}
                            return txt;
                        }},
                    {field:'cashDeposit', title: '保证金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.cashDeposit);}},
                    {field:'targetAmount', minWidth: 200, title: '达标额/元/天', templet: function (d) {return isEmpty(d.targetAmount);}},
                    {field:'yesTargetAmount', minWidth: 200, title: '达标使用费/元/台', templet: function (d) {return isEmpty(d.yesTargetAmount);}},
                    {field:'noTargetAmount', minWidth: 200, title: '不达标使用费/元/台', templet: function (d) {return isEmpty(d.noTargetAmount);}},
                    // {field:'monthlyRent', title: '租金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
                    {field:'coverCharge', title: '服务费', minWidth:200, templet: function (d) {return isEmpty(d.coverCharge);}},
                    {field:'chlRebate', title: '渠道返利', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
                    {field:'hasFreeDays', title: '免费用车天数', minWidth:200, templet:function (d) {
                            if (d.hasFreeDays&1 == 1){
                                return '有';
                            } else {
                                return '无';
                            }
                        }},
                    {field:'hasFreeDays', title: '免费用车天数类型', minWidth:200, templet: function (d) {
                            if (d.hasFreeDays == 3){
                                return '租期前';
                            } else if (d.hasFreeDays == 1) {
                                return '租期后';
                            } else {
                                return '--';
                            }
                        }},
                    {field:'freeDays', title: '免费用车时间/天数/台', minWidth:200, templet: function (d) {return isEmpty(d.freeDays);}}
                ]
            }else {
                _this.payType = payType

                _this.planCols2 = [
                    {field:'model', title: '品牌/车系/车型', minWidth:200, templet: function (d) {
                            var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
                            if (txt == null || txt === '') {txt = '请选择品牌/车系/车型';}
                            return txt;
                        }},
                    {field:'cashDeposit', title: '保证金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.cashDeposit);}},
                    {field:'monthlyRent', title: '租金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
                    {field:'coverCharge', title: '服务费', minWidth:200, templet: function (d) {return isEmpty(d.coverCharge);}},
                    {field:'chlRebate', title: '渠道返利', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
                    {field:'hasFreeDays', title: '免费用车天数', minWidth:200, templet:function (d) {
                            if (d.hasFreeDays&1 == 1){
                                return '有';
                            } else {
                                return '无';
                            }
                        }},
                    {field:'hasFreeDays', title: '免费用车天数类型', minWidth:200, templet: function (d) {
                            if (d.hasFreeDays == 3){
                                return '租期前';
                            } else if (d.hasFreeDays == 1) {
                                return '租期后';
                            } else {
                                return '--';
                            }
                        }},
                    {field:'freeDays', title: '免费用车时间/天数/台', minWidth:200, templet: function (d) {return isEmpty(d.freeDays);}}
                ]
            }

            _this.getReceivablesOverduePeriod();


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
                        vm.$forceUpdate();
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

            let find = this.groupList.find(item=>vm.billFeeItem===item.id);

            var now = moment(new Date()).format("YYYY-MM-DD");
            if(this.order.orderCar.aaaaaa){
                now = this.order.orderCar.aaaaaa
            }
            let day = 0
            if(this.order.orderCar.graceDay){
                day = Number(this.order.orderCar.graceDay)
            }
            let overduedate = moment(now, "YYYY-MM-DD").add(day, "days").format('YYYY-MM-DD')
            // var overduePeriod = getReceivablesOverduePeriod()^0;
            var item = {
                "serializeId":uuid(32),
                "collectionType":10,
                "receivableAmount":0.00,
                "receivableDate":now,
                overdueDate:overduedate,
                "receivableDateDesc":null,
                // "overduePeriod":overduePeriod,
                "typeFieldName":"other_fee",
                // "typeFieldDesc":"其他",
                // "typeFieldName":find.id,
                "typeFieldDesc":find.serviceName,
                "orderNum":7,
            }
            // if (overduePeriod > 0) {
            //     now.setDate(now.getDate() + overduePeriod);
            // }
            // item.overdueDate = now.format("yyyy-MM-dd");
            vm.billLst.push(item);
            if(billLstBuk===undefined || billLstBuk===null || billLstBuk===[] || billLstBuk===''){
                billLstBuk = []
            }
            billLstBuk.push({...item});
            // billLstBuk = JSON.parse(JSON.stringify(vm.billLst));
            confirmationBillView(1);
            reloadOrderbillView();
        },
        billItemDelectObj:function (obj) {
            layer.confirm('确认删除该条数据？', function(index){
                var serializeId = obj.serializeId;
                // obj.del();
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
        itemDateChange(index){
            let that = this
            let day = 0
            if(this.order.orderCar.graceDay){
                day = Number(this.order.orderCar.graceDay)
            }

            this.billLst[index].overdueDate = moment(this.billLst[index].receivableDate, "YYYY-MM-DD").add(day, "days").format("YYYY-MM-DD")

            this.$forceUpdate()
        },
        regen:function (serializeId, i) {
            var obj = billLstBuk.filter(function (item) {
                return item.serializeId === serializeId;
            })[0];
            for (var i = 0; i < vm.billLst.length; i++) {
                if (vm.billLst[i].serializeId === serializeId) {
                    // vm.billLst[i] = JSON.parse(JSON.stringify(obj));
                    Vue.set(vm.billLst, i, JSON.parse(JSON.stringify(obj)));
                    break;
                }
            }
            // var now = moment(new Date()).format("YYYY-MM-DD");
            // if(this.order.orderCar.aaaaaa){
            //     now = this.order.orderCar.aaaaaa
            // }
            // let day = 0
            // if(this.order.orderCar.graceDay){
            //     day = Number(this.order.orderCar.graceDay)
            // }
            // let overduedate = moment(now, "YYYY-MM-DD").add(day, "days").format('YYYY-MM-DD')
            //
            // // var overduePeriod = getReceivablesOverduePeriod()^0;
            // this.$set(this.billLst, i,{
            //     serializeId:vm.billLst[i].serializeId,
            //     collectionType:10,
            //     receivableAmount:0.00,
            //     receivableDate:now,
            //     overdueDate:overduedate,
            //     receivableDateDesc:null,
            //     // overduePeriod:overduePeriod,
            //     typeFieldName:"other_fee",
            //     typeFieldDesc:"其他",
            //     orderNum:7,
            //     remarks:null
            // })

            vm.$forceUpdate();
            console.log(vm.billLst, billLstBuk)

            confirmationBillView(1);
            reloadOrderbillView();
        },
        validData(rule, value, callback) {
            // console.log('aaa', rule, value, callback)
            if (rule.required && !value) {
                // this.$modal.msgError(`未填写${value}`);
                callback(new Error(rule.message));
            } else {
                callback();
            }
        },
        generateOrderbillView(){
            console.log('vm, generateOrderbillView');
            generateOrderbillView();
            this.$forceUpdate();
        },
        getReceivablesOverduePeriod(){
            vm.order.graceDay = receivables_overdue_period^0;
            if (vm.order.orderCar.paymentDayType == 1) {
                // if (vm.order.orderCar.timeDelivery != null) {
                //     overduePeriod = new Date(vm.order.orderCar.timeDelivery).format("dd");
                // } else  {
                //     overduePeriod = new Date().format("dd");
                // }
            }
            if (vm.order.orderCar.paymentDayType == 2 && vm.order.orderCar.paymentDay > 0) {
                vm.order.graceDay = vm.order.orderCar.paymentDay;
            }
            if (vm.order.repaymentMethod == 4 && vm.order.plan.gracePeriod > 0) {
                vm.order.graceDay = vm.order.plan.gracePeriod;
            }
            this.lateChange();
            this.$forceUpdate();
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
    Upload('releFileLst', true, vm.orderRelerecord.fileLst, null, vm.orderRelerecord.operationId, vm.orderRelerecord.operationName, {'path':'order-rele'}, '续租附件').initView();
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
   //初始化赋值续租所属业务员为当前登录用户
   vm.orderRelerecord.operationId=sessionStorage.getItem("userId");
   vm.orderRelerecord.operationName=sessionStorage.getItem("username");

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_selectCar: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择车牌号";
                }
            }
        },
        validate_timeFinish: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择结束时间";
                }
            }
        },
        validate_paymentDay: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "付款日不能为空";
                }
            }
        },
        validate_operationId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "续租所属业务员不能为空";
                }
            }
        }
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('select(selectOperation)', function (data) {
        var usrid = data.value;
        vm.orderRelerecord.operationId = usrid;
        var obj = vm.usrLst.filter(function (obj) {
            return obj.userId == usrid;
        })[0];
        if (obj != null){
            vm.orderRelerecord.operationName = obj.username;
        }else {
            vm.orderRelerecord.operationName = '';
        }
        vm.orderRelerecord.fileLst.forEach(function (value) {
            value.operationId = usrid;
            value.operationName = vm.orderRelerecord.operationName;
        });
    });

    form.on('select(feeItem)', function (data) {
        vm.feeItemId = data.value;
    });

    form.on('radio(planAdjust)', function (data) {
        if (vm.planAdjust == data.value) {return;}
        vm.planAdjust = data.value;
        vm.orderRelerecord.feeLst = [];
        if (vm.planAdjust == 1) selectAllPlan();
        planAdjustChange();
    });

    form.on('select(feeItemPaymentMethod)',function (data) {
        var serializeId = data.elem.attributes.sid.value;
        var sname = data.elem.attributes.sname.value;
        if (sname === 'monthly_rent' || sname === 'cover_charge'){
            vm.orderRelerecord.feeLst.forEach(function (value) {
                if (value.typeFieldName === 'monthly_rent' || value.typeFieldName === 'cover_charge'){
                    value.paymentMethod = data.value;
                }
            });
        }else {
            vm.orderRelerecord.feeLst.forEach(function (value) {
                if (value.serializeId == serializeId) {
                    value.paymentMethod = data.value;
                }
            });
        }
        vm.reloadFeeItem();
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
    form.on('select(billFeeItem)', function (data) {
        vm.billFeeItem = data.value;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });

    $("#selectCar").on('click', function () {
        vm.selectCarNo();
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

    $(document).on('blur', '.freeDays,.monthlyRent,.coverCharge,.cashDeposit,.cashDepositPeriods', function () {
        if ($(this).val()) {
            setTimeout(function () {
                generateOrderbillView();
            }, 10);
        }
    });
}

function initTable(table, soulTable) {

    table.render({
        id: 'quondamPlanLstid',
        elem: '#quondamPlanLst',
        data: vm.selectCar.planList,
        cols: [[
            {field:'typeFieldDesc', title: '类型', templet: function (d) {return isEmpty(d.typeFieldDesc);}},
            {field:'money', title: '金额/元', templet: function (d) {return isEmpty(d.money);}},
            {field:'paymentMethodStr', title: '付款方式', templet: function (d) {return isEmpty(d.paymentMethodStr);}},
            {field:'timePayment1st', title: '第一次付款日期', templet: function (d) {return isEmpty(dateFormatYMD(d.timePayment1st))}}
        ]],
        page: false,limit: 500,
    });

    table.render({
        id: "quondamPlanObjid",
        elem: '#quondamPlanObj',
        data: [vm.selectCar.planObj],
        cols: [[
            {field:'model', title: '品牌/车系/车型', minWidth:200, templet: function (d) {
                    var txt = jointStr('/', d.brandName, d.seriesName, d.modelName);
                    if (txt == null || txt === '') {txt = '请选择品牌/车系/车型';}
                    return txt;
                }},
            {field:'cashDeposit', title: '保证金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.cashDeposit);}},
            {field:'monthlyRent', title: '租金/元/台', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'coverCharge', title: '服务费', minWidth:200, templet: function (d) {return isEmpty(d.coverCharge);}},
            {field:'chlRebate', title: '渠道返利', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
            {field:'hasFreeDays', title: '免费用车天数', minWidth:200, templet:function (d) {
                    if (d.hasFreeDays&1 == 1){
                        return '有';
                    } else {
                        return '无';
                    }
                }},
            {field:'hasFreeDays', title: '免费用车天数类型', minWidth:200, templet: function (d) {
                    if (d.hasFreeDays == 3){
                        return '租期前';
                    } else if (d.hasFreeDays == 1) {
                        return '租期后';
                    } else {
                        return '--';
                    }
                }},
            {field:'freeDays', title: '免费用车时间/天数/台', minWidth:200, templet: function (d) {return isEmpty(d.freeDays);}}
        ]],
        page: false,limit: 500,
    });

    table.render({
        id: 'feeLstid',
        elem: '#feeLst',
        data: vm.orderRelerecord.feeLst,
        cols: [[
            {field:'typeFieldDesc', title: '类型'},
            {field:'money', title: '金额/元', edit: 'text', event: 'money'},
            {field:'paymentMethod', title: '付款方式', templet: '#selectPaymentMethod'},
            {field:'paymentMethod', title: '总期数', templet: function (d) {
                    var txt = '--';
                    if ((d.typeFieldName === 'monthly_rent' || d.typeFieldName === 'cover_charge') && vm.orderRelerecord.timeFinish != null && vm.orderRelerecord.timeFinish != '' && vm.orderRelerecord.timeStart != null && vm.orderRelerecord.timeStart != ''){
                        // txt = calculateDateDifferMonths(vm.orderRelerecord.timeStart, vm.orderRelerecord.timeFinish, d.paymentMethod);
                        $.ajaxSettings.async = false;
                        var tenancyStr = null;
                        $.get(baseURL + 'order/ordercar/getTenancyStr?startTime='+vm.orderRelerecord.timeStart+'&endTime='+vm.orderRelerecord.timeFinish+'&paymentMethod='+d.paymentMethod+'&billType='+vm.selectCar.planObj.billType, function (r) {
                            tenancyStr = r.tenancyStr;
                        });
                        $.ajaxSettings.async = true;
                    }
                    return tenancyStr||txt;
                }},
            {field:'timePayment1st', title: '第一次付款日期', event: 'selectTimePayment1st', templet: function (d) {
                    var txt = d.timePayment1st;
                    if ((/\d+/).test(txt)){
                        txt = isEmpty(dateFormatYMD(txt));
                    }else if (d.typeFieldName === 'monthly_rent' || d.typeFieldName === 'cover_charge'){
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
                var value = vm.orderRelerecord.feeLst.filter(function (value) {
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
            if (data.typeFieldName === 'monthly_rent' || data.typeFieldName === 'cover_charge'){
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
                    vm.orderRelerecord.feeLst.forEach(function (value) {
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
    timeFinish = laydate.render({
        elem: '#timeFinish',
        trigger: 'click',
        min: '1900-01-01',
        done: function (value) {
            vm.orderRelerecord.timeFinish = value;
            vm.order.orderCar.timeFinishRent = value;
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
            vm.orderRelerecord.paymentDay = date.date;
            vm.order.orderCar.paymentDay = date.date;
            $('input#paymentDayVal').val(date.date);
        },
        ready: function(){//
            $('.laydate-theme-grid>div.layui-laydate-hint').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-header').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>thead').hide();
            $('.laydate-theme-grid>div>div.layui-laydate-content>table>tbody>tr>td.laydate-disabled').hide();
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

function startTimeChange(startTime) {
    if (timeFinish == null ){return;}
    var tmp = [1900, 1, 1];
    if (startTime != null && startTime != ''){
        tmp = startTime.split('-');
    }
    timeFinish.config.min = {
        year: tmp[0],
        month: tmp[1] - 1,
        date: tmp[2],
        hours: 0,
        minutes: 0,
        seconds: 0
    };
    timeFinish.config.value = startTime;
}

function planAdjustChange() {
    $('select[name="feeItem"]>option').removeAttr('disabled');
    $('select[name="feeItem"]').siblings('div').find('dd').removeClass('layui-disabled');
    if (vm.planAdjust == 0){
        $('select[name="feeItem"]>option[value="cash_deposit"]').attr('disabled', 'disabled');
        $('select[name="feeItem"]>option[value="monthly_rent"]').attr('disabled', 'disabled');
        $('select[name="feeItem"]>option[value="cover_charge"]').attr('disabled', 'disabled');
        $('select[name="feeItem"]').siblings('div').find('dd[lay-value="cash_deposit"]').addClass('layui-disabled');
        $('select[name="feeItem"]').siblings('div').find('dd[lay-value="monthly_rent"]').addClass('layui-disabled');
        $('select[name="feeItem"]').siblings('div').find('dd[lay-value="cover_charge"]').addClass('layui-disabled');
        for(var i = 0 ;i<vm.orderRelerecord.feeLst.length;i++) {
            if(vm.orderRelerecord.feeLst[i].typeFieldName === 'cash_deposit' || vm.orderRelerecord.feeLst[i].typeFieldName === 'monthly_rent' || vm.orderRelerecord.feeLst[i].typeFieldName === 'cover_charge') {
                vm.orderRelerecord.feeLst.splice(i,1);
                i= i-1;
            }
        }
    }
    var hasField = false;
    vm.orderRelerecord.feeLst.forEach(function (fee) {
        if(fee.typeFieldName === vm.feeItemId) {
            hasField = true;
        }
    });
    if (!hasField){
        vm.feeItemId = '';
    }
    vm.reloadFeeItem();
}

function selectAllPlan() {
    vm.orderRelerecord.feeLst = [];
    var serializeId = 0;
    vm.selectCar.planList.forEach(function (f) {
        var item = {
            serializeId:++serializeId,
            elid: 'serializeId_'+(serializeId),
            typeFieldName:f.typeFieldName,
            typeFieldDesc:f.typeFieldDesc,
            multiple:(f.typeFieldName == 'monthly_rent' || f.typeFieldName == 'cover_charge')?0:1,
            money:f.money,
            paymentMethod:f.paymentMethod,
            timePayment1st:f.timePayment1st
        };
        vm.orderRelerecord.feeLst.push(item);
    });
}

function closePage() {
    if(parent.layui.larryElem != undefined){
        closeCurrent();
    }else{
        parent.vm.isClose = true;
        var index = parent.layer.getFrameIndex(window.name);
        parent.vm.reload();
        parent.layer.close(index);
    }

}

function calculateDateDifferMonths(start, end, paymentMethod) {
    //
    if (paymentMethod > 6){
        var startDate = Date.parse(start);
        var endDate = Date.parse(end);
        var days = -1;
        if (startDate > endDate){
            days = 0;
        }
        if (startDate == endDate){
            days = 1;
        }
        if (days === -1){
            days = (endDate - startDate)/(24*60*60*1000);
        }
        if (days === 0) return 0;
        days = days + 1;
        if (paymentMethod == 7){
            return days;
        }else if (paymentMethod == 8){
            return ((days/7)^0) + (days%7>0);
        }
    }
    //
    var start_datas = start.split('-');
    var end_datas = end.split('-');
    var start_year = parseInt(start_datas[0]);
    var start_month = parseInt(start_datas[1]);
    var start_day = parseInt(start_datas[2]);
    var end_year = parseInt(end_datas[0]);
    var end_month = parseInt(end_datas[1]);
    var end_day = parseInt(end_datas[2]);
    return differMonths(start_year, start_month, start_day, end_year, end_month, end_day) + hasRedundantDays(start_year, start_month, start_day, end_year, end_month, end_day);
}

function differMonths(start_year, start_month, start_day, end_year, end_month, end_day) {
    if (start_year === end_year){//同一年
        if (start_month === end_month){//同月
            if (start_day < end_day){//开始日小于结束日
                if (start_day > 1 || !isMonthLastday(end_year, end_month, end_day)){//不足一个月
                    return 0;
                } else {
                    if (vm.tenancyCalcType === 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            } else {//开始日大于结束日
                return 0;
            }
        } else {//不同月
            if (start_month < end_month){//开始月小于结束月
                if ((start_month + 1) < end_month) {//开始月后延一月小于结束月
                    start_month++;
                    // if (start_day > getMonthLastday(start_year, start_month)) {
                    //     start_day = getMonthLastday(start_year, start_month);
                    // }
                    return 1 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
                } else {
                    if (start_day === end_day) {
                        return 1;
                    } else if (start_day < end_day) {
                        if (vm.tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
                            return 2;
                        } else return 1;
                    } else {//开始月后延一月等于结束月并且开始日大于结束日
                        if (isMonthLastday(end_year, end_month, end_day)) {//结束日是当月最后一天
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else {//开始月大于结束月
                return 0;
            }
        }
    } else if (start_year < end_year) {//跨年-开始年小于结束年
        if ((start_year + 1) < end_year) {//开始年与结束年相差大于一年
            start_year++;
            return 12 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
        } else if ((start_year + 1) === end_year) {//开始年与结束年相差一年
            var diff = 13 - start_month;
            if (end_month === 2){//开始时间与结束时间相差一个月
                start_year++;
                start_month = 1;
                if (start_day > end_day) diff--;
                return diff + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
            }else if (end_month > 1){//开始时间与结束时间相差超过一个月
                start_year++;
                start_month = 1;
                return diff + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
            } else {
                if (diff > 1) {//开始时间与结束时间相差超过一个月
                    start_month++;
                    return 1 + differMonths(start_year, start_month, start_day, end_year, end_month, end_day);
                } else {//开始时间与结束时间相差一个月或不足一个月
                    if (start_day === end_day){
                        return 1;
                    } else if (start_day < end_day) {
                        if (vm.tenancyCalcType === 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) {
                            return 2;
                        } else return 1;
                    } else {//开始月后延一月等于结束月并且开始日大于结束日
                        if (isMonthLastday(end_year, end_month, end_day)) {//结束日是当月最后一天
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        }
    } else {
        return 0;
    }
}

function hasRedundantDays(start_year, start_month, start_day, end_year, end_month, end_day) {
    var hasRedundantDays = false;
    if (start_month === end_month){//同月
        hasRedundantDays = (end_day < start_day);
        if (!hasRedundantDays){//结束日大于开始日
            hasRedundantDays = (vm.tenancyCalcType !== 2 && start_day === 1 && isMonthLastday(end_year, end_month, end_day)) || (vm.tenancyCalcType === 2 && (start_day !== 1 || !isMonthLastday(end_year, end_month, end_day)));
        }
    }else {//不同月
        hasRedundantDays = (end_day > start_day);
        if (!hasRedundantDays){//结束日小于开始日
            hasRedundantDays = end_day !== start_day && !isMonthLastday(end_year, end_month, end_day);
        }
    }
    return hasRedundantDays ? 1 : 0;
}

function isMonthLastday(year, month, day) {
    return day === getMonthLastday(year, month);
}

function getMonthLastday(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:{
            return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11:{
            return 30;
        }
        case 2:{
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        }
    }
}

function validateGenerateOrderbillView(){
    vm.order.orderCar.timeFinishRent=vm.orderRelerecord.timeFinish;

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
            if (vm.order.plan.monthlyRent == null || vm.order.plan.monthlyRent == '') {
                return '请输入租金';
            }
            break;
        }
        case 2:{//以租代购
            if (vm.order.plan.servicingFee == null || vm.order.plan.servicingFee == '') {
                return '请输入整备费';
            }
            if (vm.order.plan.servicingFeePeriods == null || vm.order.plan.servicingFeePeriods == '') {
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
    if (msg === 'success') {
        generateOrderbillView();
    } else {
        alert(msg);
    }
}

function generateOrderbillView(){

    var msg = validateGenerateOrderbillView();
    console.log('generateOrderbillView', msg)


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
                    if(vm.order.orderCar.rentType != 8) {
                        vm.$message.warning("账单业务相关数据未填写，未生成预览账单");
                    }
                    // alert("账单业务相关数据未填写，未生成预览账单");
                }
            } else {
                vm.$message.error(r.msg);
                // alert(r.msg);
            }
        }
    });
    vm.$forceUpdate();
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
                        console.log('a', field, Number(vm.order.plan[field]), Number(amountTotle))
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
                console.log('b', field, Number(vm.order.plan[field]), Number(amountTotle))
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
