$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);


        layui.form.on('select(templateCode)', function (data) {
            vm.messageTemplate.templateCode = data.value;
        });

        layui.form.render();
    });


    layui.use('form', function() {
        layui.form.on('select(msgType)', function (data) {

            vm.messageTemplate.msgType = data.value;
            if(data.value == '1'){
                vm.messageTemplate.dictType = "msgCodeType";
            }
            if(data.value == '2'){
                vm.messageTemplate.dictType = "msgMailType"
            }

            $("#templateSelect").empty();
            $("#templateSelect").append(new Option("请选择模板类型",""));
            $.ajax({
                type: "POST",
                url: baseURL + "message/messagetemplate/listMsgTypeDict",
                contentType: "application/json",
                data:JSON.stringify(vm.messageTemplate),
                success: function(r){
                    vm.msgDataList = r.msgDataList;
                    console.log(vm.msgDataList);
                    $.each(vm.msgDataList,function(index,item){
                        $("#templateSelect").append(new Option(item.value,item.code));
                        console.log(item.value,item.code);
                    });
                    layui.form.render("select");
                }
            });

        });
        //layui.form.render();
    });


   /* layui.use(['form'], function(){
        layui.form.on('select(msgType)', function (data) {
            vm.insuranceManage.msgType = data.value;
        });

        layui.form.on('select(templateCode)', function (data) {
            vm.insuranceManage.templateCode = data.value;
        });

        layui.form.render();
    });*/
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        messageTemplate: {},
        msgDataList:[],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.messageTemplate = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            var url = vm.messageTemplate.id == null ? "message/messagetemplate/save" : "message/messagetemplate/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.messageTemplate),
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
    // 初始化加载站内信消息模板数据
    vm.messageTemplate.dictType = "msgMailType";
    $.ajax({
        type: "POST",
        url: baseURL + "message/messagetemplate/listMsgTypeDict",
        contentType: "application/json",
        data:JSON.stringify(vm.messageTemplate),
        success: function(r){
            vm.msgDataList= r.msgDataList;
        }
    });
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_msgType: function (value, item) {
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "消息类型不能为空";
                    }
                }},
        validate_templateValue: function (value, item) {
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "模板类型不能为空";
                    }
                }},
        validate_msgContent: function (value, item) {
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "消息内容不能为空";
                    }
                }},
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

function texLength(obj, maxlength, id) {
    var curr = obj.value.length;
    if (curr > maxlength) {
        layer.msg('字数在' + maxlength + '字以内');
    } else {
        document.getElementById(id).innerHTML = curr;
    }
}