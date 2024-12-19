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
        detailsSupTabContentList: ['基本信息', '活动商品', '活动图片',],
        detailsTabContentListActiveIndex: null,
        detailsSupTabContentListActiveIndex: null,
        detailsSupTabContentListActiveValue: null,
        coverImageLst: [],
        detailsImageLst: [],
        shareImageLst: [],
        scActivityPeer: {},
        listObj: {},
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.scActivityPeer = param.data;
        _this.listObj = param.listObj;
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
        if (param.data.detailImage){
            _this.detailsImageLst.push({
                url:param.data.detailImage,
                typeFile:1,
                nameExt:'.png'
            });
        }
        if (_this.scActivityPeer.timeStart){
            _this.scActivityPeer.timeStart = dateFormatYMD(_this.scActivityPeer.timeStart);
        }
        if (_this.scActivityPeer.timeEnd){
            _this.scActivityPeer.timeEnd = dateFormatYMD(_this.scActivityPeer.timeEnd);
        }
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
    if (vm.scActivityPeer.peerContent){
        setHtmlData(activitycontentEditor, vm.scActivityPeer.peerContent);
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
        id: "operationlogid",
        elem: '#operationlog',
        // defaultToolbar: ['filter'],
        url: baseURL + 'sys/log/operationLogLst',
        where: {
            businessNo: vm.scActivityPeer.id,
            auditType: 62
        },
        cols: [[
            {field:'operatorName', title: '操作人',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.operatorName);}},
            {field:'memo', title: '操作内容',align:'center', minWidth:200, templet: function (d) {return isEmpty(d.memo);}},
            {field:'timeCreate', title: '操作时间',align:'center',minWidth:200, templet: function (d) {return isEmpty(d.timeCreate);}},
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

    table.render({
        id: "seckillgoodslstid",
        elem: '#seckillGoodsLst',
        data: vm.scActivityPeer.activitySeckillList,
        cols: [[
            {field:'peerType', title: '类型', templet: function (d) {return transformTypeByMap(d.peerType, {1:'优惠券',2:'实物'});},align:'center'},
            // {field:'peerUrl', title: '实物照片', templet: '#imgTpl', width: 210},
            {field:'peerUrl', title: '实物照片', width: 210,align:'center', templet: function (d) {
                    var url;
                    if(d.peerType == 2){
                        url = imageURL+d.peerUrl;
                    }else {
                        url = baseURL + 'statics/images/mmv-ui/img/vip.png';
                    }
                    return '<img style="width: 99%;height: 99%;" src="' + url + '">';
                }
            },
            {field:'peerName', title: '奖品名称', align:'center',templet: function (d) {return isEmpty(d.peerName);}},
            {field:'peerNumber', title: '组队人数',align:'center', templet: function (d) {return isEmpty(d.peerNumber);}},
            {field:'peerGive', title: '赠送人数', align:'center',templet: function (d) {return isEmpty(d.peerGive);}},
            {field:'peerStock', title: '奖品库存', align:'center',templet: function (d) {return isEmpty(d.peerStock);}},
        ]],
        page: true,
        limits: [20, 50, 100, 200],
        limit: 20,
        autoColumnWidth: {
            init: false
        },
        done: function(res, curr, count){
            soulTable.render(this);
            $('div[lay-id="gridid"]>div[class="layui-table-box"]>div>table').addClass('table-empty-left');
            $(".layui-table-main tr").each(function (index, val) {
                $($(".layui-table-fixed-l .layui-table-body tbody tr")[index]).height($(val).height());
                $($(".layui-table-fixed-r .layui-table-body tbody tr")[index]).height($(val).height());
            });
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