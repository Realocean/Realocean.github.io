$(function () {

    vm.detail(window.localStorage.getItem("objId"),window.localStorage.getItem("objType"));

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

        detail: function (objId,objType) {
            $.ajax({
                type: "POST",
                url: baseURL + "sys/sysaccessory/accessoryList",
                contentType: "application/json",
                data: JSON.stringify({"objId":objId, "objType":objType,"typeFile":"1"}),
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
