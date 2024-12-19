$(function () {
    vm.detail(window.localStorage.getItem("policyApplyNo"),window.localStorage.getItem("type"));
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        sysAccessoryList: []
    },
    computed: {
    },

    methods: {
        cancel: function () {
            layer.closeAll();
        },

        detail: function (policyApplyNo,type) {
            $.ajax({
                type: "POST",
                url: baseURL + "sys/sysaccessory/accessoryList",
                contentType: "application/json",
                data: JSON.stringify({"objId":policyApplyNo, "objType":type,"typeFile":"1"}),
                success: function(r){
                    vm.sysAccessoryList = r;
                    vm.initViewer();
                }
            });
        },

        initViewer : function () {
            this.$nextTick(function(){

                var viewer = new Viewer(document.getElementById('jqhtml'), {
                    url: 'data-original'
                });
            });
        }
    }
});