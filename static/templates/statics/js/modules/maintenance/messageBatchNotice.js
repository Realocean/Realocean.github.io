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
            if(number == ""){
                alert("请选择发送通知类型！");
                return false;
            }

            vm.insuranceManage.noticeType = number;
            console.log(window.localStorage.getItem("carIds"));
            vm.insuranceManage.carIds = window.localStorage.getItem("carIds");

            var url = "";
            var type = window.localStorage.getItem("type");
            if(type == "1"){
                url = "maintenance/insurancemanage/batchInsuranceNoticeSend"; // 保险
            } else if(type == "6"){
                url = "vehicleInspectionwarning/batchInspectionNoticeSend"; // 年检
            } else if(type == '2'){
                url = "maintenancewarn/batchMaintenanceNoticeSave" ;// 保养
            } else if(type == '3'){
                url = "car/carillegal/batchCarillegalNoticeSave" ;// 违章
            } else  if(type == '4'){
                url = "vehiclerentwarn/batchRentWarnNoticeSave" ;// 租金
            }

            vm.insuranceManage.businessType = type;

            confirm('确定要批量发送通知吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.insuranceManage),
                    success: function(r){
                        if(r.code === 0){
                            alert('发送成功！', function(index){
                                parent.layer.closeAll();
                                parent.vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
    }
});



