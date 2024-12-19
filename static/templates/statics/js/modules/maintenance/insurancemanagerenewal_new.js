$(function () {
    // vm.detail(window.localStorage.getItem("jqxId"),window.localStorage.getItem("syxId"));
    var policyApplyNo = window.localStorage.getItem("policyApplyNo");

    vm.reloadSourceTable(policyApplyNo);
    vm.getInsuranceAmountStatus();
    vm.getPayObjectData();
    var cols;
    if(vm.viewTag === 'edit' || vm.viewTag === 'reedit'){
        cols = [[
            {title:'操作',templet:'#barTpl',fixed:"left",align:"center"},
            {field:'commercialInsuranceName', title: '商业险种'},
            {field:'amountInsured',title: '保额/万元'},
            {field:'insuranceExpenses', title: '保险费/元'}
        ]];
    }else{
        cols = [[
            {field:'commercialInsuranceName', title: '商业险种'},
            {field:'amountInsured',title: '保额/万元'},
            {field:'insuranceExpenses', title: '保险费/元'}
        ]];
    }
    layui.table.render({
        id: "insuranceTypeGrid",
        elem: '#insuranceTypeGrid',
        minWidth: 150,
        cols: cols,
        page: false,
        loading: false,
        limit: 500,
        done: function(res, curr, count){
            $('div[lay-id="insuranceTypeGrid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
        }
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
            /*compulsoryCompanyIdVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险保险公司不能为空';
                }
            },
            compulsoryNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险保单号不能为空';
                }
            },
            compulsoryStartTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险开始时间不能为空';
                }
            },
            compulsoryEndTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '交强险结束时间不能为空';
                }
            },
            compulsoryAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value == "" || value == null) {
                    return '交强险费用不能为空';
                }
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            },
            commercialCompanyIdVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险保险公司不能为空';
                }
            },
            commercialNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险保单号不能为空';
                }
            },
            commercialStartTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险开始时间不能为空';
                }
            },
            commercialEndTimeVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险结束时间不能为空';
                }
            },
            commercialAmountVerify: function (value) {
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (value == "" || value == null) {
                    return '商业险费用不能为空';
                }
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            },*/

           /* insuranceTypeNoVerify: function (value) {
                if (value == "" || value == null) {
                    return '商业险种不能为空';
                }
            },*/
        });

        //交强险保险公司
        form.on('select(compulsoryCompanyId)', function (data) {
            vm.insuranceManage.compulsoryCompanyId = data.value;
        });
        //承运险保险公司
        form.on('select(carrierCompanyId)', function (data) {
            vm.insuranceManage.carrierCompanyId = data.value;
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
        // 承运险付款对象
        form.on('select(carrierInsurancePayId)', function (data) {
            vm.insuranceManage.carrierInsurancePayId = data.value;
            // 获取名称
            $.ajax({
                type: "POST",
                url: baseURL + "sys/dict/getSysDictInforByTypeAndCode?type=insurancePaymentTarget&code="+data.value,
                contentType: "application/json",
                data:null,
                success: function(r){
                    if(r.sysDictEntity!=null){
                        vm.insuranceManage.carrierInsurancePayName = r.sysDictEntity.value;
                    }else{
                        vm.insuranceManage.carrierInsurancePayName = '';
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
        Upload({
            elid: 'jqxImages',
            edit: true,
            fileLst: vm.jqxFileList,
            param: {'path':'jqx_images'},
            fidedesc: '交强险文件'
        }).initView();

        Upload({
            elid: 'syxImages',
            edit: true,
            fileLst: vm.syxxFileList,
            param: {'path':'syx_images'},
            fidedesc: '商业险文件'
        }).initView();

        Upload({
            elid: 'cyxImages',
            edit: true,
            fileLst: vm.cyxxFileList,
            param: {'path':'cyx_images'},
            fidedesc: '承运险文件'
        }).initView();

        approveUplod = Upload({
            elid: 'addFile2',
            edit: true,
            fileLst: vm.fileLst2,
            param: {'path':'processApprove'},
            fidedesc: '审批附件'
        });
        approveUplod.initView();
        BpmChart({instanceId: vm.instanceId}).initView();
        form.render();
    });

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //交强险开始结束时间
        var compulsoryStartTime =laydate.render({
            elem: '#compulsoryStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryStTime = value;
                vm.insuranceManage.compulsoryStartTime = vm.insuranceManage.compulsoryStTime;
                var month = date.month -1;
                compulsoryEndTime.config.min = date;
                compulsoryEndTime.config.min.month = month;
            }
        });
        //交强险结束时间
        var compulsoryEndTime = laydate.render({
            elem: '#compulsoryEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.compulsoryEnTime = value;
                vm.insuranceManage.compulsoryEndTime = vm.insuranceManage.compulsoryEnTime;
                var month = date.month -1;
                compulsoryStartTime.config.max = date;
                compulsoryStartTime.config.max.month = month;
            }
        });
        //承运险开始结束时间
        var carrierStartTime =laydate.render({
            elem: '#carrierStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.carrierStTime = value;
                vm.insuranceManage.carrierStartTime = vm.insuranceManage.carrierStTime;
                var month = date.month -1;
                carrierEndTime.config.min = date;
                carrierEndTime.config.min.month = month;
            }
        });
        //承运险结束时间
        var carrierEndTime = laydate.render({
            elem: '#carrierEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.carrierEnTime = value;
                vm.insuranceManage.carrierEndTime = vm.insuranceManage.carrierEnTime;
                var month = date.month -1;
                carrierStartTime.config.max = date;
                carrierStartTime.config.max.month = month;
            }
        });
        //商业险开始时间
        var commercialStartTime = laydate.render({
            elem: '#commercialStartTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialStTime = value;
                vm.insuranceManage.commercialStartTime = vm.insuranceManage.commercialStTime;
                var month = date.month -1;
                commercialEndTime.config.min = date;
                commercialEndTime.config.min.month = month;
            }
        });

        //商业险结束时间
        var commercialEndTime = laydate.render({
            elem: '#commercialEndTime',
            trigger: 'click',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialEnTime = value;
                vm.insuranceManage.commercialEndTime = vm.insuranceManage.commercialEnTime;
                var month = date.month -1;
                commercialStartTime.config.max = date;
                commercialStartTime.config.max.month = month;
            }
        });
        /*laydate.render({
            elem: '#commercialEndTime',
            done: function (value, date, endDate) {
                vm.insuranceManage.commercialEnTime = value;
            }
        });*/
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

var approveUplod;
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
        insuranceManage:{},
        //商业险种列表数据源
        commercialInsuranceTableList:[],
        jqxFileList: [],
        syxxFileList: [],
        cyxxFileList: [],
        fileLstId: '0',
        boxShow: false,
        boxInputShow: false,
        fileLst2:[],
        fileLstId2: '0',
        boxTitle: '',
        boxMark: '',
        boxHolder: '',
        boxTxt: '',
        viewTag: 'edit',
        viewTag1: 'edit',
        recallNodeName: null,
        instanceStatus: null,
        bpmChartDtoList: [],
        instanceId:null,
        nodeType:null,
        processApproveForm: {}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        if(param){
            _this.instanceId = param.instanceId;
            _this.recallNodeName = param.recallName;
            _this.viewTag = param.viewTag + '';
            _this.viewTag1 = param.viewTag + '';
            _this.instanceStatus = param.instanceStatus;
            _this.processApproveForm = param;

            // if(_this.viewTag != 'edit'){
            //     $.get(baseURL + "activity/bpmChart",{processKey:param.processKey,instanceId:param.instanceId}, function (r) {
            //         if (r.code == 0){
            //             _this.bpmChartDtoList = r.bpmChart;
            //         }
            //     });
            // }
            $.get(baseURL + "activity/getNodeType",{instanceId:param.instanceId},function(r){
                _this.nodeType = r.nodeType;
            });
        }
        //初始化加载保险公司下拉列表
        $.get(baseURL + "insurancecompany/sysinsurancecompany/getInsuranceCompanyList",function(r){
            //交强险
            _this.compulsoryInsuranceList= r.compulsoryInsuranceList;
            //商业险
            _this.commercialInsuranceList= r.commercialInsuranceList;
        });
        //获取险种类型
        $.get(baseURL + "sys/dict/getInfoByType/"+"insuranceType", function(r){
            //险种集合
            _this.insuranceTypeList= r.dict;
        });
        // 初始化加载商业险种数据
        var policyApplyNo = window.localStorage.getItem("policyApplyNo");
        $.get(baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",{"policyApplyNo":policyApplyNo}, function(r){
            //商业险
            _this.commercialInsuranceTableList= r.commercialInsuranceTableList;
        });

        $.ajax(baseURL + "sys/dict/getInfoByType/"+"insurancePaymentTarget",function(r){
            _this.compulsoryInsurancePay= r.dict;
            _this.commercialInsurancePay= r.dict;
        });
        _this.viewTag = 'edit';
        var editType =   window.localStorage.getItem("editType");
        if(editType == null || editType== '' || editType==undefined){
            editType = "insuranceBj";
        }
        $.ajax({
            type: "POST",
            async: false,
            url: baseURL + "maintenance/insurancemanage/info",
            data: {
                jqxId:isEmptyReturnNull(window.localStorage.getItem("jqxId")),
                syxId:isEmptyReturnNull(window.localStorage.getItem("syxId")),
                type:editType
            },
            success: function(r){
                if(r.code === 0){
                    _this.insuranceManage = r.insuranceManage;
                    _this.jqxFileList = r.insuranceManage.jqxFileList;
                    _this.syxxFileList = r.insuranceManage.syxxFileList;
                    _this.cyxxFileList = r.insuranceManage.cyxxFileList;
                }else{
                    alert(r.msg);
                }
            }
        });
        $.ajaxSettings.async = true;

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
        requestAction: function (action,type) {
            PageLoading();
            vm.insuranceManage.commercialInsuranceRecordList=vm.commercialInsuranceTableList;
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            vm.insuranceManage.cyxxFileList = vm.cyxxFileList;
            vm.insuranceManage.viewTag = vm.viewTag;
            vm.insuranceManage.instanceId = vm.processApproveForm.instanceId;
            vm.processApproveForm.processOperationType = type;
            vm.processApproveForm.businessId = window.localStorage.getItem("policyApplyNo");
            vm.processApproveForm.approveContent = vm.boxTxt;
            vm.processApproveForm.approveFileList=vm.fileLst2;
            vm.processApproveForm.insuranceManage=vm.insuranceManage;
            var closeBox = false;
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/" + action,
                contentType: "application/json",
                async:false,
                data: JSON.stringify(vm.processApproveForm),
                success: function (r) {
                    RemoveLoading();
                    if (parseInt(r.code) === 0) {
                        alert('操作成功', function () {
                            closeBox = true;
                            layer.closeAll();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.vm.reload();
                            parent.layer.close(index);
                        });
                    } else {
                        closeBox = false;
                        alert(r.msg);
                    }
                }
            });
            return closeBox;
        },
        showBox: function (submit) {
            vm.boxTxt = '';
            approveUplod.updateFile();
            var index = layer.open({
                title: vm.boxTitle,
                type: 1,
                area: ['90%', '95%'],
                btn:['取消','确定'] ,
                content: $("#boxShow"),
                btnAlign: 'c',
                end: function(){
                    vm.boxShow = false;
                    // vm.fileLst2=[];
                    layer.close(index);
                },
                btn1:function (index, layero) {
                    vm.boxShow = false;
                    // vm.fileLst2=[];
                    layer.close(index);
                },
                btn2:function (index, layero) {
                    return submit();
                }
            });
            vm.boxShow = true;
        },
        approve:function(){
            vm.boxTitle = '审核通过';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/选填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                return vm.requestAction('handle', 4);
            });
        },
        getFileData:function (data){
            let param={
                data:data
            }
            var index = layer.open({
                title: "查看",
                type: 2,
                boxParams: param,
                content: tabBaseURL +"modules/common/approvefileview.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        reject:function(){
            vm.boxTitle = '审核驳回-驳回' + vm.recallNodeName + '节点';
            vm.boxMark = '审核反馈';
            vm.boxHolder = '可以输入审核意见/必填';
            vm.boxInputShow = true;
            vm.showBox(function () {
                if (vm.boxTxt == null || vm.boxTxt == ''){
                    alert('请输入审核意见');
                    return false;
                }
                return vm.requestAction('handle', 3);
            });
        },
        reedit:function(){
            vm.viewTag = 'reedit';
            vm.saveOrUpdate();
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
            if(vm.insuranceManage.compulsoryStartTime != null && vm.insuranceManage.compulsoryStartTime != ''){
                if(vm.insuranceManage.compulsoryEndTime == null || vm.insuranceManage.compulsoryEndTime == ''){
                    alert('请填写交强险结束时间！');
                    return false;
                }
            }
            if(vm.insuranceManage.compulsoryEndTime != null && vm.insuranceManage.compulsoryEndTime != ''){
                if(vm.insuranceManage.compulsoryStartTime == null || vm.insuranceManage.compulsoryStartTime == ''){
                    alert('请填写交强险开始时间！');
                    return false;
                }
            }

            if(vm.insuranceManage.commercialStartTime != null && vm.insuranceManage.commercialStartTime != ''){
                if(vm.insuranceManage.commercialEndTime == null || vm.insuranceManage.commercialEndTime == ''){
                    alert('请填写商业险结束时间！');
                    return false;
                }
            }
            if(vm.insuranceManage.commercialEndTime != null && vm.insuranceManage.commercialEndTime != ''){
                if(vm.insuranceManage.commercialStartTime == null || vm.insuranceManage.commercialStartTime == ''){
                    alert('请填写商业险开始时间！');
                    return false;
                }
            }

            if(vm.insuranceManage.carrierStartTime != null && vm.insuranceManage.carrierStartTime != ''){
                if(vm.insuranceManage.carrierEndTime == null || vm.insuranceManage.carrierEndTime == ''){
                    alert('请填写承运险结束时间！');
                    return false;
                }
            }
            if(vm.insuranceManage.carrierEndTime != null && vm.insuranceManage.carrierEndTime != ''){
                if(vm.insuranceManage.carrierStartTime == null || vm.insuranceManage.carrierStartTime == ''){
                    alert('请填写承运险开始时间！');
                    return false;
                }
            }

            //商业险种记录
            vm.insuranceManage.commercialInsuranceRecordList=vm.commercialInsuranceTableList;
            vm.insuranceManage.jqxFileList = vm.jqxFileList;
            vm.insuranceManage.syxxFileList = vm.syxxFileList;
            vm.insuranceManage.cyxxFileList = vm.cyxxFileList;
            vm.insuranceManage.viewTag = vm.viewTag;
            vm.insuranceManage.instanceId = vm.processApproveForm.instanceId;
            vm.insuranceManage.insuranceManageId = null;
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/save",
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
                    console.log(parentData)
                    vm.reloadCommercialInsurance();
                });
            });
        },
        //加载表格数据--子页面调用
        reloadCommercialInsurance: function () {

            list = vm.commercialInsuranceTableList;
            if(list.length>0){
                var array=new Array()
                for (var i = 0; i <list.length ; i++) {
                    array.push(parseFloat(list[i].insuranceExpenses));
                }
                var commercialAmount=sum(array);
                vm.insuranceManage.commercialTotalAmount = commercialAmount;
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/insurancemanage/getInsuranceAmountStatus/",
                    contentType: "application/json",
                    data: null,
                    success: function(r){
                        if(r.code === 0){
                            vm.insuranceManage.insuranceAmountValue = r.config.paramValue;
                            console.log(vm.insuranceManage.insuranceAmountValue);
                            if(vm.insuranceManage.insuranceAmountValue == '2'){
                                vm.insuranceManage = Object.assign({}, vm.insuranceManage, {commercialAmount:commercialAmount });
                            }
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            } else{
                var commercialAmount = 0;
                vm.insuranceManage.commercialTotalAmount = commercialAmount;
                vm.insuranceManage.commercialAmount = commercialAmount;
            }

            layui.table.reload('insuranceTypeGrid', {
                data:  vm.commercialInsuranceTableList
            });

           /* if(list==null||list.length==0){
                layui.table.reload('insuranceTypeGrid', {
                    data: vm.commercialInsuranceTableList
                });
            }else{
                vm.commercialInsuranceTableList = list;
                layui.table.reload('insuranceTypeGrid', {
                    data:  vm.commercialInsuranceTableList
                });
            }*/

        },

        //表格数据重新加载方法
        reloadSourceTable: function(policyApplyNo){
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/getCommercialInsuranceList",
                dataType:"JSON",
                data:{"policyApplyNo":policyApplyNo},
                success: function(r){
                    vm.commercialInsuranceTableList = r.commercialInsuranceTableList;
                    for(var i=0;i< vm.commercialInsuranceTableList.length;i++){
                        var randomData = Math.random().toString(36).slice(2);
                        vm.commercialInsuranceTableList[i].randomData = randomData;
                    }
                    layui.table.reload('insuranceTypeGrid', {
                        data: vm.commercialInsuranceTableList
                    });
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
            var editType =   window.localStorage.getItem("editType");
            if(editType == null || editType== '' || editType==undefined){
                editType = "insuranceBj";
            }
            $.ajax({
                type: "POST",
                url: baseURL + "maintenance/insurancemanage/info",
                data: {
                    jqxId:isEmptyReturnNull(jqxId),
                    syxId:isEmptyReturnNull(syxId),
                    type:editType
                },
                success: function(r){
                    if(r.code === 0){
                        vm.insuranceManage = r.insuranceManage;
                        vm.jqxFileList = vm.insuranceManage.jqxFileList;
                        vm.syxxFileList = vm.insuranceManage.syxxFileList;
                        vm.cyxxFileList = vm.insuranceManage.cyxxFileList;
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
                        console.log(vm.insuranceManage.insuranceAmountValue);
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
        console.log(isValueNaN(arr[i]));
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
