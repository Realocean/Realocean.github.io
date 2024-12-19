function tableEditMaxlength(field, length) {
    $('td[data-field="'+field+'"]>input.layui-table-edit').attr('maxlength', length.toString());
}

function tableEditOninput(type, field, callback, maxNum) {
    switch (type) {
        case 'txt':{
           break;
        }
        case 'num':{
            if (!isNotEmpty(maxNum)){
                maxNum = 99999999.99;
            }
            break;
        }
        case 'numInteger':{
            if (!isNotEmpty(maxNum)){
                maxNum = 99999999;
            }
            break;
        }
        default:{
            throw new Error("edit类型有误");
        }
    }
    $('td[data-field="'+field+'"]>input.layui-table-edit').attr('oninput', 'tableEdit(this, \''+type+'\', \''+field+'\', \''+callback+'\', \''+maxNum+'\')');
}

function tableEdit(obj, type, event, callback, maxNum){
    console.log("1:" + obj.value);
    obj.value = obj.value.trim();
    console.log("2:" + obj.value);
    switch (type) {
        case 'txt':{
            break;
        }
        case 'num':{
            obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
            console.log("3:" + obj.value);
            obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
            console.log("4:" + obj.value);
            obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
            console.log("5:" + obj.value);
            obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            console.log("6:" + obj.value);
            obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
            console.log("7:" + obj.value);
            break;
        }
        case 'numInteger':{
            obj.value = obj.value.replace(/[^\d]/g,"");
            console.log("3:" + obj.value);
            break;
        }
    }
    if (isNotEmpty(maxNum) && obj.value > new Number(maxNum)){
        obj.value = $(obj)[0].attributes.oldvalue.value;
    }
    console.log("8:" + obj.value);
    $(obj).attr('oldValue', obj.value);
    if (isNotEmpty(callback)) {
        setTimeout(function () {
            eval(callback+'(event, obj.value, $(obj).parent().parent().find(\'td[data-field="serializid"]>div\').text())');
        }, 10);
    }
}

function editMaxlength(field, length) {
    $('input[id="'+field+'"]').attr('maxlength', length.toString());
}

function editOninput(type, field, callback, maxNum) {
    switch (type) {
        case 'txt':{
           break;
        }
        case 'num':{
            if (!isNotEmpty(maxNum)){
                maxNum = 99999999.99;
            }
            break;
        }
        case 'numInteger':{
            if (!isNotEmpty(maxNum)){
                maxNum = 99999999;
            }
            break;
        }
        default:{
            throw new Error("edit类型有误");
        }
    }
    var view = $('input[id="'+field+'"]');
    view.attr({onpaste:"return false",oldValue:view.val()});
    view.attr('oninput', 'edit(this, \''+type+'\', \''+field+'\', \''+callback+'\', \''+maxNum+'\')');
}

function editSimple(obj, type, maxNum){
    edit(obj,type,'','',maxNum, '0');
}

function edit(obj, type, event, callback, maxNum, minNum){
    console.log("1:" + obj.value);
    obj.value = obj.value.trim();
    console.log("2:" + obj.value);
    switch (type) {
        case 'txt':{
            break;
        }
        case 'num':{
            obj.value = obj.value.replace(/[^\d.-]/g,""); //清除"数字"和"."以外的字符
            console.log("3:" + obj.value);
            obj.value = obj.value.replace(/^(\.)/g,""); //验证第一个字符是数字
            console.log("4:" + obj.value);
            obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
            obj.value = obj.value.replace(/\-{2,}/g,"-"); //只保留第一个, 清除多余的
            obj.value = obj.value.replace(/^\-([\d.]+)\-+/g,"-$1"); //清除末尾负号
            console.log("5:" + obj.value);
            obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            console.log("6:" + obj.value);
            obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
            console.log("7:" + obj.value);
            break;
        }
        case 'numInteger':{
            obj.value = obj.value.replace(/[^\d]/g,"");
            console.log("3:" + obj.value);
            break;
        }
    }
    if ((isNotEmpty(maxNum) && obj.value > new Number(maxNum)) || isNotEmpty(minNum) && obj.value < new Number(minNum)){
        if ($(obj)[0].attributes.oldvalue){
            obj.value = $(obj)[0].attributes.oldvalue.value;
        }else {
            obj.value = minNum||0;
        }
    }
    var _val = obj.value;
    console.log("8:" + obj.value);
    $(obj).attr('oldValue', obj.value);
    if (isNotEmpty(callback)) {
        setTimeout(function () {
            eval(callback+'(event, _val)');
        }, 10);
    }
}

/**
 * 列表更多按钮点击无效，是因为点击的不是表格里的元素，因此模拟点击表格里的就好了，声明全局事件处理
 */
function moreButtonsEvent(){
    // 更多弹窗里的按钮
    $(document).on('click','.layui-table-tips-main a',function(){
        var layEvent = $(this).attr("lay-event");
        var moreBtnIndex = $(this).attr("more-btn-index");
        // 模拟点击表格里真正的按钮，触发layer.table的事件
        $(`.laytable-cell-1-0-0 [lay-event=${layEvent}][more-btn-index=${moreBtnIndex}]:eq(0)`).click();
        return false;
    })
}
$(function (){
    moreButtonsEvent()
});


function tableEditOninputNumIntegerRange(field, min, max) {
    $('td[data-field="' + field + '"]>input.layui-table-edit').attr('oninput', 'edit(this, \'numInteger\', \''+field+'\', null, \''+max+'\', \''+min+'\')');
}

// function callbackDefault(event, _val) {
//     var class_name = 'edit-'+event;
//     var edit = $('.'+class_name);
//     var _index = edit.parent().parent().attr('data-index');
//     var table = edit.parent().parent().parent().parent();
//     var limit = table.find('span[class="layui-laypage-limits"]').find('option:selected').val();
//     var page = table.find('em[class="layui-laypage-em"]').next().html();
//     var index = (Number(page)-1)*Number(limit)+Number(_index);
//     debugger
//     if (dataLst.length > index) {
//         dataLst[index][event] = _val;
//     }
// }

/**
 *
 * @param tableId
 * @param fieldId
 * @param placeholder
 * @param inputType txt|num|numInteger
 * @param maxVal
 * @param maxLength
 * @param callback
 */
function initTableInputEdit(tableId, fieldId, placeholder, inputType, dataLst, maxVal, maxLength, callback) {
    // var table = $('div[lay-id="billLstid"]');
    $(document).on('click', 'div[lay-id="'+tableId+'"] td[data-field="'+fieldId+'"]', function () {
        if ($(this).find('input').length > 0) {
            return;
        }
        var _this = $(this);
        var class_name = 'edit-'+fieldId;
        var value = $(this).find('div').text();
        $(this).append('<input type="text" class="layui-input layui-table-edit '+class_name+'" placeholder="'+placeholder+'" value="'+value+'"/>');
        var edit = $('.'+class_name);
        edit.focus();
        setTimeout(() => {
            edit[0].setSelectionRange(value.length, value.length);
        }, 0);
        $(document).on('blur', '.edit-'+fieldId+'', function () {
            $(this).remove();
        })
        if (maxLength != null) {
            edit.attr('maxlength', maxLength.toString());
        }
        var _index = _this.parent().attr('data-index');
        edit.attr('oninput', 'edit(this, \''+inputType+'\', \''+fieldId+'\', \''+callback+'\', \''+maxVal+'\')');
    });
}
/**
 *
 * @param tableId
 * @param fieldId
 * @param inputType date|datetime
 * @param dataLst
 * @param maxVal
 * @param minVal
 * @param callback
 */
function initTableDateEdit(tableId, fieldId, inputType, dataLst, maxVal, minVal, callback) {
    $(document).on('click', 'div[lay-id="'+tableId+'"] td[data-field="'+fieldId+'"]', function () {
        var _this = $(this);
        var txt = _this[0].dataset.content;
        var format = "yyyy-MM-dd";
        if (inputType === 'datetime') {
            format = "yyyy-MM-dd hh:mm:ss";
        }
        if (!txt) {
            var now = new Date();
            txt = now.format(format);
        }
        if (!maxVal) {
            maxVal = new Date('2199-01-01').format(format);
        }
        if (!minVal) {
            minVal = new Date('1900-01-01').format(format);
        }

        var _index = _this.parent().attr('data-index');
        this.firstChild.textContent = txt;
        layui.laydate.render({
            elem: this.firstChild,
            trigger: 'click',
            closeStop: this,
            isInitValue: false,
            value: txt,
            btns: ['now', 'confirm'],
            show: true,
            min: minVal,
            max: maxVal,
            type: inputType,
            done: function (value, date) {
                var currentDate = new Date(value).format(format);
                _this.attr('data-content', currentDate);
                var table = $('div[lay-id="'+tableId+'"]');
                var limit = table.find('span[class="layui-laypage-limits"]').find('option:selected').val();
                var page = table.find('em[class="layui-laypage-em"]').next().html();
                var index = (Number(page)-1)*Number(limit)+Number(_index);
                if(!index){
                    index = _index
                }
                if (dataLst.length > index) {
                    dataLst[index][fieldId] = currentDate;
                    if (isNotEmpty(callback)) {
                        setTimeout(function () {
                            eval(callback+'(index, fieldId, currentDate)');
                        }, 10);
                    }
                }
            },
            ready: function(){//
                _this.attr('data-content', txt);
                var table = $('div[lay-id="'+tableId+'"]');
                var limit = table.find('span[class="layui-laypage-limits"]').find('option:selected').val();
                var page = table.find('em[class="layui-laypage-em"]').next().html();
                var index = (Number(page)-1)*Number(limit)+Number(_index);
                if (dataLst.length > index) {
                    dataLst[index][fieldId] = txt;
                    if (isNotEmpty(callback)) {
                        setTimeout(function () {
                            eval(callback+'(index, fieldId, txt)');
                        }, 10);
                    }
                }
            }
        });
    });
}
