layui.config({base: '../../statics/common/'}).extend({larry: 'js/base'}).use('larry');

const App = {
    data() {
        let self = this
        return {
            showConfig: false,
            q: {
                page: 1,
                limit: 10,
                carNo: null,
                orderCode: null,
                orderState: null,
                contractNo: null,
                deptName: null,
                brandId: null,
                seriesId: null,
                modelId: null,
                deptId: null,
                userName: null,
                rentType: null,
                salesman: null,
                timeStartRent:null,//租赁开始时间（开始时间）
                timeEndRent:null,//租赁开始时间（结束时间）

                timeFinishStartRent:null,//租赁结束时间（开始时间）
                timeFinishEndRent:null,//租赁结束时间（结束时间）

                timeReturnStart:null,//实际结束时间（开始时间）
                timeReturnEnd:null,//实际结束时间（结束时间）

                deptList: [],

            },
            value1:[],
            value2:[],
            value3:[],
            selDateIndex:-1,
            selDateIndex2:-1,
            selDateIndex3:-1,
            carBrandName: [],
            totalCount: 0,
            tableData: [],
            isFilter: false,
            storeLists: [],
            countList: [{
                    name: '总营收待入',
                    count: 0,
                    color: '#1890FF',
                    img: '../../statics/images/report/report0.png'
                },
                {
                    name: '总营收已入',
                    count: 0,
                    color: '#FB9A0E',
                    img: '../../statics/images/report/report1.png'
                },
                {
                    name: '总待支出',
                    count: 0,
                    color: '#3FACB3',
                    img: '../../statics/images/report/report2.png'
                },
                {
                    name: '总已支出',
                    count: 0,
                    color: '#5473E8',
                    img: '../../statics/images/report/report3.png'
                },
                {
                    name: '账单收支合计',
                    count: 0,
                    color: '#E5484D',
                    img: '../../statics/images/report/report4.png'
                },],

            modelList: [],
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
            bussList:[]
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

        $.getJSON(baseURL + "/report/financeReport/usrLst", function (r) {
            that.bussList = r.usrLst
        });

        that.getCount()

        that.query()
    },
    methods: {
        headerStyle({row, column, rowIndex, columnIndex}) {
// console.log('row', row)

            // const copyList = this.groupedArray
            //
            // let itemsList = copyList.reduce((pre, item)=>{
            //     item.items = item
            //
            //         .items
            //
            //         .map(citem=>{
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
            //
            //
            //     if(columnIndex==1){
            //         this.$nextTick(() => {
            //             document.querySelector(`.${column.id}`).setAttribute("rowSpan", "2");
            //         });
            //     }
            //
            //     if(this.groupedArray[columnIndex].items.length<=1){
            //         this.$nextTick(() => {
            //             document.querySelector(`.${column.id}`).setAttribute("rowSpan", "2");
            //         });
            //         // row[columnIndex].rowSpan = 0;
            //         // row[columnIndex].colSpan = 0;
            //         // return {display:'none'}
            //     // }else {
            //     //     row[columnIndex].rowSpan = 1;
            //     //     row[columnIndex].colSpan = 1;
            //     }
            //
            // }else if(rowIndex == 1){
            //
            //     // if(columnIndex==8){
            //     //     return {display:'none'}
            //     // }
            //
            //     if(!itemsList[columnIndex].more){
            //         return {display:'none'}
            //         // row[columnIndex].rowSpan = 2;
            //         // row[columnIndex].colSpan = 1;
            //         // return {display:'none'}
            //     }else {
            //         // row[columnIndex].rowSpan = 1;
            //         // row[columnIndex].colSpan = 1;
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
                url: baseURL + "/report/reportFiledPerson/filedListByType/orderCostType",
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
                    type: "orderCostType"
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
            this.q.brandId = val[0]
            this.q.seriesId = val[1]
            this.q.modelId = val[2]

            this.q.brandName = this.$refs.model.getCheckedNodes()[0].pathLabels[0]
            this.q.seriesName = this.$refs.model.getCheckedNodes()[0].pathLabels[1]
            this.q.modelName = this.$refs.model.getCheckedNodes()[0].pathLabels[2]
        },
        exportdata() {
            //导出
            var url = baseURL + 'report/financeReport/orderCostExport?a=a';
            if (this.q.carNo != null) {
                url += '&carNo=' + this.q.carNo;
            }
            if (this.q.orderCode != null) {
                url += '&orderCode=' + this.q.orderCode;
            }
            if (this.q.orderState != null) {
                url += '&orderState=' + this.q.orderState;
            }
            if (this.q.contractNo != null) {
                url += '&contractNo=' + this.q.contractNo;
            }
            if (this.q.deptName != null) {
                url += '&deptName=' + this.q.deptName;
            }
            if (this.q.userName != null) {
                url += '&userName=' + this.q.userName;
            }
            if (this.q.rentType != null) {
                url += '&rentType=' + this.q.rentType;
            }
            if (this.q.salesman != null) {
                url += '&salesman=' + this.q.salesman;
            }
            if (this.q.timeStartRent != null) {
                url += '&timeStartRent=' + this.q.timeStartRent;
            }
            if (this.q.timeEndRent != null) {
                url += '&timeEndRent=' + this.q.timeEndRent;
            }
            if (this.q.timeFinishStartRent != null) {
                url += '&timeFinishStartRent=' + this.q.timeFinishStartRent;
            }
            if (this.q.timeFinishEndRent != null) {
                url += '&timeFinishEndRent=' + this.q.timeFinishEndRent;
            }
            if (this.q.timeReturnStart != null) {
                url += '&timeReturnStart=' + this.q.timeReturnStart;
            }
            if (this.q.timeReturnEnd != null) {
                url += '&timeReturnEnd=' + this.q.timeReturnEnd;
            }
            window.location.href = url;
        },

        //重置
        reset: function () {
            this.$refs['form'].resetFields()
            this.q = {
                page: 1,
                limit: 10,
                carNo: null,
                orderCode: null,
                orderState: null,
                contractNo: null,
                deptName: null,
                brandId: null,
                seriesId: null,
                modelId: null,
                deptId: null,
                userName: null,
                rentType: null,
                salesman: null,
                timeStartRent:null,//租赁开始时间（开始时间）
                timeEndRent:null,//租赁开始时间（结束时间）

                timeFinishStartRent:null,//租赁结束时间（开始时间）
                timeFinishEndRent:null,//租赁结束时间（结束时间）

                timeReturnStart:null,//实际结束时间（开始时间）
                timeReturnEnd:null,//实际结束时间（结束时间）

                deptList: [],
            }
            this.selDateIndex = -1
            this.value1=[]
            this.selDateIndex2 = -1
            this.value2=[]
            this.selDateIndex3 = -1
            this.value3=[]
            this.carBrandName = []

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
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        handleSizeChange(val) {
            this.q.limit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.q.page = val
            this.getList()
        },
        getList() {
            let that = this
            $.ajax({
                type: "GET",
                url: baseURL + "/report/reportFiledPerson/filedListByType/orderCostType",
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
                        $.ajax({
                            type: "GET",
                            url: baseURL + "/report/financeReport/getOrderCostList",
                            // contentType: "application/json",
                            data: that.q,
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
        timeChange(val){
            console.log('日期选择了', val)

            this.selDateIndex = -1
            if(val){
                this.q.timeStartRent = val[0] + ' 00:00:00';
                this.q.timeEndRent = val[1] + ' 23:59:59';
            }else {
                this.q.timeStartRent = null
                this.q.timeEndRent = null
            }
        },
        getSearchDateByType: function(type){
            this.value1 = []

            this.selDateIndex = type
            this.q.timeStartRent = getSearchDateByType(type)[0]
            this.q.timeEndRent = getSearchDateByType(type)[1]

            console.log(this.q.timeStartRent, '---', this.q.timeEndRent)
        },
        timeChange2(val){
            console.log('日期选择了', val)

            this.selDateIndex2 = -1
            if(val){
                this.q.timeFinishStartRent = val[0] + ' 00:00:00';
                this.q.timeFinishEndRent = val[1] + ' 23:59:59';
            }else {
                this.q.timeFinishStartRent = null
                this.q.timeFinishEndRent = null
            }
        },
        getSearchDateByType2: function(type){
            this.value1 = []

            this.selDateIndex2 = type
            this.q.timeFinishStartRent = getSearchDateByType(type)[0]
            this.q.timeFinishEndRent = getSearchDateByType(type)[1]

            console.log(this.q.timeFinishStartRent, '---', this.q.timeFinishEndRent)
        },
        timeChange3(val){
            console.log('日期选择了', val)

            this.selDateIndex3 = -1
            if(val){
                this.q.timeReturnStart = val[0] + ' 00:00:00';
                this.q.timeReturnEnd = val[1] + ' 23:59:59';
            }else {
                this.q.timeReturnStart = null
                this.q.timeReturnEnd = null
            }
        },
        getSearchDateByType3: function(type){
            this.value3 = []

            this.selDateIndex3 = type
            this.q.timeReturnStart = getSearchDateByType(type)[0]
            this.q.timeReturnEnd = getSearchDateByType(type)[1]

            console.log(this.q.timeReturnStart, '---', this.q.timeReturnEnd)
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
            console.log('点击了', self.q)
            this.q.deptId = treeNode.deptId
            this.q.deptName = treeNode.name
            // Vue.set(this.q, "deptId", treeNode.deptId);
            // Vue.set(this.q, "deptName", treeNode.name);
            layer.closeAll();
        },
        chooseWarehouse: function () {
            var index = layer.open({
                title: "选择仓库",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
                end: function () {
                    vm.q = Object.assign({}, vm.q, {
                        //depotId:vm.warehouseData.warehouseId,
                        depotName: vm.warehouseData.warehouseName,
                    });
                    layer.close(index);

                }
            });
        },

        getCount() {
            let that = this
            $.get(baseURL + '/report/financeReport/orderTotal',
                that.q,
                function (r) {
                    if (r.code == 0) {
                        that.countList[0].count = r.data.enterTotal?.toFixed(2)??Number(0).toFixed(2)
                        that.countList[1].count = r.data.alreadyEnterTotal?.toFixed(2)??Number(0).toFixed(2)
                        that.countList[2].count = r.data.enterPayTotal?.toFixed(2)??Number(0).toFixed(2)
                        that.countList[3].count = r.data.alreadyEnterPayTotal?.toFixed(2)??Number(0).toFixed(2)
                        that.countList[4].count = Number(
                            r.data.enterTotal+
                            r.data.alreadyEnterTotal-
                            r.data.enterPayTotal-
                            r.data.alreadyEnterPayTotal).toFixed(2)
                    }
                });

            $.get(baseURL + '/report/financeReport/carModelList', {
                deptIdList: that.q.deptList.join(",")
            }, function (r) {
                that.modelList = r.list
            });
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