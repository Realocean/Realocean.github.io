$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });

    layui.form.on('radio(orderType)', function (data) {
        vm.orderType = data.value;
    });
});

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        orderType:null,
        data1:false,
        data2:false,
        data3:false,
        data4:false,
        data5:false,
        data6:false,
        data7:false,
        data8:false,

},
created: function(){
    //跳转类型赋值不同的callback
    var params
    if(parent.layui.larryElem === undefined){
        var _this = this;
        params = parent.layer.boxParams.boxParams;
    }else {
        params = parent.layui.larryElem.boxParams;
    }
    callback = params.callback;
    var filter = params.filter;
    if (filter && filter.length > 0) {
        filter.map((item)=>{
            if(item == 1){
                this.data1 = true
            }
            if(item == 2){
                this.data1 = true
            }
            if(item == 1){
                this.data2 = true
            }
            if(item == 3){
                this.data3 = true
            }
            if(item == 4){
                this.data4 = true
            }
            if(item == 5){
                this.data5 = true
            }
            if(item == 6){
                this.data6 = true
            }
            if(item == 7){
                this.data7 = true
            }
            if(item == 8){
                this.data8 = true
            }

        })
        $('input[name="orderType"]').each(function (index, val) {
            if ($.inArray(val.value^0, filter) < 0) {
                $(val).remove();
            }
        });
    }else{
        this.data1 = true
        this.data2 = true
        this.data3 = true
        this.data4 = true
        this.data5 = true
        this.data6 = true
        this.data7 = true
        this.data8 = true
    }
},
updated: function(){
    layui.form.render();
},
methods: {
    closePage:function () {
        // closePage();
        closeCurrent();
    },
    selected:function () {
        if (vm.orderType == null || vm.orderType == ''){
            alert('请选择下单类型');
            return;
        }
        callback(vm.orderType);
        // closePage();
        // closeCurrent();
    }
}
});

function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
