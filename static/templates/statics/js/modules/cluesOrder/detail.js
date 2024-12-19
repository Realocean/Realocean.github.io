layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            outCarOrder:{},
            payTypes: [],
            financialCompanys: [],
            financialStatus: [],
            loanTerms: [],
            fileType:0,//1图片 2文件
            fileUrl:null
        };
    },
    computed: {
    },
    created() {
        this.getDicData();
    },
    mounted () {
        this.getCarOrderInfo()
    },
    methods: {
        getCarOrderInfo() {
            const params = parent.layer.boxParams.boxParams;
            let _this = this
            $.get(baseURL + "crm/crmCarOrder/info/" + params, function (r) {
                _this.outCarOrder = r.data;

                if(r.data.contractUrl){
                    _this.getFileType(imageURL + r.data.contractUrl)
                }
            });
        },
        getFileType(fileUrl){
            this.fileUrl = fileUrl
            let lastIndex = fileUrl.lastIndexOf(".");
            let ext = fileUrl.substr(lastIndex+1);
            console.log('文件类型', ext)

            this.fileType = this.isAssetImage(ext) ? 1 : this.isAssetFile(ext) ? 2 : 0
        },

        isAssetImage(ext){
            return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
            indexOf(ext.toLowerCase()) !== -1;
        },

        isAssetFile(ext){
            return ['pdf', 'doc', 'docx', 'xls', 'xlsx'].
            indexOf(ext.toLowerCase()) !== -1;
        },

        viewFile(){
            let that = this



            if(that.fileUrl.endsWith(".pdf")||that.fileUrl.endsWith(".PDF")){
                var index = layer.open({
                    title: '销售合同',
                    type: 2,
                    content: that.fileUrl,
                    success: function (layero, num) {

                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            }else {
                var $form = $('<form method="GET"></form>');
                $form.attr('action', that.fileUrl);
                $form.appendTo($('body'));
                $form.submit();
            }

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