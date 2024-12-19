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
        url: baseURL + 'financial/settleorder/list',
        cols: [[
            {title: '操作', width:100, minWidth:100, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carNo', minWidth:100,fixed: "left",align:"center",title: '车牌号'},
            {field:'contractNo', minWidth:100, title: '合同编号'},
            {field:'vehicleOrderNo', minWidth:100, title: '车辆订单号'},
            {field:'settleOrderNo', minWidth:100, title: '结算订单号'},
            {field:'settleOrderStatus', minWidth:100, title: '结算单处理状态',templet:function(d){
                if(d.settleOrderStatus){
                    return "已处理";
                }else{
                    return "<span style='color:red;'>待处理</span>";
                }
            }},
            {field:'settlePersonName', minWidth:100, title: '结算方名称'},
            {field:'settlePersonType', minWidth:100, title: '结算方类型',templet:function (d){
                if(d.settlePersonType == 1){
                    return '客户/企业';
                }else if(d.settlePersonType == 2){
                    return '客户/个人';
                }else if(d.settlePersonType == 3){
                    return '渠道/企业';
                }else if(d.settlePersonType == 4){
                    return '渠道/个人';
                }
            }},
            {field:'lessorName', minWidth:100, title: '售卖方'},
            {field:'vinNo', minWidth:100, title: '车架号'},
            {field:'brand', minWidth:100, title: '品牌/车系'},
            {field:'carModel', minWidth:100, title: '车型'},
            {field:'leaseType', minWidth:100, title: '租赁类型',templet:function(d){
                    return isEmpty(getRentTypeStr(d.leaseType));
            }},
            {field:'settleType', minWidth:100, title: '结算类型',templet:function (d) {
                if(d.settleType == 1){
                    return '换车结算';
                }else if(d.settleType == 2){
                    return '退车结算';
                }else if(d.settleType == 3){
                    return '备用车结算';
                }
            }},
            {field:'alterationDesc', minWidth:100, title: '退换车原因',templet:function (d) {
                return isEmpty(d.alterationDesc);
            }},
            {field:'settleMoney', minWidth:100, title: '结算金额',templet:function(d){
                if(d.settleMoneyType == 0){
                    return "<span style='color:green;'>补缴："+d.settleMoney+"</span>";
                }else if(d.settleMoneyType == 1){
                    return "<span style='color:red;'>退款："+d.settleMoney+"</span>";
                }
            }},
            {field:'createTime', minWidth:100, title: '申请时间'},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100, 200],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function () {
            soulTable.render(this);
        }
    });
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

    //结算方类型下拉选
    layui.form.on('select(settlePersonType)', function (data) {
        vm.q.settlePersonType = data.value;
    });
    //售卖方
    layui.form.on('select(lessor)',function (data) {
        vm.q.lessor = data.value;
    })
    //品牌/车型
    layui.form.on('select(brand)',function (data) {
        vm.q.brand = data.value;
    })
    //租赁类型
    layui.form.on('select(leaseType)',function (data) {
        vm.q.leaseType = data.value;
    })
    //结算类型
    layui.form.on('select(settleType)',function (data) {
        vm.q.settleType = data.value;
    })
    //查询售卖方下拉选
    selectLessor();
    //查询品牌/车型下拉选
    selectBrandAndModel();


    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'show'){
            vm.detail(data.id,data.settleOrderStatus,'detail');
        } else if(layEvent === 'operation'){
            vm.detail(data.id);
        }
    });

    /**
     * 时间
     */
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        laydate.render({
            elem: '#createTime',
            type: 'date',
            rigger: 'click',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.q.createTime = value;
            }
        });
        form.render();
    });


});


/**
 * 查询售卖方
 */
function selectLessor (){
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectLessor",
        contentType: "application/json",
        success: function(res){
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#lessor').append(new Option(item.companyName, item.deptId));
            });
            layui.form.render("select");
        },
        error:function(error){
            console.log(error);
        }
    });
}

/**
 * 查询品牌/车型
 */
function selectBrandAndModel (){
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectBrandAndModel",
        contentType: "application/json",
        success: function(res){
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#brand').append(new Option(item.brandAndModel, item.brandAndModel));
            });
            layui.form.render("select");
        },
        error:function(error){
            console.log(error);
        }
    });
}

/**
 * 结算单处理
 */
// function operation(id,flag){
//     $.ajax({
//         type: "GET",
//         url: baseURL + "financial/settleorder/operation",
//         contentType: "application/json",
//         data:{
//             id:id,
//             flag:flag
//         },
//         success: function(res){
//             if(res.code == 0){
//                 alert('操作成功', function(){
//                     layer.closeAll();
//                     vm.reload();
//                 });
//             }
//         },
//         error:function(error){
//             console.log(error);
//         }
//     });
// }
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            vehicleOrderNo: null,
            settleOrderNo:null,
            contractNo:null,
            settlePersonName:null,
            settlePersonType:null,
            lessor:null,
        //  brand:null,
            leaseType:null,
            settleType:null,
            carNo:null,
            createTime:null,
            brandId :null,
            seriesId :null,
            modelId :null,



        },
        showForm: false,
        settleOrder: {},
        carBrandSeriesModel:[],
        isFilter:false
    },
    updated: function(){
        layui.form.render();
    },
    created: function () {
        debugger
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            if (param.carvinno) {
                _this.q.carNo = param.carvinno;
            }
        }
        _this. reload();
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
            vm.q.vehicleOrderNo = null;
            vm.q.settleOrderNo = null;
            vm.q.contractNo = null;
            vm.q.settlePersonName = null;
            vm.q.settlePersonType = null;
            vm.q.lessor = null;
            vm.q.brand = null;
            vm.q.leaseType = null;
            vm.q.settleType = null;
            vm.q.carNo = null;
            vm.q.createTime = null;
            vm.q.brandId=null;
            vm.q.seriesId =null;
            vm.q.modelId =null;

            $("#carBrandSeriesModel").val("");
        },
        detail:function(id,settleOrderStatus,type){
            window.localStorage.setItem("id",id);
            if(type==='detail'){
                var index = layer.open({
                    title: "结算单详情",
                    type: 2,
                    content: tabBaseURL+'modules/financial/settleOrderDetail.html',
                    boxParams: {type:type},
                    end: function(){
                        layer.close(index);
                        window.localStorage.setItem("id",null);
                    },
                });
            }else{
                var index = layer.open({
                    title: "结算单详情",
                    type: 2,
                    content: tabBaseURL+'modules/financial/settleOrderDetail.html',
                    btn:['同意结算','拒绝','取消'],
                    btnAlign: 'c',
                    end: function(){
                        layer.close(index);
                        window.localStorage.setItem("id",null);
                    },
                    btn1:function () {
                        layer.confirm('是否确认结算？', {
                            btn: ['确认','取消'] //按钮
                        }, function(){
                            vm.operation(id,true);
                        });
                    },
                    btn2:function () {
                        vm.operation(id,false);
                    },
                    btn3:function () {
                        layer.closeAll();
                    }
                });
            }
            layer.full(index);
        },
        exports: function () {
            debugger
            var url = baseURL + 'financial/settleorder/export?a=a';
            if(vm.q.vehicleOrderNo != null){
                url += '&vehicleOrderNo='+vm.q.vehicleOrderNo;
            }
            if(vm.q.settleOrderNo != null){
                url += '&settleOrderNo='+vm.q.settleOrderNo;
            }
            if(vm.q.contractNo != null){
                url += '&contractNo='+vm.q.contractNo;
            }
            if(vm.q.settlePersonName != null){
                url += '&settlePersonName='+vm.q.settlePersonName;
            }
            if(vm.q.settlePersonType != null){
                url += '&settlePersonType='+vm.q.settlePersonType;
            }
            if(vm.q.lessor != null){
                url += '&lessor='+vm.q.lessor;
            }
            if(vm.q.leaseType != null){
                url += '&leaseType='+vm.q.leaseType;
            }
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q.createTime != null){
                url += '&createTime='+vm.q.createTime;
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

            window.location.href = url;
        },
        operation:function(id,flag){
            $.ajax({
                type: "GET",
                url: baseURL + "financial/settleorder/operation",
                contentType: "application/json",
                data:{
                    id:id,
                    flag:flag
                },
                success: function(res){
                    if(res.code === 0){
                        alert('操作成功', function(){
                            layer.closeAll();
                            vm.reload();
                        });
                    }
                },
                error:function(error){
                    console.log(error);
                }
            });
        },
        cancel: function () {
            layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                url: baseURL + 'financial/settleorder/list',
                where: {
                    vehicleOrderNo: vm.q.vehicleOrderNo,
                    settleOrderNo: vm.q.settleOrderNo,
                    contractNo: vm.q.contractNo,
                    settlePersonName: vm.q.settlePersonName,
                    settlePersonType: vm.q.settlePersonType,
                    lessor: vm.q.lessor,
                //  brand: vm.q.brand,
                    leaseType: vm.q.leaseType,
                    settleType: vm.q.settleType,
                    carNo: vm.q.carNo,
                    createTime: vm.q.createTime,
                    brandId:vm.q.brandId,
                    seriesId:vm.q.seriesId ,
                    modelId:vm.q.modelId,
        }
            });
        },
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
});
