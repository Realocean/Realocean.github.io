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
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
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
            limits: [10, 20, 50, 100],
            limit: 10,

        });
    })
    // 出险相关费用信息表单
    gridTable3 = layui.table.render({
        id: "compulsoryInsurance2",
        elem: '#compulsoryInsurance2',
        minWidth: 150,
        data: vm.dataliat2,
        cols: [[
            { field: 'type', title: '费用类型', align: "center", width: 250 },
            {
                field: 'receivableMoney', title: '应收金额(元)', align: "center", width: 200
            },
            {
                field: 'copeNone', title: '应付单编号', align: "center", width: 200
            },
            {
                field: 'reciveMoney', title: '应付金额(元)', align: "center", width: 200
            },
            {
                field: 'receiveNone', title: '应收单编号', align: "center", width: 200
            },
            {
                field: 'money', title: '差额', align: "center", width: 200
            },

        ]],
        page: false,
        loading: false,
        limit: 500,

    });

});



var vm = new Vue({
    el: '#rrapp',
    data: {
        carRepairOrder: {},
        detailForm: true,
        detailsTabContentList: ['维修详情', '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '维修详情',
        dataliat2: [],

    },
    maintenanceItemList: [],
    computed: {},
    created: function () { },
    updated: function () {
        layui.form.render();
    },
    methods: {
        initTable() {
            layui.table.render({
                id: 'maintenanceListId',
                elem: '#maintenanceItemTableList',
                data: vm.maintenanceItemList || [],
                cols: [[
                    { field: 'serializeId', align: 'center', title: '序号' },
                    { field: 'itemName', align: 'center', title: '维修项目名称' },
                    { field: 'itemMoney', align: 'center', title: '金额/元' },
                ]],
                page: true,
                limits: [5, 10, 15],
                limit: 5,
            });
        },
        detailsTabContentBindtap: function (param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '维修详情';
            } else if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            }
        },
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
                        let list = r.carRepairOrder.maintenanceItemList || []
                        vm.carRepairOrder.totalPay = list.map(item => Number(item.itemMoney || 0)).reduce(function (prev, cur) {
                            return prev + cur;
                        }, 0) + Number(r.carRepairOrder.userPay || 0) + Number(r.carRepairOrder.platformPay || 0) + Number(r.carRepairOrder.insurancePay || 0);
                        vm.maintenanceItemList = r.carRepairOrder.maintenanceItemList;
                        Upload({
                            elid: 'RepairModel',
                            edit: false,
                            fileLst: r.carRepairOrder.fileLst
                        }).initView();

                    } else {
                        alert(r.msg);
                    }
                    vm.initTable();
                }
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

    }
});
