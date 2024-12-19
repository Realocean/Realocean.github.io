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
        cluesRecord: {},
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.cluesRecord = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.cluesRecord.id == null ? "clues/cluesrecord/save" : "clues/cluesrecord/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.cluesRecord),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
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
    initData();
    initUpload(layui.upload);
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
                    validate_id: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "线索记录id不能为空";
                    }
                }
            },
                    validate_cluesId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "线索id不能为空";
                    }
                }
            },
                    validate_customerNameOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "客户名称(旧)不能为空";
                    }
                }
            },
                    validate_customerNameNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "客户名称(新)不能为空";
                    }
                }
            },
                    validate_phoneOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "电话(旧)不能为空";
                    }
                }
            },
                    validate_phoneNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "电话(新)不能为空";
                    }
                }
            },
                    validate_cluesStateOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "线索状态(旧)不能为空";
                    }
                }
            },
                    validate_cluesStateNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "线索状态(新)不能为空";
                    }
                }
            },
                    validate_cluesDescribeOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "线索描述(旧)不能为空";
                    }
                }
            },
                    validate_cluesDescribeNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "线索描述(新)不能为空";
                    }
                }
            },
                    validate_followIdOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "跟进人(旧)不能为空";
                    }
                }
            },
                    validate_followIdNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "跟进人(新)不能为空";
                    }
                }
            },
                    validate_followNameOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "跟进人姓名(旧)不能为空";
                    }
                }
            },
                    validate_followNameNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "跟进人姓名(新)不能为空";
                    }
                }
            },
                    validate_contactOld: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "联系人(旧)不能为空";
                    }
                }
            },
                    validate_contactNew: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "联系人(新)不能为空";
                    }
                }
            },
                    validate_timeCreate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "创建时间（跟进时间）不能为空";
                    }
                }
            },
                    validate_timeUpdate: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "更新时间不能为空";
                    }
                }
            },
                    validate_delect: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value.length == '') {
                        vm.verify = false;
                        return "删除状态（0未删除，1已删除）不能为空";
                    }
                }
            },
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
