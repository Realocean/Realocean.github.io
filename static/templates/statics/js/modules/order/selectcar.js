$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'car/tcarbasic/selectOrderCarLst',
            where: {
                orderCarId: vm.q.orderCarId,
                brandId: vm.q.brandId,
                seriesId: vm.q.seriesId,
                modelId: vm.q.modelId,
            },
            cols: [[
                {title: '操作', width:100, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'carNo', fixed: "left",title: '车牌号',align:"center", templet: function (d) {return isEmpty(d.carNo);}},
                {field:'modelSeriesName', title: '车辆品牌/车系/车型', templet: function (d) {return isEmpty(d.modelSeriesName);}},
                {field:'vinNo', title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field:'carStatus', title: '车辆状态', templet: function (d) {return isEmpty(d.carStatus);}},
                {field:'insurance', title: '保险'},
                {field:'insuranceItems', title: '商业险险种', templet: function (d) {return isEmpty(d.insuranceItems);}},
                {field:'annualSurvey', title: '年检'},
                {field:'mileage', title: '当前里程/km', templet: function (d) {return isEmpty(d.mileage);}},
                {field:'electricQuantity', title: '车辆所属仓库', templet: function (d) {return isEmpty(d.depotName);}},
                {field:'accessoryItemsName', title: '随车物品' ,templet: function (d) {return isEmpty(d.accessoryItemsName)}},
                {field:'deptName', title: '所属公司', templet: function (d) {return isEmpty(d.deptName);}},

            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function(res, curr, count){
                layui.soulTable.render(this);
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            }
        });

        layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            form.render();
        });

        layui.table.on('tool(grid)', function (obj) {
            var layEvent = obj.event,
                data = obj.data;
            if (obj.event === 'selectCarInfor') {
                vm.selectCarInfor(data);
            }
        });

        layui.form.on('select(dept)', function (data) {
            vm.q.deptId = data.value;
        });

        layui.form.on('select(brand)', function (data) {
            vm.q.brandId = data.value;
            vm.q.seriesId = '';
            vm.q.modelId = '';
            vm.seriesLst = getSeriesLst();
            vm.modelLst = getModelLst();
        });

        layui.form.on('select(series)', function (data) {
            vm.q.seriesId = data.value;
            vm.q.modelId = '';
            vm.modelLst = getModelLst();
        });

        layui.form.on('select(model)', function (data) {
            vm.q.modelId = data.value;
        });
        layui.form.render();
    });
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            orderCarId: null,
            carNo: null,
            vinNo: null,
            deptId: '',
            brandId: '',
            seriesId: '',
            modelId: ''
        },
        selected:0,
        selectedData:{},
        deptLst: [],
        brandLst: [],
        seriesLst: [],
        modelLst: [],
        canResetModel: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.q.orderCarId = param.orderCarId;
        _this.q.brandId = param.brandId;
        _this.q.seriesId = param.seriesId;
        _this.q.modelId = param.modelId;
        _this.canResetModel = _this.q.brandId == null || _this.q.brandId == '' || _this.q.seriesId == null || _this.q.seriesId == '' || _this.q.modelId == null || _this.q.modelId == '';
        if (_this.canResetModel) {
            $('#brand').removeAttr("disabled");
            $('#series').removeAttr("disabled");
            $('#model').removeAttr("disabled");
        }
        _this.deptLst = getDeptLst();
        _this.brandLst = getBrandLst();
        _this.seriesLst = getSeriesLst();
        _this.modelLst = getModelLst();
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        reset: function () {
            vm.q.carNo = null;
            vm.q.vinNo = null;
            vm.q.deptId = '';
            if (vm.canResetModel){
                vm.q.brandId = '';
                vm.q.seriesId = '';
                vm.q.modelId = '';
            }
        },
        query: function () {
            vm.reload();
        },
        selectCarInfor:function(data){
            parent.vm.order.orderCar = Object.assign({}, parent.vm.order.orderCar, {
                carId:data.carId,
                carNo:data.carNo,
                vinNo:data.vinNo,
                deptId:data.deptId,
                deptName:data.deptName,
                depotId:data.depotId,
                depotName:data.depotName,
                cityId:data.cityId,
                cityName:data.cityName,
                mileage:data.mileage,
                accessoryItems:data.accessoryItems,
                accessoryItemsName:data.accessoryItemsName,
                depotCityName:data.depotCityName,
                brandSeriesName:data.brandSeriesName,
                modelName:data.modelName
            });
            parent.vm.order.plan = Object.assign({}, parent.vm.order.plan, {
                brandId:data.brandId,
                brandName:data.brandName,
                seriesId:data.seriesId,
                seriesName:data.seriesName,
                modelId:data.modelId,
                modelName:data.modelName
            });
            if (data.accessoryItemsName != null){
                parent.vm.accessoryItems = data.accessoryItemsName.split(',');
            }else parent.vm.accessoryItems = [];
            parent.vm.carUpdateId = 'carUpdateId_' + uuid(6);
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    orderCarId: vm.q.orderCarId,
                    carNo: vm.q.carNo,
                    vinNo: vm.q.vinNo,
                    deptId: vm.q.deptId,
                    brandId: vm.q.brandId,
                    seriesId: vm.q.seriesId,
                    modelId: vm.q.modelId,
                }
            });
        }
    }
});


function getDeptLst() {
    var datas;
    $.ajax({
        type: "POST",
        url: baseURL + 'sys/dept/listAll',
        contentType: "application/json",
        async: false,
        success: function (r) {
            datas = r.deptList;
        }
    });
    return datas;
}

function getBrandLst() {
    var datas;
    var param = {};
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/brandLst',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(param),
        success: function (r) {
            datas = r.brandLst;
        }
    });
    return datas;
}
function getSeriesLst() {
    var datas;
    var param = {};
    if (vm != null && vm.q != null){
        param.brandId = vm.q.brandId;
    }
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/seriesLst',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(param),
        success: function (r) {
            datas = r.seriesLst;
        }
    });
    return datas;
}
function getModelLst() {
    var datas;
    var param = {};
    if (vm != null && vm.q != null){
        param.brandId = vm.q.brandId;
        param.seriesId = vm.q.seriesId;
    }
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/modelLst',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(param),
        success: function (r) {
            datas = r.modelLst;
        }
    });
    return datas;
}
