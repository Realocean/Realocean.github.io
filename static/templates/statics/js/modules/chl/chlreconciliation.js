$(function () {
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'chl/chlreconciliation/list',
        cols: [[
                            {field:'channelName', width:200, title: '渠道商名称',templet:function (d) {
                                    if (d.channelName != null && d.channelName!=''){
                                        return d.channelName;
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'contacts', width:200, title: '联系人',templet:function (d) {
                                    if (d.contacts != null && d.contacts!=''){
                                        return d.contacts;
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'phone', width:200, title: '联系电话',templet:function (d) {
                                    if (d.phone != null && d.phone!=''){
                                        return d.phone;
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'storeName', width:200, title: '归属城市',templet:function (d) {
                                    if (d.storeName != null && d.storeName!=''){
                                        return d.storeName;
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'periodMonth', width:100, title: '统计周期',templet:function (d) {
                                    if (d.periodMonth != null && d.periodMonth!=''){
                                        return d.periodMonth+"月";
                                    } else {
                                        return '--';
                                    }
                                }},
                            {field:'orderCount', width:100, title: '下单总数'},
                            {field:'totalRebate', width:200, title: '总返利'},
                            {field:'salesmanName', width:200, title: '业务',templet:function (d) {
                                    if (d.salesmanName != null && d.salesmanName!=''){
                                        return d.salesmanName;
                                    } else {
                                        return '--';
                                    }
                                }},
                        {title: '操作', templet:'#barTpl',fixed:"right",align:"center"}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 20
    });

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        var nowTime = new Date().valueOf();
        var period=laydate.render({
            elem: '#period',
            type :'month',
            done: function(value, date){
                vm.q.period = value;
            }
        });
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'show'){
            vm.show(data.orderList);
        }
    });

    layui.form.on('select(storeId)', function(data){
        var storeId=data.value;
        vm.q.storeId =storeId;
    });
    layui.form.on('select(salesmanId)', function(data){
        var salesmanId=data.value;
        vm.q.salesmanId =salesmanId;
    });

    layui.use(['form'], function(){
        var form = layui.form;
        vm.getcityLst();
        vm.getsalesmanLst();
        form.render();
    });
});
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            channelName: null,
            phone:null,
            salesmanId:null,
            storeId:null,
            period:null
        },
        showList: false,
        paymenserial: {},
        storeLst:[],
        salesmanLst:[],
        orderLst:[]
},
updated: function(){
    layui.form.render();
},
methods: {
    reset: function () {
        vm.q={
            channelName: null,
            phone:null,
            salesmanId:null,
            storeId:null,
            period:null
        };
    },
    getcityLst: function () {
        $.get(baseURL + "store/tstorebasic/queryStoreIsUserInList", function(r){
            vm.storeLst=r.tStoreBasic;
        });
    },
    getsalesmanLst: function () {
        $.get(baseURL + "member/potentialmember/getUsers", function(r){
            vm.salesmanLst= r.sysUserEntityList;
        });
    },
    query: function () {
        vm.reload();
    },
    show:function (lst) {
        // $.get(baseURL + "car/paymenserial/info/"+id, function(r){
        //     vm.paymenserial = r.paymenserial;
        //
        //
        // });
        vm.showSerialList(lst);
        var index = layer.open({
            title: "查看",
            type: 1,
            content: $("#showList"),
            end: function(){
                vm.showList = false;
                vm.orderLst=[];
                layer.closeAll();
            }
        });

        vm.showList = true;
        layer.full(index);
    },

    showSerialList: function(datas){
        $('#record').html('');
        vm.orderLst=datas;
        layui.laypage.render({
            elem: 'orderLst',
            count: datas.length,
            jump: function (obj) {
                var content = "";
                var thisData = datas.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                layui.each(thisData, function(index, item){
                    content += "<tr><td>";
                    content += item.orderNo;
                    content += "</td><td>";
                    content += item.channelName;
                    content += "</td><td>";
                    content += item.modelName;
                    content += "</td><td>";
                    content += item.takeCarTime;
                    content += "</td><td>";
                    content += item.tenancy;
                    content += "</td><td>";
                    content += item.payment;
                    content += "</td><td>";
                    content += item.rebate;
                    content += "</td><td>";
                    content += item.orderSalesmanName;
                    content += "</td></tr>";
                    $('#record').html(content);
                });
            }
        });
    },
    exports: function (type) {
        if (type == 1){
            var url = baseURL + 'chl/chlreconciliation/listAll';
            if(vm.q != null){
                url += '?q_=q';
                if (vm.q.channelName != null && vm.q.channelName != ''){
                    url += '&channelName='+vm.q.channelName;
                }
                if (vm.q.phone != null && vm.q.phone != ''){
                    url += '&phone='+vm.q.phone;
                }
                if (vm.q.salesmanId != null && vm.q.salesmanId != ''){
                    url += '&salesmanId='+vm.q.salesmanId;
                }
                if (vm.q.storeId != null && vm.q.storeId != ''){
                    url += '&storeId='+vm.q.storeId;
                }
                if (vm.q.period != null && vm.q.period != ''){
                    url += '&period='+vm.q.period;
                }
            }
            $.get(url, function(r){
                var datas=r.data;
                if (datas == null || datas.length < 1){
                    alert('无数据', function(){

                    });
                }else {
                    datas.unshift({channelName: '渠道商名称',contacts:'联系人',phone:'联系电话',storeName:'归属城市',period:'统计周期',orderCount:'下单总数',totalRebate:'总返利',salesmanName:'业务'});
                    layui.excel.exportExcel({
                        sheet1: datas
                    }, '对账列表.xlsx', 'xlsx');
                }
            });
        } else if (type == 2){
            if (vm.orderLst == null || vm.orderLst.length < 1) {
                alert('无数据', function(){

                });
            }else {
                vm.orderLst.unshift({orderNo: '订单编号',channelName: '渠道商名称',modelName:'车型',takeCarTime:'取车时间',tenancy:'租期',payment:'首付款/租金',rebate:'返利',orderSalesmanName:'业务员'});
                layui.excel.exportExcel({
                    sheet1: vm.orderLst
                }, '对账详情.xlsx', 'xlsx');
            }
        }
    },
    reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: {
                channelName:vm.q.channelName,
                phone:vm.q.phone,
                salesmanId:vm.q.salesmanId,
                storeId:vm.q.storeId,
                period:vm.q.period
            }
        });
    }
}
});


