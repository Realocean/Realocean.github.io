$(function () {
    vm.detail(window.localStorage.getItem("carId"));
    layui.use(['form', 'laydate'], function () {
        var form = layui.form;//表单
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        tCarBasic:{},

    },
    updated: function(){
        layui.form.render();
    },
    created: function () {
        //vm.tCarBasic.remark = window.localStorage.getItem("remark");
    },
    methods: {
        // 取消
        cancel: function(){
            parent.layer.closeAll();
        },

        // 消息通知保存
        updateCarRemark: function (event) {
            var url = "car/tcarbasic/updateRemark";
            vm.tCarBasic.carId = window.localStorage.getItem("carId");
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tCarBasic),
                success: function(r){
                    if(r.code === 0){
                        alert('修改成功:', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        detail: function(id){
            $.ajax({
                type: "POST",
                url: baseURL + 'car/tcarbasic/info/' + id,
                contentType: "application/json",
                success: function (r) {
                    vm.tCarBasic = r.tCarBasic;
                }
            });
        },
    }
});



