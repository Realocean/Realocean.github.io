layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        return {
            tabList:[
                {
                    name:'线索总数',
                    count:0,
                    color:'#136AFF',
                    img:'../../statics/images/clues/clue_state0.png'
                },
                {
                    name:'未领取线索',
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
            myChart:null,
            myChart1:null,
            option:{
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '2%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        // dataView: { show: true, readOnly: false },
                        // restore: { show: true },
                        // saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [30, 115],
                        center: ['60%', '60%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: [
                            // { value: 40, name: 'rose 1' },
                            // { value: 38, name: 'rose 2' },
                            // { value: 32, name: 'rose 3' },
                            // { value: 30, name: 'rose 4' },
                            // { value: 28, name: 'rose 5' },
                            // { value: 26, name: 'rose 6' },
                            // { value: 22, name: 'rose 7' },
                            // { value: 18, name: 'rose 8' }
                        ]
                    }
                ]
            },
            option1:{
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        return `<div><span>日期：</span>${params.name}</div>` +
                            `<div><span>次数：</span>${params.value}</div>`
                    }
                },
                color: ['#1890FF'],
                xAxis: {
                    type: 'category',
                    data: [],
                    name:'日期',
                    axisLine:{
                        show:true
                    }
                },
                yAxis: {
                    minInterval: 1,
                    type: 'value',
                    name:'次数',
                    axisLine:{
                        show:true
                    }
                },
                grid: {
                    left: '8%',
                    right: '12%',
                    top:'12%',
                    bottom: '15%',
                    // containLabel: true
                },
                series: [
                    {
                        data: [],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        },
                        // barWidth: '10%'
                        barMaxWidth: '18px',
                    }
                ]
            },
            dateList:[],
            taskList:[],
            followTableData:[],
            undoParam:{
                page:1,
                limit:5,
                taskTime:'',
            },
            undoCount:null,
            recordParam:{
                page:1,
                limit:5
            },
            recordCount:null
        };
    },
    computed: {
    },
    created() {
    },
    mounted () {
        window.addEventListener('resize', debounce(()=>{
            window.location.reload()
        }))

        this.initChart();
        this.getTopCount();
        this.getLeftTop();
        this.undoParam.taskTime = moment(new Date()).format('YYYY-MM-DD')
        this.getRightTop();
        this.getLeftBottom();
        this.getRightBottom();
        this.dateList = this.generateWeekArray()
        this.dateList[1].select = true
    },
    methods: {
        getCluesSource(type){
            return getCluesSource(type)
        },
        gotoFollowup(row){
            if(!row.cluesId){
                return
            }

            let _this = this

            var index = layer.open({
                title: "跟进",
                type: 2,
                boxParams:row,
                content: tabBaseURL + "modules/cluesSale/followup.html",
                success: function (layero, num) {

                },
                end: function () {
                    layer.closeAll();
                    _this.query()
                }
            });
            layer.full(index);

        },
        getLeftTop(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/querySaleCrmCluesSourceStatistics",
                contentType: "application/json",
                // data: JSON.stringify({
                //     deptId:that.q.deptId,
                //     timeCreate:that.q.timeCreate
                // }),
                success: function(r){
                    if(r.code==0){

                        // that.option.yAxis.data = r.data.map(item=>{
                        //     return item.modelName
                        // })
                        //
                        that.option.series[0].data = r.data.data.map(item=>{
                            return {
                                value:item.cluesCount,
                                name:that.getCluesSource(item.cluesSource)
                            }
                        })
                        that.myChart.setOption(that.option);
                        // console.log('aaa', that.option)
                    }
                }
            });
        },
        handleSizeChange(val){
            this.undoParam.limit = val
            this.getRightTop()
        },
        handleCurrentChange(val){
            this.undoParam.page = val
            this.getRightTop()
        },
        getRightTop(){
            let that = this

            $.getJSON(baseURL + "crmStatistics/queryToBeCompletedTaskList",
                that.undoParam,
                function (r) {
                    if(r.code==0){
                        that.taskList = r.data
                        that.undoCount = Number(r.count)
                    }
            });
        },
        handleSizeChange2(val){
            this.recordParam.limit = val
            this.getLeftBottom()
        },
        handleCurrentChange2(val){
            this.recordParam.page = val
            this.getLeftBottom()
        },
        getLeftBottom(){
            let that = this

            $.getJSON(baseURL + "crmStatistics/queryCrmCluesDealList",
                that.recordParam,
                function (r) {
                    if(r.code==0){
                        that.followTableData = r.data
                        that.recordCount = Number(r.count)
                    }
                });
        },
        getRightBottom(){
            let that = this

            $.getJSON(baseURL + "crmStatistics/queryFollowNumList",
                function (r) {
                    if(r.code==0){
                        that.option1.xAxis.data = r.data.map(item=>{
                            return item.day
                        })

                        that.option1.series[0].data = r.data.map(item=>{
                            return {
                                value:item.followCount,
                                itemStyle:{
                                    borderRadius:[50,50,0,0]
                                }
                            }
                        })

                        that.myChart1.setOption(that.option1);
                    }
                });
        },
        getTopCount(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/querySaleCrmCluesHomeStatistics",
                contentType: "application/json",
                // data: JSON.stringify({
                //     deptId:that.q.deptId,
                //     timeCreate:that.q.timeCreate
                // }),
                success: function(r){
                    if(r.code==0){
                        let data = r.data
                        that.tabList[0].count = data.totalCount
                        that.tabList[1].count = data.unReceivedCount
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
        initChart(){
            this.myChart = echarts.init(document.getElementById('stock_0'));
            this.myChart1 = echarts.init(document.getElementById('stock_1'));

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            this.myChart1.setOption(this.option1);

        },
        stateClick(index){
            // this.tabList = this.tabList.map((item, i)=>{
            //     item.select = i === index
            //     return item
            // })
        },
        dateClick(index){
            this.dateList = this.dateList.map((item, i)=>{
                item.select = i === index
                return item
            })

            this.undoParam.page = 1
            this.undoParam.taskTime = moment(new Date()).add(index-1, 'days').format('YYYY-MM-DD')
            this.getRightTop()
        },

        generateWeekArray() {
            const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const today = new Date();
            const weekArray = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + (i-1));

                const dayOfWeek = daysOfWeek[date.getDay()];
                const dayOfMonth = date.getDate();

                weekArray.push({
                    week: dayOfWeek,
                    day: dayOfMonth
                });
            }

            return weekArray;
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
app.mount("#rrapp");