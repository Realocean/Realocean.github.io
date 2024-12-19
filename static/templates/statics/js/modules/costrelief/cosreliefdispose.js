$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.on('submit(saveOrUpdate)', function(){
            vm.saveOrUpdate();
            return false;
        });

        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        cosrelief: {}
    },
    created: function(){

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate:function () {
            var  processingState= window.localStorage.getItem("processingState");
            //拒绝操作
            if(processingState!=null && processingState==3){
                $.ajax({
                    type: "POST",
                    url: baseURL + "costreliefrecord/cosreliefrecord/refused",
                    contentType: "application/json",
                    data: JSON.stringify(vm.cosrelief),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                parent.layer.closeAll();
                                parent.parent.layer.closeAll();
                                parent.parent.vm.reload();
                            });

                        }else{
                            alert(r.msg);
                        }
                    }
                });
            }else  if(processingState!=null && processingState==2){  //同意操作
                vm.cosrelief.creditAmount=window.localStorage.getItem("creditAmount");
                vm.cosrelief.customerId=window.localStorage.getItem("customerId");

                $.ajax({
                    type: "POST",
                    url: baseURL + "costreliefrecord/cosreliefrecord/agree",
                    contentType: "application/json",
                    data: JSON.stringify(vm.cosrelief),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                parent.layer.closeAll();
                                parent.parent.layer.closeAll();
                                parent.parent.vm.reload();
                            });

                        }else{
                            alert(r.msg);
                        }
                    }
                });
            }




        },

    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {
    vm.cosrelief.costReliefId= window.localStorage.getItem("costReliefId");
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#cancel").on('click', function(){
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
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

