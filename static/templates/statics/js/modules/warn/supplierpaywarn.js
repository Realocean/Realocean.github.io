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
            url: baseURL + 'supplierPayWarn/supplierpaywarn/list',
            cols: [[
                {title: '操作', width:100, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carNo', minWidth:120, title: '车牌号',fixed: "left",align:'center', templet:function (d) { return isEmpty(d.carNo) }},
                {field:'rentMonthPrice', minWidth:120, title: '月租金',align:'center', templet:function (d) { return isEmpty(d.rentMonthPrice) }},
                {field:'amountPaid', minWidth:120, title: '已付金额',align:'center', templet:function (d) { return isEmpty(d.amountPaid) }},
                {field:'paymentTypeShow', minWidth:120, title: '欠款类型',align:'center',templet:function (d) {return isEmpty(d.paymentTypeShow) }},
                {field:'warnStr', minWidth:120, title: '预警提醒',align:'center', templet:function (d) { return isEmpty(d.warnStr) }},
                {field:'supplierName', minWidth:200, title: '供应商名称',align:'center', templet:function (d) { return isEmpty(d.supplierName) }},
                {field:'contractNo', minWidth:120, title: '合同编号',align:'center', templet:function (d) { return isEmpty(d.contractNo) }},
                {field:'rentTypeStr', minWidth:100, title: '租车类型',align:'center', templet:function (d) { return isEmpty(d.rentTypeStr) }},
                {field:'dueDate', minWidth:120, title: '应付日期',align:'center', templet:function (d) { return isEmpty(d.dueDate) }},
                {field:'payType', minWidth:120, title: '支付方式',align:'center', templet:function (d) { return isEmpty(d.payType) }},
                {field:'rentStartDate', minWidth:120, title: '租赁开始时间',align:'center', templet:function (d) { return isEmpty(d.rentStartDate) }},
                {field:'rentEndDate', minWidth:120, title: '租赁结束时间',align:'center', templet:function (d) { return isEmpty(d.rentEndDate) }},
                {field:'businessTypeShow', minWidth:120, title: '车辆状态',align:'center',templet:function (d) {return isEmpty(d.businessTypeShow) }},
                {field:'vinNo', minWidth:120, title: '车架号',align:'center', templet:function (d) { return isEmpty(d.vinNo) }},
                {field:'brandSeriesModeName', minWidth:200, title: '品牌/车系/车型',align:'center', templet:function (d) { return isEmpty(d.brandSeriesModeName) }},
                {field:'deptName', minWidth:200, title: '车辆归属',align:'center', templet:function (d) { return isEmpty(d.deptName) }},
                {field:'carOwner', minWidth:120, title: '车辆所有人',align:'center', templet:function (d) { return isEmpty(d.carOwner) }},
              //{field:'repaymentType', minWidth:120, title: '付款方式',align:'center', templet:function (d) { return isEmpty(d.repaymentType) }},
              //   {field:'dealStatusStr', minWidth:120, title: '处理状态',align:'center', templet:function (d) { return isEmpty(d.dealStatusStr) }},
              //   {field:'collectStatusStr', minWidth:120, title: '收款状态',align:'center', templet:function (d) { return isEmpty(d.collectStatusStr) }},
              //   {field:'dealRemark', minWidth:120, title: '处理备注',align:'center', templet:function (d) { return isEmpty(d.dealRemark) }},

            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            done: function () {
                soulTable.render(this);
            }
        });
    }),
    layui.use(['form','laydate', 'laydate'], function () {
            var form = layui.form;
            var laydate= layui.laydate;
            init(layui);
            form.render();
     })
    vm.changeStatus(0);
    //欠款类型
     layui.form.on('select(oweMoneyType)',function (data) {
         vm.q.oweMoneyType = data.value;
     })
    //车辆来源
    layui.form.on('select(leaseType)',function (data) {
         vm.q.leaseType = data.value;
    })
    //车辆状态
    layui.form.on('select(carStatusSelect)',function (data) {
         vm.q.carStatusStr = data.value;
    })


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
        } else if(layEvent === 'view'){
            vm.view(data.id);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carNo: null,
            deptId:null,
            deptName:null,
            brandId:null,
            seriesId:null,
            modelId:null,
            supplierName:null,
            leaseType:null,
            carOwner:null,
            contractNo:null,
            carStatusStr:null,
            oweMoneyType:null,
            //租赁开始时间
            timeStartRentType:null,
            timeStartRentStr:null,
            //租赁结束时间
            timeFinishRentType:null,
            timeFinishRentStr:null,
            sqlType:null,
        },
        total:{},
        showForm: false,
        supplierPayWarn: {},
        isFilter:false,
        dateConfig1:30,
        dateConfig2:60
    },
    updated: function(){
        layui.form.render();
    },
    created: function () {
        var _this=this;
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=上游付款提醒&tabOrder=2",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig1 = r.config.tabValue;
                }
            }
        });
        $.ajax({
            type: "GET",
            url: baseURL + "sys/config/getTabParam?moduleName=上游付款提醒&tabOrder=3",
            async: false,
            success: function(r){
                if (r.config != null){
                    _this.dateConfig2 = r.config.tabValue;
                }
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
    },
    methods: {
        reset: function () {
            vm.q.carNo = null;
            vm.q.deptId = null;
            vm.q.deptName = null;
            vm.q.brandId = null;
            vm.q.seriesId = null;
            vm.q.modelId = null;
            vm.q.supplierName = null;
            vm.q.leaseType = null;
            vm.q.carOwner = null;
            vm.q.contractNo = null;
            vm.q.carStatusStr = null;
            vm.q.oweMoneyType = null;
            //租赁开始时间
            vm.q.timeStartRentType = null;
            vm.q.timeStartRentStr = null;
            //租赁结束时间
            vm.q.timeFinishRentType = null;
            vm.q.timeFinishRentStr = null;

            $("#carBrandSeriesModel").val("");
            $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');
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
        query: function () {
            vm.reload();
        },
        view: function(id){
            window.localStorage.setItem("id",id);
            var index = layer.open({
                title: "风控预警 > 供应商付费预警 > 查看详情",
                type: 2,
                content: tabBaseURL+'modules/warn/supplierpaywarndetail.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                   //vm.reload();
                }
            });
            layer.full(index);
        },
        update: function (id) {
            window.localStorage.setItem("id",id);
            var index = layer.open({
                title: "风控预警 > 供应商付费预警 > 预警处理",
                type: 2,
                content: tabBaseURL+'modules/warn/supplierpaywarndeal.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "supplierPayWarn/supplierpaywarn/delete",
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
            var url = vm.supplierPayWarn.id == null ? "supplierPayWarn/supplierpaywarn/save" : "supplierPayWarn/supplierpaywarn/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.supplierPayWarn),
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
            var url = baseURL + 'supplierPayWarn/supplierpaywarn/export?a=a';
            if(vm.q.sqlType != null){
                url += '&sqlType='+vm.q.sqlType;
            }
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
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
            if(vm.q.supplierName != null){
                url += '&supplierName='+vm.q.supplierName;
            }
            if(vm.q.leaseType != null){
                url += '&leaseType='+vm.q.leaseType;
            }
            if(vm.q.carOwner != null){
                url += '&carOwner='+vm.q.carOwner;
            }
            if(vm.q.contractNo != null){
                url += '&contractNo='+vm.q.contractNo;
            }
            if(vm.q.carStatusStr != null){
                url += '&carStatusStr='+vm.q.carStatusStr;
            }
            if(vm.q.oweMoneyType != null){
                url += '&oweMoneyType='+vm.q.oweMoneyType;
            }
            if(vm.q.timeStartRentType != null){
                url += '&timeStartRentType='+vm.q.timeStartRentType;
            }
            if(vm.q.timeStartRentStr != null){
                url += '&timeStartRentStr='+vm.q.timeStartRentStr;
            }
            if(vm.q.timeFinishRentType != null){
                url += '&timeFinishRentType='+vm.q.timeFinishRentType;
            }
            if(vm.q.timeFinishRentStr != null){
                url += '&timeFinishRentStr='+vm.q.timeFinishRentStr;
            }
            window.location.href = url;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo,
                    deptId: vm.q.deptId,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId,
                    supplierName: vm.q.supplierName,
                    leaseType: vm.q.leaseType,
                    carOwner: vm.q.carOwner,
                    contractNo: vm.q.contractNo,
                    carStatusStr: vm.q.carStatusStr,
                    oweMoneyType: vm.q.oweMoneyType,
                    //租赁开始时间
                    timeStartRentType: vm.q.timeStartRentType,
                    timeStartRentStr: vm.q.timeStartRentStr,
                    //租赁结束时间
                    timeFinishRentType: vm.q.timeFinishRentType,
                    timeFinishRentStr: vm.q.timeFinishRentStr,
                    sqlType:vm.q.sqlType

                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
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
        changeStatus: function (type) {
            removeClass();
            cleanQuery();
            if(type == 0){
                $("#all").addClass("flex active");
                vm.q.sqlType = null;
            }else if (type == 1) {
                $("#field1").addClass("flex active");
                vm.q.sqlType = 1;
            } else if (type == 2) {
                $("#field2").addClass("flex active");
                vm.q.sqlType = 2;
            }
            vm.reload();
        },
    }
});

function selectTotal(){
    $.ajax({
        type: "GET",
        url: baseURL + "supplierPayWarn/supplierpaywarn/total",
        contentType: "application/json",
        success: function(res){
            vm.total = res.data;
        },
    });
}

function removeClass() {
    $("#all").removeClass("active");
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
}

function cleanQuery() {
    vm.q.carNo = null;
    vm.q.deptId = null;
    vm.q.deptName = null;
    vm.q.brandId = null;
    vm.q.seriesId = null;
    vm.q.modelId = null;
    vm.q.supplierName = null;
    vm.q.leaseType = null;
    vm.q.carOwner = null;
    vm.q.contractNo = null;
    vm.q.carStatusStr = null;
    vm.q.oweMoneyType = null;
    //租赁开始时间
    vm.q.timeStartRentType = null;
    vm.q.timeStartRentStr = null;
    //租赁结束时间
    vm.q.timeFinishRentType = null;
    vm.q.timeFinishRentStr = null;

    $("#carBrandSeriesModel").val("");
    $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
    $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');

}
function init(layui) {
    selectTotal();
    initDate(layui.laydate);
    initClick();
}
function initClick() {
    $('div[type="timeStartRentType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeStartRentStr", '');
        vm.q.timeStartRentType=value;
    });
    $('div[type="timeFinishRentType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeFinishRentStr", '');
        vm.q.timeFinishRentType=value;
    });

}

function initDate(laydate) {
    //租赁开始时间
    laydate.render({
        elem : '#timeStartRentStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeStartRentType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeStartRentStr=value;
            vm.q.timeStartRentType=null;
        }
    });
    //租赁结束时间
    laydate.render({
        elem : '#timeFinishRentStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeFinishRentType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeFinishRentStr=value;
            vm.q.timeFinishRentType=null;
        }
    });


}