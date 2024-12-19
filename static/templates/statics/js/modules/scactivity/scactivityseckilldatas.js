$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            userName: null,
            customerCommissionKeyword: null,
        },
        detailsTabContentList: ['活动数据', '客户分佣数据', '员工提成数据',],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        scActivitySeckill: {},
        commissionPlan: {},
        scActivitySeckillStatisticsDatas: {
            visitCount:0,
            browseCount:0,
            turnoverNewCustomers:0,
            turnoverOldCustomers:0,
            turnoverToday:0,
            turnoverTotle:0,
        },
        scActivitySeckillCommissionDatas: {
            shareCustomerCount:0,
            primaryDistributionAmount:0,
            secondaryDistributionAmount:0,
        },
        scActivitySeckillBonusDatas: {
            bonusUserCount:0,
            saleAmount:0.00,
            bonusAmount:0.00,
        },
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scActivitySeckill = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + 'scactivity/scactivityseckill/getCommissionPlan/'+param.data.id, function (r) {
            _this.commissionPlan = r.datas;
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        queryActivitySeckillBonus (){},
        resetActivitySeckillBonus (){},
        scActivitySeckillBonusReload (){},
        queryActivitySeckillCommission (){},
        resetActivitySeckillCommission (){},
        scActivitySeckillCommissionReload (){},
        queryActivitySeckillTurnoverCustomer (){},
        resetActivitySeckillTurnoverCustomer (){},
        scActivitySeckillTurnoverCustomerReload (){},
        queryActivitySeckillBrowseCustomer (){},
        resetActivitySeckillBrowseCustomer (){},
        scActivitySeckillBrowseCustomerReload (){},
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {
    vm.detailsTabContentBindtap(0);
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "scactivityseckillbonuslstid",
        elem: '#scActivitySeckillBonusLst',
        // defaultToolbar: ['filter'],
        url: baseURL + 'scactivity/scactivityseckill/scActivitySeckillBonusLst',
        where: {
            businessNo: vm.scActivitySeckill.id
        },
        cols: [[
            {field:'userName', title: '员工名称', minWidth:200, templet: function (d) {return isEmpty(d.userName);}},
            {field:'deptName', title: '所属部门/门店', minWidth:200, templet: function (d) {return isEmpty(d.deptName);}},
            {field:'saleCount', title: '售出单数', minWidth:200, templet: function (d) {return isEmpty(d.saleCount);}},
            {field:'shareCount', title: '分享人数', minWidth:200, templet: function (d) {return isEmpty(d.shareCount);}},
            {field:'visitCount', title: '浏览人数', minWidth:200, templet: function (d) {return isEmpty(d.visitCount);}},
            {field:'buyCount', title: '购买人数', minWidth:200, templet: function (d) {return isEmpty(d.buyCount);}},
            {field:'saleAmountTotle', title: '售出总金额/元', minWidth:200, templet: function (d) {return toMoney(d.saleAmountTotle);}},
            {field:'bonusAmountTotle', title: '提成总金额/元', minWidth:200, templet: function (d) {return toMoney(d.bonusAmountTotle);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    table.render({
        id: "scactivityseckillcommissionlstid",
        elem: '#scActivitySeckillCommissionLst',
        // defaultToolbar: ['filter'],
        url: baseURL + 'scactivity/scactivityseckill/scActivitySeckillCommissionLst',
        where: {
            businessNo: vm.scActivitySeckill.id
        },
        cols: [[
            {field:'customerAvatar', title: '微信头像', minWidth:200, templet: function (d) {return isEmpty(d.customerAvatar);}},
            {field:'customerNickName', title: '微信昵称', minWidth:200, templet: function (d) {return isEmpty(d.customerNickName);}},
            {field:'customerName', title: '客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'customerPhone', title: '手机号', minWidth:200, templet: function (d) {return isEmpty(d.customerPhone);}},
            {field:'customerType', title: '客户性质', minWidth:200, templet: function (d) {return isEmpty(d.customerType);}},
            {field:'primaryDistributionAmount', title: '一级分佣总金额/元', minWidth:200, templet: function (d) {return isEmpty(d.primaryDistributionAmount);}},
            {field:'distributorsLevelOneCount', title: '一级客户数/人', minWidth:200, templet: function (d) {return isEmpty(d.distributorsLevelOneCount);}},
            {field:'operatorName', title: '二级分佣总金额/元', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '二级客户数/人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    table.render({
        id: "scactivityseckillturnovercustomerlstid",
        elem: '#scActivitySeckillTurnoverCustomerLst',
        // defaultToolbar: ['filter'],
        url: baseURL + 'scactivity/scactivityseckill/scActivitySeckillTurnoverCustomerLst',
        where: {
            businessNo: vm.scActivitySeckill.id
        },
        cols: [[
            {field:'operatorName', title: '微信头像', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '微信昵称', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '手机号', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '客户性质', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '消费总金额/元', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '消费次数/次', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '手机型号', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '最新支付时间', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    table.render({
        id: "scactivityseckillbrowsecustomerlstid",
        elem: '#scActivitySeckillBrowseCustomerLst',
        // defaultToolbar: ['filter'],
        url: baseURL + 'scactivity/scactivityseckill/scActivitySeckillBrowseCustomerLst',
        where: {
            businessNo: vm.scActivitySeckill.id
        },
        cols: [[
            {field:'operatorName', title: '微信头像', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '微信昵称', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '手机号', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '客户性质', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '浏览最新时间', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '浏览时长', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '手机型号', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'operatorName', title: '访问次数', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function div(arg1, arg2) {
    return toMoney(new Number(arg1||0) / new Number(arg2||0));
}