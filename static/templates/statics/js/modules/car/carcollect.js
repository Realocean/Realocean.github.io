var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo: null,
            carOrderNo: null,
            collectType: null,
            handlerId: null,
            deptId:null,
            deptName:null,
            brandId:null,
            seriesId:null,
            modelId:null,
            customerName:null,
            collectReasonName:null,
            timeCreateType:null,
            timeCreateStr:null,
            collectTimeType:null,
            collectTimeStr:null,

        },
        userList: {},
        showForm: false,
        editForm: false,
        allCarModels:[],
        isFilter :false
    },
    updated: function () {
        layui.form.render();
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
                        vm.q.brandId = valData[0];
                        vm.q.seriesId = valData[1];
                        vm.q.modelId = valData[2];
                    }
                });
            });
        });
    },
    methods: {
        query: function () {
            vm.reload();
        },
        view: function (carCollectId) {
            localStorage.setItem("carCollectId", carCollectId);
            var index = layer.open({
                title: "收车详情",
                type: 2,
                area: ['100%', '100%'],
                content: tabBaseURL + "modules/car/carcollect_view.html",
                end: function(){
                   localStorage.setItem("carCollectId", null);
                }
            });
        },
        selectcollectTypeChange: function (data) {
            vm.q.collectType = data.value;
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo,
                    carOrderNo: vm.q.carOrderNo,
                    collectType: vm.q.collectType,
                    handlerId: vm.q.handlerId,
                    deptId:vm.q.deptId,
                    deptName:vm.q.deptName,
                    customerName:vm.q.customerName,
                    collectReasonName:vm.q.collectReasonName,
                    brandId:vm.q.brandId,
                    seriesId:vm.q.seriesId,
                    modelId:vm.q.modelId,
                    timeCreateType:vm.q.timeCreateType,
                    timeCreateStr:vm.q.timeCreateStr,
                    collectTimeType:vm.q.collectTimeType,
                    collectTimeStr:vm.q.collectTimeStr
                }
            });
        },
        deptTree: function(){
            var index = layer.open({
                title: "选择组织机构",
                type: 2,
                area: ['80%', '80%'],
                content: tabBaseURL + "modules/common/selectdeptcommon.html",
                end: function(){
                    layer.close(index);
                }
            });
        },
        zTreeClick: function(event, treeId, treeNode){
            Vue.set(vm.q,"deptId",treeNode.deptId);
            Vue.set(vm.q,"deptName",treeNode.name);
            layer.closeAll();
        },
        reset:function(){
                vm.q.carNo=null,
                vm.q.carOrderNo=null,
                vm.q.collectType=null,
                vm.q.handlerId=null,
                vm.q.deptId=null,
                vm.q.deptName=null,
                vm.q.brandId=null,
                vm.q.seriesId =null,
                vm.q.modelId =null,
                vm.q.customerName =null,
                vm.q.collectReasonName =null,
                vm.q.timeCreateType=null,
                vm.q.timeCreateStr=null,
                vm.q.collectTimeType=null,
                vm.q.collectTimeStr=null
                 $("#carBrandSeriesModel").val("");
                 $('div[type="timeCreateType"]>div').removeClass('task-content-box-tab-child-active');
                 $('div[type="collectTimeType"]>div').removeClass('task-content-box-tab-child-active');
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        exports: function () {
            var url = baseURL + 'car/carcollect/export?a=a';
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q.carOrderNo != null){
                url += '&carOrderNo='+vm.q.carOrderNo;
            }
            if(vm.q.collectType != null){
                url += '&collectType='+vm.q.collectType;
            }
            if(vm.q.handlerId != null){
                url += '&handlerId='+vm.q.handlerId;
            }
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.collectReasonName != null){
                url += '&collectReasonName='+vm.q.collectReasonName;
            }
            if(vm.q.brandId != null){
                url += '&brandId='+vm.q.brandId;
            }
            if(vm.q.seriesId != null){
                url += '&seriesId='+vm.q.seriesId;
            }
            if(vm.q.modelId != null){
                url += '&modelId='+vm.q.modelId;
            }
            if(vm.q.timeCreateType != null){
                url += '&timeCreateType='+vm.q.timeCreateType;
            }
            if(vm.q.timeCreateStr != null){
                url += '&timeCreateStr='+vm.q.timeCreateStr;
            }
           if(vm.q.collectTimeType != null){
                url += '&collectTimeType='+vm.q.collectTimeType;
            }
           if(vm.q.collectTimeStr != null){
                url += '&collectTimeStr='+vm.q.collectTimeStr;
            }
            window.location.href = url;
        },

    }
});

$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            init(layui);
            form.render();
    });
    layui.use('soulTable', function () {
        var soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'car/carcollect/list',
            cols: [[
                {title: '操作', width: 60, templet: '#barTpl', fixed: "left", align: "center"},
                {
                    field: 'carNo', minWidth: 100,align:"center", title: '车牌号',fixed: "left", templet: function (d) {
                    return isEmpty(d.carNo);
                }
                },
                {
                    field: 'vinNo', minWidth: 100, title: '车架号', templet: function (d) {
                    return isEmpty(d.vinNo);
                }
                },
                {
                    field: 'modelName', minWidth: 100, title: '品牌/车系/车型', templet: function (d) {
                    return isEmpty(d.modelName);
                }
                },
                /*{
                    field: 'deptName', minWidth: 100, title: '车辆归属', templet: function (d) {
                    return isEmpty(d.deptName);
                }
                },*/
                {field: 'orderCode', minWidth: 100, title: '车辆订单编号', templet: function (d) {
                    return isEmpty(d.orderCode);
                }},
                {field: 'customerName', minWidth: 100, title: '客户名称', templet: function (d) {
                    return isEmpty(d.customerName);
                }},
                {field: 'mobile', minWidth: 100, title: '联系电话', templet: function (d) {
                    return isEmpty(d.mobile);
                }},
                {
                    field: 'collectType', minWidth: 100, title: '收车状态', templet: function (d) {
                    var collectType = "";
                    if (d.collectType == 1) {
                        collectType = "审核中";
                    } else if (d.collectType == 2) {
                        collectType = "已收车";
                    } else if (d.collectType == 3) {
                        collectType = "已驳回";
                    }
                    return collectType;
                }
                },
                {field: 'flowApproveStatus', minWidth: 100, title: '审核状态', templet: function (d) {
                        return isEmpty(d.flowApproveStatus);
                    }},
                {field: 'collectReasonName', minWidth: 100, title: '收车原因',templet:function (d) {
                        return isEmpty(d.collectReasonName);
                }},
                {field: 'userName', minWidth: 100, title: '处理人',templet:function (d) {
                       return isEmpty(d.userName);
                 }},
                /*{field: 'timeCreate', minWidth: 200, title: '发起时间', templet: function (d) {
                      return isEmpty(d.collectTime);
                  }
                },*/
                {
                    field: 'collectTime', minWidth: 200, title: '收车时间', templet: function (d) {
                        return isEmpty(d.collectTime);
                    }
                }
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10
            ,autoColumnWidth: {
                init: true
            },
            done: function () {
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                soulTable.render(this);
            }
        });
    });
    layui.form.on('select(collectType)', function (data) {
        vm.selectcollectTypeChange(data);
    });

    //操作
    layui.table.on('tool(grid)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'view') {
            vm.view(data.id);
        }
    });

    layui.form.on('select(handlerId)', function (data) {
        vm.q.handlerId = data.value;
    });
    //获取用户id和名称
    getUserInfo();
    layui.form.render();
});

/**
 * 获取用户信息
 */
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: baseURL + 'car/carcollect/getUserInfo',
        contentType: "application/json",
        success: function (r) {
            vm.userList = r.data;
        }
    });
}


function init(layui) {
    initDate(layui.laydate);
    initClick();
}


function initClick() {
    $('div[type="timeCreateType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="timeCreateType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "timeCreateStr", '');
        vm.q.timeCreateType=value;
    });

    $('div[type="collectTimeType"]>div').on('click', function(){
        var selected = $(this);
        $('div[type="collectTimeType"]>div').removeClass('task-content-box-tab-child-active');
        selected.addClass('task-content-box-tab-child-active');
        var value = selected.attr('value');
        Vue.set(vm.q, "collectTimeStr", '');
        vm.q.collectTimeType=value;
    });
}

function initDate(laydate) {
    //维修开始时间，自定义时间
    laydate.render({
        elem : '#timeCreateStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="timeCreateType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.timeCreateStr=value;
            vm.q.timeCreateType=null;
        }
    });

    laydate.render({
        elem : '#collectTimeStr',
        type : 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            $('div[type="collectTimeType"]>div').removeClass('task-content-box-tab-child-active');
            vm.q.collectTimeStr=value;
            vm.q.collectTimeType=null;
        }
    });


}
