$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "grid",
            elem: '#grid',
            cellMinWidth: 150,
            url: baseURL + 'driver/wages/queryList',
            where: JSON.parse(JSON.stringify(vm.q)),
            cols: vm.cols,
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            parseData: function(res){
                if(res.data&&res.data.length){
                    vm.list = res.data.filter(item=>item.paidStatus!=1)
                }else{
                    vm.list = [];
                }
                vm.datalist = res.data
                return res;
            },
            autoColumnWidth: {
                init: true
            },
            done: function (res) {
                $("input[type='checkbox'][name='siam_all']").prop('checked', false)
                layui.form.render('checkbox');
                console.log('done')
                vm.showtable=false
                vm.showtable2=false
                vm.checkList = []
            },
        });

        layui.table.render({
            id: "grid2",
            elem: '#grid2',
            cellMinWidth: 150,
            url: baseURL + 'driver/wages/incomePage',
            where: JSON.parse(JSON.stringify(vm.selData)),
            cols: [[
                // {
                //     templet: "#checkbd",
                //     title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                //     width: 60,
                //     align:"center"
                // },
                {
                    field: 'platform', minWidth:300, align: "center", title: '平台名称', templet: function (d) {
                        return isEmpty(d.platform);
                    }
                },
                {
                    field: 'amount', minWidth:150, align: "center", title: '流水', templet: function (d) {
                        return isEmpty(d.amount);
                    }
                },
                {
                    field: 'account', minWidth: 200, align: "center", title: '账号', templet: function (d) {
                        return isEmpty(d.account);
                    }
                },
                {
                    field: 'bonus', minWidth: 100, align: "center", title: '奖励(元)', templet: function (d) {
                        return isEmpty(d.bonus);
                    }
                },
            ]],
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res) {}
        })

        layui.table.render({
            id: "grid3",
            elem: '#grid3',
            cellMinWidth: 150,
            url: baseURL + 'driver/wages/disbursePage',
            where: JSON.parse(JSON.stringify(vm.selData2)),
            cols: [[
                // {
                //     templet: "#checkbd",
                //     title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                //     width: 60,
                //     align:"center"
                // },
                {
                    field: 'amountTypeName', minWidth:300, align: "center", title: '费用名称', templet: function (d) {
                        // return formatFeeType(d.amountType);
                        return isEmpty(d.amountTypeName);
                    }
                },
                {
                    field: 'amount', minWidth:150, align: "center", title: '金额', templet: function (d) {
                        return isEmpty(d.amount);
                    }
                },

            ]],
            page: true,
            loading: false,
            limits: [10, 20, 50, 100],
            limit: 10,
            autoColumnWidth: {
                init: true
            },
            done: function (res) {}
        })

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
                    vm.q.settlementStartmonth = date.year+'-'+date.month+'-'+date.date;
                    vm.q.settlementEndmonth = endDate.year+'-'+endDate.month+'-'+endDate.date;

                    console.log('vm.q=>', vm.q)
                }else {
                    vm.q.settlementDate = '';
                    vm.q.settlementStartmonth = null;
                    vm.q.settlementEndmonth = null;
                }


                // if(vm.q.tableType == 1 || vm.q.tableType == 4){
                //     vm.changeStatus(0)
                // }
                // vm.q.tableType = 0
            }

        });
    });
    //操作
    layui.table.on('tool(grid)', function (obj) {
        console.log('表格操作', obj)
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'correct') {
            vm.correctFun(data.id);
        } else if (layEvent === 'grant') {
            if(data.paidStatus===0){
                confirm('开始发放后将无法再对司机薪资进行矫正，请确认是否继续？', function () {
                    vm.grantFun(data.id);
                });
            }else{
                vm.grantFun(data.id);
            }
        } else if (layEvent === 'detail') {
            vm.detailFun(data.id);
        } else if (layEvent === 'pro-view') {
            // 各平台流水

            vm.showtable = true

            vm.selData.driverWagesId = data.id

            vm.reloadTable2()
        } else if (layEvent === 'other-view') {
            // 其他扣款

            vm.showtable2 = true

            vm.selData2.driverWagesId = data.id

            vm.reloadTable3()
        } else if (layEvent === 'transnext') {
            //转下期

            console.log('转下期', obj)

            confirm('确定转下期吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "driver/wages/transferToNextPeriod?id="+obj.data.id,
                    // contentType: "application/json",
                    // data: JSON.stringify({
                    //     id:obj.data.id
                    // }),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                                vm.getData();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });


        } else if (layEvent === 'collectmoney') {
            //收款
            vm.collectmoney(data.id);

        }
    });

    layui.table.on('tool(nextPeriodTable)', function (obj) {
        console.log('表格操作', obj)
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'goreceive') {
            //跳转应收单
            window.localStorage.setItem("receivablesId", data.receivablesId);
            window.localStorage.setItem("receivablesNo", data.receivablesNo);
            var index = layer.open({
                title: "应收单详情",
                type: 2,
                content: tabBaseURL  + 'modules/financial/receivablesDetail.html',
                success: function(layero,num){
                    window.localStorage.removeItem("receivablesId");
                    window.localStorage.removeItem("receivablesNo");
                    vm.reload();
                },
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);

        }
    });

    layui.form.on('checkbox(checkbox)', function (data) {
        var elem =data.elem.dataset
        var key = elem.key
        var i = elem.i
        var checked = data.elem.checked
        vm.config[key][i]['deleted'] = checked;
        if(!checked){
            vm.config[key][i]['feeValue'] = null;
        }
    });

    layui.form.on('checkbox(siam_all)', function(){
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            if (!value.disabled){
                $(this).prop("checked", status);
                vm.checkList.push(value.dataset.id)
            }
        });
        if(status){
            var pl = vm.list.map(item => {
                if(vm.checkList.includes(item.id)){
                    return item
                }
            })
            vm.statusList = pl
        }else{
            vm.statusList = []
            vm.checkList =[]
        }
        layui.form.render();
    });
    layui.form.on('checkbox(siam_one)', function(){
        var status = $(this).prop("checked");
        var disabled = $(this).prop("disabled");
        var id = $(this)[0].dataset.id;
        var paidstatus = $(this)[0].dataset.paidstatus;
        if(!disabled){
            if (status){
                vm.statusList.push({id:id,paidStatus:paidstatus})
                vm.checkList.push(id)
            }else{
                var l = vm.checkList.filter(item => item != id)
                vm.checkList = l
                var pl = vm.statusList.filter(item => item.id != id)
                vm.statusList = pl
            }
        }
        let ls = Array.from(new Set(vm.checkList))
        if(vm.list.length === ls.length){
            $("input[name=siam_all]").prop("checked", true);
        }else{
            $("input[name=siam_all]").prop("checked", false);
        }
        layui.form.render();
    });

    layui.use(['form', 'laydate'], function () {
        var form = layui.form;
        laydate = layui.laydate;
        laydate.render({
            elem: '#billGenerationTime',
            format: 'yyyy-MM-dd',
            type: 'date',
            range: '/',
            trigger: 'click',
            done: function (value, date, endDate) {
                var dataRange = value.split('/');
                vm.q.billGenerationStartTime = dataRange[0]+'00:00:00';
                vm.q.billGenerationEndTime = dataRange[1]+' 23:59:59';
                vm.q.billGenerationTime = value
            }
        });

        form.render();
    });

     //监听状态
     layui.form.on('select(paidStatus)', function (data) {
        if(data.value){
            vm.q.paidStatus = data.value;
        }
    });



    // // 监听点击事件
    // layui.table.on('tool(table)', function (result) {
    //     let event = result.event;
    //     let row = result.data;
    //     console.info("click call", result);
    //     if (event === "pro-view") {
    //         // 处理你的业务逻辑
    //     }
    // })
});

function formatFeeType(type) {
//    0、其他，1、保证金，2、租金，3、首付款，4、退车结算款，5、换车结算款，6、备用车结算款，7、整备费，8、尾款，9、定金，10、其他费用，11、车辆总单价
    return {
        0:"其他",
        1:"保证金",
        2:"租金",
        3:"首付款",
        4:"退车结算款",
        5:"换车结算款",
        6:"备用车结算款",
        7:"整备费",
        8:"尾款",
        9:"定金",
        10:"其他费用",
        11:"车辆总单价",
    }[type]
}

var vm = new Vue({
    el: '#rrapp',
    data: {
        showtable:false,
        showtable2:false,
        selData:{},
        selData2:{},
        pageType:null,
        list:[],
        checkList:[],
        statusList:[],
        pageDriverList:[],
        businessLeaderList:[],
        paidStatusList:{0:'未发放', 1:'全额发放',2:'部分发放',3:'结算中'},
        wagesTypeList:[
            {
                name:'应付薪资总金额(元)',
                number:'0',
                wagesType:0,
            },
            {
                name:'待发放薪资总金额(元)',
                number:'0',
                wagesType:1,
            },
            {
                name:'应补收总金额(元)',
                number:'0',
                wagesType:2,
            },
            {
                name:'全部数据',
                number:'',
                wagesType:'',
            }
        ],
        q: {
            wagesType:0,
            // 司机名称
            driverName: null,
            //车牌号
            carNo: null,
            //联系电话
            contactNumber: null,
            // 发放状态
            paidStatus: null,
            // 业务负责人
            businessLeader: null,
            billGenerationTime:null,
            // 账单生成开始时间
            billGenerationStartTime: null,
            // 账单生成结束时间
            billGenerationEndTime: null,
            settlementStartmonth: null,
            settlementEndmonth: null,
            settlementDate: null,
        },
        isFilter:false,
        cols:[[
            {
                templet: "#checkbd",
                title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                width: 60,
                fixed: "left",
                align:"center"
            },
            {title: '操作', width:180, minWidth:180, templet: '#barTpl', fixed: "left", align: "center"},
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
                field: 'contactNumber', align: "center", title: '联系电话', templet: function (d) {
                    return isEmpty(d.contactNumber);
                }
            },
            {
                field: 'carNo', align: "center", title: '车牌号', templet: function (d) {
                    return isEmpty(d.carNo);
                }
            },

            {
                field: 'timeDelivery', align: "center", title: '交车日期', templet: function (d) {
                    return isEmpty(d.timeDelivery);
                }
            },
            {
                field: 'timeStart', align: "center", title: '结算开始日期', templet: function (d) {
                    return isEmpty(d.timeStart);
                }
            },
            {
                field: 'timeFinish', align: "center", title: '结算结束日期', templet: function (d) {
                    return isEmpty(d.timeFinish);
                }
            },
            {
                field: 'settlementDays', align: "center", title: '结算天数', templet: function (d) {
                    return isEmpty(d.settlementDays);
                }
            },
            {
                field: 'flowAmount', align: "center", title: '流水额(元)',
                // templet: function (d) {
                //     return isEmpty(d.monthlyFlowWater);
                // }
                // templet:'#CompareQuantity',//模板id的DOM
                templet: function (d) {
                    return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="pro-view" class="layui-font-blue">${isEmpty(d.flowAmount)}</div>`
                }
            },
            {
                field: 'rewardAmount', align: "center", title: '奖励(元)',
                // templet: function (d) {
                //     return isEmpty(d.rewardAmount);
                // }

                templet: function (d) {
                    return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="pro-view" class="layui-font-blue">${isEmpty(d.rewardAmount)}</div>`
                }
            },
            // {
            //     field: 'monthlyComplianceRate', align: "center", title: '当月达标率(%)', templet: function (d) {
            //         return isEmpty(d.monthlyComplianceRate);
            //     }
            // },
            {
                field: 'rentAmount', align: "center", title: '应扣使用费(元)', templet: function (d) {
                    return isEmpty(d.rentAmount);
                }
            },
            {
                field: 'prepaidAmount', align: "center", title: '预支(元)', templet: function (d) {
                    return isEmpty(d.prepaidAmount);
                }
            },
            {
                field: 'cashDepositAmount', align: "center", title: '应扣保证金(元)', templet: function (d) {
                    return isEmpty(d.cashDepositAmount);
                }
            },
            {
                field: 'otherAmount', align: "center", title: '其他扣款',
                // templet: function (d) {
                //     return isEmpty(d.otherAmount);
                // }
                templet: function (d) {
                    return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="other-view" class="layui-font-blue">${isEmpty(d.otherAmount)}</div>`
                }
            },
            {
                field: 'forwardAmount', align: "center", title: '上期余额', templet: function (d) {
                    return isEmpty(d.forwardAmount);
                }
            },
            {
                field: 'correctionAmount', align: "center", title: '矫正额(元)', templet: function (d) {
                    return isEmpty(d.correctionAmount);
                }
            },
            {
                field: 'correctionExplain', align: "center", title: '矫正说明', templet: function (d) {
                    return isEmpty(d.correctionExplain);
                }
            },
            {
                field: 'accountPayable', align: "center", title: '应付薪资(元)', templet: function (d) {
                    return isEmpty(d.accountPayable);
                }
            },
            {
                field: 'paid', align: "center", title: '已发放(元)', templet: function (d) {
                    return isEmpty(d.paid);
                }
            },
            {
                field: 'paidStatus', align: "center", title: '发放状态', templet: function (d) {
                    return transformTypeByMap(d.paidStatus,vm.paidStatusList);
                }
            },
            {
                field: 'createTime', minWidth:180,align: "center", title: '薪资生成时间', templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'businessLeader', align: "center", title: '订单负责人', templet: function (d) {
                    return isEmpty(d.businessLeader);
                }
            },
            {
                field: 'bankAccount',minWidth:180, align: "center", title: '银行账号', templet: function (d) {
                    return isEmpty(d.bankAccount);
                }
            },
            {
                field: 'affiliatedBank',minWidth:180, align: "center", title: '所属银行', templet: function (d) {
                    return isEmpty(d.affiliatedBank);
                }
            },
            {
                field: 'openingBank',minWidth:180, align: "center", title: '开户行', templet: function (d) {
                    return isEmpty(d.openingBank);
                }
            },
        ]],
        showForm:false,
        detail:{},


        grant:{
            wagesId:null,
            payrollDistribution:null,
            distributionDate:null,
            remarks:null,
            voucherList:[]
        },
        deliveryFileLst:[],
        deliveryFileLstId:null,
        batchShowForm:false,
        batch:{
            distributionDate:null
        },
        totalTable:{
            paid:0,
            waitPaid:0,
        },
        config:{},
        configDetail:[],
        totalNum:0,
        paidStatusText:'',
        grantTable:{
            cols:[],
            data:[]
        },
        forwardList:[],
        datalist:[],
        subtips: null,

    },
    computed:{
        incomeList(){

            let list = this.detail.incomeList.map(item=>({
                title:item.platform,
                // field:item.amount,
                align:'center',
                templet: function(d){
                    return item.amount
                }
            })).concat(this.detail.incomeList.map(item=>({
                title:item.platform,
                // field:item.bonus,
                align:'center',
                templet: function(d){
                    return item.bonus
                }
            }))).concat(this.detail.otherList.map(item=>({
                title:item.amountTypeName,
                // field:item.amount,
                align:'center',
                templet: function(d){
                    return item.amount
                }
            })));

            console.log('处理后的list', list)

            return list
        },

        incomeSize(){
          return this.detail.incomeList&&this.detail.incomeList.length>0?this.detail.incomeList.length:1
        },

        otherSize(){
          return this.detail.otherList&&this.detail.otherList.length>0?this.detail.otherList.length:1
        },

        driveTable(){
            return {
                cols:[[
                    {
                        colspan: this.incomeSize,
                        rowspan: this.detail.incomeList&&this.detail.incomeList.length>0?1:2,
                        align: "center", title: '当月流水额(元)',colGroup:this.detail.incomeList&&this.detail.incomeList.length===1
                    },
                    {
                        colspan: this.incomeSize,
                        rowspan: this.detail.incomeList&&this.detail.incomeList.length>0?1:2,
                        align: "center", title: '奖励(元)',colGroup:this.detail.incomeList&&this.detail.incomeList.length===1
                    },
                    {
                        colspan:this.otherSize,
                        rowspan:this.detail.otherList&&this.detail.otherList.length>0?1:2,
                        align: "center", title: '其他扣款',colGroup:this.detail.otherList&&this.detail.otherList.length===1
                    },
                    {
                        rowspan:2,
                        field: 'rentAmount',align: "center", title: '应扣使用费(元)', templet: function (d) {
                            return isEmpty(d.rentAmount);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'prepaidAmount', align: "center", title: '预支(元)', templet: function (d) {
                            return isEmpty(d.prepaidAmount);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'cashDepositAmount', align: "center", title: '应扣保证金(元)', templet: function (d) {
                            return isEmpty(d.cashDepositAmount);
                        }
                    },

                    {
                        rowspan:2,
                        field: 'forwardAmount', align: "center", title: '上期余额', templet: function (d) {
                            return isEmpty(d.forwardAmount);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'correctionAmount', align: "center", title: '矫正额(元)', templet: function (d) {
                            return isEmpty(d.correctionAmount);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'correctionExplain',align: "center", title: '矫正说明', templet: function (d) {
                            return isEmpty(d.correctionExplain);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'accountPayable', align: "center", title: '应付薪资(元)', templet: function (d) {
                            return isEmpty(d.accountPayable);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'paid', align: "center", title: '已发放(元)', templet: function (d) {
                            return isEmpty(d.paid);
                        }
                    },
                    {
                        rowspan:2,
                        field: 'waitPaid', align: "center", title: '待发放(元)', templet: function (d) {
                            return isEmpty(d.waitPaid);
                        }
                    },
                ],this.incomeList],
                data:[]
            }
        }

    },
    mounted: function () {
        let that = this
        this.$nextTick(()=>{
            that.getData();
        })
    },
    updated: function () {
        layui.form.render();
    },
    watch: {
        'config': {
            handler(newVal, oldVal) {
                var totalNum = 0;
                if(newVal){
                    Object.keys(newVal).map(key=>{
                        vm.config[key].map(i=>{
                            if(i.deleted&&key==1){
                                totalNum+=Number(i.feeValue||0)
                            }
                            if(i.deleted&&key==2){
                                totalNum-=Number(i.feeValue||0)
                            }
                        })
                    })
                }
                this.$nextTick(()=>{
                    vm.totalNum = totalNum;
                })
                console.log(totalNum, oldVal)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        move(value) {
            var id = '#LAY_layedit_code' + value;
            var content = "";
            if (value == '1') {
                content = "说明：只可清除未发放状态下的薪资数据";
            }
            if (!vm.subtips) {
                vm.subtips = layer.tips(content, id, { tips: 1 });
            }
        },
        mouseout(){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        calcData(){
            let param={
                type:10
            }

            var index = layer.open({
                title: "司机薪资核算",
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
        },
        cleanData(){
            if(!vm.checkList.length){
                alert("未选择需要清除的数据");
                return ;
            }

            console.log('选择的id list', vm.checkList)


            const fList = vm.datalist.filter(item=>{
                if(vm.checkList.find(citem=>{
                    return citem==item.id
                })) {
                    return item
                }
            })

            console.log('选择原始list', fList)

            let flag = fList.every(item=>item.paidStatus==0);
            if(!flag){
                alert("只能清除未发放状态下的薪资数据")
                return;
            }

            confirm('确定清除数据？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "driver/wages/cleanData",
                    contentType: "application/json",
                    data: JSON.stringify(vm.checkList),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.showtable=false
                                vm.showtable2=false
                                vm.checkList = []
                                vm.reload();
                                vm.getData();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });


        },
        printData(){
            if(!vm.checkList.length){
                alert("未选择需要打印的数据");
                return ;
            }

            console.log('选择的id list', vm.checkList)


            const fList = vm.datalist.filter(item=>{
                if(vm.checkList.find(citem=>{
                    return citem==item.id
                })) {
                    return item
                }
            })

            console.log('选择原始list', fList)

            for (const item of fList) {
                if(item.correctionAmount==undefined||item.correctionAmount==null){
                    item.correctionAmount=''
                }
                if(item.correctionExplain==undefined||item.correctionExplain==null){
                    item.correctionExplain=''
                }
            }

            const style = '@page {margin:3mm 10mm};'
            printJS({
                printable: fList,
                properties: [
                    { field: 'driverName', displayName: '司机姓名'},
                    { field: 'flowAmount', displayName: '当月流水额(元)'},
                    { field: 'rewardAmount', displayName: '奖励(元)'},
                    { field: 'rentAmount', displayName: '应扣使用费(元)'},
                    { field: 'prepaidAmount', displayName: '预支(元)'},
                    { field: 'cashDepositAmount', displayName: '应扣保证金'},
                    { field: 'otherAmount', displayName: '其他扣款'},
                    { field: 'forwardAmount', displayName: '上期余额'},
                    { field: 'correctionAmount', displayName: '矫正额(元)'},
                    { field: 'correctionExplain', displayName: '矫正说明'},
                    { field: 'accountPayable', displayName: '应付薪资(元)'},
                    { field: 'paid', displayName: '已发放(元)'},
                    { field: 'waitPaid', displayName: '待发放(元)'}
                ],
                type: 'json',
                headerRow:2,
                targetStyles:["*"],
                style,//取消页眉
                gridHeaderStyle: 'color: #000;  border: 2px solid #3971A5;',
                gridStyle: 'color: #333;border: 2px solid #3971A5;',
                // header: '<h3 >司机工资表</h3>',

            })

        },

        getgrantTable(){
            if(this.totalTable.paid>=0 && this.totalTable.waitPaid>=0){
                return {
                    cols:[[
                        {type:'numbers',minWidth:200, align:'center',  title: '序号'},
                        {field: 'payrollDistribution',minWidth:200, align: "center", title: '发放金额(元)', templet:d=>{
                                return Math.abs(d.payrollDistribution)
                            }},
                        {field: 'distributionDate', minWidth:200,align: "center", title: '发放时间'},
                        {field: 'remarks',minWidth:200,align: "center", title: '备注信息'},
                        {field: 'voucherList',minWidth:200, align: "center", title: '凭证',templet: function (d) {
                                var l='';
                                if(d.voucherList){
                                    d.voucherList.map((item,index)=>{
                                        if(d.voucherList.length-1===index){
                                            l+=`<span onClick="download('${item.fileUrl}','${item.fileName}')" class="download">${item.fileName}</span>`
                                        }else{
                                            l+=`<span onClick="download('${item.fileUrl}')" class="download">${item.fileName}</span>、`
                                        }
                                    })
                                }
                                return l;
                            }},
                    ]],
                    data:[]
                }
            }else {
                return {
                    cols:[[
                        {type:'numbers',minWidth:200, align:'center',  title: '序号'},
                        {field: 'payrollDistribution',minWidth:200, align: "center", title: '收款金额(元)', templet:d=>{
                                return Math.abs(d.payrollDistribution)
                            }},
                        {field: 'distributionDate', minWidth:200,align: "center", title: '收款时间'},
                        {field: 'remarks',minWidth:200,align: "center", title: '备注信息'},
                        {field: 'voucherList',minWidth:200, align: "center", title: '凭证',templet: function (d) {
                                var l='';
                                if(d.voucherList){
                                    d.voucherList.map((item,index)=>{
                                        if(d.voucherList.length-1===index){
                                            l+=`<span onClick="download('${item.fileUrl}','${item.fileName}')" class="download">${item.fileName}</span>`
                                        }else{
                                            l+=`<span onClick="download('${item.fileUrl}')" class="download">${item.fileName}</span>、`
                                        }
                                    })
                                }
                                return l;
                            }},
                    ]],
                    data:[]
                }
            }

        },

        getData(){

            console.log('vm', vm)

            $.getJSON(baseURL + "driver/wages/statisticsWagesInfo", vm.q, function (r) {
                if(r.code === 0){
                    var d = r.data
                    vm.wagesTypeList[0].number = d.totalPayable||0
                    vm.wagesTypeList[1].number = d.waitPayTotal||0
                    vm.wagesTypeList[2].number = d.subsequentCollectionTotal||0
                }
            });
            $.getJSON(baseURL + "customer/signedDriverList", function (r) {
                if(r.code === 0){
                    vm.pageDriverList = r.data
                    var obj = {}
                    vm.businessLeaderList = r.data.reduce(function(a, b) {
                        obj[b.businessLeaderId] ? '' : obj[b.businessLeaderId] = true && a.push(b);
                        return a;
                    }, [])
                }
            });
        },

        reloadTable2:function () {
            layui.table.reload('grid2', {
                where: vm.selData
            });
        },
        reloadTable3:function () {
            layui.table.reload('grid3', {
                where: vm.selData2
            });
        },
        changeWagesType(type){
            vm.showtable=false
            vm.showtable2=false
            vm.checkList = []
            vm.q.wagesType = type
            vm.query()
        },
        query: function () {
            console.log('query', vm.q)
            vm.reload();
            vm.getData();
            vm.checkList = []
            vm.showtable=false
            vm.showtable2=false
        },
        reset: function () {
            vm.q = {
                wagesType: vm.q.wagesType,
               // 司机名称
                driverName: null,
                //车牌号
                carNo: null,
                //联系电话
                contactNumber: null,
                // 发放状态
                paidStatus: null,
                // 业务负责人
                businessLeader: null,
                billGenerationTime:null,
                // 账单生成开始时间
                billGenerationStartTime: null,
                // 账单生成结束时间
                billGenerationEndTime: null,
                settlementStartmonth: null,
                settlementEndmonth: null,
                settlementDate: null,
           }
            vm.reload();
            vm.showtable=false
            vm.showtable2=false
            vm.checkList = []
        },
        batchGrant: function () {
            if(!vm.checkList.length){
                alert("未选择需要发放的司机工资表数据");
                return ;
            }





            const fList = vm.datalist.filter(item=>{
                if(vm.checkList.find(citem=>{
                    return citem==item.id
                })) {
                    return item
                }
            })

            console.log('选择原始list', fList)


            let flag = fList.every(item=>item.paidStatus==0||item.paidStatus==2);
            if(!flag){
                alert("已完成的不能发放")
                return;
            }

            let flag2 = fList.every(item=>item.accountPayable>0);
            if(!flag2){
                alert("应付薪资大于0时才能发放")
                return;
            }

            var l = vm.statusList.filter(item=>item.paidStatus==0);
            if(l.length){
                confirm('开始发放后将无法再对司机薪资进行矫正，请确认是否继续？', function () {
                    // 确认发放
                    var index = layer.open({
                        title: "批量发放薪资",
                        type: 2,
                        area: ['600px', '500px'],
                        boxParams: {
                            data: {ids:vm.checkList},
                            callback:function (d) {
                                layer.closeAll()
                                vm.checkList = []
                                vm.reload();
                            },
                            closeBack:function (d) {
                                layer.closeAll()
                            },
                        },
                        content: tabBaseURL + "modules/driver/salaryBatchForm.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                });
            }else{
                 // 确认发放
                 var index = layer.open({
                    title: "批量发放薪资",
                    type: 2,
                    area: ['600px', '500px'],
                    boxParams: {
                        data: {ids:vm.checkList},
                        callback:function (d) {
                            layer.close(index);
                            vm.checkList = []
                            vm.reload();
                        },
                        closeBack:function (d) {
                            layer.close(index);
                        },
                    },
                    content: tabBaseURL + "modules/driver/salaryBatchForm.html",
                    end: function () {
                        layer.close(index);
                    }
                });
            }

        },
        correctSubmit:function(id){
            var correctionItemsInfoList =[]
            var check = true
            try {
                Object.keys(vm.config).map(key=>{
                    vm.config[key].map(i=>{
                        if(i.deleted){
                            if(Number(i.feeValue)<0){
                                check = false
                                layer.msg(`${i.feeItemName}矫正金额不能小于0`, {icon: 5});
                                throw new Error('阻止');
                            }
                            if(i.feeValue==null||i.feeValue==''){
                                check = false
                                layer.msg(`${i.feeItemName}矫正金额不能为空`, {icon: 5});
                                throw new Error('阻止');
                            }
                            correctionItemsInfoList.push({
                                id:i.id,
                                feeItemName:i.feeItemName,
                                feeValue:i.feeValue
                            })
                        }
                    })
                })
            } catch (error) {
                console.log('error_阻止成功', error);
            }
            if(check){
                $.ajax({
                    type: "POST",
                    url: baseURL + 'driver/wages/correctionWages',
                    contentType: "application/json",
                    data: JSON.stringify({id:id,correctionAmount:vm.totalNum,correctionItemsInfoList:correctionItemsInfoList}),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('操作成功', function (index) {
                                layer.closeAll();
                                vm.reset();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            }
        },
        getCorrectConfig:function(id){
            $.get(baseURL + "wages/fee/items/wagesConfig?id="+id, function (r) {
                vm.config = r.data.itemData
                if(r.data.correctionInfo&&r.data.itemData){
                    vm.configDetail = r.data.correctionInfo||[]
                    Object.keys(r.data.itemData).map(key=>{
                        vm.config[key].map((i,index)=>{
                            var includeIds = r.data.correctionInfo.filter(v=>v.id===i.id)
                            if(includeIds.length){
                                vm.config[key][index].deleted = true
                                vm.config[key][index].feeValue = includeIds[0].feeValue
                            }
                        })
                    })
                }
            });
        },
        correctFun: function (id) {
            // 矫正
            vm.pageType='correct'
            vm.getCorrectConfig(id)
            var index = layer.open({
                title: "矫正应付薪资",
                type: 1,
                content: $("#viewForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
            layui.use(['form'], function () {
                var form = layui.form;
                form.on('submit(correct)', function () {
                    vm.correctSubmit(id);
                    return false;
                });
                form.render();
            });
        },
        grantFun: function (id) {
            vm.pageType='grant'
            vm.getDetail(id)
            // 确认发放
            var index = layer.open({
                title: "司机工资表确认发放",
                type: 1,
                content: $("#viewForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
        },
        collectmoney: function (id) {
            vm.pageType='collect'
            vm.getDetail(id)
            // 确认收款
            var index = layer.open({
                title: "司机工资表确认补收",
                type: 1,
                content: $("#viewForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });

            vm.showForm = true;
            layer.full(index);
            layui.use(['form'], function () {
                var form = layui.form;
                form.on('submit(collectsave)', function () {
                    vm.collectsave();
                    return false;
                });
                form.render();
            });
        },
        detailFun: function (id) {
            vm.pageType='detail'
            vm.getDetail(id)
            var index = layer.open({
                title: "司机工资表详情",
                type: 1,
                content: $("#viewForm"),
                end: function () {
                    vm.showForm = false;
                    layer.closeAll();
                }
            });
            vm.showForm = true;
            layer.full(index);
        },
        getDetail:function(id){
            $.get(baseURL + "driver/wages/info?id=" + id, function (r) {
                var t = r.data.salaryInfo
                vm.detail = r.data.salaryInfo
                vm.forwardList = r.data.forwardList
                vm.paidStatusText = transformTypeByMap(r.data.salaryInfo.paidStatus,vm.paidStatusList)
                vm.grant = {
                    wagesId:t.id,
                    payrollDistribution:Math.abs(t.waitPaid),
                    distributionDate:null,
                    remarks:null,
                    voucherList:[]
                }
                vm.driveTable.data = [t];
                var l = r.data.driverPayrollRecordList.map(item=>item.payrollDistribution)
                vm.grantTable.data = r.data.driverPayrollRecordList
                if(l.length){
                    vm.totalTable = {
                        paid:l.reduce(function(prev, curr){
                            return Number(prev||0) + Number(curr||0)
                        }),
                        waitPaid:r.data.salaryInfo.waitPaid
                    }
                }else{
                    vm.totalTable = {
                        paid:0,waitPaid:0
                    }
                }
                console.log('====list', vm.getgrantTable())
                vm.grantTable.cols = vm.getgrantTable().cols
                layui.table.render({
                    id: "driveTable",
                    elem: '#driveTable',
                    cellMinWidth: 100,
                    cols: vm.driveTable.cols,
                    page: false,
                    loading: false,
                    data:vm.driveTable.data
                });
                layui.table.render({
                    id: "grantTable",
                    elem: '#grantTable',
                    cellMinWidth: 150,
                    cols: vm.grantTable.cols,
                    page: false,
                    loading: false,
                    data:vm.grantTable.data,
                });
                layui.table.render({
                    id: "nextPeriodTable",
                    elem: '#nextPeriodTable',
                    cellMinWidth: 150,
                    cols: [
                        [
                            {
                                field: 'amount', minWidth:300, align: "center", title: '金额(元)', templet: function (d) {
                                    return isEmpty(d.amount);
                                }
                            },
                            {
                                field: 'operateDesc', minWidth:150, align: "center", title: '操作说明', templet: function (d) {
                                    return isEmpty(d.operateDesc);
                                }
                            },
                            {
                                field: 'operateTime', minWidth:150, align: "center", title: '操作时间', templet: function (d) {
                                    return isEmpty(d.operateTime);
                                }
                            },
                            {
                                field: 'receivablesNo', minWidth:150, align: "center", title: '关联应收单', templet: function (d) {

                                    return `<div><a href="javascript:void(0);" style="color: #3FACB3" lay-event="goreceive" class="layui-font-blue">${isEmpty(d.receivablesNo)}</div>`
                                }
                            },

                        ]
                    ],
                    page: false,
                    loading: false,
                    data:vm.forwardList,
                });
                layui.laydate.render({
                    elem: '#grantDistributionDate',
                    type: 'datetime',
                    value: new Date(),
                    done: function (value, date, endDate) {
                        vm.grant.distributionDate = value
                    }
                });
                vm.grant.distributionDate  = new Date().format("yyyy-MM-dd hh:mm:ss")
                layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable','upload'], function () {
                    var upload = layui.upload;
                    var form = layui.form;
                    uploadAttachment(upload);
                    form.on('submit(saveOrUpdate)', function () {
                        vm.saveOrUpdate();
                        return false;
                    });
                    form.render();
                });
            });
        },
        saveOrUpdate: function () {
            vm.grant.voucherList = vm.deliveryFileLst.map(item=>{
                return {fileUrl:item.url,fileName:item.nameFile}
            });
            if(Number(vm.grant.payrollDistribution||0)<=0){
                layer.msg('发放金额需大于0', {icon: 5});
                return false;
            }
            if(Number(vm.grant.payrollDistribution||0)>Number(vm.detail.waitPaid||0)){
                layer.msg(`发放金额不能大于待发放金额${vm.detail.waitPaid||0}`, {icon: 5});
                return false;
            }
            if(!vm.grant.payrollDistribution&&Number(vm.grant.payrollDistribution)!=0){
                layer.msg('发放金额不能为空', {icon: 5});
                return false;
            }
            if(!vm.grant.distributionDate){
                layer.msg('发放时间不能为空', {icon: 5});
                return false;
            }
            vm.grant.payrollFlag=1
            $.ajax({
                type: "POST",
                url: baseURL + 'driver/payroll/record/save',
                contentType: "application/json",
                data: JSON.stringify(vm.grant),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.deliveryFileLst = []
                            layer.closeAll();
                            vm.reset();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        collectsave: function () {
            vm.grant.voucherList = vm.deliveryFileLst.map(item=>{
                return {fileUrl:item.url,fileName:item.nameFile}
            });
            if(Number(vm.grant.payrollDistribution||0)<=0){
                layer.msg('收款金额需大于0', {icon: 5});
                return false;
            }
            if(Number(vm.grant.payrollDistribution||0)>Number(Math.abs(vm.detail.waitPaid)||0)){
                layer.msg(`收款金额不能大于待收金额${Math.abs(vm.detail.waitPaid)||0}`, {icon: 5});
                return false;
            }
            if(!vm.grant.payrollDistribution&&Number(vm.grant.payrollDistribution)!=0){
                layer.msg('收款金额不能为空', {icon: 5});
                return false;
            }
            if(!vm.grant.distributionDate){
                layer.msg('收款时间不能为空', {icon: 5});
                return false;
            }
            $.ajax({
                type: "POST",
                url: baseURL + 'driver/payroll/record/save',
                contentType: "application/json",
                data: JSON.stringify({
                    ...vm.grant,
                    payrollFlag:2,
                    payrollDistribution:-vm.grant.payrollDistribution
                }),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.deliveryFileLst = []
                            layer.closeAll();
                            vm.reset();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        exports: function () {
            var url = baseURL + 'driver/wages/export?a=a';
            if (vm.q.wagesType>=0) {
                url += '&wagesType=' + vm.q.wagesType;
            }
            if (vm.q.driverName != null && vm.q.driverName !="") {
                url += '&driverName=' + vm.q.driverName;
            }
            if (vm.q.carNo != null && vm.q.carNo !="") {
                url += '&carNo=' + vm.q.carNo;
            }
            if (vm.q.contactNumber != null && vm.q.contactNumber !="") {
                url += '&contactNumber=' + vm.q.contactNumber;
            }
            if (vm.q.businessLeader != null && vm.q.businessLeader !="") {
                url += '&businessLeader=' + vm.q.businessLeader;
            }
            if (vm.q.settlementStartmonth != null && vm.q.settlementStartmonth !="") {
                url += '&settlementStartmonth=' + vm.q.settlementStartmonth;
            }
            if (vm.q.settlementEndmonth != null && vm.q.settlementEndmonth !="") {
                url += '&settlementEndmonth=' + vm.q.settlementEndmonth;
            }
            if (vm.q.billGenerationStartTime != null && vm.q.billGenerationStartTime !="") {
                url += '&billGenerationStartTime=' + vm.q.billGenerationStartTime;
            }
            if (vm.q.billGenerationEndTime != null && vm.q.billGenerationEndTime !="") {
                url += '&billGenerationEndTime=' + vm.q.billGenerationEndTime;
            }

            console.log('导出', vm.q)
            console.log('导出', vm.q.wagesType !="")
            console.log('导出地址', url)

            window.location.href = url;
        },
        cancel: function () {
            vm.deliveryFileLst = []
            layer.closeAll();
        },
        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: {
                    // 发放类型
                    wagesType: vm.q.wagesType,
                    // 司机名称
                    driverName: vm.q.driverName,
                    // 联系电话
                    contactNumber: vm.q.contactNumber,
                    // 车牌号
                    carNo: vm.q.carNo,
                    // 创建时间
                    billGenerationStartTime:vm.q.billGenerationStartTime,
                    billGenerationEndTime:vm.q.billGenerationEndTime,
                    settlementStartmonth:vm.q.settlementStartmonth,
                    settlementEndmonth:vm.q.settlementEndmonth,
                    // 状态
                    paidStatus: vm.q.paidStatus,
                    // 业务负责人
                    businessLeader:  vm.q.businessLeader,
                }
            });
        },
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        delDeliveryFile: function (id) {
            for(var i = 0 ;i<vm.deliveryFileLst.length;i++) {
                if(vm.deliveryFileLst[i].id === id) {
                    vm.deliveryFileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
    }
});

//对比数量鼠标经过事件
function showCompareQuantity(obj){
    var row=$(obj).attr('data-d'); //获取显示内容
    if(row){
        let tipArr = row.split(",");//拆分日期
        tipArr=tipArr.sort(function(a,b){return Date.parse(b) - Date.parse(a);});//日期排序
        let tipStringHtml = "";//拼接显示内容
        for(var i=0;i<tipArr.length;i++){
            tipStringHtml += `<p>${tipArr[i]}</p>`
        }
        //提示（设置字体颜色）
        layer.tips("<span style='color:black'>"+tipStringHtml+"</span>",obj,{
            area: 'auto',//显示的内容的大小
            tips:[2,'#FFFFCC'],//显示方向以及背景颜色
            time:1000//4秒后销毁
        });
    }
}

/**
 * 附件下载
 */
function download(fileUrl,fileName){
    var uri = baseURL + 'file/download?uri='+ fileUrl +"&fileName="+fileName;
    window.location.href = uri;
}

/**
 * 上传附件
 */
function uploadAttachment(upload) {
    var deliveryFileIdTmp;
    upload.render({
        elem: '#addDeliveryFile',
        url: baseURL + 'file/uploadInsuranceFile',
        data: {'path': 'order-delivery'},
        field: 'files',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.pdf,.doc,.docx,.exl,.xlsx,.jpg,.png,.jpeg',
        exts: 'pdf|doc|docx|exl|xlsx|jpg|png|jpeg',
        multiple: true,
        number:20,
        done: function (res) {
            RemoveLoading();
            if (res.code != '0') {
                layer.msg('上传失败', {icon: 5});
                vm.delDeliveryFile(deliveryFileIdTmp);
                deliveryFileIdTmp = null;
                return false;
            }
            res.data.forEach(function (value) {
                var extIndex = value.resultFilePath.lastIndexOf('.');
                var ext = value.resultFilePath.slice(extIndex);
                var fileNameNotext = value.fileName;
                var regExt = /png|jpg|jpeg/;
                var fileType = regExt.test(ext) ? 1 : 0;
                deliveryFileIdTmp = vm.deliveryFileLst.length + '_' + uuid(60);
                var fileTmp = {
                    id: deliveryFileIdTmp,
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc: '附件',
                    nameAccessory: fileNameNotext,
                    nameFile: fileNameNotext,
                    nameExt: ext,
                    typeFile: fileType,
                    url: value.resultFilePath
                };
                vm.deliveryFileLst.push(fileTmp);
                vm.deliveryFileLstId = 'fileLstId_' + uuid(6);
            });
            deliveryFileIdTmp = null;
        },
        error: function () {
            RemoveLoading();
            layer.msg('上传失败', {icon: 5});
            vm.delDeliveryFile(deliveryFileIdTmp);
            deliveryFileIdTmp = null;
        }
    });
}
