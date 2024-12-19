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
        viewList: []
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        var orderCarId = param.data;
        $.ajaxSettings.async = false;
        $.get(baseURL + "report/rderReceivableReport/orderReceivableReportview/" + orderCarId, function (r) {
            if (r.code == 0){
                _this.viewList = r.data;
            }
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
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
    var cols = [];
    var datas = [{}];
    if (vm.viewList != null && vm.viewList.length > 0){
        vm.viewList.forEach(function (value) {
            cols.push({field:value.field, align:'center', title:value.title, minWidth:200});
            datas[0][value.field] = value.value;
        });
    }
    table.render({
        id: "gridid",
        elem: '#grid',
        data: datas,
        cols: [cols],
        page: false,limit: 500,
        loading: true,
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            soulTable.render(this);
            var box = $('div[lay-id="gridid"]>div.layui-table-box');
            box.find('div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
