$(function () {
    vm.detail(window.localStorage.getItem("purchaseSupplierId"));

    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        var upload = layui.upload;
        form.verify({
            supplierName: function (value) {
                if (value == "" || value == null) {
                    return '供应商名称不能为空';
                }
            },
            contacts:function(value){
                if (value == "" || value == null) {
                    return '请输入联系人';
                }
            },
            phone:function(value){
                if (value == "" || value == null) {
                    return '请输入联系电话';
                }else {
                    // 校验联系电话输入格式
                    var tel = value.trim();
                    var telReg = !!tel.match(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/);
                    var isMob = !!tel.match(/(^\d{11}$)|(^\d{13}$)/g);
                    if(telReg || isMob){
                        console.log("联系电话填写正确!");
                    } else {
                        return '联系电话格式有误';
                    }
                }
            },
        });

        //跟进人
        layui.form.on('select(followusrId)', function (data) {
            vm.purchaseSupplier.followusrId = data.value;
        });

        layui.form.on('radio(enalbe)', function(data){
            vm.purchaseSupplier.enalbe = data.value;
        });

        form.render();
    });

    //点击下拉列表-省-事件监听
    layui.form.on('select(provinceId)',function (data) {

        if(data.value=="" ||data.value==null){
            vm.purchaseSupplier.provinceId = data.value;
            vm.cityId=[];
            vm.areaId=[];
            layui.form.render();
        }else{
            vm.purchaseSupplier.provinceId = data.value;
            vm.cityId = vm.provinceId.filter(function(s){return s.code===data.value})[0].cityList;
            vm.areaId=[];
            layui.form.render();
        }

    }),
        //点击下拉列表-市-事件监听
        layui.form.on('select(cityId)',function (data) {
            if(data.value=="" ||data.value==null){
                vm.purchaseSupplier = Object.assign({}, vm.purchaseSupplier, {cityId: data.value});
                vm.areaId=[];
                layui.form.render();
            }else{
                vm.purchaseSupplier = Object.assign({}, vm.purchaseSupplier, {cityId: data.value});
                vm.areaId = vm.cityId.filter(function(s){return s.code===data.value})[0].areaList;
                layui.form.render();
            }

        }),
        //点击下拉列表-区-事件监听
        layui.form.on('select(areaId)',function (data) {
            vm.purchaseSupplier = Object.assign({}, vm.purchaseSupplier, {areaId: data.value});
        })

    // 附件
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#fjfileTxt',
            url: baseURL + 'file/uploadInsuranceFile',
            data: {'path': 'gysfiles'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.exl,.exlx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|exl|exlx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            done: function (res) {
                if (res.code != '0') {
                    layer.msg('上传失败', {icon: 5});
                    vm.delJqxFile(fileIdTmp);
                    fileIdTmp = null;
                    return false;
                }
                res.data.forEach(function (value) {
                    var extIndex = value.resultFilePath.lastIndexOf('.');
                    var ext = value.resultFilePath.slice(extIndex);
                    var fileNameNotext = value.fileName;
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.fileMaps.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        operationId:sessionStorage.getItem("userId"),
                        operationName:sessionStorage.getItem("username"),
                        nameDesc: '供应商附件',
                        nameAccessory: fileNameNotext,
                        nameFile: fileNameNotext,
                        nameExt: ext,
                        typeFile: fileType,
                        url: value.resultFilePath
                    };
                    vm.fileMaps.push(fileTmp);
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                });
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delFjFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });

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
        purchaseSupplier: {},
        salesmanLst:[],
        fileMaps:[],
        fileLstId: '0'
    },

    created: function(){
        $.ajax({
            type: "POST",
            url: baseURL + "/sys/user/usrLst",
            contentType: "application/json",
            data:null,
            success: function(r){
                vm.salesmanLst= r.usrLst;
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

    },
    updated: function () {
        $('select').removeClass('layui-form-danger');
        layui.form.render();
    },
    methods: {
        // 删除附件
        delFjFile: function (id) {
            for(var i = 0 ;i<vm.fileMaps.length;i++) {
                if(vm.fileMaps[i].id === id) {
                    vm.fileMaps.splice(i,1);
                    return false;
                }
            }
        },
        //保存修改方法
        saveOrUpdate: function (event) {
            vm.purchaseSupplier.fileMaps = vm.fileMaps;
            var url = vm.purchaseSupplier.id == null ? "purchase/purchasesupplier/save" : "purchase/purchasesupplier/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.purchaseSupplier),
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
        //获取供应商数据
        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "purchase/purchasesupplier/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){

                        vm.purchaseSupplier = r.purchaseSupplier;
                        if(vm.purchaseSupplier.fileMaps != null){
                            vm.fileMaps = vm.purchaseSupplier.fileMaps;
                        }

                        if (vm.purchaseSupplier.provinceId != null && vm.purchaseSupplier.provinceId != ''){
                            vm.cityId = vm.provinceId.filter(function(s){return s.code===vm.purchaseSupplier.provinceId})[0].cityList;
                            if (vm.purchaseSupplier.cityId != null && vm.purchaseSupplier.cityId != '') {
                                vm.areaId = vm.cityId.filter(function(s){return s.code===vm.purchaseSupplier.cityId})[0].areaList;
                            }
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        cancel: function(){
            parent.layer.closeAll();
        },
    }
})
