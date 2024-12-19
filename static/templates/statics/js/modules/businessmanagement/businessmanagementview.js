$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function(){
        init();
        layui.form.render();
    });
});
var  editor=null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        businessManagement: {
        },
        activity:{},
        //图片查看相关
        fileList:[],
        hideUploadEdit:false,
        dialogVisible:false,

    },
    created: function(){
        var _this = this;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        // 查看大图
        handlePictureCardPreview(item) {
            this.dialogVisible = true
        },
    }
});


function  init(){
    initData();
    initClick()
}



function  initData(){
    //初始化富文本编辑器
    const E = window.wangEditor;
    editor = new E('#Editor')
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '请输入活动相关内容';
    editor.create();
    editor.$textElem.attr('contenteditable', false)

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

}

function initTable(table, soulTable) {
    initTableEvent(table);
    initTableEditListner(table);
}



function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}



function sendData(businessManagement) {
    vm.businessManagement=businessManagement;
    vm.businessManagement.moduleType=businessManagement.moduleType;
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
            vm.activity.brandSeriesModelSchemename=businessManagement.brandSeriesModelSchemename;
        }
    }

}