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
var dataTable;
var vm = new Vue({
    el:'#rrapp',
    data:{
        failDatas:[],
        colNames:[],
        colLst:[],
        beanName:'',
        verify: false
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async = false;
        var param = parent.layer.boxParams.boxParams;
        _this.failDatas = param.failDatas;
        _this.colNames = param.colNames;
        _this.colLst = param.colLst;
        _this.beanName = param.beanName;
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        downXls: function () {
            var form = $('form#downLoadXls');
            form.find('input[name="datas"]').val(JSON.stringify(vm.failDatas));
            form.find('input[name="beanName"]').val(vm.beanName);
            form[0].action = baseURL + 'file/downxlserr';
            form.submit();
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
}

function initData(layui) {
}

function initEventListener(layui) {
    initClick();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#downXls").on('click', function () {
        vm.downXls();
    });
}

function initTable(table, soulTable) {
    dataTable = table.render({
        id: "gridid",
        elem: '#grid',
        data: vm.failDatas,
        cols:[vm.colLst],
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10,
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

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
