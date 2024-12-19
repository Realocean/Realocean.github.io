$(function () {
    vm.detail(window.localStorage.getItem("id"));
    var objId = window.localStorage.getItem("companyNo");

    //操作日志
    layui.table.render({
        id: "gridid",
        elem: '#yslogid',
    //  toolbar: true,
    //  defaultToolbar: ['filter'],
        url: baseURL + 'sys/operationlog/list',
        where: {'businessNo': objId, 'auditType':77},
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
        limits: [10, 20, 50, 100],
        limit: 10
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        detailForm:true,
        tSysFinanceCompany:{},
        detailsTabContentList: ['金融公司详情',  '操作记录'],
        detailsTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveIndex: 0,
        detailsSupTabContentListActiveValue: '金融公司详情'
    },
    created: function(){
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
        detailsTabContentBindtap(param) {
            this.detailsTabContentListActiveIndex = param;
            if (param === 1) {
                this.detailsSupTabContentListActiveValue = '操作记录';
            } else if (param === 0) {
                this.detailsSupTabContentListActiveIndex = 0;
                this.detailsSupTabContentListActiveValue = '金融公司详情';
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
                url: baseURL + "system/tsysfinancecompany/info/"+id,
                contentType: "application/json",
                data: null,
                success: function(r){
                    if(r.code === 0){
                        try {
                            vm.cityId = vm.provinceId.filter(function(s){return s.code===r.tSysFinanceCompany.provinceId})[0].cityList;
                        }catch (e) {

                        }
                        try {
                            vm.areaId = vm.cityId.filter(function(s){return s.code===r.tSysFinanceCompany.cityId})[0].areaList;
                        }catch (e) {

                        }

                        vm.tSysFinanceCompany = r.tSysFinanceCompany;
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },

    }
});