layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            carOrderRecordInfo:{},
            payTypes: [],
            financialCompanys: [],
            financialStatus: [],
            loanTerms: [],
        };
    },
    computed: {
    },
    created() {
        this.getDicData();
    },
    mounted () {
        this.getCarOrderInfoFollowRecord()
    },
    methods: {
        getCarOrderInfoFollowRecord() {
            const params = parent.layer.boxParams.boxParams;
            let _this = this
            $.get(baseURL + "crm/crmCarOrder/followRecord/" + params, function (r) {
                _this.carOrderRecordInfo = r.data;
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
        getNextMeasureValue(nextMeasure){
            let source = {1: '继续跟进', 2: '成交', 3: '战败', 4:'无效线索'};
            return source[nextMeasure]
        },
        getIntentionLevelValue(intentionLevel){
            let source = {1: '初意向', 2: '中意向', 3: '高意向'};
            return source[intentionLevel]
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