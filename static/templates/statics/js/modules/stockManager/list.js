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
                vinNo:null,
                productTypeList:[]
            },
            isFilter: false,
            modeldata: null,
            modelKey:0,
            brandList: [],
            carType:[],
            tableData: [],
            totalCount: 0,

        };
    },
    computed: {},
    created() {
        this.getCarType()
    },
    mounted() {
        this.getList();
        this.getBrandData();
    },
    methods: {
        //获取库存列表
        getList() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "crm/crmCarBasic/queryList",
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
        selectCluesSourceChange(val){
            this.q.productType = val.join(',')
        },
        getCarType(){
            let _this = this
            $.get(baseURL + "sys/dict/getInfoByType/"+"carType",function(r){
                _this.carType= r.dict;
                _this.carType.unshift({code:null, value:'不限'})
            });
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
                vinNo:null,
                productTypeList:[]
            }
            this.modeldata=[];
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
        handleSizeChange(val){
            this.q.limit = val
            this.getList()
        },
        handleCurrentChange(val){
            this.q.page = val
            this.getList()
        },
        handleCommand(row, command){
          switch (command) {
              case 'gotoAdd':
                  this.gotoAdd()
                  break
              case 'gotoExamorder1':
                  this.gotoExamorder(row, 1)
                  break
              case 'gotoExamorder2':
                  this.gotoExamorder(row, 2)
                  break
              case 'gotoExamorder3':
                  this.gotoExamorder(row, 3)
                  break
          }
        },
        //入库
        gotoAdd() {
            let _this = this;
            var index = layer.open({
                title: "填写车辆信息",
                type: 2,
                content: tabBaseURL + "modules/stockManager/add.html",
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
        //出库
        gotoOutcar(row) {
            let _this = this;
            var index = layer.open({
                title: "出库",
                type: 2,
                boxParams: row,
                content: tabBaseURL + "modules/stockManager/outcar.html",
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
        //修改
        gotoEdit(row){
            let _this = this;
            var index = layer.open({
                title: "修改车辆信息",
                type: 2,
                boxParams: row,
                content: tabBaseURL + "modules/stockManager/editCar.html",
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
        //详情
        gotoDetail(row) {
            let _this = this;
            var index = layer.open({
                title: "车辆详情",
                type: 2,
                boxParams: row,
                content: tabBaseURL + "modules/stockManager/detail.html",
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

        deleteData(row){
            let that = this
            this.$confirm('确定删除？',{
                confirmButtonText: '确定',
                type:'info'
            }).then(res=>{
                $.ajax({
                    type: "POST",
                    url: baseURL + "crm/crmCarBasic/delete",
                    contentType: "application/json",
                    data: JSON.stringify([row.carBasicId]),
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
            // alert("正在迭代中")
            let param={
                type:14
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
            window.location.href = urlParamByObj(baseURL + 'crm/crmCarBasic/export', this.q);
        },
        //审核
        gotoExamorder(carInfo, type) {
            let _this = this;
            let approvelTypes={1:'车管审核', 2:'销售确认', 3:'财务确认'}
            var index = layer.open({
                title: approvelTypes[type],
                type: 2,
                content: tabBaseURL + "modules/stockManager/examorder.html",
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