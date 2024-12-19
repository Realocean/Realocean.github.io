$(function () {
    vm.detail(window.localStorage.getItem("id"));

    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        var upload = layui.upload;
        form.verify({
            companyNameAdd: function(value){
                if(value==""|| value==null){
                    return '保险公司名不能为空';
                }
            },

            phoneStr:function(){
                var phoneStr = vm.tSysFinanceCompany.phone;
                var reg = /^\d+$/;


                if(phoneStr !="" && phoneStr != null ){
                    if(!reg.test(phoneStr)){
                        return '联系电话输入只能为数字！';
                    }
                }
            }
        });
        form.render();
    });


    //点击下拉列表-省-事件监听
    layui.form.on('select(provinceId)',function (data) {
        if(data.value=="" ||data.value==null){
            vm.tSysFinanceCompany.provinceId = data.value;
            vm.cityId=[];
            vm.areaId=[];
            layui.form.render();
        }else{
            vm.tSysFinanceCompany.provinceId = data.value;
            vm.cityId = vm.provinceId.filter(function(s){return s.code===data.value})[0].cityList;
            vm.areaId=[];
            layui.form.render();
        }

    }),

    //点击下拉列表-市-事件监听
    layui.form.on('select(cityId)',function (data) {
        if(data.value=="" ||data.value==null){
            vm.tSysFinanceCompany = Object.assign({}, vm.tSysFinanceCompany, {cityId: data.value});
            vm.areaId=[];
            layui.form.render();
        }else{
            vm.tSysFinanceCompany = Object.assign({}, vm.tSysFinanceCompany, {cityId: data.value});
            vm.areaId = vm.cityId.filter(function(s){return s.code===data.value})[0].areaList;
            layui.form.render();
        }
    }),
    //点击下拉列表-区-事件监听
    layui.form.on('select(areaId)',function (data) {
        vm.tSysFinanceCompany = Object.assign({}, vm.tSysFinanceCompany, {areaId: data.value});
    })


    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        provinceId:[],   //定义省下拉列表数据源
        cityId:[],       //定义市下拉列表数据源
        areaId:[],       //定义区下拉列表数据源
        tSysFinanceCompany: {}

    },
    created: function(){

        var _this = this;
        var cache = localStorage.getItem("globalProvinces");
        if(cache==null) {
            $.getJSON(provinceUrl+"statics/js/province.js",function(r) {
                _this.provinceId = r;
                localStorage.setItem("globalProvinces", JSON.stringify(r));
            });
        } else {
            _this.provinceId = JSON.parse(cache);
        }
    },

    updated: function () {
        layui.form.render();
    },
    methods: {
        //保存修改方法
        saveOrUpdate: function (event) {

            var url = vm.tSysFinanceCompany.id == null ? "system/tsysfinancecompany/save" : "system/tsysfinancecompany/update";

            var newProvArr = vm.provinceId.filter(num => num.code == vm.tSysFinanceCompany.provinceId)
            if(newProvArr.length == 0 ){
                vm.tSysFinanceCompany.provinceId = null;
                vm.tSysFinanceCompany.provinceName = null;
            }else {
                vm.tSysFinanceCompany.provinceName = newProvArr[0].name;
            }

            var newCityArr = vm.cityId.filter(num => num.code == vm.tSysFinanceCompany.cityId)
            if(newCityArr.length == 0 ){
                vm.tSysFinanceCompany.cityId = null;
                vm.tSysFinanceCompany.cityName = null;
            }else {
                vm.tSysFinanceCompany.cityName = newCityArr[0].name;
            }

            var newAreaArr = vm.areaId.filter(num => num.code == vm.tSysFinanceCompany.areaId)
            if(newAreaArr.length == 0 ){
                vm.tSysFinanceCompany.areaId = null;
                vm.tSysFinanceCompany.areaName = null;
            }else {
                vm.tSysFinanceCompany.areaName = newAreaArr[0].name;
            }

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tSysFinanceCompany),
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

        cancel: function(){
            parent.layer.closeAll();
        },

        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "system/tsysfinancecompany/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    console.log("111:" );
                    console.log("ahndasgj:",vm.provinceId);
                    if(r.code === 0){
                        try {
                            vm.cityId = vm.provinceId.filter(function(s){return s.code===r.tSysFinanceCompany.provinceId})[0].cityList;
                        }catch (e) {

                        }
                        try {
                            vm.areaId = vm.cityId.filter(function(s){return s.code===r.tSysFinanceCompany.cityId})[0].areaList;
                        }catch (e) {

                        }

                        vm.tSysFinanceCompany = r.tSysFinanceCompany;

                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

    }
})
