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
            initiateCustomerKeyword: null,
            beInitiateCustomerKeyword: null,
        },
        detailsTabContentList: ['活动信息', '活动数据', '用户参与数据',],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        scActivityPeer: {},
        scActivityPeerStatisticsDatas: {
            visitCount:0,
            browseCount:0,
            participantsCount:0,
            newCustomerCount:0,
            giftCount:0,
            receivedCount:0,
        },
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scActivityPeer = param.data;
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
        queryActivityPeerInitiateCustomer (){},
        resetActivityPeerInitiateCustomer (){},
        scActivityPeerInitiateCustomerReload (){},
        queryActivityPeerBeInitiateCustomer (){},
        resetActivityPeerBeInitiateCustomer (){},
        scActivityPeerBeInitiateCustomerReload (){},
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

    layui.element.tab({
        headerElem:'#tabChangeTitle>li',
        bodyElem:'#tabChangeContent>div'
    });
    layui.element.on('tab(tabChangeTitle)', function(data){
        console.log(data);
        console.log(this.getAttribute('lay-id'));
        // layui.element.tabChange('tabChangeContent', this.getAttribute('lay-id'));
    });
    layui.element.on('tab(tabChangeContent)', function(data){
        console.log(data);
        console.log(this.getAttribute('lay-id'));
        // layui.element.tabChange('tabChangeContent', this.getAttribute('lay-id'));
    });
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
        id: "scactivitypeerinitiatecustomerlstid",
        elem: '#scActivityPeerInitiateCustomerLst',
        url: baseURL + 'scactivity/scactivitypeer/scActivityPeerInitiateCustomerLst',
        where: {
            businessNo: vm.scActivityPeer.id
        },
        cols: [[
            {field:'customerAvatar', title: '微信头像', minWidth:200, templet: function (d) {return isEmpty(d.customerAvatar);}},
            {field:'initiatorNickName', title: '发起人微信昵称', minWidth:200, templet: function (d) {return isEmpty(d.initiatorNickName);}},
            {field:'initiatorName', title: '发起客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.initiatorName);}},
            {field:'customerPhone', title: '手机号', minWidth:200, templet: function (d) {return isEmpty(d.customerPhone);}},
            {field:'customerPhoneModel', title: '手机型号', minWidth:200, templet: function (d) {return isEmpty(d.customerPhoneModel);}},
            {field:'recordTime', title: '发起时间', minWidth:200, templet: function (d) {return isEmpty(d.recordTime);}},
            {field:'groupSize', title: '组队人数', minWidth:200, templet: function (d) {return toMoney(d.groupSize);}},
            {field:'prizeName', title: '获得奖品', minWidth:200, templet: function (d) {return toMoney(d.prizeName);}},
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
        id: "scactivitypeerbeinitiatecustomerlstid",
        elem: '#scActivityPeerBeInitiateCustomerLst',
        url: baseURL + 'scactivity/scactivitypeer/scActivityPeerBeInitiateCustomerLst',
        where: {
            businessNo: vm.scActivityPeer.id
        },
        cols: [[
            {field:'customerAvatar', title: '微信头像', minWidth:200, templet: function (d) {return isEmpty(d.customerAvatar);}},
            {field:'customerNickName', title: '微信昵称', minWidth:200, templet: function (d) {return isEmpty(d.customerNickName);}},
            {field:'customerName', title: '客户姓名', minWidth:200, templet: function (d) {return isEmpty(d.customerName);}},
            {field:'customerPhone', title: '手机号', minWidth:200, templet: function (d) {return isEmpty(d.customerPhone);}},
            {field:'customerPhoneModel', title: '手机型号', minWidth:200, templet: function (d) {return isEmpty(d.customerPhoneModel);}},
            {field:'initiatorPerson', title: '发起人昵称/姓名', minWidth:200, templet: function (d) {return isEmpty(d.initiatorPerson);}},
            {field:'recordTime', title: '参与时间', minWidth:200, templet: function (d) {return isEmpty(d.recordTime);}},
            {field:'groupSize', title: '组队人数', minWidth:200, templet: function (d) {return toMoney(d.groupSize);}},
            {field:'prizeName', title: '获得奖品', minWidth:200, templet: function (d) {return toMoney(d.prizeName);}},
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