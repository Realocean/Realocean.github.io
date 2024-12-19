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
        clues:{},
        cluesType:null,
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

        saveOrUpdate: function () {
            var postUrl;
            if(vm.clues.cluesType == '0'){
                postUrl = "clues/clues/callConfirm";
            } else if(vm.clues.cluesType == '1'){
                postUrl = "clues/clues/hybmConfirm";
            } else if(vm.clues.cluesType == '2'){
                postUrl = "clues/clues/yysjConfirm";
            } else if(vm.clues.cluesType == '3'){
                postUrl = "clues/clues/hdzxConfirm";
            } else if(vm.clues.cluesType == '4'){
                postUrl = "clues/clues/htjmConfirm";
            }
            $.ajax({
                type: "POST",
                url: baseURL + postUrl,
                contentType: "application/json",
                data: JSON.stringify(vm.clues),
                success: function(r){
                    if(r.code == 0){
                        layer.alert('操作成功', function(index){
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                            parent.vm.initTableCols(vm.clues.cluesType);
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
function sendData(cluesId,type) {
    vm.clues.cluesId = cluesId;
    vm.clues.cluesType = type;
    layui.form.render();
}
