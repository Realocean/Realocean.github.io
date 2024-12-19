var vm;
var selectApplicableUnit;
var activitycontentE;
var activitycontentEditor;
$(function () {
    initVue();
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

function initVue(){
    vm = new Vue({
        el:'#rrapp',
        data:{
            q:{
                keyword: null
            },
            applicableUnitOptions: [],
            applicableUnitOptionsLst: [],
            scActivityPeer: {},
            coverImageLst: [],
            detailsImageLst: [],
            shareImageLst: [],
            verify: false
        },
        created: function(){
            var _this = this;
            var param = parent.layer.boxParams.boxParams;
            if (param.data != null){
                _this.scActivityPeer = param.data;
                if (param.data.coverImage){
                    _this.coverImageLst.push({
                        url:param.data.coverImage,
                        typeFile:1
                    });
                }
                if (param.data.shareImage){
                    _this.shareImageLst.push({
                        url:param.data.shareImage,
                        typeFile:1
                    });
                }
                if (param.data.detailImage){
                    _this.detailsImageLst.push({
                        url:param.data.detailImage,
                        typeFile:1
                    });
                }
                if (_this.scActivityPeer.timeStart){
                    _this.scActivityPeer.timeStart = dateFormatYMD(_this.scActivityPeer.timeStart);
                }
                if (_this.scActivityPeer.timeEnd){
                    _this.scActivityPeer.timeEnd = dateFormatYMD(_this.scActivityPeer.timeEnd);
                }
            }
            $.ajaxSettings.async = false;
            $.get(baseURL + 'scactivity/scactivityseckill/deptData', function (r) {
                _this.applicableUnitOptions = r.data;
                if (r.data && r.data.length > 0) for (var i = 0; i < r.data.length; i++) {
                    var item = r.data[i];
                    _this.applicableUnitOptionsLst.push({
                        name:item.applicableUnit,
                        value:item.applicableUnitNo
                    });
                }
            });
            $.ajaxSettings.async = true;
        },
        updated: function(){
            layui.form.render();
        },
        methods: {
            addActivitySeckillobj: function () {
                var index = vm.edit('add', {peerType:1,businessId:''}, function (data) {
                    for (var i = 0; i < vm.scActivityPeer.activitySeckillList.length; i++) {
                        var item = vm.scActivityPeer.activitySeckillList[i];
                        if (item.peerType == data.peerType
                            && (
                                (item.peerType == 1 && item.businessId === data.businessId)
                                || (item.peerType == 2 && item.peerName === data.peerName)
                            )
                        ){
                            alert('该条秒杀活动商品已添加');
                            return;
                        }
                    }
                    data.sid = 'serial_'+uuid(32);
                    console.log(data);
                    vm.scActivityPeer.activitySeckillList.push(data);
                    layui.table.reload('seckillgoodslstid', {data: vm.scActivityPeer.activitySeckillList});
                    layer.close(index);
                });
            },
            editActivitySeckillobj: function (obj) {
                var index = vm.edit('edit', obj, function (data) {
                    for (var i = 0; i < vm.scActivityPeer.activitySeckillList.length; i++) {
                        var item = vm.scActivityPeer.activitySeckillList[i];
                        if (item.sid === data.sid){
                            copeObjProperty(data, item);
                            break;
                        }
                    }
                    console.log(data);
                    layui.table.reload('seckillgoodslstid', {data: vm.scActivityPeer.activitySeckillList});
                    layer.close(index);
                });
            },
            edit: function (tag, data, callback) {
                var index = layer.open({
                    title: "添加同行活动商品",
                    type: 2,
                    area: ['80%', '80%'],
                    boxParams: {
                        data: data,
                        tag: tag,
                        callback:callback
                    },
                    content: tabBaseURL + "modules/scactivity/selectoractivitypeerobj.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                return index;
            },
            saveOrUpdate: function (event) {
                var param = JSON.parse(JSON.stringify(vm.scActivityPeer));
                var applicableUnit = selectApplicableUnit.getValue().map(x => {return x.value});
                if (applicableUnit == null || applicableUnit.length < 1){
                    alert('请选择门店/部门');
                    return;
                }
                if (param.activitySeckillList == null || param.activitySeckillList.length < 1){
                    alert('请添加秒杀商品');
                    return;
                }
                if (param.coverImage == null || param.coverImage.length < 1){
                    alert('请添加活动封面');
                    return;
                }
                if (param.detailImage == null || param.detailImage.length < 1){
                    alert('请添加详情封面');
                    return;
                }
                if (param.shareImage == null || param.shareImage.length < 1){
                    alert('请添加分享封面');
                    return;
                }
                param.peerContent = encodeURIComponent(activitycontentEditor.txt.html());
                if (param.peerContent == null || param.peerContent.length < 1){
                    alert('请输入活动描述');
                    return;
                }
                console.log(applicableUnit);
                param.applicableUnit = applicableUnit;
                var url = vm.scActivityPeer.id == null ? "scactivity/scactivitypeer/save" : "scactivity/scactivitypeer/update";
                PageLoading();
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(param),
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
}

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
        edit: true,
        fileLst: vm.coverImageLst,
        param: {'path':'scactivity-peer'},
        fidedesc: '活动封面',
        maxLength: 1,
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.scActivityPeer,'coverImage',url);
                    break;
                }
            }
        }
    }).initView();

    Upload({
        elid: 'detailsImageLst',
        edit: true,
        fileLst: vm.detailsImageLst,
        param: {'path':'scactivity-peer'},
        fidedesc: '详情封面',
        maxLength: 1,
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.scActivityPeer,'detailImage',url);
                    break;
                }
            }
        }
    }).initView();

    Upload({
        elid: 'shareImageLst',
        edit: true,
        fileLst: vm.shareImageLst,
        param: {'path':'scactivity-peer'},
        fidedesc: '分享封面',
        maxLength: 1,
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.scActivityPeer,'shareImage',url);
                    break;
                }
            }
        }
    }).initView();
}

function initData() {
    selectApplicableUnit = xmSelect.render({
        el: '#selectApplicableUnit',
        language: 'zn',
        data: vm.applicableUnitOptionsLst,
        on: function (data) {
            vm.scActivityPeer.activityUnit.splice(0)
            if (data && data.arr && data.arr.length > 0) for (var i = 0; i < data.arr.length; i++) {
                var item = data.arr[i];
                var applicableUnit = vm.applicableUnitOptions.filter(function (t) {
                    return t.applicableUnitNo === item.value;
                })[0];
                if (applicableUnit){
                    vm.scActivityPeer.activityUnit.push(applicableUnit);
                }
            }
            vm.seckillComponentId = 'seckillComponentId_' + uuid(32);
            console.log(data);
        }
    });
    var selectedVals = [];
    if (vm.scActivityPeer.activityUnit){
        next: for (var i = 0; i < vm.scActivityPeer.activityUnit.length; i++){
            var item = vm.scActivityPeer.activityUnit[i];
            for (var im of vm.applicableUnitOptionsLst) {
                if (im.value == item.applicableUnitNo){
                    selectedVals.push(im.value);
                    continue next;
                }
            }
            vm.scActivityPeer.activityUnit.splice(i,1);
            i= i-1;
        }
    }
    selectApplicableUnit.setValue(selectedVals);

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
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_peerTitle: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "活动标题不能为空";
                }
            }
        },
        validate_timeStart: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "活动开始时间不能为空";
                }
            }
        },
        validate_inventedJoinNumber: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "虚拟参加人数不能为空";
                }
            }
        },
        validate_peerContent: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "活动内容不能为空";
                }
            }
        },
    });
}

function initChecked(form) {
    form.on('submit(save)', function(){
        vm.saveOrUpdate();
        return false;
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

function initTable(table, soulTable) {
    if (vm.scActivityPeer.activitySeckillList && vm.scActivityPeer.activitySeckillList.length > 0){
        for (var i = 0; i < vm.scActivityPeer.activitySeckillList.length; i++) {
            vm.scActivityPeer.activitySeckillList[i].sid = 'serial_'+uuid(32);
        }
    }
    table.render({
        id: "seckillgoodslstid",
        elem: '#seckillGoodsLst',
        data: vm.scActivityPeer.activitySeckillList,
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',align:"center"},
            {field:'peerType', title: '类型', templet: function (d) {return transformTypeByMap(d.peerType, {1:'优惠券',2:'实物'});}},
            // {field:'peerUrl', title: '实物照片', templet: '#imgTpl', width: 210},
            {field:'peerUrl', title: '实物照片', width: 210, templet: function (d) {
                    var url;
                    if(d.peerType == 2){
                        url = imageURL+d.peerUrl;
                    }else {
                        url = baseURL + 'statics/images/mmv-ui/img/vip.png';
                    }
                    return '<img style="width: 99%;height: 99%;" src="' + url + '">';
                }
            },
            {field:'peerName', title: '奖品名称', templet: function (d) {return isEmpty(d.peerName);}},
            {field:'peerNumber', title: '组队人数', templet: function (d) {return isEmpty(d.peerNumber);}},
            {field:'peerGive', title: '赠送人数', templet: function (d) {return isEmpty(d.peerGive);}},
            {field:'peerStock', title: '奖品库存', templet: function (d) {return isEmpty(d.peerStock);}},
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
    table.on('tool(seckillGoodsLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'del'){
            layer.confirm('确定要删除选中的记录？', function(index){
                for (var i = 0; i < vm.scActivityPeer.activitySeckillList.length; i++) {
                    var item = vm.scActivityPeer.activitySeckillList[i];
                    if (item.sid === data.sid){
                        vm.scActivityPeer.activitySeckillList.splice(i, 1);
                        break;
                    }
                }
                table.reload('seckillgoodslstid', {data: vm.scActivityPeer.activitySeckillList});
                layer.close(index);
            });
        }else if(layEvent === 'edit'){
            vm.editActivitySeckillobj(data);
        }
    });
}

function initDate(laydate) {
    var scActivityPeertimeStart = laydate.render({
        elem: '#scActivityPeertimeStart',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            Vue.set(vm.scActivityPeer, 'timeStart', value);
            scActivityPeertimeEnd.config.min = date;
            scActivityPeertimeEnd.config.min.month = date.month -1;
        }
    });

    var scActivityPeertimeEnd = laydate.render({
        elem: '#scActivityPeertimeEnd',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            Vue.set(vm.scActivityPeer, 'timeEnd', value);
            scActivityPeertimeStart.config.max = date;
            scActivityPeertimeStart.config.max.month = date.month -1;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function createEditor(editor){
    // 或者 const editor = new E( document.getElementById('div1') )
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    editor.config.zIndex = 1;
    editor.config.placeholder = '请输入内容';
    editor.config.pasteFilterStyle = true;

// 配置菜单栏，设置不需要的菜单
    editor.config.excludeMenus = [
        'emoticon',
        'video',
        'link',
        'splitLine',
        'backColor',
    ]

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
    }
    editor.create();
}

function setHtmlData(editor, value){
    //editor.txt.html('<p>' + value + '</p>');
    editor.txt.html('<p>' + value + '</p>');
}