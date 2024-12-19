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
                receiveTimeStart:null,
                receiveTimeEnd:null,
                lastFollowTimeStart:null,
                lastFollowTimeEnd:null,
                value1:[],
                value2:[],
                distributionStatus:1,//0未分配，1已分配（传0查询公海数据、传1查询跟进中线索数据）
                followStatus:null,//0未跟进 1已跟进
                received:null,//0未领取，1已领取
                followIds:null,
                followIdsList:[],
                cluesSourceList:[],
                customerTypeList:[],
                intentionLevelList:[],
            },
            selDateIndex:-1,
            selDateIndex2:-1,
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
                    name:'待跟进',
                    count:0,
                    key:'1'
                },
                {
                    name:'待领取',
                    count:0,
                    key:'2'
                },
            ],
            tableData:[],
            totalCount:0,
            dispatchShow:false,
            seldeptId:null,
            storeLists:[],
            ids:[],
            selIds:[],
            activeTableIndex:0,
            salerList:[],
            countData:{}
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
        // this.getDeptList();
        this.getSalesList();
    },
    methods: {
        getSalesList(){
            let _this = this
            $.get(baseURL +'/workbench/workbench/sysuserinfo', function (r) {
                if (null != r.sysUserInfo) {
                    $.ajax({
                        async :false,
                        type: "GET",
                        url: baseURL + "sys/user/crmSaleUserList?deptId="+r.sysUserInfo.deptId,
                        success: function(r){
                            if(r.code == 0){
                                _this.salerList = r.userList
                            }
                        }
                    });
                }
            });
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
        tabClick(type){
            this.activeTableIndex = type
            if(type == 0){
                this.q.followStatus = null
                this.q.received = null
            }else if(type == 1){
                this.q.followStatus = 0
                this.q.received = null
            }else if(type == 2){
                this.q.followStatus = null
                this.q.received = 0
            }

            this.q.page = 1
            this.getList()
        },
        // getDeptList(){
        //     let _this = this
        //     $.getJSON(baseURL + "sys/dept/list", {sysDeptType:3, sysDeptStatus:1}, function (r) {
        //         _this.storeLists = r
        //
        //         console.log('---', _this.storeLists)
        //     });
        // },
        exportdata(){
            window.location.href = urlParamByObj(baseURL + 'crmClues/export', this.q);
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
                        that.statusLst[1].count = r.data.unFollowCount
                        that.statusLst[2].count = r.data.unReceivedCount
                        that.countData = r.data
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
                distributionStatus:1,//0未分配，1已分配（传0查询公海数据、传1查询跟进中线索数据）
                followStatus:null,//0未跟进 1已跟进
                received:null,//0未领取，1已领取
                followIds:null,
                followIdsList:[],
                cluesSourceList:[],
                customerTypeList:[],
                intentionLevelList:[],
            }

            this.selDateIndex = -1
            this.selDateIndex2 = -1
            this.ids = []
            this.selIds = []
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
        confirmDispatch(){
            let that = this
            console.log('seldeptId', this.seldeptId, this.selIds)

            let selSaler = that.salerList.find(item=>item.userId==that.seldeptId);

            if(this.seldeptId && this.seldeptId != null && this.seldeptId != ''){
                $.ajax({
                    type: "POST",
                    url: baseURL + "crmClues/distribution",
                    contentType: "application/json",
                    data: JSON.stringify({
                        followId:selSaler.userId,
                        followName:selSaler.username,
                        followDeptId:selSaler.deptId,
                        followDeptName:selSaler.deptName,
                        idList:that.selIds
                    }),
                    success: function(r){
                        if(r.code==0){
                            that.dispatchShow = false
                            that.selIds = []
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

        gotoFollowup(){

            var index = layer.open({
                title: "跟进",
                type: 2,
                content: tabBaseURL + "modules/cluesSale/followup.html",
                success: function (layero, num) {
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);

        },

        timeChange(val){
            console.log('日期选择了', val)

            this.selDateIndex = -1

            if(val){
                this.q.receiveTimeStart = val[0] + ' 00:00:00';
                this.q.receiveTimeEnd = val[1] + ' 23:59:59';
            }else {
                this.q.receiveTimeStart = null
                this.q.receiveTimeEnd = null
            }

        },

        timeChange2(val){
            console.log('日期选择了', val)

            this.selDateIndex2 = -1

            if(val){
                this.q.lastFollowTimeStart = val[0] + ' 00:00:00';
                this.q.lastFollowTimeEnd = val[1] + ' 23:59:59';
            }else {
                this.q.lastFollowTimeStart = null
                this.q.lastFollowTimeEnd = null
            }

        },

        getSearchDateByType: function(type){
            this.value1 = []

            this.selDateIndex = type
            this.q.receiveTimeStart = getSearchDateByType(type)[0]
            this.q.receiveTimeEnd = getSearchDateByType(type)[1]

        },

        getSearchDateByType2: function(type){
            this.value2 = []

            this.selDateIndex2 = type
            this.q.lastFollowTimeStart = getSearchDateByType(type)[0]
            this.q.lastFollowTimeEnd = getSearchDateByType(type)[1]

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
        selectSalerChange(val){
            this.q.followIds = val.join(',')
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

        hasten(row){

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