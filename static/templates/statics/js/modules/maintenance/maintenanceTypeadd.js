$(function () {

    var vinNo = window.localStorage.getItem("vinNo");
    var carNo = window.localStorage.getItem("carNo");
    var carId = window.localStorage.getItem("carId");
    var insuranceTypeNo = window.localStorage.getItem("insuranceTypeNo");
    var maintenanceItemName = window.localStorage.getItem("maintenanceItemName");
    //车架号
    vm.commercialInsurance.vinNo=vinNo;
    //车牌号
    vm.commercialInsurance.carNo=carNo;
    //车辆编号
    vm.commercialInsurance.carId=carId;

    //商业险种名称
    vm.commercialInsurance = Object.assign({}, vm.commercialInsurance, {
        maintenanceItemName:maintenanceItemName,
        maintenanceItemId:insuranceTypeNo,
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.verify({
            amountInsuredVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value == "" || value == null) {
                    return '保养金额不能为空';
                }
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            },

        });
        form.render();
    });
    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        commercialInsurance: {}
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        cancel:function(){
            parent.layer.closeAll();
        },
        //查询
        query: function () {
            vm.reload();
        },
        //生成随机数
        randomData:function(){
            return  Math.random().toString(36).slice(2)
        },
        //保存
        saveOrUpdate: function (event) {
            if(vm.commercialInsurance.randomData==null || vm.commercialInsurance.randomData==""){
                var  randomData=vm.randomData();
                vm.commercialInsurance.randomData=randomData;
                parent.vm.maintenanceProjectList.push(vm.commercialInsurance);
            }else {
                //修改，现将数组中的元素删除再重新添加
                var randomData=vm.commercialInsurance.randomData;
                var parentData=parent.vm.maintenanceProjectList;
                if(parentData.length>0){
                    for (var i = parentData.length - 1; i >= 0; i--) {
                        if (parentData[i].randomData==randomData) {
                            parentData.splice(i, 1);
                        }
                    }
                }
                var  randomData=vm.randomData();
                vm.commercialInsurance.randomData=randomData;
                parent.vm.maintenanceProjectList.push(vm.commercialInsurance);
            }
            alert('保存成功', function(index){
                //parent.vm.reloadCommercialInsurance();
                parent.vm.reloadCommercialInsurance(parent.vm.maintenanceProjectList)
                parent.layer.closeAll();
                // 保养功能 先注释掉
/*                if(parent.vm.maintenanceManage.maintenanceAmount!=undefined&&parent.vm.maintenanceManage.maintenanceAmount!=0){
                    parent.vm.changeStage(parent.vm.maintenanceManage.maintenanceAmount)
                }*/
            });
/*            if(parent.vm.maintenanceManage.maintenanceAmount!=undefined&&parent.vm.maintenanceManage.maintenanceAmount!=0){
                parent.vm.changeStage(parent.vm.maintenanceManage.maintenanceAmount)
            }*/
        }
    }
});

//编辑时父页面传过来的值
function sendData(data) {
    vm.commercialInsurance=data;
    layui.form.render();
}