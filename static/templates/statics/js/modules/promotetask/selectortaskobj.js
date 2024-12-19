$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    layui.table.render({
        id: "scaid",
        elem: '#sca',
        data: [],
        url: baseURL + 'promotetask/promotetasktask/activityPage',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',align:"center"},
            {field:'scaType', title: '活动类型', minWidth:200, templet: function (d) {return transformTypeByMap(d.scaType, {1:'秒杀活动',2:'集客活动',3:'同行活动',4:'抽奖活动'});}},
            {field:'scaName', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.scaName);}},
            {field:'scaShopName', title: '活动门店', minWidth:200, templet: function (d) {return isEmpty(d.scaShopName);}},
            {field:'scaStartTime', title: '活动开始时间', minWidth:200, templet: function (d) {return isEmpty(d.scaStartTime);}},
            {field:'scaEndTime', title: '活动结束时间', minWidth:200, templet: function (d) {return isEmpty(d.scaEndTime);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
    });

    //操作
    layui.table.on('tool(sca)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selectorSca(data);
        }
    });

    layui.table.render({
        id: "tcmid",
        elem: '#tcm',
        data: [],
        url: baseURL + 'promotetask/promotetasktask/camModelPlanPage',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:200, templet:'#barTpl',fixed:"right",align:"center"},
            {field:'tcmName', title: '方案名称', minWidth:200, templet: function (d) {return isEmpty(d.tcmName);}},
            {field:'tcmBrandName', title: '品牌', minWidth:200, templet: function (d) {return isEmpty(d.tcmBrandName);}},
            {field:'tcmSeriesName', title: '车系', minWidth:200, templet: function (d) {return isEmpty(d.tcmSeriesName);}},
            {field:'tcmModelName', title: '车型', minWidth:200, templet: function (d) {return isEmpty(d.tcmModelName);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
    });

    //操作
    layui.table.on('tool(tcm)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selectorTcm(data);
        }
    });
});

var action;
var callback;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            searchName: null,
            carModelPlanName: null
        }
},
created: function(){
    var _this = this;
    var param = parent.layer.boxParams.boxParams;
    action = param.action;
    callback = param.callback;
},
updated: function(){
    layui.form.render();
},
methods: {
    querySca: function () {
        vm.reloadSca();
    },
    resetSca: function () {
        resetNULL(vm.q);
    },
    reloadSca: function (event) {
        layui.table.reload('scaid', {
            page: {
                curr: 1
            },
            where: JSON.parse(JSON.stringify(vm.q))
        });
    },
    selectorSca: function (data) {
        if (null != callback){
            callback('sca', data);
        }
    },
    queryTcm: function () {
        vm.reloadTcm();
    },
    resetTcm: function () {
        resetNULL(vm.q);
    },
    reloadTcm: function (event) {
        layui.table.reload('tcmid', {
            page: {
                curr: 1
            },
            where: JSON.parse(JSON.stringify(vm.q))
        });
    },
    selectorTcm: function (data) {
        if (null != callback){
            callback('tcm', data);
        }
    },
}
});
