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
        cluesBuyCar: {},
        verify: false,
        listCluesDeal:[]
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
                        vm.listCluesDeal = r.cluesBuyCar.listCluesDeal;
                        // vm.cluesBuyCar.dealContent = "";
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
