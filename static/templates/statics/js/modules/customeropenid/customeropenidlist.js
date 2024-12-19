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
            nickName: null,
            customerType: null,
            phone: null,
            createTimeType: null,
            createTimeStr: null,
            timeUpdateType: null,
            timeUpdateStr: null,

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
        url: baseURL + 'customeropenid/customeropenid/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {field:'nickName', title: '微信昵称', minWidth:200, templet: function (d) {return isEmpty(d.nickName);}},
            {field:'portraitImg', title: '头像', minWidth:200, templet: function (d) {
                    if(d.portraitImg!=null && d.portraitImg!=''){
                        return '<img src="'+d.portraitImg +'">';
                    }else {
                        return isEmpty(d.portraitImg);
                    }
                }},
            {field:'gender', title: '用户性别', minWidth:150, templet: function (d) {
                    if(d.gender==0){
                        return  "未知";
                    }else if(d.gender==1){
                        return  "男";
                    }else if(d.gender==2){
                        return  "女";
                    }else {
                        return isEmpty(d.gender);
                    }
                }},
            {field:'customerId', title: '用户类型', minWidth:150, templet: function (d) {
                    if(d.customerId!=null && d.customerId!=''){
                        return  "客户";
                    }else {
                        return  "游客";
                    }
                }},
            {field:'address', title: '地址', minWidth:200, templet: function (d) {return isEmpty(d.address);}},
            {field:'phone', title: '手机号', minWidth:200, templet: function (d) {return isEmpty(d.phone);}},
            {field:'timeCreate', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
            {field:'lastVisitTime', title: '最新访问时间', minWidth:200, templet: function (d) {return isEmpty(d.lastVisitTime);}},
            
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


