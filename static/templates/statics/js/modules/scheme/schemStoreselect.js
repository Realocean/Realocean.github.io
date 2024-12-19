$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    layui.form.on('radio(schemeStore)', function (data) {
        vm.schemeStore = data.value;
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        //方案类型数据源
        schemeStoreList:[],
        schemeStore:null,
        subSchemeId:null,
    },
    created: function(){
        let _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.subSchemeId = param.subSchemeId;
        $.getJSON(baseURL + "scheme/scheme/getStoreListById/"+_this.subSchemeId, function (r) {
            vm.schemeStoreList = r.storeList;
        })

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
            if (vm.schemeStore == null || vm.schemeStore == ''){
                alert('请选择门店');
                return;
            }
            callback(vm.schemeStore);
            closePage();
        }
    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



