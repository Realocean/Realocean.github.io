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
            url: baseURL + 'outinsuranceorder/ouinsuranceorder/list',
            /*toolbar: true,
            defaultToolbar: ['filter'],*/
            where:{carPlateNo:vm.q.carPlateNo},
            cols: [[
                {title: '操作', width:170, minWidth:170,templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carPlateNo', minWidth:100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                    if(d.carPlateNo!=null && d.carPlateNo!=''){
                        return "<span style='color:#419BEA;cursor:pointer;' onclick=goToCarDetail(\'"+d.carId+"\')>"+d.carPlateNo+"</span>";

                    }else{
                        return "--";
                    }
                }},
                {field:'outReason', minWidth:100, title: '出险经过及原因',templet:function (d) {
                        return  isEmpty(d.outReason);
                    }},
                {field:'outAddr', minWidth:100, title: '出险地点',templet:function (d) {
                        return  isEmpty(d.outAddr);
                    }},
                {field:'outDate', minWidth:100, title: '出险时间',templet:function (d) {
                        return  isEmpty(d.outDate);
                    }},
                {field:'outLevel', minWidth:100, title: '事故等级',templet:function (d) {
                        if(d.outLevel==1){
                            return "一般事故";
                        }else if(d.outLevel==2){
                            return "较大事故";
                        }else if(d.outLevel==3){
                            return "重大事故";
                        }else if(d.outLevel==4){
                            return "特别重大事故";
                        }else {
                            return "--";
                        }
                    }},
                {field:'responsibleParty', minWidth:100, title: '责任方',templet:function (d) {
                        if(d.responsibleParty==1){
                            return "20%";
                        }else if(d.responsibleParty==2){
                            return "30%";
                        }else if(d.responsibleParty==3){
                            return "50%";
                        }else if(d.responsibleParty==4){
                            return "100%";
                        }else if(d.responsibleParty==5){
                            return "0%";
                        }else if(d.responsibleParty==6){
                            return "70%";
                        }else {
                            return "--";
                        }
                    }},
                {field:'serviceName', minWidth:100, title: '维修厂'},
                {field:'applyNo', minWidth:100, title: '出险申请单号'},
                {field:'outInsuranceStatusStr', minWidth:100, title: '出险状态'},
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
                        }else  if(d.carStatus==6){
                            return "已处置";
                        }else  if(d.carStatus==7){
                            return "已出售";
                        }else {
                            return "--";
                        }
                    }},
                {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){
                    return getRentTypeStr(d.rentType);
                    }},
                {field:'vinNo', minWidth:100, title: '车架号'},
                {field:'carBrandModelName', minWidth:100, title: '品牌/车系/车型',templet:function (d) {
                        return  isEmpty(d.carBrandModelName);
                    }},
                {field:'deptName', minWidth:100, title: '车辆归属',templet:function (d) {
                        return  isEmpty(d.deptName);
                 }},
                {field:'depotName', minWidth:100, title: '所在仓库',templet:function (d) {
                        return  isEmpty(d.depotName);
                    }},
                {field:'carOwner', minWidth:100, title: '车辆所有人',templet:function (d) {
                        return  isEmpty(d.carOwner);
                 }},

                // {field:'carOrderNo', minWidth:100, title: '订单编号',templet:function (d) {
                //          console.log(d.orderCarId);
                //         if(d.carOrderNo!=null && d.carOrderNo!=''){
                //             return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderCarId+"\')>"+d.carOrderNo+"</span>";
                //
                //         }else {
                //             return "--";
                //         }
                //  }},
                // {field:'customer', minWidth:100, title: '客户名称',templet:function (d) {
                //         return  isEmpty(d.customer);
                // }},

            ]],
            cols: vm.cols,
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        })
    });

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
    //车辆状态
    layui.form.on('select(carStatusSelect)', function (data) {
        vm.q.carStatus = data.value;
    });
    //事故等级
    layui.form.on('select(outLevel)', function (data) {
        vm.q.outLevel = data.value;
    });
    //责任方
    layui.form.on('select(responsibleParty)', function (data) {
        vm.q.responsibleParty = data.value;
    });
    //车辆用途
    layui.form.on('select(carPurposeSelect)', function (data) {
        vm.q.carPurpose = data.value;
    });

    //出险时间
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
        laydate.render({
            elem: '#outDateSearch',
            type: 'date',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.outDateStr = value;
            }
        });
        form.render();
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
        } else if(layEvent === 'check'){
            vm.check(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'reedit'){
            vm.reedit(data.id);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carPlateNo:null,
            deptId: null,
            deptName: null,
            //品牌车系车型
            brandId :null,
            seriesId :null,
            modelId :null,
            carStatus: null,
            customer: null,
            carOrderNo: null,
            applyNo: null,
            depotName: null,
            depotId:null,
            outAddr:null,
            outReason:null,
            //事故等级
            outLevel:null,
            //责任方
            responsibleParty:null,
            //出险时间类型
            outDataTimeType:null,
            //出险时间自定义字段
            outDateStr:null,
            carOwner:null,
            page: 1,
            limit: 10,
        },
        showForm: false,
        allCarModels:[],
        warehouseData:{},
        //事故等级
        outLevelList:[],
        isFilter:false,
        tableData:[],
        totalCount:null,
        cols:[[
            {title: '操作', width:170, minWidth:170,templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carPlateNo', minWidth:100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                    if(d.carPlateNo!=null && d.carPlateNo!=''){
                        return "<span style='color:#419BEA;cursor:pointer;' onclick=goToCarDetail(\'"+d.carId+"\')>"+d.carPlateNo+"</span>";

                    }else{
                        return "--";
                    }
                }},
            {field:'outReason', minWidth:100, title: '出险经过及原因',templet:function (d) {
                    return  isEmpty(d.outReason);
                }},
            {field:'outAddr', minWidth:100, title: '出险地点',templet:function (d) {
                    return  isEmpty(d.outAddr);
                }},
            {field:'outDate', minWidth:100, title: '出险时间',templet:function (d) {
                    return  isEmpty(d.outDate);
                }},
            {field:'outLevel', minWidth:100, title: '事故等级',templet:function (d) {
                    if(d.outLevel==1){
                        return "一般事故";
                    }else if(d.outLevel==2){
                        return "较大事故";
                    }else if(d.outLevel==3){
                        return "重大事故";
                    }else if(d.outLevel==4){
                        return "特别重大事故";
                    }else {
                        return "--";
                    }
                }},
            {field:'responsibleParty', minWidth:100, title: '责任方',templet:function (d) {
                    if(d.responsibleParty==1){
                        return "20%";
                    }else if(d.responsibleParty==2){
                        return "30%";
                    }else if(d.responsibleParty==3){
                        return "50%";
                    }else if(d.responsibleParty==4){
                        return "100%";
                    }else if(d.responsibleParty==5){
                        return "0%";
                    }else if(d.responsibleParty==6){
                        return "70%";
                    }else {
                        return "--";
                    }
                }},
            {field:'serviceName', minWidth:100, title: '维修厂'},
            {field:'applyNo', minWidth:100, title: '出险申请单号'},
            {field:'outInsuranceStatusStr', minWidth:100, title: '出险状态'},
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
                    }else  if(d.carStatus==6){
                        return "已处置";
                    }else  if(d.carStatus==7){
                        return "已出售";
                    }else {
                        return "--";
                    }
                }},
            {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){
                    return getRentTypeStr(d.rentType);
                }},
            {field:'vinNo', minWidth:100, title: '车架号'},
            {field:'carBrandModelName', minWidth:100, title: '品牌/车系/车型',templet:function (d) {
                    return  isEmpty(d.carBrandModelName);
                }},
            {field:'deptName', minWidth:100, title: '车辆归属',templet:function (d) {
                    return  isEmpty(d.deptName);
                }},
            {field:'depotName', minWidth:100, title: '所在仓库',templet:function (d) {
                    return  isEmpty(d.depotName);
                }},
            {field:'carOwner', minWidth:100, title: '车辆所有人',templet:function (d) {
                    return  isEmpty(d.carOwner);
                }},

            // {field:'carOrderNo', minWidth:100, title: '订单编号',templet:function (d) {
            //          console.log(d.orderCarId);
            //         if(d.carOrderNo!=null && d.carOrderNo!=''){
            //             return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderCarId+"\')>"+d.carOrderNo+"</span>";
            //
            //         }else {
            //             return "--";
            //         }
            //  }},
            // {field:'customer', minWidth:100, title: '客户名称',templet:function (d) {
            //         return  isEmpty(d.customer);
            // }},

        ]]
    },
    updated: function(){
        layui.form.render();
    },
    created: function () {
        var _this = this;
        _this.q.carPlateNo = parent.layer.boxParams.boxParams;
        $.getJSON(baseURL + "maintenance/insurancemanage/listBrandAndModel", function (r) {
            _this.allCarModels = r.listData;
        });
        //事故等级查询
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"accidentLevel",
            contentType: "application/json",
            data:null,
            success: function(r){
                vm.outLevelList= r.dict;
            }
        });

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
        this.getList()
    },
    methods: {
        handleSizeChange(val){
            this.q.limit = val
            this.getList()
        },
        handleCurrentChange(val){
            this.q.page = val
            this.getList()
        },
        getList(){
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "outinsuranceorder/ouinsuranceorder/list",
                // contentType: "application/json",
                data: that.q,
                success: function(r){
                    if(r.code==0){
                        that.tableData = r.data
                        that.totalCount = Number(r.count)
                    }
                }
            });
        },

        initParam:function(carNo){
            vm.q.carPlateNo=carNo;
            vm.reload();
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
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
        query: function () {
            vm.reload();
        },
        reset:function(){
                vm.q.carPlateNo=null,
                vm.q.deptId=null,
                vm.q.deptName=null,
                //品牌车系车型
                vm.q.brandId =null;
                vm.q.seriesId=null;
                vm.q.modelId =null;
                vm.q.carStatus=null,
                vm.q.customer=null,
                vm.q.carOrderNo=null,
                vm.q.depotName=null,
                vm.q.depotId=null,
                vm.q.applyNo=null,
                vm.q.outAddr=null,
                vm.q.outReason=null,
                vm.q.outLevel=null,
                    vm.q.serviceName=null,
                vm.q.responsibleParty=null,
                vm.q.outDataTimeType=null,
                vm.q.outDateStr=null,
                vm.q.carOwner=null,
                $("#carBrandSeriesModel").val("");
                $('div[type="outDate"]>div').removeClass('task-content-box-tab-child-active');
                vm.refreshList();
        },
        add: function(){
            var index = layer.open({
                title: "维保管理 > 出险列表 >新增出险单",
                type: 2,
                content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorderadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        reedit: function(id){
            var index = layer.open({
                title: "维保管理 > 出险列表 >新增出险单",
                type: 2,
                boxParams: {
                    id:id
                },
                content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorderadd.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        check:function(id){
            window.localStorage.setItem("outInsuranceOrderId",id);
            var index = layer.open({
                title: "维保管理 > 出险列表 >查看出险单",
                type: 2,
                content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorderdetail.html",
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        update: function (id) {
            window.localStorage.setItem("outInsuranceOrderId",id);
            var index = layer.open({
                title: "维保管理 > 出险列表 >编辑出险单",
                type: 2,
                content: tabBaseURL + "modules/outinsuranceorder/outinsuranceorderedit.html",
                end: function () {
                    layer.closeAll();
                    window.localStorage.setItem("outInsuranceOrderId",null);
                }
            });
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "outinsuranceorder/ouinsuranceorder/delete",
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
        exports: function () {
            var url = baseURL + 'outinsuranceorder/ouinsuranceorder/export?a=a';
            if(vm.q.carPlateNo != null){
                url += '&carPlateNo='+vm.q.carPlateNo;
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
            if(vm.q.carOrderNo != null){
                url += '&carOrderNo='+vm.q.carOrderNo;
            }
            if(vm.q.depotId != null){
                url += '&depotId='+vm.q.depotId;
            }
            if(vm.q.applyNo != null){
                url += '&applyNo='+vm.q.applyNo;
            }
            if(vm.q.outAddr != null){
                url += '&outAddr='+vm.q.outAddr;
            }
            if(vm.q.outReason != null){
                url += '&outReason='+vm.q.outReason;
            }
            if(vm.q.outLevel != null){
                url += '&outLevel='+vm.q.outLevel;
            }
            if(vm.q.responsibleParty != null){
                url += '&responsibleParty='+vm.q.responsibleParty;
            }
            if(vm.q.outDataTimeType != null){
                url += '&outDataTimeType='+vm.q.outDataTimeType;
            }
            if(vm.q.serviceName != null){
                url += '&serviceName='+vm.q.serviceName;
            }
            if(vm.q.outDateStr != null){
                url += '&outDateStr='+vm.q.outDateStr;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carPlateNo:vm.q.carPlateNo,
                    deptId: vm.q.deptId,
                    deptName:vm.q.deptName,
                    brandId:vm.q.brandId ,
                    seriesId:vm.q.seriesId,
                    modelId:vm.q.modelId ,
                    carStatus:vm.q.carStatus,
                    customer :vm.q.customer,
                    carOrderNo:vm.q.carOrderNo,
                    depotId:vm.q.depotId,
                    applyNo:vm.q.applyNo,
                    outAddr:vm.q.outAddr,
                    outReason:vm.q.outReason,
                    outLevel:vm.q.outLevel,
                    responsibleParty:vm.q.responsibleParty,
                    outDataTimeType:vm.q.outDataTimeType,
                    outDateStr:vm.q.outDateStr,
                    serviceName:vm.q.serviceName,
                    carOwner:vm.q.carOwner,
                }
            });
            vm.refreshList();
        },
        refreshList(){
            vm.q.page = 1;
            vm.q.limit = 10;
            vm.getList();
        },
    }
});

function init(layui) {
    initDate(layui.laydate);
    initClick();
}

function initClick() {
    $('div[type="outDate"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="outDate"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "outDateStr", '');
        //维修开始时间类型
        vm.q.outDataTimeType=value;
    });
}

function initDate(laydate) {
    //维修开始时间，自定义时间
    laydate.render({
        elem : '#outDataStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="outDate"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.outDateStr=value;
            vm.q.outDataTimeType=null;
        }
    });


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



