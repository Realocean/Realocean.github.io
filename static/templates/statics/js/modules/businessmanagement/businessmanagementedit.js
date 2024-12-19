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

var  editor=null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        businessManagement: {
            moduleType:1,
            jumpTypeQY:2,
            jumpTypeHX:1,
            jumpTypeCX:1,
            isEnable:1
        },
        moduleTypeList:[],
        activity:{},
        //图片查看相关
        dialogVisible: false,
        //活动列表图片数据
        fileList: [],
        hideUploadEdit:false,
        verify: false
    },
    created: function(){
        var _this = this;
        $.getJSON(baseURL + "sys/dict/getInfoByType/"+"moduleType", function (r) {
                vm.moduleTypeList = r.dict;
        })
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            //图片数据集合
            //vm.businessManagement.listImage=vm.fileLst;
            //企业介绍
            if(vm.businessManagement.moduleType==1){
                if(vm.businessManagement.jumpTypeQY==2){
                    vm.businessManagement.internalJump=editor.txt.html();
                    if(vm.businessManagement.internalJump==null || vm.businessManagement.internalJump==''){
                        alert("富文本内容不能为空!");
                        return ;
                    }
                }
                vm.businessManagement.jumpType=vm.businessManagement.jumpTypeQY;
            }
            //核心业务
            if(vm.businessManagement.moduleType==2){
                //外部链接
                if(vm.businessManagement.jumpTypeHX==1){
                    if(vm.businessManagement.jimpLink==null || vm.businessManagement.jimpLink==''){
                        alert("跳转链接不能为空!");
                        return ;
                    }

                    var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                    if(!reg.test(vm.businessManagement.jimpLink)){
                        alert("跳转链接网址不正确") ;
                        return ;
                    }

                }
                //内部链接
                if(vm.businessManagement.jumpTypeHX==2){
                    vm.businessManagement.internalJump=editor.txt.html();
                    if(vm.businessManagement.internalJump==null || vm.businessManagement.internalJump==''){
                        alert("富文本内容不能为空!");
                        return ;
                    }
                }
                //产品跳转
                if(vm.businessManagement.jumpTypeHX==3){
                    if(vm.businessManagement.productJump==null || vm.businessManagement.productJump==''){
                        alert("产品跳转内容不能为空!");
                        return ;
                    }
                }
                //活动名称
                if(vm.businessManagement.activityName==null ||vm.businessManagement.activityName==''){
                    alert("活动名称不能为空!");
                    return ;
                }
                if(vm.businessManagement.sort!=null && vm.businessManagement.sort!=''){
                    var reg=/^[1-9]\d*$/;
                    if(!reg.test(vm.businessManagement.sort)){
                        alert("活动位置只能输入大于0的整数");
                        return;
                    }
                }
                //活动列表图片
                if(vm.businessManagement.listImage==null ||vm.businessManagement.listImage==''){
                    alert("活动列表图片不能为空!");
                    return ;
                }

                //跳转类型
                vm.businessManagement.jumpType=vm.businessManagement.jumpTypeHX;
            }

            //车系介绍
            if(vm.businessManagement.moduleType==3){
                //外部链接
                if(vm.businessManagement.jumpTypeCX==1){
                    if(vm.businessManagement.jimpLink==null || vm.businessManagement.jimpLink==''){
                        alert("跳转链接不能为空!");
                        return ;
                    }
                    var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                    if(!reg.test(vm.businessManagement.jimpLink)){
                        alert("跳转链接网址不正确") ;
                        return ;
                    }

                }
                //内部链接
                if(vm.businessManagement.jumpTypeCX==2){
                    vm.businessManagement.internalJump=editor.txt.html();
                    if(vm.businessManagement.internalJump==null || vm.businessManagement.internalJump==''){
                        alert("富文本内容不能为空!");
                        return ;
                    }
                }
                //产品跳转
                if(vm.businessManagement.jumpTypeCX==3){
                    vm.businessManagement.productJump=vm.activity.productJump;
                    if(vm.businessManagement.productJump==null || vm.businessManagement.productJump==''){
                        alert("产品跳转内容不能为空!");
                        return ;
                    }
                }
                //活动名称
                if(vm.businessManagement.activityName==null ||vm.businessManagement.activityName==''){
                    alert("活动名称不能为空!");
                    return ;
                }
                if(vm.businessManagement.sort!=null && vm.businessManagement.sort!=''){
                    var reg=/^[1-9]\d*$/;
                    if(!reg.test(vm.businessManagement.sort)){
                        alert("活动位置只能输入大于0的整数");
                        return;
                    }
                }
                //活动列表图片
                if(vm.businessManagement.listImage==null ||vm.businessManagement.listImage.length==0){
                    alert("活动列表图片不能为空!");
                    return ;
                }
                //跳转类型
                vm.businessManagement.jumpType=vm.businessManagement.jumpTypeCX;
            }
            var url = vm.businessManagement.businessId == null ? "businessmanagement/businessmanagement/save" : "businessmanagement/businessmanagement/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.businessManagement),
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
        selectScheme:function(){
            var index = layer.open({
                title:"选择绑定车辆品牌/车系/车型",
                type: 2,
                //  area: ['95%', '95%'],
                content: tabBaseURL + "modules/activity/selectscheme.html",
                end: function(){}
            });
            layer.full(index);

        },
        // 查看大图
        handlePictureCardPreview(item) {
            this.dialogVisible = true
        },
        // 删除
        handleRemove(file, fileList) {
            vm.hideUploadEdit=false;
            vm.businessManagement.listImage=null;
        },
        // 上传
        handlechange(file, fileList) {
            if(!this.beforeAvatarUpload(file)) return  false;
            var formData = new FormData();
            formData.append("files", file.raw);
            formData.append("path", 'business_management');

            $.ajax({
                type: "POST",
                url: baseURL + '/file/uploadFile',
                contentType: false,
                processData: false,
                data: formData,
                success: function (r) {
                    vm.businessManagement.listImage = r.data[0];
                    vm.hideUploadEdit = true;
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
        }
    }
});

function init(layui) {
  //  initTable(layui.table, layui.soulTable);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {
    //活动列表图片
    vm.fileList = [];

    //初始化隐藏相关字段
    $("#jumpTypeDivHX").hide();
    $("#jumpTypeDivCX").hide();
    $("#jimpLinkDiv").hide();
    $("#activityNameDiv").hide();
    $("#sortDiv").hide();
    $("#listImageDiv").hide();
    $("#productJumpDiv").hide();

    //初始化富文本编辑器
    const E = window.wangEditor;
    editor = new E('#Editor')
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
     /* var  fileName = resultFiles[0].name;
        var extIndex = fileName.lastIndexOf('.');
        var ext = fileName.slice(extIndex);
        var fileNameNotext = fileName.slice(0, extIndex);
        var regExt = /png|jpg|jpeg/;
        var fileType = regExt.test(ext) ? 1:0;*/

        $.ajax({
            type: "POST",
            url: baseURL + '/file/uploadFile',
            contentType: false,
            processData: false,
            data: formData,
            success: function (r) {
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


    //页面模块
    form.on('radio(moduleType)', function(data){
        vm.businessManagement.moduleType = data.value;
        //企业介绍
        if(vm.businessManagement.moduleType==1){
            //跳转类型默认-外部链接
            //vm.businessManagement.jumpType=2;
            //vm.businessManagement.jumpTypeAll=1;
            vm.businessManagement.jumpTypeQY=2;

            $("#productJumpDiv").hide();
            $("#jumpTypeDivHX").hide();
            $("#jumpTypeDivCX").hide();
            $("#editorDiv").hide();
            $("#activityNameDiv").hide();
            $("#sortDiv").hide();
            $("#listImageDiv").hide();
            $("#jimpLinkDiv").hide();
            $("#jumpTypeDivQY").show();
            $("#editorDiv").show();



        }
        if(vm.businessManagement.moduleType==2 ){
            //默认显示外部链接
            vm.businessManagement.jumpTypeHX=1;
            $("#jumpTypeDiv").hide();
            $("#editorDiv").hide();
            $("#productJumpDiv").hide();
            $("#jumpTypeDiv").hide();
            $("#jumpTypeDivHX").show();
            $("#jumpTypeDivCX").hide();
            $("#jumpTypeDivQY").hide();
            $("#activityNameDiv").show();
            $("#sortDiv").show();
            $("#listImageDiv").show();
            $("#jimpLinkDiv").show();

        }

        if(vm.businessManagement.moduleType==3){
            //默认显示外部链接
            vm.businessManagement.jumpTypeCX=1;
            $("#jumpTypeDivQY").hide();
            $("#jumpTypeDivHX").hide();
            $("#editorDiv").hide();
            $("#productJumpDiv").hide();
            $("#jumpTypeDiv").hide();
            $("#jumpTypeDivCX").show();
            $("#activityNameDiv").show();
            $("#sortDiv").show();
            $("#listImageDiv").show();
            $("#jimpLinkDiv").show();

        }
    });
    //跳转类型
    form.on('radio(jumpTypeQY)', function(data){

        vm.businessManagement.jumpTypeQY = data.value;
        //内部跳转
        /*if(vm.businessManagement.jumpType==1){
            $("#productJumpDiv").hide();
            $("#editorDiv").hide();
            $("#jimpLinkDiv").show();
        }*/
        if(vm.businessManagement.jumpTypeQY==2){
            $("#jimpLinkDiv").hide();
            $("#productJumpDiv").hide();
            $("#editorDiv").show();
        }
    });

    form.on('radio(jumpTypeHX)', function(data){
        vm.businessManagement.jumpTypeHX = data.value;
        //内部跳转
        if(vm.businessManagement.jumpTypeHX==1){
            $("#jimpLinkDiv").show();
            $("#editorDiv").hide();
            $("#productJumpDiv").hide();

        }

        if(vm.businessManagement.jumpTypeHX==2){
            $("#editorDiv").show();
            $("#jimpLinkDiv").hide();
            $("#productJumpDiv").hide();
        }

        /*if(vm.businessManagement.jumpTypeAll==3){
            $("#editorDiv").hide();
            $("#jimpLinkDiv").hide();
            $("#productJumpDiv").show();
        }*/

    });

     form.on('radio(jumpTypeCX)', function(data){
        vm.businessManagement.jumpTypeCX = data.value;
        //内部跳转
        if(vm.businessManagement.jumpTypeCX==1){
            $("#jimpLinkDiv").show();
            $("#editorDiv").hide();
            $("#productJumpDiv").hide();

        }

        if(vm.businessManagement.jumpTypeCX==2){
            $("#editorDiv").show();
            $("#jimpLinkDiv").hide();
            $("#productJumpDiv").hide();
        }

        if(vm.businessManagement.jumpTypeCX==3){
            $("#editorDiv").hide();
            $("#jimpLinkDiv").hide();
            $("#productJumpDiv").show();
        }

    });



    //活动状态
    form.on('switch(isEnable_filter)', function(data){
        //活动状态(1可用，0禁用)默认可用；
        if(data.elem.checked){
            vm.businessManagement.isEnable = 1;
        }else{
            vm.businessManagement.isEnable= 0;
        }
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}


function sendData(businessManagement) {
    console.log(JSON.stringify(businessManagement))
    vm.businessManagement=businessManagement;
    var  moduleType= businessManagement.moduleType;
    if(moduleType==1){
        $("#productJumpDiv").hide();
        $("#jumpTypeDivHX").hide();
        $("#jumpTypeDivCX").hide();
        $("#editorDiv").hide();
        $("#activityNameDiv").hide();
        $("#sortDiv").hide();
        $("#listImageDiv").hide();
        $("#jimpLinkDiv").hide();
        $("#jumpTypeDivQY").show();
        $("#editorDiv").show();

        vm.businessManagement.jumpTypeQY=businessManagement.jumpType;
        //富文本内容回显
        editor.txt.html('<p>' + businessManagement.internalJump+ '</p>')
    }
    if(moduleType==2){
        $("#jumpTypeDiv").hide();
        $("#editorDiv").hide();
        $("#productJumpDiv").hide();
        $("#jumpTypeDiv").hide();
        $("#jumpTypeDivHX").show();
        $("#jumpTypeDivCX").hide();
        $("#jumpTypeDivQY").hide();
        $("#activityNameDiv").show();
        $("#sortDiv").show();
        $("#listImageDiv").show();
        $("#jimpLinkDiv").show();


        vm.businessManagement.jumpTypeHX=businessManagement.jumpType;
        //活动列表图片
        var  listImage=businessManagement.listImage;
        vm.fileList.push({url:imageURL+listImage});
        vm.hideUploadEdit=true;

        if(vm.businessManagement.jumpTypeHX==2){
            $("#jimpLinkDiv").hide();
            $("#editorDiv").show();
            editor.txt.html('<p>' + businessManagement.internalJump+ '</p>')
        }

    }
    if(moduleType==3){
        $("#jumpTypeDivQY").hide();
        $("#jumpTypeDivHX").hide();
        $("#editorDiv").hide();
        $("#productJumpDiv").hide();
        $("#jumpTypeDiv").hide();
        $("#jumpTypeDivCX").show();
        $("#activityNameDiv").show();
        $("#sortDiv").show();
        $("#listImageDiv").show();
        $("#jimpLinkDiv").show();

        vm.businessManagement.jumpTypeCX=businessManagement.jumpType;
        //活动列表图片
        var  listImage=businessManagement.listImage;
        vm.fileList.push({url:imageURL+listImage});
        vm.hideUploadEdit=true;

        if(vm.businessManagement.jumpTypeCX==2){
            $("#jimpLinkDiv").hide();
            $("#editorDiv").show();
            editor.txt.html('<p>' + businessManagement.internalJump+ '</p>')
        }
        if(vm.businessManagement.jumpTypeCX==3){
            $("#jimpLinkDiv").hide();
            $("#editorDiv").hide();
            $("#productJumpDiv").show();
            vm.activity.productJump=businessManagement.productJump;
            vm.activity.brandSeriesModelSchemename=businessManagement.brandSeriesModelSchemename;
        }
    }



}