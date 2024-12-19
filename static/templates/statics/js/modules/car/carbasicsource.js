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
            url: baseURL + 'financial/carbasicsource/list',
            cols: [[
                {title: '操作', minWidth:125, templet:'#barTpl', fixed:"left",rowspan:2,align:"center"},
                {field:'carNo', minWidth:100, title:'车牌号',fixed: "left",rowspan:2,align:"center",templet:function(row) {
                    if(row.carNo != null && row.carNo != '') {
                        return row.carNo;
                    } else return '--';
                }},
                {field:'supplierName', minWidth:100, title:'供应商名称',rowspan:2,align:"center"},
                {field:'contractNo', minWidth:100, title:'合同编号',rowspan:2,align:"center",templet:function(row) {
                        if(row.contractNo != null && row.contractNo != '') {
                            return row.contractNo;
                        } else return '--';
                    }},
                {field:'carVinNo', minWidth:200, title:'车架号',rowspan:2,align:"center",templet:function(row) {
                        if(row.carVinNo != null && row.carVinNo != '') {
                            return row.carVinNo;
                        } else return '--';
                    }},
                {field:'carSourceTypeStr', minWidth:100, title:'车辆来源',rowspan:2,align:"center"},
                {field:'id', minWidth:100,align:'center', title: '直购',align: "center",colspan:3 },
                {field:'id', minWidth:100,align:'center', title: '租赁',align: "center",colspan:7 },
                {field:'id', minWidth:100,align:'center', title: '租售',align: "center",colspan:8 }
                ],
                [
                    //直购
                    {field:'purchasePrice',  minWidth:180, title: '直购单价/台/万元',align:'center', templet:function (d) {
                            if(d.purchasePrice!=null && d.purchasePrice!=""){
                                return  d.purchasePrice;
                            }else {
                                return "--";
                            }
                        }},
                    {field:'purchaseDate',  minWidth:180, title: '购买时间',align:'center', templet:function (d) {
                            if(d.purchaseDate!=null && d.purchaseDate!=""){
                                return  d.purchaseDate;
                            }else {
                                return "--";
                            }
                        }},
                    {field:'payType',minWidth:130, title: '支付方式',align:'center',templet:function (d) {
                            if(d.payType!=null && d.payType!=""){
                                if(d.carSourceType == 1){
                                    return  d.payType;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},

                    //租赁
                    {field:'rentStartDate', minWidth:180, title: '租期开始时间',align:'center', templet:function (d) {
                            if(d.rentStartDate!=null && d.rentStartDate!=""){
                                if(d.carSourceType == 2){
                                    return  d.rentStartDate;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'rentEndDate', minWidth:180, title: '租期结束时间',align:'center', templet:function (d) {
                            if(d.rentEndDate!=null && d.rentEndDate!=""){
                                if(d.carSourceType == 2){
                                    return  d.rentEndDate;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'rentMarginPrice', minWidth:130, title: '保证金/台/元',align:'center',templet:function (d) {
                            if(d.rentMarginPrice!=null && d.rentMarginPrice != null){
                                if(d.carSourceType == 2){
                                    return  d.rentMarginPrice;
                                } else{
                                    return "--";
                                }
                            } else {
                                return "--";
                            }

                        }},
                    {field:'rentMonthPrice', minWidth:200, title: '月租/台/元',align:'center', templet:function (d) {
                            if(d.rentMonthPrice!=null && d.rentMonthPrice!=""){
                                if(d.carSourceType == 2){
                                    return  d.rentMonthPrice;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'payType', minWidth:100,align:'center',title: '支付方式',templet:function (d) {
                            if(d.payType!=null && d.payType!=""){
                                if(d.carSourceType == 2){
                                    return  d.payType;
                                } else {
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'dueDate', minWidth:120,align:'center', title: '还款日',templet:function (d) {
                            if(d.dueDate!=null && d.dueDate!=""){
                                if(d.carSourceType == 2){
                                    return  d.dueDate;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'amountPaid', minWidth:150, title: '已支付金额',align:'center',templet:function (d) {
                            if(d.amountPaid!=null && d.amountPaid!=""){
                                if(d.carSourceType == 2){
                                    return  d.amountPaid;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    // 租售
                    {field:'rentStartDate', minWidth:180, title: '租期开始时间',align:'center', templet:function (d) {
                            if(d.rentStartDate!=null && d.rentStartDate!=""){
                                if(d.carSourceType == 3){
                                    return  d.rentStartDate;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'rentEndDate', minWidth:180, title: '租期结束时间',align:'center', templet:function (d) {
                            if(d.rentEndDate!=null && d.rentEndDate!=""){
                                if(d.carSourceType == 3){
                                    return  d.rentEndDate;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'rentMarginPrice', minWidth:180, title: '首付款/台/元',align:'center', templet:function (d) {
                            if(d.rentMarginPrice!=null && d.rentMarginPrice!=""){
                                if(d.carSourceType == 3){
                                    return  d.rentMarginPrice;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'rentMonthPrice', minWidth:130, title: '月租/台/元',align:'center',templet:function (d) {
                            if(d.rentMonthPrice!=null && d.rentMonthPrice != null){
                                if(d.carSourceType == 3){
                                    return  d.rentMonthPrice;
                                } else{
                                    return "--";
                                }
                            }  else {
                                return "--";
                            }
                        }},
                    {field:'refundTypeStr', minWidth:200, title: '还款形式',align:'center', templet:function (d) {
                            if(d.refundTypeStr!=null && d.refundTypeStr!=""){
                                if(d.carSourceType == 3){
                                    return  d.refundTypeStr;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'dueDate', minWidth:120,align:'center',title: '还款日',templet:function (d) {
                            if(d.dueDate!=null && d.dueDate!=""){
                                if(d.carSourceType == 3){
                                    return  d.dueDate;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'payType', minWidth:120,align:'center', title: '支付方式',templet:function (d) {
                            if(d.payType!=null && d.payType!=""){
                                if(d.carSourceType == 3){
                                    return  d.payType;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
                            }
                        }},
                    {field:'amountPaid', minWidth:150, title: '已支付金额',align:'center',templet:function (d) {
                            if(d.amountPaid!=null && d.amountPaid!=""){
                                if(d.carSourceType == 3){
                                    return  d.amountPaid;
                                } else{
                                    return "--";
                                }
                            }else {
                                return "--";
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


    //页面表单相关组件初始化
    layui.use(['form', 'layedit', 'layer','laydate'], function(){
        var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
        form.on('radio(disputeCheck)', function (data) {
            vm.transferCarData.isConnectCar = data.value;
        });
        form.on('submit(transferCarSave)', function () {
            vm.transferUpdate(vm.transferCarData.id,vm.transferCarData.type);
            return false;
        });
        form.render();
    });

    layui.form.on('select(carSourceTypeSelect)', function (data) {
        vm.q.carSourceType = data.value;
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
         if(layEvent === 'details'){
            vm.details(data.id);
        }else if(layEvent === 'transfer'){
             vm.transfer(data);
         }
    });

    layui.use([ "element", "laypage", "layer", "upload"], function() {
        var upload = layui.upload;//主要是这个
        upload.render({ //允许上传的文件后缀
            elem: '#sorffff',
            url: baseURL + 'car/tcarbasic/carPurImport',
            accept: 'file', //普通文件
            exts: 'xlsx|xls', //只允许上传excel
            done: function(r){
                if(r.resultFlag==3 || r.resultFlag==1){
                    alert(r.msg);
                    layer.confirm(r.msg, {
                        btn: ['下载错误数据', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'car/tcarbasic/exportresouresExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                }else{
                    layer.confirm(r.msg, {
                        btn: ['下载错误日志', '取消'] //可以无限个按钮
                    }, function(index, layero){
                        window.location.href = baseURL + 'car/tcarbasic/exportresouresExcel?numberNo='+r.numberNo;
                    }, function(index){
                        layer.close(index);
                    });
                }
                vm.reload();
            }
        });
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            supplierName: null,
            carNo:null,
            carSourceType:null
        },
        carBasicSource: {},
        transferCarShow: false,
        transferCarData: {}
    },
    created: function() {

    },
    updated: function(){
        $('select').removeClass('layui-form-danger');
        layui.form.render();
    },

    methods: {
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
        reset: function () {
            vm.q={
                supplierName: null,
                carNo:null,
                carSourceType:null
            };
        },
        transfer: function (data) {
            layer.confirm('是否车牌一起过户?', {
                btn: ['是', '否'] //可以无限个按钮
            }, function(index, layero){
                //直接过户，不更改车牌信息
                vm.transferUpdate(data.id,1);
            }, function(index1){
                //需要更改车牌号
                vm.transferCarData.id = data.id;
                vm.transferCarData.carBasicId = data.carBasicId;
                vm.transferCarData.type = 2;
                var index = layer.open({
                    title: '更改车牌信息',
                    type: 1,
                    content: $("#transferCar"),
                    end: function(){
                        vm.transferCarShow = false;
                        layer.close(index);
                    }
                });
                vm.transferCarShow = true;
                layer.full(index);
            });
        },
        transferUpdate: function(id,type){
            $.ajax({
                type: "POST",
                url: baseURL + "financial/carbasicsource/transferUpdate",
                data: {id:id,type:type,carNo:vm.transferCarData.carNo,isConnectCar:vm.transferCarData.isConnectCar,carBasicId:vm.transferCarData.carBasicId},
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
        details: function (id) {
            window.localStorage.setItem("id",id);
            var index = layer.open({
                title: "供应商管理 > 供应商车辆 > 详情",
                type: 2,
                content: tabBaseURL+'modules/car/carbasicsourcedetail.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        cancel: function(){   //取消事件
            layui.form.render();
            layer.closeAll();
        },
        transferCarCancel: function(){
            layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    supplierName: vm.q.supplierName,
                    carNo:vm.q.carNo,
                    carSourceType:vm.q.carSourceType
                }
            });
        }
    }
});

