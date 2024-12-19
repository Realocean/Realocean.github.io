var vm = new Vue({
    el:'#rrapp',
    data:{
        transferData:{}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        $.get(baseURL + "order/ordercaralteration/transferData?id="+param, function (r) {
            _this.transferData = r.transferData;
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {

    }
});

