$(function () {
    //操作
    layui.table.on('tool(test8)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'detail'){
            vm.detail(data.id);
        }
    });
});
var viewer;
var vm = new Vue({
    el: '#rrapp',
    data: {
        detailsTabContentList: ['车辆详情','车辆操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentList: [
            '车辆基础信息',
            '违章信息',
            '保险信息',
            '年检信息',
            '保养信息',
            '出险信息',
            '维修信息',
            '车辆订单记录',
            '车辆档案',
            '处置信息',
            '过户信息',
            '换牌信息',
            '车辆移库记录'
        ],
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '车辆基础信息',
        tCarBasic:{},
        fileLst:[],
        fileLstId: '0',
        cols:[[]],
        sourceDataList:[],
        obj:null,
        accessoryList:[],
        carColorList:[],
        carCountDto:{},
        illegalData:[],
        insuranceData:[],
        vehicleData:[],
        maintenanceData:[],
        outInsuranceData:[],
        repairData:[],
        orderData:[],
        moveHouseData:[],
        recordData:[],
        transferData:[],
        carDisposal:{},
        deliveryFileLst:[],
        disposalReasonList:[],
        vehicleCarList:[],
        sourceDetailContent:false,
        hpshow:true,
        czshow:true,
        balancePaymentLst:[],
        fileLst1:[]
    },
    created: function(){
        var _this = this;
        $.getJSON(baseURL + "sys/dict/getInfoByType/disposalReason", function (r) {
            _this.disposalReasonList = r.dict;
        });
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        impVehicle: function () {
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "年检数据导入";
            var param = {
                typeStr:'年检',
                templetUrl:'importData/clnj/clnjdr.xlsx',
                actionUrl:'maintenance/inspectionmanage/import',
                beanName:'io.xz.modules.maintenance.excel.InspectionManageBean'
            };
            addTab(url, title, param);
        },
        impInsurance: function () {//保险

        },
        impMaintenance: function () {//保养

        },
        impOutInsurance: function () {//出险

        },
        impRepair: function () {//维修

        },
        impOrder: function () {//订单

        },
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        showDoc: function (fileName, url) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        showImg: function() {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+vm.tCarBasic.imgDrivinglicenseFront,
                    title: '行驶证照片预览'
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        detail: function(id){
            $.get(baseURL + "car/carrecord/info/"+id, function(r){
                var index = layer.open({
                    title: "查看车辆档案",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/car/carrecorddetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.carRecord = r.carRecord;
                        iframe.vm.deliveryFileLst = r.carRecord.deliveryFileLst;
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
            });
        },
        update: function (id) {
            $.get(baseURL + "car/carrecord/info/"+id, function(r){
                var index = layer.open({
                    title: "修改车辆档案",
                    type: 2,
                    area: ['80%', '80%'],
                    content: tabBaseURL + "modules/car/carrecord.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.carRecord = r.carRecord;
                        if(r.carRecord.deliveryFileLst != null){
                            iframe.vm.deliveryFileLst = r.carRecord.deliveryFileLst;
                        }else{
                            iframe.vm.deliveryFileLst = [];
                        }
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/carrecord/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reloadRecordTable();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        addCarRecord:function(){
            var index = layer.open({
                title: "新增车辆档案",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/car/carrecord.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                    iframe.vm.carRecord.carId = vm.tCarBasic.id;
                },
                end: function(){
                    layer.close(index);
                }
            });
        },
        initAllGrid:function(){
            /**
             * 违章列表
             */
            layui.config({
                base: '../../statics/common/'
            }).extend({
                soulTable: 'layui/soultable/ext/soulTable.slim'
            });
            layui.use(['form', 'element', 'table', 'soulTable'], function () {
                soulTable = layui.soulTable
                layui.table.render({
                    id: "test1id",
                    elem: '#test1',
                    data:vm.illegalData,
                    cols: [[
                        {field:'contractNo', minWidth:100, title: '合同编号',align: "center",templet: function (d) {return isEmpty(d.contractNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'contact', minWidth:100, title: '联系电话',align: "center",templet: function (d) {return isEmpty(d.contact);}},
                        {field:'illegalContent', minWidth:100, title: '违章内容',align: "center",templet: function (d) {return isEmpty(d.illegalContent);}},
                        {field:'illegalAddr', minWidth:100, title: '违章地点',align: "center",templet: function (d) {return isEmpty(d.illegalAddr);}},
                        {field:'illegalTime', minWidth:100, title: '违章时间',align: "center",templet: function (d) {return isEmpty(d.illegalTime);}},
                        {field:'illegalPoints', minWidth:100, title: '扣分',align: "center",templet: function (d) {return isEmpty(d.illegalPoints);}},
                        {field:'illegalFine', minWidth:100, title: '违章罚款/元',align: "center",templet: function (d) {return isEmpty(d.illegalFine);}},
                        {field:'illegalHandleStatus', minWidth:100, title: '处理状态',align: "center",templet: function (d) {return isEmpty(d.illegalHandleStatus);}},
                        {field:'illegalLog', minWidth:100, title: '违章记录备注',align: "center",templet: function (d) {return isEmpty(d.illegalLog);}},
                        {field:'illegalLogDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.illegalLogDate);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: true,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test1id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 保险列表
                 */
                layui.table.render({
                    id: "test2id",
                    elem: '#test2',
                    data:vm.insuranceData,
                    cols: [
                        [
                            {rowspan: 2,field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                            {rowspan: 2,field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                            {field:'a', minWidth:100, title: '交强险',colspan:5,align:'center'},
                            {field:'b', minWidth:100, title: '商业险',colspan:6,align:'center'}
                        ],
                        [
                            {field:'applyNoQx', minWidth:100, title: '申请单号',align: "center",templet: function (d) {return isEmpty(d.applyNoQx);}},
                            {field:'applyTypeQx', minWidth:100, title: '保单时效',align: "center"},
                            {field:'insuranceStartQx', minWidth:100, title: '开始时间',align: "center",templet: function (d) {return isEmpty(d.insuranceStartQx);}},
                            {field:'insuranceEndQx', minWidth:100, title: '结束时间',align: "center",templet: function (d) {return isEmpty(d.insuranceEndQx);}},
                            {field:'insuranceFeeQx', minWidth:100, title: '费用/元',align: "center",templet: function (d) {return isEmpty(d.insuranceFeeQx);}},
                            {field:'applyNoSy', minWidth:100, title: '申请单号',align: "center",templet: function (d) {return isEmpty(d.applyNoSy);}},
                            {field:'applyTypeSy', minWidth:100, title: '保单时效',align: "center"},
                            {field:'insuranceTypeSy', minWidth:100, title: '险种',align: "center",templet: function (d) {return isEmpty(d.insuranceTypeSy);}},
                            {field:'insuranceStartSy', minWidth:100, title: '开始时间',align: "center",templet: function (d) {return isEmpty(d.insuranceStartSy);}},
                            {field:'insuranceEndSy', minWidth:100, title: '结束时间',align: "center",templet: function (d) {return isEmpty(d.insuranceEndSy);}},
                            {field:'insuranceFeeSy', minWidth:100, title: '总费用/元',align: "center",templet: function (d) {return isEmpty(d.insuranceFeeSy);}}
                        ],
                    ],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test2id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 年检列表
                 */
                layui.table.render({
                    id: "test3id",
                    elem: '#test3',
                    data:vm.vehicleData,
                    cols: [[
                        {field:'applyNo', minWidth:100, title: '年检申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'vehicleStatus', minWidth:100, title: '年检状态',align: "center",templet: function (d) {return isEmpty(d.vehicleStatus);}},
                        {field:'nowVehicleDate', minWidth:100, title: '本次年检时间',align: "center",templet: function (d) {return isEmpty(d.nowVehicleDate);}},
                        {field:'nextVehicleDate', minWidth:100, title: '下次年检时间',align: "center",templet: function (d) {return isEmpty(d.nextVehicleDate);}},
                        {field:'vehicleFee', minWidth:100, title: '费用/元',align: "center",templet: function (d) {return isEmpty(d.vehicleFee);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'vehicleLogDate', minWidth:100, title: '年检记录时间',align: "center",templet: function (d) {return isEmpty(d.vehicleLogDate);}},
                        {field:'vehicleLogUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.vehicleLogUser);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: true,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test3id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 保养列表
                 */
                layui.table.render({
                    id: "test4id",
                    elem: '#test4',
                    data:vm.maintenanceData,
                    cols: [[
                        {field:'applyNo', minWidth:100, title: '保养申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'nowMills', minWidth:100, title: '当前公里数',align: "center",templet: function (d) {return isEmpty(d.nowMills);}},
                        {field:'nextMills', minWidth:100, title: '下次保养公里数',align: "center",templet: function (d) {return isEmpty(d.nextMills);}},
                        {field:'nextMaintenanceDate', minWidth:100, title: '下次保养时间',align: "center",templet: function (d) {return isEmpty(d.nextMaintenanceDate);}},
                        {field:'serviceName', minWidth:100, title: '服务站名称',align: "center",templet: function (d) {return isEmpty(d.serviceName);}},
                        {field:'maintenanceItem', minWidth:100, title: '保养项目',align: "center",templet: function (d) {return isEmpty(d.maintenanceItem);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'maintenanceTotalFee', minWidth:100, title: '保养项目合计费用',align: "center",templet: function (d) {return isEmpty(d.maintenanceTotalFee);}},
                        {field:'maintenanceLogUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.maintenanceLogUser);}},
                        {field:'maintenanceLogDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.maintenanceLogDate);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test4id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 出险列表
                 */
                layui.table.render({
                    id: "test5id",
                    elem: '#test5',
                    data:vm.outInsuranceData,
                    cols: [[
                        {field:'applyNo', minWidth:100, title: '出险申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'receivableDate', minWidth:100, title: '接收时间',align: "center",templet: function (d) {return isEmpty(d.receivableDate);}},
                        {field:'outInsuranceDate', minWidth:100, title: '出险时间',align: "center",templet: function (d) {return isEmpty(d.outInsuranceDate);}},
                        {field:'outInsuranceAddr', minWidth:100, title: '出险地点',align: "center",templet: function (d) {return isEmpty(d.outInsuranceAddr);}},
                        {field:'user', minWidth:100, title: '报案人',align: "center",templet: function (d) {return isEmpty(d.user);}},
                        {field:'reason', minWidth:100, title: '出险经过及原因',align: "center",templet: function (d) {return isEmpty(d.reason);}},
                        {field:'qxInsuranceCompany', minWidth:100, title: '交强险公司',align: "center",templet: function (d) {return isEmpty(d.qxInsuranceCompany);}},
                        {field:'sxInsuranceCompany', minWidth:100, title: '商业险公司',align: "center",templet: function (d) {return isEmpty(d.sxInsuranceCompany);}},
                        {field:'level', minWidth:100, title: '事故等级',align: "center",templet: function (d) {return isEmpty(d.level);}},
                        {field:'responsibility', minWidth:100, title: '责任方',align: "center",templet: function (d) {return isEmpty(d.responsibility);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'logUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.logUser);}},
                        {field:'logDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.logDate);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test5id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 维修列表
                 */
                layui.table.render({
                    id: "test6id",
                    elem: '#test6',
                    data:vm.repairData,
                    cols: [[
                        {field:'applyNo', minWidth:100, title: '维修申请单',align: "center",templet: function (d) {return isEmpty(d.applyNo);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'repairStatus', minWidth:100, title: '维修状态',align: "center",templet: function (d) {return isEmpty(d.repairStatus);}},
                        {field:'repairStart', minWidth:100, title: '维修开始时间',align: "center",templet: function (d) {return isEmpty(d.repairStart);}},
                        {field:'repairEnd', minWidth:100, title: '维修结束时间',align: "center",templet: function (d) {return isEmpty(d.repairEnd);}},
                        {field:'faultDesc', minWidth:100, title: '故障描述',align: "center",templet: function (d) {return isEmpty(d.faultDesc);}},
                        {field:'repairServiceName', minWidth:100, title: '维修服务站',align: "center",templet: function (d) {return isEmpty(d.repairServiceName);}},
                        {field:'totalFee', minWidth:100, title: '费用结算',align: "center",templet: function (d) {return isEmpty(d.totalFee);}},
                        {field:'logUser', minWidth:100, title: '记录人',align: "center",templet: function (d) {return isEmpty(d.logUser);}},
                        {field:'logDate', minWidth:100, title: '记录时间',align: "center",templet: function (d) {return isEmpty(d.logDate);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test6id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 车辆订单记录
                 */
                layui.table.render({
                    id: "test7id",
                    elem: '#test7',
                    data: vm.orderData,
                    cols: [[
                        {field:'contractNo', minWidth:100, title: '合同编号',align: "center",templet: function (d) {return isEmpty(d.contractNo);}},
                        {field:'rentType', minWidth:100, title: '租赁类型',align: "center",templet: function (d) {return isEmpty(d.rentType);}},
                        {field:'orderNo', minWidth:100, title: '发车单号',align: "center",templet: function (d) {return isEmpty(d.orderNo);}},
                        {field:'orderStatus', minWidth:100, title: '状态',align: "center",templet: function (d) {return isEmpty(d.orderStatus);}},
                        {field:'statusExplain', minWidth:100, title: '车辆状态说明',align: "center",templet: function (d) {return isEmpty(d.statusExplain);}},
                        {field:'spareExplain', minWidth:100, title: '备用车说明',align: "center",templet: function (d) {return isEmpty(d.spareExplain);}},
                        {field:'customer', minWidth:100, title: '客户名称',align: "center",templet: function (d) {return isEmpty(d.customer);}},
                        {field:'rentStart', minWidth:100, title: '租赁开始时间',align: "center",templet: function (d) {return isEmpty(d.rentStart);}},
                        {field:'rentEnd', minWidth:100, title: '租赁结束时间',align: "center",templet: function (d) {return isEmpty(d.rentEnd);}},
                        {field:'getCarDate', minWidth:100, title: '提车时间',align: "center",templet: function (d) {return isEmpty(d.getCarDate);}},
                        {field:'returnCarDate', minWidth:100, title: '实际还车时间',align: "center",templet: function (d) {return isEmpty(d.returnCarDate);}},
                        {field:'useDays', minWidth:100, title: '使用总天数',align: "center",templet: function (d) {return isEmpty(d.useDays);}},
                        {field:'balanceType', minWidth:100, title: '欠款类型',align: "center",templet: function (d) {return isEmpty(d.balanceType);}},
                        {field:'balanceFee', minWidth:100, title: '欠款金额/元',align: "center",templet: function (d) {return isEmpty(d.balanceFee);}},
                        {field:'handleCarMills', minWidth:100, title: '交车公里数',align: "center",templet: function (d) {return isEmpty(d.handleCarMills);}},
                        {field:'returnCarMills', minWidth:100, title: '退车公里数',align: "center",templet: function (d) {return isEmpty(d.returnCarMills);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test7id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 车辆档案
                 */
                layui.table.render({
                    id: "test8id",
                    elem: '#test8',
                    data: vm.recordData,
                    cols: [[
                        {title: '操作', width: 120, templet: '#barTpl', fixed:"left",align:"center"},
                        {field:'recordName', minWidth:100, title: '档案名称',align: "center",templet: function (d) {return isEmpty(d.recordName);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'uploadTime', minWidth:100, title: '上传时间',align: "center",templet: function (d) {return isEmpty(d.uploadTime);}},
                        {field:'uploadUserName', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.uploadUserName);}}

                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test8id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 换牌信息
                 */
                layui.table.render({
                    id: "test13id",
                    elem: '#test13',
                    data: vm.vehicleCarList,
                    cols: [[
                        {field:'oldCarNo', minWidth:100, title: '更换之前的车牌号',align: "center",templet: function (d) {return isEmpty(d.oldCarNo);}},
                        {field:'vinNo', minWidth:100, title: '车架号',align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
                        {field:'isVehicleCarPhoto', minWidth:100, title: '是否更换行驶证',align: "center",templet: function (d) {
                            if(d.isVehicleCarPhoto == 1){
                                return '否';
                            }else if(d.isVehicleCarPhoto == 2){
                                return '是'
                            }else{
                                return '--';
                            }
                            }},
                        {field:'newCarNo', minWidth:100, title: '新更换的车牌号',align: "center",templet: function (d) {return isEmpty(d.newCarNo);}},
                        {field:'vehicleRemark', minWidth:100, title: '换牌原因',align: "center",templet: function (d) {return isEmpty(d.vehicleRemark);}},
                        {field:'oldDriverImg', minWidth:100, title: '更换之前的行驶证附件',align: "center"
                                ,templet: function (d) {
                                    if(d.oldDriverImg!=null && d.oldDriverImg !=''){
                                        return "<span style='color:#419BEA;cursor:pointer;' onclick=checkFJ(\'"+d.oldDriverImg+"\')>查看</span>";
                                    }else{
                                        return '--';
                                    }
                                }
                        },
                        {field:'newDriverImg', minWidth:100, title: '新更换的行驶证附件',align: "center"
                            ,templet: function (d) {
                                if(d.newDriverImg!=null && d.newDriverImg!=''){
                                    return "<span style='color:#419BEA;cursor:pointer;' onclick=checkFJ(\'"+d.newDriverImg+"\')>查看</span>";
                                }else{
                                    return '--';
                                }
                            }
                        },
                        {field:'operateTime', minWidth:100, title: '更换操作时间',align: "center",templet: function (d) {return isEmpty(d.operateTime);}},
                        {field:'operator', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.operator);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test8id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });

                /**
                 * 车辆过户信息
                 */
                layui.table.render({
                    id: "test12id",
                    elem: '#test12',
                    data: vm.transferData,
                    cols: [[
                        {field:'estimatedTransferTime', minWidth:100, title: '预计过户时间',align: "center",templet: function (d) {return isEmpty(d.estimatedTransferTime);}},
                        {field:'transferTime', minWidth:100, title: '实际过户时间',align: "center",templet: function (d) {return isEmpty(d.transferTime);}},
                        {field:'remarks', minWidth:100, title: '备注信息',align: "center",templet: function (d) {return isEmpty(d.remarks);}},
                        {field:'file', minWidth:100, title: '过户资料',align: "center",templet:function(d){
                                if(d.file==0){
                                    return '--';
                                }else{
                                    return '<span style="color:blue;cursor:pointer;" onclick="previewFile(\''+d.transferId+'\')">查看</span>'
                                }
                            }},
                        {field:'createTime', minWidth:100, title: '操作时间',align: "center",templet: function (d) {return isEmpty(d.createTime);}},
                        {field:'operator', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.operator);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test12id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });


                /**
                 * 车辆移库记录
                 */
                layui.table.render({
                    id: "test10id",
                    elem: '#test10',
                    data: vm.moveHouseData,
                    cols: [[
                        {field:'carPlateNo', minWidth:100, title: '车牌号',fixed: "left",align: "center",templet: function (d) {return isEmpty(d.carPlateNo);}},
                        {field:'vinNo', minWidth:100, title: '车架号',align: "center",templet: function (d) {return isEmpty(d.vinNo);}},
                        {field:'carBrandSeriesModelName', minWidth:100, title: '品牌/车系/车型',align: "center",templet: function (d) {return isEmpty(d.carBrandSeriesModelName);}},
                        {field:'moveType', minWidth:100, title: '移库类型',align: "center",templet: function (d) {return isEmpty(d.moveType);}},
                        {field:'outHouseName', minWidth:100, title: '移出仓库',align: "center",templet: function (d) {return isEmpty(d.outHouseName);}},
                        {field:'intoHouseName', minWidth:100, title: '移入仓库',align: "center",templet: function (d) {return isEmpty(d.intoHouseName);}},
                        {field:'transferTime', minWidth:100, title: '移库时间',align: "center",templet: function (d) {return isEmpty(d.transferTime);}},
                        {field:'remark', minWidth:100, title: '备注',align: "center",templet: function (d) {return isEmpty(d.remark);}},
                        {field:'operatorDate', minWidth:100, title: '操作时间',align: "center",templet: function (d) {return isEmpty(d.operatorDate);}},
                        {field:'operator', minWidth:100, title: '操作人',align: "center",templet: function (d) {return isEmpty(d.operator);}}
                    ]],
                    page: false,
                    limit: 500,
                    loading: false,
                    autoColumnWidth: {
                        init: true
                    },
                    done: function () {
                        soulTable.render(this);
                        $('div[lay-id="test10id"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                        $(".layui-table-main tr").each(function (index, val) {
                            $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                            $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                        });
                    }
                });
            });
        },
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '车辆操作纪录';
                vm.reloadOperatorLog();
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '车辆基础信息';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },

        initEditData : function(carId,businessType){
            $.ajax({
                type: "POST",
                url: baseURL + 'car/tcarbasic/detailInfo/' + carId,
                contentType: "application/json",
                success: function (r) {
                    vm.tCarBasic = r.detailInfo.tCarBasic;
                    if(businessType === 34){
                        vm.tCarBasic.businessTypeStr = '直购-已过户';
                    }
                    vm.carCountDto = r.detailInfo.carCountDto;
                    vm.tCarBasic.brandSeriesModelName = r.detailInfo.tCarBasic.brandName + '/' + r.detailInfo.tCarBasic.seriesName + '/' + r.detailInfo.tCarBasic.modelName ;
                    if(r.detailInfo.tCarBasic.imgDrivinglicenseFront!=null && r.detailInfo.tCarBasic.imgDrivinglicenseFront!=''){
                        $("#imgDrivinglicenseFront").prop("src",imageURL+r.detailInfo.tCarBasic.imgDrivinglicenseFront);
                    }
                    vm.fileLst = r.detailInfo.tCarBasic.fileLst;
                    vm.sourceDataList = r.detailInfo.sourceDataList;
                    vm.accessoryList = r.detailInfo.tCarBasic.items;
                    if(vm.sourceDataList!=null && vm.sourceDataList.length>0 ){
                        vm.sourceDetailContent = true;
                        vm.balancePaymentLst = r.detailInfo.balancePaymentLst;
                        vm.fileLst1 = r.detailInfo.fileLst1;
                        vm.editSourceGrid(vm.tCarBasic.sourceType);
                    }
                    if(r.detailInfo.illegalData!=null && r.detailInfo.illegalData.length>0){
                        vm.illegalData = r.detailInfo.illegalData;
                    }
                    if(r.detailInfo.insuranceData!=null && r.detailInfo.insuranceData.length>0){
                        vm.insuranceData = r.detailInfo.insuranceData;
                    }
                    if(r.detailInfo.vehicleData!=null && r.detailInfo.vehicleData.length>0){
                        vm.vehicleData = r.detailInfo.vehicleData;
                    }
                    if(r.detailInfo.maintenanceData!=null && r.detailInfo.maintenanceData.length>0){
                        vm.maintenanceData = r.detailInfo.maintenanceData;
                    }
                    if(r.detailInfo.outInsuranceData!=null && r.detailInfo.outInsuranceData.length>0){
                        vm.outInsuranceData = r.detailInfo.outInsuranceData;
                    }
                    if(r.detailInfo.repairData!=null && r.detailInfo.repairData.length>0){
                        vm.repairData = r.detailInfo.repairData;
                    }
                    if(r.detailInfo.orderData!=null && r.detailInfo.orderData.length>0){
                        vm.orderData = r.detailInfo.orderData;
                    }
                    if(r.detailInfo.moveHouseData!=null && r.detailInfo.moveHouseData.length>0){
                        vm.moveHouseData = r.detailInfo.moveHouseData;
                    }
                    if(r.detailInfo.transferData!=null && r.detailInfo.transferData.length>0){
                        vm.transferData = r.detailInfo.transferData;
                    }
                    if(r.detailInfo.recordData!=null && r.detailInfo.recordData.length>0){
                        vm.recordData = r.detailInfo.recordData;
                    }else{
                        vm.recordData = [];
                    }
                    if(r.detailInfo.carDisposal!=null){
                        vm.carDisposal = r.detailInfo.carDisposal;
                        vm.deliveryFileLst = r.detailInfo.carDisposal.fileLst;
                    }else{
                        vm.detailsSupTabContentList=vm.detailsSupTabContentList.filter(t => t != "处置信息");
                        vm.czshow = false;
                    }
                    if(r.detailInfo.vehicleLog!=null&&r.detailInfo.vehicleLog.length>0){
                        vm.vehicleCarList = r.detailInfo.vehicleLog;
                    }else{
                        vm.detailsSupTabContentList=vm.detailsSupTabContentList.filter(t => t != "换牌信息");
                        vm.hpshow = false;
                    }
                    vm.initAllGrid();
                    vm.initOperatorLog();
                }
            });
        },
        initOperatorLog: function(){
            /**
             * 车辆操作纪录
             */
            layui.table.render({
                id: 'test11id',
                elem: '#test11',
                url: baseURL + 'sys/log/operationLogLst',
                where: {
                    businessNo: vm.tCarBasic.id,
                    auditType: 11
                },
                cols: [[
                    {field:'operatorName', title: '操作人', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.operatorName);}},
                    {field:'memo', title: '操作内容', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.memo);}},
                    {field:'timeCreate', title: '操作时间', minWidth:200, align: "center",templet: function (d) {return isEmpty(d.timeCreate);}},
                ]],
                page: true,
                loading: false,
                limits: [10, 20, 50, 100],
                limit: 10
            });
        },
        editSourceGrid: function(sourceType){
            vm.initCols(sourceType);
            vm.initGrid();
        },
        initCols: function(sourceType){
            vm.cols = [[
                {field: 'contractNo',width:300, title: '车辆来源合同'},
                {field: 'supplierName',width:300, title: '供应商'},
                {field: 'purchasePlan',width:300, title: '采购方案', templet: '#barPlanTpl'}
            ]];
        },
        initGrid: function(){
            layui.table.render({
                elem: '#grid',
                id: "gridid",
                cols: vm.cols,
                done: function (res, curr, count) {
                    if(vm.sourceDataList[0].carSourceType!=null && vm.sourceDataList[0].carSourceType != ''){
                        if(vm.sourceDataList[0].carSourceType == 1){
                            $('td[data-field="sourceTypeName"]>div').html('直购');
                        }
                        if(vm.sourceDataList[0].carSourceType == 2){
                            $('td[data-field="sourceTypeName"]>div').html('长租');
                        }
                        if(vm.sourceDataList[0].carSourceType == 3){
                            $('td[data-field="sourceTypeName"]>div').html('以租代购');
                        }
                    }
                    if(vm.sourceDataList[0].refundType!=null && vm.sourceDataList[0].refundType != ''){
                        if(vm.sourceDataList[0].refundType == 1){
                            $('td[data-field="refundType"]>div').html('金融公司');
                        }
                        if(vm.sourceDataList[0].refundType == 2){
                            $('td[data-field="refundType"]>div').html('平台');
                        }
                    }
                    if(vm.sourceDataList[0].isCreateOrder!=null && vm.sourceDataList[0].isCreateOrder != ''){
                        if(vm.sourceDataList[0].isCreateOrder == 1){
                            $('td[data-field="isCreateOrder"]>div').html('否');
                        }
                        if(vm.sourceDataList[0].isCreateOrder == 2){
                            $('td[data-field="isCreateOrder"]>div').html('是');
                        }
                    }
                    layui.form.render();
                },
                limit: 500,
                page: false,limit: 500,
            });
            layui.table.on('tool(grid)', function (obj) {
                vm.obj = obj;
                var newdata = {};
                if (obj.event === 'date') {
                    var field = $(this).data('field');
                    layui.laydate.render({
                        elem: this.firstChild
                        , show: true //直接显示
                        , closeStop: this
                        , done: function (value, date) {
                            newdata[field] = value;
                            obj.update(newdata);
                            if(field == 'purchaseDate'){
                                vm.sourceDataList[0].purchaseDate = value;
                            } else if (field == 'rentStartDate') {
                                vm.sourceDataList[0].rentStartDate = value;
                            } else if (field == 'rentEndDate') {
                                vm.sourceDataList[0].rentEndDate = value;
                            }
                        }
                    });
                }else if (obj.event === 'selectSupplier'){
                    var index = layer.open({
                        title: "选择供应商",
                        type: 2,
                        area: ['80%', '80%'],
                        content: tabBaseURL + "modules/common/selectsupplier.html",
                        end: function(){
                            layer.close(index);
                        }
                    });
                }else if(obj.event === 'detailPlan'){
                    vm.detailPlan();
                }
            });
            vm.reloadSourceTable();
        },
        reloadSourceTable: function(){
            layui.table.reload('gridid', {
                data: vm.sourceDataList
            });
        },
        reloadRecordTable: function(){
            vm.initEditData(vm.tCarBasic.carId);
            layui.table.reload('test8id', {
                data: vm.recordData
            });
        },
        reloadOperatorLog: function(){
            layui.table.reload('test11id', {
                page: {
                    curr: 1
                },
                where: {
                    businessNo: vm.tCarBasic.id,
                    auditType: 11
                }
            });
        },
        detailPlan:function(){
            var url;
            var title;
            if(vm.tCarBasic.sourceType != null && vm.tCarBasic.sourceType != ''){
                if(vm.tCarBasic.sourceType === '1' || vm.tCarBasic.sourceType === 1){
                    title = '查看直购方案';
                    url = tabBaseURL + "modules/car/directpurchase.html";
                }else if(vm.tCarBasic.sourceType === '2' || vm.tCarBasic.sourceType === 2){
                    title = '查看长租方案'
                    url = tabBaseURL + "modules/car/longrent.html";
                }else if(vm.tCarBasic.sourceType === '3' || vm.tCarBasic.sourceType === 3){
                    title = '查看以租代购方案';
                    url = tabBaseURL + "modules/car/leasepurchase.html";
                }
                var index = layer.open({
                    title: title,
                    type: 2,
                    content: url,
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.isDetail = true;
                        iframe.vm.promptFlag = false;
                        iframe.vm.initFeeItem();
                        iframe.vm.carBasicSource = Object.assign({},iframe.vm.carBasicSource,vm.sourceDataList[0]);
                        iframe.vm.balancePaymentLst = vm.balancePaymentLst;
                        iframe.vm.fileLst = vm.fileLst1;
                        iframe.vm.feeItemId = vm.sourceDataList[0].feeItemId;
                        iframe.vm.reloadFeeItem();
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }
        }
    }
});

function checkFJ(url){
    if (viewer != null) {
        viewer.close();
        viewer = null;
    }
    viewer = new PhotoViewer([
        {
            src: imageURL + url,
            title: "驾驶证查看"
        }
    ], {
        appendTo: 'body',
        zIndex: 99891018
    });
}

function previewFile(transferId){
    var index = layer.open({
        title: '过户资料查看',
        type: 2,
        content: tabBaseURL + "modules/car/file.html",
        success: function(layero,num){
            var iframe = window['layui-layer-iframe'+num];
            iframe.vm.initTransferData(transferId,26);
        },
        end: function () {
            layer.closeAll();
        }
    });
    layer.full(index);
}


function imageDetail(){
    if(vm.tCarBasic.imgDrivinglicenseFront!=null &&  vm.tCarBasic.imgDrivinglicenseFront!=''){
        previewImage(imageURL + vm.tCarBasic.imgDrivinglicenseFront);
    }

}
