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

    layui.form.on('select(dealStatusType)', function (data) {
        vm.cluesBuyCar.dealStatus = data.value;
        if(data.value != ''){
            if(data.value == '0'){
                vm.cluesBuyCar.dealStatusResult = "无效";
            } else if(data.value == '1'){
                vm.cluesBuyCar.dealStatusResult = "无效/定金已退";
            } else if(data.value == '2'){
                vm.cluesBuyCar.dealStatusResult = "持续跟进";
            } else if(data.value == '3'){
                vm.cluesBuyCar.dealStatusResult = "已成交";
            }
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        cluesBuyCar: {},
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
                url: baseURL + "clues/cluesbuycar/info/"+cluesId,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.cluesBuyCar = r.cluesBuyCar;
                        vm.cluesBuyCar.dealContent = "";
                        if(r.cluesBuyCar.reserveType==1 ){// 直购
                            $("#lcjmodel").css('display','block');
                            $("#zdjmodel").css('display','block');
                            $("#sfkmodel").css('display','none');
                            $("#bzjmodel").css('display','none');
                            $("#yzjmodel").css('display','none');
                            $("#qsmodel").css('display','none');
                            $("#wkmodel").css('display','none');
                        } else if(r.cluesBuyCar.reserveType == 2){// 分期购车
                            $("#sfkmodel").css('display','block');
                            $("#yzjmodel").css('display','block');
                            $("#qsmodel").css('display','block');
                            $("#wkmodel").css('display','block');

                            $("#bzjmodel").css('display','none');
                            $("#lcjmodel").css('display','none');
                            $("#zdjmodel").css('display','none');
                        } else if(r.cluesBuyCar.reserveType == 3){// 租赁
                            $("#bzjmodel").css('display','block');
                            $("#yzjmodel").css('display','block');
                            $("#qsmodel").css('display','block');

                            $("#lcjmodel").css('display','none');
                            $("#zdjmodel").css('display','none');
                            $("#wkmodel").css('display','none');
                            $("#sfkmodel").css('display','none');
                        }
                    }
                    else{
                        alert(r.msg);
                    }
                }
            });
        },

        saveOrUpdate: function (event) {
            var url = vm.cluesBuyCar.cluesId == null ? "clues/cluesbuycar/save" : "clues/cluesbuycar/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.cluesBuyCar),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('处理成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        viewCustormer:function (customerId){
            localStorage.setItem("id", customerId);
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
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_dealStatus: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择处理状态";
                }
            }
        },
        validate_dealContent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "处理备注不能为空";
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
