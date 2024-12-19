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

var activitycontentE;
var activitycontentEditor;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        detailsTabContentList: ['活动信息', '活动预览', '操作记录',],
        detailsSupTabContentList: ['基本信息', '活动商品', '活动返佣', '活动图片',],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        scActivitySeckill: {},
        commissionPlan: {},
        coverImageLst: [],
        detailsImageLst: [],
        shareImageLst: []
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scActivitySeckill = param.data;
        $.ajaxSettings.async = false;
        if (param.data.coverImage){
            _this.coverImageLst.push({
                url:param.data.coverImage,
                typeFile:1,
                nameExt:'.png'
            });
        }
        if (param.data.shareImage){
            _this.shareImageLst.push({
                url:param.data.shareImage,
                typeFile:1,
                nameExt:'.png'
            });
        }
        if (param.data.detailsImage){
            let arrary = param.data.detailsImage.split(",");
            arrary.map((item) => {
                _this.detailsImageLst.push({
                    url:item,
                    typeFile:1,
                    nameExt:'.png'
                });
            });
        }
        if (_this.scActivitySeckill.timeStart){
            _this.scActivitySeckill.timeStart = dateFormatYMD(_this.scActivitySeckill.timeStart);
        }
        if (_this.scActivitySeckill.timeEnd){
            _this.scActivitySeckill.timeEnd = dateFormatYMD(_this.scActivitySeckill.timeEnd);
        }
        $.get(baseURL + 'scactivity/scactivityseckill/getCommissionPlan/'+param.data.id, function (r) {
            _this.commissionPlan = r.datas;
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        detailsTabContentBindtap (index) {
            vm.detailsTabContentListActiveIndex = index;
            if (index == 0){
                vm.detailsSupTabContentListActiveIndex = index;
            }
            vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[index];
        },
        detailsSupTabContentBindtap (param, val) {
            vm.detailsSupTabContentListActiveIndex = param;
            vm.detailsSupTabContentListActiveValue = val;
        },
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
    Upload({
        elid: 'coverImageLst',
        fileLst: vm.coverImageLst,
    }).initView();

    Upload({
        elid: 'detailsImageLst',
        fileLst: vm.detailsImageLst,
    }).initView();

    Upload({
        elid: 'shareImageLst',
        fileLst: vm.shareImageLst,
    }).initView();
}

function initData() {
    vm.detailsTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveIndex = 0;
    vm.detailsSupTabContentListActiveValue = vm.detailsTabContentList[0];
    //
    activitycontentE = window.wangEditor;
    activitycontentEditor = new activitycontentE('#activitycontent');
    createEditor(activitycontentEditor);
    if (vm.scActivitySeckill.content){
        setHtmlData(activitycontentEditor, vm.scActivitySeckill.content);
    }
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function initTable(table, soulTable) {
    table.render({
        id: "seckillgoodslstid",
        elem: '#seckillGoodsLst',
        data: vm.scActivitySeckill.activitySeckillList,
        cols: [[
            {field:'goodsType', title: '类型', align:'center',templet: function (d) {return transformTypeByMap(d.goodsType, {1:'优惠券',2:'实物'});}},
            {field:'goodsServerName', title: '名称',align:'center', templet: function (d) {return isEmpty(d.goodsServerName);}},
            {field:'goodsServerPrice', title: '销售价',align:'center', templet: function (d) {return toMoney(d.goodsServerPrice);}},
            {field:'goodsServerNumber', title: '数量',align:'center', templet: function (d) {return isEmpty(d.goodsServerNumber);}},
            {field:'goodsServerDescribe', title: '商品服务描述',align:'center', templet: function (d) {return isEmpty(d.goodsServerDescribe);}},
        ]],
        page: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    table.render({
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.scActivitySeckill.id,
            auditType: 61
        },
        cols: [[
            {field:'operatorName', title: '操作人',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
        ]],
        page: true,
        loading: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
        }
    });

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {

}

function initTableEvent(table) {

}

function initDate(laydate) {

}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    if (parent.vm.hasOwnProperty('reload')){
        parent.vm.reload();
    }
    parent.layer.close(index);
}

function createEditor(editor){
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '';
    editor.config.pasteFilterStyle = true;

// 配置菜单栏，设置不需要的菜单
//     editor.config.toolbarKeys = [];
//     editor.config.menus = [];
    editor.config.excludeMenus = [
        'emoticon',
        'video',
        'link',
        'splitLine',
        'backColor',
    ]
    // editor.config.readOnly = true;
    // console.log(editor.config);

// 图片上传
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        console.log(resultFiles);
        // 上传图片，返回结果，将图片插入到编辑器中
        //insertImgFn('https://cn.vuejs.org/images/logo.png')
        const formData = new FormData();
        formData.append("files", resultFiles[0]);
        formData.append("path", 'carIntroduce');
        //图片名称
        const fileName = resultFiles.name;
        $.ajax({
            type: "POST",
            url: baseURL + '/file/uploadFile',
            contentType: false,
            processData: false,
            data: formData,
            success: function (r) {
                const activeFile = {
                    url: r.data[0],
                    name: fileName,
                    uid: uuid(6)
                };
                insertImgFn(imageURL+r.data[0])
            },
            error: function () {
                layer.msg('上传失败', {icon: 5});
            }
        });
    };
    editor.create();
    editor.disable();
}

function setHtmlData(editor, value){
    //editor.txt.html('<p>' + value + '</p>');
    editor.txt.html('<p>' + value + '</p>');
}