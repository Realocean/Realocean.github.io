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
            //电子围栏名称
            electricName: null,
            //车辆所属公司
            deptId:null,
            //车牌号
            carNo:null,
            //围栏状态
            isAvailable: null,
            //报警类型
            warningType: null,
            //创建开始时间
            createTimeStart:null,
            //创建结束时间
            createTimeEnd:null,
            createTime:null,

            deptId:null,
            deptName:null,
        },
        deptList: [],
        isFilter: false,
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        $.get(baseURL + "sys/dept/listAll", function (r) {
            _this.deptList = r.deptList;
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (id) {
            $.get(baseURL + "car/electricfence/info/"+id, function(r){
                var param = {
                    data:r.electricFence,
                    list:r.list
                }
                var index = layer.open({
                    title: "查看",
                    boxParams: param,
                    type: 2,content: tabBaseURL + "modules/car/electricfenceview.html",
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
                    deptId: '',
                    provinceCode: '',
                    cityCode: '',
                    areaCode: '',
                    polygonPoints: '',
                    electricType: 1,
                 // warningType: 2,
                },
                tag: 'add'
            };
            var index = layer.open({
                title: "新增",
                type: 2,
                boxParams: param,
                content: tabBaseURL + "modules/car/electricfenceedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (id) {
            $.get(baseURL + "car/electricfence/info/"+id, function(r){
                var param = {
                    data:r,
                    tag: 'update'
                };
                var index = layer.open({
                    title: "修改",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/car/electricfenceedit.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                layer.full(index);
            });
        },
        del: function (id) {
            var  info="<div style='width: 400px;height:50px'><span style='margin-left: 25%;'>确定要删除该电子围栏？<span><br/><span style=\"margin-left: 80px;\">删除成功之后，将无法恢复</span></div>";
            confirm(info, function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/electricfence/delete/"+id,
                    contentType: "application/json",
                //  data: JSON.stringify(ids),
                    data: {},
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
            var url = baseURL + 'car/electricfence/export?a=a';
            if(vm.q.electricName != null){
                url += '&electricName='+vm.q.electricName;
            }
            if(vm.q.deptId != null){
                url += '&deptId='+vm.q.deptId;
            }
            if(vm.q.carNo != null){
                url += '&carNo='+vm.q.carNo;
            }
            if(vm.q.isAvailable != null){
                url += '&isAvailable='+vm.q.isAvailable;
            }
            if(vm.q.warningType != null){
                url += '&warningType='+vm.q.warningType;
            }
            if(vm.q.createTimeStart != null){
                url += '&createTimeStart='+vm.q.createTimeStart;
            }
            if(vm.q.createTimeEnd != null){
                url += '&createTimeEnd='+vm.q.createTimeEnd;
            }
            if(vm.q.createTime != null){
                url += '&createTime='+vm.q.createTime;
            }

            window.location.href = url;

        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    electricName: vm.q.electricName,
                    isAvailable: vm.q.isAvailable,
                    warningType: vm.q.warningType,
                    deptId: vm.q.deptId,
                    carNo:vm.q.carNo,
                    createTimeStart:vm.q.createTimeStart,
                    createTimeEnd :vm.q.createTimeEnd,
                    createTime:vm.q.createTime
                }
            });
        },
        //绑定车辆
        bindingCar :function(data){
            //围栏id
            localStorage.setItem("electricId",data.electricId);
            localStorage.setItem("id",data.id);
            //围栏所属部门
            localStorage.setItem("deptId",data.deptId);
            //围栏名称
            localStorage.setItem("electricName",data.electricName);
            layer.open({
                type: 2,
                title:'绑定车辆',
                area: ['80%', '80%'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL +'modules/car/bindingCar.html',
                success: function(layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    layui.form.render();
                }
            });
        },
        //停用启用
        available: function (id, type) {
            var param = {"id": id, "isAvailable": type};
            var info='';
            var alertinfo='';
            if (type == 1) {
                info="确定要启用该电子围栏？";
                alertinfo='启用成功';
            } else {
                info="<div><span style='margin-left: 25%;'>确定要禁用该电子围栏？<span><br/><span>禁用之后，该电子围栏下面的车辆将不会产生预警</span></div>";
                alertinfo='停用成功';
            }
            confirm(info, function(){
                PageLoading();
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/electricfence/available",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function (r) {
                        RemoveLoading();
                        if (r.code == 0) {
                            alert(alertinfo);
                            vm.reload();
                        } else {
                            alert(r.msg);
                        }
                    }
                });
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
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(deptSelect)', function (data) {
        vm.q.deptId = data.value;
    });

    form.on('select(isAvailable)', function (data) {
        vm.q.isAvailable = data.value;
    });
    form.on('select(warningType)', function (data) {
        vm.q.warningType = data.value;
    });
}

function initClick() {

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
      //toolbar: true,
     //defaultToolbar: ['filter'],
        url: baseURL + 'car/electricfence/queryList',
        cols: [[
            {title: '操作', width:300, templet:'#barTpl',fixed:"left",align:"center"},
            {field: 'electricName', minWidth: 150, title: '电子围栏名称'},
            {field: 'deptName', minWidth: 250, title: '目标车辆所属公司'},
            {field: 'warningType', minWidth: 200, title: '围栏报警类型', templet: function (d) {
                    if(d.warningType!=null){
                        if(d.warningType==1){
                            return "驶入报警"
                        }else if(d.warningType==2){
                            return "驶出报警";
                        }else{
                            return "--";
                        }
                    }else{
                        return "--";
                    }
                }},
            {field: 'provinceName', minWidth: 200, title: '围栏范围',templet: function (d) {
                    if(d.provinceName!=null&&d.provinceName!=''){
                        if(d.cityName!=null&&d.cityName!=''){
                            if(d.areaName!=null&&d.areaName!=''){
                                return d.provinceName+''+d.cityName+''+d.areaName;
                            }else{
                                return d.provinceName+''+d.cityName;
                            }
                        }else{
                            return d.provinceName;
                        }
                    }else{
                        return "--";
                    }
                }},
            {
                field: 'isAvailable', minWidth: 100, title: '启用状态', templet: function (d) {
                    if (d.isAvailable == 1) {
                        return "启用";
                    } else if (d.isAvailable == 0) {
                        return "禁用";
                    } else {
                        return "—";
                    }
                }
            },
            {field: 'createTime', minWidth: 200, title: '创建时间', templet: "<div>{{new Date(d.createTime).format(\"yyyy-MM-dd hh:mm:ss\")}}</div>"},


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
        if (layEvent === 'edit') {
            vm.update(data.id);
        } else if (layEvent === 'del') {
       /*  var electricId = [data.id];
            vm.del(electricId); */
            vm.del(data.id);
        } else if (layEvent === 'view') {
            vm.view(data.id);
        }else if (layEvent === 'available') {
            //可用状态(0 未启用 1 已启用)
            vm.available(data.id,0);
        }else if (layEvent === 'isAvailable') {
            vm.available(data.id,1);
        }else if (layEvent === 'bindingCar') {
            vm.bindingCar(data);
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


/*    laydate.render({
        elem: '#createTimeStart',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.createTimeStart = value;
        }
    });
    laydate.render({
        elem: '#createTimeEnd',
        format: 'yyyy-MM-dd',
        trigger: 'click',
        done: function (value, date, endDate) {
            if(vm.q.createTimeStart==null){
                vm.q.createTimeEnd = value;
            }
            if(vm.q.createTimeStart!=null && value !=null && value!=''){
                if(vm.q.createTimeStart>value){
                    alert("开始时间不能大于结束时间,请重新选择");
                    return;
                }else{
                    vm.q.createTimeEnd = value;
                }
            }
        }
    });*/
}

function reloadData(dataType, type) {
    if (type != null && type != '') {
        if (type == '-1') {//全部
            vm.q = Object.assign({}, {isUse: ""});
        } else if (type == '0' || type == '1') {
            vm.q.isAvailable = type;
        }
        if (dataType == 1) {
            vm.reload();
        }
    }
}
