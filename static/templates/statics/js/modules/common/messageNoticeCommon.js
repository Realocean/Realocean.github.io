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
        messageNotice:{},
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
            console.log($('input[name="number"]').val());
            var number = $('input[name="number"]').val();
            vm.messageNotice.msgTypeStr = number;
            var url = "businessMsgNotice/noticeSend" ;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.messageNotice),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            parent.layer.closeAll();
                            parent.vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
    }
});



