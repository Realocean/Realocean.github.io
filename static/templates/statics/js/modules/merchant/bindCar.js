$(function () {
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form', 'layedit', 'laydate','cascader','jquery'], function () {
        let areaList = getPcaCode()
        var layCascader = layui.layCascader;
        let layCascaderDom = layCascader({
            elem: '#area',
            clearable: true,
            options: areaList,
            props: {
                checkStrictly: true
            }
        });
        layCascaderDom.changeEvent(function (values,Nodes) {
            if(Nodes){
                vm.areaAdd.areaCode = Nodes.path.map(item=>item.data.value)
                vm.areaAdd.areaName = Nodes.path.map(item=>item.data.label)
            }
          });
        
        layui.form.render();
    });
    layui.form.on('radio(check)', function(data){
        vm.areaAdd.check = data.value;
        if(data.value==='0'){
            vm.areaAdd.time2 = null;
        }else{
            vm.areaAdd.time1 = null;
        }
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        areaAdd:{
            id:null,
            areaName:null,
            areaCode:null,
            check:null,
            time1:null,
            time2:null,
        },
        areaList:[]
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if(param){
            _this.areaAdd = param
        }
    },
    mounted: function(){
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        closePage:function () {
            closePage();
        },
        save:function () {
            if (vm.areaAdd.areaCode == null || vm.areaAdd.areaName == null){
                alert('请选择区域名称');
                return;
            }
            if (vm.areaAdd.check == null){
                alert('请选择预警设置');
                return;
            }
            // if (vm.areaAdd.check == '0'&&(vm.areaAdd.time1==null||vm.areaAdd.time1.trim()=='')){
            //     alert('请输入驶入时间');
            //     return;
            // }
            // if (vm.areaAdd.check == '1'&&(vm.areaAdd.time2==null||vm.areaAdd.time2.trim()=='')){
            //     alert('请输入驶出时间');
            //     return;
            // }
            if(id){
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
            }else{
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
    }
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}



