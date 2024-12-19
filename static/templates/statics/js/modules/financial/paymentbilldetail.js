$(function () {
    vm.detail(window.localStorage.getItem("id"));
    layui.table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'financial/paymentbill/operation/list',
        where:{
            id:window.localStorage.getItem("id"),
        },
        cols: [[
            {
                field: 'paymentNo', align: "center", title: '应付单编号', templet: function (d) {
                    return isEmpty(d.paymentNo);
                }
            },
            {
                field: 'copeWithAmount', align: "center", title: '应付金额', templet: function (d) {
                    return isEmpty(d.copeWithAmount);
                }
            },
            {
                field: 'prepaidAmount', align: "center", title: '已实付金额', templet: function (d) {
                    return isEmpty(d.prepaidAmount);
                }
            },
            {
                field: 'paymentMethod', align: "center", title: '支付类型', templet: function (d) {
                    if(d.paymentMethod == 0){
                        return "其他";
                    }else if(d.paymentMethod == 1){
                        return "小程序支付";
                    }else if(d.paymentMethod == 2){
                        return "公账";
                    }else if(d.paymentMethod == 3){
                        return "私账";
                    }else if(d.paymentMethod == 4){
                        return "银行卡";
                    }else if(d.paymentMethod == 5){
                        return "支付宝";
                    }else if(d.paymentMethod == 6){
                        return "微信";
                    }else if(d.paymentMethod == 7){
                        return "信用卡";
                    }else if(d.paymentMethod == 8){
                        return "pos";
                    }else if(d.paymentMethod == 9){
                        return "现金";
                    }else if(d.paymentMethod == 11){
                        return "二维码";
                    }else if(d.paymentMethod == 12){
                        return "花芝租";
                    }else{
                        return '其他';
                    }

                }
            },
            {
                field: 'note', align: "center", title: '备注', templet: function (d) {
                    return isEmpty(d.note)
                }
            },
            {
                field: '', align: "center", title: '收款凭证', templet: function (d) {
                    return "<a class='layui-btn search-btn' onclick=pictureDetail(\'"+d.id+"\',\'"+d.id+"\')>查看</a>";
                }
            },
            {
                field: 'collectionTime', align: "center", title: '收款确认时间', templet: function (d) {
                return isEmpty(d.collectionTime);
            }
            },
            {
                field: 'createUserName', align: "center", title: '操作人', templet: function (d) {
                return isEmpty(d.createUserName);
            }
            },


        ]],
        page: false,
        // loading: true,
        // limits: [10, 20, 100, 200],
        limit: 100000
    });

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#yslogid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': window.localStorage.getItem("id"), "auditType": 31},
        cols: [[
            // {type:'checkbox'},
            // {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'operatorName', align: "center", title: '操作人', templet: function (d) {
                    return isEmpty(d.operatorName);
                }
            },
            {
                field: 'memo', align: "center", title: '操作内容', templet: function (d) {
                    return isEmpty(d.memo);
                }
            },
            {
                field: 'operatorTime', align: "center", title: '操作时间', templet: function (d) {
                    return isEmpty(d.operatorTime);
                }
            }


        ]],
        page: true,
        // loading: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });


});


var vm = new Vue({
    el: '#rrapp',
    data: {
        detailsTabContentList: ['详情', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '应付详情',
            '实付详情',
            '操作记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '应付详情',
        payment: {}
    },
    computed: {

        statusStr: {
            get: function () {
                if (this.payment.paymentStatus == 1) {
                    return "待付款";
                } else if (this.payment.paymentStatus == 2) {
                    return "已付款";
                }
            }
        },
        rentTypeStr: {
            get: function () {
                return getRentTypeStr(this.payment.carSource);
            }
        },
        brandNameAndSeriesName: {
            get: function () {
                return this.payment.brandName + "/" + this.payment.seriesName;
            }
        },
        paymentTypeStr: {
            get: function () {
                if (this.payment.paymentType == 0) {
                    return isEmpty(this.payment.paymentContent);
                } else if (this.payment.paymentType == 1) {
                    return "保证金";
                } else if (this.payment.paymentType == 2) {
                    return "租金";
                } else if (this.payment.paymentType == 3) {
                    return "首付款";
                } else if (this.payment.paymentType == 4) {
                    return "退车结算款";
                } else if (this.payment.paymentType == 5) {
                    return "换车结算款";
                } else if (this.payment.paymentType == 6) {
                    return "备用车结算款";
                }else if (this.payment.paymentType == 7) {
                    return "整备费";
                }else if (this.payment.paymentType == 8) {
                    return "尾款";
                }else if (this.payment.paymentType == 9) {
                    return "定金";
                }else if (this.payment.paymentType == 10) {
                    return "其他费用";
                }else if (this.payment.paymentType == 11) {
                    return "车辆总单价";
                }else if (this.payment.paymentType == 12) {
                    return "挂靠费";
                }else if (this.payment.paymentType == 13) {
                    return "应付转下期";
                }else if (this.payment.paymentType == 14) {
                    return "渠道返利";
                }else if(this.payment.paymentType == 15){
                    if(this.payment.extendType != null) {
                        if (13 == this.payment.extendType) {
                            return "超险罚款"
                        } else if (14 == this.payment.extendType) {
                            return "超保罚款"
                        } else if (11 == this.payment.extendType || 12 == this.payment.extendType) {
                            return this.payment.extendTypeName
                        } else if (2 == this.payment.extendType) {
                            return "商业险"
                        } else if (3 == this.payment.extendType) {
                            return "交强险"
                        } else if (4 == this.payment.extendType) {
                            return "承运险"
                        }else if(20 == this.payment.extendType) {
                            return "保养费用"
                        }else if(21 == this.payment.extendType) {
                            return "出险费用"
                        }

                        return "维保相关费用";
                    }
                }
            }
        },
    },

    methods: {
        // newMethods

        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = this.detailsSupTabContentList[param]
            // if (param === 1) {
            //     this.detailsSupTabContentListActiveValue = '操作记录';
            // } else if (param === 0) {
            //     this.detailsSupTabContentListActiveIndex = 0;
            //     this.detailsSupTabContentListActiveValue = '应收详情';
            // }
        },

        detailsSupTabContentBindtap(param, val) {

            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;

        },
        // newMethods   ENd

        cancel: function () {
            layer.closeAll();
        },

        detail: function (id) {
            $.get(baseURL + "financial/paymentbill/detail/" + id, function (res) {
                vm.payment = res.data;
                console.log("详情结果:{}",vm.payment)
            });

        }

    }
});

function pictureDetail (collectionsNo,collectionId) {
    window.localStorage.setItem("objType", 39);
    window.localStorage.setItem("objId", collectionsNo);
    window.localStorage.setItem("objCode", collectionId);
    var index = layer.open({
        title: "财务管理 > 应收单表 > 查看应收单 > 附件查看",
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


}
