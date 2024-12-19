var dataUrl = baseURL + 'order/order/queryList';
var searchView;
var tableView;
/** 查询条件所有字段 */
var searchMap = {
    /*额外条件*/           /*默认条件*/             /*高级条件*/                     /*高级条件*/
    statusType: '',      carvinno: null,         contractorderCode: null,        customerType: '',
    orderCode: null,     customerName: null,     lessorId: '',                   returnType: '',
                         rentType: '',           modelId: null,                  reletOrderStatus: '',
                                                 orderType: '',                  channelId:null,
                                                                                 salePersonId:null,
    /*租赁开始时间*/                /*租赁结束时间*/                  /*交车时间*/                  /*订单发起时间*/
    timeStartRent: null,          timeFinishRent: null,          timeDelivery: null,          timeCreate: null,
    timeStartRentstart: null,     timeFinishRentstart: null,     timeDeliverystart: null,     timeCreatestart: null,
    timeStartRentend: null,       timeFinishRentend: null,       timeDeliveryend: null,       timeCreateend: null,
    /*退车时间*/                    /*退车发起时间*/                 /*换车时间*/                  /*换车发起时间*/
    timeReturn: null,             timeApplyReturn: null,         timeSwop: null,              timeApplySwop: null,
    timeReturnstart: null,        timeApplyReturnstart: null,    timeSwopstart: null,         timeApplySwopstart: null,
    timeReturnend: null,          timeApplyReturnend: null,      timeSwopend: null,           timeApplySwopend: null,
    /*预计过户时间*/                       /*实际过户时间*/                     /*撤回时间*/
    timeTransferEstimated: null,         timeTransferActual: null,         timeRecall: null,
    timeTransferEstimatedstart: null,    timeTransferActualstart: null,    timeRecallstart: null,
    timeTransferEstimatedend: null,      timeTransferActualend: null,      timeRecallend: null,
    /*续租开始时间*/                     /*续租结束时间*/                       /*暂存时间*/
    timeStartRentRelet: null,          timeFinishRentRelet: null,           timeSave: null,
    timeStartRentReletstart: null,     timeFinishRentReletstart: null,      timeSavestart: null,
    timeStartRentReletend: null,       timeFinishRentReletend: null,        timeSaveend: null,
    /*排序*/
    contractTenancySort: null,//合同租期
    timeStartRentSort: null,//租赁开始日
    timeFinishRentSort: null,//租赁结束日
    timeDeliverySort: null,//交车时间
    usrDaysSort: null,//已使用天数
    saveDaysSort: null,//已暂存天数
    spareCarUsrDaysSort: null,//备用车已使用天数
    timeReturnSort: null,//退车时间
    timeApplyReturnSort: null,//退车发起时间
    timeSwopSort: null,//换车时间
    timeApplySwopSort: null,//换车发起时间
    timeTransferEstimatedSort: null,//预计过户时间
    overdueTransferDaysSort: null,//过户逾期天数
    timeTransferActualSort: null,//实际过户时间
    timeRecallSort: null,//撤回时间
    timeAuditSort: null,//审批时间
    timeCreateSort: null,//订单发起时间
    timeStartRentReletSort: null,//续租开始时间
    timeFinishRentReletSort: null,//续租结束时间
};

var statusCols = [
    { name: '全部订单', count: '', rank: '10', key: '0', src:'../../statics/images/newOrder1.png'},
    { name: '提单审核中', count: '', rank: '20', key: '100', src: '../../statics/images/newOrder2.png' },
    { name: '退车审核中', count: '', rank: '30', key: '500', src: '../../statics/images/newOrder3.png' },
    { name: '换车审核中', count: '', rank: '40', key: '300', src: '../../statics/images/newOrder4.png' },
    { name: '用车中', count: '', rank: '50', key: '200', src: '../../statics/images/newOrder5.png' },
    { name: '已退车', count: '', rank: '60', key: '600', src: '../../statics/images/newOrder6.png' },
    { name: '待确认', count: '', rank: '70', key: '998', src: '../../statics/images/newOrder7.png' },
    { name: '待签章', count: '', rank: '80', key: '110', src: '../../statics/images/newOrder7.png' },
    {name: '融租/以租代购-未过户', count: '', rank: '110', key: '710'},
    {name: '融租/以租代购-已过户', count: '', rank: '120', key: '711'},
    {name: '直购-未过户', count: '', rank: '130', key: '720'},
    {name: '直购-已过户', count: '', rank: '140', key: '721'},
    {name: '已换车', count: '', rank: '150', key: '400'},
    {name: '待交车', count: '', rank: '160', key: '301'},
    {name: '备用车使用中', count: '', rank: '170', key: '201'},
    {name: '提单已撤回', count: '', rank: '180', key: '101'},
    {name: '提单已拒绝', count: '', rank: '190', key: '102'},
    {name: '已续租', count: '', rank: '210', key: '900'},
    {name: '续租时间未开始', count: '', rank: '220', key: '901'}
];

/** 查询条件列 */
var searchCols = [
    {type: 'text', label: '车牌号/车架号', placeholder: '请输入', fieldName: 'carvinno'},
    {type: 'text', label: '客户名称', placeholder: '请输入', fieldName: 'customerName'},
    {type: 'text', label: '客户电话', placeholder: '请输入', fieldName: 'customerTel'},
    {type: 'select', label: '订单类型', fieldName: 'rentType', selectMap: orderRentTypeMap, selectFilter: true},
    {type: 'text', label: '客户身份证号', placeholder: '请输入', fieldName: 'customerIdCardNo', selectFilter: true},
    {type: 'selectmultiple', label: '支付方式', fieldName: 'repaymentMethod', selectMap: {
            1:'微信支付', 5:'支付宝支付', 3:'汇聚代扣', 4:'支付宝代扣', 2:'其他',
        }, selectFilter: true
    },
    {type: 'select', label: '状态', fieldName: 'tsStatus', selectMap: {
            0:'暂存', 1:'待确认-扫码下单', 2:'待确认-代客下单', 3:'待确认-代客下单-客户确认',
        }, selectFilter: true
    },
    {type: 'select', label: '下单方式', fieldName: 'orderWay', selectMap: {
            1:'代客下单', 2:'微信小程序下单', 3:'吉祥租扫码下单',
        }, selectFilter: true
    },
    {type: 'select', label: '合同类型', fieldName: 'orderType', selectMap: {1:'个人合同', 2:'企业合同'}, selectFilter: true},
    {type: 'select', label: '是否电子合同', fieldName: 'contractType', selectMap: {1:'否', 2:'是'}, selectFilter: true},
    {type: 'text', label: '合同编号/订单编号', placeholder: '请输入', fieldName: 'contractorderCode', selectFilter: true},
    {type: 'select', label: '出租方/售卖方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: [], selectFilter: true},
    {type: 'selectcascader', label: '品牌/车系/车型', placeholder: '请选择', fieldName: 'modelId', selectList: [], selectFilter: true},
    {type: 'select', label: '销售员', fieldName: 'salePersonId', selectListValueName: 'userId', selectListTxtName: 'username', selectList: [], selectFilter: true},
    {type: 'select', label: '客户类型', fieldName: 'customerType', selectMap: {1:'企业', 2:'个人',}, selectFilter: true},
    {type: 'select', label: '渠道商', fieldName: 'channelId', selectListValueName: 'channelId', selectListTxtName: 'channelName', selectList: [], selectFilter: true},
    {hidden: true, type: 'select', label: '退车类别', fieldName: 'returnType', selectMap: {1:'租赁到期', 2:'违约退车', 3:'强制收车',4:'其他'}, selectFilter: true},
    {hidden: true, type: 'select', label: '续租订单状态', fieldName: 'reletOrderStatus', selectMap: {
            500:'退车审核中', 300:'换车审核中', 200:'用车中', 600:'已退车', 400:'已换车', 700:'已过户', 901:'续租时间未开始'
        }, selectFilter: true
    },
    {hidden: true, type: 'select', label: '直营提单状态', fieldName: 'chainOrderStatus', selectMap: {
            120:'待签章', 121:'签章中', 122:'待交车', 123:'待验车', 124:'待审核'
        }, selectFilter: true
    },
    {type: 'text', label: '订单备注', placeholder: '请输入', fieldName: 'orderDesc', selectFilter: true},

    {hidden: true, type: 'date', label: '租赁开始时间', placeholder: '租赁开始时间范围', fieldName: 'timeStartRent', selectFilter: true},
    {hidden: true, type: 'date', label: '租赁结束时间', placeholder: '租赁结束时间范围', fieldName: 'timeFinishRent', selectFilter: true},
    {hidden: true, type: 'date', label: '交车时间', placeholder: '交车时间范围', fieldName: 'timeDelivery', selectFilter: true},
    {hidden: true, type: 'date', label: '订单发起时间', placeholder: '订单发起时间范围', fieldName: 'timeCreate', selectFilter: true},
    {hidden: true, type: 'date', label: '退车时间', placeholder: '退车时间范围', fieldName: 'timeReturn', selectFilter: true},
    {hidden: true, type: 'date', label: '退车发起时间', placeholder: '退车发起时间范围', fieldName: 'timeApplyReturn', selectFilter: true},
    {hidden: true, type: 'date', label: '换车时间', placeholder: '换车时间范围', fieldName: 'timeSwop', selectFilter: true},
    {hidden: true, type: 'date', label: '换车发起时间', placeholder: '换车发起时间范围', fieldName: 'timeApplySwop', selectFilter: true},
    {hidden: true, type: 'date', label: '暂存时间', placeholder: '暂存时间范围', fieldName: 'timeSave', selectFilter: true},
    {hidden: true, type: 'date', label: '预计过户时间', placeholder: '预计过户时间范围', fieldName: 'timeTransferEstimated', selectFilter: true},
    {hidden: true, type: 'date', label: '实际过户时间', placeholder: '实际过户时间范围', fieldName: 'timeTransferActual', selectFilter: true},
    {hidden: true, type: 'date', label: '撤回时间', placeholder: '撤回时间范围', fieldName: 'timeRecall', selectFilter: true},
    {hidden: true, type: 'date', label: '续租开始时间', placeholder: '续租开始时间范围', fieldName: 'timeStartRentRelet', selectFilter: true},
    {hidden: true, type: 'date', label: '续租结束时间', placeholder: '续租结束时间范围', fieldName: 'timeFinishRentRelet', selectFilter: true},
]

var tableCols = [
    {field: 'btns', title: '操作', width: 120, fixed: 'left', align: 'center', templet: function (d) {
            var reg = /<span(.*?)<\/span>/;
            var btn = d.buttonList+'';
            var btnTmp;
            var view = '';
            view += '<div style="width:120px;">';
            view += '    <div class="mmv-dropdonw">';
            for (let i = 0; i < 2; i++) {
                btnTmp = btn.match(reg)[0];
                view += btnTmp;
                btn = btn.replace(btnTmp, '');
            }
            if (btn.match(reg) != null) {
                view += '       <a class="mmv-dropdonw-btn layui-grid-btn-xs" lay-event="mmvMore">更多<i class="el-icon-d-arrow-right"></i></a>';
                view += '       <div class="mmv-dropdonw-wrap">';
                while (btn.match(reg) != null) {
                    btnTmp = btn.match(reg)[0];
                    if (btnTmp.search('chainsgin') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:chainsgin\']">'
                    } else if (btnTmp.search('chaindeliverycar') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:chaindeliverycar\']">'
                    } else if (btnTmp.search('chainvalidatecar') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:chainvalidatecar\']">'
                    } else if (btnTmp.search('chainaudit') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:chainaudit\']">'
                    } else if (btnTmp.search('useEdit') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:useEdit\']">'
                    } else if (btnTmp.search('删除') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:delete\']">'
                    } else if (btnTmp.search('编辑') > 0) {
                        view += '<div class="mmv-drop-donw-item" v-m-perm="[\'order:order:update\']">'
                    } else {
                        view += '<div class="mmv-drop-donw-item">'
                    }
                    view += btnTmp;
                    view += '</div>'
                    btn = btn.replace(btnTmp, '');
                }
                view += '       </div>';
            }
            view += '   </div>';
            view += '</div>';
            return view;
        }
    },
    {field: 'carNo', fixed: "left",title: '车牌号',align:"center",minWidth: 200, templet: function (d) {return isEmpty(d.carNo);}},
    {field: 'rentType', title: '订单类型', minWidth: 200, templet: function (d) {return getRentTypeStr(d.rentType);}},
    {field: 'statusStr', title: '订单状态', minWidth: 200, templet: function (d) {return isEmpty(d.statusStr);}},
    {field: 'saveDays', title: '已暂存天数', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.saveDays);}},
    {field: 'returnType', title: '退车类别', minWidth:200, templet: function (d) {return transformTypeByMap(d.returnType, {1:'租赁到期', 2:'违约退车', 3:'强制收车', 4:'其他'});}},
    {field: 'timeReturn', title: '退车时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeReturn);}},
    {field: 'timeApplyReturn', title: '退车发起时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeApplyReturn);}},
    {field: 'swopReason', title: '换车原因', minWidth: 200, templet: function (d) {return isEmpty(d.swopReason);}},
    {field: 'timeSwop', title: '换车时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeSwop);}},
    {field: 'timeApplySwop', title: '换车发起时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeApplySwop);}},
    {field: 'customerName', title: '客户名称', minWidth: 200, templet: function (d) {return isEmpty(d.customerName);}},
    {field: 'customerTel', title: '客户电话', minWidth: 200, templet: function (d) {return isEmpty(d.customerTel);}},
    {field: 'customerIdCardNo', title: '客户身份证号', minWidth: 200, templet: function (d) {return isEmpty(d.customerIdCardNo);}},
    {field: 'lessorName', title: '出租方/售卖方', minWidth: 200, templet: function (d) {return isEmpty(d.lessorName);}},
    {field: 'contractTenancy', title: '合同租期', minWidth: 200, sort: false, templet: function (d) {return isEmpty(d.contractTenancy);}},
    {field: 'timeStartRent', title: '租赁开始日', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeStartRent);}},
    {field: 'timeFinishRent', title: '租赁结束日', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeFinishRent);}},
    {field: 'timeDelivery', title: '交车时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeDelivery);}},
    {field: 'timeTransferEstimated', title: '预计过户时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeTransferEstimated);}},
    {field: 'overdueTransferDays', title: '过户逾期天数', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.overdueTransferDays);}},
    {field: 'timeTransferActual', title: '实际过户时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeTransferActual);}},
    {field: 'usrDays', title: '已使用天数', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.usrDays);}},
    {field: 'repaymentMethod', title: '支付方式', minWidth: 200, templet: function (d) {return transformTypeByMap(d.repaymentMethod, {1:'微信支付', 5:'支付宝支付', 3:'汇聚代扣', 4:'支付宝代扣', 2:'其他'});}},
    {field: 'orderWay', title: '下单方式', minWidth: 200, templet: function (d) {return transformTypeByMap(d.orderWay, {1:'代客下单', 2:'微信小程序下单', 3:'吉祥租扫码下单'});}},
    {field: 'orderType', title: '合同类型', minWidth: 200, templet: function (d) {return transformTypeByMap(d.orderType, {1:'个人合同', 2:'企业合同'});}},
    {field: 'contractCode', title: '合同编号', minWidth: 200, templet: function (d) {return isEmpty(d.contractCode);}},
    {field: 'orderCarCode', title: '车辆订单号', minWidth: 200, templet: function (d) {return isEmpty(d.orderCarCode);}},
    {field: 'orderDesc', title: '订单备注', minWidth: 200, templet: function (d) {return isEmpty(d.orderDesc);}},
    {field: 'orderCarCodeRelet', title: '续租订单号', minWidth: 200, templet: function (d) {return isEmpty(d.orderCarCodeRelet);}},
    {field: 'statusRelet', title: '续租订单状态', minWidth: 200, templet: function (d) {return isEmpty(d.statusRelet);}},
    {field: 'timeStartRentRelet', title: '续租开始日', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeStartRentRelet);}},
    {field: 'timeFinishRentRelet', title: '续租结束日', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeFinishRentRelet);}},
    {field: 'vinNo', title: '车架号', minWidth: 200, templet: function (d) {return isEmpty(d.vinNo);}},
    {field: 'modelNames', title: '品牌/车系/车型', minWidth: 200, templet: function (d) {return isEmpty(d.modelNames);}},
    {field: 'orderCarExplain', title: '订单说明', minWidth: 200, templet: function (d) {return isEmpty(d.orderCarExplain);}},
    {field: 'spareCarUsrDays', title: '备用车已使用天数', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.spareCarUsrDays);}},
    {field: 'recallReason', title: '撤回原因', minWidth: 200, templet: function (d) {return isEmpty(d.recallReason);}},
    {field: 'timeRecall', title: '撤回时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeRecall);}},
    {field: 'refuseReason', title: '拒绝原因', minWidth: 200, templet: function (d) {return isEmpty(d.refuseReason);}},
    {field: 'timeAudit', title: '审批时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeAudit);}},
    {field: 'timeCreate', title: '订单发起时间', minWidth: 200, sort: true, templet: function (d) {return isEmpty(d.timeCreate);}},
];

function onStatusChangedDataUrl(statusKey) {
    dataUrl = baseURL + 'order/order/queryPagenew/' + statusKey;
}

function onStatusChangedSearchView(statusKey) {
    if (searchView == null) return;
    // searchView.reset();
    switch (parseInt(statusKey)) {
        case 0:{//全部订单
            searchView.hideItems('returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'chainOrderStatus', 'repaymentMethod', 'tsStatus', 'timeStartRent', 'timeFinishRent', 'timeDelivery');
            break;
        }
        case 100:{//提单审核中
            searchView.hideItems('tsStatus', 'returnType', 'reletOrderStatus', 'timeDelivery', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'chainOrderStatus', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeCreate');
            break;
        }
        case 500:{//退车审核中
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'returnType', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeReturn', 'timeApplyReturn');
            break;
        }
        case 300:{//换车审核中
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeSwop', 'timeApplySwop');
            break;
        }
        case 110:{//待签章
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery');
            break;
        }
        case 200:{//用车中
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery');
            break;
        }
        case 600:{//已退车
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'returnType', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeReturn');
            break;
        }
        case 998:{//暂存
            searchView.hideItems('returnType', 'chainOrderStatus', 'reletOrderStatus', 'timeDelivery', 'timeCreate', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'tsStatus', 'timeStartRent', 'timeFinishRent', 'timeSave');
            break;
        }
        case 710:{//融租未过户
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeTransferEstimated');
            break;
        }
        case 711:{//融租已过户
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeTransferEstimated', 'timeTransferActual');
            break;
        }
        case 720:{//直购未过户
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'rentType', 'returnType', 'reletOrderStatus', 'timeStartRent', 'timeFinishRent', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'repaymentMethod', 'timeDelivery', 'timeTransferEstimated');
            break;
        }
        case 721:{//直购已过户
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'rentType', 'returnType', 'reletOrderStatus', 'timeStartRent', 'timeFinishRent', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'repaymentMethod', 'timeDelivery', 'timeTransferEstimated', 'timeTransferActual');
            break;
        }
        case 400:{//已换车
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeSwop', 'timeApplySwop');
            break;
        }
        case 301:{//待交车
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeSwop', 'timeApplySwop');
            break;
        }
        case 201:{//备用车使用中
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeDelivery');
            break;
        }
        case 101:{//提单已撤回
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeDelivery', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeCreate', 'timeRecall');
            break;
        }
        case 102:{//提单已拒绝
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'reletOrderStatus', 'timeDelivery', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall', 'timeStartRentRelet', 'timeFinishRentRelet');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'timeStartRent', 'timeFinishRent', 'timeCreate');
            break;
        }
        case 900:{//已续租
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'reletOrderStatus', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeStartRentRelet', 'timeFinishRentRelet');
            break;
        }
        case 901:{//续租时间未开始
            searchView.hideItems('tsStatus', 'chainOrderStatus', 'returnType', 'timeCreate', 'timeSave', 'timeReturn', 'timeApplyReturn', 'timeSwop', 'timeApplySwop', 'timeTransferEstimated', 'timeTransferActual', 'timeRecall');
            searchView.showItems('customerTel','customerIdCardNo', 'orderDesc', 'rentType', 'repaymentMethod', 'reletOrderStatus', 'timeStartRent', 'timeFinishRent', 'timeDelivery', 'timeStartRentRelet', 'timeFinishRentRelet');
            break;
        }
    }
}

function onStatusChangedTableView(statusKey) {
    var ragex;
    switch (parseInt(statusKey)) {
        case 0:{//全部订单
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 100:{//提单审核中
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 500:{//退车审核中
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 300:{//换车审核中
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 110:{
            ragex = /(usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }//待签章
        case 200:{//用车中
            ragex = /(saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 600:{//已退车
            ragex = /(orderCarExplain|saveDays|spareCarUsrDays|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 998:{//暂存
            ragex = /(orderCarExplain|usrDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 710:{//融租未过户
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 711:{//融租已过户
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 720:{//直购未过户
            ragex = /(orderCarExplain|contractTenancy|timeStartRent|timeFinishRent|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 721:{//直购已过户
            ragex = /(orderCarExplain|contractTenancy|timeStartRent|timeFinishRent|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 400:{//已换车
            ragex = /(usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 301:{//待交车
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 201:{//备用车使用中
            ragex = /(usrDays|saveDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 101:{//提单已撤回
            ragex = /(orderCarExplain|contractTenancy|timeStartRent|timeFinishRent|timeDelivery|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|refuseReason|timeAudit|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 102:{//提单已拒绝
            ragex = /(orderCarExplain|contractTenancy|timeStartRent|timeFinishRent|timeDelivery|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|orderCarCodeRelet|statusRelet|timeStartRentRelet|timeFinishRentRelet)/;
            break;
        }
        case 900:{//已续租
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate)/;
            break;
        }
        case 901:{//续租时间未开始
            ragex = /(orderCarExplain|usrDays|saveDays|spareCarUsrDays|returnType|timeReturn|timeApplyReturn|swopReason|timeSwop|timeApplySwop|timeTransferEstimated|overdueTransferDays|timeTransferActual|recallReason|timeRecall|refuseReason|timeAudit|timeCreate)/;
            break;
        }
    }
    $('th').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
    $('td').filter(function() {
        var id = this.attributes['data-field'].value;
        return id != null && id.match(ragex);
    }).css('display','none');
}
