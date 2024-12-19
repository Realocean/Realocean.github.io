// 供应商多选事件
var xmSelectOnFunction = function (data){
    //arr:  当前多选已选中的数据
    var workOrderAccountList = data.arr;
    vm.commitWorkOrder.workOrderAccountIdList = [];
    for (var i in workOrderAccountList){
        vm.commitWorkOrder.workOrderAccountIdList.push(workOrderAccountList[i].id);
    }
}
$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable', 'layedit', 'laydate'], function () {
            soulTable = layui.soulTable;
            gridTable = layui.table.render({
            id: "gridid1",
            elem: '#grid',
            url: baseURL + 'car/carsurviel/queryList',
            where: JSON.parse(JSON.stringify(vm.q)),
            cols: [[
                {
                    event:"multipleSelection",
                    type:"checkbox",
                    width: 30,
                    align:"center",
                    fixed: "left"
                },
                {field: 'hphm', minWidth: 100, title: '车牌号',fixed: "left", align: "center",templet: function (d) {return isEmpty(d.hphm)}},
                {field: 'fkje', minWidth: 100, title: '罚款金额', align: "center",sort: true,templet: function (d) {return isEmpty(d.fkje)}},
                {field: 'wfjfs', minWidth: 100, title: '记分值', align: "center",sort: true,templet: function (d) {return isEmpty(d.wfjfs)}},
                {field: 'wfdz', minWidth: 100, title: '违章地点', align: "center",templet: function (d) {return isEmpty(d.wfdz)}},
                {field: 'wfsj', minWidth: 100, title: '违章时间', align: "center",sort: true,templet: function (d) {return isEmpty(d.wfsj)}},
                {field: 'clbj', minWidth: 100, title: '是否处理', align: "center",sort: true,templet: function (d) {return transformTypeByMap(d.clbj, {1:'已处理', 0:'未处理'})}},
                // {field: 'clsj', minWidth: 100, title: '处理时间', align: "center",sort: true,templet: function (d) {return isEmpty(d.clsj)}},
                {field: 'jkbj', minWidth: 100, title: '是否交款', align: "center",sort: true,templet: function (d) {return transformTypeByMap(d.jkbj, {1:'已交款', 0:'未交款'})}},
                {field: 'wfms', minWidth: 100, title: '违章行为', align: "center",templet: function (d) {return isEmpty(d.wfms)}},
                {field: 'cjjgmc', minWidth: 100, title: '采集单位', align: "center",templet: function (d) {return isEmpty(d.cjjgmc)}},
                {field: 'orderCarNo', minWidth: 100, title: '车辆订单号', align: "center",templet: function (d) {
                        var orderCarNo = isEmpty(d.orderCarNo);
                        if(orderCarNo=='--'){
                            return orderCarNo;
                        }
                        return `<span class="orderDetail" obj-id="${d.orderCarId}" obj-no="${d.orderCarNo}" style="color:blue;cursor: pointer;"> ${d.orderCarNo} </span>`
                    }
                },
                {field: 'customerName', minWidth: 100, title: '客户名称', align: "center",templet: function (d) {return isEmpty(d.customerName)}},
                {field: 'orderCarBusinessType', minWidth: 100, title: '业务状态', align: "center",sort: true,templet: function (d) {
                        let orderCarBusinessType = isEmpty(d.orderCarBusinessType);
                        if (orderCarBusinessType == '--') {
                            return orderCarBusinessType;
                        }
                        return vm.orderCarBusinessTypeMap[orderCarBusinessType];
                    }
                },
                {field: 'hpzlStr', minWidth: 100, title: '号牌种类', align: "center",sort: true,templet: function (d) {return isEmpty(d.hpzlStr)}},
            ]],
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
        Search({
            elid: 'searchId',
            vm_q: vm.q,
            termList: [
                {type: 'text', label: '车牌号', placeholder: '请输入车牌号', fieldName: 'carPlateNo',},
                {type: 'text', label: '违章行为', placeholder: '请输入违章内容', fieldName: 'illegalDetail',},
                {type: 'select', label: '处理状态', placeholder: '请选择处理状态', fieldName: 'illegalStatus', selectMap: {
                        0:'未处理',
                        1:'已处理',
                    },
                },
                {type: 'date', label: '违章时间', placeholder: '选择日期范围', fieldName: 'illegalTime', selectFilter: true},
            ],
            callback: function (tag) {
                switch (tag) {
                    case 'updateStatistics':{
                        vm.query();
                        break;
                    }
                    case 'query':{
                        vm.query();
                        break;
                    }
                    case 'reset':{
                        vm.reset();
                        break;
                    }
                    case 'exports':{
                        vm.exports();
                        break;
                    }
                }
            }
        }).initView();


        layui.upload.render({
            elem: '#inports',
            url: baseURL + 'car/carsurviel/imports',
            field: 'file',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.xls,.xlsx',
            exts: 'xls|xlsx', //
            before: function (obj) {
                layer.msg('数据导入中...', {
                    icon: 16,
                    shade: 0.1,
                    time: 0
                })
            },
            done: function (res) {
                layer.close(layer.msg());
                if (parseInt(res.code) === 0) {
                    vm.importSuccess(res);
                } else {
                    layer.msg('文件解析失败:' + res.msg, {icon: 5});
                }
            },
            error: function () {
                layer.close(layer.msg());
                layer.msg('文件解析失败', {icon: 5});
            }
        });
        $("#manualQuery").on('click', function () {
            vm.manualQuery();
        });
        layui.form.render();
    });
    vm.updateStatistics();
    //列表复选框多选
    layui.table.on('checkbox(grid)', function () {
        vm.ids = layui.table.checkStatus('gridid1').data.map(item=>item.id);
    });
    // 表格排序
    layui.table.on('sort(grid)', function(obj){
        for(var key in vm.q){
            if (key.endsWith('Sort')){
                vm.q[key] = null;
            }
        }
        vm.q[obj.field+'Sort'] = obj.type;
        vm.reload(obj);
        console.log('服务端排序。order by '+ obj.field + ' ' + obj.type);
    });
    layui.form.on('radio(platform)', function(data){
        vm.commitWorkOrder.platform = data.value;
        // 当选择深圳交警时，只有查全部
        if(data.value=='2'){
            vm.commitWorkOrder.queryMode = 0;
        }
    });
    layui.form.on('radio(queryMode)', function(data){
        // 查全部则清空选择账号
        vm.commitWorkOrder.queryMode = data.value;
        if(data.value!='0'){
            return false;
        }
        vm.commitWorkOrder.workOrderAccountIdList=[];
        // 清空所有选项
        for (let i = 0; i < vm.workOrderAccountList.length; i++) {
            vm.workOrderAccountList[i]['selected'] = false;
        }
        xmSelect.render({
            el: '#purchaseSupplierId2',
            language: 'zn',
            prop: {
                name: 'account',
                value: 'id',
            },
            data: vm.workOrderAccountList,
            // 供应商多选事件
            on: xmSelectOnFunction
        });
    });
    // 订单详情
    $(document).on('click', '.carDetail,.contractDetail,.orderDetail,.customerDetail,.spareOrder', function () {
        vm.tableFiledSkipOtherView($(this));
    });
});
function isBlank(str){
    // 判断对象是否为空
    return str==null || str==undefined || str=='null' || str=='undefined' || str=='';
}
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var ztree;
var vm = new Vue({
    el: '#rrapp',
    data: {
        isFilter: false,
        q: {
            carPlateNo:null,
            illegalDetail:null,
            illegalTime:null,
            violationDay:null,
            orderCarBusinessType:null
        },
        carIllegalCount:[],
        carIllegalIndex: 0,
        editForm: false,
        mainForm: true,
        city: [],   //运营城市城市名称
        carIllegal: {},
        carIllegalHandle: {},
        queryData: {},
        warehouseData:{},
        isFilter:false,
        statisticsCardDataList:[],
        orderCarBusinessTypeStatistics: {},
        orderCarBusinessTypeMap: {
            "1": "退车",
            "2": "换车",
            "3": "用车"
        },
        statisticsCardIndex:0,
        // 复选框勾选
        ids:[],
        //region 违章工单提交
        // 提交工单
        commitWorkOrder:{
            platform: 1,
            queryMode: 0,
            deptIdList: [],
            deptIdListStr: null,
            deptNameList: [],
            deptNameListStr: null,
            carNumber: 0,
            workOrderAccountIdList:[]
        },
        // 提交工单的表单
        showForm:false,
        showForm2:false,
        platformDict:[
            {key:1,label:"12123平台"},
            {key:2,label:"深圳交警"}
        ],
        queryModeDictMap:{
            "0":"全部车辆",
            "1":"部分车辆",
        },
        purchasesupplierList:[],
        // 违章账号列表
        workOrderAccountList:[],
        //endregion
        // 编辑消息模板
        messageTemplateObj:{
            msgType:1,
            templateCode:3,
            templateStatus:1,
            msgContent:"尊敬的#{code1}客户：您好！您在我司租赁的车辆“#{hphm}”，在“#{wfsj}”时间发生了”#{wfms}”，请您收到短信后尽快处理。"
        }
        // 违章查询余额
        ,balance:0
    },
    updated: function () {
        layui.form.render();
    },

    created: function () {
        if (parent.layui.larryElem !== undefined) {
            var params = parent.layui.larryElem.boxParams;
            if (params) {
                if (params.carNo) {
                    this.setCarNo(params.carNo);
                }
            }
        }
    },

    methods: {
          // 高级筛选
          bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        setCarNo: function (CarNo) {
            this.q.carPlateNo = CarNo;
        },
        illegalCheck:function(){
            $.ajax({
                type: "POST",
                url: baseURL + 'car/carsurviel/requestSurviel',
                contentType: "application/json",
                data: JSON.stringify(vm.sysDept),
                success: function(r){
                    if(r && r.msg){
                        alert(r.msg, function(index){
                            layer.closeAll();
                        });
                    }
                }
            });
        },
        isVehicleNumber: function(vehicleNumber){
            var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
            var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
            if(vehicleNumber.length == 7){
                return creg.test(vehicleNumber);
            } else if(vehicleNumber.length == 8){
                return xreg.test(vehicleNumber);
            } else{
                return false;
            }
        },
        // 更新未处理数量统计
        updateStatistics:function (){
            var param = '?';
            for (var key in vm.q) {
                if (isBlank(vm.q[key])) {
                    continue
                }
                param+=`${key}=${vm.q[key]}&`
            }
            $.get(baseURL + "/car/carsurviel/tab"+param, function (r) {
                /*
                r 示例
                {
                    "msg": "success",
                    "code": 0,
                    "data": [
                        {
                            "text": "全部违章",
                            "number": 8
                        },
                        {
                            "text": "超15天未处理",
                            "number": 1,
                            "violationDay": 15
                        },
                        {
                            "text": "超30天未处理",
                            "number": 1,
                            "violationDay": 30
                        }
                    ],
                    "orderCarBusinessTypeStatistics": {
                        "total": 8,
                        "change_car": 1,
                        "lease_renewal": 0,
                        "return_car": 0
                    }
                }
                 */
                if(!r || !r.data){
                    console.log("车辆违章数量统计报错:"+r.msg)
                    return false;
                }
                vm.statisticsCardDataList = r.data;
                vm.orderCarBusinessTypeStatistics = r.orderCarBusinessTypeStatistics;
                // 未查询违章统计

            });
        },
        changeTab: function (item, index) {
            // 改变tab
            vm.statisticsCardIndex = index;
            vm.q.violationDay = item.violationDay;
            // 新统计维度
            vm.q.columnName = item.columnName;
            vm.q.orderCarBusinessType = item.orderCarBusinessType;
            // 触发查询
            vm.query();
        },
        manualQuery: function () {//查询
            var param = {};
            var index = layer.open({
                title: "违章查询",
                type: 2,
                area: ['60%', '60%'],
                boxParams: param,
                content: tabBaseURL + "modules/car/selectorcar.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        // 违章工单列表
        workOrderPage: function () {
            var index = layer.open({
                title: "违章工单",
                type: 2,
                area: ['100%', '100%'],
                content: tabBaseURL + "modules/car/illegal/workOrderList.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        // 违章查询账号列表
        illegalQueryAccountPage: function () {
            var index = layer.open({
                title: "违章账号",
                type: 2,
                area: ['100%', '100%'],
                content: tabBaseURL + "modules/car/illegal/workOrderAccountList.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        reset: function () {//清空方法
            // 不重置tab值
            resetNULL(vm.q);
            vm.q.violationDay = vm.statisticsCardDataList[vm.statisticsCardIndex].violationDay;
        },
        query: function () {
            vm.reload();
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'car/carsurviel/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid1', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
            // 更新统计行
            vm.updateStatistics();
        },
        // 手动短信通知
        manualSmsNotification:function (){
            vm.ids = layui.table.checkStatus('gridid1').data.map(item=>item.id);
            if(vm.ids.length<1){
                alert("至少选择一条记录");
                return false;
            }
            vm.q.ids = vm.ids;
            confirm('确认手动短信通知？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/car/carsurviel/manualSmsNotification",
                    contentType: "application/json",
                    data: JSON.stringify(vm.q),
                    success: function (r) {
                        alert(r.msg,()=>layer.closeAll());
                        if (r.code === 0) {
                            vm.query();
                            return false;
                        }
                        alert(r.msg);
                    }
                });
            });
        },
        // 消息通知
        notice:function(){
            var index = layer.open({
                title: "车辆违章通知",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL+'modules/maintenance/messageNotice.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("carId",null);
                }
            });
        },
        // 弹出编辑消息模板页面
        editMessageTemplatePage:function (){
            var url = `${baseURL}/message/messagetemplate/queryList?page=1&limit=1&msgType=1&templateCode=3`;
            $.get(url, function (r) {
                var list = r.data;
                if(list==null || list.length<1){
                    return false;
                }
                vm.messageTemplateObj = list[0];
            });
            var index = layer.open({
                title: "编辑消息模板",
                type: 1,
                area: ['70%', '40%'],
                content: $("#editForm2"),
                end: function () {
                    vm.showForm2 = false;
                    layer.closeAll();
                }
            });
            vm.showForm2 = true;
        },
        // 编辑消息模板
        editMessageTemplate:function (){
            $.ajax({
                type: "POST",
                url: `${baseURL}/message/messagetemplate/${vm.messageTemplateObj.id==null?"save":"update"}`,
                contentType: "application/json",
                data: JSON.stringify(vm.messageTemplateObj),
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
        //region 提交工单
        // 更新账号列表
        selectAccountList: function (){
            // 账号列表
            var url = `${baseURL}/car/workOrderAccount/list?page=1&limit=99999&enableFlag=1&platform=${vm.commitWorkOrder.platform}&tenantId=${localStorage.getItem("tenantId")}`;
            $.get(url, function (r) {
                vm.workOrderAccountList = r.data;
                // 回显数据
                let workOrderAccountIdList = vm.commitWorkOrder.workOrderAccountIdList;
                for (let i = 0; i < vm.workOrderAccountList.length; i++) {
                    // 回显
                    vm.workOrderAccountList[i]['selected'] = workOrderAccountIdList.indexOf(vm.workOrderAccountList[i].id)!=-1
                    // 展示供应商数据
                    var workOrderAccountDeptList = vm.workOrderAccountList[i].workOrderAccountDeptList;
                    if (workOrderAccountDeptList.length > 0) {
                        vm.workOrderAccountList[i]['deptId'] = workOrderAccountDeptList[0].deptId;
                        // 有供应商的追加供应商名称展示
                        if(workOrderAccountDeptList[0].deptName!='' &&
                            workOrderAccountDeptList[0].deptName!=null &&
                            workOrderAccountDeptList[0].deptName!='null' &&
                            workOrderAccountDeptList[0].deptName!=undefined)
                        vm.workOrderAccountList[i]['account'] += `(${workOrderAccountDeptList[0].deptName})`;
                    }
                }
                vm.selectSupListObj = xmSelect.render({
                    el: '#purchaseSupplierId2',
                    language: 'zn',
                    prop: {
                        name: 'account',
                        value: 'id',
                    },
                    data: vm.workOrderAccountList,
                    // 供应商多选事件
                    on: xmSelectOnFunction
                });
            });
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
        // 提交工单
        submit: function (){
            $.ajaxSettings.async = false;
            // 获取余额，余额为0则提示
            vm.updatebalance();
            $.ajaxSettings.async = true;
            if (vm.balance < 1) {
                console.log(vm.balance);
                alert('违章余额为0，请联系售后人员');
                return false;
            }
            // 统计启用账号违章情况
            vm.queryPlatformConfig();
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
            // 查询账号初始化
            vm.selectAccountList();
            var index = layer.open({
                title: "提交工单",
                type: 1,
                area: ['50%', '80%'],
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
                carNumber: 0,
                workOrderAccountIdList:[]
            };
        },
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
            PageLoading();
            vm.checkData();
            $.ajax({
                type: "POST",
                url: baseURL + "/car/illegalWorkOrder/save",
                contentType: "application/json",
                data: JSON.stringify(vm.commitWorkOrder),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function () {
                            vm.showForm = false;
                            vm.query();
                        });
                    }else{
                        alert(r.msg);
                    }

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
        //endregion
        //region 订单详情
        carDetailView: function (id, no) {
            var index = layer.open({
                title: "车辆详情",
                type: 2,
                content: tabBaseURL + "modules/car/tcarbasiceditanddetail.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.initEditData(id);
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        contractDetailView: function (id, no) {
            $.get(baseURL + "contract/contracordernotemplate/info/"+id, function(r){
                var param = {
                    contracorderNotemplate:r.contracorderNotemplate,
                    statusStr: r.contracorderNotemplate.statusStr
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
        },
        orderDetailView: function (id, no) {

            $.get(baseURL + "order/order/info/" + id, function (r) {
                if (r.order) {
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
                }else {
                    alert("未找到订单信息");
                }
            });
        },
        customerDetailView: function (id, no) {
            localStorage.setItem("id", id);
            var title = "客户信息";
            var index = layer.open({
                title: title,
                type: 2,
                content: tabBaseURL + 'modules/customer/customerdetail.html',
                shade: false,
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        spareOrderView: function (id, no) {
            $.get(baseURL + "cartransfer/sparecar/info/"+id, function(r){
                var index = layer.open({
                    title: "备用车详情",
                    type: 2,
                    content: tabBaseURL + "modules/order/sparecardetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.spareCarApply = r.spareCar;
                        iframe.vm.receivablesList = r.spareCar.receivablesList;
                        if(r.spareCar.isApply == 1){
                            iframe.vm.payDayShow = true;
                        }else{
                            iframe.vm.payDayShow = false;
                        }
                        if(r.spareCar.spareCarStatus == 2){
                            iframe.vm.returnCarBtn = true;
                        }else{
                            iframe.vm.returnCarBtn = false;
                        }
                        if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                            iframe.vm.returnCarForm = true;
                            iframe.vm.detailsSupTabContentList = [
                                '备用车基础信息',
                                '备用车信息',
                                '合同信息',
                                '其他关联单据信息',
                                '备用车退车信息'
                            ];
                        }else{
                            iframe.vm.returnCarForm = false;
                            iframe.vm.detailsSupTabContentList = [
                                '备用车基础信息',
                                '备用车信息',
                                '合同信息',
                                '其他关联单据信息'
                            ];
                        }
                        iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                        iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                        iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                        iframe.vm.reloadData();
                        iframe.vm.initOperatorLog(id);
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        tableFiledSkipOtherView: function (view) {
            var obj = view[0];
            var action = obj.className.trim();
            var id = obj.attributes['obj-id'].value.trim();
            var no = obj.attributes['obj-no'].value.trim();
            switch (action) {
                case 'carDetail':{
                    vm.carDetailView(id, no);
                    break;
                }
                case 'contractDetail':{
                    vm.contractDetailView(id, no);
                    break;
                }
                case 'orderDetail':{
                    vm.orderDetailView(id, no);
                    break;
                }
                case 'customerDetail':{
                    vm.customerDetailView(id, no);
                    break;
                }
                case 'spareOrder':{
                    vm.spareOrderView(id, no);
                    break;
                }
            }
        },
        //endregion
        importSuccess: function (map) {
            var btn = [];
            var isdownxls = map.allCount != null && Number(map.allCount || 1) !== Number(map.successCount || 0);
            if (isdownxls) {
                btn.push('下载失败数据');
            }
            btn.push('关闭');
            var index = layer.confirm(map.message, {
                btn: btn
            }, function () {
                if (isdownxls) {
                    var form = $('form#downLoadXls');
                    form.find('input[name="datas"]').val(JSON.stringify(map.errDatas));
                    form[0].action = baseURL + 'car/carsurviel/downxlserr';
                    form.submit();
                }
                layer.close(index);
                vm.reload();
            }, function () {
                layer.close(index);
                vm.reload();
            });
        },
    }
});
