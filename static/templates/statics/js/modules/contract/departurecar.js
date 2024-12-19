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

var callback;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            carNo: null,
            vinNo: null,
            deptId: '',
            brandId: '',
            seriesId: '',
            modelId: '',
            filterCarIds: ''
        },
        carLst: [],
        ids: [],
        selectCarLst: [],
        count:0,
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            _this.q.brandId = param.brandId;
            _this.q.seriesId = param.seriesId;
            _this.q.modelId = param.modelId;
            _this.q.filterCarIds = param.carIds.join(',');
            callback = param.callback;
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q.carNo = null;
            vm.q.vinNo = null;
        },
        saveOrUpdate: function () {
            if (callback) callback(vm.selectCarLst);
            closePage();
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});

function init(layui) {
    initSearch();
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initSearch() {
    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'text', label: '车牌号', placeholder: '请输入车牌号', fieldName: 'carNo'},
            {type: 'text', label: '车架号', placeholder: '请输入车架号', fieldName: 'vinNo'},
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
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        if (vm.carLst != null && vm.carLst.length > 0){
            vm.carLst.forEach(function (d) {
                checkedChange(d, d.carId, checked);
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
        var obj = vm.carLst.filter(function (d) {
            return d.carId == id;
        })[0];
        checkedChange(obj, id, checked);
        checkAllStatusChange();
        layui.form.render();
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function initTable(table, soulTable) {
    layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'car/tcarbasic/selectOrderCarLst',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {
                templet: "#checkbd",
                title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                width: 60,
                fixed: "left",
                align: "center"
            },
            {field:'carNo', title: '车牌号',align:"center", templet: function (d) {return isEmpty(d.carNo);}},
            {field:'modelSeriesName', title: '车辆品牌/车系/车型', templet: function (d) {return isEmpty(d.modelSeriesName);}},
            {field:'vinNo', title: '车架号', templet: function (d) {return isEmpty(d.vinNo);}},
            {field:'carStatus', title: '车辆状态', templet: function (d) {return isEmpty(d.carStatus);}},
            {field:'insurance', title: '保险'},
            {field:'insuranceItems', title: '商业险险种', templet: function (d) {return isEmpty(d.insuranceItems);}},
            {field:'annualSurvey', title: '年检'},
            {field:'mileage', title: '当前里程/km', templet: function (d) {return isEmpty(d.mileage);}},
            {field:'electricQuantity', title: '车辆所属仓库', templet: function (d) {return isEmpty(d.depotName);}},
            {field:'accessoryItemsName', title: '随车物品' ,templet: function (d) {return isEmpty(d.accessoryItemsName)}},
            {field:'deptName', title: '所属公司', templet: function (d) {return isEmpty(d.deptName);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
        parseData: function(res){
            res.data.forEach(function (d) {
                d.LAY_CHECKED = false;
                if ($.inArray(d.carId, vm.ids) >= 0) {
                    d.LAY_CHECKED = true;
                }
            });

            vm.carLst = res.data;
            checkAllStatusChange();
            return res;
        },
        autoColumnWidth: {
            init: true
        },
        done: function(res, curr, count){
            layui.soulTable.render(this);
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

}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}

function checkAllStatusChange() {
    var count =  vm.carLst.length;
    vm.carLst.forEach(function (d) {
        if ($.inArray(d.carId, vm.ids) >= 0){
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count==0 && vm.carLst.length != 0);
}

function checkedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.ids.push(id);
            vm.selectCarLst.push(data);
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
            for (var i = 0; i < vm.selectCarLst.length; i++) {
                if (vm.selectCarLst[i].carId == id) {
                    vm.selectCarLst.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.count = vm.ids.length;
        }
    }
}