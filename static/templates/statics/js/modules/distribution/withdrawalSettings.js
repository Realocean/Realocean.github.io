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
    layui.form.on('checkbox(supportType)', function (data) {
        if(data.elem.checked){
            vm.supportType.push(data.value);
        }else{
            vm.supportType= vm.supportType.filter(item=>item!==data.value);
        }

    });

    // 标题开关事件
    layui.form.on('switch(withdrawalOnOff)', function(data){
        vm.controlCenter[data.elem.name] = data.elem.checked?1:0;
    });
    // 标题开关事件
    layui.form.on('switch(withdrawalApplyOnOff)', function(data){
        vm.withholdCenter[data.elem.name] = data.elem.checked?1:0;
    });

    layui.form.render();
});

var vm = new Vue({
    el:'#rrapp',
    data: {
        id:null,
        // 租户系统参数配置key，直接写死
        paramKey: "controler_center",
        controlCenter: {
            // 提现设置
            withdrawalSettings: 0,
            // 提现审批
            withdrawalExamine: 0,
            // 最低金额
            minAmount: 0,
            // 最高金额
            maxAmount: 0,
            // 手续费比例
            feeRatio: 0,
            // 支持类型
            supportType:[],

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
        withholdId:null,
        withholdParamKey: "withhold_center",
        withholdCenter: {
            autoPayModeEnable: 0,
            graceDays:null,
            lateRatio:null,
        },
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
        $.get(baseURL + "distribution/withdrawalSet/info", function (r) {
            if(!r || !r.data){
                return false;
            }
            debugger;
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