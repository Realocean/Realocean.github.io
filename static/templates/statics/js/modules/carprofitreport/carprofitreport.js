$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table','soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            url: baseURL + 'report/financeReport/list',
            cols: [[
                {field:'carPlateNo', minWidth:150,align:'center', rowspan:2,fixed: "left", title: '车牌号'},
                {field:'deptName', minWidth:120, title: '车辆归属',rowspan:2,align:'center', templet:function (d) {
                        if(d.deptName!=null && d.deptName!=""){
                            return  d.deptName;
                        }else {
                            return "--";
                        }
                    }},
                {field:'cityName', minWidth:100, title: '车辆所在仓库',rowspan:2,align:'center', templet:function (d) {
                        if(d.cityName!=null && d.cityName!=""){
                            return  d.cityName;
                        }else {
                            return "--";
                        }
                    }},
                
                {field:'vinNo', minWidth:180, title: '车架号',align:'center',rowspan:2},
                {field:'carBrandName', minWidth:100,align:'center', title: '品牌/车系',rowspan:2, templet:function (d) {
                        if(d.carBrandName!=null && d.carBrandName!=""){
                            return  d.carBrandName;
                        }else {
                            return "--";
                        }
                    }},
                {field:'carModelName', minWidth:100,align:'center', title: '车型',rowspan:2, templet:function (d) {
                        if(d.carModelName!=null && d.carModelName!=""){
                            return  d.carModelName;
                        }else {
                            return "--";
                        }
                    }},
                {field:'carSource', minWidth:200, align:'center',title: '车辆来源',rowspan:2, templet:function (d) {
                        if(d.carSource!=null && d.carSource!=""){
                            return  d.carSource;
                        }else {
                            return "--";
                        }
                    }},
                {field:'contractNo',align:'center', minWidth:100, title: '合同编号',rowspan:2, templet:function (d) {
                        if(d.contractNo!=null && d.contractNo!=""){
                            return  d.contractNo;
                        }else {
                            return "--";
                        }
                    }},
                {field:'supplierName', align:'center',minWidth:240, title: '供应商',rowspan:2, templet:function (d) {
                        if(d.supplierName!=null && d.supplierName!=""){
                            return  d.supplierName;
                        }else {
                            return "--";
                        }
                    }},
                {field:'purchasePrice', minWidth:100,align:'center', title: '直购采购单价',rowspan:2, templet:function (d) {
                        if(d.purchasePrice!=null && d.purchasePrice!=""){
                            return  d.purchasePrice;
                        }else {
                            return "0";
                        }
                    }},
                {field:'warehousingDate', minWidth:100, align:'center',title: '入库时间',rowspan:2, templet:function (d) {
                        if(d.warehousingDate!=null && d.warehousingDate!=""){
                            return  d.warehousingDate;
                        }else {
                            return "--";
                        }
                    }},
                {field:'carTotalAmount', minWidth:100, align:'center',title: '车辆总收入',rowspan:2, templet:function (d) {
                        if(d.carTotalAmount!=null){
                            return  d.carTotalAmount;
                        }else {
                            return "0";
                        }
                    }},
                {field:'', minWidth:120,align:'center', title: '车辆总支出',align: "center",colspan:7}
                ],
                [
                    {field:'depositRefund', minWidth:180, title: '押金退款',align:'center', templet:function (d) {
                            if(d.depositRefund!=null){
                                return  d.depositRefund;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'inspectionAmount', minWidth:130, title: '年检费用',align:'center', templet:function (d) {
                            if(d.inspectionAmount!=null){
                                return  d.inspectionAmount;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'insuranceAmount', minWidth:100, title: '保险费用',align:'center', templet:function (d) {
                            if(d.insuranceAmount!=null){
                                return  d.insuranceAmount;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'repairAmount', minWidth:100, title: '维修费用',align:'center', templet:function (d) {
                            if(d.repairAmount!=null){
                                return  d.repairAmount;
                            }else {
                                return "0";
                            }
                        }},
                    {field:'dangerAmount', minWidth:100, title: '出险费用',align:'center', templet:function (d) {
                            if(d.dangerAmount!=null){
                                return  d.dangerAmount;
                            }else {
                                return "0";
                            }
                        }},

                    {field:'maintenanceAmount', minWidth:100, title: '保养费用',align:'center', templet:function (d) {
                            if(d.maintenanceAmount!=null){
                                return  d.maintenanceAmount;
                            }else {
                                return "0";
                            }
                        }},

                    {field:'zuShouPurchasePrice', minWidth:100, title: '其他来源采购单价',align:'center', templet:function (d) {
                            if(d.zuShouPurchasePrice!=null){
                                return  d.zuShouPurchasePrice;
                            }else {
                                return "0";
                            }
                        }},
                ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
    });

    selectTotal();

    layui.form.on('select(sourceTypeSelect)', function (data) {
        vm.q.sourceType = data.value;
    });

    //品牌车型
    layui.form.on('select(carModelSelect)', function (data) {
        vm.q.carBrandName = data.value;
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        laydate.render({
            elem: '#warehousingDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.warehousingDate = value;
            }
        });
        form.render();
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
    });

});

/**
 * 统计
 */
function selectTotal(){
    $.ajax({
        type: "GET",
        url: baseURL + "report/financeReport/total",
        contentType: "application/json",
        success: function(res){
            vm.total = res.data;
        },
    });
}

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            deptName: null,
            carPlateNo: null,
            cityName:null,
            sourceType: null,
            carBrandName: null,
            supplierName: null,
            warehousingDate: null
        },
        showForm: false,
        total:{},
        carprofitreport: {},
        //仓库数据源
        warehouseData:{},
        allCarModels: [],
    },
    updated: function(){
        layui.form.render();
    },

    created: function () {
        var _this = this;
        $.getJSON(baseURL + "report/financeReport/listBrandAndSeries", function (r) {
            _this.allCarModels = r.listData;
        });
    },

    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var carprofitreportIds = [];
            $.each(list, function(index, item) {
                carprofitreportIds.push(item.carprofitreportId);
            });
            return carprofitreportIds;
        },
        //查询
        query: function () {
            vm.reload();
        },
        //重置
        reset: function () {
            vm.q.carPlateNo =null;
            vm.q.deptName =null;
            vm.q.carBrandName =null;
            vm.q.cityName =null;
            vm.q.sourceType =null;
            vm.q.supplierName =null;
            vm.q.warehousingDate =null
        },
        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.q,"deptId",treeNode.deptId);
            Vue.set(vm.q,"deptName",treeNode.name);
            layer.closeAll();
        },
        chooseWarehouse:function(){
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.q = Object.assign({}, vm.q,{
                        //depotId:vm.warehouseData.warehouseId,
                        cityName:vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },

        //导出
        exports: function () {
            var url = baseURL + 'report/financeReport/export';
            if(vm.q.carPlateNo != null){
                url += '?carPlateNo='+vm.q.carPlateNo;
            }
            if(vm.q.cityName != null){
                url += '?cityName='+vm.q.cityName;
            }
            if(vm.q.deptName != null){
                url += '?deptName='+vm.q.deptName;
            }
            if(vm.q.sourceType != null){
                url += '?sourceType='+vm.q.sourceType;
            }
            if(vm.q.carBrandName != null){
                url += '?carBrandName='+vm.q.carBrandName;
            }
            if(vm.q.supplierName != null){
                url += '?supplierName='+vm.q.supplierName;
            }
            if(vm.q.warehousingDate != null){
                url += '?warehousingDate='+vm.q.warehousingDate;
            }
            window.location.href = url;
        },
        //重新加载
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carPlateNo:vm.q.carPlateNo,
                    cityName:vm.q.cityName ,
                    deptName:vm.q.deptName ,
                    sourceType:vm.q.sourceType ,
                    carBrandName:vm.q.carBrandName  ,
                    supplierName:vm.q.supplierName  ,
                    warehousingDate:vm.q.warehousingDate
                }
            });
        }
    }
});
