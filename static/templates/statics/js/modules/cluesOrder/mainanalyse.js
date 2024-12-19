layui.config({ base: '../../statics/common/' }).extend({ larry: 'js/base' }).use('larry');
const App = {
    data() {
        let self = this
        return {
            tabList:[],
            userType:0,//1总公司  2子/分公司
            q:{
                deptId:null,
                saleId:null,
                month:null,
            },
            storeLists:[],
            salerList:[],
            myChart:null,
            myChart1:null,
            option:{
                color: ['#5B80F9'],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params){
                        var res;
                        res= `<div><span></span>${params.name}</div>` +
                            `<div><span></span>利润：${params.value}万元</div>`;

                        return res
                    }
                },
                legend: {
                    data: ['利润']
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
                    name: '单位：万元',
                    axisLine:{
                        show:true
                    },
                    // max:100,
                    // min:0,
                    // interval:20,
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
                series: [
                    {
                        name:'利润',
                        data: [],
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
            option1:{
                color: ['#26B1FF'],
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
                        res= `<div><span></span>${params.name}</div>` +
                            `<div><span>数量：</span>${params.value}</div>`;
                        return res
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
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
                        name: '单位(辆)',
                        type: 'bar',
                        data: [],
                        // barWidth: '5%',
                        // barMinWidth: '18%',
                        barMaxWidth: '18px',
                    }
                ]
            },
            activeIndex:null,
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

                    that.tabList = ['按公司统计','按车型统计','按时间统计']
                    that.activeIndex = that.tabList[0]

                    that.getDeptList();
                    that.getSalesList();
                    that.initChart();
                    that.getData();
                }else if(3==r.sysUserInfo.sysDeptType||4==r.sysUserInfo.sysDeptType){
                    that.userType = 2

                    that.tabList = ['按车型统计','按时间统计','按员工统计']
                    that.activeIndex = that.tabList[0]

                    that.q.deptId = r.sysUserInfo.deptId

                    that.storeLists = [{name:r.sysUserInfo.deptName,deptId:r.sysUserInfo.deptId}]

                    that.getSalesList();
                    that.initChart();
                    that.getData();
                }
            }
        });



    },
    methods: {
        tabClick(item){
            this.activeIndex = item
            this.getData()
        },
        getDeptList(){
            let _this = this
            $.getJSON(baseURL + "sys/dept/list", {sysDeptType:'3,4', sysDeptStatus:1}, function (r) {
                _this.storeLists = r

                console.log('---', _this.storeLists)
            });
        },

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

        getCluesSource(type){
            return getCluesSource(type)
        },
        getData(){
            let that = this

            // '按公司统计','按车型统计','按时间统计','按员工统计'

            let api = this.activeIndex == '按公司统计'?"crmStatistics/querySaleAnalysisByCompany":
                this.activeIndex == '按车型统计'?"crmStatistics/querySaleAnalysisByCar":
                this.activeIndex == '按时间统计'?"crmStatistics/querySaleAnalysisByDate":
                this.activeIndex == '按员工统计'?"crmStatistics/querySaleAnalysisByUser":""

            $.ajax({
                type: "POST",
                url: baseURL + api,
                contentType: "application/json",
                data: JSON.stringify({
                    deptId:that.q.deptId,
                    saleId:that.q.saleId,
                    searchDate:that.q.month,
                }),
                success: function(r){
                    if(r.code==0){
                        if(that.activeIndex == '按公司统计'){
                            that.option.xAxis.data = r.data.map(item=>{
                                return item.deptName
                            })
                            that.option.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleAmount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart.setOption(that.option);


                            that.option1.xAxis[0].data = r.data.map(item=>{
                                return item.deptName
                            })
                            that.option1.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleCarCount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart1.setOption(that.option1);
                        }else if(that.activeIndex == '按车型统计'){
                            that.option.xAxis.data = r.data.map(item=>{
                                return `${item.brandName}${item.seriesName}${item.modelName}`
                            })
                            that.option.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleAmount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart.setOption(that.option);


                            that.option1.xAxis[0].data = r.data.map(item=>{
                                return `${item.brandName}${item.seriesName}${item.modelName}`
                            })
                            that.option1.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleCarCount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart1.setOption(that.option1);
                        }else if(that.activeIndex == '按时间统计'){
                            that.option.xAxis.data = r.data.map(item=>{
                                return item.month+'月'
                            })
                            that.option.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleAmount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart.setOption(that.option);


                            that.option1.xAxis[0].data = r.data.map(item=>{
                                return item.month+'月'
                            })
                            that.option1.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleCarCount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart1.setOption(that.option1);
                        }else if(that.activeIndex == '按员工统计'){
                            that.option.xAxis.data = r.data.map(item=>{
                                return item.saleName
                            })
                            that.option.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleAmount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart.setOption(that.option);


                            that.option1.xAxis[0].data = r.data.map(item=>{
                                return item.saleName
                            })
                            that.option1.series[0].data = r.data.map(item=>{
                                return {
                                    value:item.saleCarCount,
                                    itemStyle:{
                                        borderRadius:[50,50,0,0]
                                    }
                                }
                            })
                            that.myChart1.setOption(that.option1);
                        }

                    }
                }
            });
        },

        initChart(){
            this.myChart = echarts.init(document.getElementById('stock_0'));
            this.myChart1 = echarts.init(document.getElementById('stock_1'));
            //
            // // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            this.myChart1.setOption(this.option1);
        },

        change(val){
            this.getData()
        },

        change1(val){
            this.getData()
        },

        change2(){
            this.getData()
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