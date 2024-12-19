$(function () {
    vm.detail();
    layui.form.on('select(type)', function (data) {
        vm.applyForDTO.returnType = data.value;
    })

    //退换车时间
    if (vm.settleType == 2) {
        layui.laydate.render({
            elem: '#date',
            type: 'date',
            trigger: 'click',
            // min:minTime,
            done: function (value) {
                monthlyRentDebt(value);
            }
        });
    }

    //退款时间
    layui.laydate.render({
        elem: '#refundDate',
        type: 'date',
        trigger: 'click',
        // min:minTime,
        done: function (value) {
            vm.applyForDTO.refundTime = value;
        }
    });

    layui.form.render();

    uploadAttachment();
    //保存
    layui.form.on('submit(submitEditData)', function () {
        vm.saveOrUpdate();
        return false;
    });


});

var processKey;

var viewer;
var returncar_rent_settlement = 1;
var returncar_rent_settlement_model = 2;
var vm = new Vue({
    el: '#rrapp',
    data: {
        applyForDTO: {},
        title: null,
        settleBodyId:'settleBodyId_0',
        dateLabel:null,
        settleAmount: null,
        amount: {},
        settleType: null,
        businessNo: null,
        deliveryFileLst: [],
        deliveryFileLstId: 'deliveryFileLstId_0',
        //仓库数据源
        warehouseData:{},
        preData:{},
        backAmount:[],
        illLegalAmount:[],
        insuranceAmount:[],
        decutionAmount:[],
        bankInfo:[],
        notice:[],
        serviceProperty:{},
        settlementFeeItem:{}
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async = false;
        $.get(baseURL + "sys/config/getConfVal/returncar_rent_settlement", function (r) {
            returncar_rent_settlement = r==='0'?0:1;
        });
        $.get(baseURL + "sys/config/getConfVal/returncar_rent_settlement_model", function (r) {
            returncar_rent_settlement_model = r==='1'?1:2;
        });
        var param = parent.layer.boxParams.boxParams;
        processKey = param.processKey;
        var suitType, suitRentType;
        switch (param.processKey) {
            case 'rentSaleTransferCar':{
                suitType = 2;
                suitRentType = 2;
                break;
            }
            case 'rentTransferCar':{
                suitType = 2;
                suitRentType = 1;
                break;
            }
            case 'rentSaleApprove':{
                suitType = 1;
                suitRentType = 2;
                break;
            }
            case 'purchaseBackApprove':{
                suitType = 1;
                suitRentType = 6;
                break;
            }
            case 'carBackApprove':{
                suitType = 1;
                suitRentType = 1;
                break;
            }
        }
        initSettlementFeeItemView(settlementGroupDefault, _this.settlementFeeItem, 'config', {
            suitType: suitType,
            suitRentType: suitRentType
        });
        $.ajaxSettings.async = true;
    },
    computed: {},
    methods: {
        initOrderData:function(order){
                vm.preData.carNo=order.orderCar.carNo;
                vm.preData.code=order.orderCar.code;
                vm.preData.customerName=order.customerName;
                vm.preData.rentTypeStr=order.orderCar.rentTypeStr;
                vm.preData.rentType=order.orderCar.rentType;
                vm.preData.customerTel=order.customerTel;
                vm.preData.contactPerson=order.contactPerson;
                vm.preData.customerType=order.customerType;
                vm.preData.lessorName=order.lessorName;
                vm.preData.engineNo=order.orderCar.engineNo;
                vm.preData.timeDeliveryShow=order.orderCar.timeDeliveryShow;
                if (order.orderCar.timeStartRent) {
                    vm.preData.timeStartRent=dateFormatYMD(order.orderCar.timeStartRent);
                }
                if (order.orderCar.timeFinishRent) {
                    vm.preData.timeFinishRent=dateFormatYMD(order.orderCar.timeFinishRent);
                }
                vm.preData.currTimeStartRent = order.orderCar.currTimeStartRent;
                vm.preData.vinNo=order.orderCar.vinNo;
                vm.preData.carBrandModel=order.orderCar.brandName+'/'+order.orderCar.seriesName+'/'+order.orderCar.modelName;
                vm.preData.deptName=order.orderCar.deptName
        },
        inputAlterationMileage:function(){
            this.applyForDTO.alterationMileage = checkNum(this.applyForDTO.alterationMileage);
        },
        saveOrUpdate: function () {
            if(vm.settleType == 2){
                if(vm.applyForDTO.returnType == null || vm.applyForDTO.returnType == ''){
                    layer.msg('退车类别不能为空!', {icon: 7});
                    return false;
                }
            }
            if(vm.applyForDTO.rentType === 6){
                vm.applyForDTO.timeStartRent = null;
                vm.applyForDTO.timeFinishRent = null;
            }
            vm.applyForDTO.attachment = vm.deliveryFileLst;
            vm.applyForDTO.settlementFeeItem = vm.settlementFeeItem;
            $.ajax({
                type: "POST",
                url: baseURL + "order/ordercaralteration/save",
                contentType: "application/json",
                data: JSON.stringify(vm.applyForDTO),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        detail: function () {
            let data;
            var code = window.localStorage.getItem("code");
            var type = window.localStorage.getItem("type");
            vm.settleType = type;
            vm.businessNo = code;
            if (type == 1) { //换车
                vm.title = "申请换车";
                vm.dateLabel="换车时间";
                $("#marginDiv").hide();
                $("#typeDiv").hide();
            } else if (type == 2) { //退车
                vm.title = "申请退车";
                vm.dateLabel="退车时间";
                $("#marginDiv").show();
                $("#typeDiv").show();
            }
            setTimeout(() => {
                $.get(baseURL + "order/ordercaralteration/detailData/" + code, function (r) {
                    vm.applyForDTO = r.data;
                    vm.applyForDTO.alterationType = vm.settleType;
                    vm.applyForDTO.carNo = vm.preData.carNo;
                    vm.applyForDTO.code = vm.preData.code;
                    vm.applyForDTO.engineNo = vm.preData.engineNo;
                    vm.applyForDTO.timeDeliveryShow = vm.preData.timeDeliveryShow;
                    vm.applyForDTO.customerName = vm.preData.customerName;
                    vm.applyForDTO.rentTypeStr = vm.preData.rentTypeStr;
                    vm.applyForDTO.rentType = vm.preData.rentType;
                    vm.applyForDTO.customerTel = vm.preData.customerTel;
                    /*if(vm.preData.customerType === 1){
                        vm.applyForDTO.contactPerson = vm.preData.contactPerson;
                    }else{
                        vm.applyForDTO.contactPerson = vm.preData.customerName;
                    }*/
                    vm.applyForDTO.contactPerson = vm.preData.contactPerson;
                    vm.applyForDTO.lessorName = vm.preData.lessorName;
                    vm.applyForDTO.timeStartRent = vm.preData.timeStartRent;
                    vm.applyForDTO.timeFinishRent = vm.preData.timeFinishRent;
                    vm.applyForDTO.currTimeStartRent = vm.preData.currTimeStartRent;
                    vm.applyForDTO.vinNo = vm.preData.vinNo;
                    vm.applyForDTO.carBrandModel = vm.preData.carBrandModel;
                    vm.applyForDTO.deptName = vm.preData.deptName;

                    if(r.data.rentType == 2 || r.data.rentType == 5 || r.data.rentType == 6){
                        $("#marginDiv").hide();
                    }
                    switch (processKey) {
                        case 'rentSaleTransferCar':
                        case 'rentTransferCar':
                        case 'rentSaleApprove':
                        case 'carBackApprove':{
                            if (vm.settlementFeeItem.otherFee) {
                                vm.settlementFeeItem.otherFee.value = vm.applyForDTO.otherFee;
                            }
                            if (vm.settlementFeeItem.rentAmount) {
                                vm.settlementFeeItem.rentAmount.value = vm.applyForDTO.rentAmount;
                            }
                            if (vm.settlementFeeItem.margin) {
                                vm.settlementFeeItem.margin.value = vm.applyForDTO.margin;
                            }
                            break;
                        }
                        case 'purchaseBackApprove':{
                            if (vm.settlementFeeItem.otherFee) {
                                vm.settlementFeeItem.otherFee.value = vm.applyForDTO.otherFee;
                            }
                            if (vm.settlementFeeItem.rentAmount) {
                                vm.settlementFeeItem.rentAmount.value = vm.applyForDTO.rentAmount;
                            }
                            if (vm.settlementFeeItem.hasPaid) {
                                vm.settlementFeeItem.hasPaid.value = vm.applyForDTO.hasPaid;
                            }
                            break;
                        }
                    }
                    if (processKey !== 'rentSaleTransferCar' && processKey !== 'rentTransferCar' && !returncar_rent_settlement) {
                        if (vm.settlementFeeItem.rentAmount) vm.settlementFeeItem.rentAmount.value = '';
                    }
                    console.log("页面初始话类型：",vm.settleType, vm.applyForDTO);
                    if (vm.settleType == 1) { // 1是换车
                        // var max = new Date(vm.applyForDTO.timeFinishRent);
                        // max.setDate(max.getDate()-1);
                        layui.laydate.render({
                            elem: '#date',
                            type: 'date',
                            trigger: 'click',
                            min:vm.applyForDTO.currTimeStartRent ? vm.applyForDTO.currTimeStartRent : '2020-01-01',
                            max:vm.applyForDTO.timeFinishRent,
                            // max:max.format("yyyy-MM-dd"),
                            done: function (value) {
                                monthlyRentDebt(value);
                            }
                        });
                    }
                    console.log("1111111");
                    editcallback();
                  });
            }, 50);



        },
        cancel: function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        delDeliveryFile: function (id) {
            for (var i = 0; i < vm.deliveryFileLst.length; i++) {
                if (vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i, 1);
                    i = i - 1;
                }
            }
        },
        chooseWarehouse:function(){
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.applyForDTO = Object.assign({}, vm.applyForDTO,{
                        depotId:vm.warehouseData.warehouseId,
                        depotName:vm.warehouseData.warehouseName,
                    });
                    layer.close(index);
                }
            });
        },

        check:function (field,item){
           let fr=  checkNum(field);
           Vue.set(vm.applyForDTO, item, fr);
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
    }
});

/**
 * 上传附件
 */
function uploadAttachment() {
    //结算附件
    uploadParams = {
        "path": "order-delivery",
        "nameDesc": "结算附件",
        "vm": vm,
        "vmPropertyName":["deliveryFileLstId","deliveryFileLst"],
        "layui": layui,
        "delFileMethod":"delDeliveryFile"
    };
    initUploadCommons(uploadParams,"#addDeliveryFile");
}

function editcallback(event, val) {
    console.log(event+"="+val)
    var obj = settlementFeeItemAmount(vm.settlementFeeItem);
    vm.settleAmount = obj.settleAmount;
    vm.applyForDTO.repayAmount = vm.settleAmount;
    vm.applyForDTO.repayType = obj.type;
}

function monthlyRentDebt(value) {
    vm.applyForDTO.timeApply = value;
    var urlPath = baseURL + "order/ordercaralteration/monthlyRentDebt/"+vm.businessNo+"/"+new Date(value).getTime();
    // if(vm.settleType == 1){
    //     urlPath = baseURL + "order/ordercaralteration/transferMonthlyRentDebt/"+vm.businessNo+"/"+new Date(value).getTime();
    // }
    if (returncar_rent_settlement && returncar_rent_settlement_model == 1 && vm.preData.rentType != 8) {
        $.get(urlPath, function (r) {
            console.log(r);
            Vue.set(vm.applyForDTO, "rentAmount", toMoney(r.monthlyRentDebt));
            if (vm.settlementFeeItem.rentAmount) {
                Vue.set(vm.settlementFeeItem.rentAmount, "value", vm.applyForDTO.rentAmount);
            }
            Vue.set(vm.applyForDTO, "rentAmountRefundable", toMoney(r.monthlyRentRefundable));
            if (vm.settlementFeeItem.rentAmountRefundable) {
                Vue.set(vm.settlementFeeItem.rentAmountRefundable, "value", vm.applyForDTO.rentAmountRefundable);
            }
            Vue.set(vm.applyForDTO, "badBillRemark", r.badBillRemark);
            Vue.set(vm.applyForDTO, "astrideOtherOrderRemark", r.astrideOtherOrderRemark);
            vm.settleBodyId = 'settleBodyId_'+uuid(32);
            editcallback();
        });
    }
}
