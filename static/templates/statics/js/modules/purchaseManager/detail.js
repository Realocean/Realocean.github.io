layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            purchaseOrderId:'',
            orderDetail:{},
            tableData:[],
            carType: [],
            batteryBrandList:[],
            batteryNumList:[],
        };
    },
    computed: {
    },
    created() {
        this.getDicData()
    },
    mounted () {
        let params = parent.layer.boxParams.boxParams;
        this.purchaseOrderId = params
      this.getPurchaseOrderInfo()
    },
    methods: {
        // 采购详情
        getPurchaseOrderInfo(){
            let _this = this
            $.get(baseURL + `crmPurchaseOrder/info/${_this.purchaseOrderId}`,function(r){
                _this.orderDetail= r.data;
                _this.tableData=_this.orderDetail?.crmCarBasicEntityList??[]
            });
        },
        getDicData(){
            let _this = this
            //获取产品类型
            $.get(baseURL + "sys/dict/getInfoByType/" + "carType", function (r) {
                _this.carType = r.dict;
                _this.carType.unshift({code: null, value: '不限'})
            });
            //获取电池品牌
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryBrand", function (r) {
                _this.batteryBrandList = r.dict;
            });
            //获取电池数量
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryNum", function (r) {
                _this.batteryNumList = r.dict;
            });
        },
        getDicValueCarType(code) {
            if (this.carType.length > 0) {
                return this.carType.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        },
        getDicValueBatteryBrand(code) {
            if (this.batteryBrandList.length > 0) {
                return this.batteryBrandList.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        },
        getDicValueBatteryNum(code) {
            if (this.batteryNumList.length > 0) {
                return this.batteryNumList.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
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
app.mount("#rrapp");