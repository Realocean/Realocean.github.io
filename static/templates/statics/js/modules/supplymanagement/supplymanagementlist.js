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
            projectName: null,
            jumpType: null,
            projectStatus: null,
            registrationStartTimeType: null,
            registrationStartTimeStr: null,
            registrationClosingTimeType: null,
            registrationClosingTimeStr: null,
            createTimeType: null,
            createTimeStr: null,
        },
        isFilter:false,
        isClose: true,
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
            $('div[type="registrationStartTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="registrationClosingTimeType"]>div').removeClass('task-content-box-tab-child-active');
            $('div[type="createTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },
        view: function (supplyManagementId) {
            $.get(baseURL + "supplymanagement/supplymanagement/info/"+supplyManagementId, function(r){
                /*var param = {
                    data:r.supplyManagement
                };*/
                var index = layer.open({
                    title: "查看",
                    type: 2,
                //  boxParams: param,
                    content: tabBaseURL + "modules/supplymanagement/supplymanagementview.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.supplyManagement);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            vm.reset();
            var index = layer.open({
                title: "新增",
                type: 2,
                content: tabBaseURL + "modules/supplymanagement/supplymanagementedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (supplyManagementId) {
            $.get(baseURL + "supplymanagement/supplymanagement/info/"+supplyManagementId, function(r){
                var index = layer.open({
                    title: "修改",
                    type: 2,
                //  boxParams: param,
                    content: tabBaseURL + "modules/supplymanagement/supplymanagementedit.html",
                    success:function (){
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(r.supplyManagement);
                    },
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        start:function (supplyManagementId){
            confirm('确认要启用该货源信息吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "supplymanagement/supplymanagement/start/"+supplyManagementId,
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
        stop:function (supplyManagementId){
            confirm('确认要禁用该货源信息吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "supplymanagement/supplymanagement/stop/"+supplyManagementId,
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
        del: function (supplyManagementId) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "supplymanagement/supplymanagement/delete/"+supplyManagementId,
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
            window.location.href = urlParamByObj(baseURL + 'supplymanagement/supplymanagement/export', vm.q);
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
        }
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
    //项目跳转类型(1外部链接，2内部链接)
    form.on('select(jumpType)', function(data){
        vm.q.jumpType = data.value;
    });

    form.on('select(projectStatus)', function(data){
        vm.q.projectStatus = data.value;
    });

}

function initClick() {

    //报名开始时间
    $('div[type="registrationStartTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="registrationStartTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "registrationStartTimeStr", '');
        vm.q.registrationStartTimeType=value;
    });

    //报名结束时间
    $('div[type="registrationClosingTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="registrationClosingTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "registrationClosingTimeStr", '');
        vm.q.registrationClosingTimeType=value;
    });

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
   //   toolbar: true,
   //   defaultToolbar: ['filter'],
        url: baseURL + 'supplymanagement/supplymanagement/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:150, minWidth:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'projectName', title: '项目名称', minWidth:200, templet: function (d) {return isEmpty(d.projectName);}},
            {field:'jumpType', title: '展示类型', minWidth:200, templet: function (d) {
                //项目跳转类型(1外部链接，2内部展示)
                if(d.jumpType!=null && d.jumpType!=''){
                    if (d.jumpType==1){
                        return  '外部链接';
                    }
                    if (d.jumpType==2){
                        return  '内部展示';
                    }
                } else {
                    return isEmpty(d.jumpType);
                }
            }},
            {field:'projectStatus', title: '项目状态', minWidth:200, templet: function (d) {
                    //项目状态(1启用，0停用)
                    if(d.projectStatus!=null){
                        if (d.projectStatus==1){
                            return  '启用';
                        }
                        if (d.projectStatus==0){
                            return  '停用';
                        }
                    } else {
                        return "--";
                    }
            }},
            {field:'city', title: '所在城市', minWidth:200, templet: function (d) {return isEmpty(d.city);}},
            {field:'contact', title: '联系人', minWidth:200, templet: function (d) {return isEmpty(d.contact);}},
            {field:'price', title: '价格', minWidth:200, templet: function (d) {return isEmpty(d.price);}},
            {field:'vehicleNumber', title: '所需车辆数/台', minWidth:200, templet: function (d) {return isEmpty(d.vehicleNumber);}},
            {field:'vehicleRequirements', title: '所需车辆要求', minWidth:200, templet: function (d) {return isEmpty(d.vehicleRequirements);}},
            {field:'projectDescription', title: '项目说明', minWidth:200, templet: function (d) {return isEmpty(d.projectDescription);}},
            {field:'applicantsNum', title: '报名人数/人', minWidth:200, templet: function (d) {
                    if(d.applicantsNum!=null && d.applicantsNum!=''){
                        return "<span style='color:#419BEA;cursor:pointer;' onclick = jumpToCluesList(\'"+d.supplyManagementId+"\')>"+isEmpty(d.applicantsNum)+"</span>";
                    }else {
                        return "--";
                    }
            }},
            {field:'registrationStartTime', title: '报名开始时间', minWidth:200, templet: function (d) {return isEmpty(d.registrationStartTime);}},
            {field:'registrationClosingTime', title: '报名结束时间', minWidth:200, templet: function (d) {return isEmpty(d.registrationClosingTime);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'creater', title: '创建人', minWidth:200, templet: function (d) {return isEmpty(d.creater);}}
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
            vm.update(data.supplyManagementId);
        } else if(layEvent === 'del'){
            vm.del(data.supplyManagementId);
        } else if(layEvent === 'view'){
            vm.view(data.supplyManagementId);
        } else if(layEvent === 'start'){
            vm.start(data.supplyManagementId);
        }else if(layEvent === 'stop'){
            vm.stop(data.supplyManagementId);
        }
    });
}

function initDate(laydate) {
    //报名开始时间
    laydate.render({
        elem : '#registrationStartTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="registrationStartTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.registrationStartTimeStr=value;
            vm.q.registrationStartTimeType=null;
        }
    });

    //报名结束时间
    laydate.render({
        elem : '#registrationClosingTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="registrationClosingTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.registrationClosingTimeStr=value;
            vm.q.registrationClosingTimeType=null;
        }
    });

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


/**
 * 跳转到线索列表
 * @param supplyManagementId
 */
function jumpToCluesList(supplyManagementId){
    var index = layer.open({
        title: "查看",
        type: 2,
        content: tabBaseURL + "modules/clues/clueslist.html",
        success:function (){
            var iframe = window['layui-layer-iframe' + index];
            iframe.getSupplyManagementId(supplyManagementId);
        },
        end: function () {
            layer.close(index);
        }
    });
    layer.full(index);
}