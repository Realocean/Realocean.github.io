$(function () {
  layui.config({
      base: '../../statics/common/'
  }).extend({
      soulTable: 'layui/soultable/ext/soulTable.slim'
  });
   //初始化日期
   layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form
        form.on('submit(saveOrUpdate)', function(){
            vm.saveOrUpdate();
            return false;
        });
        form.on('select(noticeTypeSelect)', function (data) {
            vm.q.noticeType = data.value;
        });
        initData();
        form.render();
    });
    
    
    layui.laydate.render({
        elem: '#releaseTimeDate',
        trigger: 'click',
        type:'datetime', // 可选择：年、月、日、时、分、秒
        format: 'yyyy-MM-dd HH:mm:ss', //指定时间格式
        done: function (value, date, endDate) {
            vm.q.releaseTime = value;
        }
    });
});
var  editor=null;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            id:null,
            noticeType:1,
            noticeContent:null,
            versionNo:null,
            publisher:sessionStorage.getItem("username"),
            releaseTime:new Date().format("yyyy-MM-dd hh:mm:ss"),
            remark:null
        },
        noticeTypeList:[
            {
                name:'系统更新',
                value:'1'
            }
        ]
        
    },
    created () {
         var param = parent.layer.boxParams.boxParams;
         if(param){
            this.q = param;
         }
    },
    methods: {
        saveOrUpdate(){
            vm.q.noticeContent = editor.txt.html()
            let params = vm.q
            if(!params.noticeType){
                alert('公告类型不能为空');
                return false;
            }
            if(!params.noticeContent||params.noticeContent===''){
                alert('公告内容不能为空');
                return false;
            }
            if(!params.versionNo||params.versionNo===''){
                alert('版本号不能为空');
                return false;
            }
            if(!params.publisher||params.publisher===''){
                alert('发布人不能为空');
                return false;
            }
            if(!params.releaseTime||params.releaseTime===''){
                alert('公告时间不能为空');
                return false;
            }
            if(params.id){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/notice/update",
                    contentType: "application/json",
                    data: JSON.stringify(params),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(){
                               vm.closePage()
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            }else{
                delete params.id;
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/notice/save",
                    contentType: "application/json",
                    data: JSON.stringify(params),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(){
                                vm.closePage()
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            }
        },
        closePage: function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.vm.reload();
            parent.layer.close(index);
        },

    }
});

function  initData(){
    //初始化富文本编辑器
    const E = window.wangEditor;
    editor = new E('#Editor')
    // 设置编辑区域高度为 300px
    editor.config.height = 300;
    editor.config.zIndex = 1;
    editor.config.menus=[
        'head', // 标题
        'bold', // 粗体 
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线 
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接 
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'undo', // 撤销
        'redo', // 重复
        'code', // 插入代码 
    ]
    editor.config.placeholder = '请输入公告内容';
    editor.create();
    editor.txt.html($('#noplay').text())
    if(vm.q.id){
        //富文本内容回显
        editor.txt.html('<p>' + vm.q.noticeContent + '</p>')
    }
}