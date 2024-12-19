$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'upload', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        //操作日志
        layui.table.render({
            id: "gridid",
            elem: '#record',
            url: baseURL + 'sys/operationlog/list',
            where: {'businessNo': window.localStorage.getItem("id"), "auditType": 5},
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
            limits: [10, 20, 100, 200],
            limit: 10
        });

        //银行卡信息
        bankTable(soulTable);
        // 支付宝代扣
        alipayTable(soulTable);
        //合同信息
        contractTable(soulTable);
        //车辆订单
        carOrderTable(soulTable);
        //应收账单
        accountsReceivableTable(soulTable)
        //已收账单
        receivablesTable(soulTable);
        //应退账单
        shouldRefundTable(soulTable);
        //已退账单
        refundTable(soulTable);
        //违章信息
        illegalTable(soulTable);

    });
});

var viewer = null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        list: [],
        accessoryList: [],
        idCardName: null,
        withholdSignStatusStr: null,
        detailsTabContentList: ['客户信息', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '基本信息',
            '合同信息',
            '车辆订单信息',
            '应收账单',
            '已收账单',
            '应退账单',
            '已退账单',
            '违章信息',
            '操作记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '基本信息',
        pictureDiv: null,
        idCardImgDiv: null,
        licenseImgDiv: null,
        driverImgDiv: null,
        bankCardImgDiv: null,
        personalDiv:false,
        withholdDiv:false,
        enterpriseDiv:false,
        customerTypeStr:false,
        orderCarCode:null,
    },
    computed: {},
    updated: function () {
        layui.form.render();
    },
    mounted: function () {
        this.initPage();
    },
    methods: {
        detailsTabContentBindtap: function (param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveValue = '基本信息';
            }
        },

        detailsSupTabContentBindtap: function (param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },
        initPage: function () {
            var id = window.localStorage.getItem("id");
            $.get(baseURL + "customer/info/" + id, function (res) {
                vm.list = res.data;
                vm.accessoryList = vm.list.accessoryList;
                showDetailData();
            })
        },
        showDoc: function (url, fileName) {
            console.log("查看附件：", url, fileName);
            if (viewer != null) {
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL + url,
                    title: fileName
                }
            ], {
                appendTo: 'body',
                zIndex: 99891018
            });
        },
        downDoc: function (url, fileName) {
            console.log("下载附件：", url, fileName);
            var uri = baseURL + 'file/download?uri=' + url + "&fileName=" + fileName;
            window.location.href = uri;
        },
        bankcardReload: function () {
            layui.table.reload('banklstid', {
                page: {
                    curr: 1
                },
                where: {
                    customerId: window.localStorage.getItem("id")
                }
            });
        },
        unsgin: function (data) {
            layer.confirm('确定要解绑该银行卡？', function(index){
                $.ajax({
                    type: "POST",
                    url: baseURL + 'customer/unsgin',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('操作成功', function () {
                                vm.bankcardReload();
                            });
                        } else {
                            layer.msg(r.msg, {icon: 5});
                        }
                    }
                });
            });
        },
        sgincard: function () {
            var param = {
                data: vm.list,
            };
            var index = layer.open({
                title: "签约绑卡",
                type: 2,
                boxParams: param,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/customer/sginview.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
    },
    created:function (){
        $.ajaxSettings.async = false;
        // 获取客户来源
        initCustomerSource();
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param && param.data) {
            _this.customerTypeStr = transformTypeByMap(param.data.customerCategory, {1:'潜在客户', 2:'成交客户'});
            _this.orderCarCode = param.data.orderCarCode;
        }
        $.ajaxSettings.async = true;
    }
});
/**
 * 初始化客户来源下拉框
 */
function initCustomerSource(){
    $.getJSON(baseURL + "sys/dict/getInfoByType/customerSource", function (data) {
        console.log('初始化客户来源下拉框')
        $.each(data.dict, function (index, item) {
            // 下拉菜单里添加元素
            $('#customerSource').append(new Option(item.value, item.code));
        });
        layui.form.render("select");
    });
}
/**
 * 合同信息
 */
function contractTable(soulTable) {
    layui.table.render({
        id: "contractTableId",
        elem: '#contractTable',
        url: baseURL + 'customer/contractList',
        where: {
            customerId: window.localStorage.getItem("id")
        },
        cols: [[
            {field: 'serialNo', width: 200, align: "center", type: 'numbers', title: '序号'},
            {
                field: 'contractNo', width: 200, align: "center", title: '合同编号', templet: function (d) {
                return isEmpty(d.contractNo);
            }
            },
            {
                field: 'rentType', width: 200, align: "center", title: '租赁类型', templet: function (d) {
                    return isEmpty(getRentTypeStr(d.rentType));

            }
            },
            {
                field: 'statusStr', width: 200, align: "center", title: '合同状态'
            },
            {
                field: 'lessorName', width: 200, align: "center", title: '售卖方', templet: function (d) {
                return isEmpty(d.lessorName);
            }
            },
            {
                field: 'timeStart', width: 200, align: "center", title: '合同生效时间', templet: function (d) {
                return isEmpty(d.timeStart);
            }
            },
            {
                field: 'timeFinish', width: 200, align: "center", title: '合同终止时间', templet: function (d) {
                return isEmpty(d.timeFinish);
            }
            },
            {
                field: 'operationName', width: 200, align: "center", title: '提交人', templet: function (d) {
                return isEmpty(d.operationName);
            }
            },
            {
                field: 'timeCreate', width: 200, align: "center", title: '合同记录时间', templet: function (d) {
                return isEmpty(d.timeCreate);
            }
            },
        ]],
        page: true,
        // loading: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: false
        }
        , done: function () {
            soulTable.render(this);
            $('div[lay-id="contractTableId"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
        }

    });
}

/**
 * 车辆订单信息
 */
function carOrderTable(soulTable) {
    layui.table.render({
        id: "carOrderTableId",
        elem: '#carOrderTable',
        url: baseURL + 'customer/carOrderList',
        where: {
            customerId: window.localStorage.getItem("id")
        },
        cols: [[
            {field: 'serialNo', align: "center", type: 'numbers', fixed: "left",title: '序号'},
            {
                field: 'carNo', align: "center", title: '车牌号',fixed: "left", templet: function (d) {
                return isEmpty(d.carNo);
            }
            },
            {
                field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                return isEmpty(d.vinNo);
            }
            },
            {
                align: "center", title: '品牌/车系/车型', templet: function (d) {
                return isEmpty(d.brandName + d.seriesName + d.modelName);
            }
            },
            {
                field: 'rentType', align: "center", title: '租赁类型', templet: function (d) {
                    return isEmpty(getRentTypeStr(d.rentType));

            }
            },
            {
                field: 'flowStatusShow', align: "center", title: '状态', templet: function (d) {
                return isEmpty(d.flowStatusShow);
            }
            },
            {
                field: 'swopDesc', align: "center", title: '车辆状态说明', templet: function (d) {
                return isEmpty(d.swopDesc);
            }
            },
            {
                field: 'tenancyStr', align: "center", title: '合同租期', templet: function (d) {
                return isEmpty(d.tenancyStr);
            }
            },
            {
                field: 'timeStartRent', align: "center", title: '租赁开始时间', templet: function (d) {
                return isEmpty(d.timeStartRent);
            }
            },
            {
                field: 'timeFinishRent', align: "center", title: '租赁结束时间', templet: function (d) {
                return isEmpty(d.timeFinishRent);
            }
            },
            {
                field: 'timeDelivery', align: "center", title: '提车时间', templet: function (d) {
                return isEmpty(d.timeDelivery);
            }
            },
            {
                field: 'timeReturn', align: "center", title: '实际还车时间', templet: function (d) {
                return isEmpty(d.timeReturn);
            }
            },
            {
                field: 'useDay', align: "center", title: '使用天数', templet: function (d) {
                return isEmpty(d.useDay);
            }
            },
            {
                field: 'lessorName', align: "center", title: '售卖方', templet: function (d) {
                return isEmpty(d.lessorName);
            }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: true
        }
        , done: function () {
            soulTable.render(this);
        }
    });
}

/**
 * 应收账单
 */
function accountsReceivableTable(soulTable) {
    layui.table.render({
        id: "accountsReceivableTableId",
        elem: '#accountsReceivableTable',
        url: baseURL + 'customer/receivablesList',
        where: {
            customerId: window.localStorage.getItem("id"),
            status: 1,
            orderCarCode: vm.orderCarCode
        },
        cols: [[
            {field: 'serialNo', align: "center", type: 'numbers', fixed: "left",title: '序号'},
            {
                field: 'carNo', align: "center", title: '车牌号',fixed: "left", templet: function (d) {
                return isEmpty(d.carNo);
            }
            },
            {
                field: 'receivablesNo', align: "center", title: '应收款单', templet: function (d) {
                return isEmpty(d.receivablesNo);
            }
            },
            {
                field: 'status', align: "center", title: '状态', templet: function (d) {
                if (d.status == 1) {
                    return "待收款";
                } else if (d.status == 2) {
                    return "已收款";
                } else {
                    return isEmpty(d.status);
                }
            }
            },
            {
                field: 'rentType', align: "center", title: '租赁类型', templet: function (d) {
                    return getBillRentTypeStr(d.rentType);

            }
            },

            {
                field: 'leaseName', align: "center", title: '出租人', templet: function (d) {
                return isEmpty(d.leaseName);
            }
            },
          
            {
                field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                return isEmpty(d.vinNo);
            }
            },
            {
                field: 'operationName', align: "center", title: '品牌/车系/车型', templet: function (d) {
                return isEmpty(d.brandName + d.seriesName + d.modelName);
            }
            },
            {
                field: 'collectionTypeShow', align: "center", title: '收款类型', templet: function (d) {
                return isEmpty(d.collectionTypeShow);
            }
            },
            {
                field: 'receivableAmount', align: "center", title: '应收金额', templet: function (d) {
                return isEmpty(d.receivableAmount);
            }
            },
            {
                field: 'receivedAmount', align: "center", title: '已收金额', templet: function (d) {
                return isEmpty(d.receivedAmount);
            }
            },
            {
                field: 'uncollectedAmount', align: "center", title: '待收金额', templet: function (d) {
                return isEmpty(d.uncollectedAmount);
            }
            },
            {
                field: 'receivableDate', align: "center", title: '应收日期', templet: function (d) {
                return dateFormatYMD(isEmpty(d.receivableDateDesc || d.receivableDate));
            }
            },
            {field: 'overdueDate', align: "center", title: '逾期期限', templet: function (d) {return isEmpty(d.overdueDate);}},
            {
                field: 'overdueDays', align: "center", title: '逾期天数', templet: function (d) {
                return isEmpty(receivableOverdueDays(d.status,d.hzType,d.overdueDate,d.actualDate)||d.overdueDays);
            }
            },
            {
                field: 'remarks', align: "center", title: '备注', templet: function (d) {
                return isEmpty(d.remarks);
            }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: true
        }
        , done: function () {
            soulTable.render(this);
        }
    });
}

/**
 * 已收账单
 */
function receivablesTable(soulTable) {
    layui.table.render({
        id: "receivablesTableId",
        elem: '#receivablesTable',
        url: baseURL + 'customer/receivablesList',
        where: {
            customerId: window.localStorage.getItem("id"),
            status: 2
        },
        cols: [[
            {align: "center", title: '序号',fixed: "left", type: 'numbers'},
            {
                field: 'carNo', align: "center", title: '车牌号',fixed: "left", templet: function (d) {
                return isEmpty(d.carNo);
            }
            },
            {
                field: 'collectionsNo', align: "center", title: '已收款单', templet: function (d) {
                return isEmpty(d.collectionsNo);
            }
            },
            {
                field: 'status', align: "center", title: '状态', templet: function (d) {
                if (d.status == 1) {
                    return "待收款";
                } else if (d.status == 2) {
                    return "已收款";
                } else {
                    return isEmpty(d.status);
                }
            }
            },
            {
                field: 'rentType', align: "center", title: '租赁类型', templet: function (d) {
                    return isEmpty(getBillRentTypeStr(d.rentType));

            }
            },

            {
                field: 'leaseName', align: "center", title: '出租人', templet: function (d) {
                return isEmpty(d.leaseName);
            }
            },
         
            {
                field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                return isEmpty(d.vinNo);
            }
            },
            {
                field: 'operationName', align: "center", title: '品牌/车系/车型', templet: function (d) {
                return isEmpty(d.brandName + d.seriesName + d.modelName);
            }
            },
            {
                field: 'collectionTypeShow', align: "center", title: '收款类型', templet: function (d) {
                return isEmpty(d.collectionTypeShow);
            }
            },
            {
                field: 'receivableAmount', align: "center", title: '应收金额', templet: function (d) {
                return isEmpty(d.receivableAmount);
            }
            },
            {
                field: 'receivedAmount', align: "center", title: '已收金额', templet: function (d) {
                return isEmpty(d.receivedAmount);
            }
            },
            {
                field: 'uncollectedAmount', align: "center", title: '待收金额', templet: function (d) {
                return isEmpty(d.uncollectedAmount);
            }
            },
            {
                field: 'receivableDate', align: "center", title: '应收日期', templet: function (d) {
                return isEmpty(d.receivableDate);
            }
            },
            {
                field: 'remarks', align: "center", title: '备注', templet: function (d) {
                return isEmpty(d.remarks);
            }
            },
            {
                field: 'paymentType', align: "center", title: '支付类型', templet: function (d) {
                if (d.paymentType == 0) {
                    return "其他";
                } else if (d.paymentType == 1) {
                    return "微信小程序支付";
                } else if (d.paymentType == 2) {
                    return "公帐";
                } else if (d.paymentType == 3) {
                    return "私帐";
                } else if (d.paymentType == 4) {
                    return "银行卡";
                } else if (d.paymentType == 5) {
                    return "支付宝";
                } else if (d.paymentType == 6) {
                    return "微信";
                } else if (d.paymentType == 7) {
                    return "信用卡";
                } else if (d.paymentType == 8) {
                    return "pos";
                } else if (d.paymentType == 9) {
                    return "现金";
                } else if (d.paymentType == 11) {
                    return '二维码';
                } else if (d.paymentType == 12) {
                    return '花芝租';
                } else if (d.paymentType == 21) {
                    return '支付宝代扣';
                } else {
                    return isEmpty(d.paymentMethod);
                }
            }
            },
            {
                field: 'actualDate', align: "center", title: '收款确认时间', templet: function (d) {
                return isEmpty(d.actualDate);
            }
            },
            {
                field: 'userName', align: "center", title: '操作人', templet: function (d) {
                return isEmpty(d.userName);
            }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: true
        }
        , done: function () {
            soulTable.render(this);
        }
    });
}

/**
 * 应退账单
 */
function shouldRefundTable(soulTable) {
    layui.table.render({
        id: "shouldRefundTableId",
        elem: '#shouldRefundTable',
        url: baseURL + 'financial/shouldrefund/list',
        where: {
            customerId: window.localStorage.getItem("id"),
            status: 0
        },
        cols: [[
            {field: 'serialNo', align: "center", type: 'numbers',fixed: "left", title: '序号'},
            {
                field: 'carNo', align: "center", title: '车牌号',fixed: "left", templet: function (d) {
                return isEmpty(d.carNo);
            }
            },
            {
                field: 'refundNo', align: "center", title: '退款单', templet: function (d) {
                return isEmpty(d.refundNo);
            }
            },
            {
                field: 'refundStatus', align: "center", title: '状态', templet: function (d) {
                if (d.refundStatus == 0) {
                    return "待退款";
                } else if (d.refundStatus == 1) {
                    return "已退款";
                } else {
                    return isEmpty(d.refundStatus);
                }

            }
            },
            {
                field: 'leaseType', align: "center", title: '租赁类型', templet: function (d) {
                    return isEmpty(getRentTypeStr(d.leaseType));
            }
            },
            {
                field: 'lessorName', align: "center", title: '售卖方', templet: function (d) {
                return isEmpty(d.lessorName);
            }
            },
            
            {
                field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                return isEmpty(d.vinNo);
            }
            },
            {
                align: "center", title: '品牌/车系/车型', templet: function (d) {
                return isEmpty(d.brand + d.carModel);
            }
            },
            {
                field: 'refundType', align: "center", title: '退款类型', templet: function (d) {
                if(d.refundType == 0){
                    return "其他";
                } else if (d.refundType == 1) {
                    return '换车结算单';
                } else if (d.refundType == 2) {
                    return '退车结算单';
                } else if (d.refundType == 3) {
                    return '备用车结算单';
                } else if (d.refundType == 4) {
                    return '保证金';
                } else if (d.refundType == 5) {
                    return '租金';
                } else {
                    return isEmpty(d.refundType)
                }

            }
            },
            {
                align: "refundAmount", title: '应退款金额', templet: function (d) {
                return isEmpty(d.refundAmount);
            }
            },
            {
                align: "settleAmount", title: '结算扣款金额', templet: function (d) {
                return isEmpty(d.settleAmount);
            }
            },
            {
                align: "deductSubjects", title: '扣款科目/金额', templet: function (d) {
                return isEmpty(d.deductSubjects);
            }
            },
            {
                align: "actualRefund", title: '实际待退款金额', templet: function (d) {
                return isEmpty(d.actualRefund);
            }
            },
            {
                align: "refundTime", title: '应退款日期', templet: function (d) {
                return isEmpty(d.refundTime);
            }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: true
        }
        , done: function () {
            soulTable.render(this);
        }
    });
}

/**
 * 已退账单
 */
function refundTable(soulTable) {
    layui.table.render({
        id: "refundTableId",
        elem: '#refundTable',
        url: baseURL + 'financial/shouldrefund/list',
        where: {
            customerId: window.localStorage.getItem("id"),
            refundState: 1
        },
        cols: [[
            {field: 'serialNo', align: "center", type: 'numbers',fixed: "left", title: '序号'},
            {
                field: 'carNo', align: "center", title: '车牌号',fixed: "left", templet: function (d) {
                return isEmpty(d.carNo);
            }
            },
            {
                field: 'refundNo', align: "center", title: '退款单', templet: function (d) {
                return isEmpty(d.refundNo);
            }
            },
            {
                field: 'refundStatus', align: "center", title: '状态', templet: function (d) {
                if (d.refundStatus == 0) {
                    return "待退款";
                } else if (d.refundStatus == 1) {
                    return "已退款";
                } else {
                    return isEmpty(d.refundStatus);
                }

            }
            },
            {
                field: 'leaseType', align: "center", title: '租赁类型', templet: function (d) {
                    return isEmpty(getRentTypeStr(d.leaseType));
            }
            },
            {
                field: 'lessorName', align: "center", title: '售卖方', templet: function (d) {
                return isEmpty(d.lessorName);
            }
            },
           
            {
                field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                return isEmpty(d.vinNo);
            }
            },
            {
                align: "center", title: '品牌/车系/车型', templet: function (d) {
                return isEmpty(d.brand + d.carModel);
            }
            },
            {
                field: 'refundType', align: "center", title: '退款类型', templet: function (d) {
                if (d.refundType == 0) {
                    return "其他";
                } else if (d.refundType == 1) {
                    return "换车结算单";
                } else if (d.refundType == 2) {
                    return "退车结算单";
                } else if (d.refundType == 3) {
                    return "备用车结算单";
                } else if (d.refundType == 4) {
                    return "保证金";
                } else if (d.refundType == 5) {
                    return "租金";
                } else {
                    return isEmpty(d.refundType);
                }
            }
            },
            {
                align: "refundAmount", title: '应退款金额', templet: function (d) {
                return isEmpty(d.refundAmount);
            }
            },
            {
                align: "settleAmount", title: '结算扣款金额', templet: function (d) {
                return isEmpty(d.settleAmount);
            }
            },
            {
                align: "deductSubjects", title: '扣款科目/金额', templet: function (d) {
                return isEmpty(d.deductSubjects);
            }
            },
            {
                align: "actualRefund", title: '实际待退款金额', templet: function (d) {
                return isEmpty(d.actualRefund);
            }
            },
            {
                align: "refundTime", title: '应退款日期', templet: function (d) {
                return isEmpty(d.refundTime);
            }
            },
            {
                align: "refundWay", title: '退款方式', templet: function (d) {
                if (d.refundWay == 1) {
                    return "余额";
                } else if (d.refundWay == 2) {
                    return "银行卡";
                } else if (d.refundWay == 3) {
                    return "支付宝";
                } else if (d.refundWay == 4) {
                    return "微信";
                } else if (d.refundWay == 5) {
                    return "现金";
                } else if (d.refundWay == 6) {
                    return "其他";
                } else {
                    return isEmpty(d.refundWay)
                }
            }
            },
            {
                align: "actualTime", title: '实际处理日期', templet: function (d) {
                return isEmpty(d.actualTime);
            }
            },
            // {
            //     align: "userName", title: '操作人', templet: function (d) {
            //     return isEmpty(d.userName);
            // }
            // },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: true
        }
        , done: function () {
            soulTable.render(this);
        }
    });
}

/**
 * 违章信息
 */
function illegalTable(soulTable) {
    layui.table.render({
        id: "illegalTableId",
        elem: '#illegalTable',
        url: baseURL + 'customer/illegalList',
        where: {
            customerId: window.localStorage.getItem("id")
        },
        cols: [[

            {field: 'serialNo', align: "center", type: 'numbers',title: '车牌号', title: '序号'},
            {
                field: 'carNo', align: "center", title: '车牌号', fixed: "left",templet: function (d) {
                return isEmpty(d.carNo);
            }
            },
            {
                field: 'vinNo', align: "center", title: '车架号', templet: function (d) {
                return isEmpty(d.vinNo);
            }
            },
            {
                align: "center", title: '品牌/车系/车型', templet: function (d) {
                return isEmpty(d.brandName + d.seriesName + d.modelName);
            }
            },
            {
                field: 'businessType', align: "center", title: '车辆状态', templet: function (d) {
                if (d.businessType == 1) {
                    return "整备中";
                } else if (d.businessType == 2) {
                    return "备发车";
                } else if (d.businessType == 3) {
                    return "预定中";
                } else if (d.businessType == 4) {
                    return "用车中";
                } else if (d.businessType == 5) {
                    return "已过户";
                } else if (d.businessType == 6) {
                    return "已处置";
                } else if (d.businessType == 7) {
                    return "已出售";
                } else {
                    return isEmpty(d.businessType);
                }

            }
            },
            {
                field: 'illegalTime', align: "center", title: '违章时间', templet: function (d) {
                return isEmpty(d.illegalTime);
            }
            },
            {
                field: 'pointsDeduction', align: "center", title: '违章扣分', templet: function (d) {
                return isEmpty(d.pointsDeduction);
            }
            },
            {
                field: 'illegalFines', align: "center", title: '违章罚款', templet: function (d) {
                return isEmpty(d.illegalFines);
            }
            },
            {
                field: 'illegalDetatl', align: "center", title: '违章内容', templet: function (d) {
                return isEmpty(d.illegalDetatl);
            }
            },
            {
                field: 'illegalLocation', align: "center", title: '违章扣分', templet: function (d) {
                return isEmpty(d.illegalLocation);
            }
            },
            {
                field: 'illegalType', align: "center", title: '违章类型', templet: function (d) {
                if (d.illegalType == 1) {
                    return "未系安全带2";
                }
                else if (d.illegalType == 2) {
                    return "压禁止标线";
                }
                else if (d.illegalType == 3) {
                    return "违停";
                }
                else if (d.illegalType == 4) {
                    return "闯红灯";
                }
                else if (d.illegalType == 5) {
                    return "不服从指挥";
                }
                else if (d.illegalType == 6) {
                    return "超速行驶";
                }
                else if (d.illegalType == 7) {
                    return "未设警告标志";
                }
                else if (d.illegalType == 8) {
                    return "未停车让行";
                }
                else if (d.illegalType == 9) {
                    return "未保持车距";
                }
                else if (d.illegalType == 10) {
                    return "未按道行驶";
                }
                else {
                    return isEmpty(d.illegalType);
                }
            }
            },
            {
                field: 'lessorName', align: "center", title: '售卖方', templet: function (d) {
                return isEmpty(d.lessorName);
            }
            },
            {
                field: 'memo', align: "center", title: '备注', templet: function (d) {
                return isEmpty(d.memo);
            }
            },
            {
                field: 'createTime', align: "center", title: '处理时间', templet: function (d) {
                return isEmpty(d.createTime);
            }
            },
            {
                field: 'userName', align: "center", title: '操作人', templet: function (d) {
                return isEmpty(d.userName);
            }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
        , autoColumnWidth: {
            init: true
        }
        , done: function () {
            soulTable.render(this);
        }
    });
}

/**
 * 违章信息
 */
function bankTable(soulTable) {
    layui.table.render({
        id: "banklstid",
        elem: '#bankLst',
        url: baseURL + 'customer/bankList',
        where: {
            customerId: window.localStorage.getItem("id")
        },
        cols: [[
            // {type:'checkbox'},
            {title: '操作', width: 120, templet: '#bankbarTpl', align: "center"},
            {field: 'cardImgFront', width: 250, align: "center", title: '银行卡正面', templet: function (d) {
                    var url = imageURL + d.cardImgFront;
                    return '<img src="'+url+'" class="view-img" style="height: 120px;width: 220px;object-fit: contain;overflow: hidden;"/>';
                }
            },
            {field: 'cardImgBack', width: 250, align: "center", title: '银行卡背面', templet: function (d) {
                    var url = imageURL + d.cardImgBack;
                    return '<img src="'+url+'" class="view-img" style="height: 120px;width: 220px;object-fit: contain;overflow: hidden;"/>';
                }
            },
            {field: 'bankDeposit', align: "center", title: '银行开户行', templet: function (d) {return isEmpty(d.bankDeposit);}},
            {field: 'bankCardNo', align: "center", title: '银行卡号', templet: function (d) {return isEmpty(d.bankCardNo);}},
            {field: 'mobileNo', align: "center", title: '预留手机号', templet: function (d) {return isEmpty(d.mobileNo);}},
            {field: 'createTime', align: "center", title: '绑定时间', templet: function (d) {return dateFormatYMDHM(d.createTime);}},
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function () {
            soulTable.render(this);
        }
    });

    layui.table.on('tool(bankLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'unsgin'){
            vm.unsgin(data);
        } else if(layEvent === 'viewreceivables'){
            // vm.viewreceivables(data);
        }
    });
}

// 支付宝代扣
function alipayTable(soulTable) {
    layui.table.render({
        id: "alipayList",
        elem: '#alipayList',
        url: baseURL + 'alipay/alipaysign/queryList',
        where: {
            customerId: window.localStorage.getItem("id")
        },
        cols: [[
            {field: 'signTime', width: 250, align: "center", title: '签约时间', templet: function (d) {
                    return isEmpty(d.signTime);
                }
            },
            {field: 'status', width: 250, align: "center", title: '签约产品', templet: function (d) {
                    return '普通代扣';
                }
            },
            {field: 'timeUnsign', align: "center", title: '解约时间', templet: function (d) {return isEmpty(d.timeUnsign);}},
            {field: 'status', align: "center", title: '状态', templet: function (d) {
                    if (d.status == 0 || d.status == 1 || d.status == 91) {
                        return '未签约';
                    } else if (d.status == 3) {
                        return '已签约';
                    }  else if (d.status == 4) {
                        return '已解约';
                    } else if (d.status == 2) {
                        return '签约失败';
                    }else {
                        return '--';
                    }

            }},
            {field: 'remark', align: "center", title: '签约失败原因', templet: function (d) {return isEmpty(d.remark);}},
        ]],
        page: true,
        limits: [5, 10, 20, 50],
        limit: 5,
        autoColumnWidth: {
            init: false
        },
        done: function () {
            soulTable.render(this);
        }
    });
}

function showDetailData() {
    console.log("用户信息：",vm.list)
    if (vm.list.withholdSignStatus == null && vm.list.withholdSignStatus == null
        && vm.list.withholdSignStatus == null && vm.list.withholdSignStatus == null) {
        vm.withholdDiv = false;
    }else{
        if(vm.list.withholdSignStatus == 0 || vm.list.withholdSignStatus == 1 || vm.list.withholdSignStatus == 91){
            vm.withholdSignStatusStr = '未签约';
        }else if(vm.list.withholdSignStatus == 2){
            vm.withholdSignStatusStr = '签约失败';
        }else if(vm.list.withholdSignStatus == 3){
            vm.withholdSignStatusStr = '已签约';
        }else if(vm.list.withholdSignStatus == 4){
            vm.withholdSignStatusStr = '已解约';
        }
        vm.withholdDiv = true;
    }
    console.log("签约状态：",vm.withholdSignStatusStr)
    if (vm.list.idCardImg == null && vm.list.bankCardImg == null
        && vm.list.driverImg == null && vm.list.licenseImg == null) {
        vm.pictureDiv = false;
    }else{
        vm.pictureDiv = true;
    }
    if (vm.list.idCardImg != null) {
        vm.idCardImgDiv = true;
        $("#idCardImg").attr("src", fileURL + vm.list.idCardImg);
        $("#idCardImgBack").attr("src", fileURL + vm.list.idCardImgBack);
    } else {
        vm.idCardImgDiv = false;
    }
    if (vm.list.bankCardImg != null) {
        vm.bankCardImgDiv = true;
        $("#bankCardImg").attr("src", fileURL + vm.list.bankCardImg);
    } else {
        vm.bankCardImgDiv = false;
    }
    if (vm.list.customerType == 1) { // 企业
        vm.idCardName = '法人身份证';
        if (vm.list.licenseImg != null) {
            vm.licenseImgDiv = true;
            $("#licenseImg").attr("src", fileURL + vm.list.licenseImg);
        } else {
            vm.licenseImgDiv = false;
        }
        $("#licenseDiv").show();
        $("#driverDiv").hide();
        vm.enterpriseDiv = true;
        vm.personalDiv = false;
    } else {	// 个人
        vm.idCardName = '身份证';
        if (vm.list.driverImg != null) {
            vm.driverImgDiv = true;
            $("#driverImg").attr("src", fileURL + vm.list.driverImg);
            $("#driverImgBack").attr("src", fileURL + vm.list.driverImgBack);
        } else {
            vm.driverImgDiv = false;
        }
        $("#driverDiv").show();
        $("#licenseDiv").hide();
        vm.enterpriseDiv = false;
        vm.personalDiv = true;
    }
}
