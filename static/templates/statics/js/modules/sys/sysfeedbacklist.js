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
            memberName: null,
            memberPhone: null,
            userType: null,
            date1: null,
            date2: null,
            processingStatus:null
        },
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
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var feedbackIds = [];
            $.each(list, function(index, item) {
                feedbackIds.push(item.feedbackId);
            });
            return feedbackIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (feedbackId) {
            window.localStorage.setItem("feedbackId",feedbackId);
            var index = layer.open({
                title: "处理备注",
                type: 2,
                content: tabBaseURL + "modules/sys/sysfeedbackview.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("feedbackId",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/feedback/sysfeedbackedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        // 处理备注
        update: function (feedbackId) {
            window.localStorage.setItem("feedbackId",feedbackId);
            var index = layer.open({
                title: "处理备注",
                type: 2,
                content: tabBaseURL + "modules/sys/sysfeedbackedit.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("feedbackId",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        del: function (feedbackIds) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "feedback/sysfeedback/delete",
                    contentType: "application/json",
                    data: JSON.stringify(feedbackIds),
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
            window.location.href = urlParamByObj(baseURL + 'feedback/sysfeedback/export', vm.q);
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
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '反馈者昵称', placeholder: '请输入昵称/客户名称', fieldName: 'memberName',},
            {type: 'text', label: '联系电话', placeholder: '请输入联系电话', fieldName: 'memberPhone',},
            {type: 'select', label: '反馈用户类型', placeholder: '全部', fieldName: 'userType', selectMap: {
                    1:'客户',
                    2:'游客',
                }, selectFilter: true
            },
            {type: 'select', label: '处理状态', placeholder: '全部', fieldName: 'processingStatus', selectMap: {
                    0:'未处理',
                    1:'已处理',
                }, selectFilter: true
            },
            {type: 'date', label: '反馈时间', placeholder: '选择日期范围', fieldName: 'date1', selectFilter: true},
            {type: 'date', label: '处理时间', placeholder: '选择日期范围', fieldName: 'date2', selectFilter: true},
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
            }
        }
    }).initView();
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $(".delBatch").click(function(){
        var feedbackIds = vm.selectedRows();
        if(feedbackIds == null){
            return;
        }
        vm.del(feedbackIds);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        //toolbar: true,
        //defaultToolbar: ['filter'],
        url: baseURL + 'feedback/sysfeedback/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'fbTypeStr', align:"center",title: '反馈业务', minWidth:110, templet: function (d) {return isEmpty(d.fbTypeStr);}},
            {field:'feedbackContent', align:"center",title: '反馈内容', minWidth:250, templet: function (d) {return isEmpty(d.feedbackContent);}},
            {field:'memberName', align:"center",title: '反馈者昵称/客户名称', minWidth:160, templet: function (d) {
                if(d.userType == 1){
                    return "<span style='color: blue' onclick = hrefCustormerView(\'"+d.memberNo+"\')>"+isEmpty(d.memberName)+"</span>";
                } else {
                    return isEmpty(d.memberName);
                }
            }},
            {field:'userTypeStr', align:"center",title: '反馈用户类型', minWidth:120, templet: function (d) {
                if(d.userType == 0){
                    return "--"
                } else {
                    if(d.userType == 1){
                        return "<span style='color: green' >"+isEmpty(d.userTypeStr)+"</span>";
                    } else if(d.userType == 2){
                        return "<span style='color: red' >"+isEmpty(d.userTypeStr)+"</span>";
                    }
                }
            }},
            {field:'memberPhone', align:"center",title: '联系方式', minWidth:130, templet: function (d) {return isEmpty(d.memberPhone);}},
            {field:'submissionTime', align:"center",title: '反馈时间', minWidth:140, templet: function (d) {return isEmpty(d.submissionTime);}},
            {field:'processingStatus', align:"center",title: '处理状态', minWidth:80, templet: function (d) {
                if(d.processingStatus == 0){
                    return "<span style='color: red' >"+isEmpty(d.processingStatusStr)+"</span>";
                } else if(d.processingStatus == 1){
                    return "<span style='color: green' >"+isEmpty(d.processingStatusStr)+"</span>";
                }
            }},
            {field:'processingTime', align:"center",title: '处理时间', minWidth:140, templet: function (d) {return isEmpty(d.processingTime);}},
            {field:'processingContent',align:"center", title: '处理结果', minWidth:140, templet: function (d) {return isEmpty(d.processingContent);}},
            {field:'operatorName', align:"center",title: '处理者', minWidth:150, templet: function (d) {return isEmpty(d.operatorName);}},
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
            vm.update(data.feedbackId);
        } else if(layEvent === 'del'){
            var feedbackId = [data.feedbackId];
            vm.del(feedbackId);
        } else if(layEvent === 'view'){
            vm.view(data.feedbackId);
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem : '#submissionTimeStr',
        range : true,
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.submissionTimeStr=value;
            initializeSearchDate(vm.q, 'submissionTimeStr', value);
        }
    });

    laydate.render({
        elem : '#processingTimeStr',
        range : true,
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.processingTimeStr=value;
            initializeSearchDate(vm.q, 'processingTimeStr', value);
        }
    });
}

//查看客户详情
function hrefCustormerView (id) {
    localStorage.setItem("id", id);
    var title = "客户信息";
    var index = layer.open({
        title: title,
        type: 2,
        content: tabBaseURL + 'modules/customer/customerdetail.html',
        shade: false,
        end: function () {
            layer.closeAll();
        }
    });
    layer.full(index);
}
