var dept;
var depot;
var businessType;
$(function () {
    layui.config({
        base: "../../statics/common/cascader/layui/lay/mymodules/"
    }).use(['form',"jquery","cascader",'element','table'], function(){
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
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
            url: baseURL + 'car/tcarbasic/selectIllegalCarLst',
            where:{"illegal":vm.q.illegal},
            cols: [[
                {type: 'checkbox', fixed: 'left'},
                {field:'carNo', title: '车牌号',fixed: "left",align:"center", templet: function (d) {return isEmpty(d.carNo);}},
                {field:'modelSeriesName', title: '车辆品牌/车系/车型', templet: function (d) {return isEmpty(d.modelSeriesName);}},
                {field:'vinNo', title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
                {field:'carStatus', title: '车辆状态', templet: function (d) {return isEmpty(d.carStatus);}},
                {field:'deptName', title: '车辆归属', templet: function (d) {return isEmpty(d.deptName);}},
                {field:'depotName', title: '车辆所在仓库', templet: function (d) {return isEmpty(d.depotName);}}
            ]],
            page: true,
            loading: true,
            limits: [10, 20, 50, 200, 500],
            autoColumnWidth: {
                init: true
            },
            parseData: function(res){
                res.data.forEach(function (d) {
                    d.LAY_CHECKED = false;
                    if ($.inArray(d.carId, vm.ids) >= 0) {
                        d.LAY_CHECKED = true;
                    }
                });
                currentPageDatas = res.data;
                return res;
            }
        });
    });

    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;
        form.render();
    });

    layui.table.on('checkbox(grid)', function(obj){
        var data = obj.data;
        var type = obj.type;
        if (type == 'one'){
            itemCheckedChange(data, data.carId, obj.checked);
        } else if (type == 'all'){
            if (currentPageDatas != null && currentPageDatas.length > 0){
                currentPageDatas.forEach(function (d) {
                    itemCheckedChange(d, d.carId, obj.checked);
                });
            }
        }
    });

    $.ajax({
        type: "POST",
        url: baseURL + "car/carillegal/selectInit",
        success: function (r) {
            dept = xmSelect.render({
                el: '#dept',
                filterable: true,
                data:r.deptLst
            })

            depot = xmSelect.render({
                el: '#depot',
                filterable: true,
                data:r.depotLst
            });
        }
    });

    businessType = xmSelect.render({
        el: '#businessType',
        filterable: true,
        toolbar: {
            show: true
        },
        data: [
            {name: '整备中', value: 1},
            {name: '备发车', value: 2},
            {name: '预定中', value: 3},
            {name: '用车中', value: 4},
            {name: '已过户', value: 5},
            {name: '已处置', value: 6},
            {name: '已出售', value: 7},
        ]
    })
});

var currentPageDatas;

function itemCheckedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.carLst.push(data);
            vm.ids.push(id);
        }
    } else {
        if ($.inArray(id, vm.ids) >= 0) {
            for (var i = 0; i < vm.carLst.length; i++) {
                if (vm.carLst[i].carId == id) {
                    vm.carLst.splice(i, 1);
                    i = i - 1;
                }
            }
            for (var i = 0; i < vm.ids.length; i++) {
                if (vm.ids[i] == id) {
                    vm.ids.splice(i, 1);
                    i = i - 1;
                }
            }
        }
    }
}

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            carNo: null,
            vinNo: null,
            illegal:1,
            businessType:null,
            deptId:null,
            deptName:null,
            depotId:null,
            depotName:null,
            modelId:null,
            modelName:null
        },
        ids:[],
        carLst:[]
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        save: function(){
            if(vm.carLst.length===0){
                alert('请选择车辆！');
                return false;
            }
            parent.vm.callback(vm.carLst);
            parent.layer.closeAll();
        },
        cancel: function(){
            parent.layer.closeAll();
        },
        reset: function () {
            vm.q = {
                carNo:null,
                vinNo:null,
                illegal:1,
                businessType:null,
                deptId:null,
                deptName:null,
                depotId:null,
                depotName:null,
                modelId:null,
                modelName:null
            }
            $('#a').val('');
            dept.setValue([ ]);
            depot.setValue([ ]);
            businessType.setValue([ ]);
        },
        query: function () {
            vm.q.businessType = businessType.getValue('valueStr');
            vm.q.deptId = dept.getValue('valueStr');
            vm.q.depotId = depot.getValue('valueStr');
            vm.reload();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    carNo: vm.q.carNo,
                    vinNo: vm.q.vinNo,
                    illegal: 1,
                    businessType:vm.q.businessType,
                    deptId:vm.q.deptId,
                    depotId:vm.q.depotId,
                    modelId:vm.q.modelId
                }
            });
        }
    }
});

