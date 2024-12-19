var dept;
var depot;
var businessType;
$(function () {

    /***
     * 页面初始化根据车牌号赋值
     */
    if(parent.layui.larryElem != undefined){
        var params = parent.layui.larryElem.boxParams;
        vm.q.carPlateNo1 = params.carNo;
    }
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            cascader({
                elem: "#a",
                data: vm.selectData,
                success: function (valData,labelData) {
                    vm.q.modelId = valData[2];
                    vm.q.modelName = labelData[2];
                }
            });
        });
    });
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'car/carillegal/queryIllegalLst',
            where: {'isInit':1},
            cols: [[
                {
                    title: '操作', width: 60, align: "center", fixed: "left", templet: function (d) {
                        if (d.illegalId != null) {
                            return "<a class='layui-grid-btn-xs' onclick='showDetail(\"" + d.illegalId + '","' + d.orderStatus + "\");'>记录</a>";
                        }
                    }
                },
                {
                    field: 'carPlateNo', minWidth: 100, title: '车牌号',fixed: "left", align: "center", templet: function (d) {
                        return isEmpty(d.carPlateNo)
                    }
                },
                {
                    field: 'vinNo', minWidth: 100, title: '车架号', align: "center", templet: function (d) {
                        return isEmpty(d.vinNo)
                    }
                },
                {
                    field: 'brandModel', minWidth: 100, title: '品牌/车系/车型', align: "center", templet: function (d) {
                        return isEmpty(d.brandModel)
                    }
                },
                {
                    field: 'deptName', minWidth: 100, title: '车辆归属', align: "center", templet: function (d) {
                        return isEmpty(d.deptName)
                    }
                },
                {
                    field: 'carOwner', minWidth: 100, title: '车辆所有人', align: "center", templet: function (d) {
                        return isEmpty(d.carOwner)
                    }
                },
                {
                    field: 'depotName', minWidth: 100, title: '所在仓库', align: "center", templet: function (d) {
                        return isEmpty(d.depotName)
                    }
                },
                {
                    field: 'orderNo', minWidth: 100, title: '车辆订单号', align: "center", templet: function (d) {
                        return isEmpty(d.orderNo)
                    }
                },
                {
                    field: 'memberName', minWidth: 100, title: '客户名称', align: "center", templet: function (d) {
                        return isEmpty(d.memberName);
                    }
                },
                {
                    field: 'illegalTimeStr',
                    minWidth: 150,
                    title: '违章时间',

                    align: "center",
                    templet: function (d) {
                        return isEmpty(d.illegalTimeStr);
                    }
                },
                {
                    field: 'illegalDetail', minWidth: 100, title: '违章内容', align: "center", templet: function (d) {
                        return isEmpty(d.illegalDetail);
                    }
                },
                {
                    field: 'illegalLocation', minWidth: 100, title: '违章地点', align: "center", templet: function (d) {
                        return isEmpty(d.illegalLocation);
                    }
                },
                {
                    field: 'pointsDeduction',
                    minWidth: 100,
                    title: '扣分',

                    align: "center",
                    templet: function (d) {
                        return isEmpty(d.pointsDeduction);
                    }
                },
                {
                    field: 'illegalFines',
                    minWidth: 100,
                    title: '罚款/元',

                    align: "center",
                    templet: function (d) {
                        return isEmpty(d.illegalFines);
                    }
                },
                {
                    field: 'updateTimeStr',
                    minWidth: 100,
                    title: '查询时间',

                    align: "center",
                    templet: function (d) {
                        return isEmpty(d.updateTimeStr);
                    }
                },
                {
                    field: 'processingStatus', minWidth: 100, title: '处理状态', align: "center", templet: function (d) {
                        if (d.processingStatus == 0) {
                            return "未处理";
                        } else if (d.processingStatus == 1) {
                            return "处理中";
                        } else if (d.processingStatus == 2) {
                            return "已处理";
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: 'handleContent', minWidth: 130, title: '违章记录备注', align: "center", templet: function (d) {
                        return isEmpty(d.handleContent);
                    }
                },
                {
                    field: 'handleTime', minWidth: 100, title: '处理记录时间', align: "center", templet: function (d) {
                        return dateFormatYMDHM(d.handleTime);
                    }
                },

            ]],
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function () {
                soulTable.render(this);
            }
        });
    });
    $.ajax({
        type: "POST",
        url: baseURL + "car/carillegal/selectInit",
        success: function (r) {
            if(r.headCount.length > 0){
                vm.carIllegalCount = r.headCount[0].num;
            }
            dept = xmSelect.render({
                el: '#dept',
                filterable: true,
                data:r.deptLst
            })

            depot = xmSelect.render({
                el: '#depot',
                filterable: true,
                data:r.depotLst
            });
        }
    });

     businessType = xmSelect.render({
        el: '#businessType',
        filterable: true,
        toolbar: {
            show: true
        },
        data: [
            {name: '整备中', value: 1},
            {name: '备发车', value: 2},
            {name: '预定中', value: 3},
            {name: '用车中', value: 4},
            // {name: '已过户', value: 5},
            // {name: '已处置', value: 6},
            // {name: '已出售', value: 7},
        ]
    })
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carPlateNo1:null,
            carPlateNo2:null,
            carOwner1:null,
            carOwner2:null,
            businessType:null,
            deptId:null,
            deptName:null,
            depotId:null,
            depotName:null,
            modelId:null,
            modelName:null,
            carId:null
        },
        carIllegalCount:0,
        carIdLst:[],
        carNoLst:[]
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        callback:function(data){
            data.forEach(v=>{
                vm.carIdLst.push(v.carId);
                vm.carNoLst.push(v.carNo);
            });
            vm.q.carPlateNo2 = vm.carNoLst.join(',');
            vm.q.carId = vm.carIdLst.join(',');
        },
        queryIllegal:function(){
            var index = layer.open({
                title: "选择车辆",
                type: 2,
                content: tabBaseURL + "modules/common/selectcarillegal.html",
                success: function(layero,num){
                    var iframe = window['layui-layer-iframe'+num];
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        query1:function(){
            vm.reload();
        },
        reset1:function(){
            vm.q.carPlateNo1 = null;
            vm.q.carOwner1 = null;
        },
        query2:function(){
            vm.q.businessType = businessType.getValue('valueStr');
            vm.q.deptId = dept.getValue('valueStr');
            vm.q.depotId = depot.getValue('valueStr');
            vm.reload();
        },
        reset2:function(){
            vm.q.carPlateNo2 = null;
            vm.q.deptId = null;
            vm.q.deptName = null;
            vm.q.depotId = null;
            vm.q.depotName = null;
            vm.q.modelId = null;
            vm.q.modelName = null;
            vm.q.businessType = null;
            vm.q.carId = null;
            vm.q.carOwner2 = null;
            $('#a').val('');
            dept.setValue([ ]);
            depot.setValue([ ]);
            businessType.setValue([ ]);
        },
        reload:function(){
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    isInit:2,
                    carPlateNo1:vm.q.carPlateNo1,
                    carOwner1:vm.q.carOwner1,
                    carOwner2:vm.q.carOwner2,
                    carId:vm.q.carId,
                    deptId:vm.q.deptId,
                    deptName:vm.q.deptName,
                    depotId:vm.q.depotId,
                    depotName:vm.q.depotName,
                    modelId:vm.q.modelId,
                    modelName:vm.q.modelName,
                    businessType:vm.q.businessType
                }
            });
        }
    }
});


