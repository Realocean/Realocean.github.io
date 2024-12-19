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
            keyword: null
        },
        cluesContracjoin: {},
        listCluesDeal:[],
        verify: false,
    },
    created: function(){
        var _this = this;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detail: function (cluesId) {
            // 获取详情
            $.ajax({
                type: "POST",
                url: baseURL + "clues/cluescontracjoin/info/"+cluesId,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.cluesContracjoin = r.cluesContracjoin;
                        vm.listCluesDeal = r.cluesContracjoin.listCluesDeal;
                    }
                    else{
                        alert(r.msg);
                    }
                }
            });
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    //initData();
}

function initData() {

}

function initEventListener(layui) {
    initClick();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function initTable(table, soulTable) {
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
