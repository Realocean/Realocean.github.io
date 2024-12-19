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
        clues: {},
        usrLst: [],
        followUserNameOld: '',
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.clues = param.data;
        _this.followUserNameOld = _this.clues.followUserName;
        $.get(baseURL + "sys/user/usrLst", function (r) {
            var usrLst = r.usrLst;
            for(var i = 0 ;i<usrLst.length;i++) {
                if(usrLst[i].userId === _this.clues.followUserId) {
                    usrLst.splice(i,1);
                    i= i-1;
                    break;
                }
            }
            _this.usrLst = usrLst;
            _this.clues.followUserId = '';
            _this.clues.followUserName = '';
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + 'clues/clues/follow',
                contentType: "application/json",
                data: JSON.stringify(vm.clues),
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
        }
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
        validate_cluesName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "客户名称不能为空";
                }
            }
        },
        validate_phone: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "电话不能为空";
                }
                if (value.length < 5 || value.length > 13){
                    vm.verify = false;
                    return "电话格式有误";
                }
            }
        },
        validate_status: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "状态不能为空";
                }
            }
        },
        validate_followUserId: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "跟进人不能为空";
                }
            }
        }
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('radio(cluesType)', function (data) {
        vm.clues.cluesType = data.value;
    });

    form.on('select(status)', function (data) {
        vm.clues.cluesState = data.value;
    });

    form.on('select(operatorId)', function (data) {
        var usrid = data.value;
        vm.clues.sysUserId = usrid;
       /* var obj = vm.usrLst.filter(function (obj) {
            return obj.userId == usrid;
        })[0];
        if (obj != null){
            vm.clues.followUserName = obj.username;
        }else {
            vm.clues.followUserName = '';
        }*/
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

function cluesTypeStr(cluesType) {
    switch (Number(cluesType)) {
        case 1: return '个人';
        case 2: return '企业';
        default: return '--';
    }
}
