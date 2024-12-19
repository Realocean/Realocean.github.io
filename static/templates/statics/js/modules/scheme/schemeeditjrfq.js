$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        $("#sortDiv").hide();
        init(layui);
        layui.form.render();
    });
});


var vm = new Vue({
    el: '#rrapp',
    data: {
        //方案类型
        schemeType:null,
        //车辆品牌数据源
        brandList: [],
        //车辆车系数据源
        seriesList: [],
        //车辆车型数据源
        modelList: [],
        //主方案数据源
        scheme: {isPopularCarRental:0,drivingTestFlag:0},
        //子方案数据源
        subScheme:[],
        schemeType:null,
        verify: false,
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
        //新增子方案
        addSubScheme:function(){
            if(vm.scheme.schemeName ==null || vm.scheme.schemeName ==''){
                alert("主方案名称不能为空!");
                return;
            }
            if((vm.scheme.brandId ==null || vm.scheme.brandId =='') && (vm.scheme.seriesId ==null ||vm.scheme.seriesId =='')){
                alert("主方案车辆信息不能为空!");
                return;
            }
            //通过方案名称，车牌车系车型查询当前主方案是否存在
            vm.scheme.schemeType=vm.schemeType;
            if(vm.scheme.schemeId!=null && vm.scheme.schemeId !=''){
                $.ajax({
                    type: "POST",
                    url: baseURL + 'scheme/scheme/checkScheme',
                    contentType: "application/json",
                    data: JSON.stringify(vm.scheme),
                    success: function (r) {
                        RemoveLoading();
                        if (r.code === 0) {
                            var schemeList=r.schemeList;
                            if(schemeList!=null && schemeList.length>0){
                                for (var i = 0; i <schemeList.length ; i++) {
                                      if(schemeList[i].schemeId !=vm.scheme.schemeId){
                                          alert("当前方案类型车型已存在,请修改后再试!");
                                          return;
                                      }else {
                                          var index = layer.open({
                                              type: 2,
                                              title: '新增金融分期--子方案',
                                              area: ['90%', '85%'],
                                              boxParams: vm.scheme,
                                              content: tabBaseURL + 'modules/subscheme/subschemeeditjrfq.html',
                                              end: function () {
                                                  layer.close(index);
                                              }
                                          });
                                      }
                                }
                            }else {
                                var index = layer.open({
                                    type: 2,
                                    title: '新增金融分期--子方案',
                                    area: ['90%', '85%'],
                                    boxParams: vm.scheme,
                                    content: tabBaseURL + 'modules/subscheme/subschemeeditjrfq.html',
                                    end: function () {
                                        layer.close(index);
                                    }
                                });
                            }
                        }
                    }
                });
            }else {
                $.ajax({
                    type: "POST",
                    url: baseURL + 'scheme/scheme/checkScheme',
                    contentType: "application/json",
                    data: JSON.stringify(vm.scheme),
                    success: function (r) {
                        RemoveLoading();
                        if (r.code === 0) {
                            var schemeList=r.schemeList;
                            if(schemeList!=null && schemeList.length>=1){
                                alert("当前方案类型车型已存在,请修改后再试!");
                                return ;
                            }else{
                                var index = layer.open({
                                    type: 2,
                                    title: '新增金融分期--子方案',
                                    area: ['90%', '85%'],
                                    boxParams: vm.scheme,
                                    content: tabBaseURL + 'modules/subscheme/subschemeeditjrfq.html',
                                    end: function () {
                                        layer.close(index);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        },
        saveOrUpdate: function (event) {
            vm.scheme.subSchemeEntityList=vm.subScheme;
            vm.scheme.schemeType=vm.schemeType;
            var url = vm.scheme.schemeId == null ? "scheme/scheme/save" : "scheme/scheme/update";
            PageLoading();
            if(vm.scheme.schemeId!=null && vm.scheme.schemeId !=''){
                $.ajax({
                    type: "POST",
                    url: baseURL + 'scheme/scheme/checkScheme',
                    contentType: "application/json",
                    data: JSON.stringify(vm.scheme),
                    success: function (r) {
                        RemoveLoading();
                        if (r.code === 0) {
                            var schemeList=r.schemeList;
                            if(schemeList!=null && schemeList.length>0){
                                for (var i = 0; i <schemeList.length ; i++) {
                                    if(schemeList[i].schemeId !=vm.scheme.schemeId){
                                        alert("当前方案类型车型已存在,请修改后再试!");
                                        return;
                                    }else{
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
                                    }
                                }
                            }else{
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
                            }
                        }
                    }
                });
            }else {
                $.ajax({
                    type: "POST",
                    url: baseURL + 'scheme/scheme/checkScheme',
                    contentType: "application/json",
                    data: JSON.stringify(vm.scheme),
                    success: function (r) {
                        RemoveLoading();
                        if (r.code === 0) {
                            var schemeList=r.schemeList;
                            if(schemeList!=null && schemeList.length>=1){
                                alert("当前方案类型车型已存在,请修改后再试!");
                                return ;
                            }else{
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
                            }
                        }
                    }
                });
            }
        },
        //停用
        stop:function(data){
            if(data.subSchemeId ==null || data.subSchemeId==''){
                confirm('确认要禁用该方案吗？', function(){
                    var randomData=data.randomData;
                    var parentData=vm.subScheme;
                    for (var i = parentData.length - 1; i >= 0; i--) {
                        if (parentData[i].randomData==randomData) {
                            parentData[i].isEnable=2;
                        }
                    }
                    alert('停用成功', function(index){
                        vm.reload();
                    });
                });
            }
            if(data.subSchemeId !=null && data.subSchemeId !=''){
                confirm('确认要禁用该方案吗？', function(){
                    //通过子方案的id去修改方案的状态
                    $.ajax({
                        type: "POST",
                        url: baseURL + 'subscheme/subscheme/stop/'+data.subSchemeId,
                        contentType: "application/json",
                        data: {},
                        success: function (r) {
                            if (r.code === 0) {
                                alert('停用成功', function(index){
                                    refresh(vm.scheme.schemeId);
                                });
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                });
            }
        },
        //启用
        start:function(data){
            if(data.subSchemeId ==null || data.subSchemeId==''){
                confirm('确认要启用该方案吗？', function(){
                    var randomData=data.randomData;
                    var parentData=vm.subScheme;
                    if(parentData.length>0){
                        for (var i = parentData.length - 1; i >= 0; i--) {
                            if (parentData[i].randomData==randomData) {
                                parentData[i].isEnable=1;
                            }
                        }
                    }
                    alert('启用成功', function(index){
                        vm.reload();
                    });
                });
            }
            if(data.subSchemeId !=null && data.subSchemeId !=''){
                confirm('确认要启用该方案吗？', function(){
                    $.ajax({
                        type: "POST",
                        url: baseURL + 'subscheme/subscheme/start/'+data.subSchemeId,
                        contentType: "application/json",
                        data: {},
                        success: function (r) {
                            if (r.code === 0) {
                                alert('启用成功', function(index){
                                    refresh(vm.scheme.schemeId);
                                });
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                });
            }
        },
        //编辑
        edit:function(data){
            //新增未保存编辑
            if(data.subSchemeId ==null || data.subSchemeId==''){
                var index = layer.open({
                    type: 2,
                    title: '编辑金融分期--子方案',
                    area: ['90%', '85%'],
                    boxParams: vm.scheme,
                    content: tabBaseURL + 'modules/subscheme/subschemeeditjrfq.html',
                    success: function(layero, index) {
                        var iframe = window['layui-layer-iframe' + index];
                        iframe.sendData(data);
                    },
                    end: function(){
                        layer.close(index);
                    }
                });
            }
            //保存后编辑
            if(data.subSchemeId !=null && data.subSchemeId!=''){
                $.ajax({
                    type: "POST",
                    url: baseURL + 'subscheme/subscheme/info/'+data.subSchemeId,
                    contentType: "application/json",
                    data: {},
                    success: function (r) {
                        var index = layer.open({
                            type: 2,
                            title: '编辑金融分期--子方案',
                            area: ['90%', '85%'],
                            boxParams: vm.scheme,
                            content: tabBaseURL + 'modules/subscheme/subschemeeditjrfq.html',
                            success: function(layero, index) {
                                var iframe = window['layui-layer-iframe' + index];
                                iframe.sendData(r.subSchemeEntity);
                            },
                            end: function(){
                                layer.close(index);
                            }
                        });
                    }
                });
            }

        },
        //删除
        del:function(data){
            if(data.subSchemeId ==null || data.subSchemeId==''){
                confirm('确定要将该方案删除吗，删除之后将无法恢复？', function(){
                    var randomData=data.randomData;
                    var parentData=vm.subScheme;
                    for (var i = parentData.length - 1; i >= 0; i--) {
                        if (parentData[i].randomData==randomData) {
                            parentData.splice(i, 1);
                        }
                    }

                    alert('删除成功', function(index){
                        vm.reload();
                    });
                });
            }
            if(data.subSchemeId !=null && data.subSchemeId !=''){
                confirm('确定要将该方案删除吗，删除之后将无法恢复？', function(){
                    $.ajax({
                        type: "POST",
                        url: baseURL + 'subscheme/subscheme/delete/'+data.subSchemeId,
                        contentType: "application/json",
                        data: {},
                        success: function (r) {
                            alert('删除成功', function(index){
                                 refresh(vm.scheme.schemeId);
                            });
                        }
                    });
                });
            }

        },
        reload: function (event) {
            layui.table.reload('gridid', {
                data: vm.subScheme
            });
        },

    }
});

function init(layui) {
    initEventListener(layui);
    initTable(layui.table, layui.soulTable);
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
                    return '方案名称名不能大于'+min+'个字符的长度';
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
        /*validate_modelId: function (value, item) {
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "车辆车型不能为空";
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
        /*validate_guidePrice: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "指导价不能为空";
                }
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            }
        },*/
        /*validate_nakedCarPrice: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "裸车价不能为空";
                }
                var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(!reg.test(value)){
                    return '金额的输入格式不正确,请确认!';
                }
            }
        }*/

    });
}

function initChecked(form) {
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
    //是否推荐到低热门租车展示位
    form.on('radio(isPopularCarRental)', function (data) {
        vm.scheme.isPopularCarRental = data.value;
    });
    form.on('radio(drivingTestFlag)', function (data) {
        vm.scheme.drivingTestFlag = data.value;
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
    table.render({
        id: "gridid",
        elem: '#grid',
        height: 300,
        data:vm.subScheme,
        cols: [[
            {title: '操作', width:140, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'deptNames', title: '所属部门', minWidth:200, templet: function (d) {return isEmpty(d.deptNames);}},
            {field:'customerType', title: '客户类型', minWidth:200, templet: function (d) {
                    if(d.customerType==0){
                        return "全部";
                    }else if(d.customerType==1){
                        return "企业";
                    }else if(d.customerType==2){
                        return "个人";
                    }else {
                        return isEmpty(d.customerType);
                    }
                }},
            {field:'downPayment', title: '首付款/元', minWidth:200, templet: function (d) {return isEmpty(d.downPayment);}},
            {field:'monthlyRent', title: '月租金/元', minWidth:200, templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'tenancy', title: '租期', minWidth:200, templet: function (d) {
                if(d.tenancy!=null && d.tenancy!=''){
                    return  d.tenancy +"期";
                }else{
                    return isEmpty(d.tenancy);
                }

            }},
            {field:'balance', title: '尾款/元', minWidth:200, templet: function (d) {return isEmpty(d.balance);}},
            {field:'chlNames', title: '所属渠道', minWidth:200, templet: function (d) {return isEmpty(d.chlNames);}},
            {field:'chlDownPayment', title: '首付款渠道价/元', minWidth:200, templet: function (d) {return isEmpty(d.chlDownPayment);}},
            {field:'chlMonthlyRent', title: '月租渠道价/元', minWidth:200, templet: function (d) {return isEmpty(d.chlMonthlyRent);}},
            {field:'financeCompanyName', title: '金融公司', minWidth:200, templet: function (d) {return isEmpty(d.financeCompanyName);}},
            {field:'chlRebate', title: '渠道商返利/元', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
            {field:'isEnable', title: '启用停用', minWidth:200, templet: function (d) {
                if(d.isEnable==1){
                    return "启用";
                }else if(d.isEnable==2){
                    return "停用";
                }else {
                    return isEmpty(d.isEnable);
                }

            }},
            /*{field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {
                /!*if(d.createTime!=null && d.createTime!=''){
                   return dateFormat(d.createTime);
                }else {
                    return isEmpty(d.createTime);
                }*!/
                    return null;
            }},*/

        ]],
     // page: false,
    //  loading: true,
    //  limits: [2,20, 50, 100, 200],
        limit: Number.MAX_VALUE, // 数据表格默认全部显示
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
 // initTableEditListner(table);
}
function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'stop'){
            vm.stop(data);
        } else if(layEvent === 'start'){
            vm.start(data);
        } else if(layEvent === 'edit'){
            vm.edit(data);
        }else if(layEvent === 'del'){
            vm.del(data);
        }
    });
}
function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}


function sendData(schemeEntityDTO){
    //车系列表查询
    $.ajax({
        type: "POST",
        //  async:false,
        url: baseURL + "scheme/scheme/getSeriesListByBrandId/" + schemeEntityDTO.brandId,
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
        url: baseURL + "scheme/scheme/getModelListBySeries/" + schemeEntityDTO.seriesId,
        contentType: "application/json",
        data: {},
        success: function (r) {
            vm.modelList = r.carModelList;
        }
    });
    //方案名称
    vm.scheme.schemeId=schemeEntityDTO.schemeId;
    vm.scheme.schemeName=schemeEntityDTO.schemeName;
    vm.scheme.schemeId=schemeEntityDTO.schemeId;
    vm.scheme.schemeType=schemeEntityDTO.schemeType;
    vm.scheme.brandId=schemeEntityDTO.brandId;
    vm.scheme.seriesId=schemeEntityDTO.seriesId;
    vm.scheme.modelId=schemeEntityDTO.modelId;
    vm.scheme.sort=schemeEntityDTO.sort;
    vm.scheme.shareTitle=schemeEntityDTO.shareTitle;
    vm.scheme.shareDesc=schemeEntityDTO.shareDesc;
    //是否推荐到低热门租车展示位
    vm.scheme.isPopularCarRental=schemeEntityDTO.isPopularCarRental;
    vm.scheme.drivingTestFlag=schemeEntityDTO.drivingTestFlag;
    //给数据表格赋值
    vm.subScheme=schemeEntityDTO.subSchemeEntityList;
    layui.table.reload('gridid', {
        data: vm.subScheme
    });
    layui.form.render();
}


//刷新子方案列表
function refresh(schemeId){
    var  subSchemeOld =vm.subScheme;
    $.ajax({
        type: "POST",
        async:false,
        url: baseURL + "subscheme/subscheme/getSubSchemeListBySchemeId/"+schemeId,
        contentType: "application/json",
        data: {},
        success: function(r){
            vm.subScheme=r.subSchemeList;
            if(subSchemeOld.length>0){
                for (var i=0; i<subSchemeOld.length; i++){
                    if (subSchemeOld[i].schemeId ==null || subSchemeOld[i].schemeId ==''){
                        vm.subScheme.push(subSchemeOld[i]);
                    }
                }
            }
            layui.table.reload('gridid', {
                data: vm.subScheme
            });
            layui.form.render();
        }
    });
}
