$(function () {
    var type = window.localStorage.getItem("type");
    if(type != "" && type != null){
        vm.changeStatus(type);
    } else {
        vm.changeStatus(1);
    }
    vm.count = 0;

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
            url: baseURL + 'maintenance/insurancemanage/carInsuranceWarnlist',
            where:{searchWarnType:vm.q.searchWarnType},
            cols: [[
                {
                    templet: "#checkbd",
                    title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                    align:"center",
                    rowspan:2,
                    fixed:'left',
                    style:'width: 50px;'
                },
                {title: '操作',  templet:'#barTpl',fixed:"left",align:"center",rowspan:2,  style:'width: 120px;'},
                    {field:'carNo', minWidth:100, title: '车牌号',fixed: "left",rowspan:2,align:'center',fixed:'left'},
                    {field:'compulsoryCompanyId', minWidth:100,align:'center', title: '交强险',align: "center",colspan:5 },
                    {field:'commercialCompanyId', minWidth:100,align:'center', title: '商业险',align: "center",colspan:6 },
                    {field:'carStatusStr', minWidth:100,align:'center', title: '车辆状态',rowspan:2},
                    {field:'rentType', minWidth:150, title: '订单类型',align:"center",templet: function (d){return getRentTypeStr(d.rentType);},rowspan:2},
                    {field:'vinNo', minWidth:220, title: '车架号',rowspan:2,align:'center'},
                    {field:'carBrandModelName', minWidth:200,align:'center', rowspan:2, title: '品牌/车系/车型', templet:function (d) {return isEmpty(d.carBrandModelName);}},
                    {field:'carBelongCompanyName', align:'center',minWidth:280, title: '车辆归属',rowspan:2, templet:function (d) {return isEmpty(d.carBelongCompanyName);}},
                    {field:'carDepotName', minWidth:170,align:'center', title: '所在仓库',rowspan:2, templet:function (d) {return isEmpty(d.carDepotName);}},
                    {field:'carOwner', minWidth:130,align:'center', title: '车辆所有人',rowspan:2, templet:function (d) {return isEmpty(d.carOwner);}},
                ],
                [
                    //交强险
                    {field:'compulsoryEndTime', minWidth:130, title: '到期时间',align:'center',templet:function (d) {return dateFormatYMD(d.compulsoryEndTime);}},
                    {field:'compulsoryStr', minWidth:130, title: '剩余天数',align:'center',templet:function (d) {
                        if(d.compulsoryStr!=null && d.compulsoryStr != null){
                            if(d.colorType == '0'){
                                return  "<span style='color: red'>"+ d.compulsoryStr +"</span>";
                            } else if(d.colorType == '1'){
                                return  "<span style='color: green'>"+d.compulsoryStr+"</span>";
                            }
                        } else {
                            return "--";
                        }
                    }},
                    {field:'compulsoryCompany', minWidth:180, title: '保单号',align:'center', templet:function (d) {return isEmpty(d.compulsoryNo);}},
                    {field:'compulsoryCompany', minWidth:180, title: '保险公司',align:'center', templet:function (d) {return isEmpty(d.compulsoryCompany);}},
                    {field:'compulsoryRemark', minWidth:200, title: '备注',align:'center', templet:function (d) {return isEmpty(d.compulsoryRemark);}},

                    //商业险
                    {field:'commercialEndTime', minWidth:130,align:'center', title: '到期时间',templet:function (d) {return dateFormatYMD(d.commercialEndTime);}},
                    {field:'commercialStr',minWidth:130, title: '剩余天数',align:'center',templet:function (d) {
                        if(d.commercialStr!=null && d.commercialStr != null){
                            if(d.syxColorType == '0'){
                                return  "<span style='color: red'>"+ d.commercialStr +"</span>";
                            } else if(d.syxColorType == '1'){
                                return  "<span style='color: green'>"+d.commercialStr+"</span>";
                            }
                        }  else {
                            return "--";
                        }
                    }},
                    {field:'commercialType', minWidth:200, title: '险种',align:'center', templet:function (d) {return isEmpty(d.commercialType);}},
                    {field:'commercialNo', minWidth:180, title: '保单号',align:'center', templet:function (d) {return isEmpty(d.commercialNo);}},
                    {field:'compulsoryCompany', minWidth:180, title: '保险公司',align:'center', templet:function (d) {return isEmpty(d.commercialCompany);}},
                    {field:'commercialRemark', minWidth:180, title: '备注',align:'center', templet:function (d) {return isEmpty(d.commercialRemark);}},


                ]],
            page: true,
            loading: true,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res, curr, count) {
                //merge(res);//合并单元格
                soulTable.render(this);
            },
            parseData: function(res){
                res.data.forEach(function (d) {
                    d.LAY_CHECKED = false;
                    if ($.inArray(d.carId, vm.ids) >= 0) {
                        d.LAY_CHECKED = true;
                    }
                });

                receivablesDatas = res.data;
                checkAllStatusChange();
                return res;
            },
        });
    });

    selectTotal();

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
    layui.form.on('select(carModelSelect)', function (data) {
        vm.q.carBrandModelName = data.value;
    });
   //车辆状态
    layui.form.on('select(carStatusSelect)', function (data) {
        vm.q.carStatusStr = data.value;
    });
    // 付款对象
    layui.form.on('select(payObjectNameSelect)', function (data) {
        vm.q.payObjectName = data.value;
    });
    // 保险公司
    layui.form.on('select(compulsoryCaompanySelect)', function (data) {
        vm.q.compulsoryCaompanyName = data.value;
    });


    layui.use('laydate', function(){
        var laydate = layui.laydate;
    });


    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
         if(layEvent === 'view'){
            vm.view(data.jqxId, data.syxId, data.policyApplyNo, data.carNo, data.carId);
        } else if(layEvent === 'renewal'){
             vm.renewal(data);
         } else if(layEvent === 'notice'){
             vm.notice(data);
         }
    });

    layui.form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        if (receivablesDatas != null && receivablesDatas.length > 0){
            receivablesDatas.forEach(function (d) {
                ysCheckedChange(d, d.carId, checked);
            });
        }
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            if (!value.disabled)
                $(this).prop("checked", status);
        });
        layui.form.render();
    });

    layui.form.on('checkbox(siam_one)', function(){
        var checked = $(this)[0].checked;
        var id = $(this).attr("data-id");
        var obj = receivablesDatas.filter(function (d) {
            return d.carId == id;
        })[0];
        ysCheckedChange(obj, id, checked);
        layui.form.render();
    });

});

/**
 * 统计
 */
function selectTotal(){
    $.ajax({
        type: "GET",
        url: baseURL + "maintenance/insurancemanage/total",
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
            carNo: null,
            carBelongCompanyName:null,
            carBrandModelName: null,
            customerName: null,
            departureNo: null,
            carStatusStr: null,
            searchWarnType:1,
            carDepotId:null,
            carDepotName: null,
            carBrandId:null,
            carSeriesId:null,
            carModelId:null,
            payObjectName:null,
            compulsoryCaompanyName:null,
            carOwner:null,
            policyApplyNo:null,
            compulsoryEndTime: null,
            compulsoryStartTime: null,
            commercialEndTime: null,
            commercialStartTime: null,
            compulsoryEndTimeSearch:null,
            commercialEndTimeSearch:null,
            commercialEndTimeType:null,
            compulsoryEndTimeType:null
        },
        showForm: false,
        insuranceManage: {},
        allCarModels:[],
        payObject:[],
        compulsoryCaompany:[],
        selectData:[],
        total:{},
        isFilter:false,
        ids:[],
        dateConfig1:30,
        dateConfig2:30,
        count:0,
    },
    updated: function(){
        layui.form.render();
    },

    created: function () {
        var _this = this;
        /*$.getJSON(baseURL + "maintenance/insurancemanage/listBrandAndModel", function (r) {
            console.log(r.listData)
            _this.allCarModels = r.listData;
        });*/
        $.ajax({
            type: "GET",
            url: baseURL + "/remindconfig/list?page=1&limit=10&remindModule=2&remindType=0",
            async: false,
            success: function(r){
                var remindconfig = r.data[0]||{remindValue:30}
                _this.dateConfig1 = remindconfig.remindValue;
                _this.dateConfig2 = remindconfig.remindValue;
            }
        });
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {

                vm.selectData = r.carTreeVoList;
                cascader({
                    elem: "#a",
                    data: vm.selectData,
                    success: function (valData,labelData) {
                        vm.q.carBrandId = valData[0];
                        vm.q.carSeriesId = valData[1];
                        vm.q.carModelId = valData[2];
                    }
                });
            });
        });
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
            contentType: "application/json",
            data:null,
            success: function(r){
                _this.payObject= r.dict;
            }
        });
        //初始化加载保险公司
        $.ajax({
            type: "POST",
            url: baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",
            contentType: "application/json",
            data:null,
            success: function(r){
                //交强险
                _this.compulsoryCaompany = r.compulsoryInsuranceList;
            }
        });
    },

    methods: {
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
            Vue.set(vm.q,"carBelongCompanyName",treeNode.name);
            layer.closeAll();
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var insuranceManageIds = [];
            $.each(list, function(index, item) {
                insuranceManageIds.push(item.insuranceManageId);
            });
            return insuranceManageIds;
        },
        //查询
        query: function () {
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
                        carDepotId:vm.warehouseData.warehouseId,
                        carDepotName:vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },

        changeStatus:function (type) {
             
            removeClass();
            cleanQuery();
            if(type == 1){
                $("#field1").addClass("flex active");
                vm.q.searchWarnType = 1;
            }else if(type == 2){
                $("#field2").addClass("flex active");
                vm.q.searchWarnType = 2;
            }else if(type == 3){
                $("#field3").addClass("flex active");
                vm.q.searchWarnType = 3;
            }else if(type == 4){
                $("#field4").addClass("flex active");
                vm.q.searchWarnType = 4;
            }else if(type == 5){
                $("#field5").addClass("flex active");
                vm.q.searchWarnType = 5;
            }else if(type == 6){
                $("#field6").addClass("flex active");
                vm.q.searchWarnType = 6;
            }else if(type == 7){
                $("#field7").addClass("flex active");
                vm.q.searchWarnType = 7;
            }else if(type == 8){
                $("#field8").addClass("flex active");
                vm.q.searchWarnType = 8;
            }
            vm.reload();
        },
        //重置
        reset: function () {
            vm.q.carNo =null;
            vm.q.carBelongCompanyName=null;
            vm.q.carBrandModelName=null;
            vm.q.customerName=null;
            vm.q.departureNo=null;
            vm.q.carStatusStr=null;
            vm.q.searchWarnType=1;
            vm.q.carDepotId=null;
            vm.q.carDepotName=null;
            vm.q.carBrandId=null;
            vm.q.carSeriesId=null;
            vm.q.carModelId=null;
            vm.q.payObjectName=null;
            vm.q.compulsoryCaompanyName=null;
            vm.q.carOwner=null;
            vm.q.policyApplyNo=null;
            vm.q.compulsoryEndTimeSearch=null;
            vm.q.commercialEndTimeSearch=null;
            vm.q.commercialEndTimeType=null;
            vm.q.compulsoryEndTimeType=null;

            $("#a").val('');
            $('div[type="commercialEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="compulsoryEndTimeType"]>div').removeClass('task-content-box-tab-child-active');

            $("#field1").removeClass("active");
            $("#field2").removeClass("active");
            $("#field3").removeClass("active");
            $("#field4").removeClass("active");
            $("#field5").removeClass("active");
            $("#field6").removeClass("active");
            $("#field7").removeClass("active");
            $("#field8").removeClass("active");
                /*vm.q.carNo =null;
                vm.q.carBelongCompanyName =null;
                vm.q.carBrandModelName =null;
                vm.q.customerName =null;
                vm.q.departureNo =null;
                vm.q.carStatusStr =null;*/
        },
        //查看方法
        view:function(jqxId,syxId,policyApplyNo,carNo,carId){
            window.localStorage.setItem("jqxId",jqxId);
            window.localStorage.setItem("syxId",syxId);
            window.localStorage.setItem("policyApplyNo",policyApplyNo);
            window.localStorage.setItem("carNo",carNo);
            window.localStorage.setItem("carId",carId);
            var index = layer.open({
                title: "风控预警 > 车辆保险预警 > 保险查看",
                type: 2,
                content: tabBaseURL+'modules/warn/carinsurancewarndetail.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("jqxId",null);
                    window.localStorage.setItem("syxId",null);
                    window.localStorage.setItem("policyApplyNo",null);
                    window.localStorage.setItem("carNo",null);
                    window.localStorage.setItem("carId",null);
                    // vm.reload();
                }
            });
            layer.full(index);
        },

        //续保方法
        renewal:function(data){
            // window.localStorage.setItem("jqxId",data.jqxId);
            // window.localStorage.setItem("syxId",data.syxId);
            // window.localStorage.setItem("policyApplyNo",data.policyApplyNo);
            // window.localStorage.setItem("type",data.isSyxRenewal);
            // window.localStorage.setItem("carId",data.carId);
            // window.localStorage.setItem("syxConfigDay",data.syxConfigDay);
            // var index = layer.open({
            //     title: "风控预警 > 车辆保险预警 > 续保",
            //     type: 2,
            //     content: tabBaseURL+'modules/maintenance/insurancemanageedit.html',
            //     end: function(){
            //         layer.close(index);
            //         window.localStorage.setItem("jqxId",null);
            //         window.localStorage.setItem("syxId",null);
            //         window.localStorage.setItem("policyApplyNo",null);
            //         window.localStorage.setItem("type",null);
            //         window.localStorage.setItem("carId",null);
            //         window.localStorage.setItem("syxConfigDay",null);
            //         // vm.reload();
            //     }
            // });
            // layer.full(index);

            // window.localStorage.setItem("jqxId",data.jqxId);
            // window.localStorage.setItem("syxId",data.syxId);
            // window.localStorage.setItem("policyApplyNo",data.policyApplyNo);
            // var index = layer.open({
            //     title: "风控预警 > 车辆保险预警 > 续保",
            //     type: 2,
            //     content: tabBaseURL+'modules/maintenance/insurancemanageedit.html',
            //     end: function(){
            //         layer.close(index);
            //         window.localStorage.setItem("jqxId",null);
            //         window.localStorage.setItem("syxId",null);
            //         window.localStorage.setItem("policyApplyNo",null);
            //         // vm.reload();
            //     }
            // });
            // layer.full(index);
            let param ={
                carId:data.carId
            };
            let url=tabBaseURL+'modules/maintenance/insurancemanageadd.html';
            let title='车辆续保';
            addTab(url,title,param);
        },

        // 消息通知
        notice:function(data){
            window.localStorage.setItem("carId",data.carId);
            window.localStorage.setItem("type","1");// 保险消息通知操作
            var index = layer.open({
                 title: "保险预警通知",
                 type: 2,
                 area: ['80%', '80%'],
                 content: tabBaseURL+'modules/maintenance/messageNotice.html',
                 end: function(){
                     layer.close(index);
                     window.localStorage.setItem("carId",null);
                }
            });
        },

        // 批量消息通知
        batchNotice:function (){
            if(vm.ids.length == 0){
                alert("未选择需要通知的保险预警数据！");
                return ;
            }

            var carIds = [];
            $.each(vm.ids, function(index, item) {
                carIds.push(item);
            });

            console.log(carIds);
            window.localStorage.setItem("carIds", carIds);
            window.localStorage.setItem("type", "1");
            var index = layer.open({
                title: "保险预警通知",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL+'modules/maintenance/messageBatchNotice.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("carIds",null);
                    window.localStorage.setItem("type", null);
                }
            });
        },

        //导出
        exports: function () {
            var url = baseURL + 'maintenance/insurancemanage/carInsuranceWarnExport?1=1';
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q.carBelongCompanyName != null){
                url += '&carBelongCompanyName='+vm.q.carBelongCompanyName;
            }
            if(vm.q.carBrandModelName != null){
                url += '&carBrandModelName='+vm.q.carBrandModelName;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.departureNo != null){
                url += '&departureNo='+vm.q.departureNo;
            }
            if(vm.q.carStatusStr != null){
                url += '&carStatusStr='+vm.q.carStatusStr;
            }
            if(vm.q.searchWarnType != null){
                url += '&searchWarnType='+vm.q.searchWarnType;
            }
            if(vm.q.carDepotId != null){
                url += '&carDepotId='+vm.q.carDepotId;
            }
            if(vm.q.carDepotName != null){
                url += '&carDepotName='+vm.q.carDepotName;
            }
            if(vm.q.carBrandId != null){
                url += '&carBrandId='+vm.q.carBrandId;
            }
            if(vm.q.carSeriesId != null){
                url += '&carSeriesId='+vm.q.carSeriesId;
            }
            if(vm.q.carModelId != null){
                url += '&carModelId='+vm.q.carModelId;
            }
            if(vm.q.payObjectName != null ){
                url += '&payObjectName='+vm.q.payObjectName;
            }
            if(vm.q.compulsoryEndTimeSearch != null){
                url += '&compulsoryEndTimeSearch='+vm.q.compulsoryEndTimeSearch;
            }
            if(vm.q.commercialEndTimeSearch != null){
                url += '&commercialEndTimeSearch='+vm.q.commercialEndTimeSearch;
            }
            if(vm.q.compulsoryCaompanyName != null ){
                url += '&compulsoryCaompanyName='+vm.q.compulsoryCaompanyName;
            }
            if(vm.q.commercialEndTimeType != null ){
                url += '&commercialEndTimeType='+vm.q.commercialEndTimeType;
            }
            if(vm.q.compulsoryEndTimeType != null ){
                url += '&compulsoryEndTimeType='+vm.q.compulsoryEndTimeType;
            }
            if(vm.q.carOwner != null ){
                url += '&carOwner='+vm.q.carOwner;
            }
            if(vm.q.policyApplyNo != null ){
                url += '&policyApplyNo='+vm.q.policyApplyNo;
            }

            window.location.href = url;
        },
        //重新加载
        reload: function (event) {

            $('input[name=siam_one]').prop('checked', false);
            layui.form.render('checkbox');
            vm.ids=[];

            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo:vm.q.carNo ,
                    carBelongCompanyName:vm.q.carBelongCompanyName,
                    carBrandModelName:vm.q.carBrandModelName,
                    customerName:vm.q.customerName,
                    departureNo:vm.q.departureNo,
                    carStatusStr:vm.q.carStatusStr,
                    searchWarnType:vm.q.searchWarnType,
                    carDepotId:vm.q.carDepotId,
                    carDepotName:vm.q.carDepotName,
                    carBrandId:vm.q.carBrandId,
                    carSeriesId:vm.q.carSeriesId,
                    carModelId:vm.q.carModelId,
                    payObjectName:vm.q.payObjectName,
                    compulsoryCaompanyName:vm.q.compulsoryCaompanyName,
                    carOwner:vm.q.carOwner,
                    policyApplyNo:vm.q.policyApplyNo,
                    compulsoryEndTimeSearch:vm.q.compulsoryEndTimeSearch,
                    commercialEndTimeSearch:vm.q.commercialEndTimeSearch,
                    commercialEndTimeType:vm.q.commercialEndTimeType,
                    compulsoryEndTimeType:vm.q.compulsoryEndTimeType


                   /* carNo:vm.q.carNo,
                    carBelongCompanyName:vm.q.carBelongCompanyName,
                    carBrandModelName:vm.q.carBrandModelName,
                    customerName:vm.q.customerName,
                    departureNo:vm.q.departureNo,
                    carStatusStr:vm.q.carStatusStr,
                    searchWarnType:vm.q.searchWarnType*/
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }
    }
});
//合并开始
function merge(res) {
    var data = res.data;
    var mergeIndex = 0;//定位需要添加合并属性的行数
    var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
    var _number = 1;//保持序号列数字递增
    var columsName = ['compulsoryNo','jqPolicyPrescription','compulsoryStartTime','compulsoryEndTime','compulsoryAmount','commercialNo','syPolicyPrescription','insuranceTypeName','commercialStartTime','commercialEndTime','commercialAmount'];//需要合并的列名称
    var columsIndex = [26,39,28,25,21,17,44,36,19,15,11];//需要合并的列索引值
    var mergeCondition = 'id';//需要合并的 首要条件  在这个前提下进行内容相同的合并
    var tdArrL = $('.layui-table-fixed-l > .layui-table-body').find("tr");//序号列左定位产生的table tr
    var tdArrR = $('.layui-table-fixed-r > .layui-table-body').find("tr");//操作列定右位产生的table tr
    for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
        var trArr = $(".layui-table-main>.layui-table").find("tr");//所有行
        for (var i = 1; i < res.data.length; i++) { //这里循环表格当前的数据
            if (data[i][mergeCondition] === data[i - 1][mergeCondition]) {
                var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
                var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列

                if (data[i][columsName[k]] === data[i - 1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
                    mark += 1;
                    tdPreArr.each(function () {//相同列的第一列增加rowspan属性
                        $(this).attr("rowspan", mark);
                    });
                    tdCurArr.each(function () {//当前行隐藏
                        $(this).css("display", "none");
                    });
                } else {
                    mergeIndex = i;
                    mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
                }
            } else {
                mergeIndex = i;
                mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
            }
        }
        mergeIndex = 0;
        mark = 1;
    }
}

function removeClass(){
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
    $("#field3").removeClass("active");
    $("#field4").removeClass("active");
    $("#field5").removeClass("active");
    $("#field6").removeClass("active");
    $("#field7").removeClass("active");
    $("#field8").removeClass("active");
}

function cleanQuery() {
    vm.q.carNo =null;
    vm.q.carBelongCompanyName=null;
    vm.q.carBrandModelName=null;
    vm.q.customerName=null;
    vm.q.departureNo=null;
    vm.q.carStatusStr=null;
    vm.q.searchWarnType=1;
    vm.q.carDepotId=null;
    vm.q.carDepotName=null;
    vm.q.carBrandId=null;
    vm.q.carSeriesId=null;
    vm.q.carModelId=null;
    vm.q.payObjectName=null;
    vm.q.compulsoryCaompanyName=null;
    vm.q.carOwner=null;
    vm.q.policyApplyNo=null;
    vm.q.compulsoryEndTimeSearch=null;
    vm.q.commercialEndTimeSearch=null;
    vm.q.commercialEndTimeType=null;
    vm.q.compulsoryEndTimeType=null;
}

function init(layui) {
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {}

function initClick() {
    $('div[type="commercialEndTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="commercialEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        vm.q.commercialEndTimeType = value;
    });

    $('div[type="compulsoryEndTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="compulsoryEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        vm.q.compulsoryEndTimeType = value;
    });
}

function initDate(laydate) {
    // 交强险查询时间
    laydate.render({
        elem : '#compulsoryEndTimeSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="compulsoryEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.compulsoryEndTimeSearch=value;
        }
    });
    // 商业险查询时间
    laydate.render({
        elem : '#commercialEndTimeSearch',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="commercialEndTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.commercialEndTimeSearch=value;
        }
    });
}

function initData() {

}

function checkAllStatusChange() {
    var count =  receivablesDatas.length;
    receivablesDatas.forEach(function (d) {
        if ($.inArray(d.carId, vm.ids) >= 0){
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count==0 && receivablesDatas.length != 0);
}

var receivablesDatas;
function ysCheckedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.ids.push(id);
        }

        vm.count = vm.ids.length;
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.count = vm.ids.length;
        }
    }
}