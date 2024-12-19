var viewer = null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        docLst: [],
        contactLst: [],
        supplier: {}
    },
    computed:{
        natureStr:{
            get:function() {
                if(this.supplier.nature==1) {
                    return "合资";
                } else if(this.supplier.nature==2){
                    return "独资";
                } else if(this.supplier.nature==3){
                    return "国有";
                } else if(this.supplier.nature==4){
                    return "私营";
                } else if(this.supplier.nature==5){
                    return "全民所有制";
                } else if(this.supplier.nature==6){
                    return "集体所有制";
                } else if(this.supplier.nature==7){
                    return "股份制";
                } else if(this.supplier.nature==8){
                    return "有限责任";
                } else{
                    return "--";
                }
            }
        },
        typeStr:{
            get:function() {
                if(this.supplier.type==1) {
                    return "内部";
                } else if(this.supplier.type==2){
                    return "外部";
                } else{
                    return "--";
                }
            }
        },
        settlementStr:{
            get:function() {
                if(this.supplier.settlement==1) {
                    return "后付";
                } else if(this.supplier.settlement==2){
                    return "预付";
                } else{
                    return "--";
                }
            }
        },
        auditStatusStr:{
            get:function() {
                if(this.supplier.auditStatus==0) {
                    return "草稿";
                } else if(this.supplier.auditStatus==1){
                    return "审核中";
                } else if(this.supplier.auditStatus==2){
                    return "已审核";
                } else if(this.supplier.auditStatus==3){
                    return "审核不通过";
                } else if(this.supplier.auditStatus==4){
                    return "已驳回";
                } else{
                    return "--";
                }
            }
        },
        isUseStr:{
            get:function() {
                if(this.supplier.isUse==0) {
                    return "启用";
                } else if(this.supplier.isUse==1){
                    return "停用";
                }
            }
        },
    },
    updated: function(){
        layui.form.render();
    },
    mounted: function(){
        this.initPage();
    },
    methods: {
        initPage: function() {
            var businessId = window.localStorage.getItem("businessId");
            $.get(baseURL + "supplier/supplier/info/"+businessId, function(r){
                vm.supplier = r.supplier;
                vm.contactLst = r.supplier.contactLst;
                vm.docLst = r.supplier.docLst;
                vm.supplier.updateUserId = sessionStorage.userId;
                vm.supplier.updateUserName = sessionStorage.username;
            });
        },
        showDoc: function (url, fileName) {
            if (viewer != null){
                viewer.close();
                viewer = null;
            }
            viewer = new PhotoViewer([
                {
                    src: fileURL+url,
                    title: fileName
                }
            ], {
                appendTo:'body',
                zIndex:99891018
            });
        },
        downDoc: function (url, fileName) {
            var uri = baseURL + 'company/tcompanycustomer/download?uri=' + url + "&fileName=" + fileName;
            window.location.href = uri;
        }
    }
});
