layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            deptId:null,
            q:{
                f_store:null,
                f_date:null,
                f_type:true,
                s_store:null,
                s_date:null,
                s_type:true,
                c_store:null,
                c_date:null,
                c_type:true,
                m_store:null,
                m_date:null,
                m_type:true,
                n_store:null,
                n_date:null,
                n_type:true,
                deptId:null,
                timeCreate:null,
            },
            stockSel:0,//0库存统计  1品牌统计
            tabList:[
                {
                    name:'线索总数',
                    count:0,
                    color:'#136AFF',
                    img:'../../statics/images/clues/clue_state0.png'
                },
                {
                    name:'未分配线索',
                    count:0,
                    color:'#FF5C1A',
                    img:'../../statics/images/clues/clue_state1.png'
                },
                {
                    name:'跟进中线索',
                    count:0,
                    color:'#00B264',
                    img:'../../statics/images/clues/clue_state2.png'
                },
                {
                    name:'待跟进线索',
                    count:0,
                    color:'#4265E8',
                    img:'../../statics/images/clues/clue_state3.png'
                },
                {
                    name:'初意向客户',
                    count:0,
                    color:'#FF9B00',
                    img:'../../statics/images/clues/clue_state4.png'
                },
                {
                    name:'中意向客户',
                    count:0,
                    color:'#685BFF',
                    img:'../../statics/images/clues/clue_state5.png'
                },
                {
                    name:'高意向客户',
                    count:0,
                    color:'#FF3F3F',
                    img:'../../statics/images/clues/clue_state6.png'
                },
                {
                    name:'达成交易',
                    count:0,
                    color:'#23AD00',
                    img:'../../statics/images/clues/clue_state7.png'
                },
                {
                    name:'战败线索',
                    count:0,
                    color:'#00A4B6',
                    img:'../../statics/images/clues/clue_state8.png'
                },
                {
                    name:'无效线索',
                    count:0,
                    color:'#636E95',
                    img:'../../statics/images/clues/clue_state9.png'
                },
            ],
            storeLists:[],
            myChart:null,
            myChart1:null,
            myChart2:null,
            myChart3:null,
            salerList:[],
            option:{
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        return `<div><span>车型：</span>${params.name}</div>` +
                            `<div><span>数量：</span>${params.value}</div>`
                    }
                },
                color: ['#5B80F9'],
                xAxis: {
                    type: 'value',
                    name:'单位(辆)',
                    minInterval: 1,
                    axisLine:{
                        show:true
                    }
                },
                yAxis: {
                    axisLabel: {
                        formatter: function (value) {
                            // 自定义换行逻辑，这里以每两个字符换行为例

                            if(value.length>4){
                                return value.substr(0,4)+'...'
                            }else{
                                return value
                            }
                            // return value.split(' ').join('\n');
                        }
                    },
                    type: 'category',
                    data: []
                },
                series: [
                    {
                        name: '车辆类型',
                        data: [],
                        type: 'bar',
                        // barMinWidth: '5px',
                        barMaxWidth: '18px',
                        backgroundStyle: {
                            color: 'rgba(91, 128, 249, 0.12)'
                        },
                    }
                ],
                legend: {
                    show: true
                },
                grid: {
                    top:'12%',
                    left: '13%',
                    right: '12%',
                    bottom: '10%',
                    // containLabel: true
                },
            },
            option1:{
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        return `<div><span>品牌：</span>${params.name}</div>` +
                            `<div><span>数量：</span>${params.value}</div>`
                    }
                },
                color: ['#FF9000'],
                xAxis: {
                    type: 'value',
                    name:'单位(辆)',
                    minInterval: 1,
                    axisLine:{
                        show:true
                    }
                },
                yAxis: {
                    axisLabel: {
                        formatter: function (value) {
                            if(value.length>4){
                                return value.substr(0,4)+'...'
                            }else{
                                return value
                            }
                            // 自定义换行逻辑，这里以每两个字符换行为例
                            // return value.split(' ').join('\n');
                        }
                    },
                    type: 'category',
                    data: []
                },
                series: [
                    {
                        name: '车辆品牌',
                        data: [],
                        type: 'bar',
                        // barWidth: '10%',
                        barMaxWidth: '18px',
                        backgroundStyle: {
                            color: 'rgba(255, 127, 0, 0.20)'
                        },
                    }
                ],
                legend: {
                    show: true
                },
                grid: {
                    top:'12%',
                    left: '13%',
                    right: '12%',
                    bottom: '10%',
                    // containLabel: true
                },
            },
            option2:{
                // color: ['#5B80F9'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '2%',
                    left: 'center',
                    icon: "circle",
                    // doesn't perfectly work with our tricks, disable it
                    selectedMode: false
                },
                graphic: [{
                    type: 'text',
                    left:'center',
                    top: '47%',
                    z: 10,
                    style: {
                        fill: '#3FACB3',
                        text:[
                            '0',
                            '线索总数'
                        ].join('\n\n'),//实现两文本上下换行的效果
                        textAlign:'center',
                        font: '14px Microsoft YaHei'
                    }
                }],
                series: [
                    {
                        name: '线索统计',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '55%'],
                        label: {
                            show: true,
                            formatter(param) {
                                // correct the percentage
                                // console.log('param', param)
                                // return param.name + ' (' + param.percent * 2 + '%)';
                                return param.name + ' (' + param.value + ')';
                            }
                        },
                        data: [
                            // { value: 1030, name: 'Search Engine' },
                            // { value: 735, name: 'Direct' },
                            // { value: 580, name: 'Email' },
                            // { value: 453, name: 'Union Ads' },
                            // { value: 300, name: 'Video Ads' },

                        ]
                    }
                ]
            },
            option3:{
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        return `<div><span></span>${params.name}</div>` +
                            `<div><span>数量：</span>${params.value}</div>`
                    }
                },
                color: ['#3FACB3'],
                grid: {
                    left: '7%',
                    right: '7%',
                    bottom: '13%',
                    // containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel:{
                            show:true,
                            interval:0,//使x轴横坐标全部显示
                            rotate: 30,
                            textStyle: {//x轴字体样式
                                // color: "rgba(219,225,255,1)",
                                margin: 15
                            },
                            formatter: function (value, index) {
                                if(value.length>4){
                                    return value.substr(0,4)+'...'
                                }else{
                                    return value
                                }
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        minInterval: 1,
                        type: 'value',
                        name:'单位(辆)',
                        axisLine:{
                            show:true
                        }
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        data: [],
                        barMaxWidth: '18px'
                        // barWidth: '5%'
                    }
                ]
            },
            userType:0,//1总公司  2子/分公司
        };
    },
    computed: {
    },
    created() {
    },
    mounted () {
        let that = this

        window.addEventListener('resize', debounce(()=>{
            window.location.reload()
        }))

        $.get(baseURL +'/workbench/workbench/sysuserinfo', function (r) {
            if (null != r.sysUserInfo) {

                //1总公司、2中心、3分公司、4子公司、5部门、6卫星城
                if(1==r.sysUserInfo.sysDeptType){
                    that.userType = 1

                    that.getDeptList();
                    that.initChart()
                    that.getTopCount()
                    that.getLeftTop0()
                    that.getLeftTop1()
                    that.getRightTop()
                    that.getLeftBottom()
                    that.getRightBottom()
                }else if(3==r.sysUserInfo.sysDeptType||4==r.sysUserInfo.sysDeptType){
                    that.userType = 2

                    that.deptId = r.sysUserInfo.deptId

                    that.storeLists = [{name:r.sysUserInfo.deptName,deptId:r.sysUserInfo.deptId}]

                    that.q.f_store = r.sysUserInfo.deptId
                    that.q.s_store = r.sysUserInfo.deptId
                    that.q.c_store = r.sysUserInfo.deptId
                    that.q.m_store = r.sysUserInfo.deptId
                    that.q.n_store = r.sysUserInfo.deptId

                    that.initChart()
                    that.getTopCount()
                    that.getLeftTop0()
                    that.getLeftTop1()
                    that.getRightTop()
                    that.getLeftBottom()
                    that.getRightBottom()
                }
            }
        });
    },
    methods: {
        getDeptList(){
            let _this = this
            $.getJSON(baseURL + "sys/dept/list", {sysDeptType:'3,4', sysDeptStatus:1}, function (r) {
                _this.storeLists = r

                console.log('---', _this.storeLists)
            });
        },
        getCluesSource(type){
            return getCluesSource(type)
        },
        getTopCount(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryCrmCluesHomeStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId: that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        let data = r.data
                        that.tabList[0].count = data.totalCount
                        that.tabList[1].count = data.distributionCount
                        that.tabList[2].count = data.followCount
                        that.tabList[3].count = data.unFollowCount
                        that.tabList[4].count = data.firstImpressionCount
                        that.tabList[5].count = data.mediumImpressionCount
                        that.tabList[6].count = data.highImpressionCount
                        that.tabList[7].count = data.transactionCount
                        that.tabList[8].count = data.defeatCount
                        that.tabList[9].count = data.failureCount
                    }
                }
            });
        },

        getLeftTop0(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryCarModelInventoryStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){

                        that.option.yAxis.data = r.data.map(item=>{
                            return item.modelName
                        })

                        that.option.series[0].data = r.data.map(item=>{
                            return {
                                value:item.totalCount,
                                itemStyle:{
                                    borderRadius:[0,50,50,0]
                                }
                            }
                        })
                        that.myChart.setOption(that.option);
                        console.log('aaa', that.option)
                    }
                }
            });
        },

        getLeftTop1(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryCarBrandInventoryStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){

                        that.option1.yAxis.data = r.data.map(item=>{
                            return item.brandName
                        })
                        that.option1.series[0].data = r.data.map(item=>{
                            return {
                                value:item.totalCount,
                                itemStyle:{
                                    borderRadius:[0,50,50,0]
                                }
                            }
                        })
                        that.myChart1.setOption(that.option1);
                    }
                }
            });
        },

        getRightTop(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryCrmCluesSourceStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        that.option2.series[0].data = r.data.data.map(item=>{
                            return {
                                value:item.cluesCount,
                                name:that.getCluesSource(item.cluesSource)
                            }
                        })

                        that.option2.graphic[0].style.text=[r.data.totalCount,'线索总数'].join('\n\n')

                        that.myChart2.setOption(that.option2);
                    }
                }
            });

        },

        getLeftBottom(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/querySaleStarStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        that.salerList = r.data
                    }
                }
            });
        },

        getRightBottom(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/querySaleNumStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){

                        that.option3.xAxis[0].data = r.data.map(item=>{
                            return item.salesDeptName
                        })

                        that.option3.series[0].data = r.data.map(item=>{
                            return {
                                value:item.salesNum,
                                itemStyle:{
                                    borderRadius:[50,50,0,0]
                                }
                            }
                        })

                        that.myChart3.setOption(that.option3);
                    }
                }
            });
        },

        initChart(){
            this.myChart = echarts.init(document.getElementById('stock_0'));
            this.myChart1 = echarts.init(document.getElementById('stock_01'));
            this.myChart2 = echarts.init(document.getElementById('stock_1'));
            this.myChart3 = echarts.init(document.getElementById('stock_2'));

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            this.myChart1.setOption(this.option1);
            this.myChart2.setOption(this.option2);
            this.myChart3.setOption(this.option3);
        },
        stateClick(index){
            // this.tabList = this.tabList.map((item, i)=>{
            //     item.select = i === index
            //     return item
            // })
        },
        stockClick(type){
            this.stockSel = type
        },

        fswitch(){
            this.q.f_type=!this.q.f_type
            this.q.f_date = null
            this.fchange()
        },

        fchange(val){
            console.log('lll', val)
            this.topchange()
        },

        fchange2(val){
            console.log('iii', val)
            this.topchange()
        },

        topchange(){
            this.q.s_date = null
            this.q.c_date = null
            this.q.m_date = null
            this.q.n_date = null

            if(this.userType==1){

                this.q.s_store = null
                this.q.c_store = null
                this.q.m_store = null
                this.q.n_store = null

            }

            this.q.deptId = this.q.f_store
            this.q.timeCreate = this.q.f_date
            this.getTopCount()
            this.getLeftTop0()
            this.getLeftTop1()
            this.getRightTop()
            this.getLeftBottom()
            this.getRightBottom()
        },

        sswitch(){
            this.q.s_type=!this.q.s_type
            this.q.s_date = null
            this.schange()
        },

        schange(val){
            this.q.deptId = this.q.s_store
            this.q.timeCreate = this.q.s_date
            this.getLeftTop0()
            this.getLeftTop1()
        },

        schange2(val){
            this.q.deptId = this.q.s_store
            this.q.timeCreate = this.q.s_date
            this.getLeftTop0()
            this.getLeftTop1()
        },

        cswitch(){
            this.q.c_type=!this.q.c_type
            this.q.c_date = null
            this.cchange()
        },

        cchange(val){
            this.q.deptId = this.q.c_store
            this.q.timeCreate = this.q.c_date
            this.getRightTop()
        },

        cchange2(val){
            this.q.deptId = this.q.c_store
            this.q.timeCreate = this.q.c_date
            this.getRightTop()
        },

        mswitch(){
            this.q.m_type=!this.q.m_type
            this.q.m_date = null
            this.mchange()
        },

        mchange(val){
            this.q.deptId = this.q.m_store
            this.q.timeCreate = this.q.m_date
            this.getLeftBottom()
        },

        mchange2(val){
            this.q.deptId = this.q.m_store
            this.q.timeCreate = this.q.m_date
            this.getLeftBottom()
        },

        nswitch(){
            this.q.n_type=!this.q.n_type
            this.q.n_date = null
            this.nchange()
        },

        nchange(val){
            this.q.deptId = this.q.n_store
            this.q.timeCreate = this.q.n_date
            this.getRightBottom()
        },

        nchange2(val){
            this.q.deptId = this.q.n_store
            this.q.timeCreate = this.q.n_date
            this.getRightBottom()
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