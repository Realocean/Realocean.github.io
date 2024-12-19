var type = 1;
$(function () {
    vm.initApplyTypeLst();
    vm.initCols();
    vm.initTable();
    vm.getTransferReason();
    initClick();

    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
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
        } else if(layEvent ==='detail'){
            vm.detail(data);
        }
    });

    layui.use('form', function() {
        var form = layui.form;
        form.render(); //更新全部

        form.on('checkbox(instanceStatusFilter)', function(data){
            if(data.elem.checked){
                vm.q.instanceStatus.push(data.value);
            }else{
                vm.q.instanceStatus=vm.q.instanceStatus.filter(t => t != data.value);
            }
            var set = new Set(vm.q.instanceStatus);
            vm.q.instanceStatus=Array.from(set);
        });

        form.on('select(transferReasonSerch)', function (data) {
            vm.q.transferReason = data.value;
        });

        form.on('select(lessorSelect)', function (data) {
            vm.q.lessor = data.value;
        });

        form.on('select(customTypeSelect)', function (data) {
            vm.q.customType = data.value;
        });

        form.on('select(costSettlement)', function (data) {
            vm.q.costSettlement = data.value;
        });

        form.on('select(responsiblePartyFilter)', function (data) {
            vm.q.responsibleParty = data.value;
        });

        form.on('select(outLevelFilter)', function (data) {
            vm.q.outLevel = data.value;
        });

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

    layui.laydate.render({
        elem: '#repairEndDate',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.repairEndDate=value;
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

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        businessContent:null,
        q:{
            instanceStatus:[1,2,6],
            orderNo:null,
            customName:null,
            carNo:null,
            lessor:null,
            applyUser:null,
            customType:null,
            businessType:1,
            transferTimeType:null,
            transferTimeStr:null,
            moveTimeType:null,
            moveTimeStr:null,
            modelId:null,
            transferReason:null,
            depotName:null,
            transferDepotName:null,
            applyTimeType:null ,
            applyTimeStr:null,
            serviceName:null,
            costSettlement:null,
            repairStartDate:null,
            repairEndDate:null,
            outLevel:null,
            responsibleParty:null,
            outDate:null
        },
        showForm: false,
        detailForm: false,
        processInstance: {},
        approveLog:{},
        applyTypeLst:[],
        applyTypeIndex: 0,
        lessorLst:[],
        transferReasonList:[],
        cols:[],
        isFilter:false,
        outLevelList:[],
        instanceStatusList:[
            {id:1,value:'审核中'},
            {id:2,value:'审核拒绝'},
            {id:3,value:'审核通过'},
            {id:5,value:'审核已撤销'},
            {id:6,value:'审核驳回'}
        ]
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
    mounted:function(){
        function reinitIframe(){
            var iframe = document.getElementById("processInstance");
            try{
                var bHeight = iframe.contentWindow.document.body.scrollHeight;
                var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
                var height = Math.max(bHeight, dHeight);
                iframe.height = height;
            }catch (ex){}
        };
        setInterval(reinitIframe,100);
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
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
            // 审核中
            vm.cols = [[
                {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                {field:'nodeName',align:"center", title: '审核环节',templet: function (d) {return isEmpty(d.nodeName)}},
                {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {return isEmpty(d.orderNo)}},
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
                {field:'waitTime',align:"center", title: '审核总耗时',templet: function (d) {return isEmpty(d.waitTime)}}
            ]];

            if(vm.q.businessType === 7){
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核环节',templet: function (d) {return isEmpty(d.nodeName)}},
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
                    {field:'waitTime',align:"center", title: '审核总耗时',templet: function (d) {return isEmpty(d.waitTime)}}
                ]];
            }
            if(vm.q.businessType === 8){
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
                    {field:'waitTime',align:"center", title: '审核总耗时',templet: function (d) {return isEmpty(d.waitTime)}},
                ]];
            }

            if(vm.q.businessType === 9){
                vm.cols = [[
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
                    {field:'waitTime',align:"center", title: '审核总耗时',rowspan:2,templet: function (d) {return isEmpty(d.waitTime)}},
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
                ]];
            }

            if(vm.q.businessType === 10){
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
                    {field:'waitTime',align:"center", title: '审核总耗时',rowspan:2,templet: function (d) {return isEmpty(d.waitTime)}},
                ]];
            }

            if(vm.q.businessType === 11){
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
                    {field:'waitTime',align:"center", title: '审核总耗时',rowspan:2,templet: function (d) {return isEmpty(d.waitTime)}},
                ]];
            }

            if(vm.q.businessType === 12){
                vm.cols = [[
                    {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
                    {field:'carNo',align:"center", title: '车牌号',fixed: "left",templet: function (d) {return isEmpty(d.carNo)}},
                    {field:'nodeName',align:"center", title: '审核节点',templet: function (d) {return isEmpty(d.nodeName)}},
                    {field:'auditStatus',align:"center", title: '审核状态',templet: function (d) {return isEmpty(d.auditStatus)}},
                    {field:'vinNo',align:"center", title: '车架号',templet: function (d) {return isEmpty(d.vinNo)}},
                    {field:'brandModel',align:"center", title: '品牌/车系/车型',templet: function (d) {return isEmpty(d.brandModel)}},
                    {field:'lessorName',align:"center", title: '出租方',templet: function (d) {return isEmpty(d.lessorName)}},
                    {field:'rentType',align:"center", title: '订单类型',templet: function (d) {return isEmpty(d.rentType)}},
                    {field:'orderNo',align:"center", title: '订单编号',templet: function (d) {return isEmpty(d.orderNo)}},
                    {field:'customName',align:"center", title: '客户名称',templet: function (d) {return isEmpty(d.customName)}},
                    {field:'customType',align:"center", title: '客户类型',templet: function (d) {return isEmpty(d.customType)}},
                    {field:'applyTime',align:"center", title: '发起时间',templet: function (d) {return isEmpty(d.applyTime)}},
                    {field:'applyUser',align:"center", title: '发起人',templet: function (d) {return isEmpty(d.applyUser)}},
                    {field:'waitTime',align:"center", title: '审核总耗时',rowspan:2,templet: function (d) {return isEmpty(d.waitTime)}},
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
                        url: baseURL + 'mark/processinstance/list',
                        where:{
                            "instanceStatus":vm.q.instanceStatus.join(','),
                            "businessType":vm.q.businessType,
                            "orderNo":vm.q.orderNo,
                            "customName":vm.q.customName,
                            "carNo":vm.q.carNo,
                            "lessor":vm.q.lessor,
                            "applyUser":vm.q.applyUser,
                            "customType":vm.q.customType,
                            "transferTimeType":vm.q.transferTimeType,
                            "transferTimeStr":vm.q.transferTimeStr,
                            "moveTimeType":vm.q.moveTimeType,
                            "moveTimeStr":vm.q.moveTimeStr,
                            "modelId":vm.q.modelId,
                            "transferReason":vm.q.transferReason,
                            "depotName":vm.q.depotName,
                            "transferDepotName":vm.q.transferDepotName,
                            "applyTimeType":vm.q.applyTimeType ,
                            "applyTimeStr":vm.q.applyTimeStr,
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
                        limits: [10,20, 50, 100],
                        limit: 10,
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
        initApplyTypeLst: function(){
            $.ajax({
                type: "POST",
                url: baseURL + "mark/processinstance/getApplyTypeLst",
                success: function (r) {
                    vm.applyTypeLst = r.applyTypeLst;
                }
            });
        },
        changeType: function(item,index){
            vm.applyTypeIndex = index;
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
        detail: function(data){
            console.log("processKey是（我申请的）："+data.processKey);
            var param = '';
            var url = '';
            if($.inArray(data.processKey, ['longRentOrderApprove','rentSaleOrderApprove','purchaseOrderApprove','meltsRentOrderApprove','affiliatedOrderApprove']) >= 0){
                param = {
                    id: data.businessId,
                    viewTag: 'show',
                    isApply: true
                };
                url = "modules/orderflow/orderflowedit.html";
            }else{
                param = {
                    id: data.businessId,
                    viewTag: 'applyDetail',
                    instanceId: data.instanceId,
                    instanceStatus: data.instanceStatus,
                    isApply: true,
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
                data: {"instanceId":data.id},
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
        rest: function(){
            vm.q.instanceStatus=[1,2,6];
            vm.q.orderNo=null;
            vm.q.customName=null;
            vm.q.carNo=null;
            vm.q.lessor=null;
            vm.q.applyUser=null;
            vm.q.customType=null;
            vm.q.transferTimeType = null;
            vm.q.transferTimeStr = null;
            vm.q.moveTimeType = null;
            vm.q.moveTimeStr = null;
            vm.q.modelId = null;
            vm.q.transferReason = null;
            vm.q.depotName = null;
            vm.q.transferDepotName = null;
            vm.q.applyTimeType = null;
            vm.q.applyTimeStr = null;
            vm.q.serviceName = null;
            vm.q.costSettlement = null;
            vm.q.repairStartDate = null;
            vm.q.repairEndDate = null;
            vm.q.outLevel = null;
            vm.q.responsibleParty = null;
            vm.q.outDate = null;
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
            vm.processInstance = {};

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
            $.get(baseURL + "mark/processinstance/info/"+id, function(r){
                vm.processInstance = r.processInstance;
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
                    url: baseURL + "mark/processinstance/delete",
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
            var url = vm.processInstance.id == null ? "mark/processinstance/save" : "mark/processinstance/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.processInstance),
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
            window.location.href = urlParamByObj(baseURL + 'mark/processinstance/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    instanceStatus:vm.q.instanceStatus.join(','),
                    orderNo:vm.q.orderNo,
                    customName:vm.q.customName,
                    carNo:vm.q.carNo,
                    lessor:vm.q.lessor,
                    applyUser:vm.q.applyUser,
                    customType:vm.q.customType,
                    businessType:vm.q.businessType,
                    transferTimeType:vm.q.transferTimeType,
                    transferTimeStr:vm.q.transferTimeStr,
                    moveTimeType:vm.q.moveTimeType,
                    moveTimeStr:vm.q.moveTimeStr,
                    modelId:vm.q.modelId,
                    transferReason:vm.q.transferReason,
                    depotName:vm.q.depotName,
                    transferDepotName:vm.q.transferDepotName,
                    applyTimeType:vm.q.applyTimeType ,
                    applyTimeStr:vm.q.applyTimeStr,
                    serviceName:vm.q.serviceName,
                    costSettlement:vm.q.costSettlement,
                    repairStartDate:vm.q.repairStartDate,
                    repairEndDate:vm.q.repairEndDate,
                    outLevel:vm.q.outLevel,
                    responsibleParty:vm.q.responsibleParty,
                    outDate:vm.q.outDate
                }
            });
        }
    }
});
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