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
            msgType:1
        },
        isClose: true,
    },
    created: function(){
        var _this = this;
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
            vm.q.msgType = 1;
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'message/messagesmssendrecord/export', vm.q);
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
    initUpload(layui.upload);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '接收人', placeholder: '请输入接收人', fieldName: 'receiverName',},
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


function initUpload(upload) {
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
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        // toolbar: true,
        // defaultToolbar: ['filter'],
        url: baseURL + 'message/messagesmssendrecord/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {field:'receiverName', title: '接收人',algin:'center', minWidth:200, templet: function (d) {return isEmpty(d.receiverName);}},
            {field:'phone', title: '接收手机', algin:'center',minWidth:200, templet: function (d) {return isEmpty(d.phone);}},
            {field:'msgContent', title: '消息内容',algin:'center', minWidth:200, templet: function (d) {return isEmpty(d.msgContent);}},
            {field:'createTime', title: '发送时间',algin:'center', minWidth:200, templet: function (d) {return isEmpty(d.createTime);}},
            {field:'sendStatus', title: '发送状态',algin:'center', minWidth:200, templet: function (d) {
                    var sendStatus = isEmpty(d.sendStatus);
                    if(sendStatus=='--'){
                        return sendStatus;
                    }
                    return sendStatus=='0'?"未发送成功":"已发送成功";
            }},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
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
}

function initDate(laydate) {

}
