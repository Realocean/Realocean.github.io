var vm = new Vue({
    el:'#rrapp',
    data:{
        carBackData:{},
        order:{}
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            _this.order = param.order;
            $.get(baseURL + "order/ordercaralteration/backData?id="+param.alterationId+"&alterationType="+param.alterationType, function (r) {
                _this.carBackData = r.carBackData;
                _this.carBackData.feeLst.push({
                    feeItemName:param.repayType==0?'应收合计':param.repayType==1?'应退合计':'合计',
                    valueType:1,
                    feeItemAmount:param.repayAmount,
                });
            });
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {

    }
});

