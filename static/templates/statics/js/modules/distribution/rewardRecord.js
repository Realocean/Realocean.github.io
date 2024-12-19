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
            purchaserName: null,
            purchaserPhone: null,
            orderNo: null,
            tradingHours:null,
            qualification:null,

        },
        isClose: true,
        isFilter:false
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
            $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="timeUpdateType"]>div').removeClass('task-content-box-tab-child-active');
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'customeropenid/customeropenid/export', vm.q);
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

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);

}





function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initDate(layui.laydate);
}

function initChecked(form) {
    //客户类型
    form.on('select(customerType)', function(data){
        vm.q.customerType = data.value;
    });
}

function initClick() {
    //创建时间
    $('div[type="createTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "createTimeStr", '');
        vm.q.createTimeType=value;
    });

    $('div[type="timeUpdateType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="timeUpdateType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeUpdateStr", '');
        vm.q.timeUpdateType=value;
    });

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'distribution/scMkOrder/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            // {field:'typeName', title: '活动类型', minWidth:200, templet: function (d) {return isEmpty(d.typeName);}},
            {field:'orderNo', title: '订单编号', minWidth:100, templet: function (d) {return isEmpty(d.orderNo);}},
            {field:'businessPrice', title: '购买金额/元', minWidth:100, templet: function (d) {return isEmpty(d.businessPrice);}},
            {field:'purchaserName', title: '购买人', minWidth:100, templet: function (d) {return isEmpty(d.purchaserName);}},
            {field:'purchaserPhone', title: '购买人手机号', minWidth:120, templet: function (d) {return isEmpty(d.purchaserPhone);}},
            {field:'distributorsLevelOneNick', title: '一级分销伙伴昵称', minWidth:130, templet: function (d) {return isEmpty(d.distributorsLevelOneNick);}},
            {field:'distributorsLevelOneName', title: '一级分销伙伴名称', minWidth:130, templet: function (d) {return isEmpty(d.distributorsLevelOneName);}},
            {field:'distributorsLevelOnePhone', title: '一级分销伙伴手机号', minWidth:140, templet: function (d) {return isEmpty(d.distributorsLevelOnePhone);}},
            {field:'primaryDistributionAmount', title: '一级分销金额/元', minWidth:140, templet: function (d) {return isEmpty(d.primaryDistributionAmount);}},
            {field:'distributorsLevelTwoNick', title: '二级分销伙伴昵称', minWidth:130, templet: function (d) {return isEmpty(d.distributorsLevelTwoNick);}},
            {field:'distributorsLevelTwoName', title: '二级分销伙伴名称', minWidth:130, templet: function (d) {return isEmpty(d.distributorsLevelTwoName);}},
            {field:'distributorsLevelTwoPhone', title: '二级分销伙伴手机号', minWidth:140, templet: function (d) {return isEmpty(d.distributorsLevelTwoPhone);}},
            {field:'secondaryDistributionAmount', title: '二级分销金额/元', minWidth:140, templet: function (d) {return isEmpty(d.secondaryDistributionAmount);}},
            {field:'tradingHours', title: '成交时间', minWidth:100, templet: function (d) {return isEmpty(d.tradingHours);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
}



function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        }
    });
}


function initDate(laydate) {
    //创建时间
    laydate.render({
        elem : '#createTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.createTimeStr=value;
            vm.q.createTimeType=null;
        }
    });

    //最近登录时间
    laydate.render({
        elem : '#timeUpdateStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeUpdateType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeUpdateStr=value;
            vm.q.timeUpdateType=null;
        }
    });
}


