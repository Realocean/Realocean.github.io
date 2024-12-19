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
        activity: {},
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

    }
});

function init(layui) {
    initData();
    initClick();
}

function initData() {
    //初始化富文本编辑器
    const E = window.wangEditor;
    editor = new E('#Editor')
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '自定义 placeholder 提示文字';
    editor.create();
}


function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });

}


function closePage() {
    parent.vm_cooperationEvent.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
    parent.removeClass();
    parent.addClass(3);
    parent.queryActivityCounnt();
}
/***
 * 父页面给子页面传值
 * @param activity
 */
function sendData(activity){
    //活动状态
    vm.activity = Object.assign({}, vm.activity,
        {isEnable: activity.isEnable},
        {remarks:activity.remarks},
        {deptName:activity.deptName},
        {sysUserName:activity.sysUserName});
    //富文本内容回显
    editor.txt.html('<p>' + activity.internalJump + '</p>')
    layui.form.render();
}