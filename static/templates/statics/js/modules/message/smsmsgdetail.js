$(function () {
    vm.detail(window.localStorage.getItem("id"));

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        detailForm:true,
        messageVo:{},
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
                type: "GET",
                url: baseURL + "message/smsDetail/" +id,
                contentType: "application/json",
                success: function(r){
                    if(r.code === 0){
                        vm.messageVo = r.data;
                        console.log("查询详情:{}",vm.messageVo);
                    }else{
                        alert(r.msg);
                    }
                }
            });
        }


    }
});




