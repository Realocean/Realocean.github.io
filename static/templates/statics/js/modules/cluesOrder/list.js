layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            q: {
                page: 1,
                limit: 10,
                brandId: null,
                modelId: null,
                seriesId: null,
                productType: null,
                brandName: null,
                modelName: null,
                seriesName: null,
                customerName:null,
                salesTimeStart:null,
                salesTimeEnd:null,
                customerType:null,
                paymentType:null,
                customerTypeList:[],
                paymentTypeList:[]
            },
            timeRange:[],
            isFilter: false,
            modeldata: null,
            modelKey:0,
            brandList: [],
            payTypes:[],
            customerTypes:[{
                value:'车辆销售至终端客户',
                code:1
            },{
                value:'渠道客户',
                code:2
            },{
                value:'经销商客户',
                code:3
            },{
                value:'B端大客户',
                code:4
            }],
            tableData: [],
            totalCount: 0,
        };
    },
    computed: {
    },
    created() {
        this.getDicData()
    },
    mounted () {
        this.getList();
        this.getBrandData();
    },
    methods: {

        //获取库存列表
        getList() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "crm/crmCarOrder/queryList",
                // contentType: "application/json",
                data: that.q,
                success: function (r) {
                    if (r.code == 0) {
                        that.tableData = r.data
                        that.totalCount = Number(r.count)
                    }
                }
            });
        },
        getDicData() {
            let _this = this
            //获取付款类型
            $.get(baseURL + "sys/dict/getInfoByType/" + "outCarPayType", function (r) {
                _this.payTypes = r.dict;
            });
            // //获取金融公司
            // $.get(baseURL + "sys/dict/getInfoByType/" + "financialCompany", function (r) {
            //     _this.financialCompanys = r.dict;
            // });
            // //获取金融状态
            // $.get(baseURL + "sys/dict/getInfoByType/" + "financialStatus", function (r) {
            //     _this.financialStatus = r.dict;
            // });
            // //获取贷款期限
            // $.get(baseURL + "sys/dict/getInfoByType/" + "loanTerm", function (r) {
            //     _this.loanTerms = r.dict;
            // });
        },

        // 获取品牌数据源
        getBrandData() {
            let _this = this
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                _this.brandList = r.carTreeVoList
            });
        },
        handleBrandChange(val) {
            this.q.brandId = val[0]
            this.q.seriesId = val[1]
            this.q.modelId = val[2]
            this.modeldata = val;
            //下标1为三级菜单value
            this.q.brandName = this.$refs.model.getCheckedNodes()[0].pathLabels[0]
            this.q.seriesName = this.$refs.model.getCheckedNodes()[0].pathLabels[1]
            this.q.modelName = this.$refs.model.getCheckedNodes()[0].pathLabels[2]
            this.modelKey++;//改变key值，组件重新渲染，实现回填功能

        },
        timerChange(e){
        this.q.salesTimeStart=e[0];
        this.q.salesTimeEnd=e[1];
        },
        //重置
        reset: function () {
            this.$refs['form'].resetFields()
            this.q = {
                page: 1,
                limit: 10,
                brandId: null,
                modelId: null,
                seriesId: null,
                productType: null,
                brandName: null,
                modelName: null,
                seriesName: null,
                customerName:null,
                salesTimeStart:null,
                salesTimeEnd:null,
                customerType:null,
                paymentType:null,
                customerTypeList:[],
                paymentTypeList:[]
            }
            this.modeldata=[];
            this.modelKey = 0;//改变key值，组件重新渲染，实现回填功能
            this.timeRange=[];
            this.query()
        },
        selectCustomerChange(val){
            this.q.customerType = val.join(',')
        },
        selectPayChange(val){
            this.q.paymentType = val.join(',')
        },
        //查询
        query: function () {
            this.q.page = 1
            this.getList()
        },
        // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        handleSizeChange(val){
            this.q.limit = val
            this.getList()
        },
        handleCurrentChange(val){
            this.q.page = val
            this.getList()
        },
        gotoDetail(row){
            var index = layer.open({
                title: "订单详情",
                type: 2,
                boxParams: row.carOrderId,
                content: tabBaseURL + "modules/cluesOrder/detail.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.workType = 1;
                    // iframe.vm.showDiv();
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        goRecord(row){
            var index = layer.open({
                title: "跟进记录",
                type: 2,
                boxParams: row.carOrderId,
                content: tabBaseURL + "modules/cluesOrder/record.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.workType = 1;
                    // iframe.vm.showDiv();
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
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
        exportdata(){
            window.location.href = urlParamByObj(baseURL + 'crm/crmCarOrder/export', this.q);
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
app.mount("#rrapp");