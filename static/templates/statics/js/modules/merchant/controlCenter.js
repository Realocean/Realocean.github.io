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
    staffingTable = layui.table.render({
        id: "staffingGrid",
        elem: '#staffingGrid',
        url: baseURL + 'configCenter/alarmNoticePerson/list',
        cols: [[
            {field:'deptName', minWidth:100, title: '所属公司/部门',align:"center"},
            {field:'userName', minWidth:100, title: '需通知人员名称',align:"center"},
            {field:'roleName', minWidth:100, title: '角色',align:"center"},
            {field:'mobile', minWidth:100, title: '手机号码',align:"center"},
            {title: "操作", width:120, templet:'#barTplStaffing',align:"center"},
            {title: '启用/禁用', width:120, templet:'#barTplStaffingCheck',align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
    });
    areaTable = layui.table.render({
        id: "areaGrid",
        elem: '#areaGrid',
        url: baseURL + 'vehiclemonitor/electronicFence/list?electricType=1',
        cols: [[
            {field:'areaName', minWidth:100, title: '区域名称',align:"center"},
            {field:'alarmSettings', minWidth:200, title: '报警设置',align:"center"},
            {field:'carCount', minWidth:100, title: '绑定车辆',align:"center", templet: function (d) {
                let carCount = d.carCount || 0
                return "<a class=\"layui-grid-btn-xs\" lay-event=\"bindArea\">"+carCount+"</a>";
            }},
            {title: "<div class=\"layui-form-item layui-form-item\">\n" +
            "<a class=\"layui-btn layui-btn-xs\" lay-submit lay-filter=\"areaAdd\">新增</a>\n" +
            "</div>", width:120, templet:'#barTplArea',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
    });
    wordkeysTable = layui.table.render({
        id: "wordkeysGrid",
        elem: '#wordkeysGrid',
        url: baseURL + 'vehiclemonitor/electronicFence/list?electricType=2',
        cols: [[
            {field:'keyWord', minWidth:100, title: '关键字名称',align:"center"},
            {field:'areaName', minWidth:100, title: '所在区域',align:"center"},
            {field:'radius', minWidth:100, title: '半径(m)',align:"center"},
            {field:'alarmSettings', minWidth:200, title: '报警设置',align:"center"},
            {field:'carCount', minWidth:100, title: '绑定车辆',align:"center", templet: function (d) {
                let carCount = d.carCount || 0
                return "<a class=\"layui-grid-btn-xs\" lay-event=\"bindKeyWord\">"+carCount+"</a>";
            }},
            {title: "<div class=\"layui-form-item layui-form-item\">\n" +
            "<a class=\"layui-btn layui-btn-xs\" lay-submit lay-filter=\"keysAdd\">新增</a>\n" +
            "</div>", width:120, templet:'#barTplKeys',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10
    });

    layui.form.on('submit(areaAdd)', function(){
       var index = layer.open({
            type: 2,
            title: '新增行政区域电子围栏',
            area: ['800px', '500px'],
            boxParams: {
                electricType:'1'
            },
            content: tabBaseURL + 'modules/merchant/areaAdd.html',
            end: function () {
                layer.close(index);
            }
        });
       return false;
    });
    //行政区域电子围栏设置操作
    layui.table.on('tool(areaGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'areaEdit'){
            var index = layer.open({
                type: 2,
                title: '修改行政区域电子围栏',
                boxParams: {
                    electricType:'1',
                    data:data
                },
                area: ['800px', '500px'],
                content: tabBaseURL + 'modules/merchant/areaAdd.html',
                end: function () {
                    layer.close(index);
                }
            });
        } else if(layEvent === 'areaDel'){
            var ids = [data.id];
            vm.areaDel(ids);
        }else if(layEvent==="bindArea"){
            var index = layer.open({
                type: 2,
                title: '绑定车辆',
                boxParams: {
                    electricType:'1',
                    data:data
                },
                content: tabBaseURL + 'modules/merchant/bindArea.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        }
    });

    layui.form.on('submit(keysAdd)', function(){
        var index = layer.open({
            type: 2,
            title: '新增关键字围栏',
            area: ['800px', '500px'],
            boxParams: {
                electricType:'2'
            },
            content: tabBaseURL + 'modules/merchant/areaAdd.html',
            end: function () {
                layer.close(index);
            }
        });
        return false;
    });
    layui.form.on('submit(bindKeyWord)', function(){
        var index = layer.open({
            type: 2,
            title: '绑定车辆',
            content: tabBaseURL + 'modules/merchant/bindKeyWord.html',
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
     });
    layui.table.on('tool(staffingGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
            if(layEvent === 'staffingDel'){
                var ids = [data.id];
                vm.staffingDel(ids)
            }else{

            }
    });
    layui.form.on('switch(status)',function(obj){ 
        vm.staffingUpdate(obj.elem.dataset)
    })
    
    //关键字围栏设置操作
    layui.table.on('tool(wordkeysGrid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'keysEdit'){
            var index = layer.open({
                type: 2,
                title: '修改关键字围栏',
                boxParams: {
                    electricType:'2',
                    data:data
                },
                area: ['800px', '500px'],
                content: tabBaseURL + 'modules/merchant/areaAdd.html',
                end: function () {
                    layer.close(index);
                }
            });
        } else if(layEvent === 'keysDel'){
            var ids = [data.id];
            vm.keysDel(ids);
        }else if(layEvent === 'bindKeyWord'){
            var index = layer.open({
                type: 2,
                title: '绑定车辆',
                boxParams: {
                    electricType:'2',
                    data:data
                },
                content: tabBaseURL + 'modules/merchant/bindArea.html',
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        }
    });

    // 车辆违章预警条件 事件
    layui.form.on('select(illegalConditionConfig)', function (data) {
        vm.controlCenter.illegalConditionConfig = data.value;
    });
    // 财务配置
    layui.form.on('radio(dailyOrderApproval)', function(data){
        vm.controlCenter.dailyOrderApproval = data.value;
    });
    /*// 自动查询车辆违章-查询车辆单选 1退车，2换车，3用车
    layui.form.on('checkbox(autoQueryVehicleConfig)', function(data){
        vm.controlCenter.autoQueryVehicleConfig = [];
        $("[name=autoQueryVehicleConfig]:checked").each((index, value)=>{
            if(data.elem.checked){
                vm.controlCenter.autoQueryVehicleConfig.push(value.value)
            }
        });
    });*/
    // 自动查询，查询车辆
    layui.form.on('radio(autoQueryVehicleConfigNew)', function(data){
        vm.controlCenter.autoQueryVehicleConfigNew = data.value;
        if(data.value!='0' || vm.workOrderAccountList.length<1){
            return false;
        }
        vm.controlCenter.workOrderAccountIdList=[];
        // 选择全部车辆就清空查询车辆多选框
        for (let i = 0; i < vm.workOrderAccountList.length; i++) {
            vm.workOrderAccountList[i].selected = false;
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
    // 标题开关事件
    layui.form.on('switch(titleOnOff)', function(data){
        vm.controlCenter[data.elem.name] = data.elem.checked?1:0;
    });
    // 标题开关事件
    layui.form.on('switch(withholdTitleOnOff)', function(data){
        vm.withholdCenter[data.elem.name] = data.elem.checked?1:0;
    });
    // 车辆违章预警条件开关事件
    layui.form.on('switch(illegalConditionItem)', function(data){
        var illegalConditionItemIndex = data.othis
            .siblings("[name=illegalConditionItemIndex]")
            .val();
        // 响应式更新条件开关
        vm.controlCenter.illegalConditionList[illegalConditionItemIndex].enable = data.elem.checked?1:0;
    });
    // 车辆违章card统计开关事件
    layui.form.on('switch(illegalConditionItemCard)', function(data){
        var illegalConditionItemIndex = data.othis
            .siblings("[name=illegalConditionItemIndex]")
            .val();
        // 响应式更新条件开关
        vm.controlCenter.illegalConditionList[illegalConditionItemIndex].tabEnable = data.elem.checked?1:0;
    });

    // 加项开关事件
    layui.form.on('switch(additem)', function(data){
        vm.flowData.feeItemsConfigList.find(item=>item.feeType==1).wagesFeeItemsInfo[data.elem.name].isOpen = data.elem.checked?1:0;
    });

    // 扣项开关事件
    layui.form.on('switch(subitem)', function(data){
        vm.flowData.feeItemsConfigList.find(item=>item.feeType==2).wagesFeeItemsInfo[data.elem.name].isOpen = data.elem.checked?1:0;
    });

    // 车辆使用费开关事件
    layui.form.on('switch(usefee)', function(data){
        vm.flowData.feeItemsConfigList.find(item=>item.feeType==4).isOpen = data.elem.checked?1:0;
    });
    // 工资生成参数设置
    layui.form.on('select(autogenerate)', function (data) {
        console.log('data', data)
        vm.flowData.feeItemsConfigList.find(item=>item.feeType==5).wagesFeeItemsInfo[0].feeValue = data.value;
    });

    layui.form.render();
    // // 更新供应商列表
    // vm.selectSupList();
    // 更新查询账号列表
    vm.selectAccountList();
});
// 供应商多选事件
var xmSelectOnFunction = function (data){
    //arr:  当前多选已选中的数据
    var workOrderAccountList = data.arr;
    vm.controlCenter.workOrderAccountIdList = [];
    for (var i in workOrderAccountList){
        vm.controlCenter.workOrderAccountIdList.push(workOrderAccountList[i].id);
    }
}
layui.form.on('select(gpsSelect)', function (data) {
    let index=data.elem.id;
    vm.controlCenter.gpsAccountList[index].platform=data.value
});

var vm = new Vue({
    el:'#rrapp',
    data: {
        id:null,
        // 租户系统参数配置key，直接写死
        paramKey: "controler_center",
        controlCenter: {
            // 日租订单财务审核配置
            dailyOrderApproval: 1,
            // 自动查询违章 是否开启(1是0否)
            autoQueryIllegalEnable: 0,
            // 自动查询违章每隔x天查询
            autoQueryIllegalDay: 1,
            // 自动查询违章，查询车辆 0全部，1退车，2换车，3用车
            autoQueryVehicleConfig: [],
            // 查询车辆新属性：0全部，1部分
            autoQueryVehicleConfigNew: 0,
            // 车辆违章预警 是否开启(1是0否)
            illegalConditionEnable: 1,
            // 车辆违章预警条件：1满足全部，2满足其一
            illegalConditionConfig: 1,
            // 每个条件值
            /*
            {
                key 下拉框配套值
                value": 预警值
                unit": 下拉框配套单位
                enable 是否开启该条件
                tabValue: 车辆违章业务查询tab筛选条件
                tabEnable: 车辆违章业务查询tab是否开启
            }
             */
            illegalConditionList: [{
                    "key": 1,
                    "value":0,
                    "label":"车辆未处理违章次数达",
                    "unit": "次",
                    "enable": 0,
                    "tabTile":"违章",
                    "tabValue": 0,
                    "tabEnable": 0
                },
                {
                    "key": 2,
                    "value":0,
                    "label":"车辆未处理违章罚款达",
                    "unit": "元",
                    "enable": 0,
                    "tabTile":"罚款",
                    "tabValue": 0,
                    "tabEnable": 0
                },
                {
                    "key": 3,
                    "value":0,
                    "label":"车辆未处理违章分数达",
                    "unit": "分",
                    "enable": 0,
                    "tabTile":"分数",
                    "tabValue": 0,
                    "tabEnable": 0
                }],
            // 供应商
            deptIdList:[],
            // 不分查询车辆
            workOrderAccountIdList:[],
            // 短信模板
            alarmSmsTemplate:null,
            // 声音提醒
            voiceReminderFlag:1,
            // 设备到期
            deviceExpirationTime:null, 
            // sim到期
            simExpirationTime:null,
            gpsAccountList:[{
                account:null,
                password:null,
                platform:null,
            }]
        },
        gpsTypeList:[
            {name:"标越",
            value:1},
            {name:"沃达孚",
                value:2},
            {name:"几米",
                value:3},
            {name:"大有",
                value:4},
            {name:"51",
                value:5}
        ],
        withholdId:null,
        withholdParamKey: "withhold_center",
        withholdCenter: {
            autoPayModeEnable: 0,
            graceDays:null,
            lateRatio:null,
        },
        illegalConditionConfigDict:[
            {
                "key": 1,
                "label": "满足所有条件"
            },{
                "key": 2,
                "label": "满足任一条件"
            },
        ],
        autoQueryVehicleConfigDict:[
            {
                "key": 0,
                "label": "全部"
            },
            {
                "key": 1,
                "label": "退车"
            },{
                "key": 2,
                "label": "换车"
            },{
                "key": 3,
                "label": "用车"
            },
        ],
        purchasesupplierList:[],
        // 查询账号
        workOrderAccountList:[],
        flowData:{
            "feeItemsConfigList": [
                {
                    "id": null,
                    "feeType": 1,
                    "feeItemName": null,
                    "isOpen": null,
                    "wagesFeeItemsInfo": []
                },
                {
                    "id": null,
                    "feeType": 2,
                    "feeItemName": null,
                    "isOpen": null,
                    "wagesFeeItemsInfo": []
                },
                {
                    "id": null,
                    "feeType": 3,
                    "feeItemName": null,
                    "isOpen": null,
                    "wagesFeeItemsInfo": [
                        {
                            "id": null,
                            "feeItemName": "月度跑车达标金额",
                            "feeValue": '',
                            "isOpen": null
                        }
                    ]
                },
                {
                    "id": null,
                    "feeType": 4,
                    "feeItemName": null,
                    "isOpen": null,
                    "wagesFeeItemsInfo": [
                        {
                            "id": null,
                            "feeItemName": "达标车辆使用",
                            "feeValue": "",
                            "isOpen": null
                        },
                        {
                            "id": null,
                            "feeItemName": "未达标车辆使用",
                            "feeValue": "",
                            "isOpen": null
                        }
                    ]
                },
                {
                    "id": null,
                    "feeType": 5,
                    "feeItemName": null,
                    "isOpen": null,
                    "wagesFeeItemsInfo": [
                        {
                            "id": null,
                            "feeItemName": "工资生成时间设置",
                            "feeValue": "",
                            "isOpen": null
                        }
                    ]
                }
            ]
        },
        autogeneratelist:function () {
            const list=[]
            for (let i = 1; i < 32; i++) {
                list.push(i)
            }
            return list
        }(),
    },
    created: function () {
        var vueApp = this;
        // 回显数据
        $.get(baseURL + "/sys/tConfig/"+this.paramKey, function (r) {
            if(!r || !r.data){
                return false;
            }
            var controlCenter = r.data;
         
            vueApp.id = controlCenter.id;
            // 会覆盖原参数
            console.log(vm.controlCenter,'1')
            $.extend( vueApp.controlCenter,JSON.parse(controlCenter.paramValue));
            // vueApp.controlCenter = JSON.parse(controlCenter.paramValue);
            console.log(vm.controlCenter,'2')
            // 复选框回显
            var autoQueryVehicleConfig = vueApp.controlCenter.autoQueryVehicleConfig;
            $("[name=autoQueryVehicleConfig]").each((index, value)=>{
                if (autoQueryVehicleConfig.indexOf(value.value) != -1) {
                    $(value).next().click();
                }
            });
        });
        this.getWithholdConfig()
        this.getFlowData()
    },
    updated: function () {
        layui.form.render();
    },
    methods: {


        saveOrUpdate: function (event) {
            var url = vm.id == null ? "sys/tConfig/save" : "sys/tConfig/update";
            vm.gpsVerify(vm.controlCenter.gpsAccountList,function(){
                 // 发送的数据
                var body = {
                    "id": vm.id,
                    "paramKey": vm.paramKey,
                    "paramValue": JSON.stringify({...vm.controlCenter}),
                    "remark": "商户配置中心所有"
                }
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(body),
                    success: function(r){
                        if(r.code === 0){
                            vm.saveWithholdData();
                            vm.saveFlowData();
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            })
        },
        isNulArr(data){
            // 遍历数组
            let obj = []
            data.forEach(item=> {
                // 遍历数组元素中的类
                for(let key in item){
                    // 排除原型继承的属性
                    if(!item.hasOwnProperty(key)) return; 
                    // 将null进行赋值操作
                    if(item[key] == null){
                        obj.push(key);
                    }
                }
            });
            return obj;
        },
        gpsVerify(data,callback){
            if(data&&data.length){
                let nullArr = vm.isNulArr(data);
                if(nullArr.includes('account')){
                    layer.msg(`GPS账号设置:查询账号不能为空`, {icon: 5});
                    return false;
                }
                if(nullArr.includes('password')){
                    layer.msg(`GPS账号设置:查询密码不能为空`, {icon: 5});
                    return false;
                }
                if(nullArr.includes('platform')){
                    layer.msg(`GPS账号设置:所属平台不能为空`, {icon: 5});
                    return false;
                }
                callback(data)
            }else{
                alert("GPS账号设置不能为空")
            }
            
            
        },
        saveWithholdData:function () {
            var url = vm.withholdId == null ? "sys/tConfig/save" : "sys/tConfig/update";
            var body = {
                "id": vm.withholdId,
                "paramKey": vm.withholdParamKey,
                "paramValue": JSON.stringify({...vm.withholdCenter}),
                "remark": "代扣相关配置"
            }
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(body),
                success: function(r){
                    if(r.code === 0){
                        vm.getWithholdConfig()
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        saveFlowData:function () {
            $.ajax({
                type: "POST",
                url: baseURL + 'wages/fee/items/saveOrUpdateConfig',
                contentType: "application/json",
                data: JSON.stringify(vm.flowData),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功');
                        vm.getFlowData();
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        getWithholdConfig:function () {
            let vueApp = this;
            //代扣相关配置查询
            $.get(baseURL + "/sys/tConfig/"+this.withholdParamKey, function (r) {
                if(!r || !r.data){
                    return false;
                }
                var withholdCenter = r.data;
                vueApp.withholdId = withholdCenter.id;
                // 会覆盖原参数
                console.log(vm.withholdCenter,'dddkkk1')
                $.extend( vueApp.withholdCenter,JSON.parse(withholdCenter.paramValue));
                console.log(vm.withholdCenter,'json-dk')
                // 复选框回显
                var autoPayModeEnable = vueApp.withholdCenter.autoPayModeEnable;
                $("[name=autoPayModeEnable]").each((index, value)=>{
                    if (autoPayModeEnable.indexOf(value.value) != -1) {
                        $(value).next().click();
                    }
                });
            });
        },
        getFlowData:function () {
            let vueApp = this;
            // 回显司机流水数据
            $.get(baseURL + "/wages/fee/items/info", function (r) {
                if(!r || !r.data){
                    return false;
                }
                if(r.data && r.data.feeItemsConfigList){
                    vueApp.flowData.feeItemsConfigList = vueApp.flowData.feeItemsConfigList.map(item=>{
                        if(item.feeType==1&&r.data.feeItemsConfigList.find(item=>item.feeType==1)){
                            item = r.data.feeItemsConfigList.find(item=>item.feeType==1)
                        }else if(item.feeType==2&&r.data.feeItemsConfigList.find(item=>item.feeType==2)){
                            item = r.data.feeItemsConfigList.find(item=>item.feeType==2)
                        }else if(item.feeType==3&&r.data.feeItemsConfigList.find(item=>item.feeType==3)){
                            item = r.data.feeItemsConfigList.find(item=>item.feeType==3)
                        }else if(item.feeType==4&&r.data.feeItemsConfigList.find(item=>item.feeType==4)){
                            item = r.data.feeItemsConfigList.find(item=>item.feeType==4)
                        }else if(item.feeType==5&&r.data.feeItemsConfigList.find(item=>item.feeType==5)){
                            item = r.data.feeItemsConfigList.find(item=>item.feeType==5)
                        }

                        return item
                    })

                    console.log('处理后的数据', vueApp.flowData)
                }

            });
        },
        // 更新账号列表
        selectAccountList: function (){
            // 账号列表
            var url = `${baseURL}/car/workOrderAccount/list?page=1&limit=99999&enableFlag=1&tenantId=${hanlderTenantId(localStorage.getItem("tenantId"))}`;
            $.get(url, function (r) {
                vm.workOrderAccountList = r.data;
                // 回显数据
                let workOrderAccountIdList = vm.controlCenter.workOrderAccountIdList || [];
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
                            workOrderAccountDeptList[0].deptName!=undefined){
                            vm.workOrderAccountList[i]['account'] += `(${workOrderAccountDeptList[0].deptName})`;
                        }
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
                let deptIdList = vm.controlCenter.deptIdList;
                if(deptIdList && deptIdList.length>0 && vm.purchasesupplierList.length>0){
                    let deptIdList = vm.controlCenter.deptIdList;
                    for (let i = 0; i < vm.purchasesupplierList.length; i++) {
                        vm.purchasesupplierList[i]['selected'] = deptIdList.indexOf(vm.purchasesupplierList[i].purchaseSupplierId)!=-1
                    }
                }
                vm.selectSupListObj = xmSelect.render({
                    el: '#purchaseSupplierId',
                    language: 'zn',
                    prop: {
                        name: 'account',
                        value: 'id',
                    },
                    data: r.data,
                    // 供应商多选事件
                    on: xmSelectOnFunction
                });
            });
        },

        //新增矫正项目
        add:function (){
            var param = {
                callback: function(schemeType){
                }
            };
            var index = layer.open({
                type: 2,
                title: '新增矫正项目',
                area: ['600px', '300px'],
                boxParams: param,
                content: tabBaseURL + 'modules/merchant/addcorrect.html',
                end: function () {
                    layer.close(index);
                    vm.getFlowData()
                }
            });
        },
        //行政区域电子围栏设置Reload
        areaReload: function () {
            layui.table.reload('areaGrid', {
                page: {
                    curr: 1
                }
            });
        },
        //行政区域电子围栏设置删除
        areaDel:function(ids){
            confirm('确定要删除此行政区域电子围栏吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/vehiclemonitor/electronicFence/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function () {
                                vm.areaReload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        //关键字电子围栏设置Reload
        keysReload: function () {
            layui.table.reload('wordkeysGrid', {
                page: {
                    curr: 1
                }
            });
        },
        //关键字电子围栏设置删除
        keysDel:function(ids){
            confirm('确定要删除此关键字电子围栏吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/vehiclemonitor/electronicFence/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function () {
                                vm.keysReload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        //人员配置删除
        staffingDel:function(ids){
            confirm('确定要删除此人员配置数据吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "configCenter/alarmNoticePerson/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function () {
                                vm.staffingReload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        //人员配置Reload
        staffingReload: function () {
            layui.table.reload('staffingGrid');
        },
         //人员配置更新状态
        staffingUpdate:function(data){  
            layer.confirm('确定要更新此人员配置数据状态吗？', {
                btn: ['确定', '取消'] 
              }, function(index, layero){
                $.ajax({
                    type: "POST",
                    url: baseURL + "configCenter/alarmNoticePerson/updateStatus",
                    contentType: "application/json",
                    data: JSON.stringify({id:data.id,enableFlag:data.enableflag==1?0:1}),
                    success: function (r) {
                        if (r.code == 0) {
                            vm.staffingReload();
                            layer.close(index)
                        } else {
                            alert(r.msg);
                        }
                    }
                });
              }, function(index){
                vm.staffingReload();
                layer.close(index)
              });
        },
        setUser:function(){
            var index = layer.open({
                type: 2,
                title: '新设人员',
                content: tabBaseURL + 'modules/merchant/addUser.html',
                end: function () {
                    layer.close(index);
                    vm.staffingReload()
                }
            });
            layer.full(index);
        },
        // 新增GPS
        addGpsBtn(index){
            if(!vm.controlCenter.gpsAccountList[index].account){
                layer.msg(`GPS账号设置:查询账号不能为空`, {icon: 5});
                return false;
            }
            if(!vm.controlCenter.gpsAccountList[index].password){
                layer.msg(`GPS账号设置:查询密码不能为空`, {icon: 5});
                return false;
            }
            if(!vm.controlCenter.gpsAccountList[index].platform){
                layer.msg(`GPS账号设置:所属平台不能为空`, {icon: 5});
                return false;
            }
            vm.controlCenter.gpsAccountList.splice(index+1, 0, {
                account:null,
                password:null,
                platform:null,
            });
        },
        // 删除GPS
        delGpsBtn(index){
            layer.confirm('确定要删除此数据吗？', {
                btn: ['确定', '取消'] 
              }, function(i, layero){
                vm.controlCenter.gpsAccountList.splice(index, 1)
                layer.close(i)
              }, function(i){
                layer.close(i)
              });
        }
    }
});