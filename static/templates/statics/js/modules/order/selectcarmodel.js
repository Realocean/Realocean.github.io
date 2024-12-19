$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'order/order/carModelList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
                        {field:'brandName', minWidth:200, title: '品牌', templet: function (d) {return isEmpty(d.brandName);}},
                        {field:'seriesName', minWidth:200, title: '车系', templet: function (d) {return isEmpty(d.seriesName);}},
                        {field:'modelName', minWidth:200, title: '车型', templet: function (d) {return isEmpty(d.modelName);}},
                        {field:'artsVisionName', minWidth:200, title: '所属公司', templet: function (d) {return isEmpty(d.artsVisionName);}},
                        {title: '操作', width:200, templet:'#barTpl',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10,
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selector(data);
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
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            deptId: '',
            brandId: '',
            seriesId: '',
            modelId: '',
            hasAvailableCar: true
        },
        deptLst: [],
        brandLst: [],
        seriesLst: [],
        modelLst: []
},
created: function(){
    var _this = this;
    _this.deptLst = getDeptLst();
    _this.brandLst = getBrandLst();
    _this.seriesLst = getSeriesLst();
    _this.modelLst = getModelLst();
},
updated: function(){
    layui.form.render();
},
methods: {
    query: function () {
        vm.reload();
    },
    reset: function () {
        vm.q.deptId = '';
        vm.q.brandId = '';
        vm.q.seriesId = '';
        vm.q.modelId = '';
    },
    selector: function (data) {
        if (parent.vm.order.plan.modelId != data.modelId) {
            parent.vm.resetCar();
            // parent.vm.resetContract();
            // parent.vm.getContractLst(data.modelId);
        }
        parent.vm.order.plan = Object.assign({}, parent.vm.order.plan, {
            brandId: data.brandId,
            brandName: data.brandName,
            seriesId: data.seriesId,
            seriesName: data.seriesName,
            modelId: data.modelId,
            modelName: data.modelName
        });
        parent.vm.order.orderCar = Object.assign({}, parent.vm.order.orderCar, {
            brandId: data.brandId,
            brandName: data.brandName,
            seriesId: data.seriesId,
            seriesName: data.seriesName,
            modelId: data.modelId,
            modelName: data.modelName
        });
        parent.vm.reloadPlan();
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },
    reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: JSON.parse(JSON.stringify(vm.q))
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
