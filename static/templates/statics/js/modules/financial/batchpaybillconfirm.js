$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        upload = layui.upload;

        form.render();
    });

});


var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        payment: {},
        carSourceOrder:{},
        isType:1,
        payIds:[],
        num:0
    },

    computed: {
    },

    updated: function(){
        layui.form.render();
    },
    methods: {
        cancel: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },

        saveOrUpdate: function (type) {
            vm.payment.isType = type;
            var url = "pay/carsourceorder/batchPaybillConfirm";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.payment),
                success: function(r){
                    if(r.code == 0){
                        layer.alert('操作成功', function(index){
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                            parent.vm.reloadPayBillPage(vm.carSourceOrder.id,1);
                            parent.vm.reloadPaidBillPage(vm.carSourceOrder.id,2);
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
    }
});

//编辑时父页面传过来的值
function sendData(payIds,orderData) {
    vm.payIds = payIds;
    if(payIds.length > 0){
        vm.num = payIds.length;
        vm.payment.payIds = payIds;
    }
    vm.carSourceOrder = orderData;
    layui.form.render();
}
