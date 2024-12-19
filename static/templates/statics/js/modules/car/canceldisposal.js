$(function () {
    layui.use(['form'], function () {
        var form = layui.form;
        form.on('submit(save)', function () {
            vm.save();
            return false;
        });
        form.verify({
            depotName:function(value){
                if (value == "" || value == null) {
                    return '车辆撤回仓库不能为空';
                }
            }
        });
        form.render();
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        tCarBasic:{},
        warehouseData:{}
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        selectDepot: function(){
            var index = layer.open({
                title: "仓库/城市名称选择",
                type: 2,
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function(){
                    vm.tCarBasic = Object.assign({}, vm.tCarBasic,{
                        depotId:vm.warehouseData.warehouseId,
                        depotName:vm.warehouseData.warehouseName,
                    });
                }
            });
            layer.full(index);
        },
        save: function(){
            $.ajax({
                type: "POST",
                url: baseURL + 'car/disposal/update',
                contentType: "application/json",
                data: JSON.stringify(vm.tCarBasic),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.initStatusCar();
                            parent.vm.initTableCols();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        cancel: function(){
            parent.layer.closeAll();
        }
    }
});
