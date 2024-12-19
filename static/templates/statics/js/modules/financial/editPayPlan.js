$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.verify({
            paidAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value==''){
                    return '应还总金额不能为空';
                } else {
                    if(!reg.test(value)){
                        return '应还总金额输入格式不正确(大于0或保留两位小数的正整数)!';
                    }
                }
            },
            playStartDateVerify: function (value) {
                if(value==''){
                    return '请选择开始时间';
                }
            },
            playEndDateVerify: function (value) {
                if(value==''){
                    return '请选择结束时间';
                }
            },
            paidDateVerify: function (value) {
                if(value==''){
                    return '请选择应还日期';
                }
            },
        });

        laydate.render({
            elem: '#playStartDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.sourceOrderPayPlan.playStartDate=value;
            }
        });

        laydate.render({
            elem: '#playEndDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.sourceOrderPayPlan.playEndDate=value;
            }
        });

        laydate.render({
            elem: '#paidDate',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.sourceOrderPayPlan.paidDate=value;
            }
        });

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
        sourceOrderPayPlan: {}
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
            var url = vm.sourceOrderPayPlan.id == null ? "financial/sourceorderpayplan/save" : "financial/sourceorderpayplan/update";
            confirm('确定要编辑该付款计划吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.sourceOrderPayPlan),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                layer.closeAll();
                                var index = parent.layer.getFrameIndex(window.name);
                                parent.layer.close(index);
                                parent.vm.reloadPlanPage(vm.sourceOrderPayPlan.sourceOrderId);
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        }
    }
});

//编辑时父页面传过来的值
function sendData(data) {
    vm.sourceOrderPayPlan = data;
    layui.form.render();
}

