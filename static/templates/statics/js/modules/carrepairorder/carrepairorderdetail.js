$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    vm.detail(window.localStorage.getItem("carRepairOrderId"));
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.render();
    });
    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#operationLog',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: { 'businessNo': window.localStorage.getItem("carRepairOrderId"), "auditType": 10 },
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
                field: 'receivableObjNo', title: '应收单编号', align: "center", width: 200, templet: function (d) {
                    if (d.receivableObjNo != null && d.receivableObjNo != '') {
                        return d.receivableObjNo;
                    } else {
                        return '- 未生成应收单 -';
                    }
                }
            },
            {
                field: 'payableAmount', title: '应付金额(元)', align: "center", width: 200
            },
            {
                field: 'paymentObjNo', title: '应付单编号', align: "center", width: 200, templet: function (d) {
                    if (d.paymentObjNo != null && d.paymentObjNo != '') {
                        return d.paymentObjNo;
                    } else {
                        return '- 未生成应付单 -';
                    }
                }
            },
            {
                field: 'money', title: '差额', align: "center", width: 200, templet: function (d) {
                    return isEmpty(d.memo);
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
        carRepairOrder: {},
        fileLst: [],
        maintenanceItemList: [],
        detailForm: true,
        detailsTabContentList: ['维修详情', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '维修详情',
        dataliat2: [],


    },
    computed: {

    },
    created: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap: function (param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '维修详情';
            } else if (param === 1) {
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
            $.ajax({
                type: "POST",
                url: baseURL + "carrepairorder/carrepairorder/info/" + id,
                contentType: "application/json",
                data: null,
                success: function (r) {
                    if (r.code === 0) {
                        vm.carRepairOrder = r.carRepairOrder;
                        vm.fileLst = r.carRepairOrder.fileLst;
                        vm.maintenanceItemList = r.carRepairOrder.maintenanceItemList || [];

                        Upload({
                            elid: 'RepairModel',
                            edit: false,
                            fileLst: vm.fileLst
                        }).initView();
                        // if(vm.fileLst.length == 0){
                        //     $("#RepairModel").hide();
                        // }
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        reloadMaintenanceItem: function () {
            layui.table.reload('maintenanceListId', {
                page: {
                    curr: getCurrPage('maintenanceListId', vm.maintenanceItemList.length)
                },
                data: vm.maintenanceItemList
            });
        },
        // 附件查看
        viewAccessory: function () {
            window.localStorage.setItem("objType", 9);
            window.localStorage.setItem("objId", vm.carRepairOrder.id);
            window.localStorage.setItem("objCode", vm.carRepairOrder.applyNo);
            var index = layer.open({
                title: "维保管理 > 维修列表 > 查看维修单 > 附件查看",
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
                    window.localStorage.setItem("objId", vm.carRepairOrder.id);
                    window.localStorage.setItem("objType", 9);
                    var index = layer.open({
                        title: "维保管理 > 维修列表 >查看维修单>图片预览",
                        type: 2,
                        area: ['850px', '530px'],
                        fixed: false, //不固定
                        maxmin: true,
                        content: tabBaseURL + 'modules/carrepairorder/carrepairorderpictureDetail.html',
                        end: function () {
                            layer.close(index);
                            window.localStorage.setItem("objId", null);
                        }
                    });
                    layer.full(index);
                },
                download:function(){
                    //获取收款单主键
                    window.localStorage.setItem("objId", vm.carRepairOrder.id);
                    window.localStorage.setItem("objType", 9);
                    window.localStorage.setItem("typeFile", 0);
                    var index = layer.open({
                        title: "维保管理 > 维修列表 >查看维修单>文档下载",
                        type: 2,
                        area: ['1070px', '360px'],
                        fixed: false, //不固定
                        maxmin: true,
                        content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                        end: function () {
                            window.localStorage.setItem("objId", null);
                            window.localStorage.setItem("objType", null);
                            window.localStorage.setItem("typeFile", null);
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                },*/
    }
});
