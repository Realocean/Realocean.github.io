$(function () {
    vm.detail(window.localStorage.getItem("id"));
    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        var upload = layui.upload;
        form.verify({

        });
        form.on('select(dealStatusFilter)',function(data){
            vm.supplierPayWarn.dealStatus = data.value;
        })
        form.render();
    });

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
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
        // 修改方法
        saveOrUpdate: function (event) {
            var url =  "supplierPayWarn/supplierpaywarn/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.supplierPayWarn),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
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


