/**
 * 处理tenantId，取不到则默认为1
 * @param value
 */
function hanlderTenantId(value){
    if(value==null || value==undefined || value=='' || value=='null'){
        return 1;
    }
    return value;
}
$(function () {
    // 工单/消费记录
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid', // 列表元素id
        url: `${baseURL}car/illegalWorkOrder/list?tenantId=${hanlderTenantId(localStorage.getItem("tenantId"))}`,
        cols: [[
            {field: 'workOrderNo', minWidth: 100, title: '工单号', align: "center",templet:(d)=>isEmpty(d.workOrderNo)},
            {field: 'processingStatus', minWidth: 100, title: '处理状态', align: "center",templet:(d)=>{
                    var processingStatus = isEmpty(d.processingStatus);
                    if(processingStatus=='--'){
                        return processingStatus;
                    }
                    return vm.processingStatusDictMap[processingStatus].label;
                }},
            {field: 'commitMan', minWidth: 100, title: '提交人', align: "center",templet:(d)=>isEmpty(d.commitMan)},
            {field: 'commitTime', minWidth: 100, title: '提交时间', align: "center",templet:(d)=>isEmpty(d.commitTime)},
            {field: 'processingTime', minWidth: 100, title: '处理时间', align: "center",templet:(d)=>isEmpty(d.processingTime)},
            {field: 'cost', minWidth: 100, title: '本次消费(元)', align: "center",templet:(d)=>isEmpty(d.cost)},
            {field: 'balance', minWidth: 100, title: '消费后余额(元)', align: "center",templet:(d)=>isEmpty(d.balance)},
            {title: '操作', width: 120, templet: '#barTpl', fixed: "right", align: "center"}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    // 充值记录
    gridTable = layui.table.render({
        id: "rechargeGrid",
        elem: '#rechargeGrid',
        url: `${baseURL}/car/illegalBalanceRecord/list?tenantId=${hanlderTenantId(localStorage.getItem("tenantId"))}&rechargeRecordsFlag=1`,
        cols: [[
            {field: 'changeBefore', minWidth: 100, title: '充值前金额(元)', align: "center",templet:(d)=>isEmpty(d.changeBefore)},
            {field: 'consume', minWidth: 100, title: '充值金额(元)', align: "center",templet:(d)=>isEmpty(d.consume)},
            {field: 'changeAfter', minWidth: 100, title: '充值后金额(元)', align: "center",templet:(d)=>isEmpty(d.changeAfter)},
            {field: 'createTime', minWidth: 100, title: '充值时间', align: "center",templet:(d)=>isEmpty(d.createTime)}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10
    });
    //列表操作按钮事件
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'detail') {
            vm.detail(data.workOrderNo);
        }
    });
    layui.form.on('radio(platform)', function(data){
        vm.commitWorkOrder.platform = data.value;
        // 当选择深圳交警时，只有查全部
        if(data.value=='2'){
            vm.commitWorkOrder.queryMode = 0;
        }
        // 更新车辆数量
        vm.vehicleCountStatistics();
    });
    layui.form.on('radio(queryMode)', function(data){
        // 查全部则清空选择部门
        vm.commitWorkOrder.queryMode = data.value;
        if(data.value=='0'){
            vm.commitWorkOrder.deptIdList=[];
            vm.commitWorkOrder.deptNameList=[];
            vm.commitWorkOrder.deptNameListStr = '';
            vm.commitWorkOrder.deptIdListStr = '';
            // 清空所有选项
            for (let i = 0; i < vm.purchasesupplierList.length; i++) {
                vm.purchasesupplierList[i]['selected'] = false;
            }
            xmSelect.render({
                el: '#purchaseSupplierId2',
                language: 'zn',
                prop: {
                    name: 'supplierName',
                    value: 'purchaseSupplierId',
                },
                data: vm.purchasesupplierList,
                // 供应商多选事件
                on: xmSelectOnFunction
            });
        }
        // 更新车辆数量
        vm.vehicleCountStatistics();
    });
    layui.form.on('submit(commitWorkOrder)', function () {
        vm.commitWorkOrder();
    });
    // 提交开始时间
    layui.laydate.render({
        elem: '#startCommitTime',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.q.startCommitTime = value
    });
    // 提交结束时间
    layui.laydate.render({
        elem: '#endCommitTime',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: (value)=>vm.q.endCommitTime = value
    });
    // 工单列表tab切换事件
    layui.element.on('tab(workOrderTab)', function(data){
        vm.query();
    });
});
// 供应商多选事件
var xmSelectOnFunction = function (data){
    //arr:  当前多选已选中的数据
    var purchaseSuppliers = data.arr;
    vm.commitWorkOrder.deptIdList = [];
    vm.commitWorkOrder.deptNameList = [];
    for (var i in purchaseSuppliers){
        vm.commitWorkOrder.deptIdList.push(purchaseSuppliers[i].purchaseSupplierId);
        vm.commitWorkOrder.deptNameList.push(purchaseSuppliers[i].supplierName);
    }
    vm.commitWorkOrder.deptIdListStr = vm.commitWorkOrder.deptIdList.join(',');
    vm.commitWorkOrder.deptNameListStr = vm.commitWorkOrder.deptNameList.join(',');
}
// 创建vue应用
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            workOrderNo: null,
            startCommitTime: null,
            endCommitTime: null,
            startDate: null,
            endDate: null,
            commitMan: null,
            processingStatus: null
        },
        // 1 仅12123,2深圳交警，3=12123+深圳交警
        platformConfig:0,
        // 不同平台开启账号数量统计
        enableAccountNumber:{},
        processingStatusDict:[
            {key:1,label:"未处理"},
            {key:2,label:"部分处理"},
            {key:3,label:"已处理"},
        ],
        processingStatusDictMap:{},
        queryModeDictMap:{
            "0":"全部车辆",
            "1":"部分车辆",
        },
        // 余额
        balance: 0,
        // 提交工单
        commitWorkOrder:{
            platform: 1,
            queryMode: 0,
            deptIdList: [],
            deptIdListStr: null,
            deptNameList: [],
            deptNameListStr: null,
            carNumber: 0
        },
        // 提交工单的表单
        showForm:false,
        platformDict:[
            {key:1,label:"12123平台"},
            {key:2,label:"深圳交警"}
        ],
        purchasesupplierList:[]
    },
    created: function (){
        this.updatebalance();
        // 构建map数据方便变更单位
        for(var index in this.processingStatusDict){
            var processingStatusItem = this.processingStatusDict[index];
            this.processingStatusDictMap[processingStatusItem.key] = processingStatusItem;
        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 更新余额
        updatebalance:()=>{
            console.log(`更新违章查询余额`)
            $.get(baseURL + "/order/illegalcustombalance/balance", function (r) {
                if(!r || !r.data){
                    return false;
                }
                vm.balance = r.data.hasMoney;
            });
        },
        // 查询违章平台配置
        queryPlatformConfig:()=>{
            console.log(`查询违章平台配置`)
            $.ajaxSettings.async = false;
            $.get(baseURL + "/car/workOrderAccount/accountEnableFlagStatistics", function (r) {
                if(!r || !r.data){
                    return false;
                }
                var result = r.data;
                vm.enableAccountNumber = r.data;
                vm.platformConfig = 0;
                // 仅12123
                if(result['1']>0 && result['2']==0){
                    vm.platformConfig = 1;
                }else if(result['1']==0 && result['2']>0){
                    // 仅深圳交警
                    vm.platformConfig = 2;
                    vm.commitWorkOrder.platform=2;
                }else if(result['1']>0 && result['2']>0){
                    // 12123+深圳交警
                    vm.platformConfig = 3;
                }
            });
            $.ajaxSettings.async = true;
        },
        // 查询按钮事件
        query: function () {
            var startCommitTimeComplete = vm.q.startCommitTime?vm.q.startCommitTime+' 00:00:00':null;
            var endCommitTimeComplete = vm.q.endCommitTime?vm.q.endCommitTime+' 23:59:59':null;
            // 工单列表重载
            layui.table.reload('gridid', {
                // 分页参数
                page: {
                    curr: 1
                },
                // 查询条件
                where: {
                    workOrderNo: vm.q.workOrderNo,
                    startCommitTime:  startCommitTimeComplete,
                    endCommitTime:  endCommitTimeComplete,
                    commitMan: vm.q.commitMan,
                    processingStatus: vm.q.processingStatus
                }
            });
            // 充值记录重载
            layui.table.reload('rechargeGrid', {
                // 分页参数
                page: {
                    curr: 1
                },
                // 查询条件
                where: {
                    startDate:  startCommitTimeComplete,
                    endDate:  endCommitTimeComplete
                }
            });
            vm.updatebalance();
        },
        reset:function (){
            vm.q = {
                workOrderNo: null,
                startCommitTime: null,
                endCommitTime: null,
                commitMan: null,
                processingStatus: null,
            }
        },
        // 提交工单
        submit: function (){
            // 统计启用账号违章情况
            vm.queryPlatformConfig();
            // 更新车辆数量
            vm.vehicleCountStatistics();
            // 启用账号里只有深圳交警
            if(vm.platformConfig == 0){
                alert('无启用账号，无法提交工单');
                return false;
            }
            // 启用账号里只有深圳交警
            if(vm.platformConfig == 2){
                vm.submit1();
                return false;
            }
            // 供应商初始化
            vm.selectSupList();
            var index = layer.open({
                title: "提交工单",
                type: 1,
                area: ['40%', '40%'],
                content: $("#editForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            // 初始化提交信息
            vm.commitWorkOrder = {
                platform: 1,
                queryMode: 0,
                deptIdList: [],
                deptIdListStr: null,
                deptNameList: [],
                deptNameListStr: null,
                carNumber: 0
            };
        },
        // 启用账号里只有深圳交警
        submit1:function (){
            // 交管账号查询车辆总数
            var number = vm.enableAccountNumber['2']*10;
            if (vm.commitWorkOrder.carNumber > number) {
                alert("查询车辆超过交管账号查询上限");
                return false;
            }
            // 最终发送前检查处理一遍数据
            vm.checkData();
            confirm('确认提交违章查询工单？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/car/illegalWorkOrder/save",
                    contentType: "application/json",
                    data: JSON.stringify(vm.commitWorkOrder),
                    success: function (r) {
                        if (r.code === 0) {
                            layer.closeAll();
                            vm.query();
                            return false;
                        }
                        alert(r.msg);
                    }
                });
            });
        },
        // 提交工单
        commitWorkOrderEvent: function () {
            // 交管账号查询车辆总数，一个账号可以查10个车
            var number = vm.enableAccountNumber['2']*10;
            if (vm.commitWorkOrder.platform==2 && vm.commitWorkOrder.carNumber > number) {
                alert("查询车辆超过交管账号查询上限");
                return false;
            }
            // 最终发送前检查处理一遍数据
            vm.checkData();
            $.ajax({
                type: "POST",
                url: baseURL + "/car/illegalWorkOrder/save",
                contentType: "application/json",
                data: JSON.stringify(vm.commitWorkOrder),
                success: function (r) {
                    if (r.code === 0) {
                        layer.closeAll();
                        vm.query();
                        return false;
                    }
                    alert(r.msg);
                }
            });
        },
        // 检查数据，校验数据业务合法
        checkData:function (){
            // 最终发送前检查处理一遍数据
            if(vm.commitWorkOrder.platform==1){
                // 12123
                if(vm.commitWorkOrder.queryMode==0){
                    // 全部车辆，不看所属公司
                    vm.commitWorkOrder.deptIdList=[];
                    vm.commitWorkOrder.deptNameList=[];
                    vm.commitWorkOrder.deptNameListStr = '';
                    vm.commitWorkOrder.deptIdListStr = '';
                }
            }else if(vm.commitWorkOrder.platform==2){
                // 深圳交警，默认全部车辆
                vm.commitWorkOrder.queryMode=0;
            }
        },
        // 违章余额明细列表
        illegalBalanceRecordList: function (){
            layer.open({
                title: "违章余额明细列表",
                type: 2,
                shadeClose: true,
                scrollbar: true,
                area: ['100%', '100%'],
                content: [tabBaseURL+'modules/car/illegal/balanceRecordList.html?tenantId='+hanlderTenantId(localStorage.getItem("tenantId")),'no'],
                end: function () {
                    layer.closeAll();
                }
            });
        },
        // 工单详情车辆列表
        detail: function (workOrderNo){
            layer.open({
                title: "违章工单车辆列表",
                type: 2,
                shadeClose: true,
                scrollbar: true,
                area: ['100%', '100%'],
                content: [`${tabBaseURL}modules/car/illegal/workOrderCarList.html?workOrderNo=${workOrderNo}`,'no'],
                end: function () {
                    layer.closeAll();
                }
            });
        },
        // 查询提交工单，车辆数量统计
        vehicleCountStatistics: function(){
            $.ajaxSettings.async = false;
            $.ajax({
                type: "POST",
                url: baseURL + "/car/illegalWorkOrder/vehicleCountStatistics",
                contentType: "application/json",
                data: JSON.stringify(vm.commitWorkOrder),
                success: function (r) {
                    if (r.code != 0) {
                        alert(r.msg);
                        return false;
                    }
                    vm.commitWorkOrder.carNumber = r.data['1']||r.data['2'];
                    console.log(`车辆数量统计，交管12123：${r.data['1']},深圳交警：${r.data['2']},车辆总数：${vm.commitWorkOrder.carNumber}`)
                }
            });
            $.ajaxSettings.async = true;
        },
        // 更新供应商列表
        selectSupList: function (){
            // 供应商列表
            $.get(baseURL + "purchase/purchasesupplier/selectSupList?enalbe=1", function (r) {
                vm.purchasesupplierList = r.data;
                // 回显数据
                let deptIdList = vm.commitWorkOrder.deptIdList;
                if(deptIdList && deptIdList.length>0 && vm.purchasesupplierList.length>0){
                    for (let i = 0; i < vm.purchasesupplierList.length; i++) {
                        vm.purchasesupplierList[i]['selected'] = deptIdList.indexOf(vm.purchasesupplierList[i].purchaseSupplierId)!=-1
                    }
                }
                vm.selectSupListObj = xmSelect.render({
                    el: '#purchaseSupplierId2',
                    language: 'zn',
                    prop: {
                        name: 'supplierName',
                        value: 'purchaseSupplierId',
                    },
                    data: r.data,
                    // 供应商多选事件
                    on: xmSelectOnFunction
                });
            });
        },
    }
});