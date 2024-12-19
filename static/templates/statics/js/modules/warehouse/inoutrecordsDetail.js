$(function () {
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        inoutrecordsDetil:{},
    },
    computed:{

    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        initData:function(initData){
            console.log(initData.transferType);
            if(initData.transferType == 0){
                initData.transferTypeStr = "入库";
            }
            if(initData.transferType == 1){
                initData.transferTypeStr = "出库";
            }
            vm.inoutrecordsDetil = initData;
        },

    }
});
