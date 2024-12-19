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
        carParamconf: {},
        parentList: [],
        verify: false
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async = false;
        var param = parent.layer.boxParams.boxParams;
        _this.carParamconf = param.data;
        if (_this.carParamconf.orderNum == null){
            _this.carParamconf.orderNum = 0;
        }
        if (_this.carParamconf.parentId == null){
            _this.carParamconf.parentId = '';
        }
        $.get(baseURL + "car/carparamconf/allListParent", function (r) {
            _this.parentList = r.data;
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.carParamconf.id == null ? "car/carparamconf/save" : "car/carparamconf/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.carParamconf),
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
        validate_paramName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "参数名称不能为空";
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

    form.on('select(selectorParentParam)', function (data) {
        vm.carParamconf.parentId = data.value;
        var obj = vm.parentList.filter(function (obj) {
            return obj.id == data.value;
        })[0];
        if (obj != null){
            Vue.set(vm.carParamconf, "parentName", obj.paramName);
        }else {
            Vue.set(vm.carParamconf, "parentName", '');
        }
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
