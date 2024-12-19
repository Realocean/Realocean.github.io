$(function () {
    gridTable = layui.table.render({
        id: "gridid1",
        elem: '#grid',
        url: baseURL + '/car/carsurviel/carillegalStatistics',
        where: vm.q,
        cols: [[
            {field: 'carNo', minWidth: 70, title: '车牌号',fixed: "left", align: "center", templet: d=>isEmpty(d.carNo)},
            {field: 'carBrandSeriesModelName', minWidth: 150, title: '品牌/车系/车型', align: "center", templet: d=>isEmpty(d.carBrandSeriesModelName)},
            {field: 'untreatedIllegalStatisticsCount', minWidth: 100, title: '未处理次数',sort: true, align: "center", templet: d=>isEmpty(d.untreatedIllegalStatisticsCount)},
            {field: 'untreatedIllegalStatisticsFine', minWidth: 100, title: '未处理金额',sort: true, align: "center", templet: d=>isEmpty(d.untreatedIllegalStatisticsFine)},
            {field: 'untreatedIllegalStatisticsPoints', minWidth: 100, title: '未处理分数',sort: true, align: "center", templet: d=>isEmpty(d.untreatedIllegalStatisticsPoints)},
            {field: 'illegalStatisticsCount', minWidth: 100, title: '违章总次数',sort: true, align: "center", templet: d=>isEmpty(d.illegalStatisticsCount)},
            {field: 'illegalStatisticsFine', minWidth: 100, title: '违章总金额',sort: true, align: "center", templet: d=>isEmpty(d.illegalStatisticsFine)},
            {field: 'illegalStatisticsPoints', minWidth: 100, title: '违章总扣分',sort: true, align: "center", templet: d=>isEmpty(d.illegalStatisticsPoints)},
            {field: 'lastUpdateTime', minWidth: 100, title: '更新时间',sort: true, align: "center", templet: d=>isEmpty(d.lastUpdateTime)},
        ]],
        page: true,
        loading: false,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
        }
    });
    // 表格排序
    layui.table.on('sort(grid)', function(obj){
        for(var key in vm.q){
            if (key.endsWith('Sort')){
                vm.q[key] = null;
            }
        }
        vm.q[obj.field+'Sort'] = obj.type;
        vm.query();
        console.log('服务端排序。order by '+ obj.field + ' ' + obj.type);
    });
    //是否达到预警值，相当于layui-select的事件
    layui.form.on('select(warningFlag)', function (data) {
        vm.q.warningFlag = data.value;
    });
    // 加载渲染所有layui组件
    layui.form.render();
});
var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo:null,
            warningFlag:null
        },
        warningFlagDict:[
            {value:"1",label:"是"},
            {value:"0",label:"否"}
        ]
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        getQueryParam: function (){
           var queryParam = {};
           for(var key in vm.q){
               if(vm.q[key]!=null && vm.q[key]!=''){
                   queryParam[key] = vm.q[key];
               }
           }
           return queryParam;
        },
        reset: function () {//清空方法
            resetNULL(vm.q);
        },
        query: function () {
            layui.table.reload('gridid1', {
                page: {
                    curr: 1
                },
                where: vm.getQueryParam()
            });
        },
        exports: function () {
            var url = baseURL + 'car/carsurviel/carillegalStatistics/export?a=a';
            var queryParam = vm.getQueryParam();
            for(var key in queryParam){
                url += `&${key}=${queryParam[key]}`;
            }
            window.location.href = url;
        },
    }
});
