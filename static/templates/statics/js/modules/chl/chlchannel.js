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
            url: baseURL + 'chl/chlchannel/list',
        //  toolbar: true,
        //  defaultToolbar: ['filter'],
            cols: [[
                {title: '操作', minWidth:220, templet:'#barTpl',fixed:"left",align:"center"},
                {field:'channelName',align:"center", minWidth:180, title: '渠道商名称', templet:function (d) {
                        if (d.channelName != null && d.channelName != ''){
                            return d.channelName;
                        } else {
                            return '--';
                        }
                    }},
                {field:'contacts',align:"center", minWidth:150, title: '联系人', templet:function (d) {
                        if (d.contacts != null && d.contacts != ''){
                            return d.contacts;
                        } else {
                            return '--';
                        }
                    }},
                {field:'phone', align:"center",minWidth:120, title: '联系电话', templet:function (d) {
                        if (d.phone != null && d.phone != ''){
                            return d.phone;
                        } else {
                            return '--';
                        }
                    }},
                {field:'consociationStatus',align:"center", minWidth:120, title: '合作状态', templet:function (d) {
                        return transformTypeByMap(d.consociationStatus, {1:'合作中', 2:'已解除合作', 3:'合作申请中', 4:'取消合作'});
                    },
                },
                {field:'billType',align:"center", minWidth:120, title: '账单类型', templet:function (d) {
                        return transformTypeByMap(d.billType, {0:'无', 1:'自然月计算', 2:'自然月计算（具体时间可以配置）', 3:'固定30日', 4:'满月计算'});
                    },
                },
                {field:'salesmanName',align:"center", minWidth:120, title: '业务员', templet:function (d) {
                        if (d.salesmanName != null && d.salesmanName != ''){
                            return d.salesmanName;
                        } else {
                            return '--';
                        }
                    },},
                {field:'deptName',align:"center", minWidth:240, title: '所属部门', templet:function (d) {
                        if (d.deptName != null && d.deptName != ''){
                            return d.deptName;
                        } else {
                            return '--';
                        }
                    },},
                {field:'createTime',align:"center", minWidth:180, title: '创建时间', templet:function (d) {
                        if(d.createTime!=null){
                            var date=new Date(d.createTime).format("yyyy-MM-dd hh:mm:ss");
                            return  date;
                        }else {
                            return "--";
                        }
                    }}
            ]],
            page: true,
            loading: true,
            limits: [10,20, 50, 100],
            limit: 10,
           /* autoColumnWidth: {
                init: true
            },*/
            done: function () {
                soulTable.render(this);
            }
        })
    });


    layui.use(['form'], function(){
        var form = layui.form;
        vm.getsalesmanLst();
        form.render();
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
        }else if(layEvent === 'show'){
            vm.show(data.id,data.chlNo);
        }else if(layEvent === 'generateWxQrcode'){
            vm.generateWxQrcode(data);
        }
    });

    layui.form.on('select(salesmanId)', function(data){
        var salesmanId=data.value;
        if (vm.editForm) {
            var index=data.elem.selectedIndex-1;
            vm.chlChannel.salesmanId = salesmanId;
            vm.chlChannel.salesmanName = vm.salesmanLst[index].username;
        }else vm.q.salesmanId =salesmanId;
    });

    layui.form.on('select(consociationStatus)', function(data){
        vm.q.consociationStatus=data.value;
    });

    layui.form.on('radio(status)', function(data){
        vm.chlChannel.status=data.value;
    });

    layui.form.on('select(saId)', function(data){
        vm.q.salesmanId=data.value;
    });


});
var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            channelName: null,
            contacts: null,
            phone: null,
            salesmanId: null,
            storeId: null,
            consociationStatus: null,
        },
        showForm: false,
        editForm: false,
        isFilter: false,
        chlChannel: {},
        salesmanLst:[],
        fileMaps:[],
        imageURL: imageURL,
    },

    created: function(){
        $.ajax({
            type: "POST",
            url: baseURL + "/sys/user/usrLst",
            contentType: "application/json",
            data:null,
            success: function(r){
                vm.salesmanLst= r.usrLst;
            }
        });

    },

    updated: function(){
        layui.form.render();
    },
    methods: {
        bindFilter: function () {
            this.isFilter = !this.isFilter;
        },
        query: function () {
            vm.reload();
        },
        reset: function () {
            vm.q={
                channelName: null,
                contacts: null,
                phone: null,
                salesmanId: null,
                storeId: null,
                consociationStatus: null
            };
        },
        delFile: function (index) {
            vm.fileMaps.splice(index, 1);
            if (vm.fileMaps.length == 0){
                $('#chlDocLst').hide();
            } else $('#chlDocLst').show();
        },
        getsalesmanLst: function () {
           /* $.get(baseURL + "member/potentialmember/getUsers/1", function(r){
                vm.salesmanLst= r.sysUserEntityList;
            });*/
        },
        add: function(){
            vm.chlChannel = {};
            vm.fileMaps = [];
            //uploadRender();
            var index = layer.open({
                title: "客户资料 > 渠道商列表 > 新增渠道商",
                type: 2,
                content: tabBaseURL + "modules/chl/chlchanneladd.html",
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
                title: "客户资料 > 渠道商列表 > 编辑渠道商",
                type: 2,
                content: tabBaseURL+'modules/chl/chlchanneledit.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },

        show:function (id,chlNo) {
            window.localStorage.setItem("id",id);
            window.localStorage.setItem("chlNo",chlNo);
            var index = layer.open({
                title: "客户资料 > 渠道商列表 > 查看渠道商",
                type: 2,
                content: tabBaseURL+'modules/chl/chlchanneldetail.html',
                end: function(){
                    layer.close(index);
                    window.localStorage.setItem("id",null);
                    window.localStorage.setItem("chlNo",null);
                    vm.reload();
                }
            });
            layer.full(index);
        },

/*        saveOrUpdate: function (event) {
            var url = vm.chlChannel.id == null ? "chl/chlchannel/save" : "chl/chlchannel/update";
            if (vm.chlChannel.channelName == null || vm.chlChannel.channelName == ''){
                alert('请输入渠道商名');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.chlChannel.salesmanId == null || vm.chlChannel.salesmanId == ''){
                alert('请选择业务员');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.chlChannel.imgBusinessLicense == null || vm.chlChannel.imgBusinessLicense == ''){
                alert('请上传营业执照');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.chlChannel.contacts == null || vm.chlChannel.contacts == ''){
                alert('请输入联系人');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if (vm.chlChannel.phone == null || vm.chlChannel.phone == ''){
                alert('请输入联系电话');
                $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                return;
            }
            if(vm.chlChannel.phone !=null){
                var pattern = /^1[34578]\d{9}$/;
                var value=vm.chlChannel.phone;
                if(!pattern.test(value)){
                    alert('联系电话号码不合法');
                    $(".layui-layer-btn0").removeClass("layui-btn-disabled");
                    return ;
                }
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
            vm.chlChannel.fileMaps = vm.fileMaps;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.chlChannel),
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
        },*/
        generateWxQrcode:function(data){
            $.ajax({
                type: "POST",
                url: baseURL + "chl/chlchannel/generateWxQrcode",
                data: {channelId:data.id},
                async: false,
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
        },
        extf: function () {
            var url = baseURL + 'chl/chlchannel/export?a=a';
            if(vm.q != null){
                if (vm.q.channelName != null && vm.q.channelName != '') {
                    url += '&channelName=' + vm.q.channelName;
                }
                if (vm.q.contacts != null && vm.q.contacts != '') {
                    url += '&contacts=' + vm.q.contacts;
                }
                if (vm.q.phone != null && vm.q.phone != '') {
                    url += '&phone=' + vm.q.phone;
                }
                if (vm.q.salesmanId != null && vm.q.salesmanId != '') {
                    url += '&salesmanId=' + vm.q.salesmanId;
                }
                if (vm.q.consociationStatus != null && vm.q.consociationStatus != '') {
                    url += '&consociationStatus=' + vm.q.consociationStatus;
                }
            }
            window.location.href = url;
        },



        exports: function () {
            var url = baseURL + 'chl/chlchannel/export?a=a';
            // var url = baseURL + 'chl/chlchannel/exportList?a=a';
            if(vm.q != null){
                if (vm.q.channelName != null && vm.q.channelName != '') {
                    url += '&channelName=' + vm.q.channelName;
                }
                if (vm.q.contacts != null && vm.q.contacts != '') {
                    url += '&contacts=' + vm.q.contacts;
                }
                if (vm.q.phone != null && vm.q.phone != '') {
                    url += '&phone=' + vm.q.phone;
                }
                if (vm.q.salesmanId != null && vm.q.salesmanId != '') {
                    url += '&salesmanId=' + vm.q.salesmanId;
                }
                if (vm.q.consociationStatus != null && vm.q.consociationStatus != '') {
                    url += '&consociationStatus=' + vm.q.consociationStatus;
                }
                /*if (vm.q.storeId != null && vm.q.storeId != '') {
                    url += '&storeId=' + vm.q.storeId;
                }*/
            }
            window.location.href = url;
            /*$.get(url, function(r){
                var datas=r;
                if (datas == null || datas.length < 1){
                    alert('无数据', function(){

                    });
                }else {
                    datas.unshift({channelName: '渠道商名称',contacts:'联系人',phone:'联系电话',addrDetail:'详细地址',salesmanName:'业务员名称'/!*,storeName:'所属城市'*!/});
                    //过滤多余的列
                    datas = layui.excel.filterExportData(datas,{channelName:'channelName',contacts:'contacts',
                        phone:'phone',addrDetail:'addrDetail',salesmanName:'salesmanName'/!*,storeName:'storeName'*!/
                    });
                    layui.excel.exportExcel({
                        sheet1: datas
                    }, '渠道商数据.xlsx', 'xlsx');
                }
            });*/
        },
        download: function (url, filename) {
            var url = baseURL + 'chl/chlchannel/download?uri='+imageSaveURL+url+"&fileName="+filename;
            window.location.href = url;
        },
        showImg1: function (url, fileName) {
            // if (url == null || url == ''){
            //     alert('无数据');
            //     return;
            // }
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: imageURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
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
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: {
                    channelName: vm.q.channelName,
                    contacts: vm.q.contacts,
                    phone: vm.q.phone,
                    salesmanId: vm.q.salesmanId,
                    consociationStatus: vm.q.consociationStatus,
                    //   storeId: vm.q.storeId,
                }
            });
        }
    }
});
