$(function () {

    vm.detail(window.localStorage.getItem("collectionsNo"));

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

        detail: function (collectionsNo) {
            $.ajax({
                type: "POST",
                url: baseURL + "sys/sysaccessory/accessoryList",
                contentType: "application/json",
                data: JSON.stringify({"objId":collectionsNo, "objType":"3","typeFile":"1"}),
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
