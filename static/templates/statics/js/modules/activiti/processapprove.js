$(function () {
    if(parent.vm){
        vm.q.approveStatus = parent.vm.type;
    }
    vm.getTransferReason();
    vm.initApproveTitle();
    vm.initCols();
    vm.initTable();
    initClick();

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

    layui.form.on('submit(approveSubmit)', function(){
        vm.approveSubmit();
        return false;
    });

    layui.form.on('submit(approveBack)', function(){
        vm.approveBack();
        return false;
    });


    //维修结束时间，自定义时间
    layui.laydate.render({
        elem : '#applyTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="applyTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.applyTimeStr=value;
            vm.q.applyTimeType=null;
        }
    });

    layui.laydate.render({
        elem: '#repairStartDate',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.repairStartDate=value;
        }
    });

    //维修结束时间
    layui.laydate.render({
        elem: '#repairEndDate',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.repairEndDate=value;
        }
    });

    layui.laydate.render({
        elem : '#transferTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="transferTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.transferTimeStr=value;
            vm.q.transferTimeType=null;
        }
    });

    layui.laydate.render({
        elem : '#moveTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="moveTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.moveTimeStr=value;
            vm.q.moveTimeType=null;
        }
    });

    layui.laydate.render({
        elem: '#outDate',
        type:'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.outDate = value;
        }
    });

    layui.use('form', function() {
        var form = layui.form;
        form.render(); //更新全部
        form.on('select(approveStatusSelect)', function (data) {
            vm.q.approveStatus = data.value;
        });

        form.on('select(outLevelFilter)', function (data) {
            vm.q.outLevel = data.value;
        });

        form.on('select(responsiblePartyFilter)', function (data) {
            vm.q.responsibleParty = data.value;
        });

        form.on('select(costSettlement)', function (data) {
            vm.q.costSettlement = data.value;
        });

        //移库原因下拉列表事件监听
        form.on('select(transferReasonSerch)', function (data) {
            vm.q.transferReason = data.value;
        });

        form.on('select(lessorSelect)',function(data){
            vm.q.lessor = data.value;
        });

        form.on('select(customTypeSelect)',function(data){
            vm.q.customType = data.value;
        });

        form.on('select(approveResultSelect)', function (data) {
            vm.processApproveForm.approveResult = data.value;
            if(data.value == '1'){
                //同意，驳回禁用
                vm.approveBackShow = false;
            }else if(data.value == '2'){
                //不同意，驳回取消禁用
                var processKey = window.localStorage.getItem("processKey");
                if(processKey != 'returnCarSettlement' && processKey !='depositSettlement'){
                    vm.approveBackShow = true;
                }else{
                    vm.approveBackShow = false;
                }
            }
        });

        form.verify({
            approveResult : function(value){
                if (value == "" || value == null) {
                    return '审核意见不能为空';
                }
            }
        });
    });

    //批量删除
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'approve'){
            vm.approve(data);
        } else if(layEvent === 'view'){
            vm.view(data);
        }
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            approveStatus: 1,
            orderNo:null,
            customName:null,
            carNo:null,
            lessor:null,
            applyUser:null,
            customType:null,
            businessType:1,
            applyTimeType:null,
            applyTimeStr:null,
            transferTimeType:null,
            transferTimeStr:null,
            moveTimeType:null,
            moveTimeStr:null,
            modelId:null,
            transferReason:null,
            depotName:null,
            transferDepotName:null,
            serviceName:null,
            costSettlement:null,
            repairStartDate:null,
            repairEndDate:null,
            outLevel:null,
            responsibleParty:null,
            outDate:null
        },
        showForm: false,
        approveBackShow: false,
        processApprove: {},
        businessContent:null,
        processApproveForm:{
            approveId:null,
            instanceId:null,
            approveResult:null,
            approveContent:null
        },
        detailForm: false,
        approveLog:{},
        historyLog:{},
        approveForm: false,
        approveLogForm: false,
        approveFormDetail: false,
        approveTypeLst:[],
        approveTypeIndex: 0,
        lessorLst:[],
        cols:[],
        transferReasonList:[],
        isFilter:false,
        outLevelList:[],
        waitTimeTitle:null
    },
    created: function(){
        var _this = this;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.lessorLst = r.deptList;
        });
        $.get(baseURL + "sys/dict/getInfoByType/"+"accidentLevel",function(r){
            _this.outLevelList= r.dict;
        });
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.allCarModels,
                    success: function (valData,labelData) {
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
        function reinitIframe(){
            var iframe = document.getElementById("businessApprove");
            var iframe1 = document.getElementById("businessApproveDetail");
            try{
                var bHeight = iframe.contentWindow.document.body.scrollHeight;
                var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
                var height = Math.max(bHeight, dHeight);
                iframe.height = height;

                var bHeight1 = iframe1.contentWindow.document.body.scrollHeight;
                var dHeight1 = iframe1.contentWindow.document.documentElement.scrollHeight;
                var height1 = Math.max(bHeight1, dHeight1);
                iframe1.height = height1;
            }catch (ex){}
        };
        setInterval(reinitIframe,100);
    },
    methods: {
        getTransferReason:function(){
            var type="TRANSFER_REASON";
            $.ajax({
                type: "POST",
                url: baseURL + 'sys/dict/getInfoByType/'+type,
                contentType: "application/json",
                async:false,
                data:{},
                success: function(r){
                    if(r.code === 0){
                        vm.transferReasonList=r.dict;
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        initCols: function(){
            if(vm.q.approveStatus == 1){
                vm.waitTimeTitle = '审核等待时间';
            }else{
                vm.waitTimeTitle = '审核总耗时'
            }
            // 待我审核
            vm.cols = [[
                {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {
                        if(d.orderNo!=null && d.orderNo!=''){
                            return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderNo+"\')>"+d.orderNo+"</span>";
                        }else {
                            return "--";
                        }
                }},
               
                {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                {field:'lessorName',align:"center", title: '售卖方',templet: function (d) {return isEmpty(d.lessorName)}},
                {field:'customName',align:"center", title: '客户名称',templet: function (d) {return isEmpty(d.customName)}},
                {field:'customType',align:"center", title: '客户类型',
                    templet:function(d){
                        return transformTypeByMap(d.customType, {1:'企业', 2:'个人'});
                    }
                },
                {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
            ]];

            if(vm.q.businessType === 2){
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {
                            if(d.orderNo!=null && d.orderNo!=''){
                                return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderNo+"\')>"+d.orderNo+"</span>";
                            }else {
                                return "--";
                            }
                        }},

                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'lessorName',align:"center", title: '售卖方',templet: function (d) {return isEmpty(d.lessorName)}},
                    {field:'customName',align:"center", title: '客户名称',templet: function (d) {return isEmpty(d.customName)}},
                    {field:'customType',align:"center", title: '客户类型',
                        templet:function(d){
                            return transformTypeByMap(d.customType, {1:'企业', 2:'个人'});
                        }
                    },
                    {field:'alterationTime',align:"center", title: '换车时间',templet: function (d) {return isEmpty(d.alterationTime)}},
                    {field:'alterationDesc',align:"center", title: '换车原因',templet: function (d) {return isEmpty(d.alterationDesc)}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }

            if(vm.q.businessType === 3){
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {
                            if(d.orderNo!=null && d.orderNo!=''){
                                return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderNo+"\')>"+d.orderNo+"</span>";
                            }else {
                                return "--";
                            }
                        }},

                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'lessorName',align:"center", title: '售卖方',templet: function (d) {return isEmpty(d.lessorName)}},
                    {field:'customName',align:"center", title: '客户名称',templet: function (d) {return isEmpty(d.customName)}},
                    {field:'customType',align:"center", title: '客户类型',
                        templet:function(d){
                            return transformTypeByMap(d.customType, {1:'企业', 2:'个人'});
                        }
                    },
                    {field:'alterationTime',align:"center", title: '退车时间',templet: function (d) {return isEmpty(d.alterationTime)}},
                    {field:'alterationApplyType',align:"center", title: '退车类别',templet: function (d) {return transformTypeByMap(d.alterationApplyType, { 1: '租赁到期', 2: '违约退车', 3: '强制收车', 4: '其他' })}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }
            if(vm.q.businessType == 5 || vm.q.businessType == 6){
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {
                            if(d.orderNo!=null && d.orderNo!=''){
                                return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderNo+"\')>"+d.orderNo+"</span>";
                            }else {
                                return "--";
                            }
                        }},

                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'lessorName',align:"center", title: '售卖方',templet: function (d) {return isEmpty(d.lessorName)}},
                    {field:'customName',align:"center", title: '客户名称',templet: function (d) {return isEmpty(d.customName)}},
                    {field:'customType',align:"center", title: '客户类型',
                        templet:function(d){
                            return transformTypeByMap(d.customType, {1:'企业', 2:'个人'});
                        }
                    },
                    {field:'alterationTime',align:"center", title: '退车时间',templet: function (d) {return isEmpty(d.alterationTime)}},
                    {field:'alterationApplyType',align:"center", title: '退车类别',templet: function (d) {return transformTypeByMap(d.alterationApplyType, { 1: '租赁到期', 2: '违约退车', 3: '强制收车', 4: '其他' })}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }
            if(vm.q.businessType === 7){
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'brandModel',align:"center", title: '品牌/车系/车型',templet: function (d) {return isEmpty(d.brandModel)}},
                    {field:'transferReasonStr',align:"center", title: '移库原因',templet: function (d) {return isEmpty(d.transferReasonStr)}},
                    {field:'depotName',align:"center", title: '当前仓库',templet: function (d) {return isEmpty(d.depotName)}},
                    {field:'deptName',align:"center", title: '当前车辆归属',templet: function (d) {return isEmpty(d.deptName)}},
                    {field:'moveUser',align:"center", title: '移库人员',templet: function (d) {return isEmpty(d.moveUser)}},
                    {field:'transferTime',align:"center", title: '移库时间',templet: function (d) {return isEmpty(d.transferTime)}},
                    {field:'purposeDepotName',align:"center", title: '移入仓库',templet: function (d) {return isEmpty(d.purposeDepotName)}},
                    {field:'purposeDeptName',align:"center", title: '移入车辆归属',templet: function (d) {return isEmpty(d.purposeDeptName)}},
                    {field:'remarks',align:"center", title: '备注信息',templet: function (d) {return isEmpty(d.remarks)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }
            if(vm.q.businessType === 8){//车辆出险
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'brandModel',align:"center", title: '品牌/车系/车型',templet: function (d) {return isEmpty(d.brandModel)}},
                    {field:'carStatusStr',align:"center", title: '车辆状态',templet: function (d) {return isEmpty(d.carStatusStr)}},
                    {field:'outDate',align:"center", title: '出险时间',templet: function (d) {return isEmpty(d.outDate)}},
                    {field:'outAddr',align:"center", title: '出险地点',templet: function (d) {return isEmpty(d.outAddr)}},
                    {field:'outLevel',align:"center", title: '事故等级',templet: function (d) {return isEmpty(d.outLevel)}},
                    {field:'responsibleParty',align:"center", title: '责任方',templet: function (d) {return isEmpty(d.responsibleParty)}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }

            if(vm.q.businessType === 9){//车辆保险
                vm.cols = [
                    [
                        {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center",rowspan:2},
                        {field:'carNo',align:"center", title: '车牌号',fixed: "left",rowspan:2,templet: function (d) {return isEmpty(d.carNo)}},
                        {field:'nodeName',align:"center", title: '审核节点',rowspan:2,templet: function (d) {return isEmpty(d.nodeName)}},
                        {field:'auditStatus',align:"center", title: '审核状态',rowspan:2,templet: function (d) {return isEmpty(d.auditStatus)}},
                        {field:'vinNo',align:"center", title: '车架号',rowspan:2,templet: function (d) {return isEmpty(d.vinNo)}},
                        {field:'brandModel',align:"center", title: '品牌/车系/车型',rowspan:2,templet: function (d) {return isEmpty(d.brandModel)}},
                        {field:'carStatusStr',align:"center", title: '车辆状态',rowspan:2,templet: function (d) {return isEmpty(d.carStatusStr)}},
                        {field:'deptName',align:"center", title: '车辆归属',rowspan:2,templet: function (d) {return isEmpty(d.deptName)}},
                        {field:'applyUser',align:"center", title: '发起人',rowspan:2,templet: function (d) {return isEmpty(d.applyUser)}},
                        {field:'applyTime',align:"center", title: '发起时间',rowspan:2,templet: function (d) {return isEmpty(d.applyTime)}},
                        {field:'waitTime',align:"center", title: vm.waitTimeTitle,rowspan:2,templet: function (d) {return isEmpty(d.waitTime)}},
                        {field:'compulsoryCompanyId', minWidth:100,align:'center', title: '交强险',align: "center",colspan:5 },
                        {field:'commercialCompanyId', minWidth:100,align:'center', title: '商业险',align: "center",colspan:5 },
                        {field:'carrierCompanyId', minWidth:100,align:'center', title: '承运险',align: "center",colspan:5 },
                    ],[
                        {field:'compulsoryNo', minWidth:180, title: '申请单号',align:'center',templet: function (d) {return isEmpty(d.compulsoryNo)}},
                        {field:'compulsoryCompany', minWidth:180, title: '保险公司',align:'center',templet: function (d) {return isEmpty(d.compulsoryCompany)}},
                        {field:'compulsoryStTime', minWidth:100, title: '开始时间',align:'center',templet: function (d) {return isEmpty(d.compulsoryStTime)}},
                        {field:'compulsoryEnTime', minWidth:100, title: '结束时间',align:'center',templet: function (d) {return isEmpty(d.compulsoryEnTime)}},
                        {field:'compulsoryAmount', minWidth:100, title: '费用/元',align:'center',templet: function (d) {return isEmpty(d.compulsoryAmount)}},
                        {field:'commercialNo', minWidth:180, title: '申请单号',align:'center',templet: function (d) {return isEmpty(d.commercialNo)}},
                        {field:'commercialCompany', minWidth:180, title: '保险公司',align:'center',templet: function (d) {return isEmpty(d.commercialCompany)}},
                        {field:'commercialStTime', minWidth:100,align:'center',title: '开始时间',templet: function (d) {return isEmpty(d.commercialStTime)}},
                        {field:'commercialEnTime', minWidth:100,align:'center', title: '结束时间',templet: function (d) {return isEmpty(d.commercialEnTime)}},
                        {field:'commercialAmount', minWidth:100, title: '费用/元',align:'center',templet: function (d) {return isEmpty(d.commercialAmount)}},
                        {field:'carrierNo', minWidth:180, title: '申请单号',align:'center',templet: function (d) {return isEmpty(d.carrierNo)}},
                        {field:'carrierCompany', minWidth:180, title: '保险公司',align:'center',templet: function (d) {return isEmpty(d.carrierCompany)}},
                        {field:'carrierStTime', minWidth:100, title: '开始时间',align:'center',templet: function (d) {return isEmpty(d.carrierStTime)}},
                        {field:'carrierEnTime', minWidth:100, title: '结束时间',align:'center',templet: function (d) {return isEmpty(d.carrierEnTime)}},
                        {field:'carrierAmount', minWidth:100, title: '费用/元',align:'center',templet: function (d) {return isEmpty(d.carrierAmount)}},
                    ]
                ];
            }

            if(vm.q.businessType == 10){//车辆维修
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'brandModel',align:"center", title: '品牌/车系/车型',templet: function (d) {return isEmpty(d.brandModel)}},
                    {field:'customName',align:"center", title: '当前客户名称',templet: function (d) {return isEmpty(d.customName)}},
                    {field:'carStatusStr',align:"center", title: '车辆状态',templet: function (d) {return isEmpty(d.carStatusStr)}},
                    {field:'deptName',align:"center", title: '车辆归属',templet: function (d) {return isEmpty(d.deptName)}},
                    {field:'serviceName',align:"center", title: '维修厂名称',templet: function (d) {return isEmpty(d.serviceName)}},
                    {field:'startTime',align:"center", title: '维修开始时间',templet: function (d) {return isEmpty(d.startTime)}},
                    {field:'endTime',align:"center", title: '维修结束时间',templet: function (d) {return isEmpty(d.endTime)}},
                    {field:'costSettlement',align:"center", title: '费用是否已结算',templet: function (d) {return isEmpty(d.costSettlement)}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }

            if(vm.q.businessType == 11){//车辆处置
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'brandModel',align:"center", title: '品牌/车系/车型',templet: function (d) {return isEmpty(d.brandModel)}},
                    {field:'disposalReasonStr',align:"center", title: '处置原因',templet: function (d) {return isEmpty(d.disposalReasonStr)}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }

            if(vm.q.businessType == 12){//车辆收车
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'brandModel',align:"center", title: '品牌/车系/车型',templet: function (d) {return isEmpty(d.brandModel)}},
                    {field:'lessorName',align:"center", title: '出租方',templet: function (d) {return isEmpty(d.lessorName)}},
                    {field:'rentType',align:"center", title: '订单类型',templet: function (d) {return isEmpty(d.rentType)}},
                    {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {
                            if(d.orderNo!=null && d.orderNo!=''){
                                return "<span style='color:#419BEA;cursor:pointer;' onclick=goToOrderDetail(\'"+d.orderNo+"\')>"+d.orderNo+"</span>";
                            }else {
                                return "--";
                            }
                        }},
                    {field:'customName',align:"center", title: '客户名称',templet: function (d) {return isEmpty(d.customName)}},
                    {field:'customType',align:"center", title: '客户类型',templet: function (d) {return isEmpty(d.customType)}},
                    {field:'collectTime',align:"center", title: '收车时间',templet: function (d) {return isEmpty(d.collectTime)}},
                    {field:'collectReasonName',align:"center", title: '收车原因',templet: function (d) {return isEmpty(d.collectReasonName)}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'waitTime',align:"center", title: vm.waitTimeTitle,templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }
        },
        initTable: function(){
            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                    soulTable = layui.soulTable
                    gridTable = layui.table.render({
                        id: "gridid",
                        elem: '#grid',
                        url: baseURL + 'mark/processapprove/approveList',
                        where:{
                            "approveStatus":vm.q.approveStatus,
                            "businessType":vm.q.businessType,
                            "orderNo": vm.q.orderNo,
                            "customName": vm.q.customName,
                            "carNo": vm.q.carNo,
                            "lessor": vm.q.lessor,
                            "applyUser": vm.q.applyUser,
                            "customType": vm.q.customType,
                            "applyTimeType":vm.q.applyTimeType ,
                            "applyTimeStr":vm.q.applyTimeStr,
                            "transferTimeStr":vm.q.transferTimeStr,
                            "transferTimeType":vm.q.transferTimeType,
                            "moveTimeStr":vm.q.moveTimeStr,
                            "moveTimeType":vm.q.moveTimeType,
                            "modelId":vm.q.modelId,
                            "transferReason":vm.q.transferReason,
                            "depotName":vm.q.depotName,
                            "transferDepotName":vm.q.transferDepotName,
                            "serviceName":vm.q.serviceName,
                            "costSettlement":vm.q.costSettlement,
                            "repairStartDate":vm.q.repairStartDate,
                            "repairEndDate":vm.q.repairEndDate,
                            "outLevel":vm.q.outLevel,
                            "responsibleParty":vm.q.responsibleParty,
                            "outDate":vm.q.outDate
                        },
                        cols: vm.cols,
                        page: true,
                        loading: true,
                        limits: [20, 50, 100, 200],
                        limit: 20,
                        autoColumnWidth: {
                            init: true
                        },
                        done: function () {
                            soulTable.render(this);
                            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                            $(".layui-table-main tr").each(function (index, val) {
                                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                            });
                        }
                    });
            });
        },
        initApproveTitle: function(){
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processapprove/getApproveTypeLst",
                success: function (r) {
                    vm.approveTypeLst = r.approveTypeLst;
                }
            });
        },
        changeType: function(item,index){
            vm.approveTypeIndex = index;
            if(item.name === '全部'){
                vm.q.businessType = null;
            }else if(item.name === '提单审核'){
                vm.q.businessType = 1;
            }else if(item.name === '退车审核'){
                vm.q.businessType = 3;
            }else if(item.name === '换车审核'){
                vm.q.businessType = 2;
            }else if(item.name === '备用车提单审核'){
                vm.q.businessType = 4;
            }else if(item.name === '备用车退车审核'){
                vm.q.businessType = 5;
            }else if(item.name === '直购退车'){
                vm.q.businessType = 6;
            }else if(item.name === '车辆移库'){
                vm.q.businessType = 7;
            }else if(item.name === '车辆出险'){
                vm.q.businessType = 8;
            }else if(item.name === '车辆保险'){
                vm.q.businessType = 9;
            }else if(item.name === '车辆维修'){
                vm.q.businessType = 10;
            }else if(item.name === '车辆处置'){
                vm.q.businessType = 11;
            }else if(item.name === '车辆收车'){
                vm.q.businessType = 12;
            }
            vm.initCols();
            vm.initTable();
        },
        approveBack: function(){
            showloading(true);
            //驳回，该实例可以再次发起申请
            $.ajax({
                type: "POST",
                url: baseURL + '/activity/bpmBack',
                contentType: "application/json",
                data: JSON.stringify(vm.processApproveForm),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                },
                complete: function(){
                    showloading(false);
                }
            });
        },
        approveSubmit: function(){
            showloading(true);
            $.ajax({
                type: "POST",
                url: baseURL + '/activity/bpmNext',
                contentType: "application/json",
                data: JSON.stringify(vm.processApproveForm),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                },
                complete: function(){
                    showloading(false);
                }
            });
        },
        approveCancel: function(){
            layer.closeAll();
        },
        view: function(data){
            console.log("processKey是（待我审批）："+data.processKey);
            var param = '';
            var url = '';
            if($.inArray(data.processKey, ['longRentOrderApprove','rentSaleOrderApprove','purchaseOrderApprove','meltsRentOrderApprove','affiliatedOrderApprove']) >= 0){
                param = {
                    id: data.businessId,
                    viewTag: 'show',
                    approveId: data.id,
                    approveType: data.approveType
                };
                url = "modules/orderflow/orderflowedit.html";
            }else{
                param = {
                    id: data.businessId,
                    viewTag: 'approveDetail',
                    instanceId: data.instanceId,
                    approveId: data.id,
                    processKey: data.processKey
                };
                if(data.processKey === 'carBackApprove'){
                    url = "modules/order/applycarback.html";
                }
                if(data.processKey === 'purchaseBackApprove'){
                    url = "modules/order/applypurchaseback.html"
                }
                if(data.processKey === 'rentSaleApprove'){
                    url = "modules/order/applyrentback.html";
                }
                if(data.processKey === 'rentTransferCar'){
                    url = "modules/order/applytransfercar.html";
                }
                if(data.processKey === 'rentSaleTransferCar'){
                    url = "modules/order/applyrenttransfercar.html";
                }
                if(data.processKey === 'spareCarApprove'){
                    url = "modules/order/sparecarflow.html";
                }
                if(data.processKey === 'spareCarReturnApprove'){
                    url = "modules/order/sparecarback.html";
                }
                if(data.processKey === 'carMoveApprove'){
                    url = "modules/car/carmove.html";
                }
                //车辆出险
                if(data.processKey === 'carOutInsuranceApprove'){
                    window.localStorage.setItem("outInsuranceOrderId",data.businessId);
                    window.localStorage.setItem("approveType","view");
                    url = "modules/outinsuranceorder/outinsuranceorderedit.html";
                }
                //车辆保险
                if(data.processKey === 'carInsuranceApprove'){
                    window.localStorage.setItem("jqxId",data.jqxId);
                    window.localStorage.setItem("syxId",data.syxId);
                    window.localStorage.setItem("policyApplyNo",data.commercialApplyNo);
                    window.localStorage.setItem("carId",data.carId);
                    // window.localStorage.setItem("editType","insuranceSP");
                    url = "modules/maintenance/insurancemanageedit.html";
                }
                //车辆维修
                if(data.processKey === 'carRepairApprove'){
                    window.localStorage.setItem("id",data.businessId);
                    url = "modules/carrepairorder/carrepairorderedit.html";
                }
                //车辆处置
                if(data.processKey === 'carDisposalApprove'){
                    window.localStorage.setItem("carId",data.carId);
                    url = "modules/car/tcardisposal.html";
                }
                //车辆收车
                if(data.processKey === 'carCollectApprove'){
                    window.localStorage.setItem("carCollectId",data.businessId);
                    url = "modules/car/collect.html";
                }
            }
            var index = layer.open({
                title: data.nodeName,
                type: 2,
                boxParams: param,
                content: tabBaseURL + url,
                end: function () {
                    window.localStorage.clear();
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        approveData: function(data){
            //审批记录数据装载
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processapprove/approveLog",
                data: {"instanceId":data.instanceId},
                success: function(r){
                    vm.approveLog = r.approveLog;
                    var approveHtml = '<ul class="layui-timeline">';
                    for(var i=0;i<vm.approveLog.length;i++){
                        approveHtml = approveHtml + '<li class="layui-timeline-item"><i class="layui-icon layui-timeline-axis">&#xe63f;</i><div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">'+vm.approveLog[i].approveName+'于'+vm.approveLog[i].approveTime+'</h3><p>'+vm.approveLog[i].nodeName+'&nbsp;&nbsp;&nbsp;&nbsp;'+vm.approveLog[i].approveContent+'</p></div></li>';
                    }
                    approveHtml = approveHtml + '</ul>';
                    $('#approveLog').html(approveHtml);
                }
            });
        },
        approve: function(data){
            console.log("processKey是："+data.processKey);
            var param = '';
            var url = '';
            if($.inArray(data.processKey, ['longRentOrderApprove','rentSaleOrderApprove','purchaseOrderApprove','meltsRentOrderApprove','affiliatedOrderApprove']) >= 0){
                param = {
                    id: data.businessId,
                    viewTag: 'edit',
                    approveId: data.id,
                    approveType: data.approveType
                };
                url = "modules/orderflow/orderflowedit.html";
            }else{
                param = {
                    id: data.businessId,
                    viewTag: 'approve',
                    instanceId: data.instanceId,
                    nodeId: data.nodeId,
                    approveId: data.id,
                    approveType: data.approveType,
                    recallName: data.recallName,
                    processKey: data.processKey
                };
                if(data.processKey === 'carBackApprove'){
                    url = "modules/order/applycarback.html";
                }
                if(data.processKey === 'purchaseBackApprove'){
                    url = "modules/order/applypurchaseback.html"
                }
                if(data.processKey === 'rentSaleApprove'){
                    url = "modules/order/applyrentback.html";
                }
                if(data.processKey === 'rentTransferCar'){
                    url = "modules/order/applytransfercar.html";
                }
                if(data.processKey === 'rentSaleTransferCar'){
                    url = "modules/order/applyrenttransfercar.html";
                }
                if(data.processKey === 'spareCarApprove'){
                    url = "modules/order/sparecarflow.html";
                }
                if(data.processKey === 'spareCarReturnApprove'){
                    url = "modules/order/sparecarback.html";
                }
                if(data.processKey === 'carMoveApprove'){
                    url = "modules/car/carmove.html";
                }
                //车辆出险
                if(data.processKey === 'carOutInsuranceApprove'){
                    window.localStorage.setItem("outInsuranceOrderId",data.businessId);
                    url = "modules/outinsuranceorder/outinsuranceorderedit.html";
                }
                //车辆保险
                if(data.processKey === 'carInsuranceApprove'){
                    window.localStorage.setItem("jqxId",data.jqxId);
                    window.localStorage.setItem("syxId",data.syxId);
                    window.localStorage.setItem("policyApplyNo",data.commercialApplyNo);
                    window.localStorage.setItem("carId",data.carId);
                    // window.localStorage.setItem("editType","insuranceSP");
                    url = "modules/maintenance/insurancemanageedit.html";
                }
                //车辆维修
                if(data.processKey === 'carRepairApprove'){
                    window.localStorage.setItem("id",data.businessId);
                    url = "modules/carrepairorder/carrepairorderedit.html";
                }
                //车辆处置
                if(data.processKey === 'carDisposalApprove'){
                    window.localStorage.setItem("carId",data.carId);
                    url = "modules/car/tcardisposal.html";
                }
                //车辆收车
                if(data.processKey === 'carCollectApprove'){
                    window.localStorage.setItem("carCollectId",data.businessId);
                    url = "modules/car/collect.html";
                }
            }
            param.data = {
                orderCar:{}
            };
            var index = layer.open({
                title: data.nodeName,
                type: 2,
                boxParams: param,
                content: tabBaseURL + url,
                end: function () {
                    window.localStorage.clear();
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        historyLogData: function(data){
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processapprove/historyLog",
                data: {"instanceId":data.instanceId},
                success: function(r){
                    vm.historyLog = r.historyLog;
                    var approveHtml = '<ul class="layui-timeline">';
                    for(var i=0;i<vm.historyLog.length;i++){
                        approveHtml = approveHtml + '<li class="layui-timeline-item"><i class="layui-icon layui-timeline-axis">&#xe63f;</i><div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">'+vm.historyLog[i].approveName+'于'+vm.historyLog[i].approveTime+'</h3><p>'+vm.historyLog[i].nodeName+'&nbsp;&nbsp;&nbsp;&nbsp;'+vm.historyLog[i].approveContent+'</p></div></li>';
                    }
                    approveHtml = approveHtml + '</ul>';
                    $('#approveLog1').html(approveHtml);
                }
            });
        },
        rest: function(){
            var resetType = vm.q.businessType;
            vm.q = {
                approveStatus:1,
                orderNo:null,
                customName:null,
                carNo:null,
                lessor:null,
                applyUser:null,
                customType:null,
                applyTimeType:null,
                applyTimeStr:null,
                transferTimeType:null,
                transferTimeStr:null,
                moveTimeType:null,
                moveTimeStr:null,
                modelId:null,
                transferReason:null,
                depotName:null,
                transferDepotName:null,
                businessType:resetType,
                serviceName:null,
                costSettlement:null,
                repairStartDate:null,
                repairEndDate:null,
                outLevel:null,
                responsibleParty:null,
                outDate:null
            }
            $('div[type="applyTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="transferTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="moveTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $("#carBrandSeriesModel").val("");
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.initCols();
            vm.initTable();
        },
        add: function(){
            vm.processApprove = {};

            var index = layer.open({
                title: "新增",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "mark/processapprove/info/"+id, function(r){
                vm.processApprove = r.processApprove;
            });

            var index = layer.open({
                title: "修改",
                type: 1,
                content: $("#editForm"),
                end: function(){
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "mark/processapprove/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function (event) {
            var url = vm.processApprove.id == null ? "mark/processapprove/save" : "mark/processapprove/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.processApprove),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        exports: function () {
            $.ajaxSettings.async = false;
            PageLoading();
            window.location.href = urlParamByObj(baseURL + 'mark/processapprove/export', vm.q);
            $.ajaxSettings.async = true;
            RemoveLoading();
            vm.closeTip();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    approveStatus: vm.q.approveStatus,
                    orderNo: vm.q.orderNo,
                    customName: vm.q.customName,
                    carNo: vm.q.carNo,
                    lessor: vm.q.lessor,
                    applyUser: vm.q.applyUser,
                    customType: vm.q.customType,
                    businessType: vm.q.businessType,
                    applyTimeType:vm.q.applyTimeType ,
                    applyTimeStr:vm.q.applyTimeStr,
                    transferTimeType:vm.q.transferTimeType,
                    transferTimeStr:vm.q.transferTimeStr,
                    moveTimeType:vm.q.moveTimeType,
                    moveTimeStr:vm.q.moveTimeStr,
                    transferReason:vm.q.transferReason,
                    modelId:vm.q.modelId,
                    depotName:vm.q.depotName,
                    transferDepotName:vm.q.transferDepotName,
                    serviceName:vm.q.serviceName,
                    costSettlement:vm.q.costSettlement,
                    repairStartDate:vm.q.repairStartDate,
                    repairEndDate:vm.q.repairEndDate,
                    outLevel:vm.q.outLevel,
                    responsibleParty:vm.q.responsibleParty,
                    outDate:vm.q.outDate
                }
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
})


function initClick() {
    var type = ['applyTimeType','transferTimeType','moveTimeType'];
    var str = ['applyTimeStr','transferTimeStr','moveTimeStr'];
    type.forEach(function(value,index){
        $('div[type='+type[index]+']>div').on('click', function(){
            var selected = $(this);
            $('div[type='+type[index]+']>div').removeClass('task-content-box-tab-child-active');
            selected.addClass('task-content-box-tab-child-active');
            var value = selected.attr('value');
            Vue.set(vm.q, str[index], '');
            Vue.set(vm.q, type[index], value);
        });
    });

}



/**
 * 跳转至订单详情
 */
function goToOrderDetail(orderNo) {
    //切割字符串获取订单号标识
    var orderNoStr = orderNo.substring(0,3);
    $.ajax({
        type: "POST",
        url: baseURL + "order/ordercar/getOrderInfoByCode/" + orderNo,
        contentType: "application/json",
        data:null,
        success: function(r){
           if(r.orderCarId!=null && r.orderCarId!=''){
                    //车辆订单
                    if(orderNo.indexOf("DDC") >=0){
                        $.get(baseURL + "order/order/info/" + r.orderCarId, function (r) {
                            var param = {
                                data: r.order
                            };
                            var index = layer.open({
                                title: "查看",
                                type: 2,
                                boxParams: param,
                                content: tabBaseURL + "modules/order/orderview.html",
                                end: function () {
                                    layer.close(index);
                                }
                            });
                            layer.full(index);
                        });
                    }
                    //跳转到备用车详情
                    if(orderNo.indexOf("BYC") >=0){
                        $.get(baseURL + "cartransfer/sparecar/info/"+r.orderCarId, function(r){
                            var index = layer.open({
                                title: "备用车详情",
                                type: 2,
                                content: tabBaseURL + "modules/order/sparecardetail.html",
                                success: function(layero,num){
                                    var iframe = window['layui-layer-iframe'+num];
                                    iframe.vm.spareCarApply = r.spareCar;
                                    iframe.vm.receivablesList = r.spareCar.receivablesList;
                                    if(r.spareCar.isApply == 1){
                                        iframe.vm.payDayShow = true;
                                    }else{
                                        iframe.vm.payDayShow = false;
                                    }
                                    if(r.spareCar.spareCarStatus == 2){
                                        iframe.vm.returnCarBtn = true;
                                    }else{
                                        iframe.vm.returnCarBtn = false;
                                    }
                                    if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                                        iframe.vm.returnCarForm = true;
                                        iframe.vm.detailsSupTabContentList = [
                                            '备用车基础信息',
                                            '备用车信息',
                                            '合同信息',
                                            '其他关联单据信息',
                                            '备用车退车信息'
                                        ];
                                    }else{
                                        iframe.vm.returnCarForm = false;
                                        iframe.vm.detailsSupTabContentList = [
                                            '备用车基础信息',
                                            '备用车信息',
                                            '合同信息',
                                            '其他关联单据信息'
                                        ];
                                    }
                                    iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                                    iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                                    iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                                    iframe.vm.reloadData();
                                    iframe.vm.initOperatorLog(r.orderCarId);
                                },
                                end: function(){
                                    layer.close(index);
                                }
                            });
                            layer.full(index);
                        });
                    }
           }
        }
    });

}
