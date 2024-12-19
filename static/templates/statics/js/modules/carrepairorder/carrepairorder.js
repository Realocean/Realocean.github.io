$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            where:{repairStatus:vm.q.repairStatus,carPlateNoVinNo:vm.q.carPlateNoVinNo},
            url: baseURL + "carrepairorder/carrepairorder/list",
            cols: [[
                {title: '操作', width:170,minWidth:170, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carPlateNo', minWidth:100, title: '车牌号',fixed: "left",align:"center",templet:function (d) {
                    if(d.carPlateNo!=null && d.carPlateNo!=''){
                        return "<span style='color:#419BEA;cursor:pointer;' onclick=goToCarDetail(\'"+d.carId+"\')>"+d.carPlateNo+"</span>";

                    }else {
                        return "--";
                    }
                }},
                {field:'faultDesc', minWidth:100, title: '故障描述',templet:function (d) {
                        if(d.faultDesc!=null && d.faultDesc!=''){
                            return d.faultDesc;
                        }else {
                            return "--";
                        }
                    } },
                {field:'repairStartDate', minWidth:100, title: '维修开始时间',templet:function (d) {
                        if(d.repairStartDate!=null && d.repairStartDate!=''){
                            return d.repairStartDate;
                        }else {
                            return "--";
                        }
                    } },
                {field:'repairEndDate', minWidth:100, title: '维修结束时间',templet:function (d) {
                        if(d.repairEndDate!=null && d.repairEndDate!=''){
                            return d.repairEndDate;
                        }else {
                            return "--";
                        }
                    } },
                {field:'serviceName', minWidth:100, title: '维修厂名称',templet:function (d) {
                        if(d.serviceName!=null && d.serviceName!=''){
                            return d.serviceName;
                        }else {
                            return "--";
                        }
                    } },
                {field:'costSettlement', minWidth:100, title: '是否已结算',templet:function (d) {
                        //1未结算 2已结算
                        if(d.costSettlement==1){
                            return "未结算";
                        }else if(d.costSettlement==2){
                            return "已结算";
                        }else {
                            return "--";
                        }
                    }},
                {field:' totalPay', minWidth:100, title: '总费用/元',templet:function (d) {
                    return isEmpty(d.totalPay)
                    }},
                {field:' maintenanceItems', minWidth:100, title: '维修项目内容/项目金额（元）',templet:function (d) {
                        if(d.maintenanceItems!=null && d.maintenanceItems!=''){
                            return d.maintenanceItems ;
                        }else{
                            return "--";
                        }
                    }},
                {field:' maintenanceDays', minWidth:100, title: '维修总天数/天',templet:function (d) {
                        if(d.maintenanceDays!=null && d.maintenanceDays!=''){
                            return d.maintenanceDays ;
                        }else{
                            return "--";
                        }
                    }},
                {field:'carMileage', minWidth:100, title: '车辆公里数',templet:function (d) {
                        if(d.carMileage!=null && d.carMileage!=''){
                            return  d.carMileage;
                        }else{
                            return "--";
                        }
                    }},
                {field:'applyNo', minWidth:100, title: '维修申请单号'},
                {field:'repairStatus', minWidth:100, title: '维修状态',templet:function (d) {
                        //1 未维修 2 维修中 3 已维修
                        if(d.repairStatus==1){
                            return "未维修";
                        }else if(d.repairStatus==2){
                            return "维修中";
                        }else if(d.repairStatus==3){
                            return "已维修";
                        }else if(d.repairStatus==4){
                            return "已驳回";
                        }else if(d.repairStatus==5){
                            return "已维修"
                        }else if(d.repairStatus==6){
                            return "已撤回"
                        }else {
                            return "--"
                        }
                    }},
                {field:'flowApproveStatus', minWidth:100, title: '审核状态'},
                {field:'carStatus', minWidth:100, title: '车辆状态',templet:function (d) {
                        //当前状态 1整备中，2备发车，3 预定中  4.用车中 5.已过户
                        if(d.carStatus==1){
                            return "整备中";
                        }else  if(d.carStatus==2){
                            return "备发车";
                        }else  if(d.carStatus==3){
                            return "预定中";
                        }else  if(d.carStatus==4){
                            return "用车中";
                        }else  if(d.carStatus==5){
                            return "已过户";
                        }else {
                            return "--";
                        }
                    }},
                {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){
                        return getRentTypeStr(d.rentType)

                    }},
                {field:'vinNo', minWidth:100, title: '车架号'},
                {field:'carBrandModelName', minWidth:100, title: '品牌/车系/车型',templet:function (d) {
                        if(d.carBrandModelName!=null && d.carBrandModelName!=''){
                            return  d.carBrandModelName;
                        }else{
                            return "--";
                        }
                 }},
                {field:'deptName', minWidth:100, title: '车辆归属',templet:function (d) {
                        if(d.deptName!=null && d.deptName!=''){
                            return  d.deptName;
                        }else{
                            return "--";
                        }
                 }},
                {field:'depotName', minWidth:100, title: '所在仓库',templet:function (d) {
                        if(d.depotName!=null && d.depotName!=''){
                            return d.depotName;
                        }else {
                            return "--";
                        }
                    }},
                {field:'carOwner', minWidth:100, title: '车辆所有人',templet:function (d) {
                        if(d.carOwner!=null && d.carOwner!=''){
                            return  d.carOwner;
                        }else{
                            return "--";
                        }
                 }},

                // {field:'orderNo', minWidth:100, title: '订单编号',templet:function (d) {
                //         if(d.orderNo!=null && d.orderNo!=''){
                //             return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderCarId+"\')>"+d.orderNo+"</span>";
                //
                //         }else {
                //             return "--";
                //         }
                //     }},
                // {field:'customer', minWidth:100, title: '客户名称',templet:function (d) {
                //         if(d.customer !=null && d.customer!=""){
                //             return d.customer
                //         }else {
                //             return "--";
                //         }
                //     }},

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
    })

    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            init(layui);
            form.render();
    });

    //所属部门
    layui.form.on('select(deptIdSelect)', function (data) {
        vm.q.deptId = data.value;
    });
    //品牌车型
    layui.form.on('select(brandSelect)', function (data) {
        vm.q.brand = data.value;
    });

    //维修状态
    layui.form.on('select(repairStatusSelect)', function (data) {
        vm.q.repairStatus = data.value;
    });

    //车辆状态
    layui.form.on('select(carStatusSelect)', function (data) {
        vm.q.carStatus = data.value;
    });
    //车辆用途
    layui.form.on('select(carPurposeSelect)', function (data) {
        vm.q.carPurpose = data.value;
    });

    //费用结算
    layui.form.on('select(costSettlement)', function (data) {
        vm.q.costSettlement = data.value;
    });

    /*laydate.render({
        elem: '#repairEndDateSearch',
        format: 'yyyy-MM-dd',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.repairEndDateStr = value;
        }
    });*/

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });


    //批量删除
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        }else if(layEvent === 'check'){
            vm.check(data.id)
        }else if(layEvent === 'feedbackCheck'){
            vm.feedbackCheck(data.id)
        }else if(layEvent === 'maintenanceFeedback'){
            vm.maintenanceFeedback(data.id)
        } else if(layEvent === 'reedit'){
            vm.reedit(data.id);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            //车牌号
            carPlateNoVinNo:null,
            //车辆归属
            deptId: null,
            deptName: null,
            //品牌车系车型
            brandId :null,
            seriesId :null,
            modelId :null,
            maintenanceItems:null,
            //维修时车辆状态
            carStatus:null,
            //客户名称
            customer:null,
            //订单编号
            orderNo:null,
            //所在仓库
            depotName:null,
            depotId:null,
            //维修状态
            repairStatus:null,
            //维修厂名称
            serviceName:null,
            //费用结算
            costSettlement:null,
            //故障描述
            faultDesc:null,
            //维修申请号
            applyNo:null,
            //维修开始时间时间类型
            repairStartTimeType:null,
            //维修开始时间，自定义时间段
             repairStarDateStr:null,

            //维修结束时间时间类型
             repairEndTimeType:null,
             //维修结束时间，自定义时间段
             repairEndDateStr:null,
             carOwner:null

        },
        showForm: false,
        carRepairOrder: {},
        allCarModels:[],
        carRepairOrderEdit:{},
        warehouseData:{},
        isFilter:false


    },
    updated: function(){
        layui.form.render();
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;

        if(param != undefined && param != null){
            _this.q.repairStatus=param.repairStatus;
        }
       /* $.getJSON(baseURL + "maintenance/insurancemanage/listBrandAndModel", function (r) {
            _this.allCarModels = r.listData;
        });*/

        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.allCarModels,
                    success: function (valData,labelData) {
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });


        _this.q.carPlateNoVinNo = parent.layer.boxParams.carPlateNoVinNo;
    },
    methods: {
        initParam:function(carNo){
            vm.q.carPlateNo=carNo;
            vm.reload();
        },
        chooseWarehouse:function(){
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.q = Object.assign({}, vm.q,{
                        depotId:vm.warehouseData.warehouseId,
                        depotName:vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }
            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
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
        reset:function(){
            //车牌号
            vm.q.carPlateNoVinNo=null;
             //车辆归属
            vm.q.deptId=null;
            vm.q.deptName=null;
             //品牌车系车型
            vm.q.brandId =null;
            vm.q.seriesId=null;
            vm.q.modelId =null;
            //维修时车辆状态
            vm.q.carStatus=null;
             //客户名称
            vm.q.customer=null;
            //订单编号
            vm.q.orderNo=null;
             //所在仓库
            vm.q.depotName=null;
            vm.q.depotId=null;
            //维修状态
            vm.q.repairStatus=null;
            //维修厂名称
            vm.q.serviceName=null;
            //费用结算
            vm.q.costSettlement=null;
             //故障描述
            vm.q.faultDesc=null;
            //维修项目内容
            vm.q.maintenanceItems=null;
             //维修申请号
            vm.q.applyNo=null;
            //维修开始时间时间类型
            vm.q.repairStartTimeType=null;
            //维修开始时间，自定义时间段
            vm.q.repairStarDateStr=null;

            //维修结束时间时间类型
            vm.q.repairEndTimeType=null;
            //维修结束时间，自定义时间段
            vm.q.repairEndDateStr=null;
            //车辆所有人
            vm.q.carOwner=null;

            $("#carBrandSeriesModel").val("");
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.reload();

        },
        query: function () {
            vm.reload();
        },
        add: function(){
            var index = layer.open({
                title: "维保管理 > 维修列表 >新增维修单",
                type: 2,
                content: tabBaseURL + "modules/carrepairorder/carrepairorderadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        reedit: function(id){
            var index = layer.open({
                title: "维保管理 > 维修列表 >新增维修单",
                type: 2,
                boxParams: {
                    id:id
                },
                content: tabBaseURL + "modules/carrepairorder/carrepairorderadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        //查看
        check:function(id){
            window.localStorage.setItem("carRepairOrderId",id);
            var index = layer.open({
                title: "维保管理 > 维修列表 >查看维修单",
                type: 2,
                content: tabBaseURL+'modules/carrepairorder/carrepairorderdetail.html',
                end: function(){
                    layer.close(index);
                }
            });
            layer.full(index);
        },

        //维修完成查看
        feedbackCheck:function(id){
            window.localStorage.setItem("carRepairOrderId",id);
            var index = layer.open({
                title: "维保管理 > 维修列表 >维修完成查看",
                type: 2,
                content: tabBaseURL+'modules/carrepairorder/carrepairorderfeedbackdetail.html',
                end: function(){
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        //反馈
        maintenanceFeedback:function(id){
            window.localStorage.setItem("carRepairOrderId",id);
            var index = layer.open({
                title: "维保管理 > 维修列表 >维修反馈",
                type: 2,
                content: tabBaseURL+'modules/carrepairorder/carrepairorderfeedback.html',
                end: function(){
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            var index = layer.open({
                title: "维保管理 > 维修列表 >编辑维修单",
                type: 2,
                content: tabBaseURL + "modules/carrepairorder/carrepairorderedit.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.vm.sendEditInfor(id);

                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "carrepairorder/carrepairorder/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.carRepairOrder.id == null ? "carrepairorder/carrepairorder/save" : "carrepairorder/carrepairorder/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carRepairOrder),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'carrepairorder/carrepairorder/export?a=a';

            if(vm.q.carPlateNoVinNo != null){
                url += '&carPlateNoVinNo='+vm.q.carPlateNoVinNo;
            }
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            if(vm.q.brandId != null){
                url += '&brandId='+vm.q.brandId;
            }
            if(vm.q.seriesId != null){
                url += '&seriesId='+vm.q.seriesId;
            }
            if(vm.q.modelId != null){
                url += '&modelId='+vm.q.modelId;
            }
            if(vm.q.carStatus != null){
                url += '&carStatus='+vm.q.carStatus;
            }
            if(vm.q.customer != null){
                url += '&customer='+vm.q.customer;
            }
            if(vm.q.orderNo != null){
                url += '&orderNo='+vm.q.orderNo;
            }
            if(vm.q.depotId != null){
                url += '&depotId='+vm.q.depotId;
            }
            if(vm.q.repairStatus != null){
                url += '&repairStatus='+vm.q.repairStatus;
            }
            if(vm.q.serviceName != null){
                url += '&serviceName='+vm.q.serviceName;
            }
            if(vm.q.costSettlement != null){
                url += '&costSettlement='+vm.q.costSettlement;
            }
            if(vm.q.faultDesc != null){
                url += '&faultDesc='+vm.q.faultDesc;
            }
            if(vm.q.applyNo != null){
                url += '&applyNo='+vm.q.applyNo;
            }
            //维修开始开始时间
            if(vm.q.repairStartStartDate != null){
                url += '&repairStartStartDate='+vm.q.repairStartStartDate;
            }
            //维修开始结束时间
            if(vm.q.repairStartEndDate != null){
                url += '&repairStartEndDate='+vm.q.repairStartEndDate;
            }
            //维修开始时间时间类型
            if(vm.q.repairStartTimeType != null){
                url += '&repairStartTimeType='+vm.q.repairStartTimeType;
            }
            //维修开始时间自定义时间段
            if(vm.q.repairStarDateStr != null){
                url += '&repairStarDateStr='+vm.q.repairStarDateStr;
            }
            //维修结束时间开始时间
            if(vm.q.repairEndStartDate != null){
                url += '&repairEndStartDate='+vm.q.repairEndStartDate;
            }
            //维修结束时间开始时间
             if(vm.q.repairEndEndDate != null){
                 url += '&repairEndEndDate='+vm.q.repairEndEndDate;
             }
            //维修结束时间类型
             if(vm.q.repairEndTimeType != null){
                 url += '&repairEndTimeType='+vm.q.repairEndTimeType;
             }
            //维修结束时间自定义时间段
             if(vm.q.repairEndDateStr != null){
                 url += '&repairEndDateStr='+vm.q.repairEndDateStr;
             }
             //车辆所有人
             if(vm.q.carOwner != null){
                 url += '&carOwner='+vm.q.carOwner;
             }
            //维修项目内容
            if(vm.q.maintenanceItems != null){
                url += '&maintenanceItems='+vm.q.maintenanceItems;
            }


            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carPlateNoVinNo: vm.q.carPlateNoVinNo,
                    deptId: vm.q.deptId,
                    brandId:vm.q.brandId ,
                    seriesId:vm.q.seriesId,
                    modelId:vm.q.modelId ,
                    carStatus: vm.q.carStatus,
                    customer: vm.q.customer,
                    orderNo: vm.q.orderNo,
                    depotId: vm.q.depotId,
                    repairStatus: vm.q.repairStatus,
                    serviceName: vm.q.serviceName,
                    costSettlement: vm.q.costSettlement,
                    faultDesc: vm.q.faultDesc,
                    applyNo: vm.q.applyNo,
                    //维修开始时间时间类型
                    repairStartTimeType:vm.q.repairStartTimeType,
                    //维修开始时间自定义时间段
                    repairStarDateStr:vm.q.repairStarDateStr,
                    //维修结束时间类型
                    repairEndTimeType:vm.q.repairEndTimeType,
                    //维修结束时间自定义时间段
                    repairEndDateStr:vm.q.repairEndDateStr,
                    carOwner:vm.q.carOwner,
                    maintenanceItems:vm.q.maintenanceItems,
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }

    }
});


function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}


function initClick() {
    $('div[type="repairStartDate"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "repairStarDateStr", '');
        //维修开始时间类型
        vm.q.repairStartTimeType=value;
    });

    $('div[type="repairEndDate"]>div').on('click', function(){
        var selected = $(this);
       $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "repairEndDateStr", '');
        vm.q.repairEndTimeType=value;
    });
}

function initDate(laydate) {
    //维修开始时间，自定义时间
    laydate.render({
        elem : '#repairStartDate',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairStartDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairStarDateStr=value;
            vm.q.repairStartTimeType=null;
        }
    });

    //维修结束时间，自定义时间
    laydate.render({
        elem : '#repairEndDate',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="repairEndDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.repairEndDateStr=value;
            vm.q.repairEndTimeType=null;

        }
    });
}

function initData() {


}
/**
 * 跳转至辆详情页面
 */

function  goToCarDetail(carId) {
    var index = layer.open({
        title: "车辆详情",
        type: 2,
        content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
        success: function(layero,num){
            var iframe = window['layui-layer-iframe'+num];
            iframe.vm.initEditData(carId);
        },
        end: function () {
            vm.showForm = false;
            layer.closeAll();
        }
    });
    vm.showForm = true;
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









