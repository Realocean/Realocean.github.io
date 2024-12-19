$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init(layui);
        layui.form.render();
    });
});

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        supplyManagement: {
            jumpType:2,
            projectStatus:1
        },
        //图片查看相关
        dialogVisible: false,
        fileList:[],
        listImage:[],
        handoveruserlist:[],
        hideUploadEdit:false
    },
    created: function(){
        var _this = this;
      /*  var param = parent.layer.boxParams.boxParams;
        _this.supplyManagement = param.data;*/

    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if(vm.supplyManagement.jumpType==1){
                if(vm.supplyManagement.connectionAddress==null || vm.supplyManagement.connectionAddress==''){
                    alert("外部链接地址不能为空!")
                    return ;
                }
                var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if(!reg.test(vm.supplyManagement.connectionAddress)){
                    alert("外部链接网址不正确") ;
                    return ;
                }


                if(vm.supplyManagement.listImage==null || vm.supplyManagement.listImage==''){
                    alert("活动列表图片不能为空!")
                    return ;
                }
            }
            if(vm.supplyManagement.projectName==null || vm.supplyManagement.projectName==''){
                alert("项目名称不能为空!");
                return ;
            }
            if(vm.supplyManagement.jumpType==2){
                if(vm.supplyManagement.contact==null || vm.supplyManagement.contact==''){
                    alert("联系人不能为空!");
                    return ;
                }
            }

            if(vm.supplyManagement.vehicleNumber!=null && vm.supplyManagement.vehicleNumber!=''){
                var reg=/^[1-9]\d*$/;
                if(!reg.test(vm.supplyManagement.vehicleNumber)){
                    alert("所需车辆数只能输入大于0的整数");
                    return;
                }
            }
            //项目跳转类型  2.内部展示  1.外部链接
            if(vm.supplyManagement.jumpType==2){
                if(vm.supplyManagement.vehicleRequirements==null || vm.supplyManagement.vehicleRequirements==''){
                    alert("所需车辆要求不能为空!");
                    return ;
                }
            }

            if((vm.supplyManagement.registrationStartTime!=null && vm.supplyManagement.registrationStartTime!='') && (vm.supplyManagement.registrationClosingTime!=null && vm.supplyManagement.registrationClosingTime!='')){
                if(vm.supplyManagement.registrationClosingTime <= vm.supplyManagement.registrationStartTime){
                    alert("报名结束时间不能小于等于报名开始时间");
                    return ;
                }
            }

            var url = vm.supplyManagement.supplyManagementId == null ? "supplymanagement/supplymanagement/save" : "supplymanagement/supplymanagement/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.supplyManagement),
                success: function(r){
                    RemoveLoading();
                    if(r.code === 0){
                        alert('操作成功', function(index){
                            closePage();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        // 查看大图
        handlePictureCardPreview(item) {
            this.dialogVisible = true
        },
        // 删除
        handleRemove(file, fileList) {
            vm.hideUploadEdit=false;
            vm.supplyManagement.listImage=null;
        },
        // 上传
        handlechange(file, fileList) {
            if(!this.beforeAvatarUpload(file)) return  false;
            var formData = new FormData();
            formData.append("files", file.raw);
            formData.append("path", 'activity');

            $.ajax({
                type: "POST",
                url: baseURL + '/file/uploadFile',
                contentType: false,
                processData: false,
                data: formData,
                success: function (r) {
                   vm.supplyManagement.listImage=r.data[0];
                   vm.hideUploadEdit=true;
                },
                error: function () {
                    layer.msg('上传失败', {icon: 5});
                    vm.hideUploadEdit = false;
                }
            });
        },
        beforeAvatarUpload(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
            const extension =
                testmsg === "jpg" ||
                testmsg === "JPG" ||
                testmsg === "png" ||
                testmsg === "PNG" ;
            const isLt50M = file.size / 1024 / 1024 < 5;
            if (!extension) {
                this.$message({
                    message: "上传图片只能是jpg/png格式!",
                    type: "error",
                });
                return false; //必须加上return false; 才能阻止
            }
            if (!isLt50M) {
                this.$message({
                    message: "上传文件大小不能超过 5MB!",
                    type: "error"
                });
                return false;
            }
            return extension || isLt50M;
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '350px'],
                shade: 0,
                shadeClose: false,
                content: $("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    vm.supplyManagement.deptId = node[0].deptId;
                    vm.supplyManagement.deptName = node[0].name;
                    vm.getUserList(vm.supplyManagement.deptId);
                    layer.close(index);
                },
                end: function(){
                    $("#deptLayer").hide();
                }
            });
        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                if(vm.supplyManagement.deptId != null && vm.supplyManagement.deptId != undefined){
                    var node = ztree.getNodeByParam("deptId", vm.supplyManagement.deptId);
                    if(node != null){
                        ztree.selectNode(node);
                        vm.supplyManagement.deptName = node.name;
                    }
                }
            })
        },
        getUserList :function(deptId){
            vm.handoveruserlist=[];
            $.ajax({
                async :false,
                type: "GET",
                url: baseURL + "sys/user/listall?deptId="+deptId,
                success: function(r){
                    vm.handoveruserlist=r.userList;
                }
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {
    vm.getDept();

    $("#connectionAddress").hide();
    $("#listImage").hide();

    //初始化富文本编辑器
    const E = window.wangEditor;
    editor = new E('#Editor')
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '自定义 placeholder 提示文字';
    // 图片上传
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        const formData = new FormData();
        formData.append("files", resultFiles[0]);
        formData.append("path", 'activity');
        //图片名称
        var  fileName = resultFiles[0].name;

        var extIndex = fileName.lastIndexOf('.');
        var ext = fileName.slice(extIndex);
        var fileNameNotext = fileName.slice(0, extIndex);
        var regExt = /png|jpg|jpeg/;
        var fileType = regExt.test(ext) ? 1:0;

        $.ajax({
            type: "POST",
            url: baseURL + '/file/uploadFile',
            contentType: false,
            processData: false,
            data: formData,
            success: function (r) {
                const activeFile = {
                    id: uuid(6),
                    url: r.data[0],
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc:'热门活动富文本图片',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };
                vm.richTextPhotoList.push(activeFile);
                insertImgFn(imageURL+r.data[0])
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });

    }
    editor.create();

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}


function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
    });
    //项目跳转类型(1外部链接，2内部链接)
    form.on('radio(jumpType)', function(data){
        vm.supplyManagement.jumpType = data.value;
        if(data.value==1){
            $("#connectionAddress").show();
            $("#listImage").show();
        }
        if(data.value==2){
            $("#connectionAddress").hide();
            $("#listImage").hide();
        }
    });

    //项目状态
    form.on('switch(projectStatus_filter)', function(data){
        //活动状态(1可用，0禁用)默认可用；
        if(data.elem.checked){
            vm.supplyManagement.projectStatus = 1;
        }else{
            vm.supplyManagement.projectStatus=0;
        }
    });

    //短信接收人
    form.on('select(handoverUserId)', function(data){
        vm.supplyManagement.sysUserId=data.value;
    });

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () { });
}

function initTable(table, soulTable) {
    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {
    Date.prototype.toLocaleStringTomorrow = function() {
        var y = this.getFullYear();
        var m = this.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        //   var d = (this.getDate() + 1);
        var d = (this.getDate());
        d = d < 10 ? ("0" + d) : d;
        return y + "-" + m + "-" + d;
    }
    var tomorrowTime = (new Date()).toLocaleStringTomorrow();

    //报名开始时间
    laydate.render({
        elem: '#registrationStartTime',
        type : 'date',
        trigger: 'click',
        min: tomorrowTime,
        max: '2888-12-31',
        done: function (value, date, endDate) {
            vm.supplyManagement.registrationStartTime = value;
        }
    });

    //报名结束时间
    laydate.render({
        elem: '#registrationClosingTime',
        type : 'date',
        trigger: 'click',
        min: tomorrowTime,
        max: '2888-12-31',
        done: function (value, date, endDate) {
            vm.supplyManagement.registrationClosingTime = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

//金额输入处理
function moneyInput(value) {
    //修复第一个字符是小数点 的情况.
    let fa = '';
    if (value !== '' && value.substr(0, 1) === '.') {
        value = "";
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf(".") < 0 && value !== "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) === '0' && value.length === 2) {
            value = value.substr(1, value.length);
        }
    }
    value = fa + value;
    return value;
}


function sendData(supplyManagement){

    vm.supplyManagement=supplyManagement;
    //活动列表图片
    var  listImage=supplyManagement.listImage;
    if(listImage!=null && listImage!=''){
        vm.fileList.push({url:imageURL+listImage});
        vm.hideUploadEdit=true;
    }else {
        vm.hideUploadEdit=false;
    }



    if(supplyManagement.jumpType==1){
        $("#connectionAddress").show();
        $("#listImage").show();
    }
    if(supplyManagement.jumpType==2){
        $("#connectionAddress").hide();
        $("#listImage").hide();
    }

    if(vm.supplyManagement.deptId!=null){
        vm.getUserList(vm.supplyManagement.deptId);
    }
}