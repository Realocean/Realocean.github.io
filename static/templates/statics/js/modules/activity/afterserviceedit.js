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

var editor=null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        activity: {
            isEnable:1
        },
        activityType: null,

    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.activityType = param;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            //备注信息字符长度校验
            if(vm.activity.remarks!=null && vm.activity.remarks!=''){
                if(vm.activity.remarks.length>200){
                    alert('备注信息不能大于200个字符的长度');
                    return;
                }
            }
            //富文本内容
            vm.activity.internalJump=editor.txt.html();
            if(vm.activity.internalJump==null || vm.activity.internalJump==''){
                alert("富文本内容不能为空")
                return;
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
    }
});

function init(layui) {
    initEventListener(layui);
    initData();
}

function initData() {

    //初始化富文本编辑器
    const E = window.wangEditor;
    editor = new E('#Editor')
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '';
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

    //活动状态
    form.on('switch(isEnable_filter)', function(data){
        //活动状态(1可用，0禁用)默认可用；
        if(data.elem.checked){
            vm.activity.isEnable = 1;
        }else{
            vm.activity.isEnable=0;
        }
    });
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

}


function closePage() {
    parent.vm_afterserviceEvent.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    parent.removeClass();
    parent.addClass(4);
    parent.queryActivityCounnt();
}
/***
 * 父页面给子页面传值
 * @param activity
 */
function sendData(activity){
    //活动对象
    vm.activity=activity;
    //活动状态
    vm.activity.isEnable=activity.isEnable;
    //富文本内容回显
    editor.txt.html('<p>' + activity.internalJump + '</p>')
    layui.form.render();
}