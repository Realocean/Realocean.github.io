$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'element', 'table', 'soulTable'], function () {
        soulTable = layui.soulTable;
        gridTable = layui.table.render({
            id: "gridid",
            elem: '#grid',
        //  toolbar: true,
         // defaultToolbar: ['filter'],
            url: baseURL + 'system/tsysfinancecompany/list',
            cols: [[
                {title: '操作', minWidth:100,minWidth:100, templet:'#barTpl', fixed:"left",align:"center"},
                {field:'companyName', minWidth:100, title:'保险公司名',align:"center"},
                {field:'provinceName', minWidth:100, title:'所在省',align:"center",templet:function(row) {
                        if(row.provinceName != null && row.provinceName != '') {
                            return row.provinceName;
                        } else return '--';
                    }},
                {field:'cityName', minWidth:100, title: '所在城市',align:"center",templet:function(row) {
                        if(row.cityName != null && row.cityName != '') {
                            return row.cityName;
                        } else return '--';
                    }},
                {field:'areaName', minWidth:100, title: '所在地区',align:"center",templet:function(row) {
                        if(row.areaName != null && row.areaName != '') {
                            return row.areaName;
                        } else return '--';
                    }},
                {field:'addrDetail', minWidth:100, title: '详细地址',align:"center",templet:function(row) {
                        if(row.addrDetail != null && row.addrDetail != '') {
                            return row.addrDetail;
                        } else return '--';
                    }},
                {field:'phone', minWidth:100, title: '联系电话',align:"center",templet:function(row) {
                        if(row.phone != null && row.phone != '') {
                            return row.phone;
                        } else return '--';
                    }},
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
            done: function () {
                soulTable.render(this);
            }
        });
    });


    //页面表单相关组件初始化
    layui.use(['form', 'layedit', 'layer','laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        form.render();
    });

    //保存按钮监听事件
    layui.form.on('submit(saveOrUpdate)', function(){
        vm.saveOrUpdate();
        return false;
    });

    //批量删除
    $(".delBatch").click(function(){
        var ids = vm.selectedRows();
        if(ids == null){
            return;
        }
        vm.del(ids);
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        }else if(layEvent === 'details'){
            vm.details(data.id, data.companyNo);
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            companyName: null,   //保险公司名
        },
        editForm: false,
        detailsForm: false,
        provinceId:[],   //定义省下拉列表数据源
        cityId:[],       //定义市下拉列表数据源
        areaId:[],       //定义区下拉列表数据源
        tSysFinanceCompany: {},
        insuranceTypes:[]
    },
    created: function() {
        var _this = this;
        var cache = localStorage.getItem("globalProvinces");
        if(cache==null) {
            $.getJSON(provinceUrl+"statics/js/province.js",function(r) {
                _this.provinceId = r;
                localStorage.setItem("globalProvinces", JSON.stringify(r));
            });
        } else {
            _this.provinceId = JSON.parse(cache);
        }
    },
    updated: function(){
        $('select').removeClass('layui-form-danger');
        layui.form.render();
    },
    methods: {
        selectedRows: function () {
            var list = layui.table.checkStatus('gridid').data;
            if(list.length == 0){
                alert("请选择一条记录");
                return ;
            }
            var ids = [];
            $.each(list, function(index, item) {
                ids.push(item.id);
            });
            return ids;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q={
                companyName: null,
            };
        },
        add: function(){
            vm.tSysFinanceCompany = {};
            vm.provinceId=[];
            vm.cityId=[];
            vm.areaId=[];
            var index = layer.open({
                title: "车辆管理 > 金融公司 > 新增金融公司",
                type: 2,
                content: tabBaseURL + "modules/financecompany/financecompanyadd.html",
                end: function () {
                    layer.closeAll();
                    vm.reload();
                }
            });
            layer.full(index);
        },
        update: function (id) {
            window.localStorage.setItem("id",id);
            var index = layer.open({
                title: "车辆管理 > 金融公司 > 编辑金融公司",
                type: 2,
                content: tabBaseURL+'modules/financecompany/financecompanyedit.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        del: function (ids) {
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "system/tsysfinancecompany/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
        details: function (id,companyNo) {
            window.localStorage.setItem("id",id);
            window.localStorage.setItem("companyNo",companyNo);
            var index = layer.open({
                title: "车辆管理 > 金融公司 > 查看金融公司",
                type: 2,
                content: tabBaseURL+'modules/financecompany/financecompanydetail.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    window.localStorage.setItem("companyNo",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },
        cancel: function(){   //取消事件
            layui.form.render();
            layer.closeAll();
        },

        // exports: function () {
        //     var url = baseURL + 'system/tsysfinancecompany/export';
        //     if(vm.q.keyword != null){
        //         url += '?keyword='+vm.q.keyword;
        //     }
        //     window.location.href = url;
        // },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    companyName: vm.q.companyName,
                }
            });
        }
    }
});

