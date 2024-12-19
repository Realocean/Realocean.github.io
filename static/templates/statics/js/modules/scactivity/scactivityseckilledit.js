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
            seckillComponentId: 'seckillComponentId_0',
            applicableUnitOptions: [],
            applicableUnitOptionsLst: [],
            scActivitySeckill: {},
            coverImageLst: [],
            detailsImageLst: [],
            shareImageLst: [],
            verify: false
        },
        created: function(){
            var _this = this;
            var param = parent.layer.boxParams.boxParams;
            if (param.data != null){
                _this.scActivitySeckill = param.data;
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
                if (param.data.detailsImage){
                    let arrary = param.data.detailsImage.split(",");
                    arrary.map((item) => {
                        _this.detailsImageLst.push({
                            url:item,
                            typeFile:1
                        });
                    });
                }
                if (_this.scActivitySeckill.timeStart){
                    _this.scActivitySeckill.timeStart = dateFormatYMD(_this.scActivitySeckill.timeStart);
                }
                if (_this.scActivitySeckill.timeEnd){
                    _this.scActivitySeckill.timeEnd = dateFormatYMD(_this.scActivitySeckill.timeEnd);
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
                var index = vm.edit('add', {goodsType:1,businessId:''}, function (data) {
                    for (var i = 0; i < vm.scActivitySeckill.activitySeckillList.length; i++) {
                        var item = vm.scActivitySeckill.activitySeckillList[i];
                        if (item.goodsType == data.goodsType
                            && (
                                (item.goodsType == 1 && item.businessId === data.businessId)
                                || (item.goodsType == 2 && item.goodsServerName === data.goodsServerName)
                            )
                        ){
                            alert('该条秒杀活动商品已添加');
                            return;
                        }
                    }
                    data.sid = 'serial_'+uuid(32);
                    vm.scActivitySeckill.activitySeckillList.push(data);
                    layui.table.reload('seckillgoodslstid', {data: vm.scActivitySeckill.activitySeckillList});
                    calculateCostPrice();
                    layer.close(index);
                });
            },
            editActivitySeckillobj: function (obj) {
                var index = vm.edit('edit', obj, function (data) {
                    for (var i = 0; i < vm.scActivitySeckill.activitySeckillList.length; i++) {
                        var item = vm.scActivitySeckill.activitySeckillList[i];
                        if (item.sid === data.sid){
                            copeObjProperty(data, item);
                            break;
                        }
                    }
                    layui.table.reload('seckillgoodslstid', {data: vm.scActivitySeckill.activitySeckillList});
                    calculateCostPrice();
                    layer.close(index);
                });
            },
            edit: function (tag, data, callback) {
                var index = layer.open({
                    title: "添加秒杀活动商品",
                    type: 2,
                    area: ['80%', '80%'],
                    boxParams: {
                        data: data,
                        tag: tag,
                        callback:callback
                    },
                    content: tabBaseURL + "modules/scactivity/selectoractivityseckillobj.html",
                    end: function () {
                        layer.close(index);
                    }
                });
                return index;
            },
            saveOrUpdate: function (event) {
                var param = JSON.parse(JSON.stringify(vm.scActivitySeckill));
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
                if (param.detailsImage == null || param.detailsImage.length < 1){
                    alert('请添加详情封面');
                    return;
                }
                if (param.shareImage == null || param.shareImage.length < 1){
                    alert('请添加分享封面');
                    return;
                }
                param.content = encodeURIComponent(activitycontentEditor.txt.html());
                if (param.content == null || param.content.length < 1){
                    alert('请输入活动描述');
                    return;
                }
                console.log(applicableUnit);
                param.applicableUnit = applicableUnit;
                console.log(param);
                var url = param.id == null ? "scactivity/scactivityseckill/save" : "scactivity/scactivityseckill/update";
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
        param: {'path':'scactivity-seckill'},
        fidedesc: '活动封面',
        maxLength: 1,
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.scActivitySeckill,'coverImage',url);
                    break;
                }
            }
        }
    }).initView();

    Upload({
        elid: 'detailsImageLst',
        edit: true,
        fileLst: vm.detailsImageLst,
        param: {'path':'scactivity-seckill'},
        fidedesc: '详情封面',
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.scActivitySeckill,'detailsImage',jointStr(',', vm.detailsImageLst.map(x => {return x.url})));
                    break;
                }
            }
        }
    }).initView();

    Upload({
        elid: 'shareImageLst',
        edit: true,
        fileLst: vm.shareImageLst,
        param: {'path':'scactivity-seckill'},
        fidedesc: '分享封面',
        maxLength: 1,
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.scActivitySeckill,'shareImage',url);
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
            vm.scActivitySeckill.activityUnit.splice(0)
            if (data && data.arr && data.arr.length > 0) for (var i = 0; i < data.arr.length; i++) {
                var item = data.arr[i];
                var applicableUnit = vm.applicableUnitOptions.filter(function (t) {
                    return t.applicableUnitNo === item.value;
                })[0];
                if (applicableUnit){
                    vm.scActivitySeckill.activityUnit.push(applicableUnit);
                }
            }
            vm.seckillComponentId = 'seckillComponentId_' + uuid(32);
            console.log(data);
        }
    });
    var selectedVals = [];
    if (vm.scActivitySeckill.activityUnit){
        next: for (var i = 0; i < vm.scActivitySeckill.activityUnit.length; i++){
            var item = vm.scActivitySeckill.activityUnit[i];
            for (var im of vm.applicableUnitOptionsLst) {
                if (im.value == item.applicableUnitNo){
                    selectedVals.push(im.value);
                    continue next;
                }
            }
            vm.scActivitySeckill.activityUnit.splice(i,1);
            i= i-1;
        }
    }
    selectApplicableUnit.setValue(selectedVals);

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
    initVerify(layui.form);
}

function initVerify(form) {
    form.verify({
        validate_seckillName: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "活动名称不能为空";
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
        validate_nowPrice: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "活动秒杀价不能为空";
                }
            }
        },
        validate_countNumber: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "活动总数量不能为空";
                }
            }
        },
        validate_rushBuyNumber: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "可抢购数量不能为空";
                }
            }
        },
        validate_inventedSalesNumber: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (vm.verify) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "虚拟已售数量不能为空";
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
    if (vm.scActivitySeckill.activitySeckillList && vm.scActivitySeckill.activitySeckillList.length > 0){
        for (var i = 0; i < vm.scActivitySeckill.activitySeckillList.length; i++) {
            vm.scActivitySeckill.activitySeckillList[i].sid = 'serial_'+uuid(32);
        }
    }
    table.render({
        id: "seckillgoodslstid",
        elem: '#seckillGoodsLst',
        data: vm.scActivitySeckill.activitySeckillList,
        cols: [[
            {title: '操作', width:120, templet:'#barTpl',align:"center"},
            {field:'goodsType', title: '类型', templet: function (d) {return transformTypeByMap(d.goodsType, {1:'优惠券',2:'实物'});}},
            {field:'goodsServerName', title: '名称', templet: function (d) {return isEmpty(d.goodsServerName);}},
            {field:'goodsServerPrice', title: '销售价', templet: function (d) {return toMoney(d.goodsServerPrice);}},
            {field:'goodsServerNumber', title: '数量', templet: function (d) {return isEmpty(d.goodsServerNumber);}},
            {field:'goodsServerDescribe', title: '商品服务描述', templet: function (d) {return isEmpty(d.goodsServerDescribe);}},
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

    initTableEvent(table);
    initTableEditListner(table);
}

function initTableEditListner(table) {
    table.on('tool(seckillGoodsLst)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'del'){
            layer.confirm('确定要删除选中的记录？', function(index){
                for (var i = 0; i < vm.scActivitySeckill.activitySeckillList.length; i++) {
                    var item = vm.scActivitySeckill.activitySeckillList[i];
                    if (item.sid === data.sid){
                        vm.scActivitySeckill.activitySeckillList.splice(i, 1);
                        break;
                    }
                }
                table.reload('seckillgoodslstid', {data: vm.scActivitySeckill.activitySeckillList});
                layer.close(index);
            });
        }else if(layEvent === 'edit'){
            vm.editActivitySeckillobj(data);
        }
    });
}

function initTableEvent(table) {

}

function initDate(laydate) {
    var scActivitySeckilltimeStart = laydate.render({
        elem: '#scActivitySeckilltimeStart',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            Vue.set(vm.scActivitySeckill, 'timeStart', value);
            scActivitySeckilltimeEnd.config.min = date;
            scActivitySeckilltimeEnd.config.min.month = date.month -1;
        }
    });

    var scActivitySeckilltimeEnd = laydate.render({
        elem: '#scActivitySeckilltimeEnd',
        type: 'date',
        trigger: 'click',
        done: function (value, date, endDate) {
            Vue.set(vm.scActivitySeckill, 'timeEnd', value);
            scActivitySeckilltimeStart.config.max = date;
            scActivitySeckilltimeStart.config.max.month = date.month -1;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}

function calculateCostPrice() {
    var costPrice=0;
    for(var item of vm.scActivitySeckill.activitySeckillList){
        costPrice+=(item.goodsServerPrice*item.goodsServerNumber)
    }
    Vue.set(vm.scActivitySeckill, 'costPrice', costPrice.toFixed(2));
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