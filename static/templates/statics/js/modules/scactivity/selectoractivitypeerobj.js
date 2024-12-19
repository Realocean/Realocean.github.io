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

var action;
var callback;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            keyword: null
        },
        goods: {},
        tag:'',
        businessIdOptions:[],
        peerUrlLst:[],
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.goods = param.data;
        _this.tag = param.tag;
        action = param.action;
        callback = param.callback;
        if (param.data && param.data.peerUrl && param.data.peerType == 2){
            _this.peerUrlLst.push({
                url:param.data.peerUrl,
                typeFile:1
            });
        }
        $.ajaxSettings.async = false;
        $.get(baseURL + 'scactivity/scactivityseckill/couponBusActivityList', function (r) {
            _this.businessIdOptions = r.data;
        });
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if (callback){
                callback(vm.goods);
            }
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initData(layui);
    initUpload(layui.upload);
}

function initUpload(upload) {
    Upload({
        elid: 'peerUrl',
        edit: true,
        fileLst: vm.peerUrlLst,
        param: {'path':'scactivity-peer'},
        fidedesc: '实物照片',
        maxLength: 1,
        callBack: function (tag, url, addFile) {
            switch (tag) {
                case 'success':{
                    Vue.set(vm.goods,'peerUrl',url);
                    break;
                }
            }
        }
    }).initView();
}

function initData(layui) {
    if (vm.tag == 'edit'){
        layui.element.tabChange('tabChange', vm.goods.peerType);
    }
    console.log(vm.goods)
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);

    layui.element.on('tab(tabChange)', function(data){
        if (vm.tag == 'add'){
            resetNULL(vm.goods);
        }
        vm.goods.peerType = this.getAttribute('lay-id');
    });
}

function initVerify(form) {
    form.verify({
        validate_businessId: function (value, item) {
            if (vm.verify && vm.goods.peerType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择优惠券";
                }
            }
        },
        validate_peerStock: function (value, item) {
            if (vm.verify && vm.goods.peerType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入奖品库存";
                }
            }
        },
        validate_peerNumber: function (value, item) {
            if (vm.verify && vm.goods.peerType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入组队人数";
                }
            }
        },
        validate_peerGive: function (value, item) {
            if (vm.verify && vm.goods.peerType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入赠送人数";
                }
            }
        },
        validate_peerName: function (value, item) {
            if (vm.verify && vm.goods.peerType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入名称";
                }
            }
        },
        validate_peerStock1: function (value, item) {
            if (vm.verify && vm.goods.peerType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入奖品库存";
                }
            }
        },
        validate_peerNumber1: function (value, item) {
            if (vm.verify && vm.goods.peerType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入组队人数";
                }
            }
        },
        validate_peerGive1: function (value, item) {
            if (vm.verify && vm.goods.peerType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入赠送人数";
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

    form.on('select(selectBusiness)', function(data){
        var obj = vm.businessIdOptions.filter((e) => {
            return data.value == e.businessId
        })[0]
        var peerStock = $('#peerStock');
        if (obj){
            vm.goods.couponId = obj.businessId;
            Vue.set(vm.goods,'peerName',obj.couponName);
            Vue.set(vm.goods,'goodsServerPrice',obj.money);
            Vue.set(vm.goods,'total',obj.total);
            if (obj.total && obj.total > 0){
                peerStock.removeAttr('maxlength');
                peerStock.attr("oninput", "editSimple(this, 'numInteger', '"+(obj.total^0)+"')");
                var number = Math.min(vm.goods.peerStock||'', obj.total||'');
                Vue.set(vm.goods,'peerStock',number <= 0 ? '':number);
            }else {
                peerStock.attr('maxlength', 0);
                Vue.set(vm.goods,'peerStock','');
            }
        }else {
            vm.goods.couponId = '';
            Vue.set(vm.goods,'peerName','');
            Vue.set(vm.goods,'goodsServerPrice','');
            Vue.set(vm.goods,'total','');
            peerStock.removeAttr('maxlength');
            peerStock.attr("oninput", "editSimple(this, 'numInteger', '99999999')");
        }
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
    parent.layer.close(index);
}
