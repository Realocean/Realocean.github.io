$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        // init(layui);
        layui.form.render();
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{

    },
    created: function(){

        var param = parent.layer.boxParams.boxParams;
        callback = param.callback;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        callUpload(){
            callback()
        }
    }
});




