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
        deptList:[],
    },
    created: function(){
        var _this = this;
        $.ajaxSettings.async= false;
        // var param = parent.layer.boxParams.boxParams;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList.filter(function (v) {
                return v.sysDeptType != 5;
            });
        });
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
        delivery: function (id) {
            $.get(baseURL + "contract/contracbusiness/info/"+id, function(r){
                var param = {
                    data:r.contracbusiness
                };
                var index = layer.open({
                    title: "交车",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contracbusinessedelivery.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        view: function (id) {
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
        add: function(){
            var param = {
                data:{
                    salePersonId: sessionStorage.getItem("userId"),
                    salePersonName: sessionStorage.getItem("username"),
                }
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/contract/contracbusinessedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "contract/contracbusiness/info/"+id, function(r){
                var param = {
                    data:r.contracbusiness
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/contract/contracbusinessedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "contract/contracbusiness/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
            window.location.href = urlParamByObj(baseURL + 'contract/contracbusiness/export', vm.q);
        },
        importSuccess: function (map) {
            var btn = [];
            var isdownxls = map.allCount != null && Number(map.allCount || 1) !== Number(map.successCount || 0);
            if (isdownxls) {
                btn.push('下载失败数据');
            }
            btn.push('关闭');
            var index = layer.confirm(map.message, {
                btn: btn
            }, function () {
                if (isdownxls) {
                    var form = $('form#downLoadXls');
                    form.find('input[name="datas"]').val(JSON.stringify(map.errDatas));
                    form[0].action = baseURL + 'contract/contracbusiness/downxlserr';
                    form.submit();
                }
                layer.close(index);
                vm.reload();
            }, function () {
                layer.close(index);
                vm.reload();
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        vieworder: function (contractNo) {
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
            {type: 'text', label: '合同编号', placeholder: '请输入合同编号', fieldName: 'contractNo',},
            {type: 'text', label: '合同名称', placeholder: '请输入合同名称', fieldName: 'contractName',},
            {type: 'select', label: '订单类型', placeholder: '请选择订单类型', fieldName: 'rentType', selectMap: {
                    1:'经租', 2:'以租代购', 3:'展示车', 4:'试驾车', 5:'融租', 6:'直购', 7:'挂靠',
                }
            },
            {type: 'select', label: '出租方', fieldName: 'lessorId', selectListValueName: 'deptId', selectListTxtName: 'name', selectList: vm.deptList, selectFilter: true},
            {type: 'text', label: '承租方', placeholder: '请输入承租方', fieldName: 'leaseeName', selectFilter: true},
            {type: 'select', label: '合同状态', placeholder: '请选择状态', fieldName: 'status', selectMap: {
                    1:'草稿', 2:'待交车', 3:'部分交车', 4:'履约中', 9:'已结束',
                }, selectFilter: true
            },
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
    upload.render({
        elem: '#inports',
        url: baseURL + 'contract/contracbusiness/imports',
        field: 'file',
        auto: true,
        size: 50 * 1024 * 1024,
        accept: 'file', //普通文件
        acceptMime: '.xls,.xlsx',
        exts: 'xls|xlsx', //
        before: function (obj) {
            layer.msg('数据导入中...', {
                icon: 16,
                shade: 0.1,
                time: 0
            })
        },
        done: function (res) {
            layer.close(layer.msg());
            if (parseInt(res.code) === 0) {
                vm.importSuccess(res);
            } else {
                layer.msg('文件解析失败:' + res.msg, {icon: 5});
            }
        },
        error: function () {
            layer.close(layer.msg());
            layer.msg('文件解析失败', {icon: 5});
        }
    });
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
        // toolbar: true,
        // defaultToolbar: ['filter'],
        url: baseURL + 'contract/contracbusiness/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:150, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'contractNo', title: '合同编号', minWidth:200, templet: function (d) {return isEmpty(d.contractNo);}},
            {field:'contractName', title: '合同名称', minWidth:200, templet: function (d) {return isEmpty(d.contractName);}},
            {field:'countTotle', title: '交车总数量', minWidth:200, templet: function (d) {return isEmpty(d.countTotle);}},
            {field:'countDelivered', title: '已交车数量', minWidth:200, templet: function (d) {return isEmpty(d.countDelivered);}},
            {field:'countUndelivered', title: '未交车数量', minWidth:200, templet: function (d) {return isEmpty(d.countUndelivered);}},

            {field:'countUsing', title: '用车中数量', minWidth:200, templet: function (d) {return isEmpty(d.countUsing);}},
            {field:'countRetired', title: '退车数量', minWidth:200, templet: function (d) {return isEmpty(d.countRetired);}},
            {field:'countTransferred', title: '过户数量', minWidth:200, templet: function (d) {return isEmpty(d.countTransferred);}},

            {field:'statusStr', title: '合同状态', minWidth:200, templet: function (d) {return isEmpty(d.statusStr);}},
            {field:'timeStart', title: '合同开始时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeStart);}},
            {field:'timeSigned', title: '合同签约时间', minWidth:200, templet: function (d) {return dateFormatYMD(d.timeSigned);}},
            {field:'rentType', title: '订单类型', minWidth:200, templet: function (d) {return getRentTypeStr(d.rentType);}},
            {field:'lessorName', title: '出租方', minWidth:200, templet: function (d) {return isEmpty(d.lessorName);}},
            {field:'leaseeName', title: '承租方', minWidth:200, templet: function (d) {return isEmpty(d.leaseeName);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
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
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        } else if(layEvent === 'view'){
            vm.view(data.id);
        } else if(layEvent === 'vieworder'){
            vm.vieworder(data.contractNo);
        } else if(layEvent === 'delivery'){
            vm.delivery(data.id);
        }
    });
}

function initDate(laydate) {

}
