$(function () {
    var  collectionId=window.localStorage.getItem("collectionId");
    vm.detail(collectionId);
    vm.collectionId=collectionId;
});


var vm = new Vue({
    el: '#rrapp',
    data: {
        collectionDetail: {},
        collectionId:null,
        listFile:[]
    },
    computed: {
        brandNameAndseriesNameStr: {
            get: function () {
                return this.collectionDetail.brandName + "/" + this.collectionDetail.seriesName;
            }
        },
        paymentMethodStr: {
            get: function () {
                if (this.collectionDetail.collectionType == 2) {
                    if (this.collectionDetail.paymentMethod == 1) {
                        return "月付";
                    } else if (this.collectionDetail.paymentMethod == 2) {
                        return "两月付";
                    } else if (this.collectionDetail.paymentMethod == 3) {
                        return "季付";
                    } else if (this.collectionDetail.paymentMethod == 6) {
                        return "半年付";
                    } else if (this.collectionDetail.paymentMethod == 4) {
                        return "年付";
                    } else if (this.collectionDetail.paymentMethod == 5) {
                        return "一次性付款";
                    } else if (this.collectionDetail.paymentMethod == 7) {
                        return "日付";
                    } else if (this.collectionDetail.paymentMethod == 8) {
                        return "周付";
                    }
                } else {
                    return "--";
                }
            }
        },
        collectionTypeStr: {
            get: function () {
                if (this.collectionDetail.collectionType == 1) {
                    return "保证金";
                } else if (this.collectionDetail.collectionType == 2) {
                    return "租金";
                } else if (this.collectionDetail.collectionType == 3) {
                    return "首付款";
                } else if (this.collectionDetail.collectionType == 4) {
                    return "退车结算款";
                } else if (this.collectionDetail.collectionType == 5) {
                    return "换车结算款";
                } else if (this.collectionDetail.collectionType == 6) {
                    return "备用车结算款";
                }else {
                    return "--";
                }
            }
        },
        stageStr: {
            get: function () {
                if (this.collectionDetail.stage == null || this.collectionDetail.stage == "") {
                    return "--";
                } else if (this.collectionDetail.collectionType == 2) {
                    return this.collectionDetail.stage + "期";
                } else {
                    return "--";
                }
            }
        },
        isCarUseStr: {
            //是否先用车：1、否，2、是
            get: function () {
                if (this.collectionDetail.isCarUse == 1) {
                    return "否";
                } else if (this.collectionDetail.isCarUse == 2) {
                    return "是";
                }else {
                    return "--";
                }
            }
        },
        isBalanceStr: {
            //是否余额抵扣：1、是，2、否
            get: function () {
                if (this.collectionDetail.isBalance == 1) {
                    return "是";
                } else if (this.collectionDetail.isBalance == 2) {
                    return "否";
                }else {
                    return "--";
                }
            }
        },
        isMarginStr: {
            //是否余额抵扣：1、是，2、否
            get: function () {
                if (this.collectionDetail.isMargin == 1) {
                    return "是";
                } else if (this.collectionDetail.isMargin == 2) {
                    return "否";
                }else {
                    return "--";
                }
            }
        },
        colleTypeStr: {
            get: function () {
                if (this.collectionDetail.collectionType == 0) {
                    return '费用明细';
                } else if (this.collectionDetail.collectionType == 1) {
                    return '保证金费用明细';
                } else if (this.collectionDetail.collectionType == 2) {
                    return '租金费用明细';
                } else if (this.collectionDetail.collectionType == 3) {
                    return '首付款费用明细';
                } else if (this.collectionDetail.collectionType == 4) {
                    return '退车费用明细';
                } else if (this.collectionDetail.collectionType == 5) {
                    return '换车费用明细';
                } else if (this.collectionDetail.collectionType == 6) {
                    return '备用车费用明细';
                } else {
                    return '--';
                }
            }
        },
        paymentTypeStr: {
            get: function () {
                //支付类型：0、其他，1、微信小程序支付，2、公帐，3、私帐，4、银行卡，5、支付宝，6、微信，7、信用卡，8、pos，9、现金
                if (this.collectionDetail.paymentType == 0) {
                    return '其他';
                } else if (this.collectionDetail.paymentType == 1) {
                    return '微信小程序支付';
                } else if (this.collectionDetail.paymentType == 2) {
                    return '公帐';
                } else if (this.collectionDetail.paymentType == 3) {
                    return '私帐';
                } else if (this.collectionDetail.paymentType == 4) {
                    return '银行卡';
                } else if (this.collectionDetail.paymentType == 5) {
                    return '支付宝';
                } else if (this.collectionDetail.paymentType == 6) {
                    return '微信';
                } else if (this.collectionDetail.paymentType == 7) {
                    return '信用卡';
                } else if (this.collectionDetail.paymentType == 8) {
                    return 'pos';
                } else if (this.collectionDetail.paymentType == 9) {
                    return '现金，';
                } else if (this.collectionDetail.paymentType == 21) {
                    return '支付宝代扣，';
                } else {
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
            window.localStorage.setItem("objId", vm.collectionDetail.collectionsNo);
            window.localStorage.setItem("objCode", vm.collectionDetail.collectionId);

            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情 > 附件查看",
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


/*        preview:function(){
            window.localStorage.setItem("collectionsNo", vm.collectionDetail.collectionsNo);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情>图片预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/pictureDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("collectionsNo", null);
                }
            });
            layer.full(index);
        },
        download:function(){
            //获取收款单主键
            window.localStorage.setItem("collectionsNo", vm.collectionDetail.collectionsNo);
            window.localStorage.setItem("objType",3);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情>文档下载",
                type: 2,
                area: ['1070px', '360px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                end: function () {
                    window.localStorage.setItem("collectionsNo", null);
                    layer.close(index);
                }
            });
            layer.full(index);
        },*/
        detail: function (collectionId) {
            $.ajax({
                type: "POST",
                url: baseURL + "financial/collection/info/"+collectionId,
                contentType: "application/json",
                data: {},
                success: function(r){
                     vm.collectionDetail=r.collection;
                     vm.listFile = r.collection.listFile;
                     if(vm.listFile.length == 0){
                         $("#fileModel").hide();
                     }
                     if(r.collection!=null){
                         var  collectionType=r.collection.collectionType;
                         //收款类型保证金
                         if(collectionType==1){
                             $("#receivableAmountDiv").hide();
                             $("#receivedAmountDiv").hide();
                         }else {
                             $("#receivableAmountDiv").show();
                             $("#receivedAmountDiv").show();
                             $("#cashDepositDiv").hide();
                             $("#receivableAmountDepositDiv").hide();
                             $("#receivedAmountDepositDiv").hide();
                         }
                     }
                }
            });

        },
        jumpToContract:function(){
            if (vm.collectionDetail.contractNo.match(/^(.*?)QYHT(\d+?)$/)) {
                $.get(baseURL + "contract/contracbusiness/infoByCode/"+vm.collectionDetail.contractNo, function(r){
                    var param = {
                        data:r.contracbusiness
                    };
                    var index = layer.open({
                        title: "财务管理 > 交易流水 > 已收详情>订单合同",
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
                $.get(baseURL + "contract/contracordernotemplate/infoByCode/" + vm.collectionDetail.contractNo, function (r) {
                    var param = {
                        contracorderNotemplate: r.contracorderNotemplate,
                        statusStr: r.contracorderNotemplate.statusStr
                    };
                    var index = layer.open({
                        title: "财务管理 > 交易流水 > 已收详情>订单合同",
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
        jumpToOrder:function(){
            window.localStorage.setItem("businessNo", vm.collectionDetail.businessNo);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情>订单列表",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/order/orderlistnew.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
    }
});

