$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    layui.form.on('radio(schemeType)', function (data) {
        vm.q.schemeType = data.value;
    });
    //监听选择司机
    layui.form.on('select(driverName)', function (data) {
        if(data.value){
            const driver = vm.driverList.find(item=>item.id === data.value)

            console.log('选择的司机', driver)

            vm.q.driverName = driver.customerName;
            vm.q.businessLeader = driver.businessLeaderName;
            vm.q.driverId = driver.id;
            vm.q.driverNo = driver.customerNo;
            vm.q.contactNumber = driver.contactMobile;
        }
    });
    //监听选择平台
    layui.form.on('select(platname)', function (data) {
        if(data.value){
            vm.q.platformName = data.value;
        }
    });

    //结算时间
    layui.laydate.render({
        elem: '#settlementDate',
        type: 'date',
        // range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            // $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');

            if(date && date.year){
                vm.q.settlementDate = value;
                // vm.q.settlementStartDate = date.year+'-'+date.month+'-'+date.date;
                // vm.q.settlementEndDate = endDate.year+'-'+endDate.month+'-'+endDate.date;
            }else {
                vm.q.settlementDate = '';
                // vm.q.settlementStartDate = null;
                // vm.q.settlementEndDate = null;
            }

        }

    });

    // layui.use('laydate', function () {
    //     layui.laydate.render({
    //         elem: '#settlementDate',
    //         format: 'yyyy-MM-dd',
    //         trigger: 'click',
    //         done: function (value, date, endDate) {
    //             vm.settlementDate = value;
    //         }
    //     });
    //
    // });

});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        subtips: null,
        driverList:[],
        platList:[],

        q:{
            //方案类型数据源
            // schemTypeList:[],
            schemeType:null,
            driverName:null,
            businessLeader:null,
            driverId:null,
            driverNo:null,
            contactNumber:null,
            carNo:null,
            brandSeriesModel:null,
            platformName:null,
            rewardMoney:null,
            flowMoney:null,
            completionVolume:null,
            onlineDuration:null,
            serviceDuration:null,
            mileage:null,
            settlementMonth:null,
            settlementDate:null,
            remarks:null,
            tenantId:null,

            settlementStartDate:null,
            settlementEndDate:null,
        }

    },
    created: function(){
        // $.getJSON(baseURL + "sys/dict/getInfoByType/"+"schemeType", function (r) {
        //     vm.schemTypeList = r.dict;
        // })
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                // vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: r.carTreeVoList,
                    success: function (valData,labelData) {
                        // if(valData.length>2){
                        //     vm.q.brandId = valData[0];
                        //     vm.q.seriesId = valData[1];
                        //     vm.q.modelId = valData[2];
                        // }else {
                        //     vm.q.brandId = valData[0];
                        //     vm.q.seriesId = valData[1];
                        //     vm.q.modelId =null;
                        // }

                        vm.q.brandSeriesModel = labelData.join('/');

                    }
                });
            });

            $.getJSON(baseURL + "customer/signedDriverList", function (r) {
                vm.driverList = r.data
            });

            $.getJSON(baseURL + "driver/flow/platformList", function (r) {
                vm.platList = r.data

            });


        });

        var param = parent.layer.boxParams.boxParams;
        callback = param.callback;
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
        if(parent.data){
            this.q = parent.data
            console.log('收到了', this.q)
            // this.q.settlementDate = this.q.settlementStartDate+' / '+this.q.settlementEndDate
        }
    },
    methods: {
        closePage:function () {
            closePage();
        },
        mouseout() {
            layer.close(vm.subtips);
            vm.subtips = null;
        },

        move(value) {
            var id = '#LAY_layedit_code' + value;
            var content = "开始时间与结束时间须在同一月份";
            if (!vm.subtips) {
                vm.openMsg(id, content, value);
            }
        },
        openMsg(id, content, value) {
            vm.subtips = layer.tips(content, id, { tips: 1 });
        },
        save:function () {
            console.log('提交的数据', vm.q)


            if (vm.q.driverName == null || vm.q.driverName == ''){
                alert('请选择司机名称');
                return;
            }
            if (vm.q.contactNumber == null || vm.q.contactNumber == ''){
                alert('请输入联系电话');
                return;
            }
            if (vm.q.carNo == null || vm.q.carNo == ''){
                alert('请输入车牌');
                return;
            }
            if (vm.q.platformName == null || vm.q.platformName == ''){
                alert('请输入平台名称');
                return;
            }
            if (vm.q.settlementDate == null || vm.q.settlementDate == ''){
                alert('请选择结算日期');
                return;
            }


            // if(vm.q.settlementStartDate.split('-')[0] != vm.q.settlementEndDate.split('-')[0]
            // || vm.q.settlementStartDate.split('-')[1] != vm.q.settlementEndDate.split('-')[1]){
            //     alert('开始时间与结束时间须在同一月份')
            //     return;
            // }

            console.log('flowMoney', vm.q.flowMoney)
            console.log('flowMoney1', vm.q.flowMoney == null)
            console.log('flowMoney2', vm.q.flowMoney === '')

            if (vm.q.flowMoney == null || vm.q.flowMoney === ''){
                alert('请输入流水');
                return;
            }
            // callback(vm.schemeType);

            if(this.q.id != undefined &&this.q.id != null && this.q.id != ''){
                $.ajax({
                    type: "POST",
                    url: baseURL + "/driver/flow/update",
                    contentType: "application/json",
                    data:JSON.stringify(vm.q),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                closePage();
                            });
                        }else{
                            alert(r.msg);
                        }

                    }
                });
            }else {
                $.ajax({
                    type: "POST",
                    url: baseURL + "/driver/flow/save",
                    contentType: "application/json",
                    data:JSON.stringify(vm.q),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                closePage();
                            });
                        }else{
                            alert(r.msg);
                        }

                    }
                });
            }



        }
    }
});

function closePage() {
    vm.q={
        //方案类型数据源
        // schemTypeList:[],
        schemeType:null,
        driverName:null,
        businessLeader:null,
        driverId:null,
        driverNo:null,
        contactNumber:null,
        carNo:null,
        brandSeriesModel:null,
        platformName:null,
        rewardMoney:null,
        flowMoney:null,
        completionVolume:null,
        onlineDuration:null,
        serviceDuration:null,
        mileage:null,
        settlementMonth:null,
        settlementDate:null,
        remarks:null,
        tenantId:null,

        settlementStartDate:null,
        settlementEndDate:null,
    }
    console.log('关闭了')
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



