layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            carDetail:{},
            batteryBrandList:[],
            batteryNumList:[],
            batteryDegreeList:[],
            // carUrl:'http://10.11.10.166/image-server/carImageLb/e3/a4/947924758f8843d98412e4f52adde3a4.jpeg',
            carUrl:null,
            certificateUrl:null,
        };
    },
    computed: {
    },
    created() {
        this.getDicData()
    },
    mounted () {

      this.getCarInfo()
    },
    methods: {
        getCarInfo() {
            const params = parent.layer.boxParams.boxParams;
            let _this = this
            //获取电池度数
            $.get(baseURL + "crm/crmCarBasic/info/" + params.carBasicId, function (r) {
               _this.carDetail = r.data;
               if(_this.carDetail.carUrl && _this.carDetail.carUrl != ''){
                   _this.carUrl = imageURL+_this.carDetail.carUrl;
               }
                if(_this.carDetail.certificateUrl && _this.carDetail.certificateUrl != ''){
                    _this.certificateUrl = imageURL+_this.carDetail.certificateUrl;
                }
            });
        },
        getDicData(){
            let _this = this
            //获取电池度数
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryDegree", function (r) {
                _this.batteryDegreeList = r.dict;
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
        getDicValueBatteryDegree(code) {
            if (this.batteryDegreeList.length > 0) {
                return this.batteryDegreeList.find(item => {
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