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
        //  defaultToolbar: ['filter'],
            url: baseURL + 'purchase/purchasesupplier/list',
            cols: [[
                {title: '操作', minWidth:125, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'supplierName', minWidth:200, title: '供应商名称',align:"center"},
                {field:'contacts', minWidth:200, title: '联系人',align:"center"},
                {field:'phone', minWidth:150, title: '联系电话',align:"center"},
                {field:'addrDetail', minWidth:200, title: '详细地址',align:"center", templet:function (d) {
                        if (d.addrDetail != null && d.addrDetail != ''){
                            return d.addrDetail;
                        } else {
                            return '--';
                        }
                    }},
                {field:'enalbe', minWidth:100, title: '状态', align:"center", templet:function (d) {
                        if (d.enalbe == 1){
                            return '已启用';
                        } else {
                            return '已禁用';
                        }
                    }},
                {field:'createTime', minWidth:200, title: '创建时间',align:"center",  templet:function (d) {
                        if (d.createTime != null && d.createTime != ''){
                            return new Date(d.createTime).format("yyyy-MM-dd hh:mm:ss");
                        } else {
                            return '--';
                        }
                    }},
                {field:'followusrName', minWidth:200,  title: '跟进人',align:"center"}

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


    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        vm.getsalesmanLst();
        vm.getStatistics();
        form.render();
    });

    //操作
    layui.table.on('tool(grid)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){
            vm.update(data.id, data.purchaseSupplierId);
        } else if(layEvent === 'del'){
            var id = [data.id];
            vm.del(id);
        }else if(layEvent === 'show'){
            vm.show(data.id, data.purchaseSupplierId);
        }
    });

    layui.use('element', function(){
        //监听Tab切换，以改变地址hash值
        layui.element.on('tab(tableLst)', function(){
            var enable= this.getAttribute('lay-id');
            vm.q.enable = enable;
            vm.reload();
        });
    });

    layui.form.on('select(followusrId)', function(data){
        var salesmanId=data.value;
        var index=data.elem.selectedIndex-1;
        vm.purchaseSupplier.followusrId = salesmanId;
        vm.purchaseSupplier.followusrName = vm.salesmanLst[index].username;
    });

    //点击下拉列表-省-事件监听
    layui.form.on('select(provinceId)',function (data) {
        vm.purchaseSupplier.provinceId = data.value;
        vm.purchaseSupplier.provinceName = vm.provinceId.filter(function(s){return s.code===data.value})[0].name;
        vm.cityId = vm.provinceId.filter(function(s){return s.code===data.value})[0].cityList;
        vm.areaId = [];
        vm.purchaseSupplier.cityId = '';
        vm.purchaseSupplier.cityName = '';
        vm.purchaseSupplier.areaId = '';
        vm.purchaseSupplier.areaName = '';
        layui.form.render();
    });
    //点击下拉列表-市-事件监听
    layui.form.on('select(cityId)',function (data) {
        vm.purchaseSupplier.cityId = data.value;
        vm.purchaseSupplier.cityName = vm.cityId.filter(function(s){return s.code===data.value})[0].name;
        vm.areaId = vm.cityId.filter(function(s){return s.code===data.value})[0].areaList;
        vm.purchaseSupplier.areaId = '';
        vm.purchaseSupplier.areaName = '';
        layui.form.render();
    });
    //点击下拉列表-区-事件监听
    layui.form.on('select(areaId)',function (data) {
        vm.purchaseSupplier.areaId = data.value;
        vm.purchaseSupplier.areaName = vm.areaId.filter(function(s){return s.code===data.value})[0].name;
    });

    layui.form.on('radio(enalbe)', function (data) {
        vm.purchaseSupplier.enalbe = data.value;
    });

    layui.upload.render({ //允许上传的文件后缀
        elem: '#imports',
        url: baseURL + 'purchase/purchasesupplier/imports',
        accept: 'file', //普通文件
        exts: 'xlsx|xls', //只允许上传excel
        done: function(r){
            alert(r.msg, function(index){
            });
            vm.query();
        }
    });
});
var viewer = null;
// var _upload = layui.upload;
// var uploadInst;
function _uploadRender(){

    layui.upload.render({
        elem: '#docFile',
        url: baseURL + 'system/tsysaccessory/uploadFile',
        data: {'path':'order_contract'},
        field:'files',
        auto:false,
        accept: 'file', //普通文件
        exts: 'pdf|jpg|png|doc|docx|xls|xlsx|zip|rar', //
        choose: function(obj){
            obj.preview(function(index, file, result){
                if(file.size>(20*1024*1024)){
                    alert("文件大小不能大于20M");
                    return;
                }
                var fileName = file.name;
                var extIndex = fileName.lastIndexOf('.');
                if (vm.fileMaps.length > 0){
                    var reg = /\((.*)\)/;
                    var tmps = vm.fileMaps.filter(function (value) {
                        var tmpName = value.fileName;
                        var res = reg.exec(tmpName);
                        return tmpName.replace(res == null || res.length == 0 ? "" : res[0], "") === fileName
                    });
                    if (tmps != null && tmps.length > 0){
                        var max = 0;
                        tmps.forEach(function (value) {
                            reg.exec(value.fileName);
                            var i = RegExp.$1;
                            if (i != null && i != ''){
                                if (i > max) max = i;
                            }
                        });
                        max++;
                        var fileCount;
                        for (var i = 0;i <= max;i++){
                            var existLst = tmps.filter(function (value) {
                                var existFileName;
                                if (i == 0){
                                    existFileName = fileName;
                                } else {
                                    existFileName = fileName.slice(0, extIndex) + "("+i+")" + fileName.slice(extIndex);
                                }
                                return existFileName === value.fileName;
                            });
                            if (existLst == null || existLst.length == 0){
                                if (i == 0){
                                    fileCount = "";
                                } else fileCount = i;
                                break;
                            }
                        }
                        if (fileCount != null && fileCount != ""){
                            fileName = fileName.slice(0, extIndex) + "("+fileCount+")" + fileName.slice(extIndex);
                        }
                    }
                }
                var fileTmp={
                    fileName:fileName,
                    fileData:result
                };
                vm.fileMaps.push(fileTmp);
                uploadRender();
            });
        },
    });
};
function uploadRender() {
    if (vm.fileMaps.length == 0){
        $('#supplierDocLst').hide();
    } else $('#supplierDocLst').show();
    var supplierDoc = $('#supplierDoc');
    $('#docFile').remove();
    supplierDoc.append('<input type="file" name="file" id="docFile" accept=".pdf,.png,.jpg,.doc,.docx,.xlsx,.xls">');
    _uploadRender();
}
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            supplierName: '',
            contacts: '',
            enable: '',
        },
        fileURL: fileURL,
        showForm: false,
        editForm: false,
        provinceId:[],   //定义省下拉列表数据源
        cityId:[],       //定义市下拉列表数据源
        areaId:[],       //定义区下拉列表数据源
        storeIdData:{},
        tStoreBasic: {},
        salesmanLst:[],
        fileMaps:[],
        // fileMaps:[{
        //     fileName:'',
        //     fileData:''
        // }],
        statistics:{
            all:0,
            enable:0,
            disable:0,
        },
        lock : false,
        purchaseSupplier: {}
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
    getsalesmanLst: function () {
        /*$.get(baseURL + "member/potentialmember/getUsers", function(r){
            vm.salesmanLst= r.sysUserEntityList;
        })*/;
    },
    getStatistics: function () {
        $.get(baseURL + "purchase/purchasesupplier/statistics", function(r){
            if (r.statistics == null || r.statistics.all == null || r.statistics.all == ''){
                vm.statistics={
                    all:0,
                    enable:0,
                    disable:0,
                }
            }else vm.statistics= r.statistics;
        });
    },
    query: function () {
        vm.reload();
    },
    download: function (url, filename) {
        // window.open(fileURL+url, '_blank');
        // vm.postDownloadFile(fileURL+url);
        // var iframe = document.createElement('iframe');
        // iframe.style.display = 'none';
        // iframe.src = fileURL+url;
        // iframe.onload = function () {
        //     document.body.removeChild(iframe)
        // };
        // document.body.appendChild(iframe)
        //
        var url = baseURL + 'purchase/purchasesupplier/download?uri='+url+"&fileName="+filename;
        window.location.href = url;
    },
    showImg: function (item) {
        if (viewer != null){
            viewer.close();
            viewer = null;
        }
        viewer = new PhotoViewer([
            {
                src: fileURL+item.url,
                title: item.fileName
            }
        ], {
            appendTo:'body',
            zIndex:99891018
        });
    },
    reset: function () {
        vm.q.supplierName = '';
        vm.q.contacts = '';
    },
    delFile: function (index) {
        vm.fileMaps.splice(index, 1);
        if (vm.fileMaps.length == 0){
            $('#supplierDocLst').hide();
        } else $('#supplierDocLst').show();
    },
    imports: function () {
    },
    // 新增
    add: function(){
        vm.fileMaps = [];
        vm.purchaseSupplier = {};
        var index = layer.open({
            title: "供应商管理 > 新增供应商",
            type: 2,
            content: tabBaseURL + "modules/purchase/purchasesupplieradd.html",
            end: function () {
                layer.closeAll();
                vm.reload();
            }
        });
        layer.full(index);
       /* uploadRender();
        vm.fileMaps = [];
        vm.purchaseSupplier = {};
        vm.purchaseSupplier.enalbe = 1;
        vm.purchaseSupplier.followusrId = sessionStorage.getItem("userId");
        vm.purchaseSupplier.followusrName = sessionStorage.getItem("username");
        var index = layer.open({
            title: "新增",
            type: 1,
            btn:['保存','取消'] ,
            content: $("#editForm"),
            btnAlign: 'c',
            end: function(){
                vm.editForm = false;
                layer.closeAll();
            },
            btn1:function (index, layero) {
                if(!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                    $(".layui-layer-btn0").addClass("layui-btn-disabled");
                    vm.saveOrUpdate();
                }
            },
            btn2:function (index, layero) {
                vm.editForm = false;
                layer.closeAll();
            }
        });
        vm.editForm = true;
        layer.full(index);*/
    },
    update: function (id,purchaseSupplierId) {
        window.localStorage.setItem("id",id);
        window.localStorage.setItem("purchaseSupplierId",purchaseSupplierId);
        var index = layer.open({
            title: "供应商管理 > 编辑供应商",
            type: 2,
            content: tabBaseURL +'modules/purchase/purchasesupplieredit.html',
            end: function(){
                layer.close(index);
                window.localStorage.setItem("id",null);
                window.localStorage.setItem("purchaseSupplierId",null);
                vm.reload();
            }
        });
        layer.full(index);


/*        $.get(baseURL + "purchase/purchasesupplier/info/"+id, function(r){
            vm.purchaseSupplier = r.purchaseSupplier;
            vm.fileMaps = vm.purchaseSupplier.fileMaps;
            //
            uploadRender();
            //
            if (vm.purchaseSupplier.provinceId != null && vm.purchaseSupplier.provinceId != ''){
                vm.cityId = vm.provinceId.filter(function(s){return s.code===vm.purchaseSupplier.provinceId})[0].cityList;
                if (vm.purchaseSupplier.cityId != null && vm.purchaseSupplier.cityId != '') {
                    vm.areaId = vm.cityId.filter(function(s){return s.code===vm.purchaseSupplier.cityId})[0].areaList;
                }
            }
        });
        var index = layer.open({
            title: "修改",
            type: 1,
            btn:['保存','取消'] ,
            content: $("#editForm"),
            btnAlign: 'c',
            end: function(){
                vm.editForm = false;
                layer.closeAll();
            },
            btn1:function (index, layero) {
                if(!$(".layui-layer-btn0").hasClass("layui-btn-disabled")) {
                    $(".layui-layer-btn0").addClass("layui-btn-disabled");
                    vm.saveOrUpdate();
                }
            },
            btn2:function (index, layero) {
                vm.editForm = false;
                layer.closeAll();
            }
        });

        vm.editForm = true;
        layer.full(index);*/
    },
    // 查看
    show:function (id,purchaseSupplierId) {
        window.localStorage.setItem("id",id);
        window.localStorage.setItem("purchaseSupplierId",purchaseSupplierId);
        var index = layer.open({
            title: "供应商管理> 查看供应商详情",
            type: 2,
            content: tabBaseURL+'modules/purchase/purchasesupplierdetail.html',
            end: function(){
                layer.close(index);
                window.localStorage.setItem("id",null);
                window.localStorage.setItem("purchaseSupplierId",null);
                vm.reload();
            }
        });
        layer.full(index);
    },

    del: function (ids) {
        confirm('确定要删除选中的记录？', function(){
            $.ajax({
                type: "POST",
                url: baseURL + "purchase/purchasesupplier/delete",
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
    saveOrUpdate: function (event) {
        if (vm.purchaseSupplier.supplierName == null || vm.purchaseSupplier.supplierName == ''){
            alert('供应商名称不能为空');
            $(".layui-layer-btn0").removeClass("layui-btn-disabled");
            return;
        }
        if (vm.purchaseSupplier.contacts == null || vm.purchaseSupplier.contacts == ''){
            alert('联系人姓名不能为空');
            $(".layui-layer-btn0").removeClass("layui-btn-disabled");
            return;
        }
        if (vm.purchaseSupplier.phone == null || vm.purchaseSupplier.phone == ''){
            alert('联系电话不能为空');
            $(".layui-layer-btn0").removeClass("layui-btn-disabled");
            return;
        }
        if (vm.fileMaps != null && vm.fileMaps.length != 0){
            if (vm.fileMaps.filter(function (value) {
                var extIndex = value.fileName.lastIndexOf('.');
                var ext = value.fileName.slice(extIndex);
                return ext === '.jpg' || ext === '.png';
            }).length > 5){
                alert('图片不能超过5张');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
        }
        vm.purchaseSupplier.fileMaps = vm.fileMaps;
        var url = vm.purchaseSupplier.id == null ? "purchase/purchasesupplier/save" : "purchase/purchasesupplier/update";
        $.ajax({
            type: "POST",
            url: baseURL + url,
            contentType: "application/json",
            data: JSON.stringify(vm.purchaseSupplier),
            success: function(r){
                if(r.code === 0){
                    alert('操作成功', function(index){
                        layer.closeAll();
                        vm.reload();
                    });
                }else{
                    alert(r.msg, function(index){
                        $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    });
                }
            }
        });
    },
    exports: function () {
        var url = baseURL + 'purchase/purchasesupplier/export?a=a';
        if(vm.q.supplierName != null){
            url += '&supplierName='+vm.q.supplierName;
        }
        if(vm.q.contacts != null){
            url += '&contacts='+vm.q.contacts;
        }
        if(vm.q.enable != null){
            url += '&enable='+vm.q.enable;
        }
        window.location.href = url;
    },
    /**
     * 下载导出模板
     */
    importTemplate: function (){
        window.location.href = baseURL + 'purchase/purchasesupplier/importTemplate';
    },
    reload: function (event) {
        vm.getStatistics();
        layui.table.reload('gridid', {
            page: {
                curr: 1
            },
            where: {
                supplierName: vm.q.supplierName,
                contacts: vm.q.contacts,
                enable: vm.q.enable,
            }
        });
    },
    postDownloadFile: function(url){
        var form = document.createElement('form');
        form.action = url;
        form.method = 'post';
        form.target = 'blank';
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}
});
