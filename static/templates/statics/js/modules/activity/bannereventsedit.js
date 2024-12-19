$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var  editor=null;
var vm = new Vue({
    el: '#rrapp',
    data: {
        activity: {
            isEnable:1,
        //  isInformationColumn:1,
            activityJumpType:1,

        },
        activityType: null,
        verify: false,
        //图片查看相关
        dialogVisible: false,
        activeFile: {},
        //活动列表图片数据
        fileList: [],
        hideUploadEdit:false
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.activityType = param;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            //活动名称
            if(vm.activity.activityName==null || vm.activity.activityName==''){
                alert("活动名称不能为空");
                return ;
            }
            //活动位置
            if(vm.activity.sort!=null && vm.activity.sort!=''){
                var reg=/^[1-9]\d*$/;
                if(!reg.test(vm.activity.sort)){
                    alert("活动位置只能输入大于0的整数");
                    return;
                }
            }

            if ((vm.activity.offShelfTime != null && vm.activity.offShelfTime != '') && (vm.activity.launchTime !=null && vm.activity.launchTime !='')) {
                //下架时间不能小于上架时间
                if(vm.activity.offShelfTime <= vm.activity.launchTime){
                    alert("下架时间不能小于等于上架时间 ");
                    return ;
                }
            }

            //备注信息字符长度校验
            if(vm.activity.remarks!=null && vm.activity.remarks!=''){
                if(vm.activity.remarks.length>200){
                    alert('备注信息不能大于200个字符的长度');
                    return;
                }
            }

            //活动列表图片校验
            if(vm.activity.listImage ==null || vm.activity.listImage==''){
                alert("活动图片列表不能为空");
                return;
            }
            //活动跳转类型(1.外部链接，2.内部跳转，3.产品跳转)
            if(vm.activity.activityJumpType!=null && vm.activity.activityJumpType!=''){
                if(vm.activity.activityJumpType==1){
                    if(vm.activity.connectionAddress==null || vm.activity.connectionAddress==''){
                        alert("外部链接不能为空") ;
                        return ;
                    }

                    var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                    if(!reg.test(vm.activity.connectionAddress)){
                        alert("外部链接网址不正确") ;
                        return ;
                    }

                }
                if(vm.activity.activityJumpType ==2){
                    vm.activity.internalJump=editor.txt.html();
                    if(vm.activity.internalJump==null || vm.activity.internalJump==''){
                        alert("富文本内容不能为空")
                        return;
                    }

                }
                if(vm.activity.activityJumpType ==3){
                    if(vm.activity.productJump==null || vm.activity.productJump==''){
                        alert("产品跳转内容不能为空")
                        return ;
                    }

                }
            }

            //活动类型
            vm.activity.activityType=vm.activityType;
            var url = vm.activity.activityId == null ? "activity/activity/save" : "activity/activity/update";
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.activity),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
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
            vm.activity.listImage=null;
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
                    vm.activity.listImage = r.data[0];
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
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData();
    initUpload(layui.upload);
}

function initUpload(upload) {

}

function initData() {
    //初始化相关数据值设置
    //活动列表图片
    vm.fileList = [];
    vm.activeFile = {};

    //活动状态
    //vm.activity.isEnable=1;
    //是否有咨询栏
    //vm.activity.isInformationColumn=1;
    //活动跳转类型
    //vm.activity.activityJumpType=1;
    $("#connectionAddressDiv").show();
    $("#internalJumpDiv").hide();
    $("#productJumpDiv").hide();



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
                /*const activeFile = {
                    id: uuid(6),
                    url: r.data[0],
                    operationId:sessionStorage.getItem("userId"),
                    operationName:sessionStorage.getItem("username"),
                    nameDesc:'热门活动富文本图片',
                    nameAccessory:fileNameNotext,
                    nameFile:fileName,
                    nameExt:ext,
                    typeFile:fileType,
                };*/
                //vm.richTextPhotoList.push(activeFile);
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
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });

    //活动状态
    form.on('switch(isEnable_filter)', function(data){
        //活动状态(1可用，0禁用)默认可用；
        if(data.elem.checked){
            vm.activity.isEnable = 1;
            //添加必填校验
            //上架时间
            $("#validate_launchTime").attr("lay-verify","validate_launchTime");
            //下架时间
            $("#validate_offShelfTime").attr("lay-verify","validate_offShelfTime");

        }else{
            vm.activity.isEnable= 0;
            //移除必填项校验
            //上架时间
            $("#validate_launchTime").removeAttr("lay-verify");
            //下架时间
            $("#validate_offShelfTime").removeAttr("lay-verify");
        }
    });

    //是否有咨询栏
    /*form.on('radio(isInformationColumn)', function(data){
        vm.activity.isInformationColumn = data.value;
    });*/

    //活动跳转类型
    form.on('radio(activityJumpType)', function(data){
        vm.activity.activityJumpType = data.value;
        //活动跳转类型(1.外部链接，2.内部跳转，3.产品跳转)
        if(data.value==1){
            $("#connectionAddressDiv").show();
            $("#internalJumpDiv").hide();
            $("#productJumpDiv").hide();
            //产品跳转
            $("#validate_productJump").removeAttr("lay-verify");
        }
        if(data.value==2){
            $("#connectionAddressDiv").hide();
            $("#internalJumpDiv").show();
            $("#productJumpDiv").hide();
            //移除跳转链接地址必填校验
            $("#validate_connectionAddress").removeAttr("lay-verify");
            //产品跳转
            $("#validate_productJump").removeAttr("lay-verify");

        }
        if(data.value==3){
            $("#connectionAddressDiv").hide();
            $("#internalJumpDiv").hide();
            $("#productJumpDiv").show();
            //移除跳转链接地址必填校验
            $("#validate_connectionAddress").removeAttr("lay-verify");
        }
    });



}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
    });

    $("#save").on('click', function () {
        vm.verify = true;
    });
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

    //上架时间
    laydate.render({
        elem: '#validate_launchTime',
        type: 'date',
        trigger: 'click',
        min: tomorrowTime,
        max: '2888-12-31',
        done: function (value, date, endDate) {
            vm.activity.launchTime = value;
        }
    });
    //下架时间
    laydate.render({
        elem: '#validate_offShelfTime',
        type: 'date',
        trigger: 'click',
        min: tomorrowTime,
        max: '2888-12-31',
        done: function (value, date, endDate) {
            vm.activity.offShelfTime = value;
        }
    });
}

function closePage() {
    parent.vm_hotevent.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    parent.removeClass();
    parent.addClass(2);
    parent.queryActivityCounnt();

}


/***
 * 父页面给子页面传值
 * @param activity
 */
function sendData(activity){
    //活动对象
    vm.activity=activity;
    //活动列表图片
    var  listImage=activity.listImage;
    vm.fileList.push({url:imageURL+listImage});
    vm.hideUploadEdit=true;

    vm.activity.isEnable=activity.isEnable;
    //活动跳转类型(1.外部链接，2.内部跳转，3.产品跳转)
    var activityJumpType= activity.activityJumpType;
    if(activityJumpType==1){
        $("#connectionAddressDiv").show();
        $("#internalJumpDiv").hide();
        $("#productJumpDiv").hide();
    }
    if(activityJumpType==2){
        $("#connectionAddressDiv").hide();
        $("#internalJumpDiv").show();
        $("#productJumpDiv").hide();
        //富文本内容回显
        editor.txt.html('<p>' + activity.internalJump + '</p>')
    }
    if(activityJumpType==3){
        $("#connectionAddressDiv").hide();
        $("#internalJumpDiv").hide();
        $("#productJumpDiv").show();
        vm.activity.brandSeriesModelSchemename=activity.brandSeriesModelSchemename;
    }

    layui.form.render();
}