$(function () {
    layui.use(['form', 'layedit', 'laydate'], function () {
        layui.form.render();
    });
    gridTable = layui.table.render({
        id: "gridid",
        elem: '#grid',
        url: baseURL + 'car/carsurviel/carPageList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: [[
            {
                templet: "#checkbd",
                title: "<input type='checkbox' name='siam_all' title='' lay-skin='primary' lay-filter='siam_all'> ",
                width: 60,
                align:"center"
            },
            {field:'carNo', title: '车牌号',align:"center",fixed: "left", minWidth:200, templet: function (d) {return isEmpty(d.carNo);}},
            {field:'brandName', title: '品牌', minWidth:200, templet: function (d) {return isEmpty(d.brandName);}},
            {field:'seriesName', title: '车系', minWidth:200, templet: function (d) {return isEmpty(d.seriesName);}},
            {field:'modelName', title: '车型', minWidth:200, templet: function (d) {return isEmpty(d.modelName);}},
            {field:'vinNo', title: '车架号', minWidth:200, templet: function (d) {return isEmpty(d.vinNo);}},
        ]],
        page: true,
        loading: true,
        limits: [10, 15, 25, 40],
        limit: 10,
        parseData: function(res){
            res.data.forEach(function (d) {
                d.LAY_CHECKED = false;
                if ($.inArray(d.carId, vm.selectorIds) >= 0) {
                    d.LAY_CHECKED = true;
                }
            });
            tmpListDatas = JSON.parse(JSON.stringify(res.data));
            checkAllStatusChange();
            return res;
        },
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'selector'){
            vm.selector(data);
        }else if (layEvent === 'view'){
            vm.view(data);
        }
    });

    Search({
        elid: 'searchId',
        vm_q: vm.q,
        termList: [
            {type: 'selectcascader', label: '车辆信息', placeholder: '请选择品牌/车系/车型', fieldName: 'modelId', selectList: vm.carTreeList},
            {type: 'text', label: '车牌号',align:"center", placeholder: '请输入车牌号', fieldName: 'carPlateNo',},
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
            }
        }
    }).initView();

    layui.form.on('checkbox(siam_all)', function(){
        var checked = $(this)[0].checked;
        var status = $(this).prop("checked");
        $.each($("input[name=siam_one]"), function (i, value) {
            $(this).prop("checked", status);
            var id = $(this).attr("data-id");
            var obj = tmpListDatas.filter(function (d) {
                return d.carId == id;
            })[0];
            checkedChange(obj, id, checked);
        });
        layui.form.render();
    });

    layui.form.on('checkbox(siam_one)', function(){
        var checked = $(this)[0].checked;
        var id = $(this).attr("data-id");
        var obj = tmpListDatas.filter(function (d) {
            return d.carId == id;
        })[0];
        checkedChange(obj, id, checked);
        checkAllStatusChange();
        layui.form.render();
    });
});

var action;
var callback;
var tmpListDatas;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{},
        carTreeList: [],
        count:0,
        selectorList: [],
        selectorIds: []
},
created: function(){
    var _this = this;
    var param = parent.layer.boxParams.boxParams;
    _this.q.rentType = param.rentType;
    action = param.action;
    callback = param.callback;
    $.ajaxSettings.async= false;
    $.getJSON(baseURL + "car/tcarbasic/selectCarData", function (r) {
        _this.carTreeList = r.carTreeVoList;
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
    view: function (_data) {
        var param = {
            data:_data
        };
        var index = layer.open({
            id: 'contractemplateview',
            title: "查看",
            type: 2,
            boxParams: param,
            content: [tabBaseURL + "modules/contract/contractemplateview.html", 'no'],
            end: function () {
                layer.close(index);
            }
        });
        layer.full(index);
    },
    selector: function (data) {
        if (('regenerateDocSelector' == action || 'callback' == action) && null != callback){
            callback(data.id, data.nameTpl);
        } else {
            parent.vm.order.contract = Object.assign({}, parent.vm.order.contract, {
                templateId: data.id,
                templateName: data.nameTpl
            });
            parent.vm.contractModelId = 'contractModelId_' + uuid(6);
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    },
    reload: function (event) {
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: JSON.parse(JSON.stringify(vm.q))
        });
    },
    closePage:function () {
        vm.selectorList = [];
        closeCurrent();
    },
    selected:function () {
        /*if(!vm.selectorList || vm.selectorList.length==0){
            return false;
        }*/
        var body = [];
        for (var index in vm.selectorList) {
            var selector = vm.selectorList[index];
            // 车辆类型hpzl，车牌号hphm
            body.push({"hpzl":selector.hpCode,"hphm":selector.carNo})
        }
        $.ajax({
            type: "POST",
            url: baseURL + 'car/carsurviel/requestSurviel',
            contentType: "application/json",
            data: JSON.stringify(body),
            success: function(r){
                if(r && r.msg){
                    alert(r.msg, function(index){
                        closeCurrent();
                    });
                }
            }
        });
    }
}
});

function checkedChange(data, id, checked) {
    if (checked){
        if ($.inArray(id, vm.selectorIds) < 0){
            vm.selectorIds.push(id);
            vm.selectorList.push(data);
        }
    } else {
        if ($.inArray(id, vm.selectorIds) >= 0) {
            for (var i = 0; i < vm.selectorIds.length; i++) {
                if (vm.selectorIds[i] == id) {
                    vm.selectorIds.splice(i, 1);
                    i = i - 1;
                }
            }
            for (var i = 0; i < vm.selectorList.length; i++) {
                if (vm.selectorList[i].carId == id) {
                    vm.selectorList.splice(i, 1);
                    i = i - 1;
                }
            }
        }
    }
    vm.count = vm.selectorIds.length;
}

function checkAllStatusChange() {
    var count =  tmpListDatas.length;
    tmpListDatas.forEach(function (d) {
        if ($.inArray(d.carId, vm.selectorIds) >= 0){
            count--;
        }
    });
    $("input[name=siam_all]").prop("checked", count==0 && tmpListDatas.length != 0);
}