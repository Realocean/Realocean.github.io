$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    vm.detail(window.localStorage.getItem("outInsuranceOrderId"));
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.render();
    });

    //出险记录
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        layui.table.render({
            id: "outRecordId",
            elem: '#outRecord',
            // toolbar: true,
            // defaultToolbar: ['filter'],
            cols: [[
                { type: 'numbers', align: 'center', title: '序号' },
                {
                    field: '', align: "center", title: '操作', templet: function (d) {
                        return "<span  style='color:#419BEA;cursor:pointer;' onclick=update(\'" + d.id + "\')>编辑</span>";
                    }
                },
                { field: 'applyNo', align: 'center', minWidth: 100, title: '出险申请单号' },
                {
                    field: 'customer', align: 'center', minWidth: 100, title: '客户名称', templet: function (d) {
                        if (d.customer != null && d.customer != "") {
                            return d.customer;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'carOrderNo', align: 'center', minWidth: 100, title: '车辆订单号', templet: function (d) {
                        if (d.carOrderNo != null && d.carOrderNo != "") {
                            /* return  "<span style='color: blue'>"+d.carOrderNo+"</span>";*/
                            return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'" + d.orderCarId + "\')>" + d.carOrderNo + "</span>";

                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'carPurpose', align: 'center', minWidth: 100, title: '车辆用途' },
                { field: 'receiveDate', align: 'center', minWidth: 100, title: '接收时间' },
                { field: 'outDate', align: 'center', minWidth: 100, title: '出险时间' },
                { field: 'outAddr', align: 'center', minWidth: 100, title: '出险地点' },
                { field: 'reporter', align: 'center', minWidth: 100, title: '报案人' },
                { field: 'outReason', align: 'center', minWidth: 100, title: '出险经过及原因' },
                {
                    field: 'outLevel', align: 'center', minWidth: 100, title: '事故等级', templet: function (d) {
                        if (d.outLevel == 1) {
                            return "一般事故";
                        } else if (d.outLevel == 2) {
                            return "较大事故";
                        } else if (d.outLevel == 3) {
                            return "重大事故";
                        } else if (d.outLevel == 4) {
                            return "特别重大事故";
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'sxIsPay', align: 'center', minWidth: 100, title: '商业险是否赔付', templet: function (d) {
                        //商业险赔付 1是 2否
                        if (d.sxIsPay == 1) {
                            return "已赔付";
                        } else if (d.sxIsPay == 2) {
                            return "未赔付";
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'sxInsuranceCompanyName', align: 'center', minWidth: 100, title: '商业险赔付保险公司', templet: function (d) {
                        if (d.sxInsuranceCompanyName != null && d.sxInsuranceCompanyName != '') {
                            return d.sxInsuranceCompanyName;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'sxPayFee', align: 'center', minWidth: 100, title: '商业险赔付金额' },
                { field: 'sxPayDate', align: 'center', minWidth: 100, title: '商业险支付时间' },
                {
                    field: 'qxIsPay', align: 'center', minWidth: 100, title: '交强险是否赔付', templet: function (d) {
                        //商业险赔付 1是 2否
                        if (d.qxIsPay == 1) {
                            return "已赔付";
                        } else if (d.qxIsPay == 2) {
                            return "未赔付";
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'qxInsuranceCompanyName', align: 'center', minWidth: 100, title: '交强险赔付保险公司', templet: function (d) {
                        if (d.qxInsuranceCompanyName != null && d.qxInsuranceCompanyName != '') {
                            return d.qxInsuranceCompanyName;
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'qxPayFee', align: 'center', minWidth: 100, title: '交强险赔付金额' },
                { field: 'qxPayDate', align: 'center', minWidth: 100, title: '交强险支付时间' },
                {
                    field: 'responsibleParty', minWidth: 100, title: '责任方', templet: function (d) {
                        if (d.responsibleParty == 1) {
                            return "20%";
                        } else if (d.responsibleParty == 2) {
                            return "30%";
                        } else if (d.responsibleParty == 3) {
                            return "50%";
                        } else if (d.responsibleParty == 4) {
                            return "100%";
                        } else if (d.responsibleParty == 5) {
                            return "0%";
                        } else if (d.responsibleParty == 6) {
                            return "70%";
                        } else {
                            return "--";
                        }
                    }
                },
                { field: 'remark', align: 'center', minWidth: 100, title: '备注' },
                {
                    field: '', align: 'center', align: "center", title: '附件', templet: function (d) {
                        return "<span style='color:#419BEA;cursor:pointer;' onclick=checkFJ(\'" + d.id + "\')>查看</span>";
                    }
                },
                { field: 'operator', align: 'center', minWidth: 100, title: '记录人' },
                { field: 'timeCreate', align: 'center', minWidth: 100, title: '记录时间' },

            ]],
            page: true,
            limits: [10, 20, 100, 200],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res) {
                soulTable.render(this);
            }
        });
    })

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#operationLog',
        // toolbar: true,
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: { 'businessNo': window.localStorage.getItem("outInsuranceOrderId"), "auditType": 14 },
        cols: [[
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
    // 保险赔付情况表单
    gridTable2 = layui.table.render({
        id: "compulsoryInsurance1",
        elem: '#compulsoryInsurance1',
        minWidth: 150,
        data: vm.dataliat1,
        cols: [[
            { field: 'payInsuranceName', title: '保险类型', align: "center", width: 250 },

            {
                field: 'insuranceCompanyName', title: '赔付保险公司', align: "center", width: 250,
            },
            {
                field: 'payFee', title: '保险赔付金额(元)', align: "center", width: 250
            },
            {
                field: 'payDate', title: '赔付时间', align: "center", width: 250
            },
            {
                field: 'remark', title: '备注信息', align: "center", width: 250
            },

        ]],
        page: false,
        loading: false,
        limit: 500,

    });
    // 出险相关费用信息表单
    gridTable3 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'feeName', title: '费用类型', align: "center", width: 250 },
            {
                field: 'receivableAmount', title: '应收金额(元)', align: "center", width: 200, templet: function (d) {
                    return isEmpty(d.receivableAmount);
                }
            },

            {
                field: 'receivablesNo', title: '应收单编号', align: "center", width: 200, templet: function (d) {
                    if (d.receivablesNo != null && d.receivablesNo != '') {
                        return "<span style='color: blue' onclick = hrefReceivableView(\'" + d.receivablesId + "\',\'" + d.receivablesNo + "\')>" + d.receivablesNo + "</span>";
                    } else {
                        return '- 未生成应收单 -';
                    }
                }
            },

            {
                field: 'payableAmount', title: '应付金额(元)', align: "center", width: 200
            },

            {
                field: 'paymentNo', title: '应付单编号', align: "center", width: 200, templet: function (d) {
                    if (d.paymentNo != null && d.paymentNo != '') {
                        return "<span style='color: blue' onclick = hrefPaymentView(\'" + d.paymentId + "\')>" + d.paymentNo + "</span>";
                    } else {
                        return '- 未生成应付单 -';
                    }
                }
            },

            {
                field: 'differenceAmount', title: '差额', align: "center", width: 200, templet: function (d) {
                    return isEmpty(d.differenceAmount);
                }
            },

        ]],
        page: false,
        loading: false,
        limit: 500,
        done: function (res, curr, count) {
        }

    });


});

var vm = new Vue({
    el: '#rrapp',
    data: {
        outinsuranceorder: {},
        detailForm: true,
        detailsTabContentList: ['出险详情', '出险记录', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '出险详情',

        outinsuranceRecord: {},
        recordList: [],
        fileLst: [],
        dataliat2: [],
        dataliat1: [],

    },
    created: function () {
    },
    computed: {
        responsiblePartyStr: {
            get: function () {
                if (this.outinsuranceorder.responsibleParty != null) {
                    if (this.outinsuranceorder.responsibleParty == 1) {
                        return "20%";
                    } else if (this.outinsuranceorder.responsibleParty == 2) {
                        return "30%";
                    } else if (this.outinsuranceorder.responsibleParty == 3) {
                        return "50%";
                    } else if (this.outinsuranceorder.responsibleParty == 4) {
                        return "100%";
                    } else if (this.outinsuranceorder.responsibleParty == 5) {
                        return "0%";
                    } else if (this.outinsuranceorder.responsibleParty == 6) {
                        return "70%";
                    }
                } else {
                    return "--";
                }


            }
        },
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap: function (param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '出险详情';
            } else if (param === 1) {
                this.detailsSupTabContentListActiveValue = '出险记录';
            } else if (param === 2) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            }
        },

        /*detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },*/
        // 取消
        cancel: function () {
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (id) {
            vm.outinsuranceorder = {};
            vm.outinsuranceRecord = {};
            vm.recordList = {};
            $.ajax({
                type: "POST",
                url: baseURL + "outinsuranceorder/ouinsuranceorder/info/" + id,
                contentType: "application/json",
                data: null,
                success: function (r) {
                    if (r.code === 0) {
                        vm.outinsuranceorder = r.outinsuranceOrderDetil;
                        vm.dataliat2 = r.outinsuranceOrderDetil.relatedCostsList;
                        vm.dataliat1 = r.outinsuranceOrderDetil.insuranceCompensationList;
                        layui.table.reload('compulsoryInsurance1', {
                            data: vm.dataliat1
                        })
                        layui.table.reload('compulsoryInsurance2', {
                            data: vm.dataliat2
                        })
                        vm.outinsuranceRecord = r.outinsuranceRecord;
                        vm.recordList = r.recordList;
                        layui.table.reload('outRecordId', {
                            data: vm.recordList
                        })
                        vm.fileLst = r.outinsuranceOrderDetil.fileLst;
                        if (vm.fileLst.length == 0) {
                            $("#divShow").hide();
                        } else {
                            $("#divShow").show();
                            Upload({
                                elid: 'outModel',
                                edit: false,
                                fileLst: vm.fileLst
                            }).initView();
                        }

                    } else {
                        alert(r.msg);
                    }
                }
            });
        },

        // 附件查看
        viewAccessory: function () {
            window.localStorage.setItem("objType", 19);
            window.localStorage.setItem("objId", vm.outinsuranceorder.id);
            window.localStorage.setItem("objCode", vm.outinsuranceorder.applyNo);
            var index = layer.open({
                title: "维保管理 > 出险列表 > 查看出险单 > 附件查看",
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

        /* preview:function(){
             window.localStorage.setItem("collectionsNo", vm.outinsuranceorder.id);
             window.localStorage.setItem("objType", 19);
             var index = layer.open({
                 title: "维保管理 > 出险列表 >查看出险单>图片预览",
                 type: 2,
                 area: ['850px', '530px'],
                 fixed: false, //不固定
                 maxmin: true,
                 content: tabBaseURL + 'modules/carrepairorder/carrepairorderpictureDetail.html',
                 end: function () {
                     layer.close(index);
                     window.localStorage.setItem("collectionsNo", null);
                 }
             });
             layer.full(index);
         },
         checkFJ:function(id){
             window.localStorage.setItem("objId",id);
             window.localStorage.setItem("objType", 19);
             var index = layer.open({
                 title: "维保管理 > 出险列表 >查看出险单>附件详情",
                 type: 2,
                 area: ['850px', '530px'],
                 fixed: false, //不固定
                 maxmin: true,
                 content: tabBaseURL + 'modules/outinsuranceorder/outinsuranceorderenclosure.html',
                 end: function () {
                     layer.close(index);
                     window.localStorage.setItem("objId", null);
                 }
             });
             layer.full(index);
         },
         download:function(){
             //获取收款单主键
             window.localStorage.setItem("objId", vm.outinsuranceorder.id);
             window.localStorage.setItem("objType", 19);
             var index = layer.open({
                 title: "维保管理 > 维修列表 >查看维修单>文档下载",
                 type: 2,
                 area: ['1070px', '360px'],
                 fixed: false, //不固定
                 maxmin: true,
                 content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                 end: function () {
                     layer.close(index);
                 }
             });
             layer.full(index);
         },*/

    }
});

function update(id) {
    window.localStorage.setItem("outInsuranceOrderId", id);
    var index = layer.open({
        title: "维保管理 > 出险列表 >查看出险单>出险记录编辑",
        type: 2,
        content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorderedit.html",
        end: function () {
            layer.closeAll();
            window.localStorage.setItem("outInsuranceOrderId", null);
        }
    });
    layer.full(index);
}

function checkFJ(id) {
    window.localStorage.setItem("objType", 19);
    window.localStorage.setItem("objId", id);
    var index = layer.open({
        title: "维保管理 > 出险列表 > 查看出险单 > 附件查看",
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

/**
 * 跳转至订单详情
 */
function goToOrderDetail(orderCarId) {

    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
        //   r.order.orderCar.orderCarStatusStr = data.statusStr;
        var param = {
            data: r.order
        };
        var index = layer.open({
            title: "查看",
            type: 2,
            boxParams: param,
            content: tabBaseURL + "modules/order/orderview.html",
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
    });
}


function hrefReceivableView(receivablesId,receivablesNo) {
    window.localStorage.setItem("receivablesId", receivablesId);
    window.localStorage.setItem("receivablesNo", receivablesNo);
    var index = layer.open({
        title: "应收单详情",
        type: 2,
        content: tabBaseURL  + 'modules/financial/receivablesDetail.html',
        success: function(layero,num){
            window.localStorage.removeItem("receivablesId");
            window.localStorage.removeItem("receivablesNo");
        },
        end: function () {
            layer.closeAll();
        }
    });
    layer.full(index);
}


function hrefPaymentView(paymentId) {
    window.localStorage.setItem("id", paymentId);
    var index = layer.open({
        title: "应付单详情",
        type: 2,
        area: ['850px', '530px'],
        fixed: false, //不固定
        maxmin: true,
        content: tabBaseURL + 'modules/financial/paymentbilldetail.html',
        end: function () {
            layer.close(index);
            window.localStorage.setItem("id", null);
        }
    });
    layer.full(index);
}
