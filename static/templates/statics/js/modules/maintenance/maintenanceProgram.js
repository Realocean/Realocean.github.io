$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        form.render();
    });
    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        dictValue:null,
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        cancel:function(){
            parent.layer.closeAll();
        },
        //保存
        saveOrUpdate: function (event) {
            let _this = this;
            if(_this.dictValue&&_this.dictValue.length){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dict/addDictValue",
                    contentType: "application/json",
                    data: JSON.stringify({businessType:'maintenanceType',dictValue:_this.dictValue}),
                    success: function(r){
                        _this.cancel();
                        parent.getMaintenanceTypeList()
                    }
                });
            }else{
                alert('保养项目不能为空')
            }
           
            
        }
    }
});

//编辑时父页面传过来的值
function sendData(data) {
    vm.commercialInsurance=data;
    layui.form.render();
}