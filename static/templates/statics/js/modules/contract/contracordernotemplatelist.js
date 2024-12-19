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
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            code: null,
            orderCode: null,
            carNo: null,
            status: '',
            customerType: '',
            lessorId: '',
            customerName: null,

            rentType: '',
            timeStart: null,
            timeStartstart: null,
            timeStartend: null,
            timeFinish: null,
            timeFinishstart: null,
            timeFinishend: null,
            timeSigned: null,
            timeSignedstart: null,
            timeSignedend: null
        },
        deptList: [],
        isFilter:false
    },
    created: function(){
        var _this = this;
        $.get(baseURL + "sys/dept/listAll", function(r){
            _this.deptList = r.deptList;
        });
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
        view: function (data) {
            $.get(baseURL + "contract/contracordernotemplate/info/"+data.id, function(r){
                var param = {
                    contracorderNotemplate:r.contracorderNotemplate,
                    statusStr: r.contracorderNotemplate.statusStr,
                    contractContentUrl: r.contractContentUrl
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contracordernotemplateview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        add: function(){
            var param = {
                data:{}
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/contract/contracordernotemplateedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (data) {
            $.get(baseURL + "contract/contracordernotemplate/info/"+data.id, function(r){
                var param = {
                    data:r.contracorderNotemplate,
                    contracorderNotemplate:r.contracorderNotemplate,
                    statusStr: data.statusStr,
                    contractContentUrl: r.contractContentUrl
                };
                var url = '';
                if (param.data.contractType == 2){
                    url = "modules/contract/contracorderemplateedit.html";
                }else{
                    url = "modules/contract/contracordernotemplateedit.html";
                    param.data.contractType = 1;
                }
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + url,
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        cancellation: function (id) {
            confirm('确定该合同作废吗，作废之后关联的订单默认全部自动解除？', function(){
                var param = {
                    id:id,
                    status:9
                };
                $.ajax({
                    type: "POST",
                    url: baseURL + "contract/contracordernotemplate/cancellation",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        exports: function () {
            window.location.href = urlParamByObj(baseURL + 'contract/contracordernotemplate/export', vm.q);
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '合同编号', placeholder: '请输入合同编号', fieldName: 'code',},
            {type: 'text', label: '车辆订单号', placeholder: '请输入车辆订单号', fieldName: 'orderCode',},
            {type: 'select', label: '合同状态', placeholder: '请选择合同状态', fieldName: 'status', selectMap: {
                    0:'未开始',
                    1:'执行中',
                    2:'合同执行完成',
                    9:'已作废',
                },
            },
            {type: 'text', label: '车牌号',fixed: "left",align:"center", placeholder: '请输入车牌号', fieldName: 'carNo',selectFilter: true},
            {type: 'date', label: '合同生效时间', placeholder: '选择日期范围', fieldName: 'timeStart', selectFilter: true},
            {type: 'date', label: '合同结束时间', placeholder: '选择日期范围', fieldName: 'timeFinish', selectFilter: true},
            {type: 'date', label: '合同签署时间', placeholder: '选择日期范围', fieldName: 'timeSigned', selectFilter: true},
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

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(status)', function (data) {
        vm.q.status = data.value;
    });
    form.on('select(customerType)', function (data) {
        vm.q.customerType = data.value;
    });
    form.on('select(lessor)', function (data) {
        vm.q.lessorId = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
}

function initClick() {

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'contract/contracordernotemplate/queryList',
        cols: [[
            {title: '操作', width:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carNos', title: '车牌号',fixed: "left",align:"center", minWidth:200, templet: function (d) {
                if (d.carNos != null && d.carNos != '') {
                    return d.carNos.replace(/,/g, '<br/>');
                } else {
                    return '--';
                }
            }},
            {field:'code', title: '合同编号', minWidth:200, templet: function (d) {return isEmpty(d.code);}},
            {field:'orderCodes', title: '车辆订单编号', minWidth:200, templet: function (d) {
                    if (d.orderCodes != null && d.orderCodes != '') {
                        return d.orderCodes.replace(/,/g, '<br/>');
                    } else {
                        return '--';
                    }
            }},
            {field:'statusStr', title: '合同状态', minWidth:200, templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'timeStart', title: '合同生效日期', minWidth:200,  templet: function (d) {return isEmpty(d.timeStart);}},
            {field:'timeFinish', title: '合同终止日期', minWidth:200,  templet: function (d) {return isEmpty(d.timeFinish);}},
            {field:'timeSigned', title: '合同签署日期', minWidth:200,  templet: function (d) {return isEmpty(d.timeSigned);}},
            {field:'operationName', title: '提交人', minWidth:200, templet: function (d) {return isEmpty(d.operationName);}},
            {field:'timeCreate', title: '合同记录时间', minWidth:200,  templet: function (d) {return dateFormatYMDHM(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 20, 30, 50],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            window.localStorage.setItem("contractNo",'');
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
        if(layEvent === 'edit'){
            vm.update(data);
        } else if(layEvent === 'view'){
            vm.view(data);
        } else if(layEvent === 'cancellation'){
            vm.cancellation(data.id);
        }
    });
}

function initDate(laydate) {
    laydate.render({
        elem : '#timeStart',
        range : true,
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.timeStart=value;
            initializeSearchDate(vm.q, 'timeStart', value);
        }
    });

    laydate.render({
        elem : '#timeFinish',
        range : true,
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.timeFinish=value;
            initializeSearchDate(vm.q, 'timeFinish', value);
        }
    });
    laydate.render({
        elem : '#timeStartStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeStartType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeStartStr=value;
            vm.q.timeStartType=null;
        }
    });
    laydate.render({
        elem : '#timeFinishStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeFinishType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeFinishStr=value;
            vm.q.timeFinishType=null;
        }
    });
    laydate.render({
        elem : '#timeSignedStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeSignedType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeSignedStr=value;
            vm.q.timeSignedType=null;
        }
    });
}
