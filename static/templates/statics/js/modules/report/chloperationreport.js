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
var fieldSortOrder = [];
var styleStr = {
    alignment:{
        vertical:'center',
        horizontal:'center'
    },
    font:{
        sz:14,
        // bold:true
    },
    border:{
        top:{
            style:'thin'
        },
        bottom:{
            style:'thin'
        },
        left:{
            style:'thin'
        },
        right:{
            style:'thin'
        }
    }
}

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            dateMonth: null,
            dateMonthstart: null,
            dateMonthend: null,
            dateMonthstartYMD: null,
            dateMonthendYMD: null,
            deptList: []
        },
        isClose: true,
        colLst:[],
    },
    created: function(){
        var _this = this;
        // var param = parent.layer.boxParams.boxParams;
        $.ajaxSettings.async = false;
        $.get(baseURL + "report/chloperationreport/getChlOperationTitle", function(r){
            console.log(r);
            fieldSortOrder.splice(0);
            if (r.datas && r.datas.parentList && r.datas.chlidList) {
                _this.colLst.splice(0);
                _this.colLst.push(r.datas.parentList);
                _this.colLst.push(r.datas.chlidList);
                _this.q.deptList = r.datas.chlidList;
                fieldSortOrder.push('chlName');
                for (var child of r.datas.chlidList) {
                    fieldSortOrder.push(child.field);
                }
                fieldSortOrder.push('combinedEarlyOrder');
                fieldSortOrder.push('combinedTheNewOrder');
                fieldSortOrder.push('combinedReturnCars');
                fieldSortOrder.push('combinedEndOfMonthOrder');
                fieldSortOrder.push('combinedEarlydebt');
                fieldSortOrder.push('combinedReceivableAmount');
                fieldSortOrder.push('combinedReceivedAmount');
                fieldSortOrder.push('combinedDebtAmount');
            }
        });
        dateSelectChange(_this.q, new Date().format('yyyy-MM'));
        $.ajaxSettings.async = true;
    },
    updated: function(){
        layui.form.render();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            dateSelectChange(vm.q, new Date().format('yyyy-MM'));
        },
        exports: function () {
            // getTableTitle()
            PageLoading();
            $.ajax({
                url: baseURL + 'report/chloperationreport/queryList',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(vm.q),
                async: false,
                dataType: 'json',
                error: function (res) {
                    RemoveLoading();
                },
                success: function (res) {
                    var conf = JSON.parse(JSON.stringify(getTableTitleConf()));
                    if (res.data){
                        for (var d of res.data) {
                            var map = {};
                            for (var no = 0; no < fieldSortOrder.length; no++) {
                                var dataName = 'data_'+no;
                                var das = d[fieldSortOrder[no]];
                                var styMap = {};
                                styMap['s'] = styleStr;
                                styMap['v'] = das;
                                map[dataName] = styMap;
                            }
                            conf.datas.push(map);
                        }
                    }
                    RemoveLoading();
                    console.log(conf.datas);
                    var excel = layui.excel;
                    var rowConf = excel.makeRowConfig({
                        1: 40,
                        3: 30
                    }, 20)
                    var wb = excel.exportExcelConf({
                        sheet: conf.datas
                    }, '渠道运营报表.xlsx', 'xlsx', {
                        extend: {
                            sheet: {
                                '!merges': conf.mergeArr
                                , '!cols': conf.widthArr
                                , '!rows': rowConf
                            }
                        }
                    });
                    console.log(wb);
                    wb.Sheets.sheet[getSequentialIndexStr(1)+'1'].v = '渠道';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-7)+'1'].v = '合计月初台数';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-6)+'1'].v = '本月合计新增';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-5)+'1'].v = '本月合计退车';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-4)+'1'].v = '月末合计台数';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-3)+'1'].v = '合计前期欠款';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-2)+'1'].v = '合计应收';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-1)+'1'].v = '合计实收';
                    wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length)+'1'].v = '未收租金';
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-8)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-8)+'1'].v+'|'+'合计月初台数');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-7)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-7)+'1'].v+'|'+'本月合计新增');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-6)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-6)+'1'].v+'|'+'本月合计退车');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-5)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-5)+'1'].v+'|'+'月末合计台数');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-4)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-4)+'1'].v+'|'+'合计前期欠款');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-3)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-3)+'1'].v+'|'+'合计应收');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-2)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-2)+'1'].v+'|'+'合计实收');
                    // console.log(index+'='+getSequentialIndexStr(fieldSortOrder.length-1)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(fieldSortOrder.length-1)+'1'].v+'|'+'未收租金');
                    for (var i = 1; i < vm.colLst[0].length - 8; i++) {
                        var index;
                        if (i === 1) {
                            index = 2;
                        }else {
                            index = (i - 1) * 9 + 2;
                        }
                        wb.Sheets.sheet[getSequentialIndexStr(index)+'1'].v = vm.colLst[0][i].title;
                        // console.log(index+'='+getSequentialIndexStr(index)+'1:'+wb.Sheets.sheet[getSequentialIndexStr(index)+'1'].v+'|'+vm.colLst[0][i].title);
                    }
                    excel.excExport(wb);
                }
            });
        },
        reload: function (event) {
            layui.table.reload('gridid', {
                page: {
                    curr: 1
                },
                where: JSON.parse(JSON.stringify(vm.q))
            });
        }
    }
});

function init(layui) {
    initTable(layui.table, layui.soulTable);
    initDate(layui.laydate);
    initEventListener(layui);
    initUpload(layui.upload);
    initData();
}

function initUpload(upload) {
}

function initData() {

}

function initEventListener(layui) {
    initClick();
    initChecked(layui.form);
}

function initChecked(form) {

}

function initClick() {

}

function initTable(table, soulTable) {
    table.render({
        id: "gridid",
        elem: '#grid',
        method: 'POST',
        contentType: 'application/json',
        url: baseURL + 'report/chloperationreport/queryList',
        where: JSON.parse(JSON.stringify(vm.q)),
        cols: vm.colLst,
        page: true,
        loading: true,
        limits: [10, 20, 50, 100],
        limit: 10,
        autoColumnWidth: {
            init: true
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
    laydate.render({
        elem : '#dateMonth',
        type: 'month',
        trigger: 'click',
        btns: ['now', 'confirm'],
        done: function (value, date, endDate) {
            dateSelectChange(vm.q, value);
        }
    });
}

function dateSelectChange(obj, dateValue){
    var d = new Date(dateValue);
    var year = d.getFullYear();
    var month = d.getMonth();
    obj.dateMonth = dateValue;
    obj.dateMonthstartYMD = obj.dateMonth + '-01';
    obj.dateMonthendYMD = obj.dateMonth + '-' + getMonthLastday(year, month+1);
    obj.dateMonthstart = obj.dateMonthstartYMD + ' 00:00:00';
    obj.dateMonthend = obj.dateMonthendYMD + ' 23:59:59';
}

function getMonthLastday(year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:{
            return 31;
        }
        case 4:
        case 6:
        case 9:
        case 11:{
            return 30;
        }
        case 2:{
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        }
    }
}

function getTableTitleConf() {
    var bodys = $("div[class='layui-form layui-border-box layui-table-view'] .layui-table-box table").get(1);
    var btrs = Array.from(bodys.querySelectorAll("tr"))
    var btdslength = Array.from(btrs[0].querySelectorAll("td")).length;
    var headers = $("div[class='layui-form layui-border-box layui-table-view'] .layui-table-box table").get(0);
    var headerHead = $("div[class='layui-form layui-border-box layui-table-view'] .layui-table-box table thead").get(0); // 获取表头
    var htrs = Array.from(headers.querySelectorAll('tr'));

    var bodysArr = new Array();
    var point = new Array();  // 行，列
    for(var pi=0; pi<=htrs.length+1; pi++){
        point[pi] = new Array();
    }
    point[0][0] ="qd"; // 起点
    var mergeArr = [];
    var widthArr = [];
    //表头
    for (var j = 0; j < htrs.length; j++) {
        var titles = [];
        var hths = Array.from(htrs[j].querySelectorAll("th"));
        var titleAll = {};
        var pointIndex = 0;
        var pindx = 0;  //起点遍历位置
        for (var i = 0; i < hths.length; i++) {  //遍历 th
            var clazz = hths[i].getAttributeNode('class');
            var colspan = hths[i].getAttributeNode('colspan'); // 表头占用列数
            var rowspan = hths[i].getAttributeNode('rowspan'); //，表头占用行数
            if(!colspan){
                colspan = 1;
            }else{
                colspan = parseInt(colspan.value);
            }
            if(!rowspan){
                rowspan = 1;
            }else{
                rowspan = parseInt(rowspan.value);
            }
            // 判断数据起始填写位置
            for(;pindx < btdslength; pindx ++){
                if(j == 0 || point[j][pindx] == "qd"){
                    titles.push(hths[i].innerText);
                    for(var temp = 0; temp < colspan-1;temp++){
                        titles.push(null);
                    }
                    mergeArr.push({s:{r:j,c:pindx},e:{r:j+rowspan-1,c:pindx+colspan-1}});
                    for(var qdi = 0; qdi<colspan ;qdi ++){
                        point[j+rowspan][pindx+qdi] = "qd"; // 添加完数据 ,添加起点记录
                    }
                    pindx = pindx+colspan;
                    break;
                }else{
                    titles.push("");
                }
            }
            if (j === 1){
                widthArr.push({wpx:hths[i].scrollWidth});
            }
        }
        // console.log(titles);
        bodysArr.push(titles);
    }
    // console.log(bodysArr);
    var datas = [];
    for(var i = 0; i<bodysArr.length;i++){
        var map ={};
        var thisData = bodysArr[i];
        for(var n = 0;n<thisData.length;n++){
            var dataName = "data_"+n;
            var das = thisData[n];
            var styMap = {};
            styMap['s'] = styleStr;
            styMap['v'] = das;
            map[dataName] = styMap;
        }
        datas.push(map);
    }
    console.log(datas);
    var conf = {
        datas: datas,
        mergeArr: mergeArr,
        widthArr: widthArr
    };
    return conf;
}

function getSequentialValue(index) {
    var str;
    var y = (index/26)^0;
    if (y >= 1){
        str = getSequentialValue(y) + String.fromCharCode((index - 1)-y*26+65);
    }else {
        str = String.fromCharCode((index - 1) + 65);
    }
    return str;
}

function getSequentialIndexStr(index) {
    var str = getSequentialValue(index);
    if (str.endsWith("@")){
        str = String.fromCharCode(str.charAt(0).charCodeAt() - 1) + "Z";
    }
    return str;
}

// function getTableTitleConf() {
//     var bodys = $("div[class='layui-form layui-border-box layui-table-view'] .layui-table-box table").get(1);
//     var btrs = Array.from(bodys.querySelectorAll("tr"))
//     var btdslength = Array.from(btrs[0].querySelectorAll("td")).length;
//     var headers = $("div[class='layui-form layui-border-box layui-table-view'] .layui-table-box table").get(0);
//     var headerHead = $("div[class='layui-form layui-border-box layui-table-view'] .layui-table-box table thead").get(0); // 获取表头
//     var htrs = Array.from(headers.querySelectorAll('tr'));
//
//     var bodysArr = new Array();
//     var point = new Array();  // 行，列
//     for(var pi=0; pi<=htrs.length+1; pi++){
//         point[pi] = new Array();
//     }
//     point[0][0] ="qd"; // 起点
//     var mergeArr = [];
//     var index_649;
//     //表头
//     for (var j = 0; j < htrs.length; j++) {
//         var titles = [];
//         var hths = Array.from(htrs[j].querySelectorAll("th"));
//         var titleAll = {};
//         var pointIndex = 0;
//         var pindx = 0;  //起点遍历位置
//         for (var i = 0; i < hths.length; i++) {  //遍历 th
//             var clazz = hths[i].getAttributeNode('class');
//             var colspan = hths[i].getAttributeNode('colspan'); // 表头占用列数
//             var rowspan = hths[i].getAttributeNode('rowspan'); //，表头占用行数
//             if(!colspan){
//                 colspan = 1;
//             }else{
//                 colspan = parseInt(colspan.value);
//             }
//             if(!rowspan){
//                 rowspan = 1;
//             }else{
//                 rowspan = parseInt(rowspan.value);
//             }
//             // 判断数据起始填写位置
//             for(;pindx < btdslength; pindx ++){
//                 if(j == 0 || point[j][pindx] == "qd"){
//                     titles.push(hths[i].innerText);
//                     for(var temp = 0; temp < colspan-1;temp++){
//                         titles.push(null);
//                     }
//                     mergeArr.push({s:{r:j,c:pindx},e:{r:j+rowspan-1,c:pindx+colspan-1}});
//                     for(var qdi = 0; qdi<colspan ;qdi ++){
//                         point[j+rowspan][pindx+qdi] = "qd"; // 添加完数据 ,添加起点记录
//                     }
//                     pindx = pindx+colspan;
//                     break;
//                 }else{
//                     titles.push("");
//                 }
//             }
//         }
//         // console.log(titles);
//         bodysArr.push(titles);
//         if (j === 0){
//             index_649 = titles.length - 8;
//         }
//     }
//     var widthArr = []; //这里改宽
//     for (var j = 0; j < btrs.length; j++) {
//         var contents = [];
//         var btds = Array.from(btrs[j].querySelectorAll("td"));
//         for (var i = 0; i < btds.length; i++) {
//             contents.push(btds[i].innerText);
//             if(j == 0){  //只跑一圈
//                 widthArr.push({wpx:btds[i].scrollWidth});
//             }
//         }
//         bodysArr.push(contents);
//     }
//     //设置表格样式
//     var styleStr = {
//         alignment:{
//             vertical:'center',
//             horizontal:'center'
//         },
//         font:{
//             sz:14,
//             // bold:true
//         },
//         border:{
//             top:{
//                 style:'thin'
//             },
//             bottom:{
//                 style:'thin'
//             },
//             left:{
//                 style:'thin'
//             },
//             right:{
//                 style:'thin'
//             }
//         }
//     }
//     // console.log(bodysArr);
//     var datas = [];
//     for(var i = 0; i<bodysArr.length;i++){
//         var map ={};
//         var thisData = bodysArr[i];
//         for(var n = 0;n<thisData.length;n++){
//             if (n == 649){
//                 console.log(thisData[n]);
//             }
//             var dataName = "data_"+n;
//             var das = thisData[n];
//             var styMap = {};
//             styMap['s'] = styleStr;
//             styMap['v'] = das;
//             map[dataName] = styMap;
//         }
//         datas.push(map);
//     }
//     console.log(datas);
//     // datas[0]["data_"+index_649].v = '合计月初台数';
//     // datas[0]["data_"+(index_649+1)].v = '合计月初台数1';
//     // var excel = layui.excel;
//     // var rowConf = excel.makeRowConfig({
//     //     1: 40,
//     //     3: 30
//     // }, 20)
//     // excel.exportExcel({
//     //     sheet: datas
//     // }, '渠道运营报表.xlsx', 'xlsx', {
//     //     extend: {
//     //         sheet: {
//     //             '!merges': mergeArr
//     //             , '!cols': widthArr
//     //             , '!rows': rowConf
//     //         }
//     //     }
//     // })
//     var conf = {
//         datas: datas,
//         mergeArr: mergeArr,
//         widthArr: widthArr
//     };
//     return conf;
// }