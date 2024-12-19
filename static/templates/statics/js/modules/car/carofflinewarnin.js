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
        var cascader = layui.cascader;
        $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
            vm.selectData = r.carTreeVoList;
            cascader({
                elem: "#a",
                data: vm.selectData,
                success: function (valData,labelData) {
                    vm.q.modelId = valData[2];
                    vm.q.modelName = labelData[2];
                }
            });
        });
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            //车牌号
            carNo:null,
            //归属部门
            deptId:null,
            deptName:null,
            //车辆状态
            businessType:null,
            //客户名称
            customerName:null,
            //订单号
            orderCarCode:null,
            //处理状态
            processingState:null,
            createTime:null,
            //报警开始时间
            createTimeStart:null,
            //报警结束时间
            createTimeEnd:null,
            modelId:null,
            modelName:null,
        },
        selectData:[],
        deptList: [],
        isFilter:false
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        var param = parent.layer.boxParams.boxParams;
        if(param != undefined && param != null){
            _this.q.processingState=param.processingState;
        }
        $.get(baseURL + "sys/dept/listAll", function (r) {
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
            $('#a').val('');
        },
        view: function (warningId) {
            $.get(baseURL + "car/carofflinewarning/info/" + warningId, function(r){
                var param = {
                    data:r.carOfflineWarning,
                };
                var index = layer.open({
                    title: "电子围栏预警",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/car/carofflinewarningview.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        // 处理警告
        alarmProcessing : function(warningId) {
            var param = {
                warningId: warningId
            };
            layer.prompt({
                formType : 2,
                title : '请输入处理原因',
                area : [ '300px', '200px' ], // 自定义文本域宽高
                btnAlign : 'c',
                yes : function(index, layero) {
                    // 获取文本框输入的值
                    var value = layero.find(".layui-layer-input").val();
                    if (value) {
                        param.processingNote = value; // 得到value
                        $.ajax({
                            type : "POST",
                            url : baseURL + "car/carwarning/alarmProcessing",
                            contentType : "application/json",
                            data : JSON.stringify(param),// {"",""}
                            success : function(r) {
                                if (r.code == 0) {
                                    alert('处理成功', function(index) {
                                        vm.reload();
                                    });
                                } else {
                                    alert(r.msg);
                                }
                            }
                        });
                        layer.close(index);
                    } else {
                        alert("请输入处理原因！");
                    }
                }
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    //车牌号
                    carNo:vm.q.carNo,
                    //归属部门
                    deptId:vm.q.deptId,
                    deptName:vm.q.deptName,
                    //车辆状态
                    businessType:vm.q.businessType,
                    //客户名称
                    customerName:vm.q.customerName,
                    //订单号
                    orderCarCode:vm.q.orderCarCode,
                    //处理状态
                    processingState:vm.q.processingState,
                    //报警开始时间
                    createTimeStart:vm.q.createTimeStart,
                    //报警结束时间
                    createTimeEnd:vm.q.createTimeEnd,
                    createTime:vm.q.createTime,
                    modelId:vm.q.modelId,

                }
            });
        },
        exports: function () {
            var url = baseURL + 'car/carofflinewarning/export?a=a';
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            if(vm.q.businessType != null){
                url += '&businessType='+vm.q.businessType;
            }
            if(vm.q.customerName != null){
                url += '&customerName='+vm.q.customerName;
            }
            if(vm.q.orderCarCode != null){
                url += '&orderCarCode='+vm.q.orderCarCode;
            }
            if(vm.q.processingState != null){
                url += '&processingState='+vm.q.processingState;
            }
           /* if(vm.q.electricName != null){
                url += '&electricName='+vm.q.electricName;
            }*/
            if(vm.q.createTimeStart != null){
                url += '&createTimeStart='+vm.q.createTimeStart;
            }
            if(vm.q.createTimeEnd != null){
                url += '&createTimeEnd='+vm.q.createTimeEnd;
            }
            if(vm.q.createTime != null){
                url += '&createTime='+vm.q.createTime;
            }
            if(vm.q.modelId != null){
                url += '&modelId='+vm.q.modelId;
            }
            window.location.href = url;

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
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        }

    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);

}



function initEventListener(layui) {
    initChecked(layui.form);
}

function initChecked(form) {
    //车辆状态
    form.on('select(businessTypeSelect)', function (data) {
        vm.q.businessType = data.value;
    });
    //处理状态
    form.on('select(processingState)', function(data) {
        vm.q.processingState = data.value;
    });

}



function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        where:{processingState:vm.q.processingState},
        url: baseURL + "car/carofflinewarning/queryList",
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field : 'carNo', minWidth : 200, title : '车牌号',align:"center",fixed: "left",templet:function (d) {
                        return isEmpty(d.carNo);
            }},
            {field : 'carBranModel', minWidth : 200, title : '品牌/车型',templet:function (d) {
                    return isEmpty(d.carBranModel);
            }},
            {field : 'businessType', minWidth : 200, title : '车辆状态',templet:function (d) {
                    //辆状态 当前状态 1整备中，2备发车，3 预定中  4.用车中 5.已过户 6.已处置 7.已出售
                     if(d.businessType==1){
                         return "整备中";
                     }else if(d.businessType==2){
                         return "备发车";
                     }else if(d.businessType==3){
                         return "预定中";
                     }else if(d.businessType==4){
                         return "用车中";
                     }
                    /* else if(d.businessType==5){
                         return "已过户";
                     }else if(d.businessType==6){
                         return "已处置";
                     }else if(d.businessType==7){
                         return "已出售";
                     }*/
                    else {
                        return  "--";
                     }
             }},
            {field : 'orderCarCode', minWidth : 200, title : '订单号',templet:function (d) {
                    return isEmpty(d.orderCarCode);
             }},
            {field : 'customerName', minWidth : 200, title : '客户名称',templet:function (d) {
                    return isEmpty(d.customerName);
             }},
            {field : 'customerTel', minWidth : 200, title : '联系电话',templet:function (d) {
                    return isEmpty(d.customerTel);
             }},
            {field : 'warningTime', minWidth : 200, title : '最后上报时间',templet:function (d) {
                    return isEmpty(d.warningTime);
             }},
            {field : 'address', minWidth : 200, title : '最后上报地址',templet:function (d) {
                    return isEmpty(d.address);
             }},
            {field : 'processingState', minWidth : 200, title : '处理状态', templet : function(d) {
                    //预警处理状态（1.已处理 2.未处理）
                    if (d.processingState == 1) {
                        return "<div><span style='color:blue'>已处理</span></div>"
                    } else if (d.processingState == 2) {
                        return "<div><span style='color:red'>未处理</span></div>";
                    } else {
                        return "--";
                    }
                }},
          /*  {field : 'warningTime', minWidth : 200, title : '失联时间',templet:function (d) {
                    return isEmpty(d.warningTime);
            }},*/
            {field : 'untreatedDays', minWidth : 200, title : '未处理天数',templet:function (d) {
                    return isEmpty(d.untreatedDays);
            }},
            {field : 'deptName', minWidth : 200, title : '所属公司',templet:function (d) {
                    return isEmpty(d.deptName);
            }}
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
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
            vm.view(data.carWarningId);
        }
    });
}


function initDate(laydate) {
    laydate.render({
        elem : '#createTimeStart',
        type:'date',
        format: 'yyyy-MM-dd',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            if(value!=null && value!=''){
                vm.q.createTime=value;
                var split = vm.q.createTime.split('/');
                vm.q.createTimeStart = split[0];
                vm.q.createTimeEnd = split[1];
            }
        }
    });
}

function alarmProcessing(id) {
    vm.alarmProcessing(id);
}
function alertInfo(info){
    alert(info)
}

