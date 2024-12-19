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
var searchView;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            brandId: '',
            seriesId: '',
            modelId: '',
            hasDepotNum: true
        },
        brandLst: [],
        seriesLst: [],
        modelLst: [],
        carModelLst: [],
        ids: [],
        selectCarModelLst: [],
        count:0,
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        if (param) {
            callback = param.callback;
        }
        _this.brandLst = getBrandLst();
        _this.seriesLst = getSeriesLst();
        _this.modelLst = getModelLst();
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
            vm.seriesLst = getSeriesLst();
            vm.modelLst = getModelLst();
        },
        saveOrUpdate: function () {
            if (callback) callback(vm.selectCarModelLst);
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
    searchView = Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'select', label: '品牌', fieldName: 'brandId', selectListValueName: 'id', selectListTxtName: 'brandName', selectList: vm.brandLst},
            {type: 'select', label: '车系', fieldName: 'seriesId', selectListValueName: 'id', selectListTxtName: 'seriesName', selectList: vm.seriesLst},
            {type: 'select', label: '车型', fieldName: 'modelId', selectListValueName: 'id', selectListTxtName: 'modelName', selectList: vm.modelLst},
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
                case 'onChange.select.brandId':{
                    vm.q.seriesId = '';
                    vm.q.modelId = '';
                    vm.seriesLst = getSeriesLst();
                    vm.modelLst = getModelLst();
                    searchView.reSetSelectData('select', 'seriesId', {type:'list', data:vm.seriesLst, selectListValueName: 'id', selectListTxtName: 'seriesName'});
                    searchView.reSetSelectData('select', 'modelId', {type:'list', data:vm.modelLst, selectListValueName: 'id', selectListTxtName: 'modelName'});
                    break;
                }
                case 'onChange.select.seriesId':{
                    vm.q.modelId = '';
                    vm.modelLst = getModelLst();
                    searchView.reSetSelectData('select', 'modelId', {type:'list', data:vm.modelLst, selectListValueName: 'id', selectListTxtName: 'modelName'});
                    break;
                }
            }
        }
    });
    searchView.initView();
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
        if (vm.carModelLst != null && vm.carModelLst.length > 0){
            vm.carModelLst.forEach(function (d) {
                checkedChange(d, d.modelId, checked);
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
        var obj = vm.carModelLst.filter(function (d) {
            return d.modelId == id;
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
        url: baseURL + 'contract/contracbusiness/carModelList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {
                templet: "#checkbd",
                title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                width: 60,
                fixed: "left",
                align:"center"
            },
            {field:'brandName', title: '品牌', minWidth:200, templet: function (d) {return isEmpty(d.brandName);}},
            {field:'seriesName', title: '车系', minWidth:200, templet: function (d) {return isEmpty(d.seriesName);}},
            {field:'modelName', title: '车型', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
            {field:'inDepotNum', title: '库存数量', minWidth:200, templet: function (d) {return isEmpty(d.inDepotNum);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
        parseData: function(res){
            res.data.forEach(function (d) {
                d.LAY_CHECKED = false;
                if ($.inArray(d.modelId, vm.ids) >= 0) {
                    d.LAY_CHECKED = true;
                }
            });

            vm.carModelLst = res.data;
            checkAllStatusChange();
            return res;
        },
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
    var count =  vm.carModelLst.length;
    vm.carModelLst.forEach(function (d) {
        if ($.inArray(d.modelId, vm.ids) >= 0){
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count==0 && vm.carModelLst.length != 0);
}

function checkedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.ids) < 0){
            vm.ids.push(id);
            vm.selectCarModelLst.push(data);
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
            for (var i = 0; i < vm.selectCarModelLst.length; i++) {
                if (vm.selectCarModelLst[i].modelId == id) {
                    vm.selectCarModelLst.splice(i, 1);
                    i = i - 1;
                }
            }
            vm.count = vm.ids.length;
        }
    }
}

function getBrandLst() {
    var datas;
    var param = {};
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/brandLst',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(param),
        success: function (r) {
            datas = r.brandLst;
        }
    });
    return datas;
}
function getSeriesLst() {
    var datas;
    var param = {};
    if (vm != null && vm.q != null){
        param.brandId = vm.q.brandId;
    }
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/seriesLst',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(param),
        success: function (r) {
            datas = r.seriesLst;
        }
    });
    return datas;
}
function getModelLst() {
    var datas;
    var param = {};
    if (vm != null && vm.q != null){
        param.brandId = vm.q.brandId;
        param.seriesId = vm.q.seriesId;
    }
    $.ajax({
        type: "POST",
        url: baseURL + 'order/order/modelLst',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(param),
        success: function (r) {
            datas = r.modelLst;
        }
    });
    return datas;
}