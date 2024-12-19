

layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {

            q:{
                page: 1,
                limit: 10,
                customerName:null,
                areaCode:null,
                intentionLevel:null,
                customerType:null,
                cluesSource:null,
                createTimeStart:null,
                createTimeEnd:null,
                value1:[],
                distributionStatus:0,//0未分配，1已分配（传0查询公海数据、传1查询跟进中线索数据）
                cluesSourceList:[],
                customerTypeList:[],
                intentionLevelList:[],
            },
            selDateIndex:-1,
            province:[],
            intentionLevel:[],
            customerType:[],
            cluesSource:[],
            provinceProp:{
                value:'code',
                label:'name',
                children:'cityList'
            },
            isFilter:false,
            statusLst:[
                {
                    name:'线索总数',
                    count:0,
                    key:'',
                },
                {
                    name:'待分配',
                    count:0,
                    key:'0'
                },
            ],
            statusIndex:0,
            tableData:[],
            totalCount:0,
            dispatchShow:false,
            seldeptId:null,
            storeLists:[],
            ids:[],
            selIds:[]
        };
    },
    computed: {
    },
    created() {
    },
    mounted () {
        this.ids = []
        this.selIds = []
        this.statusLst[0].check = true
        this.intentionLevel = intentionLevel
        this.cluesSource = cluesSource
        this.customerType = customerType

        this.getProvinceData();
        this.getCount();
        this.getList();
        this.getDeptList();
    },
    methods: {
        getDeptList(){
            let _this = this
            $.getJSON(baseURL + "sys/dept/list", {sysDeptType:'3,4', sysDeptStatus:1}, function (r) {
                _this.storeLists = r

                console.log('---', _this.storeLists)
            });
        },
        getCustomerType(type){
            return getCustomerType(type)
        },
        getIntentionLevel(type){
            return getIntentionLevel(type)
        },
        getCluesSource(type){
            return getCluesSource(type)
        },
        getFollowResult(type){
            return getFollowResult(type)
        },
        getCount(){
            let that = this

            $.ajax({
                type: "GET",
                url: baseURL + "crmClues/queryStatistics",
                // contentType: "application/json",
                data: that.q,
                success: function(r){
                    console.log('queryStatistics', r)
                    if(r.code==0){
                        that.statusLst[0].count = r.data.totalCount
                        that.statusLst[1].count = r.data.distributionCount
                    }
                }
            });

            // $.getJSON(baseURL + "crmClues/queryStatistics", this.q, function (r) {
            //
            //     console.log('queryStatistics', r)
            // });
        },

        getList(){

            let that = this

            $.ajax({
                type: "GET",
                url: baseURL + "crmClues/queryList",
                // contentType: "application/json",
                data: that.q,
                success: function(r){
                    if(r.code==0){
                        that.tableData = r.data
                        that.totalCount = Number(r.count)
                    }
                }
            });
        },

        exportdata(){

            window.location.href = urlParamByObj(baseURL + 'crmClues/export', this.q);

        },

        getProvinceData(){
            let _this = this
            //加载省市区文件内容
            var cache = localStorage.getItem("globalProvinces");
            if (cache == null) {
                $.getJSON(provinceUrl + "statics/js/province.js", function (r) {
                    // _this.province = r;
                    localStorage.setItem("globalProvinces", JSON.stringify(r));

                    r.map(i => {
                        JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                        i.cityList = JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                    })
                    _this.province = r
                    // console.log('请求到了', _this.province)
                });
            } else {
                let r2 = JSON.parse(cache)

                r2.map(i => {
                    JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                    i.cityList = JSON.parse(JSON.stringify(i.cityList).replace(/areaList/g, 'cityList'))
                })

                _this.province = r2
                // console.log('缓存到了', _this.province)
            }
        },
        handleChange(val){
            // this.form.provinceCode = val[0]
            // this.form.cityCode = val[1]
            this.q.areaCode = val[2]

            // this.form.provinceName = this.$refs.region.getCheckedNodes()[0].pathLabels[0]
            // this.form.cityName = this.$refs.region.getCheckedNodes()[0].pathLabels[1]
            // this.form.areaName = this.$refs.region.getCheckedNodes()[0].pathLabels[2]

            // console.log('handleChange', val)
            // console.log('region', this.$refs.region.getCheckedNodes()[0].pathLabels)
        },
        //重置
        reset: function () {
            this.$refs['form'].resetFields()
            this.q = {
                page: 1,
                limit: 10,
                customerName:null,
                areaCode:null,
                intentionLevel:null,
                customerType:null,
                cluesSource:null,
                createTimeStart:null,
                createTimeEnd:null,
                value1:[],
                distributionStatus:0,
                cluesSourceList:[],
                customerTypeList:[],
                intentionLevelList:[],
            }

            this.selDateIndex = -1
            this.ids = []
            this.selIds = []
            // this.getList()
            this.query()
        },
        //查询
        query: function () {
            // vm.reload();

            this.q.page = 1
            this.getList()
            this.getCount()
        },
        // 高级筛选
        bindFilter:function(){
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
        importdata(){
            let that = this

            let param={
                type:12
            }

            var index = layer.open({
                title: "数据导入",
                type: 2,
                boxParams: param,
                area: ['100%', '100%'],
                content: tabBaseURL + "modules/import/dataimport_common.html",
                success: function (layero, num) {
                    // var iframe = window['layui-layer-iframe' + num];
                    // iframe.vm.initEditData(carId,vm.q.businessType);
                },
                end: function () {
                    // vm.showForm = false;
                    layer.closeAll();
                    that.query()
                }
            });
            // vm.showForm = true;
            layer.full(index);
        },
        confirmDispatch(){
            let that = this
            console.log('seldeptId', this.seldeptId, this.selIds)
            if(this.seldeptId && this.seldeptId != null && this.seldeptId != ''){
                $.ajax({
                    type: "POST",
                    url: baseURL + "crmClues/distribution",
                    contentType: "application/json",
                    data: JSON.stringify({
                        deptId:that.seldeptId,
                        idList:that.selIds
                    }),
                    success: function(r){
                        if(r.code==0){
                            that.dispatchShow = false
                            that.selIds = []
                            // alert('分配成功')
                            that.$confirm('分配成功',{
                                confirmButtonText: '确定',
                                showCancelButton:false,
                                type:'success'
                            })
                            that.query()
                        }
                    }
                });
            }else {
                // alert('尚未选择')
                that.$confirm('尚未选择',{
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type:'error'
                })
            }
        },
        gotoAdd(intentData){
            let _this = this
            var index = layer.open({
                title: intentData?"编辑线索":"新增线索",
                type: 2,
                boxParams: intentData,
                content: tabBaseURL + "modules/cluesSale/add.html",
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
        gotoMain(){
            let url=tabBaseURL+'modules/cluesSale/main.html';
            let title='首页';
            addTab(url,title);

        },
        gotoSalesMain(){

            let url=tabBaseURL+'modules/cluesSale/salesmain.html';
            let title='销售首页';
            addTab(url,title);

        },
        gotoSubList(){

            let url=tabBaseURL+'modules/cluesSale/sublist.html';
            let title='线索列表';
            addTab(url,title);

        },
        gotoSalerList(){

            let url=tabBaseURL+'modules/cluesSale/salerlist.html';
            let title='任务列表';
            addTab(url,title);

        },
        gotoMainAnalyse(){

            let url=tabBaseURL+'modules/cluesSale/mainanalyse.html';
            let title='跟进线索分析';
            addTab(url,title);

        },

        timeChange(val){
            console.log('日期选择了', val)

            this.selDateIndex = -1
            if(val){
                this.q.createTimeStart = val[0] + ' 00:00:00';
                this.q.createTimeEnd = val[1] + ' 23:59:59';
            }else {
                this.q.createTimeStart = null
                this.q.createTimeEnd = null
            }


        },

        getSearchDateByType: function(type){
            this.value1 = []

            this.selDateIndex = type
            this.q.createTimeStart = getSearchDateByType(type)[0]
            this.q.createTimeEnd = getSearchDateByType(type)[1]

            console.log(this.q.createTimeStart, '---', this.q.createTimeEnd)
        },

        selectIntentionChange(val){
            this.q.intentionLevel = val.join(',')
        },
        selectCustomerChange(val){
            this.q.customerType = val.join(',')
        },
        selectCluesSourceChange(val){
            this.q.cluesSource = val.join(',')
        },
        handleSelectionChange(vals){
            this.ids = vals.map(item=>{
                return item.cluesId
            })
        },
        dispatchs(){
          this.dispatch(this.ids)
        },
        dispatch(ids){
            let that = this
            if(ids && ids.length>0){

                let list = this.tableData.filter(item=>ids.includes(item.cluesId))

                console.log('选中的list', list)

                let reslist = list.filter(item=>item.followResult==2||item.followResult==3||item.followResult==4)
                if(reslist && reslist.length>0){
                    this.$confirm('成交/战败/无效线索不能分配',{
                        confirmButtonText: '确定',
                        showCancelButton:false,
                        type:'error'
                    })
                    return
                }


                this.dispatchShow=true
                this.selIds = ids
            }else {
                // alert("请选择线索")
                this.$confirm('请选择线索',{
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type:'error'
                })
            }
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