layui.config({base: '../../statics/common/'}).extend({larry: 'js/base'}).use('larry');
const App = {
    data() {
        let self = this
        return {
            loading:false,
            disabledDateFn:(time) => {
                return time.getTime() > Date.now();
            },
            showConfig: false,
            pageType: 0,
            statType: 0,
            deptId: null,
            q: {
                date0: [],
                carModelList: [],
                start: null,
                end: null,
                deptList: [],
            },
            q2: {
                page: 1,
                limit: 10,
                carNo: null,
                depotName: null,
                deptName: null,
                deptId: null,
                sourceType: null,

                supplierName: null,
                warehouseStr: null,
                warehouseStr2: null,
                businessType: null,
                timeStr: null,
                timeStr2: null,
                brandId: null,
                seriesId: null,
                modelId: null,
            },
            carBrandName: [],
            totalCount: 0,
            tableData: [],
            isFilter: false,
            storeLists: [],
            countList: [{
                name: '收入金额',
                count: 0,
                color: '#1890FF',
                img: '../../statics/images/report/report0.png'
            },
                {
                    name: '支出金额',
                    count: 0,
                    color: '#FB9A0E',
                    img: '../../statics/images/report/report1.png'
                },
                {
                    name: '车辆折旧费',
                    count: 0,
                    color: '#3FACB3',
                    img: '../../statics/images/report/report2.png'
                },
                {
                    name: '税费',
                    count: 0,
                    color: '#5473E8',
                    img: '../../statics/images/report/report3.png'
                },
                {
                    name: '坏账金额',
                    count: 0,
                    color: '#E5484D',
                    img: '../../statics/images/report/report4.png'
                },
                {
                    name: '当前收益',
                    count: 0,
                    color: '#30A46C',
                    img: '../../statics/images/report/report5.png'
                }],
            myChart: null,
            myChart_: null,
            myChart1: null,
            modelList: [],
            option: {
                color: ['#32B9B8', '#18D7FF'],
                grid: {
                    top: '15%',
                    left: '8%',
                    right: '10%',
                    bottom: '19%',
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        var res;
                        if (params.seriesIndex == 0) {
                            res = `<div><span>车型：</span>${params.name}</div>` +
                                `<div><span>交易额：</span>${params.value.toFixed(2)}</div>`;
                        } else {
                            res = `<div><span>车型：</span>${params.name}</div>` +
                                `<div><span>收益：</span>${params.value.toFixed(2)}</div>`;
                        }
                        return res
                    }
                },
                toolbox: {},
                legend: {
                    data: ['交易额', '收益']
                },
                xAxis: [
                    {
                        axisTick: {
                            alignWithLabel: true
                        },
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,//使x轴横坐标全部显示
                            rotate: 30,
                            textStyle: {//x轴字体样式
                                // color: "rgba(219,225,255,1)",
                                margin: 15
                            },
                            formatter: function (value, index) {
                                if (value.length > 9) {
                                    return value.substr(0, 9) + '...'
                                } else {
                                    return value
                                }
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '交易额(元)',
                        // min: 0,
                        // max: 250,
                        // interval: 100000,
                        // axisLabel: {
                        //     formatter: '{value} ml'
                        // }
                        axisLine: {
                            show: false
                        },
                        splitNumber: 5,
                        // boundaryGap : [ 0.2, 0.2 ]
                    },
                    {
                        type: 'value',
                        name: '收益(元)',
                        // min: 0,
                        // max: 25,
                        // interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} °C'
                        // }
                        axisLine: {  //坐标轴
                            show: false
                        },
                        splitLine: {show: false},
                        splitNumber: 5,
                    }
                ],
                series: [
                    {
                        name: '交易额',
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
                        name: '收益',
                        type: 'line',
                        smooth: "true",
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
            option_: {
                color: ['#32B9B8', '#FF9036', '#18D7FF'],
                grid: {
                    top: '15%',
                    left: '8%',
                    right: '10%',
                    bottom: '19%',
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        var res;
                        if (params.seriesIndex == 0) {
                            res = `<div><span>公司：</span>${params.name}</div>` +
                                `<div><span>收入：</span>${params.value.toFixed(2)}</div>`;
                        } else if (params.seriesIndex == 1) {
                            res = `<div><span>公司：</span>${params.name}</div>` +
                                `<div><span>支出：</span>${params.value.toFixed(2)}</div>`;
                        } else {
                            res = `<div><span>公司：</span>${params.name}</div>` +
                                `<div><span>收益：</span>${params.value.toFixed(2)}</div>`;
                        }
                        return res
                    }
                },
                toolbox: {},
                legend: {
                    data: ['收入', '支出', '收益']
                },
                xAxis: [
                    {
                        axisTick: {
                            alignWithLabel: true
                        },
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,//使x轴横坐标全部显示
                            rotate: 30,
                            textStyle: {//x轴字体样式
                                // color: "rgba(219,225,255,1)",
                                margin: 15
                            },
                            formatter: function (value, index) {
                                if (value.length > 9) {
                                    return value.substr(0, 9) + '...'
                                } else {
                                    return value
                                }
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '收入(元)',
                        // min: 0,
                        // max: 250,
                        // interval: 100000,
                        // axisLabel: {
                        //     formatter: '{value} ml'
                        // }
                        axisLine: {
                            show: false
                        },
                        splitNumber: 5,
                        // boundaryGap : [ 0.2, 0.2 ]
                    },
                    {
                        type: 'value',
                        name: '',
                        // min: 0,
                        // max: 250,
                        // interval: 100000,
                        // axisLabel: {
                        //     formatter: '{value} ml'
                        // }
                        axisLine: {
                            show: false
                        },
                        splitLine: {show: false},
                        // splitNumber : 5,
                        // boundaryGap : [ 0.2, 0.2 ]
                    },
                    {
                        type: 'value',
                        name: '收益(元)',
                        // min: 0,
                        // max: 25,
                        // interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} °C'
                        // }
                        axisLine: {  //坐标轴
                            show: false
                        },
                        splitLine: {show: false},
                        splitNumber: 5,
                    }
                ],
                series: [
                    {
                        name: '收入',
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
                        name: '支出',
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
                        name: '收益',
                        type: 'line',
                        smooth: "true",
                        yAxisIndex: 2,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        data: []
                    }
                ]
            },
            option1: {
                color: ['#F6BD16'],
                grid: {
                    top: '15%',
                    left: '8%',
                    right: '10%',
                    bottom: '12%',
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        var res = `<div><span>月份：</span>${params.name}</div>` +
                            `<div><span>收益：</span>${params.value.toFixed(2)}</div>`;
                        return res
                    }
                },
                toolbox: {},
                legend: {
                    data: ['收益']
                },
                xAxis: [
                    {
                        axisTick: {
                            alignWithLabel: true
                        },
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,//使x轴横坐标全部显示
                            rotate: 30,
                            textStyle: {//x轴字体样式
                                // color: "rgba(219,225,255,1)",
                                margin: 15
                            },
                            // formatter: function (value, index) {
                            //     if(value.length>4){
                            //         return value.substr(0,4)+'...'
                            //     }else{
                            //         return value
                            //     }
                            // }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '收益(元)',
                        // min: 0,
                        // max: 25,
                        // interval: 2,
                        // axisLabel: {
                        //     formatter: '{value} °C'
                        // }
                        axisLine: {  //坐标轴
                            show: false
                        },
                        // splitLine:{show: false},
                        splitNumber: 5,
                    }
                ],
                series: [
                    // {
                    //     name: '交易额',
                    //     type: 'bar',
                    //     tooltip: {
                    //         valueFormatter: function (value) {
                    //             return value;
                    //         }
                    //     },
                    //     barMaxWidth: '16px',
                    //     data: []
                    // },
                    {
                        name: '收益',
                        type: 'line',
                        smooth: "true",
                        yAxisIndex: 0,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        data: []
                    }
                ]
            },
            brandList: [],
            groupedArray: [],
            configData: [
                // {
                //     key: 1,
                //     label: '北京',
                //     disabled: false
                // },
                // {
                //     key: 2,
                //     label: '上海',
                //     disabled: false
                // },
                // {
                //     key: 3,
                //     label: '广州',
                //     disabled: true
                // }
            ],
            configValue: [],
            storageList:[],
            defaultTreeProps: {
                children: "children",
                label: "name"
            },
            storeIdValue: [],
            storeList:[],
            deptName:null
        };
    },
    mounted() {
        let that = this

        window.addEventListener('resize', debounce(() => {
            window.location.reload()
        }))

        $.get(baseURL + '/report/financeReport/AffiliateCompanyList', function (r) {
            that.storeLists = r.deptList
        });

        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            that.brandList = r.carTreeVoList
        });

        $.getJSON(baseURL + "warehouse/warehouse/getWarehouseList", {page:1, limit:9999}, function (r) {
            that.storageList = r.data
        });

        $.getJSON(baseURL + "sys/dept/list", function (r) {
            that.storeList = that.formatRegionList(r)
        });

        this.q2.timeStr = moment(new Date()).format('YYYY-01-01')+' / '+moment(new Date()).format('YYYY-MM-DD')
        this.q2.timeStr2 = [moment(new Date()).format('YYYY-01-01'), moment(new Date()).format('YYYY-MM-DD')]

        this.q.start = moment(new Date()).add(-1, 'Y').format('YYYY-MM')
        this.q.end = moment(new Date()).format('YYYY-MM')
        this.q.date0 = [moment(new Date()).add(-1, 'Y').format('YYYY-MM'), moment(new Date()).format('YYYY-MM')]


        that.initChart()
        that.getCount()

        that.getTop0()
        that.getTop1()
        that.getBottom()

        that.query()
    },
    methods: {
        formatRegionList(dataSources){
            let map = new Map();
            let result = [];

            // Step 1: Map each deptId to its object
            dataSources.forEach(item => {
                map.set(item.deptId, item);
                item.children = []; // Initialize children array
            });
            // Step 2: Build the tree structure
            dataSources.forEach(item => {
                if (item.parentId) {
                    let parent = map.get(item.parentId);
                    if (parent) {
                        parent.children.push(item);
                    }
                } else {
                    result.push(item); // Top-level departments
                }
            });
            return result;
        },
        changeStore(e){
            console.log('changeStore', e)
        },
        handleNodeClick(val) {
            let res = this.$refs.tree.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
            let arrLabel = [];
            let arr = [];
            let ids = [];
            res.forEach(item => {
                arrLabel.push(item.name);
                arr.push(item);
                ids.push(item.id);
            });
            this.storeIdValue = arr;
            this.storeId = arrLabel;
            console.log('res:', res)
            console.log('arr:' + JSON.stringify(arr))
            console.log('arrLabel:' + arrLabel)

            console.log('handleNodeClick', val)

            this.q2.deptName = arrLabel?.join(",")??null;
            this.deptName = arrLabel;
        },

        headerStyle({row, column, rowIndex, columnIndex}) {

            // console.log('row', row)

            // let itemsList = this.groupedArray.reduce((pre, item)=>{
            //     item.items = item.items.map(citem=>{
            //         citem.more = item.items.length>1
            //         return citem
            //     })
            //     return pre.concat(item.items)
            // }, [])

            // console.log('itemsList', itemsList)

            // for (const index in this.groupedArray) {
            //     let groupItem = this.groupedArray[index];
            //
            //     if(groupItem.items.length<=1 && rowIndex == 0){
            //         row[index].rowSpan = 2;
            //     }
            // }

            // if(rowIndex == 0){
            //     if(this.groupedArray[columnIndex].items.length<=1){
            //         row[columnIndex].rowSpan = 2;
            //     }
            //
            // }else if(rowIndex == 1){
            //     if(!itemsList[columnIndex].more){
            //         row[columnIndex].rowSpan = 0;
            //     }else {
            //         row[columnIndex].rowSpan = 1;
            //     }
            // }


            return {
                backgroundColor: "#f6f8f8",
                color: '#000'
            };
        },
        goCarDetail(row, citem) {
            if ('carNo' == citem.filedKey) {
                const {carId, carNo} = row

                var index = layer.open({
                    title: "车辆收益详情",
                    type: 2,
                    boxParams: row,
                    content: tabBaseURL + "modules/report/carFeeDetail_new.html",
                    success: function (layero, num) {
                        // var iframe = window['layui-layer-iframe'+num];
                        // iframe.vm.initEditData(carId,carNo);
                    },
                    end: function () {
                        vm.showForm = false;
                        layer.closeAll();
                    }
                });
                vm.showForm = true;
                layer.full(index);
            }
        },
        openConfig() {
            this.showConfig = true;
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "/report/reportFiledPerson/filedListByType/carIncomeType",
                success: function (r) {
                    if (r.code == 0) {
                        const {alreadySetList, unSetList} = r.data
                        that.configData = unSetList.map(item => ({
                            key: item.id,
                            label: item.name,
                            disabled: false
                        })).concat(alreadySetList.map(item => ({
                            key: item.id,
                            label: item.name,
                            disabled: false
                        })))
                        that.configValue = alreadySetList.map(item => item.id)
                    }
                }
            });

        },
        configChange(val) {
            console.log('configChange', val)
        },
        confirmConfig() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "/report/reportFiledPerson/save",
                data: {
                    filedIdList: that.configValue.join(","),
                    type: "carIncomeType"
                },
                success: function (r) {
                    if (r.code == 0) {
                        that.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        that.showConfig = false
                        that.query()
                    } else {
                        that.$message({
                            message: r.msg,
                            type: 'error'
                        })
                    }
                }
            });

        },
        handleBrandChange(val) {
            console.log('handleBrandChange', val)
            this.q2.brandId = val[0]
            this.q2.seriesId = val[1]
            this.q2.modelId = val[2]

            this.q2.brandName = this.$refs.model.getCheckedNodes()[0].pathLabels[0]
            this.q2.seriesName = this.$refs.model.getCheckedNodes()[0].pathLabels[1]
            this.q2.modelName = this.$refs.model.getCheckedNodes()[0].pathLabels[2]
        },
        exportdata() {
            var url = baseURL + 'report/financeReport/export?1=1';
            if (this.q2.carNo != null) {
                url += '&carNo=' + this.q2.carNo;
            }
            if (this.q2.depotName != null) {
                url += '&depotName=' + this.q2.depotName;
            }
            if (this.q2.deptName != null) {
                url += '&deptName=' + this.q2.deptName;
            }
            if (this.q2.sourceType != null) {
                url += '&sourceType=' + this.q2.sourceType;
            }
            if (this.q2.supplierName != null) {
                url += '&supplierName=' + this.q2.supplierName;
            }
            if (this.q2.businessType != null) {
                url += '&businessType=' + this.q2.businessType;
            }
            if (this.q2.timeStr != null) {
                url += '&timeStr=' + this.q2.timeStr;
            }
            if (this.q2.brandId != null) {
                url += '&brandId=' + this.q2.brandId;
            }
            if (this.q2.seriesId != null) {
                url += '&seriesId=' + this.q2.seriesId;
            }
            if (this.q2.modelId != null) {
                url += '&modelId=' + this.q2.modelId;
            }
            if (this.q2.warehouseStr != null) {
                url += '&warehouseStr=' + this.q2.warehouseStr;
            }
            window.location.href = url;
        },

        //重置
        reset: function () {
            this.$refs['form'].resetFields()
            this.q2 = {
                page: 1,
                limit: 10,
                carNo: null,
                depotName: null,
                deptName: null,
                deptId: null,
                sourceType: null,
                supplierName: null,
                warehouseStr: null,
                warehouseStr2: null,
                businessType: null,
                timeStr: null,
                timeStr2: null,
                brandId: null,
                seriesId: null,
                modelId: null,
            }


            this.carBrandName = []
            this.deptName = null

            // this.getList()
            this.query()
        },
        //查询
        query: function () {
            // vm.reload();

            this.q2.page = 1
            this.getList()
            this.getCount()
        },
        // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        handleSizeChange(val) {
            this.q2.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.q2.page = val
            this.getList()
        },
        getList() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "/report/reportFiledPerson/filedListByType/carIncomeType",
                // contentType: "application/json",
                success: function (r) {
                    if (r.code == 0) {
                        const {alreadySetList} = r.data
                        // 使用 reduce 方法将列表按照 type 属性分组
                        const groupedData = alreadySetList.reduce((result, item) => {
                            const type = item.type;
                            if (!result[type]) {
                                result[type] = [];
                            }
                            result[type].push(item);
                            return result;
                        }, {});

                        // 将分组后的数据转换成数组
                        that.groupedArray = Object.entries(groupedData).map(([type, items]) => ({
                            type: parseInt(type), // 将 type 转换成数字
                            items: items,
                            toggle: true
                        }));

                        // 按 type 属性排序
                        that.groupedArray.sort((a, b) => a.type - b.type);

                        console.log('处理完', that.groupedArray);
                        console.log('q2', that.q2);
                        $.ajax({
                            type: "GET",
                            url: baseURL + "report/financeReport/list",
                            // contentType: "application/json",
                            data: that.q2,
                            success: function (r) {
                                if (r.code == 0) {
                                    that.tableData = r.data
                                    that.totalCount = Number(r.count)
                                }
                            }
                        });
                    }
                }
            });
        },
        sourceTypeChange(val) {
            console.log('sourceTypeChange', val)
        },
        businessTypeChange(val) {
            console.log('businessTypeChange', val)
        },
        timeChange(val) {
            console.log('日期选择了', val)
            if (val) {
                this.q2.warehouseStr = val[0] + ' / ' + val[1];
            } else {
                this.q2.warehouseStr = null
            }
        },
        timeChange2(val) {
            console.log('日期选择了', val)
            if (val) {
                this.q2.timeStr = val[0] + ' / ' + val[1];
            } else {
                this.q2.timeStr = null
            }
            console.log('q2.timestr2', this.q2.timeStr, this.q2.timeStr2)
        },
        deptTree: function () {
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function () {
                    layer.close(index);
                }
            });
        },

        add: (treeNode) => {
            console.log('aaa', App)
        },
        zTreeClick: function (event, treeId, treeNode) {
            const self = this
            console.log('点击了', self.q2)
            this.q2.deptId = treeNode.deptId
            this.q2.deptName = treeNode.name
            layer.closeAll();
        },
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q2 = Object.assign({}, vm.q2, {
                        //depotId:vm.warehouseData.warehouseId,
                        depotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },


        getCount() {
            let that = this
            $.get(baseURL + '/report/financeReport/total',
                {
                    start: that.q.start,
                    end: that.q.end,
                    deptList: that.q.deptList.join(","),
                },
                function (r) {
                    if (r.code == 0) {
                        that.countList[0].count = r.data.tradeTotal.toFixed(2)
                        that.countList[1].count = r.data.payTotal.toFixed(2)
                        that.countList[2].count = r.data.carSpentTotalAmount.toFixed(2)
                        that.countList[3].count = r.data.depreciateTotal.toFixed(2)
                        that.countList[4].count = r.data.badTotal.toFixed(2)
                        that.countList[5].count = r.data.incomeTotal.toFixed(2)
                    }
                });

            $.get(baseURL + '/report/financeReport/carModelList', {
                deptList: that.q.deptList.join(",")
            }, function (r) {
                that.modelList = r.list
            });
        },

        getTop0() {
            let that = this
            this.loading = true
            $.ajax({
                type: "GET",
                url: baseURL + "/report/financeReport/carModelData",
                // contentType: "application/json",
                data: {
                    start: that.q.start,
                    end: that.q.end,
                    deptList: that.q.deptList.join(","),
                    carModelList: that.q.carModelList.join(","),
                },
                success: function (r) {
                    that.loading = false
                    if (r.code == 0) {

                        that.option.xAxis[0].data = r.list.map(item => {
                            return item.modelName
                        })

                        that.option.series[0].data = r.list.map(item => {
                            return {
                                value: item.tradeTotal,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.option.series[1].data = r.list.map(item => {
                            return {
                                value: item.incomeTotal,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.myChart.setOption(that.option);
                    }
                },
                error:function (xhr,status,error) {
                    that.loading = false
                }
            });
        },

        getTop1() {
            let that = this

            $.ajax({
                type: "GET",
                url: baseURL + "/report/financeReport/companyData",
                // contentType: "application/json",
                data: {
                    start: that.q.start,
                    end: that.q.end,
                    deptList: that.q.deptList.join(","),
                    carModelList: that.q.carModelList.join(","),
                },
                success: function (r) {
                    if (r.code == 0) {
                        that.option_.xAxis[0].data = r.list.map(item => {
                            return item.companyName
                        })

                        that.option_.series[0].data = r.list.map(item => {
                            return {
                                value: item.tradeTotal,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.option_.series[1].data = r.list.map(item => {
                            return {
                                value: item.payTotal,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.option_.series[2].data = r.list.map(item => {
                            return {
                                value: item.incomeTotal,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })

                        that.myChart_.setOption(that.option_);
                    }
                }
            });
        },

        getBottom() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "/report/financeReport/incomeTrend",
                // contentType: "application/json",
                data: {
                    start: that.q.start,
                    end: that.q.end,
                    deptList: that.q.deptList.join(","),
                },
                success: function (r) {
                    if (r.code == 0) {
                        that.option1.xAxis[0].data = r.list.map(item => {
                            return item.yearAndMonth
                        })

                        that.option1.series[0].data = r.list.map(item => {
                            return {
                                value: item.incomeTotal,
                                // itemStyle:{
                                //     borderRadius:[50,50,0,0]
                                // }
                            }
                        })
                        that.myChart1.setOption(that.option1);
                    }
                }
            });
        },

        initChart() {
            this.myChart = echarts.init(document.getElementById('stock_0'));
            this.myChart_ = echarts.init(document.getElementById('stock_02'));
            this.myChart1 = echarts.init(document.getElementById('stock_1'));

            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
            this.myChart_.setOption(this.option_);
            this.myChart1.setOption(this.option1);
        },

        change0(val) {
            this.q.carModelList = []

            this.getCount()
            this.getTop0()
            this.getTop1()
            this.getBottom()
        },

        change0_(val) {
            this.q.start = val ? val[0] : null
            this.q.end = val ? val[1] : null
            this.getCount()
            this.getTop0()
            this.getTop1()
            this.getBottom()
        },

        change1(val) {
            this.getCount()
            this.getTop0()
            this.getTop1()
            this.getBottom()
        },
        statChange(type) {
            this.statType = Number(type)
        },
        pageChange(type) {
            this.pageType = Number(type)
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
const vm = app.mount("#rrapp");
window.vm = vm;