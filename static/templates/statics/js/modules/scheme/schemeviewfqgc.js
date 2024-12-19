$(function () {

    $.getJSON(baseURL + "sys/dept/findStoreList", function (r) {
        if(r.deptList.length>0){
            r.deptList.forEach(function (d) {
                vm.companyList.push(d.deptId);
            });
        }

    });


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
    data:{
        detailsTabContentList: [ '分期购车方案', '操作记录',],
        detailsSupTabContentListActiveValue: null,
        detailsTabContentListActiveIndex : null,
        //主方案数据源
        scheme: {},
        //子方案数据源
        subScheme:[],
        companyList:[]

    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scheme.schemeId = param;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        generateQrcode:function(data){
            if(data.alipayIsEnable == 0){
                layer.msg('方案已禁用，请联系门店处理!', {icon: 5});
                return;
            }
            var thisDeptIds = data.deptIds;
            if(thisDeptIds == null || thisDeptIds == undefined || thisDeptIds== ''){
                if(vm.companyList){
                    thisDeptIds = vm.companyList.join(',');
                }else {
                    layer.msg('请先创建门店!', {icon: 5});
                    return;
                }
            }
            let arr = thisDeptIds.split(",");
            if (arr.length > 1) {
                var param = {
                    callback: function(schemeStore){
                        $.ajax({
                            type: "GET",
                            url: baseURL + "scheme/scheme/generateSchemeQrcode",
                            data: {schemeId:data.subSchemeId,deptId:schemeStore,isParent:0},
                            success: function(result){
                                console.log(result)
                                var imgElement = document.createElement('img');
                                var testImageUrl = 'data:image/png+xml;base64,' + result.data
                                // 创建一个弹框，显示图片
                                layer.open({
                                    title: '小程序码',
                                    type: 1,
                                    area: ['380px', '520px'],
                                    content: '<img src='+testImageUrl+'>',
                                    btn: ['下载'],
                                    btn1: function () {
                                        // 创建一个链接，模拟点击下载
                                        var link = document.createElement('a');
                                        link.href = testImageUrl;
                                        link.download = 'image.png';
                                        link.click();
                                    }
                                });
                            },
                            error: function (error) {
                                layer.msg('Failed to get image');
                            }

                        });
                    },
                    subSchemeId:data.subSchemeId
                };
                var index = layer.open({
                    type: 2,
                    title: '选择门店',
                    area: ['600px', '400px'],
                    boxParams: param,
                    content: tabBaseURL + 'modules/scheme/schemStoreselect.html',
                    end: function () {
                        layer.close(index);
                    }
                });
            }else{
                $.ajax({
                    type: "GET",
                    url: baseURL + "scheme/scheme/generateSchemeQrcode",
                    data: {schemeId:data.subSchemeId,deptId:thisDeptIds,isParent:0},
                    success: function(result){
                        console.log(result)
                        var imgElement = document.createElement('img');
                        var testImageUrl = 'data:image/png+xml;base64,' + result.data
                        // 创建一个弹框，显示图片
                        layer.open({
                            title: '小程序码',
                            type: 1,
                            area: ['380px', '520px'],
                            content: '<img src='+testImageUrl+'>',
                            btn: ['下载'],
                            btn1: function () {
                                // 创建一个链接，模拟点击下载
                                var link = document.createElement('a');
                                link.href = testImageUrl;
                                link.download = 'image.png';
                                link.click();
                            }
                        });
                    },
                    error: function (error) {
                        layer.msg('Failed to get image');
                    }

                });
            }
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initTableData(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[0];
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {
    form.on('switch(wxIsEnableStatus)', function(obj){
        var id = $(this).attr('mid');
        var pid = $(this).attr('pid');
        var status= 0;
        obj.elem.checked?status=1:status=0;
        var params = {subSchemeId : id, appletType : 2,wxIsEnable:status};
        $.ajax ({
            type: 'POST',
            url: baseURL + "subscheme/subscheme/controlIsEnable",
            contentType: "application/json",
            data: JSON.stringify(params),
            loadFlag: true,
            success : function(data){
                $.ajax({
                    type: "POST",
                    async:false,
                    url: baseURL + "scheme/scheme/info/"+pid+"/"+2,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        sendData(r.schemeEntityDTO);
                    }
                });
            },
            unSuccess: function (data) {
            }
        })
    });
    form.on('switch(alipayIsEnableStatus)', function(obj){
        var id = $(this).attr('mid');
        var pid = $(this).attr('pid');
        var status=0;
        obj.elem.checked?status=1:status=0;
        var params = {subSchemeId : id, appletType : 1,alipayIsEnable:status};
        $.ajax ({
            type: 'POST',
            url: baseURL + "subscheme/subscheme/controlIsEnable",
            contentType: "application/json",
            data: JSON.stringify(params),
            loadFlag: true,
            success : function(data){
                $.ajax({
                    type: "POST",
                    async:false,
                    url: baseURL + "scheme/scheme/info/"+pid+"/"+2,
                    contentType: "application/json",
                    data: {},
                    success: function(r){
                        sendData(r.schemeEntityDTO);
                    }
                });
            },
            unSuccess: function (data) {
                layer.msg("修改失败");
            }
        })
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}


function initTableData(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        data:vm.subScheme,
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',fixed:"left",align:"center"},
            {field:'deptNames', title: '所属门店', minWidth:200, templet: function (d) {return isEmpty(d.deptNames);}},
            {field:'wxJSCodeEnable', title: '微信小程序', minWidth:150, templet: function (d) {
                    var strCheck = d.wxIsEnable == 1 ? "checked" : "";
                    return '<input type="checkbox" name="wxIsEnableStatus" lay-filter="wxIsEnableStatus" lay-skin="switch" lay-text="启用|禁用" ' +strCheck+ ' mid='+d.subSchemeId+' pid='+d.schemeId+'>';
                }},
            {field:'aliPayJSCodeEnable', title: '支付宝小程序', minWidth:150, templet: function (d) {
                    var strCheck = d.alipayIsEnable == 1 ? "checked" : "";
                    return '<input type="checkbox" name="alipayIsEnableStatus" lay-filter="alipayIsEnableStatus" lay-skin="switch" lay-text="启用|禁用" ' +strCheck+ ' mid='+d.subSchemeId+' pid='+d.schemeId+'>';
                }},
            {field:'customerType', title: '客户类型', minWidth:150, templet: function (d) {
                    if(d.customerType == null || d.customerType == ''){
                        return "--";
                    }
                    if(d.customerType == 0){
                        return "全部";
                    }else if(d.customerType == 1){
                        return "个人";
                    }else {
                        return "企业";
                    }
                }},
            {field:'servicingFee', title: '整备费/元', minWidth:150, templet: function (d) {return isEmpty(d.servicingFee);}},
            {field:'monthlyRent', title: '月租金/元', minWidth:150, templet: function (d) {return isEmpty(d.monthlyRent);}},
            {field:'tenancy', title: '租期', minWidth:150, templet: function (d) {
                    if(d.tenancy!=null && d.tenancy!=''){
                        return  d.tenancy +"期";
                    }else{
                        return isEmpty(d.tenancy);
                    }

                }},
            {field:'balance', title: '尾款/元', minWidth:150, templet: function (d) {return isEmpty(d.balance);}},
            {field:'chlNames', title: '所属渠道', minWidth:200, templet: function (d) {return isEmpty(d.chlNames);}},
            {field:'chlDownPayment', title: '首付款渠道价/元', minWidth:200, templet: function (d) {return isEmpty(d.chlDownPayment);}},
            {field:'chlMonthlyRent', title: '月租渠道价/元', minWidth:200, templet: function (d) {return isEmpty(d.chlMonthlyRent);}},
            {field:'chlRebate', title: '渠道商返利/元', minWidth:200, templet: function (d) {return isEmpty(d.chlRebate);}},
            {field:'createTime', title: '创建时间', minWidth:200, templet: function (d) {
                    if(d.createTime!=null && d.createTime!=''){
                        return dateFormat(d.createTime);
                    }else {
                        return isEmpty(d.createTime);
                    }
                }},

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
    // initTableEditListner(table);
}

function initTable(table, soulTable) {
    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.scheme.schemeId,
            auditType: 41
        },
        cols: [[
            {field:'operatorName', title: '操作人', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
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
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {
    table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'generateQrcode'){
            vm.generateQrcode(data);
        }
    });
}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function sendData(schemeEntityDTO) {
    vm.scheme = Object.assign({}, vm.scheme, {
        schemeName: schemeEntityDTO.schemeName,
        schemeId :schemeEntityDTO.schemeId,
        schemeType :schemeEntityDTO.schemeType,
        brandName :schemeEntityDTO.brandName,
        seriesName :schemeEntityDTO.seriesName,
        modelName :schemeEntityDTO.modelName,
        sort :schemeEntityDTO.sort,
        isPopularCarRental:schemeEntityDTO.isPopularCarRental,
        isPopularCarRentalShow:schemeEntityDTO.isPopularCarRentalShow
    })
    //给数据表格赋值
    vm.subScheme=schemeEntityDTO.subSchemeEntityList;
    layui.table.reload('gridid', {
        data: vm.subScheme
    });
    layui.form.render();
}