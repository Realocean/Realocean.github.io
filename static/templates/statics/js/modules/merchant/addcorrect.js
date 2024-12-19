$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    layui.form.on('radio(feetype)', function(data){
        console.log('选中了', data)
        vm.q.feeType = data.value;
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            feeItemName:null,
            isOpen:1,
            feeType:null,
        }
    },
    created: function(){
        // $.getJSON(baseURL + "sys/dict/getInfoByType/"+"schemeType", function (r) {
        //     vm.schemTypeList = r.dict;
        // })
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){


        });

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
            console.log('提交的数据', vm.q)

            if (vm.q.feeType == null || vm.q.feeType == ''){
                alert('请选择矫正类型');
                return;
            }
            if (vm.q.feeItemName == null || vm.q.feeItemName == ''){
                alert('请输入矫正项目名称');
                return;
            }

            $.ajax({
                type: "POST",
                url: baseURL + "/wages/fee/items/save",
                contentType: "application/json",
                data:JSON.stringify(vm.q),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }

                }
            });

        }
    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



