$(function () {
    vm.detail(window.localStorage.getItem("id"));
    var objId = window.localStorage.getItem("chlNo");

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#yslogid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': objId, 'auditType':12},
        cols: [[
            {
                field: 'operatorName', align: "center", title: '操作人', templet: function (d) {
                    return isEmpty(d.operatorName);
                }
            },
            {
                field: 'memo', align: "center", title: '操作内容', templet: function (d) {
                    return isEmpty(d.memo);
                }
            },
            {
                field: 'operatorTime', align: "center", title: '操作时间', templet: function (d) {
                    return isEmpty(d.operatorTime);
                }
            }
        ]],
        page: true,
        limits: [10, 20, 100, 200],
        limit: 10
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        detailForm:true,
        chlChannel:{},
        detailsTabContentList: ['渠道商详情',  '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '渠道商详情',
        yyzzFileList:[],
        frsfFileList:[],
        fjList:[],
        fileLstId: '0'
    },
    computed:{

    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.chlChannel = param.chlChannel;
        if (_this.chlChannel.yyzzFileList != null){
            _this.yyzzFileList = _this.chlChannel.yyzzFileList;
        }
        if (_this.chlChannel.frsfFileList != null){
            _this.frsfFileList = _this.chlChannel.frsfFileList;
        }
        if (_this.chlChannel.fjList != null){
            _this.fjList = _this.chlChannel.fjList;
        }
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '渠道商详情';
            }
        },

        detailsSupTabContentBindtap(param, val) {
            this.detailsSupTabContentListActiveIndex = param;
            this.detailsSupTabContentListActiveValue = val;
        },

        // 取消
        cancel:function(){
            vm.detailForm = false;
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        },

        // 查看详情
        detail: function (id) {
            $.ajax({
                type: "POST",
                url: baseURL + "chl/chlchannel/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        vm.chlChannel = r.chlChannel;
                        vm.yyzzFileList = vm.chlChannel.yyzzFileList;
                        if(vm.yyzzFileList.length == 0){
                            $("#qdsmodel1").hide();
                        }
                        vm.frsfFileList = vm.chlChannel.frsfFileList;
                        if(vm.frsfFileList.length == 0){
                            $("#qdsmodel2").hide();
                        }
                        vm.fjList = vm.chlChannel.fjList;
                        if(vm.fjList.length == 0){
                            $("#qdsmodel3").hide();
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

        // 附件查看
        viewAccessory:function(objType){
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.chlChannel.chlNo);
            window.localStorage.setItem("objCode", vm.chlChannel.id);
            var index = layer.open({
                title: "客户资料 > 渠道商列表 >查看渠道商详情 > 附件查看",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/common/viewAccessories.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("objCode", null);
                }
            });
            layer.full(index);
        },

/*        download:function(objType){
            console.log(objType);
            window.localStorage.setItem("objId", vm.chlChannel.chlNo);
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("typeFile", 2);
            var index = layer.open({
                title: "客户资料 > 渠道商列表 >查看渠道商详情>文档下载",
                type: 2,
                area: ['1070px', '360px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/financial/collectiondocdownload.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                    window.localStorage.setItem("typeFile", null);
                }
            });
            layer.full(index);
        },*/

       /* preview:function(objType){
            console.log(objType);
            window.localStorage.setItem("objType", objType);
            window.localStorage.setItem("objId", vm.chlChannel.chlNo);
            var index = layer.open({
                title: "客户资料 > 渠道商列表 >查看渠道商详情>图片预览",
                type: 2,
                area: ['850px', '530px'],
                fixed: false, //不固定
                maxmin: true,
                content: tabBaseURL + 'modules/carrepairorder/carrepairorderpictureDetail.html',
                end: function () {
                    layer.close(index);
                    window.localStorage.setItem("objId", null);
                    window.localStorage.setItem("objType", null);
                }
            });
            layer.full(index);
        },*/

    }
});
