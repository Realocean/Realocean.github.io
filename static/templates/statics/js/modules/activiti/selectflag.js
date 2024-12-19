$(function () {
    var nodeFlag = localStorage.getItem("nodeFlag");
    var nodeLevel = localStorage.getItem("nodeLevel");
    if(nodeFlag!=null&&nodeFlag!=''&&nodeFlag!=undefined){
        vm.approveFlag = nodeFlag;
        if(vm.approveFlag == 1){
            $('#approveLevel').removeAttr("disabled");
        }
        if(vm.approveFlag == 2){
            $('#approveLevel').attr("disabled","disabled");
        }
        if(vm.approveFlag == 3){
            $('#approveLevel').attr("disabled","disabled");
        }
    }
    if(nodeLevel!=null&&nodeLevel!=''&&nodeLevel!=undefined){
        vm.approveType.level = nodeLevel;
    }
    $(".approveFlag").change(function () {
        if(vm.approveFlag == 1){
            $('#approveLevel').removeAttr("disabled");
        }
        if(vm.approveFlag == 2){
            $('#approveLevel').attr("disabled","disabled");
        }
        if(vm.approveFlag == 3){
            $('#approveLevel').attr("disabled","disabled");
        }
    });
    layui.use('form', function() {
        var form = layui.form;
        form.render(); //更新全部
        form.on('select(levelSelect)', function (data) {
            vm.approveType.level = data.value;
        });

        form.on('radio(approveFlagSelect)', function (data) {
            vm.approveFlag = data.value;
            if(data.value == 1){
                $('#approveLevel').removeAttr("disabled");
                vm.approveType.level = 1;
            }
            if(data.value == 2){
                $('#approveLevel').attr("disabled","disabled");
            }
            if(data.value == 3){
                $('#approveLevel').attr("disabled","disabled");
            }
        });
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        approveType:{
            level:1
        },
        approveFlag:1
    },
    updated: function(){
        layui.form.render();
    },
    methods: {

    }
});
