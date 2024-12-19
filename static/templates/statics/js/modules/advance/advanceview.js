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

var vm = new Vue({
    el:'#rrapp',
    data:{
        advanceEntity: {},
        fileLst:[],
        isFilter:false,
    },
    created: function(){
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.advanceEntity = param.data;
        _this.fileLst=param.data.accessoryEntities;
    },
    computed:{

        getAdvanceStatus: {
            get: function () {
                if (this.advanceEntity.advanceStatus == 0) {
                    return "待抵扣";
                } else if (this.advanceEntity.advanceStatus == 1) {
                    return "部分抵扣"
                } else if (this.advanceEntity.advanceStatus == 1) {
                    return "全部抵扣"
                }else {
                    return "--";
                }


            }
        }




    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        downDoc: function (fileName, url) {
            var uri = baseURL + 'file/download?uri='+url+"&fileName="+fileName;
            window.location.href = uri;
        },
        // 高级筛选
        bindFilter:function(){
            this.isFilter = !this.isFilter;
        },
    }
});

function init(layui) {
    initEventListener(layui);
}

function initEventListener(layui) {
    initClick();
}

function initClick() {
    $("#closePage").on('click', function(){
        closePage();
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
