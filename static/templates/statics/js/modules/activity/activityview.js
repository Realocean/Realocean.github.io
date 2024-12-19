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
        activity: {},
        fileList:[],
        hideUploadEdit:false,
        dialogVisible:false,
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.activity = param.data;
        _this.fileList.push({url:imageURL+param.data.listImage})
        _this.hideUploadEdit=true;

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
function init(layui) {
    initClick();
    initData();
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
    if(vm.activity.activityJumpType==2){
        //富文本内容回显
        editor.txt.html('<p>' + vm.activity.internalJump + '</p>')
    }
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}



function closePage() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
