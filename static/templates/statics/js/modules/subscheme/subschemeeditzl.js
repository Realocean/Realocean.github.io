var tagIns;
$(function () {
    $.getJSON(baseURL + "sys/dept/findStoreList", function (r) {
        if(r.deptList.length>0){
            if(vm.subScheme.deptIds != null && vm.subScheme.deptIds != '' && vm.subScheme.deptIds != undefined ){
                r.deptList.forEach(function (d) {
                    var tempObj;
                    if(vm.subScheme.deptIds.indexOf(d.deptId)>-1){
                        tempObj = {
                            name:d.companyName,
                            value:d.deptId,
                            selected:true
                        };
                    }else {
                        tempObj = {
                            name:d.companyName,
                            value:d.deptId
                        };
                    }
                    vm.companyList.push(tempObj);
                });
            }else {
                r.deptList.forEach(function (d) {
                    var tempObj = {
                        name:d.companyName,
                        value:d.deptId
                    };
                    vm.companyList.push(tempObj);
                });
            }
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
        //主方案数据
        scheme:{},
        //子方案数据
        subScheme: {deptType:'1',chlType:'1',customerType:'0'},
        verify: false,
        companyList:[]
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scheme = param;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        getDataTree: function() {
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
                //展开所有节点
                data_ztree.expandAll(true);
                if(vm.subScheme  != null && vm.subScheme.deptIds != undefined && vm.subScheme.deptIds != null && vm.subScheme.deptIds != ''){
                    vm.checkDeptList(vm.subScheme.deptIds);
                }
            });

            //加载菜单树
            $.get(baseURL + "chl/chlchannel/chlLst", function(r){
                data_ztree_ch1 = $.fn.zTree.init($("#dataTreeChl"), data_setting_chl, r.chlLst);
                //展开所有节点
                data_ztree_ch1.expandAll(true);
                if(vm.subScheme  != null && vm.subScheme.chlIds != undefined && vm.subScheme.chlIds != null && vm.subScheme.chlIds != ''){
                    vm.checkChlList(vm.subScheme.chlIds);
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
        },
        checkChlList : function(chllIds){
            var chlIdArray=chllIds.split(',');
            for(var i=0; i<chlIdArray.length; i++) {
                var node = data_ztree_ch1.getNodeByParam("id", chlIdArray[i]);
                if(node != null){
                    data_ztree_ch1.checkNode(node, true, false);
                }
            }
        },
        saveOrUpdate: function (event) {
            // if(vm.subScheme.deptType == 2 ){
            //     var nodes = data_ztree.getCheckedNodes(true);
            //     var deptIdList = new Array();
            //     var deptNameList = new Array();
            //     for(var i=0; i<nodes.length; i++) {
            //         deptIdList.push(nodes[i].deptId);
            //         deptNameList.push(nodes[i].name);
            //     }
            //     vm.subScheme.deptIds = deptIdList.join(',');
            //     vm.subScheme.deptNames = deptNameList.join(',');
            //     if(vm.subScheme.deptIds == null || vm.subScheme.deptIds == ''){
            //         alert("自定义部门不能为空!");
            //         return ;
            //     }
            // }else{
            //     vm.subScheme.deptNames = '全部';
            // }
            //
            if(vm.subScheme.chlType == 2 ){
                var nodes = data_ztree_ch1.getCheckedNodes(true);
                var chlIdList = new Array();
                var chlNameList = new Array();
                for(var i=0; i<nodes.length; i++) {
                    chlIdList.push(nodes[i].id);
                    chlNameList.push(nodes[i].channelName);
                }
                vm.subScheme.chlIds = chlIdList.join(',');
                vm.subScheme.chlNames = chlNameList.join(',');
            }else{
                vm.subScheme.chlNames = '全部';
            }
            vm.subScheme.deptType = 2;
            var strIdArr = tagIns.getValue('value').join(',');
            if(strIdArr == '' || strIdArr == null){
                alert("请选择门店!");
                return ;
            }
            vm.subScheme.deptIds=strIdArr;
            var strNameArr = tagIns.getValue('name').join(',');
            console.log("子方案门店名称：",strNameArr);
            vm.subScheme.deptNames = strNameArr;
            //保存前查询子方案是存在
            if(vm.subScheme.subSchemeId !=null && vm.subScheme.subSchemeId!='' ){
                //保证金
                vm.scheme.deposit=vm.subScheme.deposit;
                //月租
                vm.scheme.monthlyRent=vm.subScheme.monthlyRent;
                //租期
                vm.scheme.tenancy=vm.subScheme.tenancy;
                $.ajax({
                    type: "POST",
                //  async: false,
                    url: baseURL + 'scheme/scheme/checkSubScheme',
                    contentType: "application/json",
                    data: JSON.stringify(vm.scheme),
                    success: function (r) {
                        RemoveLoading();
                        if (r.code === 0) {
                            if(r.subSchemeList!=null && r.subSchemeList.length>0){
                                var flag = false;
                                for (var i = 0; i <r.subSchemeList.length ; i++) {
                                    if(r.subSchemeList[i].subSchemeId !=vm.subScheme.subSchemeId){
                                        flag = true;
                                        break;
                                    }
                                }
                                if(flag){
                                    alert("当前子方案已存在,请重新输入！");
                                    return;
                                }else{
                                    //更新子方案
                                    $.ajax({
                                        type: "POST",
                                        //  async: false,
                                        url: baseURL + 'subscheme/subscheme/update',
                                        contentType: "application/json",
                                        data: JSON.stringify(vm.subScheme),
                                        success: function (r) {
                                            if (r.code === 0) {
                                                alert('操作成功', function (index) {
                                                    var index = parent.layer.getFrameIndex(window.name);
                                                    parent.layer.close(index);
                                                    parent.refresh(vm.subScheme.schemeId);
                                                });
                                            }
                                        }
                                    });
                                }
                            }else {
                                //更新子方案
                                $.ajax({
                                    type: "POST",
                                    //  async: false,
                                    url: baseURL + 'subscheme/subscheme/update',
                                    contentType: "application/json",
                                    data: JSON.stringify(vm.subScheme),
                                    success: function (r) {
                                        if (r.code === 0) {
                                            alert('操作成功', function (index) {
                                                var index = parent.layer.getFrameIndex(window.name);
                                                parent.layer.close(index);
                                                parent.refresh(vm.subScheme.schemeId);
                                            });
                                        }
                                    }
                                });

                            }
                        }
                    }
                });
            }else {
                //将子方案数据添加到父页面子方案数据源
                if(vm.subScheme.randomData==null || vm.subScheme.randomData==''){
                    vm.subScheme.isEnable=1;
                    vm.subScheme.createTime=new Date();
                    vm.subScheme.modifyTime=new Date();
                    //历史数据list
                    var parentData=parent.vm.subScheme;
                    //当前数据
                    //保证金
                    var deposit=vm.subScheme.deposit;
                    //月租
                    var monthlyRent=vm.subScheme.monthlyRent;
                    //租期
                    var tenancy=vm.subScheme.tenancy;
                    if(parentData.length>0){
                        for (var i = parentData.length - 1; i >= 0; i--) {
                            if((parentData[i].deposit==deposit) && (parentData[i].monthlyRent==monthlyRent) && (parentData[i].tenancy==tenancy)){
                                alert("当前子方案已存在，请重新输入!");
                                return;
                            }
                        }
                    }

                    var  randomData=vm.randomData();
                    vm.subScheme.randomData=randomData;
                    parent.vm.subScheme.push(vm.subScheme);
                }else {
                    //判断当前修改数据是否与历史数据重复
                    //历史数据list
                    var parentData=parent.vm.subScheme;
                    //当前数据
                    //保证金
                    var deposit=vm.subScheme.deposit;
                    //月租
                    var monthlyRent=vm.subScheme.monthlyRent;
                    //租期
                    var tenancy=vm.subScheme.tenancy;
                    var randomData=vm.subScheme.randomData;
                    if(parentData.length>0){
                        for (var i = parentData.length - 1; i >= 0; i--) {
                            if (parentData[i].randomData==randomData) {
                                parentData.splice(i, 1);
                            }else{
                                if((parentData[i].deposit==deposit) && (parentData[i].monthlyRent==monthlyRent) && (parentData[i].tenancy==tenancy)){
                                    alert("当前子方案已存在，请重新输入!");
                                    return;
                                }
                                /*else{
                                    if (parentData[i].randomData==randomData) {
                                        parentData.splice(i, 1);
                                    }
                                }*/
                            }
                        }
                    }
                    var  randomData=vm.randomData();
                    vm.subScheme.randomData=randomData;
                    vm.subScheme.createTime=new Date();
                    vm.subScheme.modifyTime=new Date();
                    parent.vm.subScheme.push(vm.subScheme);
                }
                alert('操作成功', function (index) {
                    closePage();
                });
            }
        },
        //生成随机数
        randomData:function(){
            return  Math.random().toString(36).slice(2)
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
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
        validate_deposit: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "保证金不能为空";
                }
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(value)){
                    vm.verify = false;
                    return '保证金金额输入格式不正确,请确认!';
                }
            }
        },
        validate_monthlyRent: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "月租金不能为空";
                }
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(value)){
                    vm.verify = false;
                    return '月租金金额输入格式不正确,请确认!';
                }
            }
        },
        validate_tenancy: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "租期不能为空";
                }
                var reg = /^\+?[1-9]\d*$/;
                if(!reg.test(value)){
                    vm.verify = false;
                    return '只能输入大于0的正整数';
                }
            }
        },
        validate_coverCharge: function (value, item) {
            if (vm.verify) {
                if (value != null && value != '') {
                    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if(!reg.test(value)){
                        vm.verify = false;
                        return '服务费输入格式不正确,请确认!';
                    }
                }
            }
        },
        validate_chlRebate: function (value, item) {
            if (vm.verify) {
                if (value != null && value != '') {
                    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if(!reg.test(value)){
                        vm.verify = false;
                        return '渠道商返利输入格式不正确,请确认!';
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
        },customerType: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "客户类型不能为空";
                }
            }
        },chlType: function (value, item) {
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
        vm.subScheme.chlType = data.value;
    });
    form.on('radio(deptType)', function (data) {
        vm.subScheme.deptType = data.value;
    });form.on('select(customerType)', function (data) {
        vm.subScheme.customerType = data.value;
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

function initTable(table, soulTable) {

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
    parent.layer.close(index);
    parent.vm.reload();
}


function sendData(data) {
    vm.subScheme=data;
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