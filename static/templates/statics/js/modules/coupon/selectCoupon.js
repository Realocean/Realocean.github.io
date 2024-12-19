var table_data = new Array();
var soulTable;
$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    init(layui);


    layui.use(['form','table','element', 'soulTable'], function(){
        soulTable=layui.soulTable;

        layui.form.render();
    });


});

layui.table.on('checkbox(grid)', function(obj){
    if(obj.checked==true){
        if(obj.type=='one'){
            vm.entityList.push(obj.data);
        }else{
            for(var i=0;i<table_data.length;i++){
                vm.entityList.push(table_data[i]);
            }
        }
    }else{
        if(obj.type=='one'){
            for(var i=0;i<vm.entityList.length;i++){
                if(vm.entityList[i].customerId==obj.data.customerId){
                    vm.entityList.splice(i, 1)
                    i = i - 1;
                }
            }
        }else{
            for(var j=0;j<table_data.length;j++){
                for(var i=0;i<vm.entityList.length;i++){
                    if(vm.entityList[i].customerId==table_data[j].customerId){
                        // if (vm.numMap.has(vm.entityList[i].id)) {
                        //     vm.numMap.delete(vm.entityList[i].id)
                        // }
                        vm.entityList.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
        }
    }
});



var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            searchValue:null,
        },
        coupon: {
            memberVoList:[]
        },
        entityList:[],
        numMap:[[]],
    },
    created: function() {
        var _this = this;
         _this.coupon.memberVoList=[];
         _this.entityList=[];
         _this.numMap=new Map();
    },
    computed: function () {

    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        reset: function () {
            vm.q.searchValue = null;
        },

        choseData: function(data){
            if(vm.entityList.length==0){
                alert("请选择要发放客户")
                return;
            }
            let couponData= window.localStorage.getItem("data");
            let list=[];
            for(let i=0;i<vm.entityList.length;i++){
                let param={};
                param.memberNo=vm.entityList[i].customerId;
                param.memberName=vm.entityList[i].customerName;
                list.push(param);
            }
            vm.coupon.memberVoList=list;
            vm.coupon.couponId= couponData;
            confirm('您确定要发给指定的客户吗？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "/coupon/member",
                    contentType: "application/json",
                    data: JSON.stringify(vm.coupon),
                    success: function (r) {
                        RemoveLoading();
                        if(r.code === 0){
                            alert('操作成功', function(index){
                                vm.entityList=[];
                                vm.coupon.couponEntityList=[];
                                vm.numMap.clear();
                                 index = parent.layer.getFrameIndex(window.name);
                                parent.vm.reload();
                                parent.layer.close(index);
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },

        query: function () {
            vm.reload();
        },

        reload: function () {
               layui.table.reload('grid', {
                    page: {
                        curr: 1
                    },
                    where: {
                        searchValue: vm.q.searchValue,
                    }
                });
        }
    }
});

function init(layui) {
    initTable(layui.table);


}

function initTable(table) {
    table.render({
        id: "grid",
        elem: "#grid",
        url: baseURL + 'coupon/getCustomers',
        cols: [[
            {type:'checkbox'},
            {field:'customerName', minWidth:200, align:'center',title: '客户名称'},
            {field:'customerType', minWidth:150,align:'center', title: '客户类型',templet:function (d) {
                    if(d.customerType ==1){
                        return "企业";
                    }else if(d.customerType ==2) {
                        return "个人";
                    }
                    else {
                        return "--";
                    }
                }},
            {field:'contactPerson', minWidth:120, align:'center',title: '联系人',templet:function (d) {
                    if(d.contactPerson != null && d.contactPerson !=""){
                        return d.contactPerson;
                    }else {
                        return "--";
                    }
                }},
            {field:'contactMobile', minWidth:160,align:'center', title: '联系电话',templet:function (d) {
                    if(d.contactMobile != null && d.contactMobile !=""){
                        return d.contactMobile;
                    }else {
                        return "--";
                    }
                }},
            {field:'customerFrom', minWidth:150, align:'center',title: '客户来源',templet:function (d) {
                    if(d.customerFrom ==1){
                        return "手动录入";
                    }else if(d.customerFrom ==2) {
                        return "微信扫码";
                    }else if(d.customerFrom ==3) {
                        return "微信搜索";
                    }else if(d.customerFrom ==4) {
                        return "微信分享";
                    }
                    else {
                        return "--";
                    }
                }},
            {field:'createTime', minWidth:100, align:'center',title: '创建时间',templet:function (d) {
                    if(d.createTime != null && d.createTime !=""){
                       return  d.createTime;
                    }else {
                        return "--";
                    }
                }},
            {field:'deptName', minWidth:150,align:'center', title: '所属门店/部门',templet:function (d) {
                    if(d.deptName != null){
                        return d.deptName;
                    }else {
                        return "--";
                    }
                }},
        ]],
        page: true,
        loading: true,
        limits: [10, 50, 100, 200],
        limit: 10,
        // where: {searchValue:type},
        done: function (res, curr, count) {
            soulTable.render(this);
            $('.layui-table').css("width", "100%");
            $("th[data-field='bar']").css("border-right", 'none');
            table_data = res.data;
            for (var i = 0; i < res.data.length; i++) {
                for (var j = 0; j < vm.entityList.length; j++) {
                    if (res.data[i].customerId == vm.entityList[j].customerId) {
                        res.data[i]["LAY_CHECKED"] = 'true';
                        var index = res.data[i]['LAY_TABLE_INDEX'];
                        //如果你的页面还有第二个表格，就是.list2
                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('.layui-table tr[data-index=' + index + '] input[type="checkbox"]').next().addClass(
                            'layui-form-checked');
                    }
                }
            }
            var checkStatus = layui.table.checkStatus('my-table');
            if (checkStatus.isAll) {
                $('.layui-table th[data-field="0"] input[type="checkbox"]').prop('checked', true);//data-field值默认为0，如果在分页部分自定义了属性名，则需要改成对应的属性名
                $('.layui-table th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');//data-field值默认为0，如果在分页部分自定义了属性名，则需要改成对应的属性名
                $('.layui-table-body table.layui-table tbody tr').addClass('layui-table-click');
            }
        }
    });
}

