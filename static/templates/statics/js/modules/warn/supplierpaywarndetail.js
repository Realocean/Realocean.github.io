$(function () {
    vm.detail(window.localStorage.getItem("id"));
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        //保险单数据源
        supplierPayWarn:{}
    },
    created: function(){
    },
    computed:{
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 取消
        cancel:function(){
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },

        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "supplierPayWarn/supplierpaywarn/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.supplierPayWarn = r.supplierPayWarn;
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
    }
})


