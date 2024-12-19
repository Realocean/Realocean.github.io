$(function () {
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form', 'layedit', 'laydate','cascader','jquery'], function () {
        layui.form.render();
    });
    layui.form.on('radio(check)', function(data){
        vm.check = data.value;
        if(data.value==='0'){
            vm.areaAdd.exitAlarmWaitTime = null;
        }else{
            vm.areaAdd.entryAlarmTime = null;
        }
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        check:0,
        electricType:null,
        areaAdd:{
            administrativeAreaNameList:null,
            administrativeAreaCodeList:null,
            entryAlarmEnable:null,
            exitAlarmEnable:null,
            entryAlarmTime:null,
            exitAlarmWaitTime:null,
        },
        areaList:[]
    },
    created: function () {
        
    },
    mounted: function(){
        var _this = this;
        _this.areaList = getPcaCode()
        var param = parent.layer.boxParams.boxParams;
        _this.electricType = param.electricType;
        if(param.data){
            _this.check = param.data.entryAlarmEnable==1?0:1;
            _this.areaAdd = param.data;
            _this.initLayCascader(param.data.administrativeAreaCodeList)
        }else{
            _this.initLayCascader([])
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        initLayCascader(value){
            let _this = this;
            var layCascader = layui.layCascader;
            let layCascaderDom = layCascader({
                elem: '#area',
                clearable: true,
                value:value,
                options: _this.areaList,
                props: {
                    strictMode:true,
                    value:'value',
                    label:'label',
                    children:'children',
                    checkStrictly: true
                }
            });
            layCascaderDom.changeEvent(function (values,Nodes) {
                if(Nodes){
                    vm.areaAdd.administrativeAreaCodeList = Nodes.path.map(item=>item.data.value)
                    vm.areaAdd.administrativeAreaNameList = Nodes.path.map(item=>item.data.label)
                }
            });
            layCascaderDom.setValue(value)
        },
        closePage:function () {
            closePage();
        },
        save:function () {
            if (vm.areaAdd.administrativeAreaCodeList == null || vm.areaAdd.administrativeAreaNameList == null){
                alert('请选择区域名称');
                return;
            }
            if (vm.check == null){
                alert('请选择预警设置');
                return;
            }
            // if (vm.check == '0'&&(vm.areaAdd.entryAlarmTime==null||vm.areaAdd.entryAlarmTime=='')){
            //     alert('请输入驶入时间');
            //     return;
            // }
            // if (vm.check == '1'&&(vm.areaAdd.exitAlarmWaitTime==null||vm.areaAdd.exitAlarmWaitTime=='')){
            //     alert('请输入驶出时间');
            //     return;
            // }
            let params = Object.assign(
                vm.areaAdd,{
                    entryAlarmEnable:vm.check=='0'?'1':'0',
                    exitAlarmEnable:vm.check=='1'?'1':'0',
                    electricType:vm.electricType
                })
            if(vm.areaAdd.id){
                $.ajax({
                    type: "POST",
                    url: baseURL + "vehiclemonitor/electronicFence/update",
                    contentType: "application/json",
                    data:JSON.stringify(params),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                if(vm.electricType==1){
                                    parent.vm.areaReload();
                                }else{
                                    parent.vm.keysReload();
                                }
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
                    url: baseURL + "vehiclemonitor/electronicFence/save",
                    contentType: "application/json",
                    data:JSON.stringify(params),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                if(vm.electricType==1){
                                    parent.vm.areaReload();
                                }else{
                                    parent.vm.keysReload();
                                }
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



