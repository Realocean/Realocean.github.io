$(function () {

    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });

    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        subtips:null,
        preId:'LAY_CUSTOMER_',
        q:{
            statusType: 0//tep
        },
        statusIndex: 0,
        companyLst: [],
        lessorLst: [],
        carTreeList: [],
        clerkLst: [],
        statusLst: [],
        channelLst: [],
        isFilter: false
    },
    created: function(){
        var _this = this;
        /* 
        var param = parent.layer.boxParams.boxParams;
        if(param != undefined && param != null){
            _this.vm.statusIndex = param.statusIndex;
            vm.changeStatus(param.statusIndex);
        }*/

        $.ajaxSettings.async= false;
        $.get(baseURL + 'customer/getChannel', function (r) {
            _this.channelLst = r.data;
        });
        $.get(baseURL + 'customer/getCompanyList', function (r) {
            _this.companyLst = r.data;
        });
        $.get(baseURL + 'customer/getStatusList', function (r) {
            _this.statusLst = r.statusLst;
        });
        $.get(baseURL + 'sys/dept/listAll', function (r) {
            _this.lessorLst = r.deptList;
        });
        $.get(baseURL + 'sys/user/usrLst', function (r) {
            _this.clerkLst = r.usrLst;
        });
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            _this.carTreeList = r.carTreeVoList;
        });
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        mouseout:function (){
            layer.close(vm.subtips);
            vm.subtips = null;
        },
        move:function (value) {
            var id="#"+vm.preId+value;
            var content = "";
            if(value == '1'){
                content = "说明：在租统计的是没有退车的订单信息；";
            } else if(value == '2'){
                content = "说明：根据到期时间配置的到期需要退车的订单；";
            } else if(value == '3'){
                content = "说明：统计的是账单已生成的订单；";
            } else if(value == '4'){
                content = "说明：统计的是已超过应付时间的订单；";
            }else if(value == '5'){
                content = "说明：统计的是已生成应退单的信息；";
            } else if(value == '6'){
                content = "说明：统计的是只有缴费逾期的客户；";
            }
            if(!vm.subtips){
                vm.openMsg(id,content,value);
            }
        },
        openMsg:function (id,content,value) {
            vm.subtips = layer.tips(content, id, {tips: 1});
        },
        getCustomer:function(statusIndex){
            vm.statusIndex = parseInt(statusIndex);
            vm.q.statusType = vm.statusIndex;
            changeStatusTab(statusIndex);
            vm.reload();
        },

        changeStatus: function (item, index) {
            vm.statusIndex = parseInt(item.key);
            vm.q.statusType = vm.statusIndex;
            changeStatusTab(vm.statusIndex);
            vm.reload();
        },

        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
            vm.q.statusType = vm.statusIndex;
        },
        view: function (data) {
            localStorage.setItem("id", data.id);
            var title = "客户信息";
            var index = layer.open({
                title: title,
                type: 2,
                boxParams: {
                    data: data
                },
                content: tabBaseURL + 'modules/customer/customerdetail.html',
                shade: false,
                end: function () {
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        add: function(){
            var param = {
                data:{},
                type:1
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/customer/customer.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "customer/info/"+id, function(r){
                var param = {
                    data:r.data,
                    type:2
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/customer/customer.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        blacklist: function (id) {   //拉入黑名单
            var data = {id: id, state: 2};
            confirm('确定要将该用户拉入黑名单吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "customer/blacklist",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('操作成功', function (index) {
                                layer.closeAll();
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        cancelBlacklist: function (id) {
            var data = {id: id, state: 1};
            confirm('确定要将该用户移出黑名单吗？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "customer/blacklist",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (r) {
                        if (r.code === 0) {
                            alert('操作成功', function (index) {
                                layer.closeAll();
                                vm.reload();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'customer/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        skipOrderView (data) {
            if (data.orderType == 1) {
                $.get(baseURL + "order/order/info/" + data.orderCarId, function (r) {
                    r.order.orderCar.orderCarStatusStr = null;
                    var param = {
                        data: r.order
                    };
                    var index = layer.open({
                        title: "查看",
                        type: 2,
                        boxParams: param,
                        content: tabBaseURL + "modules/order/orderview.html",
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }else if (data.orderType == 2) {
                $.get(baseURL + "cartransfer/sparecar/info/"+data.orderId, function(r){
                    var index = layer.open({
                        title: "备用车详情",
                        type: 2,
                        content: tabBaseURL + "modules/order/sparecardetail.html",
                        success: function(layero,num){
                            var iframe = window['layui-layer-iframe'+num];
                            iframe.vm.spareCarApply = r.spareCar;
                            iframe.vm.receivablesList = r.spareCar.receivablesList;
                            if(r.spareCar.isApply == 1){
                                iframe.vm.payDayShow = true;
                            }else{
                                iframe.vm.payDayShow = false;
                            }
                            if(r.spareCar.spareCarStatus == 2){
                                iframe.vm.returnCarBtn = true;
                            }else{
                                iframe.vm.returnCarBtn = false;
                            }
                            if(r.spareCar.spareCarStatus == 4 || r.spareCar.spareCarStatus == 3){
                                iframe.vm.returnCarForm = true;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息',
                                    '备用车退车信息'
                                ];
                            }else{
                                iframe.vm.returnCarForm = false;
                                iframe.vm.detailsSupTabContentList = [
                                    '备用车基础信息',
                                    '备用车信息',
                                    '合同信息',
                                    '其他关联单据信息'
                                ];
                            }
                            iframe.vm.fileLst = r.spareCar.deliveryFileLst;
                            iframe.vm.fileLst1 = r.spareCar.deliveryFileLst1;
                            iframe.vm.fileLst2 = r.spareCar.deliveryFileLst2;
                            iframe.vm.reloadData();
                            iframe.vm.initOperatorLog(id);
                        },
                        end: function(){
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                });
            }
        }
    }
});

function init(layui) {
    initSearch();
    var businessType= window.localStorage.getItem("businessType");
    vm.getCustomer(businessType ||0);
    initTable(layui.table, layui.soulTable);
    // initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

var search;

function initSearch() {
    search = Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '客户名称', placeholder: '请输入客户名称', fieldName: 'customerName'},//[0,1,2,3,4,5,6]
            {type: 'text', label: '联系电话', placeholder: '请输入联系电话', fieldName: 'contactTel'},//[0,1,2,3,4,5,6]
            {type: 'select', label: '客户类型', fieldName: 'customerType', selectMap: {1:'企业', 2:'个人'}},//[0,1,2,3,4,5,6]
            // {type: 'select', label: '客户分类', fieldName: 'customerCategory', selectMap: {1:'潜在客户', 2:'成交客户'}},//[0,1,2,3,4,5,6]
            {type: 'select', label: '所属渠道', fieldName: 'channelId', selectListValueName: 'id', selectListTxtName: 'channelName',
                selectList: vm.channelLst, hidden: true, selectFilter: true},//[0,1,2,3,4,5,6]
            {type: 'text', label: '联系人', placeholder: '请输入联系人', fieldName: 'contactPerson', hidden: true, selectFilter: true},//[0,1,2,3,4,5,6]
            {type: 'text', label: '车牌号/车架号', placeholder: '请输入车牌号/车架号', fieldName: 'carnovin', hidden: true, selectFilter: true},//[1,2,3,4,5]
            {type: 'select', label: '月租付款方式', fieldName: 'paymentMethod', selectMap: {
                    7:'日付',
                    8:'周付',
                    1:'月付',
                    2:'两月付',
                    3:'季付',
                    6:'半年付',
                    4:'年付',
                    5:'一次性结清'
                }, hidden: true, selectFilter: true},//[1,2]
            {type: 'select', label: '付款类型', fieldName: 'collectionType', selectMap: {
                    0:'其他',
                    1:'保证金',
                    2:'租金',
                    3:'首付款',
                    4:'退车结算款',
                    5:'换车结算款',
                    6:'备用车结算款',
                    7:'整备费',
                    8:'尾款',
                    9:'定金',
                    10:'其他费用',
                    11:'车辆总单价'
                }, hidden: true, selectFilter: true},//[3,4]
            {type: 'select', label: '退款类型', fieldName: 'refundType', selectMap: {
                    0:'其他',
                    1:'换车结算单',
                    2:'退车结算单',
                    3:'备用车结算单',
                    4:'保证金',
                    5:'租金'
                }, hidden: true, selectFilter: true},//[5]
            {type: 'select', label: '售卖方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name',
                selectList: vm.lessorLst, hidden: true, selectFilter: true},//[1,2,3,4,5]
            {type: 'select', label: '租赁类型', fieldName: 'rentType', selectMap: orderRentTypeMap, hidden: true, selectFilter: true},//[1,2,3,4,5]
            {type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList,
                hidden: true, selectFilter: true},//[1,2,3,4,5]
            {type: 'select', label: '客户状态', fieldName: 'customerState', selectMap: {
                    1:'正常',
                    2:'黑名单'
                }, hidden: true, selectFilter: true},//[0,6]
            {type: 'select', label: '业务负责人', fieldName: 'clerkId', selectListValueName: 'userId', selectListTxtName: 'username',
                selectList: vm.clerkLst, hidden: true, selectFilter: true},//[0,6]
            // {type: 'select', label: '欠款类型', fieldName: 'oweMoneyType', selectMap: collectionTypeMap, hidden: true, selectFilter: true},//[0,6]
            {type: 'select', label: '所属公司', fieldName: 'company', selectListValueName: 'deptId', selectListTxtName: 'companyName',
                selectList: vm.companyLst, hidden: true, selectFilter: true},//[0,6]
            {type: 'text', label: '备注信息', placeholder: '请输入备注信息', fieldName: 'remarks', hidden: true, selectFilter: true},//[0,6]
            {type: 'date', label: '租赁开始时间', placeholder: '选择日期范围', fieldName: 'timeStartRent', hidden: true, selectFilter: true},//[1,2,3,4,5]
            {type: 'date', label: '租赁结束时间', placeholder: '选择日期范围', fieldName: 'timeFinishRent', hidden: true, selectFilter: true},//[1,2,3,4,5]
            {type: 'date', label: '交车时间', placeholder: '选择日期范围', fieldName: 'timeDelivery', hidden: true, selectFilter: true},//[1,2]
            {type: 'date', label: '应付时间', placeholder: '选择日期范围', fieldName: 'receivableDate', hidden: true, selectFilter: true},//[3,4]
            {type: 'date', label: '应退时间', placeholder: '选择日期范围', fieldName: 'refundTime', hidden: true, selectFilter: true},//[5]
            {type: 'date', label: '创建时间', placeholder: '选择日期范围', fieldName: 'createTime', hidden: true, selectFilter: true},//[0,6]
        ],
        callback: function (tag) {
            switch (tag) {
                case 'query':{
                    vm.query();
                    break;
                }
                case 'reset':{
                    vm.reset();
                    break;
                }
                case 'exports':{
                    vm.exports();
                    break;
                }
            }
        }
    });
    search.initView();
    changeStatusTab(vm.statusIndex);
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'customer/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width: 150,minWidth: 150, templet: '#barTpl', fixed: "left", align: "center",},
            {field: 'carNo', minWidth: 130, title: '车牌号',fixed: "left", align:"center",templet: function (d) {
                return '<span class="carSkip" carid="'+d.carId+'">'+isEmpty(d.carNo)+'</span>';}},
            {field: 'customerCategory', minWidth: 100, title: '客户分类', templet: function (d) {return transformTypeByMap(d.customerCategory, {1:'潜在客户', 2:'成交客户'})}},
            {field: 'lessorName', minWidth: 100, title: '售卖方', templet: function (d) {return isEmpty(d.lessorName)}},
            {field: 'customerName', minWidth: 100, title: '客户名称', templet: function (d) {return isEmpty(d.customerName)}},
            {field: 'customerType', minWidth: 80, title: '客户类型', templet: function (d) {return transformTypeByMap(d.customerType, {1:'企业', 2:'个人'})}},
            {field: 'contactPerson', minWidth: 100, title: '联系人', templet: function (d) {return isEmpty(d.contactPerson)}},
            {field: 'contactMobile', minWidth: 100, title: '联系电话', templet: function (d) {return isEmpty(d.contactMobile)}},
            {field: 'emergencyPerson', minWidth: 100, title: '紧急联系人', templet: function (d) {return isEmpty(d.emergencyPerson)}},
            {field: 'emergencyMobile', minWidth: 100, title: '紧急联系电话', templet: function (d) {return isEmpty(d.emergencyMobile)}},
            {
                field: 'state', minWidth: 130, title: '状态', templet: function (d) {
                    if (d.state == 1) {return "<span style='color:green;'>正常</span>";
                    } else if (d.state == 2) {return "<span style='color:red;'>黑名单</span>";}
                }
            },
            {field: 'balance', align: "center", title: '账户余额/元'},
            // {field: 'cashWithdrawal', minWidth: 130, title: '累计提现金额/元', templet: function (d) {return isEmpty(d.cashWithdrawal)}},
            // {field: 'collectionType', minWidth: 130, title: '欠款类型', templet: function (d) {return isEmpty(d.collectionType)}},
            // {field: 'uncollectedAmount', minWidth: 130, title: '欠款金额(元)', templet: function (d) {return isEmpty(d.uncollectedAmount)}},
            {field: 'orderCarCode', title: '订单编号', minWidth:200, templet:'#skipOrder'},
            {field: 'rentTypeStr', minWidth: 130, title: '租赁类型', templet: function (d) {return isEmpty(d.rentTypeStr)}},
            {field: 'paymentMethodStr', minWidth: 130, title: '月租付款方式', templet: function (d) {return isEmpty(d.paymentMethodStr)}},
            {field: 'paymentTypeStr', minWidth: 130, title: '付款类型', templet: function (d) {return isEmpty(d.paymentTypeStr)}},
            {field: 'refundTypeStr', minWidth: 130, title: '退款类型', templet: function (d) {return isEmpty(d.refundTypeStr)}},
            {field: 'timeStartRent', minWidth: 130, title: '租赁开始时间', templet: function (d) {return isEmpty(d.timeStartRent)}},
            {field: 'timeFinishRent', minWidth: 130, title: '租赁结束时间', templet: function (d) {return isEmpty(d.timeFinishRent)}},
            {field: 'timeDelivery', minWidth: 130, title: '交车时间', templet: function (d) {return isEmpty(d.timeDelivery)}},
            {field: 'receivableDate', minWidth: 130, title: '应付日期', templet: function (d) {return isEmpty(d.receivableDate)}},
            {field: 'refundDate', minWidth: 130, title: '应退日期', templet: function (d) {return isEmpty(d.refundDate)}},
            {field: 'vinNo', minWidth: 130, title: '车架号', templet: function (d) {return isEmpty(d.vinNo)}},
            {field: 'brandSeriesModel', minWidth: 130, title: '品牌/车系/车型', templet: function (d) {return isEmpty(d.brandSeriesModel)}},
            {field: 'useDays', minWidth: 130, title: '已使用天数', templet: function (d) {return isEmpty(d.useDays)}},
            {field: 'surplusDays1', minWidth: 130, title: '租赁到期', templet: function (d) {
                    if (d.surplusDay >= 0) {return '<span style="color:green;">'+d.surplusDays1+'</span>';
                    } else {return '<span style="color:red;">'+d.surplusDays1+'</span>';}
                }
            },
            {field: 'surplusDays2', minWidth: 130, title: '剩余天数', templet: function (d) {
                    if (d.receivableDateSurplusDay >= 0) {return '<span style="color:green;">'+d.surplusDays2+'</span>';
                    } else {return '<span style="color:red;">'+d.surplusDays2+'</span>';}
                }
            },
            {field: 'overdueDays', minWidth: 130, title: '逾期天数', templet: function (d) {return '<span style="color:red;">'+d.overdueDays+'</span>';}},
            {field: 'surplusDays3', minWidth: 130, title: '提醒时间', templet: function (d) {
                    if (d.refundDateSurplusDay >= 0) {return '<span style="color:green;">'+d.surplusDays3+'</span>';
                    } else {return '<span style="color:red;">'+d.surplusDays3+'</span>';}
                }
            },
            {field: 'overdueDesc', minWidth: 130, title: '逾期说明', templet: function (d) {return isEmpty(d.overdueDesc)}},
            {field: 'contactName', minWidth: 80, title: '业务负责人', templet: function (d) {return isEmpty(d.contactName)}},
            {field: 'companyName', minWidth: 80, title: '所属公司', templet: function (d) {return isEmpty(d.companyName)}},
            {field: 'remarks', minWidth: 80, title: '备注信息', templet: function (d) {return isEmpty(d.remarks)}},
            {field: 'createTime', minWidth: 150, title: '创建时间', templet: function (d) {return isEmpty(d.createTime)}},
        ]],
        page: true,
        // loading: true,
        limits: [10, 20, 50, 100, 200],
        limit: 10,
        autoColumnWidth: {
            init: true
        },
        done: function (res) {
            // if (res.data.length != 0) {
            //     window.localStorage.setItem("currentUserName", res.data[0].currentUserName);
            // }
            $('.carSkip').click(function () {
                var _this = this;
                var index = layer.open({
                    title: "车辆详情",
                    type: 2,
                    content: tabBaseURL + "modules/car/tcarbasicdetail.html",
                    success: function(layero,num){
                        var iframe = window['layui-layer-iframe'+num];
                        iframe.vm.initEditData(_this.attributes.carid.value);
                    },
                    end: function () {
                        layer.closeAll();
                    }
                });
                layer.full(index);
            });
            changeStatusData(vm.statusIndex);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            soulTable.render(this);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'update') {
            vm.update(data.id);//修改
        } else if (layEvent === 'blacklist') {
            vm.blacklist(data.id);  //拉入黑名单
        } else if (layEvent === 'cancelBlacklist') {
            vm.cancelBlacklist(data.id);  //取消黑名单
        } else if (layEvent === 'details') {
            vm.view(data);  //详情
        } else if(layEvent === 'skipOrderView'){
            vm.skipOrderView(data);
        }
    });
}

function changeStatusTab(status) {
    search.reset();
    switch (parseInt(status)) {
        case 6:
        case 0:{
            search.hideItems('carnovin', 'paymentMethod', 'collectionType', 'refundType', 'lessorId', 'rentType', 'modelId', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'receivableDate', 'refundTime');
            search.showItems( 'customerState', 'clerkId', 'oweMoneyType', 'company', 'remarks', 'createTime');
            break;
        }
        case 2:
        case 1:{
            search.hideItems('collectionType', 'refundType', 'modelId', 'customerState', 'clerkId', 'oweMoneyType', 'company', 'remarks', 'receivableDate', 'refundTime', 'createTime');
            search.showItems('carnovin', 'paymentMethod', 'lessorId', 'rentType', 'modelId', 'timeStartRent', 'timeFinishRent', 'timeDelivery');
            break;
        }
        case 4:
        case 3:{
            search.hideItems('paymentMethod', 'refundType', 'customerState', 'clerkId', 'oweMoneyType', 'company', 'remarks', 'timeDelivery', 'refundTime', 'createTime');
            search.showItems('carnovin', 'collectionType', 'lessorId', 'rentType', 'modelId', 'timeStartRent', 'timeFinishRent', 'receivableDate');
            break;
        }
        case 5:{
            search.hideItems('paymentMethod', 'collectionType', 'customerState', 'clerkId', 'oweMoneyType', 'company', 'remarks', 'timeDelivery', 'receivableDate', 'createTime');
            search.showItems('carnovin', 'refundType', 'lessorId', 'rentType', 'modelId', 'timeStartRent', 'timeFinishRent', 'refundTime');
            break;
        }
    }

}

function changeStatusData(status) {
    var ragex
    switch (parseInt(status)) {
        case 0:{//客户总数
            ragex = /(uncollectedAmount|collectionType|lessorName|rentTypeStr|paymentMethodStr|paymentTypeStr|refundTypeStr|timeStartRent|timeFinishRent|timeDelivery|receivableDate|refundDate|orderCarCode|carNo|vinNo|brandSeriesModel|useDays|surplusDays1|surplusDays2|overdueDays|surplusDays3|overdueDesc)/;
            break;
        }
        case 1:{//在租客户
            ragex = /(state|balance|collectionType|uncollectedAmount|paymentTypeStr|refundTypeStr|receivableDate|refundDate|surplusDays1|surplusDays2|overdueDays|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
            break;
        }
        case 2:{//即将到期
            ragex = /(state|balance|collectionType|uncollectedAmount|paymentTypeStr|refundTypeStr|receivableDate|refundDate|useDays|surplusDays2|overdueDays|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
            break;
        }
        case 3:{//需要交租客户
            ragex = /(state|balance|collectionType|uncollectedAmount|paymentMethodStr|refundTypeStr|timeDelivery|refundDate|useDays|surplusDays1|overdueDays|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
            break;
        }
        case 4:{//逾期欠款客户
            ragex = /(state|balance|collectionType|uncollectedAmount|paymentMethodStr|refundTypeStr|timeDelivery|refundDate|useDays|surplusDays1|surplusDays2|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
            break;
        }
        case 5:{//需退款客户
            ragex = /(state|balance|collectionType|uncollectedAmount|paymentMethodStr|paymentTypeStr|timeDelivery|receivableDate|useDays|surplusDays1|surplusDays2|overdueDays|overdueDesc|contactName|companyName|remarks|createTime)/;
            break;
        }
        case 6:{//历史逾期客户
            ragex = /(lessorName|rentTypeStr|paymentMethodStr|paymentTypeStr|refundTypeStr|timeStartRent|timeFinishRent|timeDelivery|receivableDate|refundDate|orderCarCode|carNo|vinNo|brandSeriesModel|useDays|surplusDays1|surplusDays2|overdueDays|surplusDays3)/;
            break;
        }
    }
    // switch (parseInt(status)) {
    //     case 0:{//客户总数
    //         ragex = /(lessorName|rentTypeStr|paymentMethodStr|paymentTypeStr|refundTypeStr|timeStartRent|timeFinishRent|timeDelivery|receivableDate|refundDate|orderCarCode|carNo|vinNo|brandSeriesModel|useDays|surplusDays1|surplusDays2|overdueDays|surplusDays3|overdueDesc)/;
    //         break;
    //     }
    //     case 1:{//在租客户
    //         ragex = /(state|balance|cashWithdrawal|collectionType|uncollectedAmount|paymentTypeStr|refundTypeStr|receivableDate|refundDate|surplusDays1|surplusDays2|overdueDays|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
    //         break;
    //     }
    //     case 2:{//即将到期
    //         ragex = /(state|balance|cashWithdrawal|collectionType|uncollectedAmount|paymentTypeStr|refundTypeStr|receivableDate|refundDate|useDays|surplusDays2|overdueDays|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
    //         break;
    //     }
    //     case 3:{//需要交租客户
    //         ragex = /(state|balance|cashWithdrawal|collectionType|uncollectedAmount|paymentMethodStr|refundTypeStr|timeDelivery|refundDate|useDays|surplusDays1|overdueDays|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
    //         break;
    //     }
    //     case 4:{//逾期欠款客户
    //         ragex = /(state|balance|cashWithdrawal|collectionType|uncollectedAmount|paymentMethodStr|refundTypeStr|timeDelivery|refundDate|useDays|surplusDays1|surplusDays2|surplusDays3|overdueDesc|contactName|companyName|remarks|createTime)/;
    //         break;
    //     }
    //     case 5:{//需退款客户
    //         ragex = /(state|balance|cashWithdrawal|collectionType|uncollectedAmount|paymentMethodStr|paymentTypeStr|timeDelivery|receivableDate|useDays|surplusDays1|surplusDays2|overdueDays|overdueDesc|contactName|companyName|remarks|createTime)/;
    //         break;
    //     }
    //     case 6:{//历史逾期客户
    //         ragex = /(lessorName|rentTypeStr|paymentMethodStr|paymentTypeStr|refundTypeStr|timeStartRent|timeFinishRent|timeDelivery|receivableDate|refundDate|orderCarCode|carNo|vinNo|brandSeriesModel|useDays|surplusDays1|surplusDays2|overdueDays|surplusDays3)/;
    //         break;
    //     }
    // }
    $('th').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
    $('td').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
}


