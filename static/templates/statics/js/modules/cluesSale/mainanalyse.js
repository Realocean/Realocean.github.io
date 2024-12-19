layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        let self = this
        return {
            deptId:null,
            q:{
                store0:null,
                date0:null,
                store1:null,
                date1:null,
                store2:null,
                date2:null,
                deptId:null,
                timeCreate:null,
            },
            storeLists:[],
            myChart:null,
            myChart1:null,
            myChart2:null,
            myChart3:null,
            myChart4:null,
            myChart5:null,
            salerList:[],
            option:{
                grid:{
                    top:'0',
                    bottom:'12%'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '8%',
                    left: 'center',
                    // bottom:'15%',
                    icon: "circle",
                    // doesn't perfectly work with our tricks, disable it
                    selectedMode: false
                },
                graphic: [{
                    type: 'text',
                    left:'center',
                    top: '52%',
                    z: 10,
                    style: {
                        fill: '#3FACB3',
                        text:[
                            '0',
                            '总数量'
                        ].join('\n\n'),//实现两文本上下换行的效果
                        textAlign:'center',
                        font: '16px Microsoft YaHei'
                    }
                }],
                series: [
                    {
                        name: '进度统计',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '60%'],
                        label: {
                            // show: true,
                            // formatter(param) {
                            //     // correct the percentage
                            //     // console.log('param', param)
                            //     // return param.name + ' (' + param.percent * 2 + '%)';
                            //     return param.name + ' (' + param.value + ')';
                            // },
                            normal:{
                                show: true,
                                position: 'inside',
                                formatter: '{d}%',
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
            option1:{
                grid:{
                    top:'0',
                    bottom:'12%'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '8%',
                    left: 'center',
                    // bottom:'15%',
                    icon: "circle",
                    // doesn't perfectly work with our tricks, disable it
                    selectedMode: false
                },
                graphic: [{
                    type: 'text',
                    left:'center',
                    top: '52%',
                    z: 10,
                    style: {
                        fill: '#3FACB3',
                        text:[
                            '0',
                            '总数量'
                        ].join('\n\n'),//实现两文本上下换行的效果
                        textAlign:'center',
                        font: '16px Microsoft YaHei'
                    }
                }],
                series: [
                    {
                        name: '进度统计',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '60%'],
                        label: {
                            // show: true,
                            // formatter(param) {
                            //     // correct the percentage
                            //     // console.log('param', param)
                            //     // return param.name + ' (' + param.percent * 2 + '%)';
                            //     return param.name + ' (' + param.value + ')';
                            // },
                            normal:{
                                show: true,
                                position: 'inside',
                                formatter: '{d}%',
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
            option2:{
                color: ['#62CDD5'],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        var res;
                        // var num;
                        // if (params[0].data>params[1].data) {
                        //     num=params[0].data-params[1].data
                        // } else {
                        //     num=params[1].data-params[0].data
                        // }
                        res= `<div><span>车型：</span>${params.name}</div>` +
                            `<div><span>数量：</span>${params.value}</div>`;
                        return res
                    }
                },
                grid: {
                    left: '13%',
                    right: '4%',
                    bottom: '15%',
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
                        // barWidth: '60%',
                        data: [],
                        // barWidth: '39%'
                        barMaxWidth: '16px',
                    }
                ]
            },
            option3:{
                color: ['#5B8FF9'],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        var res;

                        if(params.seriesIndex == 0){
                            res= `<div><span>城市：</span>${params.name}</div>` +
                                `<div><span>跟进中线索：</span>${params.value}</div>`;
                        }else {
                            res= `<div><span>城市：</span>${params.name}</div>` +
                                `<div><span>战败线索：</span>${params.value}</div>`;
                        }

                        return res
                    }
                },
                toolbox: {
                    // feature: {
                    //     dataView: { show: true, readOnly: false },
                    //     magicType: { show: true, type: ['line', 'bar'] },
                    //     restore: { show: true },
                    //     saveAsImage: { show: true }
                    // }
                },
                legend: {
                    data: ['跟进中线索', '战败线索']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
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
                        type: 'value',
                        name: '跟进中线索',
                        // min: 0,
                        // max: 250,
                        interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} ml'
                        // }
                        axisLine:{
                            show:true
                        }
                    },
                    {
                        type: 'value',
                        name: '战败线索',
                        // min: 0,
                        // max: 25,
                        interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} °C'
                        // }
                    }
                ],
                series: [
                    {
                        name: '跟进中线索',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        // barWidth: '10%',
                        barMaxWidth: '18px',
                        data: []
                    },
                    // {
                    //     name: 'Precipitation',
                    //     type: 'bar',
                    //     tooltip: {
                    //         valueFormatter: function (value) {
                    //             return value + ' ml';
                    //         }
                    //     },
                    //     data: [
                    //         2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                    //     ]
                    // },
                    {
                        name: '战败线索',
                        type: 'line',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        data: []
                    }
                ]
            },
            option4:{
                color: ['#1BB5F5'],
                grid:{
                  top:'15%',
                  left:'10%',
                  right:'10%',
                  bottom:'10%',
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        var res;

                        if(params.seriesIndex == 0){
                            res= `<div><span>城市：</span>${params.name}</div>` +
                                `<div><span>跟进中数量：</span>${params.value}</div>`;
                        }else {
                            res= `<div><span>城市：</span>${params.name}</div>` +
                                `<div><span>响应时长：</span>${self.formatTime(params.value)}</div>`;
                        }

                        return res
                    }
                },
                toolbox: {
                },
                legend: {
                    data: ['线索数量', '平均响应时长(秒)']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
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
                        type: 'value',
                        name: '线索数量',
                        // min: 0,
                        // max: 250,
                        interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} ml'
                        // }
                        axisLine:{
                            show:true
                        }
                    },
                    {
                        type: 'value',
                        name: '平均响应时长(秒)',
                        // min: 0,
                        // max: 25,
                        interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} °C'
                        // }
                    }
                ],
                series: [
                    {
                        name: '线索数量',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        barMaxWidth: '16px',
                        data: []
                    },
                    {
                        name: '平均响应时长(秒)',
                        type: 'line',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        data: []
                    }
                ]
            },
            option5:{
                color: ['#5B8FF9'],
                grid:{
                    top:'15%',
                    left:'10%',
                    right:'10%',
                    bottom:'10%',
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        var res;
                        res= `<div><span>城市：</span>${params.name}</div>` +
                            `<div><span>转化率：</span>${params.value}%</div>`;

                        return res
                    }
                },
                legend: {
                    data: ['转化率']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
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
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:true
                    },
                    max:100,
                    min:0,
                    interval:20,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        name:'转化率',
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'RGBA(91, 143, 249, 0.51)'
                                },
                                {
                                    offset: 1,
                                    color: 'RGBA(255, 255, 255, 0.55)'
                                }
                            ])
                        }
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
                    that.getLeftTop0()
                    that.getLeftTop1()
                    that.getRightTop()
                    that.getCenter()
                    that.getLeftBottom()
                    that.getRightBottom()
                }else if(3==r.sysUserInfo.sysDeptType||4==r.sysUserInfo.sysDeptType){
                    that.userType = 2

                    that.deptId = r.sysUserInfo.deptId

                    that.storeLists = [{name:r.sysUserInfo.deptName,deptId:r.sysUserInfo.deptId}]

                    that.q.store0 = r.sysUserInfo.deptId
                    that.q.store1 = r.sysUserInfo.deptId
                    that.q.store2 = r.sysUserInfo.deptId

                    that.initChart()
                    that.getLeftTop0()
                    that.getLeftTop1()
                    that.getRightTop()
                    that.getCenter()
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
        getLeftTop0(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryScheduleStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){

                        that.option.series[0].data = [
                            {value:r.data.onceCount,name:'沟通一次'},
                            {value:r.data.twiceCount,name:'沟通两次'},
                            {value:r.data.successCount,name:'成交'},
                            {value:r.data.defeatCount,name:'战败'},
                        ]
                        that.option.graphic[0].style.text = [r.data.totalCount,'总数量'].join('\n\n')
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
                url: baseURL + "crmStatistics/queryIntentionLevelStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){

                        that.option1.series[0].data = [
                            {value:r.data.firstImpressionCount, name:'初意向数量'},
                            {value:r.data.mediumImpressionCount, name:'中意向数量'},
                            {value:r.data.highImpressionCount, name:'高意向数量'}
                        ]
                        that.option1.graphic[0].style.text = [r.data.totalCount,'总数量'].join('\n\n')
                        that.myChart1.setOption(that.option1);
                        console.log('aaa', that.option)
                    }
                }
            });
        },

        getRightTop(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryIntentionCarStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        that.option2.xAxis[0].data = r.data.map(item=>{
                            return `${item.brandName}${item.seriesName}${item.modelName}`
                        })

                        that.option2.series[0].data = r.data.map(item=>{
                            return {
                                value:item.totalCount,
                                itemStyle:{
                                    borderRadius:[50,50,0,0]
                                }
                            }
                        })

                        that.myChart2.setOption(that.option2);
                    }
                }
            });

        },

        getCenter(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryFollowCluesStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        that.option3.xAxis[0].data = r.data.map(item=>{
                            return item.cityName
                        })

                        that.option3.series[0].data = r.data.map(item=>{
                            return {
                                value:item.followCount,
                                itemStyle:{
                                    borderRadius:[50,50,0,0]
                                }
                            }
                        })

                        that.option3.series[1].data = r.data.map(item=>{
                            return {
                                value:item.defeatCount,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.myChart3.setOption(that.option3);
                    }
                }
            });

        },

        formatTime(seconds) {
            if(seconds == null || seconds == undefined || seconds<=0){
                return '--'
            }

            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;

            let formattedTime = "";

            if (hours > 0) {
                formattedTime += `${hours}小时`;
            }

            if (minutes > 0) {
                formattedTime += `${minutes}分钟`;
            }

            formattedTime += `${remainingSeconds}秒`;

            return formattedTime;
        },

        getLeftBottom(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryResponseCluesStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        that.option4.xAxis[0].data = r.data.map(item=>{
                            return item.cityName
                        })

                        that.option4.series[0].data = r.data.map(item=>{
                            return {
                                value:item.cluesCount,
                                itemStyle:{
                                    borderRadius:[50,50,0,0]
                                }
                            }
                        })

                        that.option4.series[1].data = r.data.map(item=>{
                            return {
                                value:item.responseTime,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.myChart4.setOption(that.option4);
                    }
                }
            });
        },

        getRightBottom(){
            let that = this

            $.ajax({
                type: "POST",
                url: baseURL + "crmStatistics/queryTransformCluesStatistics",
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.userType==1? that.q.deptId:that.deptId,
                    timeCreate:that.q.timeCreate
                }),
                success: function(r){
                    if(r.code==0){
                        that.option5.xAxis.data = r.data.map(item=>{
                            return item.cityName
                        })

                        that.option5.series[0].data = r.data.map(item=>{
                            return {
                                value:item.transformRate,
                                itemStyle:{
                                    borderRadius:[50,50,0,0]
                                }
                            }
                        })

                        that.myChart5.setOption(that.option5);
                    }
                }
            });
        },

        initChart(){
            this.myChart = echarts.init(document.getElementById('stock_0'));
            this.myChart1 = echarts.init(document.getElementById('stock_1'));
            this.myChart2 = echarts.init(document.getElementById('stock_2'));
            this.myChart3 = echarts.init(document.getElementById('stock_3'));
            this.myChart4 = echarts.init(document.getElementById('stock_4'));
            this.myChart5 = echarts.init(document.getElementById('stock_5'));

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            this.myChart1.setOption(this.option1);
            this.myChart2.setOption(this.option2);
            this.myChart3.setOption(this.option3);
            this.myChart4.setOption(this.option4);
            this.myChart5.setOption(this.option5);
        },

        change0(val){
            console.log('lll', val)
            this.topchange()
        },

        change0_(val){
            console.log('iii', val)
            this.topchange()
        },

        topchange(){

            this.q.date1 = null

            this.q.date2 = null

            if(this.userType==1){
                this.q.store1 = null
                this.q.store2 = null
            }

            this.q.deptId = this.q.store0
            this.q.timeCreate = this.q.date0
            this.getCenter()
            this.getLeftTop0()
            this.getLeftTop1()
            this.getRightTop()
            this.getLeftBottom()
            this.getRightBottom()
        },

        change1(val){
            this.q.deptId = this.q.store1
            this.q.timeCreate = this.q.date1
            this.getCenter()
        },

        change1_(val){
            this.q.deptId = this.q.store1
            this.q.timeCreate = this.q.date1
            this.getCenter()
        },

        change2(val){
            this.q.deptId = this.q.store2
            this.q.timeCreate = this.q.date2
            this.getLeftBottom()
        },

        change2_(val){
            this.q.deptId = this.q.store2
            this.q.timeCreate = this.q.date2
            this.getLeftBottom()
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