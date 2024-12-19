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

var callback;
var currentDeptId;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            bindLessorAuth: true
        },
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            callback = param.callback;
            if (param.currentDeptId) {
                currentDeptId = param.currentDeptId;
                _this.q.currentDeptId = param.currentDeptId;
            }
        }
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
            vm.q.currentDeptId = currentDeptId;
            vm.q.bindLessorAuth = true;
        },
        saveOrUpdate: function () {
            if (callback) callback();
            closePage();
        },
        selectDept: function (dept) {
            if (callback) callback(dept);
            closePage();
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
    initUpload(layui.upload);
}

function initSearch() {
    searchView = Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '部门名称', placeholder: '请输入', fieldName: 'name'},
            {type: 'select', label: '部门类型', fieldName: 'sysDeptType', selectMap: {
                    1: '总公司', 2: '中心', 3: '分公司', 4: '子公司', 5: '部门', 6: '卫星城'
                }
            },
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
    });
    searchView.initView();
}

function initUpload(upload) {

}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function initTable(table, soulTable) {
    layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'sys/dept/queryPage',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'name', title: '部门名称', minWidth:200, templet: function (d) {return isEmpty(d.name);}},
            {field:'sysDeptType', title: '部门类型', minWidth:200, templet: function (d) {return transformTypeByMap(d.sysDeptType,{ 1: '总公司', 2: '中心', 3: '分公司', 4: '子公司', 5: '部门', 6: '卫星城' });}},
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
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
        if(layEvent === 'selectDept'){
            vm.selectDept(data);
        }
    });
}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}