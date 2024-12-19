$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            storeName:null,
            appointmentUser: null,
            appointmentUserPhone: null,
        },
        isFilter:false,
    },
    created: function () {
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        //受理
        acceptance:function(id){
            confirm('确定受理选中的预约记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/repairappointment/acceptanceData",
                    data: "id=" + id,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        del: function (id) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "maintenance/repairappointment/delete",
                    data: "id=" + id,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        add: function(){
            var param = {
                data:{
                }
            };
            var index = layer.open({
                title: "新增门店信息",
                type: 2,
                boxParams:param,
                content: tabBaseURL + "modules/store/storeEdit.html",
                end: function(){
                    layer.closeAll();
                }
            });
            layer.full(index);
        },
        reload: function (event) {
            layui.table.reload('grid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }

});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
}


function initData() {
    //初始化查询数据字典-设备生产商

}

function initEventListener(layui) {
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('select(signStatus)', function (data) {
        vm.q.signStatus = data.value;
    });
    form.on('select(rentType)', function (data) {
        vm.q.rentType = data.value;
    });
    form.on('switch(wxIsEnableStatus)', function(obj){
        var id = $(this).attr('mid');
        var status= 0;
        obj.elem.checked?status=1:status=0;
        var params = {deptId : id, appletType : 2,wxIsEnable:status};
        console.log("azszckbxzckbjsadk:",params)
        $.ajax ({
            type: 'POST',
            url: baseURL + "sys/dept/controlStoreIsEnable",
            contentType: "application/json",
            data: JSON.stringify(params),
            loadFlag: true,
            success : function(data){
                // layer.msg("启用成功");
                vm.reload();
            },
            unSuccess: function (data) {
                layer.msg("修改失败");
            }
        })
    });
    form.on('switch(alipayIsEnableStatus)', function(obj){
        var id = $(this).attr('mid');
        var status=0;
        obj.elem.checked?status=1:status=0;
        var params = {deptId : id, appletType : 1,alipayIsEnable:status};
        console.log("alialiali:",params)
        $.ajax ({
            type: 'POST',
            url: baseURL + "sys/dept/controlStoreIsEnable",
            contentType: "application/json",
            data: JSON.stringify(params),
            loadFlag: true,
            success : function(data){
                // layer.msg("启用成功");
                vm.reload();
            },
            unSuccess: function (data) {
                layer.msg("修改失败");
            }
        })
    });
}


function initTable(table, soulTable) {
    table.render({
        id: "grid",
        elem: '#grid',
        url: baseURL + 'maintenance/repairappointment/list',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width:100, minWidth:100, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'carNo', title: '车牌号', minWidth:80, templet: function (d) {return isEmpty(d.carNo);}},
            {field:'appointmentUser', title: '预约人', minWidth:80, templet: function (d) {return isEmpty(d.appointmentUser);}},
            {field:'appointmentUserPhone', title: '预约人手机号', minWidth:80, templet: function (d) {return isEmpty(d.appointmentUserPhone);}},
            {field:'appointmentStartTime', title: '预约时间', minWidth:100, templet: function (d) {return isEmpty(d.appointmentStartTime)+"~"+isEmpty(d.appointmentEndTime) ;}},
            {field:'appointmentStatus', title: '预约受理状态', minWidth:80, templet: function (d) {
                    if(d.appointmentStatus==1){
                        return "已受理";
                    }else {
                        return "未受理";
                    }
                }},
            {field:'type', title: '预约维修类型', minWidth:80, templet: function (d) {
                    if(d.type==1){
                        return "常规保养";
                    }else if(d.type==2){
                        return "故障维修";
                    }else if(d.type==3){
                        return "事故维修";
                    }else if(d.type==4){
                        return "退车";
                    }else {
                        return "--";
                    }
                }},
            {field:'storeName', title: '维修门店', minWidth:100, templet: function (d) {return isEmpty(d.storeName);}},
            {field:'storeAddress', title: '门店地址', minWidth:180, templet: function (d) {return isEmpty(d.storeAddress);}},
            {field:'description', title: '描述', minWidth:200, templet: function (d) {return isEmpty(d.description);}},
        ]],
        page: true,
        loading: true,
        limits: [10,20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: false
        },
        done: function (res, curr, count) {
            soulTable.render(this);
        }
    });

    initTableEvent(table);
}


function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.deptId);
        }else if(layEvent === 'del'){
            vm.del(data.id);
        }else if(layEvent === 'acceptance'){
            vm.acceptance(data.id);
        }
    });


}

