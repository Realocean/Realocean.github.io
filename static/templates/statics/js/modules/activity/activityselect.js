$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    layui.form.on('radio(activityType)', function (data) {
        vm.activityType = data.value;
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        //活动类型数据源
        activityTypeList:[],
        activityType:null,
    },
    created: function(){
        $.getJSON(baseURL + "sys/dict/getInfoByType/"+'activityType', function (r) {
           vm.activityTypeList= r.dict;
        });

        var param = parent.layer.boxParams.boxParams;
        callback = param.callback;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        closePage:function () {
            closePage();
        },
        save:function () {
            if (vm.activityType == null || vm.activityType == ''){
                alert('请选择活动类型');
                return;
            }
            callback(vm.activityType);
            closePage();
        }
    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



