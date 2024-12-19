layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            outCarOrder:{},
            payTypes: [],
            financialCompanys: [],
            financialStatus: [],
            loanTerms: [],
            contractUrl:'',
        };
    },
    computed: {
    },
    created() {
        this.getDicData();
    },
    mounted () {
        this.getCarOrderInfo()

        $.ajax({
            type: "GET",
            url: baseURL + "message/detail/" +parent.layer.boxParams.boxParams.id,
            contentType: "application/json",
            success: function(r){
                // if(r.code === 0){
                //     vm.messageVo = r.data;
                // }else{
                //     alert(r.msg);
                // }
            }
        });

    },
    methods: {
        getCarOrderInfo() {
            const params = parent.layer.boxParams.boxParams.businessId;
            let _this = this
            $.get(baseURL + "crm/crmCarOrder/info/" + params, function (r) {
                _this.outCarOrder = r.data;
                _this.contractUrl = imageURL+_this.outCarOrder.contractUrl;
            });
        },
        getDicData() {
            let _this = this
            //获取付款类型
            $.get(baseURL + "sys/dict/getInfoByType/" + "outCarPayType", function (r) {
                _this.payTypes = r.dict;
            });
            //获取金融公司
            $.get(baseURL + "sys/dict/getInfoByType/" + "financialCompany", function (r) {
                _this.financialCompanys = r.dict;
            });
            //获取金融状态
            $.get(baseURL + "sys/dict/getInfoByType/" + "financialStatus", function (r) {
                _this.financialStatus = r.dict;
            });
            //获取贷款期限
            $.get(baseURL + "sys/dict/getInfoByType/" + "loanTerm", function (r) {
                _this.loanTerms = r.dict;
            });
        },
        getCluesSourceValue(cluesSource){
            let source = {1: '电话营销', 2: '客户介绍', 3: '线下到访', 4: '网络搜索', 5: '抖音推广', 6: '渠道合作', 7: '其他'};
            return source[cluesSource]
        },
        getDicValuePayType(code) {
            if (this.payTypes.length > 0) {
                return this.payTypes.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        },
        getDicValueFinancialCompany(code) {
            if (this.financialCompanys.length > 0) {
                return this.financialCompanys.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        },
        getDicValueFinancialStatus(code) {
            if (this.financialStatus.length > 0) {
                return this.financialStatus.find(item => {
                    if (item.code == code) {
                        return item
                    }
                })?.value??'--'
            }
        },
        getDicValueLoanTerm(code) {
            if (this.loanTerms.length > 0) {
                return this.loanTerms.find(item => {
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