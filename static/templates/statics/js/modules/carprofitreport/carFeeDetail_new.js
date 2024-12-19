layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            carDetail:{},
        };
    },
    computed: {
    },
    created() {
    },
    mounted () {
      this.getInfo()
    },
    methods: {

        getInfo() {
            const params = parent.layer.boxParams.boxParams;
            let _this = this
            $.ajax({
                type: "GET",
                url: baseURL + 'report/financeReport/carIncomeFeeDetail/' + params.carId,
                contentType: "application/json",
                success: function (r) {
                    _this.carDetail = r.data;
                    _this.carDetail.depreciateMoney = _this.carDetail.depreciateMoney.toFixed(2);
                    _this.carDetail.carIncomeMoney = _this.carDetail.carIncomeMoney.toFixed(2);
                    _this.carDetail.taxMoney = _this.carDetail.taxMoney.toFixed(2);
                }
            });
        },

        //营业收入跳转详情页  modules/order/orderlistnew.html   jumpCarOwnerPage
        jumpIncomePage: function () {
            var param = {
                statusKey: -9,
                carPlateNo:this.carDetail.carNo
            };
            window.localStorage.setItem("statusKey", -9);
            window.localStorage.setItem("carPlateNo", this.carDetail.carNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?statusKey=-9",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("carPlateNo", null);
                }
            });
            layer.full(index);
        },
        //历任车主跳转详情页
        jumpCarOwnerPage: function () {
            var param = {
                carvinno:this.carDetail.carNo
            };
            window.localStorage.setItem("carvinno", this.carDetail.carNo);
            var index = layer.open({
                title: "订单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderlistnew.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carvinno", null);
                }
            });
            layer.full(index);
        },
        //退车跳转详情页
        jumpReturnCarPage: function () {
            var param = {
                carvinno:this.carDetail.carNo
            };
            window.localStorage.setItem("carvinno", this.carDetail.carNo);
            var index = layer.open({
                title: "订单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/settleorder.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carvinno", null);
                }
            });
            layer.full(index);
        },
        //费用支出跳转详情页
        jumpPayPage: function () {
            var param = {
                carvinno:this.carDetail.carNo
            };
            window.localStorage.setItem("carvinno", this.carDetail.carNo);
            var index = layer.open({
                title: "应付账单",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/paymentbill.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("carvinno", null);
                }
            });
            layer.full(index);
        },

        //坏账跳转详情页  modules/order/orderlistnew.html   jumpCarOwnerPage
        jumpBadPage: function () {
            var param = {
                statusKey: 4,
                carPlateNo:this.carDetail.carNo
            };
            window.localStorage.setItem("statusKey", 4);
            window.localStorage.setItem("carPlateNo", this.carDetail.carNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?statusKey=4",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("carPlateNo", null);
                }
            });
            layer.full(index);
        },
        //
        jumpIncomeNoPage: function () {
            var param = {
                statusKey: 0,
                contractorderCode:this.carDetail.currentOrderNo
            };
            window.localStorage.setItem("statusKey", 0);
            window.localStorage.setItem("contractorderCode", this.carDetail.currentOrderNo);
            var index = layer.open({
                title: "订单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderlistnew.html",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("contractorderCode", null);
                }
            });
            layer.full(index);
        },

        towNumber: function (value) {
            return value.toFixed(2);
        },
        jumpIncomeHistoryNoPage: function (receivablesNo) {
            var param = {
                statusKey: 1,
                receivablesNo:receivablesNo
            };
            window.localStorage.setItem("statusKey", 1);
            window.localStorage.setItem("receivablesNo", receivablesNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?",
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", null);
                    window.localStorage.setItem("receivablesNo", null);
                }
            });
            layer.full(index);
        },

        cancel(val){
            parent.layer.closeAll();
        },
    },
};
const app = Vue.createApp(App);
for ([name, comp] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, comp);
}
app.use(ElementPlus, {
    locale: ElementPlusLocaleZhCn,
});
registerDirectives(app)
const vm = app.mount("#rrapp");
window.vm = vm;