$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        // debugger

        if(vm.statusKey==0){
            vm.changeStatus(2)
        }else{
            initReportData(layui,1);
            initExport(layui,1);
        }
        layui.form.render();
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
            if(layEvent === 'detail'){
                vm.detail(data.collectionId);
            }
    });

    layui.table.on('tool(prepaidGrid)', function(obj){
            var layEvent = obj.event,
                data = obj.data;
             if(layEvent === 'detail'){
                vmPrepaid.detail(data.paymentId);
            }
     });

});

//已收相关方法
var vm = new Vue({
    el:'#received',
    data:{
        q:{
            businessNo: null,
            collectionsNo: null,
            receivablesNo: null,
            customerName: null,
            customerType: null,
            leaseId: null,
            //品牌车系车型
            brandName :null,
            seriesName :null,
            modelName :null,
            rentType: null,
            collectionType: null,
            carPlateNo: null,
            statistics: null,
            actualDateStr: null,
            paymentType: null,
        },
        allCarModels:[],
        showForm: false,
        collection: {},
        headCount:{},
        isFilter:false,
        activityAble:0,
        statusKey:null,

    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        // debugger
        if (param != null){
            _this.q.actualDateStr = param['timeVal'];
            _this.q.realpayDateStr = param['timeVal'];
            if (param.hasOwnProperty('statusKey')){
                _this.statusKey = param['statusKey'];
            }
        }
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
                         vm.q.brandName=labelData[0];
                         vm.q.seriesName=labelData[1];
                         vm.q.modelName=labelData[2];
                    }
                });
            });
        });



    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            // debugger
            vm.reload();
            getHeadCount();
        },
        reset:function(){
                vm.q.businessNo=null,
                vm.q.collectionsNo=null,
                vm.q.receivablesNo=null,
                vm.q.customerName=null,
                vm.q.customerType=null,
                vm.q.leaseId=null,
                 //品牌车系车型
                vm.q.brandName =null,
                vm.q.seriesName =null,
                vm.q.modelName =null,
                vm.q.rentType=null,
                vm.q.collectionType=null,
                vm.q.carPlateNo=null,
                vm.q.statistics=null,
                vm.q.actualDateStr=null,
                vm.q.paymentType=null,
                $("#carBrandSeriesModel").val("");
        },
        detail:function(collectionId){
            //详情页面
            window.localStorage.setItem("collectionId", collectionId);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已收详情",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/collectionDetail.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        exports: function () {

            var url = baseURL + 'financial/collection/export?';
            if(vm.activityAble) url += 'activityAble='+ vm.activityAble;
            if (vm.q.businessNo) url += 'businessNo=' + vm.q.businessNo;
            if (vm.q.collectionsNo) url += '&collectionsNo=' + vm.q.receivablesNo;
            if (vm.q.customerName) url += '&customerName=' + vm.q.customerName;
            if (vm.q.customerType) url += '&customerType=' + vm.q.customerType;
            if (vm.q.leaseId) url += '&leaseId=' + vm.q.leaseId;
            if (vm.q.brandName) url += '&brandName=' + vm.q.brandName;
            if (vm.q.seriesName) url += '&seriesName=' + vm.q.seriesName;
            if (vm.q.modelName) url += '&modelName=' + vm.q.modelName;
            if (vm.q.rentType) url += '&rentType=' + vm.q.rentType;
            if (vm.q.collectionType) url += '&collectionType=' + vm.q.collectionType;
            if (vm.q.carPlateNo) url += '&carPlateNo=' + vm.q.carPlateNo;
            if (vm.q.statistics) url += '&statistics=' + vm.q.statistics;
            if (vm.q.actualDateStr) url += '&actualDateStr=' + vm.q.actualDateStr;
            if (vm.q.paymentType) url += '&paymentType=' + vm.q.paymentType;
            window.location.href = url;

        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    businessNo: vm.q.businessNo,
                    collectionsNo: vm.q.collectionsNo,
                    receivablesNo: vm.q.receivablesNo,
                    customerName: vm.q.customerName,
                    customerType: vm.q.customerType,
                    leaseId: vm.q.leaseId,
                    brandName:vm.q.brandName ,
                    seriesName:vm.q.seriesName,
                    modelName:vm.q.modelName,
                    rentType: vm.q.rentType,
                    collectionType: vm.q.collectionType,
                    carPlateNo: vm.q.carPlateNo,
                    statistics: vm.q.statistics,
                    actualDateStr: vm.q.actualDateStr,
                    paymentType: vm.q.paymentType
                }
            });
        },

        changeStatus: function(status){
            removeClass();
            if (status == 1) {
                $("#field1").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    initReportData(layui,1);
                    initExport(layui,1);
                    layui.form.render();
                });
            } else if (status == 2) {
                $("#field2").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    initReportData(layui,2);
                    layui.form.render();
                });
            } else if (status == 3) {
                $("#field3").addClass("flex active");
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
                    initReportData(layui,3);
                    initExport(layui,3);
                    layui.form.render();
                });
            }
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },


    }
});

//已付相关方法
var vmPrepaid = new Vue({
    el:'#prepaid',
    data:{
        q:{
            contractNo: null,
            payableNo: null,
            paymentType: null,
            customerName: null,
            customerType: null,
            leaseId: null,
            //品牌车系车型
            brandId :null,
            seriesId :null,
            modelId :null,
            rentType: null,
            payType: null,
            carNo: null,
            statistics: null,
            realpayDateStr: null,
        },
        allCarModels:[],
        showForm: false,
        collection: {},
        isFilterPrepaid:false

    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;

        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModelPrepaid",
                    data: vm.allCarModels,
                    success: function (valData,labelData) {
                        vmPrepaid.q.brandId = valData[0];
                        vmPrepaid.q.seriesId = valData[1];
                        vmPrepaid.q.modelId = valData[2];
                    }
                });
            });
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vmPrepaid.reload();
        },
        reset:function(){
                vmPrepaid.q.contractNo = null,
                vmPrepaid.q.payableNo = null,
                vmPrepaid.q.paymentType = null,
                vmPrepaid.q.customerName = null,
                vmPrepaid.q.customerType = null,
                vmPrepaid.q.leaseId = null,
                //品牌车系车型
                vmPrepaid.q.brandId = null;
                vmPrepaid.q.seriesId = null;
                vmPrepaid.q.modelId = null;
                vmPrepaid.q.rentType = null,
                vmPrepaid.q.payType = null,
                vmPrepaid.q.carNo = null,
                vmPrepaid.q.statistics = null,
                vmPrepaid.q.realpayDateStr = null,

                $("#carBrandSeriesModelPrepaid").val("");
        },
        detail:function(paymentId){
            //详情页面
            window.localStorage.setItem("paymentId", paymentId);
            var index = layer.open({
                title: "财务管理 > 交易流水 > 已付流水详情",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/paymentDetail.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        exports: function () {

            var url = baseURL + 'payment/payment/export?';
            if (vmPrepaid.q.contractNo) url += 'contractNo=' + vmPrepaid.q.contractNo;
            if (vmPrepaid.q.payableNo) url += '&payableNo=' + vmPrepaid.q.payableNo;
            if (vmPrepaid.q.paymentType) url += '&paymentType=' + vmPrepaid.q.paymentType;
            if (vmPrepaid.q.customerName) url += '&customerName=' + vmPrepaid.q.customerName;
            if (vmPrepaid.q.customerType) url += '&customerType=' + vmPrepaid.q.customerType;
            if (vmPrepaid.q.leaseId) url += '&leaseId=' + vmPrepaid.q.leaseId;
            if (vmPrepaid.q.brandId) url += '&brandId=' + vmPrepaid.q.brandId;
            if (vmPrepaid.q.seriesId) url += '&seriesId=' + vmPrepaid.q.seriesId;
            if (vmPrepaid.q.modelId) url += '&modelId=' + vmPrepaid.q.modelId;
            if (vmPrepaid.q.rentType) url += '&rentType=' + vmPrepaid.q.rentType;
            if (vmPrepaid.q.payType) url += '&payType=' + vmPrepaid.q.payType;
            if (vmPrepaid.q.carNo) url += '&carNo=' + vmPrepaid.q.carNo;
            if (vmPrepaid.q.statistics) url += '&statistics=' + vmPrepaid.q.statistics;
            if (vmPrepaid.q.realpayDateStr) url += '&realpayDateStr=' + vmPrepaid.q.realpayDateStr;
            window.location.href = url;

        },
        reload: function (event) {
            layui.table.reload('prepaidGrid', {
                page: {
                    curr: 1
                },
                where: {
                    contractNo:vmPrepaid.q.contractNo,
                    payableNo:vmPrepaid.q.payableNo ,
                    paymentType:vmPrepaid.q.paymentType,
                    customerName:vmPrepaid.q.customerName,
                    customerType:vmPrepaid.q.customerType ,
                    leaseId:vmPrepaid.q.leaseId ,
                    brandId:vmPrepaid.q.brandId,
                    seriesId:vmPrepaid.q.seriesId,
                    modelId:vmPrepaid.q.modelId ,
                    rentType:vmPrepaid.q.rentType ,
                    payType:vmPrepaid.q.payType,
                    carNo:vmPrepaid.q.carNo ,
                    statistics:vmPrepaid.q.statistics ,
                    realpayDateStr:vmPrepaid.q.realpayDateStr
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilterPrepaid = !this.isFilterPrepaid;
        },

    }
});

function initReportData(layui,type) {
    if(type == '1'){
        //相关数据初始化

        initDateReceived(layui.laydate);
        initEventListenerReceived(layui);
        initCollectionTable(layui.table, layui.soulTable, type);
        initdataReceived();

        $("#field1").addClass("flex active");
        $("#collectionDiv").show();
        $("#paymentDiv").hide();
    } else if(type == '2'){
        //时间控件加载
        initDatePrepaid(layui.laydate);
        //下拉事件监听
        initEventListenerPrepaid(layui);
        //已付数据表格加载
        initPaymentTable(layui.table, layui.soulTable);
        //初始化数据加载
        initdataPrepaid();


        $("#field2").addClass("flex active");
        $("#paymentDiv").show();
        $("#collectionDiv").hide();
    }else if(type == '3'){
        //时间控件加载
        initDatePrepaid(layui.laydate);
        //下拉事件监听
        initEventListenerPrepaid(layui);
        //已收数据表格加载
        initCollectionTable(layui.table, layui.soulTable, type);
        //初始化数据加载
        initdataPrepaid();


        $("#field3").addClass("flex active");
        $("#collectionDiv").show();
        $("#paymentDiv").hide();
    }

}

function initExport(layui,type) {
    if(type == '1'){
        //相关数据初始化
        vm.activityAble = 0;

    }else if(type == '3'){
        vm.activityAble = 1;
    }

}



// 初始化加载已收表格
function initCollectionTable(table, soulTable, type) {
    var activityAble = 0;
    var cols = [[
        {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
        {field:'carPlateNo', minWidth:100, fixed: "left",align:"center",title: '车牌号'},
        {field:'businessNo', minWidth:100, title: '发车单号',templet:function (d) {
                if(d.businessNo!=null && d.businessNo!=""){
                    return d.businessNo;
                }else {
                    return "--";
                }

            }},
        {field:'collectionsNo', minWidth:150, title: '支付单号'},
        {field:'receivablesNo', minWidth:130, title: '应收单号'},
        {field:'customerName', minWidth:100, title: '付款方名称'},
        {field:'customerType', minWidth:100, title: '付款方类型',templet:function (d) {
                //客户类型:1、客户/企业，2、客户/个人，3、渠道/个人，4、渠道/企业
                if(d.customerType==1){
                    return "客户/企业";
                }else if(d.customerType==2){
                    return "客户/个人";
                }else if(d.customerType==3){
                    return "渠道/个人";
                }else if(d.customerType==4){
                    return "渠道/企业";
                }else {
                    return "--";
                }

            }},
        {field:'leaseName', minWidth:200, title: '售卖方'},
        {field:'vin', minWidth:130, title: '车架号'},
        {field:'brand', minWidth:130, title: '品牌/车系'},
        {field:'modelName', minWidth:130, title: '车型'},
        {field:'rentType', minWidth:100, title: '租赁类型',templet:function (d) {
                return getBillRentTypeStr(d.rentType);
            }},
        {field:'collectionType', minWidth:100, title: '收款类型',templet:function (d) {
                //收款类型：0、全部，1、保证金，2、租金，3、首付款，4、退车结算款，5、换车结算款，6、备用车结算款
                return d.collectionTypeOther||getCollectionTypeStr(d.collectionType);
            }},
        {field:'receivableAmount', minWidth:100, title: '应收金额'},
        {field:'paymentType', minWidth:100, title: '支付类型',templet:function (d) {
                //支付类型: 0、其他，1、微信小程序支付，2、公帐，3、私帐，4、银行卡，5、支付宝，6、微信，7、信用卡，8、pos，9、现金
                if(d.paymentType==0){
                    return "其他";
                }else if(d.paymentType==1){
                    return "微信小程序支付";
                }else if(d.paymentType==2){
                    return "公帐";
                }else if(d.paymentType==3){
                    return "私帐";
                }else if(d.paymentType==4){
                    return "银行卡";
                }else if(d.paymentType==5){
                    return "支付宝";
                }else if(d.paymentType==6){
                    return "微信";
                }else if(d.paymentType==7){
                    return "信用卡";
                }else if(d.paymentType==8){
                    return "pos";
                }else if(d.paymentType==9){
                    return "现金";
                }else if(d.paymentType==10){
                    return "余额抵扣";
                } else if (d.paymentType == 11) {
                    return '二维码';
                } else if (d.paymentType == 12) {
                    return '花芝租';
                } else if (d.paymentType == 21) {
                    return '支付宝代扣';
                } else {
                    return "--";
                }

            }},
        {field:'receivedAmount', minWidth:100, title: '实收金额'},
        {field:'remarks', minWidth:100, title: '备注',templet:function (d) {
                if(d.remarks!=null && d.remarks!=""){
                    return d.remarks;
                }else {
                    return "--";
                }
            }},
        {field:'actualDate', minWidth:150, title: '实收日期'}
    ]];
    if(type == 3){
        activityAble = 1;
        cols = [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'activityOrderNo', minWidth:100, title: '活动订单号',templet:function (d) {
                    if(d.activityOrderNo!=null && d.activityOrderNo!=""){
                        return d.activityOrderNo;
                    }else {
                        return "--";
                    }

                }},
            {field:'collectionsNo', minWidth:150, title: '支付单号'},
            {field:'customerName', minWidth:100, title: '付款客户名称'},
            {field:'customerPhone', minWidth:100, title: '联系电话'},
            {field:'activityName', minWidth:100, title: '活动名称'},
            {field:'receivableAmount', minWidth:100, title: '支付总金额'},
            {field:'paymentType', minWidth:100, title: '付款类型',templet:function (d) {
                    //支付类型: 0、其他，1、微信小程序支付，2、公帐，3、私帐，4、银行卡，5、支付宝，6、微信，7、信用卡，8、pos，9、现金
                    if(d.paymentType==0){
                        return "其他";
                    }else if(d.paymentType==1){
                        return "微信小程序支付";
                    }else if(d.paymentType==2){
                        return "公帐";
                    }else if(d.paymentType==3){
                        return "私帐";
                    }else if(d.paymentType==4){
                        return "银行卡";
                    }else if(d.paymentType==5){
                        return "支付宝";
                    }else if(d.paymentType==6){
                        return "微信";
                    }else if(d.paymentType==7){
                        return "信用卡";
                    }else if(d.paymentType==8){
                        return "pos";
                    }else if(d.paymentType==9){
                        return "现金";
                    }else if(d.paymentType==10){
                        return "代扣/银行卡";
                    }else if(d.paymentType==21){
                        return "支付宝代扣";
                    }else {
                        return "--";
                    }

                }},
            {field:'actualDate', minWidth:150, title: '支付日期'}
        ]];
    }
    table.render({
        id: "gridid",
        elem: '#grid',
        //   toolbar: true,
        //   defaultToolbar: ['filter'],
        url: baseURL + 'financial/collection/list',
        where:{actualDateStr: vm.q.actualDateStr,activityAble:activityAble},
        cols: cols,
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            // init: true
        },
        done: function () {
            soulTable.render(this);
        }
    });
}
// 初始化加载已付表格
function initPaymentTable(table, soulTable) {
    table.render({
        id: "prepaidGrid",
        elem: '#prepaidGrid',
        url: baseURL + 'payment/payment/queryPaymentList',
        where:{realpayDateStr: vm.q.realpayDateStr},
        cols: [[
            {title: '操作', width:120, templet:'#prepaidTpl',fixed:"left",align:"center"},
            {field:'carNo', minWidth:100, title: '车牌号',align:"center",fixed: "left",templet:function (d) {
                return   isEmpty(d.carNo);
            }},
            {field:'contractNo', minWidth:100, title: '订单合同编号/车源合同编号',templet:function (d) {
                    if(d.contractNo!=null && d.contractNo!=''){
                        return "<span style='color:#419BEA;cursor:pointer;' onclick = jumpToContract(\'"+d.contractNo+"\',\'"+d.paymentFlow+"\')>"+isEmpty(d.contractNo)+"</span>";

                    }else {
                        return "--";
                    }

                }},
            {field:'payableNo', minWidth:150, title: '应付单号/退款单号',templet:function (d) {
                    return   isEmpty(d.payableNo);
             }},
            {field:'paymentType', minWidth:130, title: '付款分类',templet:function (d) {
                    if(d.paymentType==1){
                        return "客户退款支付";
                    }else if(d.paymentType==2){
                        return "供应商支付";
                    }else {
                        return "--";
                    }
            }},
            {field:'customerName', minWidth:100, title: '付款方名称',templet:function (d) {
                    return   isEmpty(d.customerName);
             }},
            {field:'customerType', minWidth:100, title: '付款方类型',templet:function (d) {
                    //客户类型:1、客户/企业，2、客户/个人，3、渠道/个人，4、渠道/企业
                    if(d.customerType==1){
                        return "客户/企业";
                    }else if(d.customerType==2){
                        return "客户/个人";
                    }else if(d.customerType==3){
                        return "渠道/个人";
                    }else if(d.customerType==4){
                        return "渠道/企业";
                    }else {
                        return "--";
                    }

                }},
            {field:'leaseName', minWidth:200, title: '售卖方/入库公司',templet:function (d) {
                    return   isEmpty(d.leaseName);
                }},

            {field:'vinNo', minWidth:130, title: '车架号',templet:function (d) {
                    return   isEmpty(d.vinNo);
             }},
            {field:'brandSeriesName', minWidth:130, title: '品牌/车系',templet:function (d) {
                    return   isEmpty(d.brandSeriesName);
             }},
            {field:'modelName', minWidth:130, title: '车型',templet:function (d) {
                    return   isEmpty(d.brandSeriesName);
             }},
            {field:'rentTypeShow', minWidth:100, title: '租赁类型',templet:function (d) {
                    //  租赁类型：1、长租 2、以租代购 3、展示车 4、试驾车
                    return getBillRentTypeStr(d.rentType);
                }},
            {field:'payType', minWidth:100, title: '付款类型',templet:function (d) {
                    //付款类型：0、其他，1、保证金，2、租金，3、首付款，4、退车结算款，5、换车结算款，6、备用车结算款，7、整备费，8、尾款，9、定金，10、其他费用，11、车辆总单价
                    return getCollectionTypeStr(d.payType);
                }},
            {field:'realpayAmount', minWidth:100, title: '已付金额',templet:function (d) {
                    return   isEmpty(d.realpayAmount);
            }},
            {field:'realpayDate', minWidth:100, title: '实付日期',templet:function (d) {
                    return   isEmpty(d.realpayDate);
            }}

        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            // init: true
        },
        done: function () {
            console.log(vm.q+"-------------");
            getHeadCount();
            soulTable.render(this);
        }
    });
}
//已收相关方法--开始
function initdataReceived() {
    //查询售卖方下拉选
    selectLessorReceived();
    getHeadCount();
}
function initDateReceived(laydate) {
    //实收日期
    laydate.render({
        elem: '#actualDate',
        format: 'yyyy-MM-dd',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.actualDateStr = value;
        }
    });

}
function initEventListenerReceived(layui) {
    initClickReceived();
    initCheckedReceived(layui.form);
}
function initClickReceived() {


}
function initCheckedReceived(form) {
    //售卖方
    layui.form.on('select(lessor)',function (data) {
        vm.q.leaseId = data.value;
    })
    //付款方类型
    layui.form.on('select(customerType)',function (data) {
        vm.q.customerType = data.value;
    })

    //品牌/车型
    layui.form.on('select(brand)',function (data) {
        vm.q.brand = data.value;
    })

    //租赁类型
    layui.form.on('select(rentType)',function (data) {
        vm.q.rentType = data.value;
    })
    //收款类型
    layui.form.on('select(collectionType)',function (data) {
        vm.q.collectionType = data.value;
    })
    //统计入口
    layui.form.on('select(statistics)',function (data) {
        vm.q.statistics = data.value;
    })
    layui.form.on('select(paymentTypeFilter)',function (data) {
        vm.q.paymentType = data.value;
    })

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
}
//已收相关方法--结束
//已付相关方法--开始
function initDatePrepaid(laydate) {
    //实收日期
    laydate.render({
        elem: '#realpayDateStr',
        format: 'yyyy-MM-dd',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            vmPrepaid.q.realpayDateStr = value;
        }
    });
}
function initEventListenerPrepaid(layui) {
    initClickPrepaid();
    initCheckedPrepaid(layui.form);
}
function initClickPrepaid() {


}
function initCheckedPrepaid(form) {

    //付款分类
    layui.form.on('select(paymentType)',function (data) {
        vmPrepaid.q.paymentType = data.value;
    })
    //付款方类型
    layui.form.on('select(customerType)',function (data) {
        vmPrepaid.q.customerType = data.value;
    })
    //售卖方
    layui.form.on('select(lessor)',function (data) {
        vmPrepaid.q.leaseId = data.value;
    })

    //租赁类型
    layui.form.on('select(rentType)',function (data) {
        vmPrepaid.q.rentType = data.value;
    })
    //收款类型
    layui.form.on('select(payType)',function (data) {
        vmPrepaid.q.payType = data.value;
    })
    //统计入口
    layui.form.on('select(statistics)',function (data) {
        vmPrepaid.q.statistics = data.value;
    })


}
function initdataPrepaid() {
    //售卖方数据渲染
    selectLessorPrepaid();
    getHeadCount();
}

//已付相关方法--结束



function removeClass(){
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
    $("#field3").removeClass("active");
}
/**
 * 查询售卖方
 */
function selectLessorReceived (){
    $.ajax({
        type: "GET",
        url: baseURL + "financial/settleorder/selectLessor",
        contentType: "application/json",
        success: function(res){
            $.each(res.data, function (index, item) {
                // 下拉菜单里添加元素
                $('#receivedLessor').append(new Option(item.companyName, item.deptId));
            });
            layui.form.render("select");
        },
        error:function(error){

        }
    });
}

function selectLessorPrepaid (){
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

        }
    });
}

//列表头部数据统计
function getHeadCount() {
    $.ajax({
        type: "POST",
        url: baseURL + "financial/collection/getHeadCount",
        data:vm.q,
        //url: baseURL + "car/carillegal/getHeadCount",
        success: function (r) {
          vm.headCount=r.headCount;
        }
    });
}

/**
 * 跳转至订单详情
 */
function goToOrderDetail(orderCarId) {
    $.get(baseURL + "order/order/info/" + orderCarId, function (r) {
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

/**
 * 跳转到合同列表
 * @param contractNo
 */
function jumpToContract(contractNo,paymentFlow){
    window.localStorage.setItem("contractNo", contractNo);
    //支付流水类型(1上游,2下游)
    if(paymentFlow!=null && paymentFlow==1){
       /* 通过合同编号查询id*/
        $.ajax({
            type: "POST",
            url: baseURL + "payment/payment/getContractCarSource/"+contractNo,
            success: function (r) {
                var  contractCarSouceId=r.contraccarSourceEntity.id;
                $.get(baseURL + "order/contraccarsource/info/"+contractCarSouceId, function(r){
                    var param = {
                        data:r.contraccarSource
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/contract/contraccarsourceview.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }
        });
    }
    if(paymentFlow!=null && paymentFlow==2){
        $.ajax({
            type: "POST",
            url: baseURL + "payment/payment/getContracorderNot/"+contractNo,
            success: function (r) {
                var  contracorderNotId=r.contraccarSourceEntity.id;
                $.get(baseURL + "contract/contracordernotemplate/info/"+data.id, function(r){
                    var param = {
                        contracorderNotemplate:r.contracorderNotemplate,
                       // statusStr: data.statusStr
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/contract/contracordernotemplateview.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });

            }
        });
    }
}
