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
            activityName: null,
            jumpType: null,
            isEnable: null,
            moduleType: null,
            createTimeType: null,
            createTimeStr: null,
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
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var businessIds = [];
            $.each(list, function(index, item) {
                businessIds.push(item.businessId);
            });
            return businessIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
            $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },
        view: function (businessId) {
            $.get(baseURL + "businessmanagement/businessmanagement/info/"+businessId, function(r){
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    content: tabBaseURL + "modules/businessmanagement/businessmanagementview.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.businessManagement);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var index = layer.open({
                title: "新增",
                type: 2,
                content: tabBaseURL + "modules/businessmanagement/businessmanagementedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (businessId) {
            $.get(baseURL + "businessmanagement/businessmanagement/info/"+businessId, function(r){
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    content: tabBaseURL + "modules/businessmanagement/businessmanagementedit.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.businessManagement);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (businessId) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "businessmanagement/businessmanagement/delete/"+businessId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'businessmanagement/businessmanagement/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        //启用
        start:function (businessId) {
            confirm('确认要启用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "businessmanagement/businessmanagement/start/"+businessId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            })

        },
        //停用
        stop:function (businessId) {
            confirm('确认要禁用该活动吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "businessmanagement/businessmanagement/stop/"+businessId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            })
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}



function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(jumpType)', function(data){
        vm.q.jumpType = data.value;
    });

    form.on('select(isEnable)', function(data){
        vm.q.isEnable = data.value;
    });

    form.on('select(moduleType)', function(data){
        vm.q.moduleType = data.value;
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
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'businessmanagement/businessmanagement/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'moduleType', title: '页面模块', minWidth:200, templet: function (d) {
                if(d.moduleType!=null && d.moduleType!=''){
                    //页面模块(1.企业介绍，2.核心业务，3.车型介绍)
                    if(d.moduleType==1){
                        return  "企业介绍";
                    }
                    if(d.moduleType==2){
                        return  "核心业务";
                    }
                    if(d.moduleType==3){
                        return  "车型介绍";
                    }
                }else {
                    return "--";
                }
            }},
            {field:'activityName', title: '活动名称', minWidth:200, templet: function (d) {return isEmpty(d.activityName);}},
            {field:'sort', title: '排名位置', minWidth:200, templet: function (d) {return isEmpty(d.sort);}},
            {field:'isEnable', title: '活动状态', minWidth:200, templet: function (d) {
                 if(d.isEnable!=null){
                     if(d.isEnable==1){
                         return  "启用";
                     }
                     if(d.isEnable==0){
                         return  "停用";
                     }
                 }else{
                     return  "--";
                 }
            }},

            {field:'jumpType', title: '跳转类型', minWidth:200, templet: function (d) {
                    // 活动跳转类型(1.外部链接，2.内部跳转，3.产品跳转)
                    if(d.jumpType==3){
                        if(d.schemeTypeShow!=null){
                            return  d.activityJumpTypeShow+"/"+d.schemeTypeShow;
                        }
                    }else {
                        return isEmpty(d.activityJumpTypeShow);
                    }
            }},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.creater);}},
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
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.businessId);
        } else if(layEvent === 'del'){
            vm.del(data.businessId);
        } else if(layEvent === 'view'){
            vm.view(data.businessId);
        }else if(layEvent === 'start'){
            vm.start(data.businessId);
        }else if(layEvent === 'stop'){
            vm.stop(data.businessId);
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
}
