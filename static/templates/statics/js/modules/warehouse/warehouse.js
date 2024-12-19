$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });

    layui.use(['form','element', 'table', 'soulTable'], function () {
        var soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'warehouse/warehouse/list',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            cols: [[
                {title: '操作', width:150, templet:'#barTpl',fixed: "left",align:"center"},
                {field:'warehouseName', minWidth:200, title: '仓库名称',align:"center"},
                {field:'warehouseStatus', minWidth:200, align:"center",title: '状态',templet:function (d) {
                        if(d.warehouseStatus==1){
                            return "启用";
                        }else if(d.warehouseStatus==0){
                            return "停用";
                        }else {
                            return "--";
                        }
                    }},
                {field:'deptName', minWidth:350,align:"center", title: '关联公司/部门',templet:function (d) {
                        if(d.deptName!=null && d.deptName!=""){
                            return  d.deptName;
                        }else {
                            return "--";
                        }
                    }},
                {field:'remarks', minWidth:200,align:"center", title: '备注', templet:function (d) {
                        return isEmpty(d.remarks);
                    }},
                {field:'carNum', minWidth:200,align:"center", title: '在库车辆总数/台',templet:function (d) {
                           if(d.carNum !=null && parseInt(d.carNum) >0){
                               return "<span style='color:#419BEA;cursor:pointer;' onclick=vm.jumptocarList(\'"+d.warehouseId+"\')>"+parseInt(d.carNum)+"</span>";
                           }else{
                               return  parseInt(d.carNum);
                           }


                    }},
                {field:'outWarehouse', minWidth:200, align:"center",title: '出库车辆总数/台',templet:function (d) {
                        return  parseInt(d.outWarehouse);
                    }},
                {field:'inWarehouse', minWidth:200,align:"center", title: '入库车辆总数/台',templet:function (d) {
                        return  parseInt(d.inWarehouse);
                    }}
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100, 200],
            limit: 10,
            autoColumnWidth: {
                init: false
            },
            done: function (res) {
                soulTable.render(this);
                $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
                $(".layui-table-main tr").each(function (index, val) {
                    $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                    $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
                });
            },
        });

    })


    layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
            vm.stopType=1;
            vm.getTransferReason();
            form.verify({
            warehouseNameVerify: function(value){
                if(value=="" ||value==null){
                    return '仓库名称不能为空';
                }
            }
        });

        form.render();
    });

    //仓库状态事件监听
    layui.form.on('select(warehouseStatus)', function (data) {
        vm.warehouse.warehouseStatus = data.value;
    });

    layui.form.on('select(transferType)', function (data) {
        vm.q.transferType = data.value;
    });

    layui.form.on('select(transferReasonSerch)', function (data) {
        vm.q.transferReason = data.value;
    });


    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });


    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.warehouseId);
        }else if(layEvent === 'del'){
            var warehouseId = [data.warehouseId];
            vm.del(warehouseId);
        }else if(layEvent === 'start'){
            vm.start(data.warehouseId);
        }else if(layEvent === 'stop'){
            vm.stop(data.warehouseId);
        }else if(layEvent === 'delete'){
            vm.delete(data.warehouseId);
        }
    });

    laydate.render({
        elem: '#transferTime',
        format: 'yyyy-MM-dd',
        type: 'date',
        range: '/',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.q.transferTimeStr = value;
        }
    });


});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{

            deptId:null,
            deptName:null,
            warehouseName: null,
            warehouseId:null,

            warehouseNameRecord:null,
            warehouseIdRecord:null,
            carPlate:null,
            transferType:null,
            transferReason:null,
            transferTimeStr:null,
            remarks:null,



        },
        showForm: false,
        editForm: false,
        warehouse: {},
        stopType:1,
        detailsTabContentList: ['仓库列表', '出入库记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '仓库列表',
        transferReasonList:[],
        warehouseList:[],
        isFilter:false,
        isFilterRecord:false,
    },
updated: function(){
    layui.form.render();
},
computed:{
    warehouseStatusStr:{
            get:function() {  //1启用,0停用
                if(this.warehouse.warehouseStatus==0) {
                    return "停用";
                } else if(this.warehouse.warehouseStatus==1) {
                    return "启用";
                }else{
                    return "--";
                }
            }
        }
    },
methods: {
    selectedRows: function () {
        var list = layui.table.checkStatus('gridid').data;
        if(list.length == 0){
            alert("请选择一条记录");
            return ;
        }

        var warehouseIds = [];
        $.each(list, function(index, item) {
                warehouseIds.push(item.warehouseId);
        });
        return warehouseIds;
    },
    query: function () {
        vm.reload();
    },
    cancel: function(){
        layer.closeAll();
    },
    reset:function(){
        vm.q.warehouseName=null;
        vm.q.deptId=null;
        vm.q.deptName=null;
        vm.q.remarks=null;
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
    /*zTreeClickTwo: function(event, treeId, treeNode){
        Vue.set(vm.tCarBasic,"intoDeptId",treeNode.deptId);
        Vue.set(vm.tCarBasic,"intoDeptName",treeNode.name);
        layer.closeAll();
    },*/
    zTreeClick: function(event, treeId, treeNode){
        Vue.set(vm.q,"deptId",treeNode.deptId);
        Vue.set(vm.q,"deptName",treeNode.name);
        layer.closeAll();
    },
    add: function(){
        vm.warehouse = {};
        //初始化默认设置仓库状态为启用状态
        vm.warehouse.warehouseStatus=1;
        var index = layer.open({
            title: "新增仓库",
            type: 1,
            area: ['50%', '60%'],
            content: $("#editForm"),
            end: function(){
                vm.editForm = false;
                layer.closeAll();
            }
        });
        vm.editForm = true;
        // layer.full(index);
    },
    update: function (warehouseId) {
        $.ajax({
            type: "POST",
            url:baseURL + "warehouse/warehouse/info/"+warehouseId,
            contentType: "application/json",
            data:{},
            success: function(r){
                vm.warehouse = r.warehouse;
            }
        });
        var index = layer.open({
            title: "编辑仓库",
            type: 1,
            area: ['50%', '60%'],
            content: $("#editForm"),
            end: function(){
                vm.editForm = false;
                layer.closeAll();
            }
        });
        vm.editForm = true;
        // layer.full(index);
    },
    start:function(warehouseId){
        confirm('确定启用该仓库？', function(){
            $.ajax({
                type: "POST",
                url:baseURL + "warehouse/warehouse/start/"+warehouseId,
                contentType: "application/json",
                data: JSON.stringify(vm.warehouse),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            layer.closeAll();
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        });
    },
    stop:function(warehouseId){
        var  tCarBasicList;
        var  warehouseDeptList;
        confirm('确认禁用该仓库？', function(){
            //停用前先判断是否有车辆在使用
            $.ajax({
                type: "POST",
                url:baseURL + "warehouse/warehouse/checkCarAndDeptUsed/"+warehouseId,
                contentType: "application/json",
                async: false,
                data: {},
                success: function(r){
                    if(r.code === 0){
                       tCarBasicList= r.map.tCarBasicList;
                       warehouseDeptList= r.map.warehouseDeptList;
                       if(tCarBasicList.length>0){
                           alert("该仓库有车辆使用中不能停用");
                           return;
                       }
                       if(warehouseDeptList.length>0){
                           confirm('该仓库与门店有关联确认停用吗？', function(){
                               $.ajax({
                                   type: "POST",
                                   url:baseURL + "warehouse/warehouse/stop/"+warehouseId,
                                   contentType: "application/json",
                                   data:{},
                                   success: function(r){
                                       if(r.code === 0){
                                           alert('操作成功', function(index){
                                               layer.closeAll();
                                               vm.reload();
                                           });
                                       }else{
                                           return;
                                       }
                                   }
                               });
                           });
                       }
                    }
                }
            });

            if(tCarBasicList.length<=0 && warehouseDeptList.length<=0){
                $.ajax({
                    type: "POST",
                    url:baseURL + "warehouse/warehouse/stop/"+warehouseId,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                layer.closeAll();
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            }
        });
    },
    del: function (warehouseIds) {
        confirm('确定要删除选中的记录？', function(){
            $.ajax({
                type: "POST",
                url: baseURL + "warehouse/warehouse/delete",
                contentType: "application/json",
                data: JSON.stringify(warehouseIds),
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
    delete:function (warehouseId){
        confirm('确定要删除此车辆仓库吗？', function(){
            $.ajax({
                type: "POST",
                url: baseURL + "warehouse/warehouse/delete?warehouseId="+warehouseId,
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
    saveOrUpdate: function (event) {
        var url = vm.warehouse.warehouseId == null ? "warehouse/warehouse/save" : "warehouse/warehouse/update";
        //保存之前进行唯一性验证
        var warehouseName=vm.warehouse.warehouseName;
        $.ajax({
            type: "POST",
            url:baseURL + "warehouse/warehouse/getWarehouseEntityList/"+warehouseName,
            contentType: "application/json",
            data:{},
            success: function(r){
                var  warehouseList=r.warehouseList;
                if(warehouseList.length>0){
                    if(vm.warehouse.warehouseId != null){
                        if(warehouseList.length > 1){
                            alert("当前仓库名已存在!");
                            return;
                        }
                        var warehouse=warehouseList[0];
                        if(warehouse.warehouseId != vm.warehouse.warehouseId){
                            alert("当前仓库名已存在!");
                            return;
                        }
                    }else{
                        alert("当前仓库名已存在!");
                        return;
                    }
                }
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.warehouse),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                layer.closeAll();
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });

            }
        });
    },
    //查询当前仓库下的所有车
    showCarList:function(warehouseId,pageType){
        //设置跳转类型
        localStorage.setItem("pageType",pageType);
        //设置仓库id
        localStorage.setItem("warehouseId",warehouseId);

        var index = layer.open({
            title: "车辆列表",
            type: 2,
            area: ['100%', '100%'],
            content: tabBaseURL + "modules/car/tcarbasic.html",
            end: function () {
                $(".layui-laypage-btn")[0].click();
                layer.close(index);

            }
        });
    },
    exports: function () {
        var url = baseURL + 'warehouse/warehouse/export?a=a';
        if(vm.q.warehouseName != null){
            url += '&warehouseName='+vm.q.warehouseName;
        }
        if(vm.q.deptId != null){
            url += '&deptId='+vm.q.deptId;
        }
        if(vm.q.remarks != null){
            url += '&remarks='+vm.q.remarks;
        }
        window.location.href = url;
    },

    reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: {
                warehouseName: vm.q.warehouseName,
                deptId: vm.q.deptId,
                remarks: vm.q.remarks,
            }
        });
    },
    detailsTabContentBindtap:function(param) {
        this.detailsTabContentListActiveIndex = param;
        if (param === 1) {
            this.detailsSupTabContentListActiveValue = '出入库记录';
        } else if (param === 0) {
            this.detailsSupTabContentListActiveIndex = 0;
            this.detailsSupTabContentListActiveValue = '仓库列表';
        }
    },
    //移库原因查询方法
    getTransferReason:function(){
        var type="TRANSFER_REASON";
        $.ajax({
            type: "POST",
            url: baseURL + 'sys/dict/getInfoByType/'+type,
            contentType: "application/json",
            async:false,
            data:{},
            success: function(r){
                if(r.code === 0){
                    vm.transferReasonList=[];
                    vm.transferReasonList=r.dict;
                    /*if(r.dict != null){
                        r.dict.forEach(function (item, index) {
                            if(item.code != 1 && item.code != 6  && item.code != 7){
                                vm.transferReasonList.push(item);
                            }
                        });
                    }*/
                }else{
                    alert(r.msg);
                }
            }
        });
    },
    selectwarehouse:function () {
        var index = layer.open({
            title: "仓库选择",
            type: 2,
            area: ['60%', '60%'],
            content: tabBaseURL + "modules/warehouse/selectwarehouse.html",
            end: function(){
                vm.q = Object.assign({}, vm.q,{
                    warehouseIdRecord:vm.warehouseData.warehouseId,
                    warehouseNameRecord:vm.warehouseData.warehouseName,
                });
            }
        });
        layer.full(index);
    },

    recordQuery:function(){
        vm.recordReload();
    },
    recordReset:function(){
        vm.q.carPlate=null;
        vm.q.transferType=null;
        vm.q.transferReason=null;
        vm.q.warehouseNameRecord=null;
        vm.q.warehouseIdRecord=null;
        vm.q.transferTimeStr=null;

    },
    recordReload:function(){
        layui.table.reload('recordGrid', {
            page: {
                curr: 1
            },
            where: {
                carPlate:vm.q.carPlate,
                transferType:vm.q.transferType,
                transferReason:vm.q.transferReason,
                warehouseName:vm.q.warehouseNameRecord,
                warehouseId:vm.q.warehouseIdRecord,
                transferTimeStr:vm.q.transferTimeStr,

            }
        });
    },
    check:function(data){
        var index = layer.open({
            title: "车辆管理 > 仓库列表> 车辆出入库信息",
            type: 2,
            content: tabBaseURL+'modules/warehouse/inoutrecordsDetail.html',
            success: function(layero,num){
                var iframe = window['layui-layer-iframe'+num];
                iframe.vm.initData(data);
            },
            end: function(){
                layer.close(index);
            }
        });

        layer.full(index);

    },
    //出入库记录导出
    exportInOutRecord:function () {

    },
   jumptocarList:function(warehouseId){
        window.localStorage.setItem("warehouseId",warehouseId);
        window.localStorage.setItem("type","0");
        var index = layer.open({
            title: "车辆列表",
            type: 2,
            area: ['100%', '100%'],
            content: tabBaseURL + "modules/car/tcarbasic.html",
            end: function(){
                layer.close(index);
                window.localStorage.setItem("warehouseId",null);
            }

        });
    },
    // 高级筛选
    bindFilter:function(){
        this.isFilter = !this.isFilter;
    },
    bindFilterRecord:function(){
        this.isFilterRecord = !this.isFilterRecord;
    },


}
});