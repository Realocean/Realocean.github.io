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
    data: {
        isFilter: false,
        deviceType:[],
        q: {
            deviceNo: null,
            manufacturerNumber: null,
            cardType:0,
            deviceTypeNo: null,
            carPlateNo:null
        },
        gpsEquipmentSupplier: [],
        deviceTypeNoList: [],
        isClose: true,
        type: null,
    },
    created: function(){
        this.getDeviceList()
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        changeStatus(item) {
            vm.q.cardType = item.cardType;
            vm.query();
        },
        getDeviceList(){
            $.ajax({
                type: "GET",
                url: baseURL + "deviceinformation/deviceinformation/cardStatistics",
                success: function (r) {
                    if (r.code == 0) {
                       vm.deviceType = r.data
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
         // 高级筛选
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }

            var deviceIds = [];
            $.each(list, function(index, item) {
                deviceIds.push(item.deviceId);
            });
            return deviceIds;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            resetNULL(vm.q);
        },
        view: function (deviceId) {
            $.get(baseURL + "deviceinformation/deviceinformation/info/"+deviceId, function(r){
                var param = {
                    data:r.deviceInformation
                };
                var index = layer.open({
                    title: "查看",
                    type: 2,
                    boxParams: param,
                    content: tabBaseURL + "modules/deviceinformation/deviceinformationview.html",
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
                content: tabBaseURL + "modules/deviceinformation/deviceinformationedit.html",
                end: function () {
                    layer.close(index);
                }
            });
            layer.full(index);
        },
        update: function (deviceId) {
            //判断当前设备是否在使用中
            $.ajax({
                type: "POST",
                url: baseURL + 'deviceinformation/deviceinformation/checkDeviceExist/'+deviceId ,
                contentType: "application/json",
                data: {},
                success: function(r){
                    var gpsBindFlag=r.gpsBindFlag;
                    if(!gpsBindFlag){
                        alert("当前设备正在使用中，不允许编辑");
                        return;
                    }else {
                        $.get(baseURL + "deviceinformation/deviceinformation/info/"+deviceId, function(r){
                            var param = {
                                data: r.deviceInformation,
                                code: r.code,
                            };
                            var index = layer.open({
                                title: "修改",
                                type: 2,
                                boxParams: param,
                                content: tabBaseURL + "modules/deviceinformation/deviceinformationedit.html",
                                end: function () {
                                    layer.close(index);
                                }
                            });
                            layer.full(index);
                        });
                    }
                }
            });



        },
        del: function (deviceId) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "deviceinformation/deviceinformation/delete/"+deviceId,
                    contentType: "application/json",
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
            window.location.href = urlParamByObj(baseURL + 'deviceinformation/deviceinformation/export', vm.q);
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
                    form[0].action = baseURL + 'deviceinformation/deviceinformation/downxlserr';
                    form.submit();
                }
                layer.close(index);
                vm.reload();
            }, function () {
                layer.close(index);
                vm.reload();
            });
        },


        importDevice: function () {
            var url = tabBaseURL + "modules/utils/imptemplet.html";
            var title = "设备信息导入";
            var param = {
                typeStr:'设备信息',
                templetUrl:'importData/sbgl/sbxydy.xlsx',
                actionUrl:'deviceinformation/deviceinformation/imports',
                beanName:'io.xz.modules.deviceinformation.excel.DeviceInformationBean'
            };
            addTab(url, title, param);
        },

        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        },
        //绑定车辆
        bundlingCar(data){
            //弹出页面进行车辆选择
            var index = layer.open({
                type: 2,
                title: '绑定车辆',
                boxParams: data,
                content: tabBaseURL + 'modules/deviceinformation/selectgpsdevice.html',
                end: function () {
                    layer.close(index);
                    vm.reload()
                },
            });
            layer.full(index);
        },

        //解绑车辆
        unbundlingCar(carGpsId){
            confirm('车辆解绑后，基于设备创建的电子围栏将同步清除，是否确认要解除绑定？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "car/gps/unbundlingCar/"+carGpsId,
                    contentType: "application/json",
                    data:{},
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
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
}






function initData() {
    //初始化查询数据字典-设备生产商
    $.ajax({
        type: "POST",
        url: baseURL + "sys/dict/getInfoByType/"+"gpsEquipmentSupplier",
        contentType: "application/json",
        data:null,
        success: function(r){
            vm.gpsEquipmentSupplier = r.dict;
        }
    });
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    //设备生产商
    form.on('select(manufacturerNumber)', function (data) {
        vm.q.manufacturerNumber = data.value
        if (data.value != null) {
            $.ajax({
                type: "POST",
                url: baseURL + "web/devicemanagement/getDeviceType?manufacturerNumber=" + data.value,
                data: null,
                success: function (r) {
                    vm.deviceTypeNoList = r.entity;
                }
            });
        }

    });
    form.on('select(deviceTypeNo)', function (data) {
        vm.q.deviceTypeNo = data.value;
    });

}

function initClick() {
    $(".delBatch").click(function(){
        var deviceIds = vm.selectedRows();
        if(deviceIds == null){
            return;
        }
        vm.del(deviceIds);
    });

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'deviceinformation/deviceinformation/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {title: '操作', width: 200, templet: '#barTpl', fixed: "left", align: "center"},
            {
                field: 'deviceNo', title: '设备编号', align:"center",minWidth: 200, templet: function (d) {
                    return isEmpty(d.deviceNo);
                }
            },
            {
                field: 'equipmentSupplierName',align:"center", title: '设备供应商名称', minWidth: 120, templet: function (d) {
                    return isEmpty(d.equipmentSupplierName);
                }
            },
            {
                field: 'simCard', title: 'SIM卡号', align:"center",minWidth: 120, templet: function (d) {
                    return isEmpty(d.simCard);
                }
            },
            {
                field: 'carPlateNo', title: '车牌号', align:"center",minWidth: 120, templet: function (d) {
                    return isEmpty(d.carPlateNo);
                }
            },
            {
                field: 'deviceTypeNo', title: '设备型号',align:"center", minWidth: 120, templet: function (d) {
                    return isEmpty(d.deviceTypeNo);
                }
            },
            {
                field: 'deviceKindStr', title: '设备类型',align:"center", minWidth: 120, templet: function (d) {
                    return isEmpty(d.deviceKindStr);
                }
            },
            {
                field: 'buyingTime', title: '购买时间',align:"center", minWidth: 180, templet: function (d) {
                    return isEmpty(d.buyingTime);
                }
            },
            {
                field: 'deviceExpirationTime', title: '设备到期时间',align:"center", minWidth: 180, templet: function (d) {
                    return isEmpty(d.deviceExpirationTime);
                }
            },
            {
                field: 'simExpirationTime', title: 'SIM到期时间',align:"center", minWidth: 180, templet: function (d) {
                    return isEmpty(d.simExpirationTime);
                }
            },
            {
                field: 'createTime', title: '创建时间',align:"center", minWidth: 180, templet: function (d) {
                    return isEmpty(d.createTime);
                }
            },
            {
                field: 'updateTime', title: '修改时间',align:"center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.updateTime);
                }
            },
            {
                field: 'creator', title: '操作人',align:"center", minWidth: 200, templet: function (d) {
                    return isEmpty(d.creator);
                }
            },
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

}


function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.deviceId);
        } else if(layEvent === 'del'){
            vm.del(data.deviceId);
        } else if(layEvent === 'view'){
            vm.view(data.deviceId);
        }else if(layEvent === 'bundlingCar'){
            vm.bundlingCar(data);
        }else if(layEvent === 'unbundlingCar'){
            vm.unbundlingCar(data.carGpsId);
        }
    });
}


