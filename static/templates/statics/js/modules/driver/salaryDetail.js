$(function () {
    vm.detail(window.localStorage.getItem("receivablesId"));
    //收款信息
    layui.table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'financial/collection/ysdlist',
        where: {'receivablesNo': window.localStorage.getItem("receivablesNo")},
        cols: [[
            // {type:'checkbox'},
            // {title: '操作', width: 120, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'collectionsNo', align: "center", title: '收款单编号', templet: function (d) {
                    return isEmpty(d.collectionsNo);
                }
            },
            {field: 'receivablesNo', title: '应收单编号'},
            {
                field: 'receivableAmount', align: "center", title: '应收金额', templet: function (d) {
                    return isEmpty(d.receivableAmount);
                }
            },
            {
                field: 'receivedAmount', align: "center", title: '实收金额', templet: function (d) {
                    return isEmpty(d.receivedAmount);
                }
            },
            {
                field: 'isCarUse', align: "center", title: '是否先用车', templet: function (d) {
                    if (d.isCarUse == 1) {
                        return '否';
                    } else if (d.isCarUse == 2) {
                        return '是';
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'isBalance', align: "center", title: '余额是否抵扣', templet: function (d) {
                    if (d.isBalance == 1) {
                        return '是';
                    } else if (d.isBalance == 2) {
                        return '否';
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'balanceAmount', align: "center", title: '抵扣金额', templet: function (d) {
                    return isEmpty(d.balanceAmount);
                }
            },
            {
                field: 'isMargin', align: "center", title: '保证金是否抵扣', templet: function (d) {
                    if (d.isMargin == 1) {
                        return '是';
                    } else if (d.isMargin == 2) {
                        return '否';
                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'marginDeductionAmount', align: "center", title: '保证金抵扣金额', templet: function (d) {
                    return isEmpty(d.marginDeductionAmount);
                }
            },


            {
                field: 'paymentType', align: "center", title: '支付类型', templet: function (d) {
                    if (d.paymentType == 1) {
                        if (d.status == 1) {
                            return '微信小程序支付+余额';
                        } else {
                            return '微信小程序支付';
                        }
                    } else if (d.paymentType == 2) {
                        if (d.status == 1) {
                            return '公帐+余额';
                        } else {
                            return '公帐';
                        }
                    } else if (d.paymentType == 3) {
                        if (d.status == 1) {
                            return '私帐+余额';
                        } else {
                            return '私帐';
                        }
                    } else if (d.paymentType == 4) {
                        if (d.status == 1) {
                            return '银行卡+余额';
                        } else {
                            return '银行卡';
                        }
                    } else if (d.paymentType == 5) {
                        if (d.status == 1) {
                            return '支付宝+余额';
                        } else {
                            return '支付宝';
                        }
                    } else if (d.paymentType == 6) {
                        if (d.status == 1) {
                            return '微信+余额';
                        } else {
                            return '微信';
                        }
                    } else if (d.paymentType == 7) {
                        if (d.status == 1) {
                            return '信用卡+余额';
                        } else {
                            return '信用卡';
                        }
                    } else if (d.paymentType == 8) {
                        if (d.status == 1) {
                            return 'pos+余额';
                        } else {
                            return 'pos';
                        }
                    } else if (d.paymentType == 9) {
                        if (d.status == 1) {
                            return '现金+余额';
                        } else {
                            return '现金';
                        }
                    } else if (d.paymentType == 10) {
                        return '余额抵扣';
                    } else if (d.paymentType == 11) {
                        if (d.status == 1) {
                            return '二维码+余额';
                        } else {
                            return '二维码';
                        }
                    } else if (d.paymentType == 12) {
                        if (d.status == 1) {
                            return '花芝租+余额';
                        } else {
                            return '花芝租';
                        }
                    } else if (d.paymentType == 21) {

                        return '支付宝代扣';

                    } else {
                        return '--';
                    }
                }
            },
            {
                field: 'remarks', align: "center", title: '备注', templet: function (d) {
                    return isEmpty(d.remarks);
                }
            },
            {
                field: '', align: "center", title: '收款凭证', templet: function (d) {
                   // return "<a class='layui-btn search-btn' onclick='pictureDetail("+d.collectionsNo+");'>查看</a>"  ;
                    return "<a class='layui-btn search-btn' onclick=pictureDetail(\'"+d.collectionsNo+"\',\'"+d.collectionId+"\')>查看</a>";
                }
            },
            {
                field: 'actualDate', align: "center", title: '收款确认时间', templet: function (d) {
                    return isEmpty(d.actualDate);
                }
            }


        ]],
        page: true,
        // loading: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });

    // 追帐详情
    layui.table.render({
        id: "chasingGrid",
        elem: '#chasingGrid',
        url: baseURL + 'financial/chasingbadrecord/queryList',
        where: {'receivablesId': window.localStorage.getItem("receivablesId"),businessType:1},
        cols: [[
            {
                field: 'remarks', align: "center", title: '追帐备注', templet: function (d) {
                    return isEmpty(d.remarks);
                }
            },
            {field: 'isFile',align: "center", title: '追帐附件',templet: function (d) {
                if(d.isFile == '1'){
                    return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.id+"\',\'"+45+"\')>查看</a>";
                } else {
                    return "--";
                }
            }},
            {
                field: 'delUserName', align: "center", title: '处理人', templet: function (d) {
                    return isEmpty(d.delUserName);
                }
            },
            {
                field: 'delTime', align: "center", title: '追帐时间', templet: function (d) {
                    return isEmpty(d.delTime);
                }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });

    // 作废详情
    layui.table.render({
        id: "zfGrid",
        elem: '#zfGrid',
        url: baseURL + 'financial/chasingbadrecord/queryList',
        where: {'receivablesId': window.localStorage.getItem("receivablesId"),businessType:3},
        cols: [[
            {
                field: 'remarks', align: "center", title: '作废原因', templet: function (d) {
                    return isEmpty(d.remarks);
                }
            },
            {
                field: 'delUserName', align: "center", title: '处理人', templet: function (d) {
                    return isEmpty(d.delUserName);
                }
            },
            {
                field: 'delTime', align: "center", title: '作废时间', templet: function (d) {
                    return isEmpty(d.delTime);
                }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });

    // 坏账详情
    layui.table.render({
        id: "hzGrid",
        elem: '#hzGrid',
        url: baseURL + 'financial/chasingbadrecord/queryList',
        where: {'receivablesId': window.localStorage.getItem("receivablesId"),businessType:2},
        cols: [[
            {
                field: 'remarks', align: "center", title: '坏账原因', templet: function (d) {
                    return isEmpty(d.remarks);
                }
            },
            {field: 'isFile',align: "center", title: '坏帐附件',templet: function (d) {
                if(d.isFile == '1'){
                    return "<a class='layui-btn search-btn' onclick=fileView(\'"+d.id+"\',\'"+46+"\')>查看</a>";
                } else {
                    return "--";
                }
            }},
            {
                field: 'delUserName', align: "center", title: '处理人', templet: function (d) {
                    return isEmpty(d.delUserName);
                }
            },
            {
                field: 'delTime', align: "center", title: '坏帐时间', templet: function (d) {
                    return isEmpty(d.delTime);
                }
            },
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#yslogid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': window.localStorage.getItem("receivablesNo"), "auditType": 4},
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

    //账单修改记录
    layui.table.render({
        id: "gridid",
        elem: '#modifyLog',
        url: baseURL + 'financial/receivableopertion/queryList',
        where: {'receivableId': window.localStorage.getItem("receivablesId")},
        autoColumnWidth: {
            init: true
        },
        cols: [[
            {
                field: 'receivableNo', align: "center", title: '当月流水额(元)', templet: function (d) {
                    return isEmpty(d.receivableNo);
                }
            },
            {
                field: 'operationName', align: "center", title: '奖励(元)', templet: function (d) {
                    return isEmpty(d.operationName);
                }
            },
            {
                field: 'receivableBeforeAmount', align: "center", title: '当月达标率(%)', templet: function (d) {
                    return isEmpty(d.receivableBeforeAmount);
                }
            },
            {
                field: 'uncollectBeforeAmount', align: "center", title: '应扣使用费(元)', templet: function (d) {
                    return isEmpty(d.uncollectBeforeAmount);
                }
            },
            {
                field: 'receivableAfterAmount', align: "center", title: '当月预支(元)', templet: function (d) {
                    return isEmpty(d.receivableAfterAmount);
                }
            },
            {
                field: 'createTime', align: "center", title: '当月应扣保证金(元)', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'createTime', align: "center", title: '矫正额(元)', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'createTime', align: "center", title: '矫正说明', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'createTime', align: "center", title: '应付薪资(元)', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            }


        ]],
        page: {
            curr: 1
        },
        limits: [10, 20, 100, 200],
        limit: 10
    });




});

var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '应收详情',
        receivables: {},
        deliveryFileLst:[],
    },
    computed: {

        statusStr: {
            get: function () {
                if (this.receivables.status == 1) {
                    return "待收款";
                } else if (this.receivables.status == 2) {
                    return "已收款";
                } else if (this.receivables.status == 3) {
                    return "待追帐";
                } else if (this.receivables.status == 4) {
                    return "已坏帐";
                }else if (this.receivables.status == 5) {
                    return "已作废";
                }else if (this.receivables.status == 6) {
                    return "已退款";
                }else if (this.receivables.status == 7) {
                    return "代扣扣款中";
                }else if (this.receivables.status == 8) {
                    return "代扣失败";
                }else if (this.receivables.status == 9) {
                    return "部分扣款成功";
                }else{
                    return "--";
                }
            }
        },
        rentTypeStr: {
            get: function () {
                return getBillRentTypeStr(this.receivables.rentType);
            }
        },
        brandNameAndseriesNameStr: {
            get: function () {
                return this.receivables.brandName + "/" + this.receivables.seriesName;
            }
        },
        paymentMethodStr: {
            get: function () {
              //  if (this.receivables.collectionType == 2) {
                    if (this.receivables.paymentMethod == 1) {
                        return "月付";
                    } else if (this.receivables.paymentMethod == 2) {
                        return "两月付";
                    } else if (this.receivables.paymentMethod == 3) {
                        return "季付";
                    } else if (this.receivables.paymentMethod == 6) {
                        return "半年付";
                    } else if (this.receivables.paymentMethod == 4) {
                        return "年付";
                    } else if (this.receivables.paymentMethod == 5) {
                        return "一次性付款";
                    } else if (this.receivables.paymentMethod == 7) {
                        return "日付";
                    } else if (this.receivables.paymentMethod == 8) {
                        return "周付";
                    }
                // } else {
                //     return "--";
                // }
            }
        },
        collectionTypeStr: {
            get: function () {
                return getCollectionTypeStr(this.receivables.collectionType);
            }
        },
        stageStr: {
            get: function () {
                if (this.receivables.stage == null || this.receivables.stage == "") {
                    return "--";
                } else if (this.receivables.collectionType == 2 || this.receivables.collectionType == 12) {
                    return this.receivables.stage + "期";
                } else {
                    return "--";
                }
            }
        },
        colleTypeStr: {
            get: function () {
                if (this.receivables.collectionType == 0) {
                    return '费用明细';
                } else if (this.receivables.collectionType == 1) {
                    return '保证金费用明细';
                } else if (this.receivables.collectionType == 2) {
                    return '租金费用明细';
                } else if (this.receivables.collectionType == 3) {
                    return '首付款费用明细';
                } else if (this.receivables.collectionType == 4) {
                    return '退车费用明细';
                } else if (this.receivables.collectionType == 5) {
                    return '换车费用明细';
                } else if (this.receivables.collectionType == 6) {
                    return '备用车费用明细';
                }else if (this.receivables.collectionType == 7) {
                    return '整备费费用明细';
                } else if (this.receivables.collectionType == 8) {
                    return '尾款费用明细';
                } else if (this.receivables.collectionType == 9) {
                    return '定金费用明细';
                } else if (this.receivables.collectionType == 10) {
                    return '其他费用费用明细';
                } else if (this.receivables.collectionType == 11) {
                    return '车辆总单价';
                } else if (this.receivables.collectionType == 12) {
                    return '挂靠费用费用明细';
                } else {
                    return '--';
                }
            }
        },
        /*costStr: {
            get: function () {
                if (this.receivables.collectionType == 1) {
                    return this.receivables.cashDeposit;
                } else if (this.receivables.collectionType == 2) {
                    return this.receivables.receivableAmount;
                } else if (this.receivables.collectionType == 3) {
                    return this.receivables.downPayment;
                } else {
                    return '--';
                }
            }
        },*/
    },

    methods: {
        // newMethods
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
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '应收详情';
            }
        },

        detailsSupTabContentBindtap(param, val) {

            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;

        },
        // newMethods   ENd

        cancel: function () {
            layer.closeAll();
        },

        detail: function (receivablesId) {
            $.get(baseURL + "financial/receivables/skReceivablesInfo/" + receivablesId, function (r) {
                vm.receivables = r.receivables;
                vm.deliveryFileLst = r.receivables.fileLst;
                if(r.receivables.status == 3){
                    vm.detailsSupTabContentList.push('应收详情','实收详情','追帐详情');
                } else if(r.receivables.status == 4){
                    vm.detailsSupTabContentList.push('应收详情','实收详情','坏账详情');
                } else if(r.receivables.status == 5){
                    vm.detailsSupTabContentList.push('应收详情','实收详情','作废详情');
                } else if(r.receivables.status == 1 || r.receivables.status == 2){
                    vm.detailsSupTabContentList.push('应收详情','实收详情');
                }
            });

        }

    }
});

function pictureDetail (collectionsNo,collectionId) {
    window.localStorage.setItem("objType", 3);
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

/*    window.localStorage.setItem("collectionsNo", collectionsNo);
    var index = layer.open({
        title: "图片详情",
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
    layer.full(index);*/


}

function fileView (id,type) {
    window.localStorage.setItem("objId", id);
    window.localStorage.setItem("objType", type);
    var title = "";
    if(type == "45"){
        title = "应收单详情 > 追帐详情 > 附件查看";
    } else if(type == "46"){
        title = "应收单详情 > 坏账详情 > 附件查看";
    } else if(type == "47"){
        title = "应收单详情 > 作废详情 > 附件查看";
    }
    var index = layer.open({
        title: title,
        type: 2,
        area: ['850px', '530px'],
        fixed: false, //不固定
        maxmin: true,
        content: tabBaseURL + 'modules/common/viewAccessories.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("objId", null);
            window.localStorage.setItem("objType", null);
        }
    });
    layer.full(index);
}
