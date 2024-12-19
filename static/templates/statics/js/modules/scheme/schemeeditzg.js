var tagIns;
$(function () {
    $.getJSON(baseURL + "sys/dept/findStoreList", function (r) {
        if(r.deptList.length>0){
            r.deptList.forEach(function (d) {
                var tempObj = {
                    name:d.companyName,
                    value:d.deptId
                };
                vm.companyList.push(tempObj);
            });
        }
        tagIns  = xmSelect.render({
            el: '#demo1',
            toolbar: { // 工具条【‘全选’，‘清空’】
                show: true, // 开启工具条
                showIcon: false, // 隐藏工具条的图标
            },
            filterable: true, // 开启搜索模式，默认按照name进行搜索
            data: vm.companyList,

        })
    });


    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        vm.getDataTree();
        layui.form.render();
    });
});
//数据树
var data_ztree;
var data_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        chkStyle:"checkbox",
        enable:true,
        nocheckInherit:true,
        autoCheckTrigger: true,
        chkboxType:{ "Y" : "", "N" : "" }
    }
};

//数据树
var data_ztree_ch1;
var data_setting_chl = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl",
            name: "channelName"
        }
    },
    check:{
        chkStyle:"checkbox",
        enable:true,
        nocheckInherit:true,
        autoCheckTrigger: true,
        chkboxType:{ "Y" : "", "N" : "" }
    }
};
var vm = new Vue({
    el: '#rrapp',
    data: {
        scheme: {drivingTestFlag:0,deptType:'1',chlType:'1'},
        schemeType:null,
        //车辆品牌数据源
        brandList: [],
        //车辆车系数据源
        seriesList: [],
        //车辆车型数据源
        modelList: [],
        companyList:[],
        companyJsonArr:null,
        verify: false
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.schemeType = param;



        //车辆品牌数据查询
        $.getJSON(baseURL + "scheme/scheme/getAllCarBrand", function (r) {
            _this.brandList = r.brandList;
        });


    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            vm.scheme.schemeType=vm.schemeType;
            // if(vm.scheme.deptType == 2 ){
            //     var nodes = data_ztree.getCheckedNodes(true);
            //     var deptIdList = new Array();
            //     var deptNameList = new Array();
            //     for(var i=0; i<nodes.length; i++) {
            //         deptIdList.push(nodes[i].deptId);
            //         deptNameList.push(nodes[i].name);
            //     }
            //     vm.scheme.deptIds = deptIdList.join(',');
            //     vm.scheme.deptNames = deptNameList.join(',');
            //     if(vm.scheme.deptIds == null || vm.scheme.deptIds == ''){
            //         alert("自定义部门不能为空!");
            //         return ;
            //     }
            // }else{
            //     vm.scheme.deptNames = '全部';
            // }
            //
            // if(vm.scheme.chlType == 2 ){
            //     var nodes = data_ztree_ch1.getCheckedNodes(true);
            //     var chlIdList = new Array();
            //     var chlNameList = new Array();
            //     for(var i=0; i<nodes.length; i++) {
            //         chlIdList.push(nodes[i].id);
            //         chlNameList.push(nodes[i].channelName);
            //     }
            //     vm.scheme.chlIds = chlIdList.join(',');
            //     vm.scheme.chlNames = chlNameList.join(',');
            // }else{
            //     vm.scheme.chlNames = '全部';
            // }
            vm.scheme.deptType = 2;
            var strIdArr = tagIns.getValue('value').join(',');
            if(strIdArr == '' || strIdArr == null){
                alert("请选择门店!");
                return ;
            }
            vm.scheme.deptIds=strIdArr;
            var strNameArr = tagIns.getValue('name').join(',');
            console.log("选择的门店名称：",strNameArr);
            vm.scheme.deptNames =strNameArr;
            console.log(vm.scheme.deptNames);
            console.log(vm.scheme.chlNames);
            var url = vm.scheme.schemeId == null ? "scheme/scheme/save" : "scheme/scheme/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.scheme),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        getDataTree: function() {
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
                //展开所有节点
                data_ztree.expandAll(true);
                if(vm.scheme  != null && vm.scheme.deptIds != undefined && vm.scheme.deptIds != null && vm.scheme.deptIds != ''){
                    vm.checkDeptList(vm.scheme.deptIds);
                }
            });

            //加载菜单树
            $.get(baseURL + "chl/chlchannel/chlLst", function(r){
                data_ztree_ch1 = $.fn.zTree.init($("#dataTreeChl"), data_setting_chl, r.chlLst);
                //展开所有节点
                data_ztree_ch1.expandAll(true);
                if(vm.scheme  != null && vm.scheme.chlIds != undefined && vm.scheme.chlIds != null && vm.scheme.chlIds != ''){
                    vm.checkChlList(vm.scheme.chlIds);
                }
            });
        },
        checkDeptList : function(deptIds){
                var deptIdArray=deptIds.split(',');
                for(var i=0; i<deptIdArray.length; i++) {
                    var node = data_ztree.getNodeByParam("deptId", deptIdArray[i]);
                    if(node != null){
                        data_ztree.checkNode(node, true, false);
                    }
                }
        },checkChlList : function(chllIds){
                var chlIdArray=chllIds.split(',');
                for(var i=0; i<chlIdArray.length; i++) {
                    var node = data_ztree_ch1.getNodeByParam("id", chlIdArray[i]);
                    if(node != null){
                        data_ztree_ch1.checkNode(node, true, false);
                    }
                }
        }
    }
});

function init(layui) {
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_schemeName: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "方案名称不能为空";
                }
                var min = item.getAttribute('lay-min');
                if(value.length > min){
                    return '方案名称不能大于'+min+'个字符的长度';
                }

            }
        },
        validate_brandId: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "车辆品牌不能为空";
                }
            }
        },
        validate_seriesId: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "车辆车系不能为空";
                }
            }
        },
        validate_guidePrice: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "指导价不能为空";
                }
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(value)){
                    vm.verify = false;
                    return '金额的输入格式不正确,请确认!';
                }
            }
        },
        /*validate_nakedCarPrice: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "裸车价不能为空";
                }
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(value)){
                    vm.verify = false;
                    return '金额的输入格式不正确,请确认!';
                }
            }
        },*/
        validate_sort:function (value, item){
            if (vm.verify) {
                if(vm.scheme.isPopularCarRental==0){
                    if(value!=null && value!=''){
                        var regu = /^[1-9]{1,}[\d]*$/;
                        if (!regu.test(value)) {
                            vm.verify = false;
                            return "排序只能输入正整数";
                        }
                    }
                }
            }
        },
        deptType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "部门所属类型不能为空";
                }
            }
        },
        chlType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "选择渠道类型不能为空";
                }
            }
        },

    });
}

function initChecked(form) {
    form.on('radio(chlType)', function (data) {
        vm.scheme.chlType = data.value;
    });form.on('radio(deptType)', function (data) {
        vm.scheme.deptType = data.value;
    });
    form.on('radio(drivingTestFlag)', function (data) {
        vm.scheme.drivingTestFlag = data.value;
    });
    //品牌下拉列表监听
    form.on('select(brandId)', function (data) {
        vm.scheme.brandId = data.value;
        if (data.value != "") {
            $.ajax({
                type: "POST",
                url: baseURL + "scheme/scheme/getSeriesListByBrandId/" + data.value,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.seriesList = r.seriesList;
                    vm.scheme.modelId = "";
                    vm.modelList = [];
                }
            });
        } else {
            vm.scheme.seriesId = "";
            vm.scheme.modelId = "";
            vm.seriesList = [];
            vm.modelList = [];
        }
    });
    //车系下拉列表监听
    form.on('select(seriesId)', function (data) {
        vm.scheme.seriesId = data.value;
        if (data.value != "") {
            $.ajax({
                type: "POST",
                url: baseURL + "scheme/scheme/getModelListBySeries/" + data.value,
                contentType: "application/json",
                data: {},
                success: function (r) {
                    vm.modelList = r.carModelList;
                    vm.scheme.modelId = "";
                }
            });
        } else {
            vm.scheme.modelId = "";
            vm.modelList = [];
        }
    });
    //车型下拉列表监听
    form.on('select(modelId)', function (data) {
        vm.scheme.modelId = data.value;
    });
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });
    $("#save").on('click', function () {
        vm.verify = true;
    });
}


function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

//接收父页面数据
function sendData(param) {
    //车系列表查询
    $.ajax({
        type: "POST",
    //  async:false,
        url: baseURL + "scheme/scheme/getSeriesListByBrandId/" + param.brandId,
        contentType: "application/json",
        data: {},
        success: function (r) {
            vm.seriesList = r.seriesList;
        }
    });

    //车型列表查询
    $.ajax({
        type: "POST",
    //  async:false,
        url: baseURL + "scheme/scheme/getModelListBySeries/" + param.seriesId,
        contentType: "application/json",
        data: {},
        success: function (r) {
            vm.modelList = r.carModelList;
        }
    });
    vm.scheme=param;
    layui.form.render();

}

//金额输入处理
function moneyInput(value) {
    //修复第一个字符是小数点 的情况.
    let fa = '';
    if (value !== '' && value.substr(0, 1) === '.') {
        value = "";
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf(".") < 0 && value !== "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) === '0' && value.length === 2) {
            value = value.substr(1, value.length);
        }
    }
    value = fa + value;
    return value;
}