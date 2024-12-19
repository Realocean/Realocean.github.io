
layui.config({base: '../../statics/common/'}).extend({larry: 'js/base'}).use('larry');
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
                productTypeList: [],
            },
            isFilter: false,
            modeldata: null,
            modelKey: 0,
            brandList: [],
            carType: [],
            batteryBrandList:[],
            batteryNumList:[],
            tableData: [],
            totalCount: 0,

        };
    },
    computed: {},
    created() {
        this.getDicData()
    },
    mounted() {
        this.getList()

    },
    methods: {
        //获取库存列表
        getList() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "crmPurchaseOrder/queryList",
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
        getDicData(){
            let _this = this
            //获取产品类型
            $.get(baseURL + "sys/dict/getInfoByType/" + "carType", function (r) {
                _this.carType = r.dict;
                _this.carType.unshift({code: null, value: '不限'})
            });
            // 获取品牌数据源
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                _this.brandList = r.carTreeVoList
            });
            //获取电池品牌
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryBrand", function (r) {
                _this.batteryBrandList = r.dict;
            });
            //获取电池数量
            $.get(baseURL + "sys/dict/getInfoByType/" + "batteryDegree", function (r) {
                _this.batteryNumList = r.dict;
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
                productTypeList:[]
            }
            this.modeldata = [];
            this.modelKey = 0;//改变key值，组件重新渲染，实现回填功能
            this.query()
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
        handleSizeChange(val) {
            this.q.limit = val
            this.getList()
        },
        selectCluesSourceChange(val){
            this.q.productType = val.join(',')
        },
        handleCurrentChange(val) {
            this.q.page = val
            this.getList()
        },
        gotoAdd(purchaseOrderId) {
            let _this = this
            var index = layer.open({
                title: "填写采购信息",
                type: 2,
                boxParams: purchaseOrderId ?? '',
                content: tabBaseURL + "modules/purchaseManager/add.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.workType = 1;
                    // iframe.vm.showDiv();
                },
                end: function () {
                    layer.closeAll();
                    _this.query()
                }
            });
            layer.full(index);
        },
        gotoDetail(purchaseOrderId) {
            let _this = this
            var index = layer.open({
                title: "采购订单明细",
                type: 2,
                boxParams: purchaseOrderId ?? '',
                content: tabBaseURL + "modules/purchaseManager/detail.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.purchaseOrderId = purchaseOrderId??'22222';
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },

        deleteData(pid){
            let that = this
            this.$confirm('确定删除？',{
                confirmButtonText: '确定',
                type:'info'
            }).then(res=>{
                $.ajax({
                    type: "POST",
                    url: baseURL + "crmPurchaseOrder/delete",
                    contentType: "application/json",
                    data: JSON.stringify([pid]),
                    success: function (r) {
                        if (r.code == 0) {
                            that.$confirm('操作成功',{
                                confirmButtonText: '确定',
                                showCancelButton:false,
                                type:'success'
                            }).then(res=>{
                                that.query()
                            })
                        }else{
                            that.$confirm(r.msg,{
                                confirmButtonText: '确定',
                                showCancelButton:false,
                                type:'error'
                            })
                        }
                    }
                });
            })


        },

        // 批量导入
        batchImport:function(){
            let that = this
            let param={
                type:13
            }

            var index = layer.open({
                title: "数据导入",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/import/dataimport_common.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.initEditData(carId,vm.q.businessType);
                },
                end: function () {
                    layer.closeAll();
                    that.query();
                }
            });
            layer.full(index);
        },

        exportdata(){
            window.location.href = urlParamByObj(baseURL + 'crmPurchaseOrder/export', this.q);
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
        }
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