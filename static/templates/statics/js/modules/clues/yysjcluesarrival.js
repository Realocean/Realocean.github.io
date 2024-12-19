$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.form.on('select(arrivalStatus)', function (data) {
        vm.clues.arrivalStatus = data.value;
    });layui.form.on('select(arrivalDealId)', function (data) {
        vm.clues.arrivalDealId = data.value;
        vm.clues.arrivalDealName = data.elem[data.elem.selectedIndex].text;;
    });
    layui.form.verify({
        arrivalStatusVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value == '') {
                    return "请选择是否到店";
                }
        },
        arrivalDealIdVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (value == null || value == '') {
                    return "请选择处理人";
                }
        },
        arrivalTimeVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
            if(vm.clues.arrivalStatus == 2){
                if (value == null || value == '') {
                    return "到店时间不能为空";
                }
            }
        },
    });
    layui.form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });

    layui.laydate.render({
        elem: '#arrivalTime',
        format: 'yyyy-MM-dd HH:mm:ss',
        type: 'datetime',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.clues.arrivalTime = value;
        }
    });

});

var vm = new Vue({
    el:'#rrapp',
    data:{
        clues: {arrivalStatus:2,"arrivalDealId":sessionStorage.getItem("userId"),"arrivalDealName":sessionStorage.getItem("username")},
        userList:[]
    },
    created: function(){
        var _this = this;
        $.get(baseURL + "sys/user/usrLst",function(r){
            _this.userList=r.usrLst;
        });
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            PageLoading();
            console.log(vm.clues);
            $.ajax({
                type: "POST",
                url: baseURL + "clues/cluessourcedrive/arrival",
                contentType: "application/json",
                data: JSON.stringify(vm.clues),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('处理成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        }
    }
});
function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}


