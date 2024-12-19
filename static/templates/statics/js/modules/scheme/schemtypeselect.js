$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    layui.form.on('radio(schemeType)', function (data) {
        vm.schemeType = data.value;
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        //方案类型数据源
        schemTypeList:[],
        schemeType:null,
    },
    created: function(){
        $.getJSON(baseURL + "sys/dict/getInfoByType/"+"schemeType", function (r) {
            vm.schemTypeList = r.dict;
        })

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
            if (vm.schemeType == null || vm.schemeType == ''){
                alert('请选择租赁类型');
                return;
            }
            callback(vm.schemeType);
            closePage();
        }
    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



