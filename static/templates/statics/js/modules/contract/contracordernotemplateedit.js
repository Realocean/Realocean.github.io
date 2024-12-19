$(function () {
    layui.config({
        base: '../../statics/common/'
    }).extend({
        soulTable: 'layui/soultable/ext/soulTable.slim'
    });
    layui.use(['form', 'layedit', 'laydate', 'element', 'table', 'soulTable'], function () {
        init(layui);
        layui.form.render();
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            keyword: null
        },
        contracorderNotemplate: {},
        fileLst: [],
        fileLstId: '0',
        contractContentUrl:''
    },
    created: function () {
        var _this = this;
        var param = parent.layer.boxParams.boxParams;
        _this.contracorderNotemplate = param.data;
        _this.contractContentUrl  = param.contractContentUrl || param.contracorderNotemplate.urlHtm;
        $.ajaxSettings.async = false;
        // $.get(baseURL + "contract/contraccontent/bodyByContract/"+_this.contracorderNotemplate.id, function(r){
        //     _this.contracorderNotemplate.body = r;
        // });
        if (_this.contracorderNotemplate.fileLst != null){
            _this.fileLst = _this.contracorderNotemplate.fileLst;
        }
        $.ajaxSettings.async = true;
    },
    updated: function () {
        layui.form.render();
    },
    methods: {
        saveOrUpdate: function (event) {
            if ((vm.contracorderNotemplate.orderCode == null || vm.contracorderNotemplate.orderCode == '')
                &&(vm.contracorderNotemplate.timeStart == null || vm.contracorderNotemplate.timeStart == '')
                &&(vm.contracorderNotemplate.timeFinish == null || vm.contracorderNotemplate.timeFinish == '')
                &&(vm.contracorderNotemplate.code == null || vm.contracorderNotemplate.code == '')
                &&(vm.contracorderNotemplate.timeSigned == null || vm.contracorderNotemplate.timeSigned == '')
                &&(vm.contracorderNotemplate.desc == null || vm.contracorderNotemplate.desc == '')
                &&(vm.fileLst == null || vm.fileLst.length < 1)
            ) {
                alert('请至少填写一项');
                return;
            }
            var url = vm.contracorderNotemplate.id == null ? "contract/contracordernotemplate/save" : "contract/contracordernotemplate/update";
            vm.contracorderNotemplate.fileLst = vm.fileLst;
            PageLoading();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.contracorderNotemplate),
                success: function (r) {
                    RemoveLoading();
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            closePage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        selectOrder: function () {
            var param = {};
            var index = layer.open({
                title: "选择车辆订单",
                type: 2,
                area: ['80%', '80%'],
                boxParams: param,
                content: tabBaseURL + "modules/contract/selectorder.html",
                end: function () {
                    layer.close(index);
                }
            });
        },
        delFile: function (id) {
            for(var i = 0 ;i<vm.fileLst.length;i++) {
                if(vm.fileLst[i].id === id) {
                    vm.fileLst.splice(i,1);
                    i= i-1;
                }
            }
        },
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    //附件上传
    var uploadParams = {
        "path": "contract",
        "nameDesc": "订单合同附件",
        "vm": vm,
        "layui": layui
    };
    initUploadCommons(uploadParams,"#contractFileLst");
}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
    initVerify(layui.form);
}

function initVerify(form) {
}

function initChecked(form) {
    form.on('submit(save)', function () {
        vm.saveOrUpdate();
        return false;
    });
}

function initClick() {
    $("#closePage").on('click', function () {
        closePage();
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
    var timeStart = laydate.render({
        elem: '#timeStart',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contracorderNotemplate.timeStart = value;
            timeFinish.config.min = date;
            timeFinish.config.min.month = date.month -1;
        }
    });

    var timeFinish = laydate.render({
        elem: '#timeFinish',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contracorderNotemplate.timeFinish = value;
            timeStart.config.max = date;
            timeStart.config.max.month = date.month -1;
        }
    });

    laydate.render({
        elem: '#timeSigned',
        trigger: 'click',
        done: function (value, date, endDate) {
            vm.contracorderNotemplate.timeSigned = value;
        }
    });
}

function closePage() {
    parent.vm.isClose = true;
    var index = parent.layer.getFrameIndex(window.name);
    parent.vm.reload();
    parent.layer.close(index);
}
