$(function () {
    var vinNo = window.localStorage.getItem("vinNo");
    var carNo = window.localStorage.getItem("carNo");
    var carId = window.localStorage.getItem("carId");
    var insuranceTypeNo = window.localStorage.getItem("insuranceTypeNo");
    var commercialInsuranceName = window.localStorage.getItem("commercialInsuranceName");
    //车架号
    vm.commercialInsurance.vinNo=vinNo;
    //车牌号
    vm.commercialInsurance.carNo=carNo;
    //车辆编号
    vm.commercialInsurance.carId=carId;

    //商业险种名称
    vm.commercialInsurance = Object.assign({}, vm.commercialInsurance, {
        commercialInsuranceName:commercialInsuranceName,
        commercialInsuranceCode:insuranceTypeNo,
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.verify({
                amountInsuredVerify: function (value) {
                    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if(value==''){
                        return '';
                    } else {
                        if(!reg.test(value)){
                            return '金额的输入格式不正确,请确认!';
                        }
                    }
                },
                insuranceExpensesVerify: function (value) {
                    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if(value==''){
                        return '';
                    } else {
                        if(!reg.test(value)){
                            return '金额的输入格式不正确,请确认!';
                        }
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
                parent.vm.commercialInsuranceTableList.push(vm.commercialInsurance);
            }else {
                //修改，现将数组中的元素删除再重新添加
                var randomData=vm.commercialInsurance.randomData;
                var parentData=parent.vm.commercialInsuranceTableList;
                if(parentData.length>0){
                    for (var i = parentData.length - 1; i >= 0; i--) {
                        if (parentData[i].randomData==randomData) {
                            parentData.splice(i, 1);
                        }
                    }
                }
                var  randomData=vm.randomData();
                vm.commercialInsurance.randomData=randomData;
                parent.vm.commercialInsuranceTableList.push(vm.commercialInsurance);
                //parent.vm.reloadCommercialInsurance(parent.vm.commercialInsuranceTableList)
            }
            alert('保存成功', function(index){
                //parent.vm.reloadCommercialInsurance();
                parent.vm.reloadCommercialInsurance(parent.vm.commercialInsuranceTableList)
                parent.layer.closeAll();
            });

        }
    }
});

//编辑时父页面传过来的值
function sendData(data) {
    vm.commercialInsurance=data;
    layui.form.render();
}