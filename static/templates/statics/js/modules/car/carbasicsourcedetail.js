$(function () {
    vm.detail(window.localStorage.getItem("id"));
});

var vm = new Vue({
    el:'#rrapp',
    data: {
        detailForm: true,
        carBasicSource: {},
    },
    computed:{

    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 取消
        cancel:function(){
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },
        // 查看详情
        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "financial/carbasicsource/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.carBasicSource = r.carBasicSource;
                        var type = vm.carBasicSource.carSourceType;
                        if(type == 1){
                            $("#zgdiv").show();
                            $("#zldiv").hide();
                            $("#zsdiv").hide();
                        }
                        if(type == 2){
                            $("#zldiv").show();
                            $("#zgdiv").hide();
                            $("#zsdiv").hide();
                        }
                        if(type == 3){
                            $("#zsdiv").show();
                            $("#zgdiv").hide();
                            $("#zldiv").hide();
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },








    }
});



