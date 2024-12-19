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
        scOrderActivity: {},
        scOrderServiceInfo: [],
        orderNo: null,
        verify: false
    },
    created: function(){
        var _this = this;
        //var param = parent.layer.boxParams.boxParams;
       // _this.scWriteOffLog = param.data;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        getData:function(){

            $.ajax({
                type: "GET",
                url: baseURL + "writeoff/scwriteofflog/order/"+vm.orderNo,
                success: function(r){
                    if(r.code === 0){
                        vm.scOrderActivity = r.scOrderActivity;
                        if(null != r.scOrderServiceInfo){
                            vm.scOrderServiceInfo = r.scOrderServiceInfo;
                            layui.table.reload('writeofftable',{
                               data: vm.scOrderServiceInfo
                            });
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        saveOrUpdate: function (event) {
            if(vm.orderNo == null || vm.orderNo == ''){
                alert("请输入核销码!");
                return;
            }
            if(vm.scOrderActivity == null || vm.scOrderActivity.activityOrderNo == null || vm.scOrderActivity.activityOrderNo == ''){
                alert("没有需要核销的信息!");
                return;
            }
            if(vm.scOrderServiceInfo == null || vm.scOrderServiceInfo.length  == 0){
                alert("核销商品不能为空!");
                return;
            }
            var items=[];
            for (let item of vm.scOrderServiceInfo) {
                items.push({writeOffLogItemNo:item.serviceNo,num:item.canRemainingNumber});
            }
            var userId=sessionStorage.getItem("userId");
            var param={writeOffLogNo:vm.scOrderActivity.activityOrderNo,writeOffType:1,items:items,userId:userId,userType:1};
            console.log(param);
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + "writeoff/scwriteofflog/save",
                contentType: "application/json",
                data: JSON.stringify(param),
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
    initTable(layui.table);
    initTableEvent(layui.table);
    initTableEditListner(layui.table);
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
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "id不能为空";
                    }
                }
            },
                    validate_memberId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "用户id不能为空";
                    }
                }
            },
                    validate_writeOffTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销时间不能为空";
                    }
                }
            },
                    validate_writeOffUser: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销人员不能为空";
                    }
                }
            },
                    validate_typeName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销类型活动类型名称不能为空";
                    }
                }
            },
                    validate_activityType: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销类型活动类型(1.秒杀活动 2.集客活动 3.同行活动 4.抽奖活动  5.优惠券)不能为空";
                    }
                }
            },
                    validate_detailName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销活动名称不能为空";
                    }
                }
            },
                    validate_orderNo: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "对应订单编号不能为空";
                    }
                }
            },
                    validate_couponId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "用户优惠券id(核销类型为5:优惠券的时候填写)不能为空";
                    }
                }
            },
                    validate_payPrice: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "支付金额不能为空";
                    }
                }
            },
                    validate_storeId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销门店id不能为空";
                    }
                }
            },
                    validate_storeName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "核销门店名称不能为空";
                    }
                }
            },
                    validate_memberName: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "用户昵称不能为空";
                    }
                }
            },
                    validate_memberPhone: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "用户手机号不能为空";
                    }
                }
            },
                    validate_delFlag: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "删除状态(1-未删除，2-已删除)不能为空";
                    }
                }
            },
                    validate_createTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "创建时间不能为空";
                    }
                }
            },
                    validate_createBy: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "创建人不能为空";
                    }
                }
            },
                    validate_updateTime: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "修改时间不能为空";
                    }
                }
            },
                    validate_updateBy: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "修改人不能为空";
                    }
                }
            },
                    validate_tenantId: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (vm.verify) {
                    if (value == null || value == '') {
                        vm.verify = false;
                        return "租户id不能为空";
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



function  initTable(table){
    //第一个实例
    table.render({
        elem: '#writeofftable'
        ,data:vm.scOrderServiceInfo//数据接口
        ,page: false //开启分页
            ,limits: [500],
            limit: 500
        ,cols: [[ //表头
             {field: 'shoppingServiceName', title: '商品名称', minWidth:200,}
            ,{field: 'remainingNumber', title: '可使用的数量', minWidth:200}
            ,{field: 'canRemainingNumber', title: '核销数', minWidth:200,edit: 'text'}
        ]]
    });
}

function initTableEditListner(table) {
    //监听单元格编辑
    table.on('edit(writeofftable)', function(obj) {
        var value = obj.value,//得到修改后的值
            data = obj.data, //得到所在行所有键值
            field = obj.field; //得到字段
        var regInt = /^[0-9]*$/;
        vm.scOrderServiceInfo.forEach(function(d){
            if(d.serviceNo == data.serviceNo){
                if (field == 'canRemainingNumber') {
                    if (!regInt.test(value)) {
                        alert("请输入正确的数字");
                        d.canRemainingNumber = d.remainingNumber;
                    }else {
                        if(d.remainingNumber < value){
                            alert("核销数不能大于可使用的数量!");
                            d.canRemainingNumber = d.remainingNumber;
                        }else{
                            d.canRemainingNumber =value;
                        }

                    }


                }
            }
            layui.table.reload('writeofftable',{
                data: vm.scOrderServiceInfo
            });
        });
    });
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
