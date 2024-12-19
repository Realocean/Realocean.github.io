$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });

    layui.form.on('radio(transferType)', function (data) {
        vm.transferType = data.value;
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        transferType:0
},
created: function(){
    //跳转类型赋值不同的callback
    var params
    if(parent.layui.larryElem === undefined){
        var _this = this;
        params = parent.layer.boxParams.boxParams;
    }else {
        params = parent.layui.larryElem.boxParams;
    }
    callback = params.callback;
},
updated: function(){
    layui.form.render();
},
methods: {
    closePage:function () {
        closePage();
    },
    selected:function () {
        callback(vm.transferType);
        closePage();
    }
}
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
