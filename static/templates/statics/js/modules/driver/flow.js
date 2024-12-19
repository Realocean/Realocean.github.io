$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        var table = layui.table
            ,util = layui.util;

        //监听单元格编辑
        table.on('edit(grid2)', function(obj){
            // var value = obj.value //得到修改后的值
            //     ,data = obj.data //得到所在行所有键值
            //     ,field = obj.field; //得到字段
            console.log('修改值了', obj);
            // layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改值为：'+ util.escape(value));

            vm.update(obj.data)
        });

        layui.form.render();
    });
    //监听选择司机
    layui.form.on('select(driverName)', function (data) {
        if(data.value){
            vm.q.driverName = data.value;
        }
    });
    //监听选择平台
    layui.form.on('select(platformName)', function (data) {
        if(data.value){
            vm.q.platformName = data.value;
        }
    });
    //结算时间
    layui.laydate.render({
        elem: '#settlementDate',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            // $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            console.log('选择时间了===>'+value+"==date==>",date,"===endDate===>",endDate)
            if(date && date.year){
                vm.q.settlementDate = value;
                vm.q.settlementStartDate = date.year+'-'+date.month+'-'+date.date;
                vm.q.settlementEndDate = endDate.year+'-'+endDate.month+'-'+endDate.date;
            }else {
                vm.q.settlementDate = '';
                vm.q.settlementStartDate = null;
                vm.q.settlementEndDate = null;
            }


            // if(vm.q.tableType == 1 || vm.q.tableType == 4){
            //     vm.changeStatus(0)
            // }
            // vm.q.tableType = 0
        }

    });
    //入职时间
    layui.laydate.render({
        elem: '#joinTime',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            // $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            console.log('选择时间了', value, date, endDate)

            if(date && date.year){
                vm.q.joinTime = value;
                vm.q.joiningStartTime = date.year+'-'+date.month+'-'+date.date;
                vm.q.joiningEndTime = endDate.year+'-'+endDate.month+'-'+endDate.date;
            }else {
                vm.q.joinTime = '';
                vm.q.joiningStartTime = null;
                vm.q.joiningEndTime = null;
            }
        }

    });
    //导入时间
    layui.laydate.render({
        elem: '#importTime',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            // $('div[type="updateTimeType"]>div').removeClass('task-content-box-tab-child-active');
            console.log('选择时间了', value, date, endDate)

            if(date && date.year){
                vm.q.importTime = value;
                vm.q.importStartTime = date.year+'-'+date.month+'-'+date.date;
                vm.q.importEndTime = endDate.year+'-'+endDate.month+'-'+endDate.date;
            }else {
                vm.q.importTime = '';
                vm.q.importStartTime = null;
                vm.q.importEndTime = null;
            }

        }

    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            driverName: null,
            contactNumber: null,
            carNo: null,
            businessLeader: null,
            importStartTime: null,
            importEndTime: null,
            settlementStartDate: null,
            settlementEndDate: null,
            settlementDate: null,
            platformName: null,
            brandSeriesModel: null,
            tableType:0,//0-全部;1-当月数据;2-近3天无流水;3-近5天无流水;4-当月流水不达
            sortColumn:null,
            orderType:null,
        },
        isClose: true,
        allCarModels:[],
        isFilter:false,
        count0:0,
        count1:0,
        count2:0,
        count3:0,
        count4:0,
        tabIndex:0,
        driverList:[],
        businessLeaderList:[],
        platformList:[],
        tableConditionlist:[],
        countList0:{},
        countList1:{},
        showtable:false,
        selData:{},
        firstenter:true,
    },
    created: function () {
        layui.config({
            base: "../../statics/common/cascader/layui/lay/mymodules/"
        }).use(['form',"jquery","cascader","form"], function(){
            var cascader = layui.cascader;
            $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
                vm.allCarModels = r.carTreeVoList;
                cascader({
                    elem: "#carBrandSeriesModel",
                    data: vm.allCarModels,
                    success: function (valData,labelData) {
                        // if(valData.length>2){
                        //     vm.q.brandId = valData[0];
                        //     vm.q.seriesId = valData[1];
                        //     vm.q.modelId = valData[2];
                        // }else {
                        //     vm.q.brandId = valData[0];
                        //     vm.q.seriesId = valData[1];
                        //     vm.q.modelId =null;
                        // }

                        vm.q.brandSeriesModel = labelData.join('/');

                    }
                });
            });


            $.getJSON(baseURL + "driver/flow/searchInfoList", function (r) {
                if(r.code === 0){
                    vm.driverList = r.driverList
                    vm.businessLeaderList = r.businessLeaderList
                    vm.platformList = r.platformList
                }
            });

            vm.getCount()



        });

    },
    mounted: function(){
        this.resetSettleTime()
    },
    updated: function(){
        layui.form.render();
    },
    methods: {

        getCount:function () {
            let that = this
            $.getJSON(baseURL + "driver/flow/statisticsListCard", vm.q, function (r) {
                if(r.code === 0){
                    console.log('===>', r.data)
                    vm.tableConditionlist = r.data

                    if(vm.firstenter){
                        that.$nextTick(()=>{
                            vm.changeStatus(0)
                        })
                    }

                    vm.firstenter=false
                }
            })

            // $.getJSON(baseURL + "driver/flow/statisticsList/count", function (r) {
            //     if(r.code === 0){
            //         vm.countList0 = r.data
            //
            //         if(vm.tabIndex === 0) {
            //             vm.count0 = r.data['0']
            //             vm.count1 = r.data['1']
            //         }
            //         vm.count4 = r.data['4']
            //     }
            // });
            //
            // $.getJSON(baseURL + "driver/flow/list/count", function (r) {
            //     if(r.code === 0){
            //         vm.countList1 = r.data
            //
            //         if(vm.tabIndex === 1){
            //             vm.count0 = r.data['0']
            //             vm.count1 = r.data['1']
            //         }
            //         vm.count2 = r.data['2']
            //         vm.count3 = r.data['3']
            //     }
            // });
        },

        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var schemeIds = [];
            $.each(list, function(index, item) {
                schemeIds.push(item.schemeId);
            });
            return schemeIds;
        },
        changeStatus: function(index){
            this.q.cardType = this.tableConditionlist[index].cardType;

            for (const itemIndex in this.tableConditionlist) {
                $(`#field${itemIndex}`).removeClass("active");
                this.tableConditionlist[itemIndex].select = itemIndex===index
            }

            // removeClass();
            $(`#field${index}`).addClass("flex active");
            this.resetSettleTime()

            console.log('changestatus==>')

            this.reload()
        },
        resetSettleTime:function () {
            // if(this.q.tableType === 1 || this.q.tableType === 4){
            //     const date = new Date();
            //
            //     this.q.settlementStartDate = new Date(date.getFullYear(), date.getMonth(), 1).format('yyyy-MM-dd');
            //     this.q.settlementEndDate = new Date().format('yyyy-MM-dd');
            //
            //     this.q.settlementDate = this.q.settlementStartDate+' / '+this.q.settlementEndDate;
            // }else{
            //     this.q.settlementStartDate = null;
            //     this.q.settlementEndDate = null;
            //
            //     this.q.settlementDate = null;
            // }
        },
        tabClick(type){
            // vm.tabIndex = type;

        },
        query: function () {
            vm.reload();

            this.getCount()
        },
        reset: function () {
            vm.q.driverName=null,
            vm.q.contactNumber=null,
            vm.q.carNo=null,
            vm.q.brandSeriesModel=null,
            vm.q.platformName=null,
            // vm.q.settlementStartDate=null,
            // vm.q.settlementEndDate=null,
            vm.q.importStartTime=null,
            vm.q.importEndTime=null,
            vm.q.joiningStartTime = null;
            vm.q.joiningEndTime = null;
            vm.q.businessLeader=null,
            vm.q.sortColumn=null,
            vm.q.orderType=null,
            vm.q.statisticsSortColumn=null,
            vm.q.statisticsOrderType=null,
            // vm.q.settlementDate ='',
            vm.q.importTime ='',
            vm.q.joinTime ='',
            this.q.tableType === 1
            // this.resetSettleTime();
            vm.q.settlementStartDate = null;
            vm.q.settlementEndDate = null;
            vm.q.settlementDate = null;

            vm.q.sort=null,
            $("#carBrandSeriesModel").val("");
            // this.changeStatus(0)
            this.getCount()
        },
        add: function(){
            let _this = this;
            var param = {
                callback: function(schemeType){
                }
            };
            window.data = null;
            var index = layer.open({
                type: 2,
                title: '新增司机流水',
                area: ['900px', '500px'],
                boxParams: param,
                content: tabBaseURL + 'modules/driver/addflowdialog.html',
                end: function () {
                    layer.close(index);
                    _this.reload()
                    _this.getCount()
                }
            });
        },
        importData:function (){
            let param={
                type:9
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
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);




            // let _this = this;
            // var param = {
            //     callback: function(schemeType){
            //     }
            // };
            // // window.data = {a:111,b:111,c:111,d:111,e:111};
            // var index = layer.open({
            //     type: 2,
            //     title: '导入司机流水',
            //     area: ['900px', '550px'],
            //     boxParams: param,
            //     content: tabBaseURL + 'modules/driver/importflow.html',
            //     end: function () {
            //         layer.close(index);
            //         _this.reload()
            //         _this.getCount()
            //     },
            // });
        },

        update: function (data) {

            // console.log('更新数据', JSON.parse(JSON.stringify(data)))

            $.ajax({
                type: "POST",
                async:false,
                url: baseURL + "driver/flow/updateRemarks",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(r){

                    vm.reload();
                    vm.getCount();
                }
            });
        },
        updateData:function (){
            console.log('选中的', layui.table.checkStatus('gridid2'))
            const obj = layui.table.checkStatus('gridid2');
            if(obj.data.length !== 1){
                alert("请选择一条数据")
                return false
            }

            if(obj.data[0].dataSource != 2){
                alert("只允许修改手动添加的数据")
                return false
            }

            let _this = this;
            var param = {
                callback: function(schemeType){
                }
            };
            window.data = obj.data[0];
            var index = layer.open({
                type: 2,
                title: '编辑司机流水',
                area: ['900px', '500px'],
                boxParams: param,
                content: tabBaseURL + 'modules/driver/addflowdialog.html',
                end: function () {
                    layer.close(index);
                    _this.reload()
                    _this.getCount();
                }
            });
        },
        deleteData: function (data) {
            const obj = layui.table.checkStatus('gridid2');
            if(obj.data.length < 1){
                alert("请选择至少一条数据")
                return false
            }

            if(!obj.data.every(item=>2==item.dataSource)){
                alert("只允许删除手动添加的数据")
                return false
            }

            const list = obj.data.map(item=> Number(item.id))

            confirm('数据删除后不可恢复，只能重新添加或导入，您是否确定要删除所选数据？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "driver/flow/delete",
                    contentType: "application/json",
                    data: JSON.stringify({
                        ids:list
                    }),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                                vm.getCount();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {

            if(vm.tabIndex === 1){
                window.location.href = urlParamByObj(baseURL + 'driver/flow/export', vm.q);
            }else {
                window.location.href = urlParamByObj(baseURL + 'driver/flow/statistics/export', vm.q);
            }
        },
        reload: function (event) {
            console.log(JSON.stringify(vm.q));
            vm.showtable = false
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    driverName: vm.q.driverName,
                    contactNumber: vm.q.contactNumber,
                    carNo: vm.q.carNo,
                    brandSeriesModel: vm.q.brandSeriesModel,
                    platformName: vm.q.platformName,
                    importStartTime: vm.q.importStartTime,
                    importEndTime: vm.q.importEndTime,
                    settlementStartDate: vm.q.settlementStartDate,
                    settlementEndDate: vm.q.settlementEndDate,
                    joiningStartTime: vm.q.joiningStartTime,
                    joiningEndTime: vm.q.joiningEndTime,
                    businessLeader: vm.q.businessLeader,
                    cardType:vm.q.cardType,
                    statisticsSortColumn: vm.q.statisticsSortColumn,
                    statisticsOrderType: vm.q.statisticsOrderType,
                }
            });
            layui.table.reload('gridid2', {
                page: {
                    curr: 1
                },
                where: {
                    driverName: vm.q.driverName,
                    contactNumber: vm.q.contactNumber,
                    carNo: vm.q.carNo,
                    brandSeriesModel: vm.q.brandSeriesModel,
                    platformName: vm.q.platformName,
                    importStartTime: vm.q.importStartTime,
                    importEndTime: vm.q.importEndTime,
                    settlementStartDate: vm.q.settlementStartDate,
                    settlementEndDate: vm.q.settlementEndDate,
                    joiningStartTime: vm.q.joiningStartTime,
                    joiningEndTime: vm.q.joiningEndTime,
                    businessLeader: vm.q.businessLeader,
                    sort: vm.q.sort,
                    sortColumn: vm.q.sortColumn,
                    orderType: vm.q.orderType,
                }
            });
        },
        reloadTable3:function () {
            layui.table.reload('gridid3', {
                where: vm.selData
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    tabChangeView()
}

function removeClass(){
    $("#field0").removeClass("active");
    $("#field1").removeClass("active");
    $("#field2").removeClass("active");
    $("#field3").removeClass("active");
    $("#field4").removeClass("active");
    $("#field5").removeClass("active");
}



function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    // //方案类型
    // form.on('select(schemeType)', function (data) {
    //     vm.q.schemeType = data.value;
    // });
    // //推荐位置
    // form.on('select(sort)', function (data) {
    //     vm.q.sort = data.value;
    // });

}

function initClick() {
    $(".delBatch").click(function(){
        var schemeIds = vm.selectedRows();
        if(schemeIds == null){
            return;
        }
        vm.del(schemeIds);
    });
    $("#tab0").click(function(){
        vm.tabIndex = 0
        tabChangeView()
    });
    $("#tab1").click(function(){
        vm.tabIndex = 1
        tabChangeView()
    });
}

function tabChangeView(){
    console.log('tab切换了')
    if(0===vm.tabIndex){
        vm.count0 = vm.countList0['0']
        vm.count1 = vm.countList0['1']

        if(vm.q.tableType==2||vm.q.tableType==3){
            vm.changeStatus(1)
        }
    }else {
        vm.count0 = vm.countList1['0']
        vm.count1 = vm.countList1['1']

        if(vm.q.tableType==4){
            vm.changeStatus(1)
        }
    }
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        // totalRow: true,
        url: baseURL + 'driver/flow/statisticsList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {type: 'radio', fixed: 'left'},
            {
                field: 'driverName', align: "center", title: '司机姓名', templet: function (d) {
                    return isEmpty(d.driverName);
                }
            },
            {
                field: 'driverNo', align: "center", title: '司机编号', templet: function (d) {
                    return isEmpty(d.driverNo);
                }
            },
            {
                field: 'contactNumber', minWidth: 150, align: "center", title: '联系电话', templet: function (d) {
                    return isEmpty(d.contactNumber);
                }
            },
            {
                field: 'carNo', minWidth: 150, align: "center", title: '车牌', templet: function (d) {
                    return isEmpty(d.carNo);
                }
            },
            {
                field: 'brandSeriesModel', minWidth: 180, align: "center", title: '品牌/车系/车型', templet: function (d) {
                    return isEmpty(d.brandSeriesModel);
                }
            },
            // {field: 'joiningTime', align: "center", title: '入职日期'},
            {
                field: 'platformName', minWidth: 100, align: "center", title: '平台名称', templet: function (d) {
                    return isEmpty(d.platformName);
                }
            },
            {field: 'targetAmount', align: "center", title: '达标额(元)'},
            {field: 'settlementDate', align: "center", title: '结算日期', sort:true},
            // {field: 'runningDays', align: "center", title: '可跑车天数(天)'},
            // {field: 'flowDays', align: "center", title: '当前流水天数(天)',},
            {field: 'dailyComplianceRate', align: "center", title: '当日达标率(%)', sort:true},
            {field: 'totalFlowWater', minWidth: 150, align: "center", title: '流水(元)', sort:true},
            {field: 'totalReward', align: "center", title: '奖励(元)'},
            {field: 'totalCompletionVolume', align: "center", title: '完单量(单)'},
            {field: 'totalOnlineDuration', align: "center", title: '在线时长(h)'},
            {field: 'totalServiceDuration', align: "center", title: '服务时长(h)'},
            {field: 'totalMileage', align: "center", title: '里程(KM)'},
            {field: 'businessLeader', align: "center", title: '业务负责人'}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        cellMinWidth: 130,
        // autoColumnWidth: {
        //     init: false
        // },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
            //Tips
            $('*[lay-tips]').on('mouseenter', function(){
                var content = $(this).attr('lay-tips');

                this.index = layer.tips('<div style="padding: 10px; font-size: 14px; color: #eee;">'+ content + '</div>', this, {
                    time: -1
                    ,maxWidth: 280
                    ,tips: [3, '#3A3D49']
                });
            }).on('mouseleave', function(){
                layer.close(this.index);
            });
        }
    });
    table.render({
        id: "gridid2",
        elem: '#grid2',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        // totalRow: true,
        url: baseURL + 'driver/flow/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            // {
            //     templet: "#checkbd",
            //     title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
            //     width: 60,
            //     align:"center"
            // },
            {type: 'checkbox'},
            {
                field: 'dindex', width:70, align: "center", title: '序号', templet: function (d) {
                    console.log('条目数据', d)
                    return isEmpty(d.LAY_INDEX);
                }
            },
            {
                field: 'driverName', align: "center", title: '司机姓名', templet: function (d) {
                    return isEmpty(d.driverName);
                }
            },
            {
                field: 'driverNo', align: "center", title: '司机编号', templet: function (d) {
                    return isEmpty(d.driverNo);
                }
            },
            {
                field: 'contactNumber', minWidth: 150, align: "center", title: '联系电话', templet: function (d) {
                    return isEmpty(d.contactNumber);
                }
            },
            {
                field: 'carNo', minWidth: 150, align: "center", title: '车牌', templet: function (d) {
                    return isEmpty(d.carNo);
                }
            },
            {
                field: 'brandSeriesModel', minWidth: 180, align: "center", title: '品牌/车系/车型', templet: function (d) {
                    return isEmpty(d.brandSeriesModel);
                }
            },
            {
                field: 'platformName', minWidth: 100, align: "center", title: '平台名称', templet: function (d) {
                    return isEmpty(d.platformName);
                }, sort:true
            },
            {field: 'flowMoney', align: "center", title: '流水(元)'},
            {field: 'rewardMoney', align: "center", title: '奖励(元)'},
            {field: 'completionVolume', align: "center", title: '完单量(单)'},
            {field: 'onlineDuration', align: "center", title: '在线时长(h)'},
            {field: 'serviceDuration', align: "center", title: '服务时长(h)'},
            {field: 'mileage', align: "center", title: '里程(KM)'},
            {field: 'settlementDate', align: "center", title: '结算日期'},
            // {field: 'settlementEndDate', align: "center", title: '结算结束日期'},
            {field: 'importTime', align: "center", title: '导入时间', sort:true},
            {field: 'businessLeader', align: "center", title: '业务负责人'},
            {field: 'dataSource', align: "center", title:  '数据来源<i class="layui-icon alone-tips" lay-tips="手动添加是指直接在系统中新增的流水数据，可进行修改和删除；导入数据是指通过Excel(或系统自动导入)的数据，只能删除重新导入，不能修改。"></i>', templet: function (d) {
                    return 1==d.dataSource?'数据导入':2==d.dataSource?'手动添加':''
            }},
            {field: 'remarks', align: "center", title: '备注信息', edit: 'text'},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        cellMinWidth: 130,
        // autoColumnWidth: {
        //     init: false
        // },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid2"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
            //Tips
            $('*[lay-tips]').on('mouseenter', function(){
                var content = $(this).attr('lay-tips');

                this.index = layer.tips('<div style="padding: 10px; font-size: 14px; color: #eee;">'+ content + '</div>', this, {
                    time: -1
                    ,maxWidth: 280
                    ,tips: [3, '#3A3D49']
                });
            }).on('mouseleave', function(){
                layer.close(this.index);
            });
        }
    });
    table.render({
        id: "gridid3",
        elem: '#grid3',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
        url: baseURL + 'driver/flow/queryList',
        where: JSON.parse(JSON.stringify(vm.selData)),
        cols: [[
            // {
            //     templet: "#checkbd",
            //     title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
            //     width: 60,
            //     align:"center"
            // },
            {
                field: 'dindex', width:70, align: "center", title: '序号', templet: function (d) {
                    return isEmpty(d.LAY_INDEX);
                }
            },
            {
                field: 'settlementDate', minWidth: 150, align: "center", title: '结算日期', templet: function (d) {
                    return isEmpty(d.settlementDate);
                }
            },
            {
                field: 'platformName', minWidth: 100, align: "center", title: '平台名称', templet: function (d) {
                    return isEmpty(d.platformName);
                }
            },
            {field: 'flowMoney', align: "center", title: '流水(元)'},
            {field: 'rewardMoney', align: "center", title: '奖励(元)'},
            {field: 'completionVolume', align: "center", title: '完单量(单)'},
            {field: 'onlineDuration', align: "center", title: '在线时长(h)'},
            {field: 'serviceDuration', align: "center", title: '服务时长(h)'},
            {field: 'mileage', align: "center", title: '里程(KM)'},
            {field: 'importTime', align: "center", title: '导入时间'},
            {field: 'remarks', align: "center", title: '备注信息',},
        ]],
        page: false,
        loading: true,
        cellMinWidth: 130,
        // autoColumnWidth: {
        //     init: false
        // },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid3"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
    initTableSort(table);
}

function initTableEditListner(table) {

}

// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

function initTableSort(table) {
    table.on('sort(grid)', function(obj){
        console.log('--筛选了--', obj)

        vm.q.statisticsSortColumn = toLine(obj.field);
        // vm.q.statisticsSortColumn = 'totalFlowWater';
        vm.q.statisticsOrderType = obj.type;
        vm.reload();

        console.log('服务端排序。order by '+ obj.field + ' ' + obj.type, vm.q);
    });
    table.on('sort(grid2)', function(obj){
        vm.q.sortColumn = toLine(obj.field);
        // vm.q.sortColumn = 'flow_money';
        vm.q.orderType = obj.type;
        vm.reload();

        console.log('服务端排序。order by '+ obj.field + ' ' + obj.type, vm.q);
    });
}

function initTableEvent(table) {
    //头工具栏事件
    table.on('radio(grid)', function(obj){
        var checkStatus = table.checkStatus("gridid"); //获取选中行状态

        vm.showtable = checkStatus.data.length === 1
        vm.selData = {
            settlementDate:checkStatus.data[0].settlementDate,
            driverId:checkStatus.data[0].driverId,
        }

        vm.reloadTable3()
        console.log('选中了', checkStatus)

    });

    // table.on('tool(grid)', function(obj){
    //     var layEvent = obj.event,
    //         data = obj.data;
    //     if(layEvent === 'edit'){
    //         vm.update(data);
    //     } else if(layEvent === 'del'){
    //         vm.del(data);
    //     } else if(layEvent === 'view'){
    //         vm.view(data);
    //     }else if(layEvent === 'start'){
    //         vm.start(data);
    //     }else if(layEvent === 'stop'){
    //         vm.stop(data);
    //     }
    // });
}

function initDate(laydate) {

}
