$(function () {
    vm.detail(window.localStorage.getItem("jqxId"),window.localStorage.getItem("syxId"));
    var policyApplyNo = window.localStorage.getItem("policyApplyNo");
    var compulsoryEndTime = window.localStorage.getItem("compulsoryEndTime");
    var commercialEndTime = window.localStorage.getItem("commercialEndTime");
    console.log("-------",compulsoryEndTime,commercialEndTime);
    vm.reloadSourceTable(policyApplyNo);
    vm.getInsuranceAmountStatus();
    vm.getPayObjectData();
    layui.use('form', function(){
        var form = layui.form;
        form.render(); //更新全部
    });

    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;

        var upload = layui.upload;

        form.verify({
            compulsoryAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(value==''){
                    return '';
                } else {
                    if(!reg.test(value)){
                        return '交强险金额输入格式不正确，请确认!';
                    }
                }
            },

        });

        //交强险保险公司
        form.on('select(compulsoryCompanyId)', function (data) {
            vm.insuranceManage.compulsoryCompanyId = data.value;
        });
        //商业保险公司
        form.on('select(commercialCompanyId)', function (data) {
            vm.insuranceManage.commercialCompanyId = data.value;
        });
        //商业险种
        form.on('select(selectInsuranceTypeNo)', function (data) {
            vm.insuranceManage.insuranceTypeNo = data.value;
        });

        // 交强险付款对象
        form.on('select(compulsoryInsurancePayId)', function (data) {

            vm.insuranceManage.compulsoryInsurancePayId = data.value;
            // 获取名称
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code="+data.value,
                contentType: "application/json",
                data:null,
                success: function(r){
                    if(r.sysDictEntity!=null){
                        vm.insuranceManage.compulsoryInsurancePayName = r.sysDictEntity.value;
                    }else{
                        vm.insuranceManage.compulsoryInsurancePayName = '';
                    }
                }
            });
        });
        // 商业险付款对象
        form.on('select(commercialInsurancePayId)', function (data) {
            vm.insuranceManage.commercialInsurancePayId = data.value;
            // 获取名称
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code="+data.value,
                contentType: "application/json",
                data:null,
                success: function(r){
                    if(r.sysDictEntity!=null){
                        vm.insuranceManage.commercialInsurancePayName = r.sysDictEntity.value;
                    }else{
                        vm.insuranceManage.commercialInsurancePayName = '';
                    }
                }
            });
        });

        form.render();
    });

    // 交强险照片上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#jqxImages',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'jqx_images'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            choose: function (obj) {

                obj.preview(function (index, file, result) {
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.jqxFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '交强险照片',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.jqxFileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.jqxFileList.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delJqxFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delJqxFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });

    //商业险照片上传
    layui.use('upload', function () {
        layui.upload.render({
            elem: '#syxImages',
            url: baseURL + 'file/uploadFile',
            data: {'path': 'syx_images'},
            field: 'files',
            auto: true,
            size: 50 * 1024 * 1024,
            accept: 'file', //普通文件
            acceptMime: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,zip,.rar',
            exts: 'pdf|doc|docx|xls|xlsx|jpg|png|jpeg|zip|rar',
            multiple: true,
            number:20,
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    var fileName = file.name;
                    var extIndex = fileName.lastIndexOf('.');
                    var ext = fileName.slice(extIndex);
                    var fileNameNotext = fileName.slice(0, extIndex);
                    var regExt = /png|jpg|jpeg/;
                    var fileType = regExt.test(ext) ? 1 : 0;
                    fileIdTmp = vm.syxxFileList.length + '_' + uuid(60);
                    var fileTmp = {
                        id: fileIdTmp,
                        nameDesc: '商业险照片',
                        nameAccessory: fileNameNotext,
                        nameFile: fileName,
                        nameExt: ext,
                        typeFile: fileType,
                    };
                    vm.syxxFileList.push(fileTmp);
                });
            },
            done: function (res) {
                if (res.code == '0') {
                    vm.syxxFileList.forEach(function (value) {
                        if (value.id === fileIdTmp) value.url = res.data[0];
                    });
                    vm.fileLstId = 'fileLstId_' + uuid(6);
                } else {
                    layer.msg('上传失败', {icon: 5});
                    vm.delSyxFile(fileIdTmp);
                }
                fileIdTmp = null;
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
                vm.delSyxFile(fileIdTmp);
                fileIdTmp = null;
            }
        });
    });

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //交强险复保时间
        laydate.render({
            elem: '#compulsoryReinsuranceTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryStopDuration = null;
                vm.insuranceManage.compulsoryReinsuranceTime = null;
                if(vm.insuranceManage.compulsoryStopStartTime>value || vm.insuranceManage.compulsoryStopEndTime<value){
                    alert('请选择停保时间范围内时间！');
                    vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', null);
                    return;
                }
                if(compulsoryEndTime != null && compulsoryEndTime != '' && compulsoryEndTime != undefined ){
                    var sourceDate = Date.parse(compulsoryEndTime);
                    var endDate = Date.parse(vm.insuranceManage.compulsoryStopEndTime);
                    var stopStartDate = Date.parse(vm.insuranceManage.compulsoryStopStartTime);
                    var startDate = Date.parse(value);
                    var oldDays = (endDate - stopStartDate)/(24*60*60*1000)+1;
                    var days = (startDate - stopStartDate)/(24*60*60*1000);
                    console.log(oldDays,days);
                    vm.insuranceManage.compulsoryStopDuration = days;

                    var newResumeDate = sourceDate-24*60*60*1000*(oldDays-days);
                    var resumeDate = new Date(newResumeDate).format("yyyy-MM-dd");
                    vm.$set(vm.insuranceManage, 'compulsoryResumeInsuranceEndTime', resumeDate);

                }
                vm.insuranceManage.compulsoryReinsuranceTime = value;
            }
        });

        //商业险复保时间
        laydate.render({
            elem: '#commercialReinsuranceTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialStopDuration = null;
                vm.insuranceManage.commercialReinsuranceTime = null;
                if(vm.insuranceManage.commercialStopStartTime>value || vm.insuranceManage.commercialStopEndTime<value){
                    alert('请选择保险时间范围内日期！');
                    vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', null);
                    return;
                }
                if(commercialEndTime != null && commercialEndTime != '' && commercialEndTime != undefined ){
                    var sourceDate = Date.parse(commercialEndTime);
                    var endDate = Date.parse(vm.insuranceManage.commercialStopEndTime);
                    var stopStartDate = Date.parse(vm.insuranceManage.commercialStopStartTime);
                    var startDate = Date.parse(value);
                    var oldDays = (endDate - stopStartDate)/(24*60*60*1000)+1;
                    var days = (startDate - stopStartDate)/(24*60*60*1000);
                    console.log(oldDays,days);
                    vm.insuranceManage.commercialStopDuration = days;

                    var newResumeDate = sourceDate-24*60*60*1000*(oldDays-days);
                    var resumeDate = new Date(newResumeDate).format("yyyy-MM-dd");
                    vm.$set(vm.insuranceManage, 'commercialResumeInsuranceEndTime', resumeDate);
                }
                vm.insuranceManage.commercialReinsuranceTime = value;
            }
        });

    });


    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });
    layui.table.on('tool(insuranceTypeGrid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            vm.insuranceTypeUpdate(data);
        } else if (layEvent === 'del') {
            vm.insuranceTypeDel(data);
        }
    });

});

var vm = new Vue({
    el: '#rrapp',
    data: {
        //交强险保险公司下拉列表数据源
        compulsoryInsuranceList:[],
        //商业险保险公司下拉列表数据源
        commercialInsuranceList:[],
        // 交强险付款对象数据源
        compulsoryInsurancePay:[],
        // 商业险付款对象数据源
        commercialInsurancePay:[],
        //险种集合
        insuranceTypeList:[],
        //保险单数据源
        insuranceManage:{
        },
        //商业险种列表数据源
        commercialInsuranceTableList:[],
        jqxFileList: [],
        compulsoryFileList:[],
        commercialFileList:[],
        syxxFileList: [],
        fileLstId: '0',
        insuranceTypeGridMS:false,
        jqDivShow:false,
        syDivShow:false

    },
    created: function(){
        //初始化加载保险公司下拉列表
        $.ajax({
            type: "POST",
            url: baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",
            contentType: "application/json",
            data:null,
            success: function(r){
                //交强险
                vm.compulsoryInsuranceList= r.compulsoryInsuranceList;
                //商业险
                vm.commercialInsuranceList= r.commercialInsuranceList;
            }
        });
        //获取险种类型
        $.ajax({
            type: "POST",
            url: baseURL + "sys/dict/getInfoByType/"+"insuranceType",
            contentType: "application/json",
            data:null,
            success: function(r){
                //险种集合
                vm.insuranceTypeList= r.dict;
            }
        });

        // 初始化加载商业险种数据
        var policyApplyNo = window.localStorage.getItem("policyApplyNo");
        $.ajax({
            type: "POST",
            url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",
            dataType:"JSON",
            data:{"policyApplyNo":policyApplyNo},
            success: function(r){
                //商业险
                vm.commercialInsuranceTableList= r.commercialInsuranceTableList;
            }
        });

    },
    computed:{
        brandNameAndModelName:{
            get:function() {
                if(this.insuranceManage.brandName!=null  && this.insuranceManage.modelName !=null){
                    return this.insuranceManage.brandName+"/"+this.insuranceManage.modelName;
                }else if(this.insuranceManage.brandName!=null  && this.insuranceManage.modelName ==null){
                    return this.insuranceManage.brandName
                }else if(this.insuranceManage.brandName==null   && this.insuranceManage.modelName !=null){
                    return this.insuranceManage.modelName
                }else {
                    return "--";
                }
            }

        }
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        delJqxFile: function (id) {
            for(var i = 0 ;i<vm.jqxFileList.length;i++) {
                if(vm.jqxFileList[i].id === id) {
                    vm.jqxFileList.splice(i,1);
                    i= i-1;
                }
            }
        },
        delSyxFile: function (id) {
            for(var i = 0 ;i<vm.syxxFileList.length;i++) {
                if(vm.syxxFileList[i].id === id) {
                    vm.syxxFileList.splice(i,1);
                    i= i-1;
                }
            }
        },

        getPayObjectData(){
            // 获取交强险、商业险付款对象
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",
                contentType: "application/json",
                data:null,
                success: function(r){

                    vm.compulsoryInsurancePay= r.dict;
                    vm.commercialInsurancePay= r.dict;
                }
            });
        },

        //保存修改方法
        saveOrUpdate: function (event) {
            //商业险种记录
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            var url = "maintenance/insurancemanage/resume";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.insuranceManage),
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
        //通过险种编号获取险种名称
        getInsuranceTypeName:function(insuranceTypeNo){
            $.ajax({
                async:false,
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode",
                dataType:"JSON",
                data: {"code":insuranceTypeNo,"type":"insuranceType"},
                success: function(r){
                    if(r.sysDictEntity!=null){
                        var commercialInsuranceName= r.sysDictEntity.value;
                        window.localStorage.setItem("commercialInsuranceName",commercialInsuranceName);
                    }
                }
            });
        },
        //商业险种添加
        addTo:function(){
            var vinNo = vm.insuranceManage.vinNo;
            var carNo = vm.insuranceManage.carNo;
            var carId = $("#carId").val();
            if((carNo==null || carNo=="") && (vinNo==null || vinNo=="")){
                alert("请先选择车牌号或者车架号");
                return;
            }

            var insuranceTypeNo=vm.insuranceManage.insuranceTypeNo;
            if(insuranceTypeNo==null ||insuranceTypeNo==""){
                alert("请先选择商业险种类型");
                return;
            }else {
                //通过险种编号查询险种名称
                vm.getInsuranceTypeName(insuranceTypeNo);
                window.localStorage.setItem("vinNo",vinNo);
                window.localStorage.setItem("carNo",carNo);
                window.localStorage.setItem("carId",carId);
                window.localStorage.setItem("insuranceTypeNo",insuranceTypeNo);

                var index = layer.open({
                    title: "商业险种编辑",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/maintenance/insurancetypeadd.html",
                    end: function(){
                        layer.close(index);
                    }
                });
            }
        },
        //商业险种修改方法
        insuranceTypeUpdate:function(data){
            window.localStorage.setItem("commercialInsurance",data);
            var index = layer.open({
                title: "商业险种编辑",
                type: 2,
                area: ['80%', '60%'],
                content: tabBaseURL + "modules/maintenance/insurancetypeadd.html",
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.sendData(data);
                },
                end: function(){
                    layer.close(index);
                }
            });

        },
        //商业险种删除方法
        insuranceTypeDel:function(data){
            confirm('确定要删除选中的记录？', function(){
                var randomData=data.randomData;
                var parentData=vm.commercialInsuranceTableList;
                for (var i = parentData.length - 1; i >= 0; i--) {
                    if (parentData[i].randomData==randomData) {
                        parentData.splice(i, 1);
                    }
                }
                alert('删除成功', function(index){
                    vm.reloadCommercialInsurance(parentData);
                });
            });
        },
        //加载表格数据--子页面调用
        reloadCommercialInsurance: function (list) {

            // $("#insuranceTypeGrid").css('display','none');
            list = eval(list);
            if(list.length>0){
                var array=new Array()
                for (var i = 0; i <list.length ; i++) {
                    array.push(parseFloat(list[i].insuranceExpenses));
                }
                var commercialAmount = sum(array);
                vm.insuranceManage = Object.assign({}, vm.insuranceManage, {commercialTotalAmount:commercialAmount });
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                    contentType: "application/json",
                    data: null,
                    success: function(r){
                        if(r.code === 0){
                            vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                            if(vm.insuranceManage.insuranceAmountValue == '2'){
                                vm.insuranceManage = Object.assign({}, vm.insuranceManage, {commercialAmount:commercialAmount });
                            }
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            } else {
                var commercialAmount = 0;
                vm.insuranceManage.commercialTotalAmount = commercialAmount;
                vm.insuranceManage.commercialAmount = commercialAmount;
            }

            if(list==null||list.length==0){
                layui.table.reload('insuranceTypeGrid', {
                    data: vm.commercialInsuranceTableList
                });
            }else{
                vm.commercialInsuranceTableList = list;
                layui.table.reload('insuranceTypeGrid', {
                    data: vm.commercialInsuranceTableList
                });
            }
            vm.insuranceTypeGridMS = true;
        },
        //表格数据重新加载方法
        reloadSourceTable: function(policyApplyNo){
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",
                dataType:"JSON",
                data:{"policyApplyNo":policyApplyNo},
                success: function(r){
                    //商业险种
                    vm.commercialInsuranceTableList = r.commercialInsuranceTableList;
                    for(var i=0;i< vm.commercialInsuranceTableList.length;i++){
                        var randomData = Math.random().toString(36).slice(2);
                        vm.commercialInsuranceTableList[i].randomData = randomData;
                    }
                    layui.table.reload('insuranceTypeGrid', {
                        data: vm.commercialInsuranceTableList
                    });
                    vm.insuranceTypeGridMS = true;
                }
            });
        },

        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.tCarBasic,"deptId",treeNode.deptId);
            Vue.set(vm.tCarBasic,"deptName",treeNode.name);
            layer.closeAll();
        },
        query: function () {
            vm.reload();
        },
        cancel: function(){
            parent.layer.closeAll();
        },

        detail: function (jqxId,syxId) {
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/suspensionInfo",
                data: {
                    id:isEmptyReturnNull(jqxId),
                },
                success: function(r){
                    if(r.code === 0){
                        vm.insuranceManage = r.insuranceManage;
                        vm.compulsoryFileList = vm.insuranceManage.compulsoryFileList;
                        vm.commercialFileList = vm.insuranceManage.commercialFileList;
                        if(r.insuranceManage.compulsorySuspension == 1 ){
                            vm.jqDivShow = true;
                        }
                        if(r.insuranceManage.commercialSuspension == 1){
                            vm.syDivShow = true;
                        }


                        Upload({
                            elid: 'jqxmodel',
                            edit: false,
                            fileLst: vm.compulsoryFileList
                        }).initView();

                        Upload({
                            elid: 'syxmodel',
                            edit: false,
                            fileLst: vm.commercialFileList
                        }).initView();

                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 获取商业险费用是否支持手动输入系统参数
        getInsuranceAmountStatus: function () {
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                        if(vm.insuranceManage.insuranceAmountValue == '1'){
                            $("#commercialAmount").removeAttr("readonly");
                        } else{
                            $("#commercialAmount").attr("readonly","readonly");
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

    }
})

//求和计算
function sum(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--) {
        if(isValueNaN(arr[i])){
            arr[i] = 0;
        }
        s += arr[i];
    }
    return s.toFixed(2);
}

function isValueNaN(value) {
    return typeof value === 'number' && isNaN(value);
}
