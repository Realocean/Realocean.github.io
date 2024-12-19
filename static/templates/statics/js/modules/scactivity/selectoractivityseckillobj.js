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
        verify: false
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.goods = param.data;
        _this.tag = param.tag;
        action = param.action;
        callback = param.callback;
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

}

function initData(layui) {
    if (vm.tag == 'edit'){
        layui.element.tabChange('tabChange', vm.goods.goodsType);
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
        vm.goods.goodsType = this.getAttribute('lay-id');
    });
}

function initVerify(form) {
    form.verify({
        validate_businessId: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请选择优惠券";
                }
            }
        },
        validate_goodsServerNumber: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入优惠券数量";
                }
            }
        },
        validate_goodsServerDescribe: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 1) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入说明";
                }
            }
        },
        validate_goodsServerName: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入名称";
                }
            }
        },
        validate_goodsServerPrice: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入价值";
                }
            }
        },
        validate_goodsServerNumber1: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入数量";
                }
            }
        },
        validate_goodsServerDescribe1: function (value, item) {
            if (vm.verify && vm.goods.goodsType == 2) {
                if (value == null || value == '') {
                    vm.verify = false;
                    return "请输入说明";
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
        var goodsServerNumber = $('#goodsServerNumber');
        if (obj){
            vm.goods.businessId = obj.businessId;
            Vue.set(vm.goods,'goodsServerName',obj.couponName);
            Vue.set(vm.goods,'goodsServerPrice',obj.money);
            Vue.set(vm.goods,'total',obj.total);
            if (obj.total && obj.total > 0){
                goodsServerNumber.removeAttr('maxlength');
                goodsServerNumber.attr("oninput", "editSimple(this, 'numInteger', '"+(obj.total^0)+"')");
                var number = Math.min(vm.goods.goodsServerNumber||'', obj.total||'');
                Vue.set(vm.goods,'goodsServerNumber',number <= 0 ? '':number);
            }else {
                goodsServerNumber.attr('maxlength', 0);
                Vue.set(vm.goods,'goodsServerNumber','');
            }
        }else {
            vm.goods.businessId = '';
            Vue.set(vm.goods,'goodsServerName','');
            Vue.set(vm.goods,'goodsServerPrice','');
            Vue.set(vm.goods,'total','');
            goodsServerNumber.removeAttr('maxlength');
            goodsServerNumber.attr("oninput", "editSimple(this, 'numInteger', '99999999')");
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
