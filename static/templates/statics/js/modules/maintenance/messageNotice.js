$(function () {
    layui.use(['form', 'laydate'], function () {
        var $ = layui.$//Jquery
            , form = layui.form;//表单
        //页面加载的时候就初始几个值
        initValue();

        //监听复选框
        form.on('checkbox(number)', function (data) {
            var number = $('input[name="number"]'), value = data.value, array = number.val().split(",");
            if (data.elem.checked) {
                number.val(number.val() + value + ",");
            } else {
                var newnumber = "";
                for (var i = 0; i < array.length; i++) {
                    var str = array[i];
                    newnumber += (str != value && str != "" && str != null) ? str + "," : "";
                }
                number.val(newnumber);
            }
        });

        /**
         * input 框初始 赋值 到checkedbox上
         * @author lengff
         */
        function initValue() {
            var param=$("input[name='number']").val(),checkBoxs = $("input[type='checkbox']"), array = param.split(",");
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < checkBoxs.length; j++) {
                    var checkbox = $(checkBoxs[j]);
                    if (checkbox.val() == array[i]) {
                        checkbox.attr('checked','checked');
                        break;
                    }
                }
            }
            form.render('checkbox');
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        insuranceManage:{},
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 取消
        cancel: function(){
            parent.layer.closeAll();
        },

        // 消息通知保存
        noticeSave: function (event) {
            var number = $('input[name="number"]').val();
            vm.insuranceManage.carStatusStr = number;
            console.log(window.localStorage.getItem("carId"));
            vm.insuranceManage.carId = window.localStorage.getItem("carId");
            if( window.localStorage.getItem("carId") == "null"){
                vm.insuranceManage.carId = null;
            }
            var type = window.localStorage.getItem("type");
            vm.insuranceManage.searchWarnType = type;
            var url = "";
            if(type == '1'){
                url = "maintenance/insurancemanage/noticeSave" ;// 保险预警消息通知保存
            } else if(type == '2'){
                url = "maintenancewarn/maintenanceNoticeSave" ;// 保养预警消息通知保存
            } else if(type == '6'){
                url = "vehicleInspectionwarning/inspectionNoticeSave";// 年检预警消息通知保存
            } else if(type == '3'){
                url = "car/carillegal/msgNoticeSave" ;// 违章预警消息通知保存
            } else  if(type == '4'){
                url = "vehiclerentwarn/msgNoticeSave" ;// 租金预警消息通知保存
            }
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.insuranceManage),
                success: function(r){
                    if(r.code === 0){
                        if(r.resultFlag == 1){
                            alert('操作成功:'+r.msg, function(index){
                                parent.layer.closeAll();
                                parent.vm.reload();
                            });
                        } else {
                            alert('操作成功:'+r.msg, function(index){
                                parent.layer.closeAll();
                                parent.vm.reload();
                            });
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
    }
});



