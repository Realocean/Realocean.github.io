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
                }else if(value.length>32){
                    return "保险公司名不能超过5个字符";
                }
            },

            insuranceType: function(){
                var type=vm.tSysInsuranceCompany.type;
                if(type==""|| type==null){
                    return '保险类型不能为空';
                }
            },

            phoneStr:function(){
                var phoneStr = vm.tSysInsuranceCompany.phone;
                var reg = /^\d+$/;
                /*if(phoneStr.length > 11){
                    return '联系电话输入位数有误！';
                }*/

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
            vm.tSysInsuranceCompany.provinceId = data.value;
            vm.cityId=[];
            vm.areaId=[];
            layui.form.render();
        }else{
            vm.tSysInsuranceCompany.provinceId = data.value;
            vm.cityId = vm.provinceId.filter(function(s){return s.code===data.value})[0].cityList;
            vm.areaId=[];
            layui.form.render();
        }

    }),

    //点击下拉列表-市-事件监听
    layui.form.on('select(cityId)',function (data) {
        if(data.value=="" ||data.value==null){
            vm.tSysInsuranceCompany = Object.assign({}, vm.tSysInsuranceCompany, {cityId: data.value});
            vm.areaId=[];
            layui.form.render();
        }else{
            vm.tSysInsuranceCompany = Object.assign({}, vm.tSysInsuranceCompany, {cityId: data.value});
            vm.areaId = vm.cityId.filter(function(s){return s.code===data.value})[0].areaList;
            layui.form.render();
        }
    }),
    //点击下拉列表-区-事件监听
    layui.form.on('select(areaId)',function (data) {
        vm.tSysInsuranceCompany = Object.assign({}, vm.tSysInsuranceCompany, {areaId: data.value});
    })

    //监听复选框操作
    layui.form.on('checkbox(insuranceType)',function (data) {
        var array = vm.tSysInsuranceCompany.type;
        var index = array.indexOf(data.value);
        if (index > -1) {
            array.splice(index, 1);
            vm.tSysInsuranceCompany.type = array;
        } else {
            vm.tSysInsuranceCompany.type.push(data.value);
        }

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
        tSysInsuranceCompany: {},
        insuranceTypes:[]

    },
    created: function(){
        // 保险公司类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insuranceCompanyType",
            contentType: "application/json",
            data:null,
            success: function(r){
                //险种集合
                vm.insuranceTypes = r.dict;
            }
        });

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
    computed:{
        insuranceType:{   //保险类型复选框数据格式处理
            get:function() {
                return (typeof this.tSysInsuranceCompany.type=='string')?this.tSysInsuranceCompany.type.split(","):this.tSysInsuranceCompany.type;
            }
        },
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        //保存修改方法
        saveOrUpdate: function (event) {
           /* var isPhone = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
            var isMob = /(^\d{11}$)|(^\d{13}$)/g;
            if(isPhone.test(vm.tSysInsuranceCompany.phone) || isMob.test(vm.tSysInsuranceCompany.phone)){
                console.log("联系电话填写正确!");
            } else {
                alert('联系电话格式有误');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }*/
            var url = vm.tSysInsuranceCompany.id == null ? "system/tsysinsurancecompany/save" : "system/tsysinsurancecompany/update";

            var newProvArr = vm.provinceId.filter(num => num.code == vm.tSysInsuranceCompany.provinceId)
            if(newProvArr.length == 0 ){
                vm.tSysInsuranceCompany.provinceId = null;
                vm.tSysInsuranceCompany.provinceName = null;
            }else {
                vm.tSysInsuranceCompany.provinceName = newProvArr[0].name;
            }

            var newCityArr = vm.cityId.filter(num => num.code == vm.tSysInsuranceCompany.cityId)
            if(newCityArr.length == 0 ){
                vm.tSysInsuranceCompany.cityId = null;
                vm.tSysInsuranceCompany.cityName = null;
            }else {
                vm.tSysInsuranceCompany.cityName = newCityArr[0].name;
            }

            var newAreaArr = vm.areaId.filter(num => num.code == vm.tSysInsuranceCompany.areaId)
            if(newAreaArr.length == 0 ){
                vm.tSysInsuranceCompany.areaId = null;
                vm.tSysInsuranceCompany.areaName = null;
            }else {
                vm.tSysInsuranceCompany.areaName = newAreaArr[0].name;
            }


            //保存时处理复选框数据
            if(vm.tSysInsuranceCompany.type==undefined) {
                vm.tSysInsuranceCompany.type=[];
            }
            vm.tSysInsuranceCompany.type = vm.tSysInsuranceCompany.type.join(",");

            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tSysInsuranceCompany),
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
                url: baseURL + "system/tsysinsurancecompany/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        try {
                            vm.cityId = vm.provinceId.filter(function(s){return s.code===r.tSysInsuranceCompany.provinceId})[0].cityList;
                        }catch (e) {

                        }
                        try {
                            vm.areaId = vm.cityId.filter(function(s){return s.code===r.tSysInsuranceCompany.cityId})[0].areaList;
                        }catch (e) {

                        }

                        vm.tSysInsuranceCompany = r.tSysInsuranceCompany;
                        //给保险类型复选框对应对象赋值
                        vm.tSysInsuranceCompany.type=typeof r.tSysInsuranceCompany.type=="string"?r.tSysInsuranceCompany.type.split(","):[];
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

    }
})
