$(function () {
    var  paymentId=window.localStorage.getItem("paymentId");
    vm.detail(paymentId);
    vm.paymentId=paymentId;
});


var vm = new Vue({
    el: '#rrapp',
    data: {
        paymentDetail: {},
        paymentId:null,
        listFile:[]
    },
    computed: {
        payTypeStr: {
            get: function () {
                //付款类型：0、其他，1、保证金，2、租金，3、首付款，4、退车结算款，5、换车结算款，6、备用车结算款，7、整备费，8、尾款，9、定金，10、其他费用，11、车辆总单价
                if (this.paymentDetail.payType ==0) {
                    return "其他";
                }else if (this.paymentDetail.payType == 1) {
                    return "保证金";
                } else if (this.paymentDetail.payType == 2) {
                    return "租金";
                } else if (this.paymentDetail.payType == 3) {
                    return "首付款";
                } else if (this.paymentDetail.payType == 4) {
                    return "退车结算款";
                } else if (this.paymentDetail.payType == 5) {
                    return "换车结算款";
                } else if (this.paymentDetail.payType == 6) {
                    return "备用车结算款";
                } else if (this.paymentDetail.payType == 7) {
                    return "整备费";
                } else if (this.paymentDetail.payType == 8) {
                    return "尾款";
                } else if (this.paymentDetail.payType == 9) {
                    return "定金";
                } else if (this.paymentDetail.payType ==10) {
                    return "其他费用";
                }else if (this.paymentDetail.payType ==11) {
                    return "车辆总单价";
                }else {
                    return "--";
                }
            }
        },
        rentTypeStr: {
            get: function () {
                //'租赁类型：1、经租 2、以租代购 3、展示车 4、试驾车 5、融租 6、直购
                if (this.paymentDetail.rentType == 1) {
                    return "经租";
                } else if (this.paymentDetail.rentType == 2) {
                    return "以租代购";
                } else if (this.paymentDetail.rentType == 3) {
                    return "展示车";
                } else if (this.paymentDetail.rentType == 4) {
                    return "试驾车";
                } else if (this.paymentDetail.rentType == 5) {
                    return "融租";
                } else if (this.paymentDetail.rentType == 6) {
                    return "直购";
                } else {
                    return "--";
                }
            }
        },
        /*stageStr: {
            get: function () {
                if (this.paymentDetail.stage == null || this.paymentDetail.stage == "") {
                    return "--";
                } else if (this.paymentDetail.collectionType == 2) {
                    return this.paymentDetail.stage + "期";
                } else {
                    return "--";
                }
            }
        },*/
        isCarUseStr: {
            //是否先用车：1、否，2、是
            get: function () {
                if (this.paymentDetail.isCarUse == 1) {
                    return "否";
                } else if (this.paymentDetail.isCarUse == 2) {
                    return "是";
                }else {
                    return "--";
                }
            }
        },
        isBalanceStr: {
            //是否余额抵扣：1、是，2、否
            get: function () {
                if (this.paymentDetail.isBalance == 1) {
                    return "是";
                } else if (this.paymentDetail.isBalance == 2) {
                    return "否";
                }else {
                    return "--";
                }
            }
        },
        paymentTypeStr: {
            get: function () {
                //支付类型：0、其他，1、微信小程序支付，2、公帐，3、私帐，4、银行卡，5、支付宝，6、微信，7、信用卡，8、pos，9、现金
                if (this.paymentDetail.paymentType == 1) {
                    return '客户退款支付';
                } else if (this.paymentDetail.paymentType == 2) {
                    return '供应商支付';
                }  else {
                    return '--';
                }
            }
        },
        customerTypeStr: {
            get: function () {
                if (this.paymentDetail.customerType == 1) {
                    return '客户/企业';
                } else if (this.paymentDetail.customerType == 2) {
                    return '客户/个人';
                }  else if (this.paymentDetail.customerType ==3) {
                    return '渠道/个人';
                }  else if (this.paymentDetail.customerType ==4) {
                    return '渠道/企业';
                }  else {
                    return '--';
                }
            }
        },
        customerTypeStr: {
            get: function () {
                if (this.paymentDetail.customerType == 1) {
                    return '客户/企业';
                } else if (this.paymentDetail.customerType == 2) {
                    return '客户/个人';
                }  else if (this.paymentDetail.customerType ==3) {
                    return '渠道/个人';
                }  else if (this.paymentDetail.customerType ==4) {
                    return '渠道/企业';
                }  else {
                    return '--';
                }
            }
        },
    },

    methods: {
        cancel: function () {
            parent.layer.closeAll();
        },

        // 附件查看
        viewAccessory:function(){
            window.localStorage.setItem("objType", 3);
            window.localStorage.setItem("objId", vm.paymentDetail.paymentId);
            window.localStorage.setItem("objCode", vm.paymentDetail.paymentNo);

            var index = layer.open({
                title: "财务管理 > 交易流水 > 已付详情 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },
        detail: function (paymentId) {
            $.ajax({
                type: "POST",
                url: baseURL + "payment/payment/info/"+paymentId,
                contentType: "application/json",
                data: {},
                success: function(r){
                     vm.paymentDetail=r.paymentEntity;
                     console.log(JSON.stringify(vm.paymentDetail));
                     /*vm.listFile = r.paymentEntity.sysAccessoryList;
                     if(vm.listFile.length == 0){
                         $("#fileModel").hide();
                     }*/
                }
            });

        },
        jumpToContract:function(){
            window.localStorage.setItem("contractNo", vm.paymentDetail.contractNo);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情>订单合同列表",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/contract/contracordernotemplatelist.html',
                end: function () {
                    layer.close(index);
                  //window.localStorage.setItem("contractNo",null);
                }
            });
            layer.full(index);
        },
        jumpToOrder:function(){
            window.localStorage.setItem("businessNo", vm.paymentDetail.businessNo);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情>订单列表",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/order/orderlist.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
    }
});

