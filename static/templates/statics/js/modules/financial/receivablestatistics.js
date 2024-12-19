$(function () {
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader","form"], function(){
    });
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{},
        isClose: true,
        lst: [],
        ids: [],
        selectLst: [],
        count:0,
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async= false;
        // var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async= true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'contract/contracbusiness/exportContractReceivableStatistics', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        viewOrder: function (contractNo) {
            var param = {
                orderType: 2,
                contractorderCode: contractNo
            };
            var index = layer.open({
                title: "车辆订单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/order/orderlistnew.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        viewReceivable: function (contractNo, statusKey) {
            var param = {
                statusKey: statusKey,
                contractNo: contractNo,
            };
            window.localStorage.setItem("statusKey", statusKey);
            window.localStorage.setItem("contractNo", contractNo);
            var index = layer.open({
                title: "收款单列表",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/financial/receivables.html?statusKey=" + statusKey,
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("statusKey", statusKey);
                    window.localStorage.setItem("contractNo", contractNo);
                }
            });
            layer.full(index);
        },
        viewContract: function (id) {
            $.get(baseURL + "contract/contracbusiness/info/"+id, function(r){
                var param = {
                    data:r.contracbusiness
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contracbusinessview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        yjsk: function () {
            var ids = [];
            var param = {
                receivablesIds:[],
                where: {
                    orderType: 2
                }
            };
            if(vm.ids.length == 0){
            }else {
                $.each(vm.selectLst, function(index, item) {
                    param.receivablesIds.push(item.contractNo);
                });
            }
            //
            var index = layer.open({
                title: "一键收款",
                type: 2,
                area: ['700px', '400px'],
                boxParams: {
                    data: param,
                    callback:function (d) {
                        layer.close(index);
                        vm.reload();
                    }
                },
                content: tabBaseURL + "modules/financial/yjsk.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
    }
});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '客户名称', placeholder: '请输入承租方', fieldName: 'leaseeName'},
            {type: 'text', label: '合同编号', placeholder: '请输入合同编号', fieldName: 'contractNo'},
            {type: 'text', label: '合同名称', placeholder: '请输入合同名称', fieldName: 'contractName'}
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
    }).initView();
}


function initUpload(upload) {
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        if (vm.lst != null && vm.lst.length > 0){
            vm.lst.forEach(function (d) {
                checkedChange(d, d.id, checked);
            });
        }
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            if (!value.disabled)
                $(this).prop("checked", status);
        });
        layui.form.render();
    });

    form.on('checkbox(siam_one)', function(){
        var checked = $(this)[0].checked;
        var id = $(this).attr("data-id");
        var obj = vm.lst.filter(function (d) {
            return d.id == id;
        })[0];
        checkedChange(obj, id, checked);
        checkAllStatusChange();
        layui.form.render();
    });
}

function initClick() {
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    $("#yjsk").click(function(){
        vm.yjsk();
    });

    $(document).on('click', '.viewContract', function () {
        var obj = $(this)[0];
        var id = obj.attributes['contractId'].value.trim();
        vm.viewContract(id);
    });

    $(document).on('click', '.viewOrder', function () {
        var obj = $(this)[0];
        var contractNo = obj.attributes['contractNo'].value.trim();
        if (contractNo && contractNo != 'undefined') vm.viewOrder(contractNo);
    });

    $(document).on('click', '.viewReceivable', function () {
        var obj = $(this)[0];
        var contractNo = obj.attributes['contractNo'].value.trim();
        if (contractNo && contractNo != 'undefined') vm.viewReceivable(contractNo, -9);
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        totalRow: true,
        // toolbar: true,
        // defaultToolbar: ['filter'],
        url: baseURL + 'contract/contracbusiness/queryContractReceivableStatisticsList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {
                templet: "#checkbd",
                title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                width: 60,
                fixed: "left",
                align: "center"
            },
            {field:'contractName', title: '合同名称', minWidth:200, templet: function (d) {return isEmpty(d.contractName);}},
            {field:'contractNo', title: '合同编号', minWidth:200, templet: function (d) {
                    return '<span style="color:#3FACB3;cursor: pointer;" contractId="'+d.id+'" class="viewContract">'+isEmpty(d.contractNo)+'</span>';
                }
            },
            {field:'leaseeName', title: '客户名称', minWidth:200, templet: function (d) {return isEmpty(d.leaseeName);}},
            {field:'receivableCount', title: '账单数量', minWidth:200, totalRow: true, templet: function (d) {
                    if (d.contractNo) {
                        return '<span style="color:#3FACB3;cursor: pointer;" contractNo="' + d.contractNo + '" class="viewReceivable">' + isEmpty(d.receivableCount) + '</span>';
                    } else {
                        return isEmpty(d.receivableCount);
                    }
                }
            },
            {field:'receivableTotle', title: '应收总金额(元)', minWidth:200, totalRow: true, templet: function (d) {return isEmpty(d.receivableTotle);}},
            {field:'receivedTotle', title: '已收账款(元)', minWidth:200, totalRow: true, templet: function (d) {return isEmpty(d.receivedTotle);}},
            {field:'uncollectedTotle', title: '待收账款(元)', minWidth:200, totalRow: true, templet: function (d) {return isEmpty(d.uncollectedTotle);}},
            {field:'recoveryTotle', title: '待追账(元)', minWidth:200, totalRow: true, templet: function (d) {return isEmpty(d.recoveryTotle);}},
            {field:'badDebtTotle', title: '已坏账(元)', minWidth:200, totalRow: true, templet: function (d) {return isEmpty(d.badDebtTotle);}},
            {field:'timeStart', title: '合同开始时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeStart);}},
            {field:'modelCount', title: '车型(种)', minWidth:200, totalRow: true, templet: function (d) {return isEmpty(d.modelCount);}},
            {field:'orderCount', title: '车辆订单(个)', minWidth:200, totalRow: true, templet: function (d) {
                    if (d.contractNo) {
                        return '<span style="color:#3FACB3;cursor: pointer;" contractNo="' + d.contractNo + '" class="viewOrder">' + isEmpty(d.orderCount) + '</span>';
                    } else {
                        return isEmpty(d.orderCount);
                    }
                }
            },
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        parseData: function(res){
            res.data.forEach(function (d) {
                d.LAY_CHECKED = false;
                if ($.inArray(d.id, vm.ids) >= 0) {
                    d.LAY_CHECKED = true;
                }
            });

            vm.lst = res.data;
            checkAllStatusChange();
            return res;
        },
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
    });
}

function initDate(laydate) {

}

function checkAllStatusChange() {
    var count =  vm.lst.length;
    vm.lst.forEach(function (d) {
        if ($.inArray(d.id, vm.ids) >= 0){
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count==0 && vm.lst.length != 0);
}

function checkedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.ids.push(id);
            vm.selectLst.push(data);
        }
        vm.count = vm.ids.length;
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
            for (var i = 0; i < vm.selectLst.length; i++) {
                if (vm.selectLst[i].id == id) {
                    vm.selectLst.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.count = vm.ids.length;
        }
    }
}